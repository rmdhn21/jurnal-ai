/**
 * JARVIS VOICE HUB UI
 * Manages the Floating Button and the Sci-Fi Overlay.
 */

window.jarvisUI = {
    fab: null,
    overlay: null,
    transcript: null,
    status: null,

    init: function() {
        if (document.getElementById('jarvis-fab')) return; // Already exists

        // Create FAB
        this.fab = document.createElement('div');
        this.fab.id = 'jarvis-fab';
        this.fab.className = 'jarvis-fab';
        this.fab.innerHTML = `
            <span>🎙️</span>
            <div class="neural-pulse"></div>
        `;
        document.body.appendChild(this.fab);

        // Create Overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'jarvis-overlay';
        this.overlay.innerHTML = `
            <div class="neural-core"></div>
            <div id="jarvis-transcript" class="jarvis-transcript">Siap mendengarkan...</div>
            <div id="jarvis-status" class="jarvis-status">Listening</div>
        `;
        document.body.appendChild(this.overlay);

        this.transcript = document.getElementById('jarvis-transcript');
        this.status = document.getElementById('jarvis-status');

        this.fab.addEventListener('click', () => {
             if (window.jarvisVoice) {
                 window.jarvisVoice.toggle();
             }
        });
    },

    show: function() {
        this.overlay.classList.add('active');
        this.updateStatus('Listening');
        this.updateTranscript('Siap mendengarkan...');
    },

    hide: function() {
        this.overlay.classList.remove('active');
    },

    updateTranscript: function(text) {
        if (this.transcript) this.transcript.innerText = text;
    },

    updateStatus: function(text) {
        if (this.status) this.status.innerText = text;
    }
};

// Auto-init for testing or if dashboard is active
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.jarvisUI.init();
} else {
    window.addEventListener('DOMContentLoaded', () => window.jarvisUI.init());
}
