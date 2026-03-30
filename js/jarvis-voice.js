/**
 * JARVIS VOICE LOGIC
 * Handles recording, transcription, and command routing.
 */

window.jarvisVoice = {
    recognition: null,
    isRecording: false,
    synth: window.speechSynthesis,

    init: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'id-ID';
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
            this.isRecording = true;
            if (window.jarvisUI) window.jarvisUI.show();
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const finalTranscript = event.results[i][0].transcript;
                    if (window.jarvisUI) window.jarvisUI.updateTranscript(finalTranscript);
                    this.process(finalTranscript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                    if (window.jarvisUI) window.jarvisUI.updateTranscript(interimTranscript);
                }
            }
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            // Don't hide immediately to allow "Processing" view
            setTimeout(() => {
                if (!this.isRecording && window.jarvisUI) window.jarvisUI.hide();
            }, 3000);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
            this.isRecording = false;
            if (window.jarvisUI) {
                window.jarvisUI.updateStatus('Error: ' + event.error);
                setTimeout(() => window.jarvisUI.hide(), 2000);
            }
        };
    },

    toggle: function() {
        if (!this.recognition) this.init();
        if (!this.recognition) {
            alert('Fitur Voice tidak didukung di browser ini. Gunakan Chrome.');
            return;
        }

        if (this.isRecording) {
            this.recognition.stop();
        } else {
            try {
                this.recognition.start();
            } catch(e) {
                console.error('Recognition Start Error:', e);
            }
        }
    },

    process: async function(transcript) {
        if (!transcript) return;
        
        if (window.jarvisUI) {
            window.jarvisUI.updateStatus('Processing...');
            window.jarvisUI.updateTranscript('Jarvis sedang berpikir...');
        }

        try {
            // Speak pre-processing
            this.speak("Baik, Jarvis laksanakan.");

            // Use the existing command processor from js/ai-commands.js
            if (typeof processAICommand === 'function') {
                const response = await processAICommand(transcript);
                if (window.jarvisUI) {
                    window.jarvisUI.updateStatus('Done');
                    window.jarvisUI.updateTranscript(response || 'Selesai.');
                }
                if (response) this.speak(response);
            } else {
                throw new Error('Command processor not found');
            }
        } catch (error) {
            console.error('Jarvis Processing Error:', error);
            if (window.jarvisUI) window.jarvisUI.updateStatus('Error');
            this.speak("Maaf, saya mengalami kendala sistem.");
        }
    },

    speak: function(text) {
        if (!this.synth) return;
        
        // Cancel existing speech
        this.synth.cancel();

        const utterance = new SpeechUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to find a good Indonesian voice
        const voices = this.synth.getVoices();
        const idVoice = voices.find(v => v.lang.startsWith('id')) || voices.find(v => v.lang.startsWith('ms'));
        if (idVoice) utterance.voice = idVoice;

        this.synth.speak(utterance);
    }
};

// Pre-init to load recognition object
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.jarvisVoice.init();
} else {
    window.addEventListener('DOMContentLoaded', () => window.jarvisVoice.init());
}
