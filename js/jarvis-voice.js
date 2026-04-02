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
                let errorMsg = 'Error: ' + event.error;
                if (event.error === 'not-allowed' || event.error === 'audio-capture') {
                    errorMsg = '🎙️ Izin mikrofon ditolak. Buka Settings browser → izinkan mikrofon untuk situs ini.';
                } else if (event.error === 'network') {
                    errorMsg = '🌐 Tidak ada koneksi internet untuk speech recognition.';
                } else if (event.error === 'no-speech') {
                    errorMsg = '🔇 Tidak ada suara terdeteksi. Coba bicara lebih dekat.';
                }
                window.jarvisUI.updateStatus('Error');
                window.jarvisUI.updateTranscript(errorMsg);
                setTimeout(() => window.jarvisUI.hide(), 4000);
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
            // Mobile requires explicit microphone permission first
            this.requestMicAndStart();
        }
    },

    requestMicAndStart: async function() {
        try {
            // Request microphone permission explicitly (required on mobile browsers)
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                // Stop the stream immediately — we just need the permission grant
                stream.getTracks().forEach(track => track.stop());
            }

            // Now start recognition (permission already granted)
            this.recognition.start();
        } catch(e) {
            console.error('Mic Permission Error:', e);
            if (window.jarvisUI) {
                window.jarvisUI.show();
                window.jarvisUI.updateStatus('Mic Denied');
                window.jarvisUI.updateTranscript('🎙️ Izin mikrofon ditolak. Buka Settings browser → izinkan mikrofon untuk situs ini.');
                setTimeout(() => window.jarvisUI.hide(), 5000);
            } else {
                alert('Izin mikrofon ditolak. Buka Settings browser dan izinkan mikrofon.');
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
