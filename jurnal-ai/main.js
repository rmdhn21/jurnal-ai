// Main application entry point
import { getApiKey, saveApiKey } from './js/storage.js';
import { initJournalUI, renderJournalHistory } from './js/ui/journal.js';
import { initPlannerUI, renderTodoList, renderScheduleList } from './js/ui/planner.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSettings();
    initJournalUI();
    initPlannerUI();

    // Check if API key is set
    if (!getApiKey()) {
        showSettings();
    }
});

// ===== Navigation =====
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetScreen = btn.dataset.screen;

            // Update nav buttons
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update screens
            screens.forEach(screen => {
                screen.classList.remove('active');
                if (screen.id === `${targetScreen}-screen`) {
                    screen.classList.add('active');
                }
            });

            // Refresh data when switching screens
            if (targetScreen === 'planner') {
                renderTodoList();
                renderScheduleList();
            } else if (targetScreen === 'journal') {
                renderJournalHistory();
            }
        });
    });
}

// ===== Settings Modal =====
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const modal = document.getElementById('settings-modal');

    // Open settings
    settingsBtn.addEventListener('click', showSettings);

    // Close settings
    closeSettingsBtn.addEventListener('click', hideSettings);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideSettings();
    });

    // Save settings
    saveSettingsBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            saveApiKey(apiKey);
            hideSettings();
            alert('API key berhasil disimpan!');
        } else {
            alert('Masukkan API key yang valid');
        }
    });

    // Load existing API key
    apiKeyInput.value = getApiKey();
}

function showSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
    document.getElementById('api-key-input').value = getApiKey();
}

function hideSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}
