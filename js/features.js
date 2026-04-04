// ===== VOICE INPUT MODULE =====
let recognition;
let isRecording = false;
let speechMode = 'journal'; // 'journal' or 'jarvis' (universal)

function initVoiceInput() {
    const journalMicBtn = document.getElementById('mic-btn');
    const jarvisQuickMicBtn = document.querySelector('.jarvis-quick-actions .qa-btn:first-child'); 
    const jarvisGlobalFab = document.getElementById('jarvis-global-fab');
    const jarvisInputMic = document.getElementById('jarvis-input-mic');

    const setupPTT = (btn, mode) => {
        if (!btn) return;
        let pressTimer;
        let isHolding = false;

        const startHold = (e) => {
            // Only handle primary touch/mouse
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            
            // For Global FAB: Switch screen before recording starts or immediately
            if (btn.id === 'jarvis-global-fab') {
                if (typeof navigateToScreen === 'function') navigateToScreen('jarvis');
            }
            
            // Warm up voice for Safari on immediate touch
            if (window.jarvisVoice) window.jarvisVoice.prepare();
            
            isHolding = false;
            pressTimer = setTimeout(() => {
                isHolding = true;
                if (window.jarvisVoice && !window.jarvisVoice.isRecording) {
                    // Small vibration feedback
                    if ("vibrate" in navigator) navigator.vibrate(25);
                    window.jarvisVoice.toggle(mode);
                }
            }, 350); // Threshold for hold
        };

        const endHold = (e) => {
            clearTimeout(pressTimer);
            if (isHolding) {
                if (window.jarvisVoice && window.jarvisVoice.isRecording) {
                    window.jarvisVoice.forceStop();
                }
                isHolding = false;
                if (e.cancelable) e.preventDefault(); // Prevent accidental clicks/scrolling after hold
            }
        };

        // Switch to Pointer Events for iOS/Safari cross-compatibility
        btn.addEventListener('pointerdown', startHold);
        btn.addEventListener('pointerup', endHold);
        btn.addEventListener('pointerleave', endHold);
        btn.addEventListener('pointercancel', endHold);

        // Click handles standard toggle (short tap)
        btn.addEventListener('click', (e) => {
            if (isHolding) {
                e.preventDefault();
                return;
            }
            if (btn.id === 'jarvis-global-fab') {
                if (typeof navigateToScreen === 'function') navigateToScreen('jarvis');
            }
            if (window.jarvisVoice) {
                window.jarvisVoice.toggle(mode);
            } else {
                alert('Voice system slow to load. Please wait.');
            }
        });
    };

    setupPTT(journalMicBtn, 'journal');
    setupPTT(jarvisQuickMicBtn, 'command');
    setupPTT(jarvisGlobalFab, 'command');
    setupPTT(jarvisInputMic, 'command');
}

function startJarvisVoice() {
    // Navigate to Jarvis screen if not already there
    if (typeof navigateToScreen === 'function') {
        navigateToScreen('jarvis');
    }

    if (window.jarvisVoice) {
        window.jarvisVoice.toggle('command');
        if (typeof renderAssistantMessage === 'function') {
            renderAssistantMessage('Silakan sebutkan perintah Anda ke Jarvis...', 'bot');
        }
    } else {
        alert('Voice system slow to load. Please wait.');
    }
}

// These are now handled by jarvis-voice.js
function toggleRecording() { if (window.jarvisVoice) window.jarvisVoice.toggle(speechMode); }
function startRecording() { if (window.jarvisVoice && window.jarvisVoice.recognition) window.jarvisVoice.recognition.start(); }
function stopRecording() { if (window.jarvisVoice && window.jarvisVoice.recognition) window.jarvisVoice.recognition.stop(); }

function updateMicUI(recording) {
    // This is now partially handled by jarvis-voice.js onstart/onend, 
    // but we can keep it for manual UI updates if needed.
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
        micBtn.innerHTML = recording ? '⏹️' : '🎤';
        micBtn.classList.toggle('mic-active', recording);
    }
}

// ===== SECURITY MODULE (PIN LOCK) =====
let currentPinInput = '';
let isSettingUpPin = false;
let tempNewPin = '';

