/**
 * JARVIS VOICE LOGIC
 * Handles recording, transcription, and command routing.
 */

window.jarvisVoice = {
    recognition: null,
    isRecording: false,
    synth: window.speechSynthesis,

    mode: 'command', // 'command' or 'journal'

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
            if (this.mode === 'command' && window.jarvisUI) window.jarvisUI.show();
            if (this.mode === 'journal') {
                const statusText = document.getElementById('recording-status');
                if (statusText) statusText.classList.remove('hidden');
                if (typeof updateMicUI === 'function') updateMicUI(true);
            }
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const finalTranscript = event.results[i][0].transcript;
                    if (this.mode === 'command') {
                        if (window.jarvisUI) window.jarvisUI.updateTranscript(finalTranscript);
                        this.process(finalTranscript);
                    } else if (this.mode === 'journal') {
                        this.handleJournalResult(finalTranscript);
                    }
                } else {
                    interimTranscript += event.results[i][0].transcript;
                    if (this.mode === 'command' && window.jarvisUI) window.jarvisUI.updateTranscript(interimTranscript);
                    if (this.mode === 'journal') {
                         // Optional: show interim in journal field or status
                    }
                }
            }
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            if (this.mode === 'command') {
                setTimeout(() => {
                    if (!this.isRecording && window.jarvisUI) window.jarvisUI.hide();
                }, 3000);
            } else {
                const statusText = document.getElementById('recording-status');
                if (statusText) statusText.classList.add('hidden');
                if (typeof updateMicUI === 'function') updateMicUI(false);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
            this.isRecording = false;
            
            let errorMsg = 'Error: ' + event.error;
            if (event.error === 'not-allowed' || event.error === 'audio-capture') {
                errorMsg = '🎙️ Izin mikrofon ditolak. Buka Settings browser → izinkan mikrofon untuk situs ini.';
            } else if (event.error === 'no-speech') {
                errorMsg = '🔇 Tidak ada suara terdeteksi. Bicara lebih dekat.';
            }

            if (this.mode === 'command' && window.jarvisUI) {
                window.jarvisUI.updateStatus('Error');
                window.jarvisUI.updateTranscript(errorMsg);
                setTimeout(() => window.jarvisUI.hide(), 4000);
            } else if (this.mode === 'journal') {
                const statusText = document.getElementById('recording-status');
                if (statusText) statusText.innerText = 'Mic Error: ' + event.error;
            }
        };
    },

    toggle: function(mode = 'command') {
        this.mode = mode;
        if (!this.recognition) this.init();
        if (!this.recognition) {
            alert('Voice not supported on this device.');
            return;
        }

        if (this.isRecording) {
            this.recognition.stop();
        } else {
            // Immediate UI feedback
            if (typeof updateMicUI === 'function') updateMicUI(true);
            
            // iOS CRITICAL: Must start synchronously in click handler
            try {
                this.recognition.start();
                console.log("🎤 Recognition started (mode: " + mode + ")");
            } catch (e) {
                console.error("Start failed:", e);
                if (typeof updateMicUI === 'function') updateMicUI(false);
            }
        }
    },

    handleJournalResult: function(transcript) {
        const journalInput = document.getElementById('journal-input');
        if (journalInput) {
            const currentText = journalInput.value;
            const separator = currentText.length > 0 && !currentText.endsWith(' ') ? ' ' : '';
            journalInput.value = currentText + separator + transcript;
            journalInput.dispatchEvent(new Event('input'));
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

        const utterance = new SpeechSynthesisUtterance(text);
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
