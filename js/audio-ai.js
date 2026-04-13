/**
 * HSE Meeting Transcriber & Audio AI Logic
 * Focuses on high-fidelity full-text transcription using Gemini 1.5 Flash.
 */

const AudioAI = {
    mediaRecorder: null,
    audioChunks: [],
    recordTimer: null,
    startTime: null,
    isRecording: false,

    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        const fileInput = document.getElementById('audio-file-input');
        const uploadContainer = document.getElementById('audio-upload-container');
        const recordBtn = document.getElementById('record-btn');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (uploadContainer) {
            uploadContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadContainer.classList.add('dragover');
            });

            uploadContainer.addEventListener('dragleave', () => {
                uploadContainer.classList.remove('dragover');
            });

            uploadContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadContainer.classList.remove('dragover');
                if (e.dataTransfer.files.length > 0) {
                    this.processAudioFile(e.dataTransfer.files[0]);
                }
            });
        }

        if (recordBtn) {
            recordBtn.addEventListener('click', () => this.toggleRecording());
        }
    },

    async handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            await this.processAudioFile(file);
        }
    },

    async processAudioFile(file) {
        if (!file.type.startsWith('audio/')) {
            alert('Mohon pilih file audio (MP3, WAV, M4A).');
            return;
        }

        this.showProcessing(true, 'Reading audio file...');
        
        try {
            const base64Data = await this.fileToBase64(file);
            await this.transcribeWithAI(base64Data, file.type);
        } catch (error) {
            console.error('File processing error:', error);
            alert('Gagal memproses file audio.');
            this.showProcessing(false);
        }
    },

    async toggleRecording() {
        if (this.isBusy) return;
        this.isBusy = true;
        
        try {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                await this.startRecording();
            }
        } catch (err) {
            console.error('Toggle error:', err);
        } finally {
            this.isBusy = false;
        }
    },

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.audioChunks.push(e.data);
            };

            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.showProcessing(true, 'Menganalisis rekaman meeting...');
                const base64Data = await this.fileToBase64(audioBlob);
                await this.transcribeWithAI(base64Data, 'audio/webm');
                
                // Final cleanup of tracks
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.startTime = Date.now();
            this.updateTimer();
            
            const btn = document.getElementById('record-btn');
            btn.innerHTML = '⏹️';
            btn.classList.add('recording-pulse');
            document.getElementById('recorder-hint').innerText = 'Sedang merekam... Klik tombol STOP jika sudah selesai.';
            
        } catch (error) {
            console.error('Microphone error:', error);
            alert('Tidak dapat mengakses microphone. Pastikan izin diberikan dan Anda menggunakan http://localhost atau HTTPS.');
            this.isRecording = false;
        }
    },

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.isRecording = false;
            clearInterval(this.recordTimer);
            
            const btn = document.getElementById('record-btn');
            btn.innerHTML = '🎙️';
            btn.classList.remove('recording-pulse');
            document.getElementById('recorder-timer').innerText = '00:00';
            document.getElementById('recorder-hint').innerText = 'Tekan mic untuk mulai merekam memo HSE.';
        }
    },

    updateTimer() {
        this.recordTimer = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const seconds = Math.floor((elapsed / 1000) % 60);
            const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
            document.getElementById('recorder-timer').innerText = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    },

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    },

    async transcribeWithAI(base64Data, mimeType) {
        // Use the correct key name defined in storage.js
        const apiKey = localStorage.getItem('jurnal_ai_gemini_key');
        if (!apiKey) {
            alert('⚠️ API Key Gemini belum diatur di Settings.');
            this.showProcessing(false);
            return;
        }

        const container = document.getElementById('transcription-result-container');
        const textElement = document.getElementById('transcription-text');
        const loadingScreen = document.getElementById('transcription-loading');

        container.classList.add('hidden');
        loadingScreen.classList.remove('hidden');
        this.showProcessing(false); // Hide upload box status

        const prompt = "Please provide an accurate, high-fidelity FULL TEXT transcription of this HSE (Health, Safety, and Environment) meeting or voice memo. Focus on technical terms relevant to Oil & Gas operations in Indonesia/English mix. If there are multiple speakers, try to distinguish them. Do not summarize, I need the FULL transcript.";

        try {
            const response = await fetch(`${window.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent'}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: mimeType, data: base64Data } }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.1, // Low temperature for high factual accuracy
                        topP: 0.95
                    }
                })
            });

            if (!response.ok) throw new Error('AI API Error');

            const data = await response.json();
            const transcript = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (transcript) {
                textElement.innerText = transcript;
                container.classList.remove('hidden');
                // Scroll to result
                container.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error('Empty transcript returned');
            }
        } catch (error) {
            console.error('Transcription error:', error);
            alert('Gagal mentranskrip audio. Pastikan file tidak terlalu besar dan API Key benar.');
        } finally {
            loadingScreen.classList.add('hidden');
        }
    },

    showProcessing(show, text = '') {
        const idle = document.getElementById('upload-idle');
        const processing = document.getElementById('upload-processing');
        const statusText = document.getElementById('upload-status-text');

        if (show) {
            idle.classList.add('hidden');
            processing.classList.remove('hidden');
            statusText.innerText = text;
        } else {
            idle.classList.remove('hidden');
            processing.classList.add('hidden');
        }
    }
};

// Global utilities requested by HTML
function copyTranscriptionText() {
    const text = document.getElementById('transcription-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Transkrip berhasil disalin!');
    });
}

function useTranscriptInJSA() {
    const text = document.getElementById('transcription-text').innerText;
    // We can pre-fill the JSA input if we jump to that screen
    const jsaInput = document.getElementById('jsa-job-desc');
    if (jsaInput) {
        jsaInput.value = text;
        if (typeof navigateToJSAGenerator === 'function') {
            navigateToJSAGenerator();
        } else if (typeof navigateToSubscreen === 'function') {
            navigateToSubscreen('english-hse'); // JSA is usually here
        }
    }
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
    AudioAI.init();
});