function initSecurity() {
    const savedPin = localStorage.getItem(STORAGE_KEYS.PIN);
    const lockScreen = document.getElementById('app-lock-screen');
    const keypad = document.querySelector('.pin-keypad');

    if (savedPin) {
        if (lockScreen) lockScreen.classList.remove('hidden');
    }

    if (keypad) {
        keypad.addEventListener('click', (e) => {
            if (e.target.classList.contains('pin-btn')) {
                const value = e.target.dataset.value;
                handlePinInput(value);
            }
        });
    }

    const pinToggle = document.getElementById('pin-lock-toggle');
    const changePinBtn = document.getElementById('change-pin-btn');
    const pinSetupSection = document.getElementById('pin-setup-section');

    if (pinToggle) {
        pinToggle.checked = !!savedPin;
        if (savedPin && pinSetupSection) pinSetupSection.classList.remove('hidden');

        pinToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (!localStorage.getItem(STORAGE_KEYS.PIN)) {
                    startPinSetup();
                }
            } else {
                if (localStorage.getItem(STORAGE_KEYS.PIN)) {
                    e.target.checked = true;
                    if (confirm('Matikan PIN Lock?')) {
                        localStorage.removeItem(STORAGE_KEYS.PIN);
                        e.target.checked = false;
                        if (pinSetupSection) pinSetupSection.classList.add('hidden');
                        alert('PIN Lock dimatikan.');
                    }
                }
            }
        });
    }

    if (changePinBtn) {
        changePinBtn.addEventListener('click', () => {
            startPinSetup(true);
        });
    }
}

function handlePinInput(value) {
    if (value === 'clear') {
        currentPinInput = '';
    } else if (value === 'back') {
        currentPinInput = currentPinInput.slice(0, -1);
    } else {
        if (currentPinInput.length < 4) {
            currentPinInput += value;
        }
    }

    updatePinDisplay();

    if (currentPinInput.length === 4) {
        setTimeout(() => {
            if (isSettingUpPin) {
                processPinSetupStep();
            } else {
                validatePin();
            }
        }, 100);
    }
}

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < currentPinInput.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
        dot.classList.remove('error');
    });
}

function validatePin() {
    const savedPin = localStorage.getItem(STORAGE_KEYS.PIN);
    if (currentPinInput === savedPin) {
        const lockScreen = document.getElementById('app-lock-screen');
        if (lockScreen) {
            lockScreen.classList.add('hidden');
            currentPinInput = '';
            updatePinDisplay();
        }
    } else {
        showPinError();
    }
}

function showPinError() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach(dot => dot.classList.add('error'));

    setTimeout(() => {
        currentPinInput = '';
        updatePinDisplay();
    }, 500);
}

function startPinSetup(isChange = false) {
    isSettingUpPin = isChange ? 'change_old' : 'set';
    currentPinInput = '';
    tempNewPin = '';

    const lockScreen = document.getElementById('app-lock-screen');
    const lockTitle = document.getElementById('lock-title');

    if (lockScreen && lockTitle) {
        lockScreen.classList.remove('hidden');
        lockTitle.textContent = isChange ? 'Masukkan PIN Lama' : 'Buat PIN Baru (4 angka)';
    }
}

function processPinSetupStep() {
    const lockTitle = document.getElementById('lock-title');
    const lockScreen = document.getElementById('app-lock-screen');
    const pinSetupSection = document.getElementById('pin-setup-section');
    const pinToggle = document.getElementById('pin-lock-toggle');

    if (isSettingUpPin === 'change_old') {
        const savedPin = localStorage.getItem(STORAGE_KEYS.PIN);
        if (currentPinInput === savedPin) {
            isSettingUpPin = 'set';
            currentPinInput = '';
            updatePinDisplay();
            lockTitle.textContent = 'Masukkan PIN Baru';
        } else {
            showPinError();
        }
    } else if (isSettingUpPin === 'set') {
        tempNewPin = currentPinInput;
        isSettingUpPin = 'confirm';
        currentPinInput = '';
        updatePinDisplay();
        lockTitle.textContent = 'Konfirmasi PIN Baru';
    } else if (isSettingUpPin === 'confirm') {
        if (currentPinInput === tempNewPin) {
            localStorage.setItem(STORAGE_KEYS.PIN, currentPinInput);
            alert('PIN berhasil disimpan!');

            isSettingUpPin = false;
            currentPinInput = '';
            tempNewPin = '';
            updatePinDisplay();
            lockScreen.classList.add('hidden');
            lockTitle.textContent = 'Masukkan PIN';

            if (pinSetupSection) pinSetupSection.classList.remove('hidden');
            if (pinToggle) pinToggle.checked = true;
        } else {
            alert('PIN tidak cocok. Ulangi.');
            isSettingUpPin = 'set';
            currentPinInput = '';
            tempNewPin = '';
            updatePinDisplay();
            lockTitle.textContent = 'Buat PIN Baru (4 angka)';
        }
    }
}

// ===== EXPORT DATA MODULE =====
function initExportCSV() {
    const exportFinanceBtn = document.getElementById('export-finance-csv-btn');
    const exportJournalBtn = document.getElementById('export-journal-csv-btn');
    const exportHabitsBtn = document.getElementById('export-habits-csv-btn');

    if (exportFinanceBtn) exportFinanceBtn.addEventListener('click', () => exportToCSV('finance'));
    if (exportJournalBtn) exportJournalBtn.addEventListener('click', () => exportToCSV('journal'));
    if (exportHabitsBtn) exportHabitsBtn.addEventListener('click', () => exportToCSV('habits'));
}

function exportToCSV(type) {
    let data = [];
    let filename = `jurnal-ai-${type}-${formatShortDate(new Date()).replace(/ /g, '-')}.csv`;
    let headers = [];

    if (type === 'finance') {
        const transactions = getTransactions();
        if (transactions.length === 0) { alert('Belum ada data keuangan untuk diexport.'); return; }
        headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Description', 'Wallet'];
        data = transactions.map(t => {
            const wallet = getWallets().find(w => w.id === t.walletId);
            return { ID: t.id, Date: t.date, Type: t.type, Category: t.category, Amount: t.amount, Description: t.description || '-', Wallet: wallet ? wallet.name : '-' };
        });
    } else if (type === 'journal') {
        const journals = getJournals();
        if (journals.length === 0) { alert('Belum ada jurnal untuk diexport.'); return; }
        headers = ['ID', 'Date', 'Mood', 'Tags', 'Content'];
        data = journals.map(j => ({ ID: j.id, Date: j.date, Mood: j.mood, Tags: (j.tags || []).join('; '), Content: j.content || '' }));
    } else if (type === 'habits') {
        const habits = getHabits();
        if (habits.length === 0) { alert('Belum ada habits untuk diexport.'); return; }
        headers = ['ID', 'Name', 'Streak', 'CreatedAt'];
        data = habits.map(h => ({ ID: h.id, Name: h.name, Streak: calculateStreak(h), CreatedAt: h.createdAt }));
    }

    if (data.length > 0) downloadCSV(data, headers, filename);
}

function downloadCSV(data, headers, filename) {
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            let valStr = String(row[header] || '');
            valStr = valStr.replace(/"/g, '""');
            return `"${valStr}"`;
        });
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// ===== PRAYER TIMES MODULE =====
async function initPrayerTimes() {
    const settings = getSettings(); // Defined in storage.js
    const city = settings.prayerCity || 'Jakarta';
    const country = 'Indonesia'; // Default
    const method = 20; // Kemenag RI (approximate or standard) or use Default

    const todayStr = new Date().toISOString().split('T')[0];
    const cachedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAYER_DATA) || '{}');

    // Return cached if valid for today
    if (cachedData.key === `${city}-${todayStr}` && cachedData.timings) {
        console.log('Using cached prayer times');
        return;
    }

    console.log(`Fetching prayer times for ${city}...`);
    try {
        // Using Aladhan API
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${todayStr}?city=${city}&country=${country}&method=11`); // Method 11 is Majlis Ugama Islam Singapura, often good for region, or 20 for Kemenag if available in list. Let's stick to standard/auto.
        // Actually Method 20 is Kemenag but sometimes ID changes. Let's use default or 11.

        const data = await response.json();

        if (data.code === 200 && data.data && data.data.timings) {
            const timings = data.data.timings;

            const toSave = {
                key: `${city}-${todayStr}`,
                timings: timings,
                meta: data.data.meta
            };

            localStorage.setItem(STORAGE_KEYS.PRAYER_DATA, JSON.stringify(toSave));
            console.log('Prayer times saved.');

            // Trigger UI update if planner exists
            if (typeof renderScheduleList === 'function') renderScheduleList();

            // Trigger Dashboard update if exists
            if (typeof updateDashboardPrayerCard === 'function') {
                updateDashboardPrayerCard();
                /* global startPrayerCountdown */ // hint for linter
                // No need to restart countdown explicitly if updateDashboardPrayerCard handles state, 
                // but startPrayerCountdown is separate. Let's just update the card content is enough.
            }
        } else {
            console.warn('Invalid prayer data response');
        }
    } catch (e) {
        console.error('Error fetching prayer times:', e);
    }
}
