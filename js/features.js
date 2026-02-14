// ===== VOICE INPUT MODULE =====
let recognition;
let isRecording = false;

function initVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Voice input not supported in this browser.');
        const micBtn = document.getElementById('mic-btn');
        if (micBtn) micBtn.style.display = 'none';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';

    recognition.onstart = function () {
        isRecording = true;
        updateMicUI(true);
    };

    recognition.onend = function () {
        isRecording = false;
        updateMicUI(false);
    };

    recognition.onresult = function (event) {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }

        const journalInput = document.getElementById('journal-input');
        if (journalInput && finalTranscript) {
            const currentText = journalInput.value;
            const separator = currentText.length > 0 && !currentText.endsWith(' ') ? ' ' : '';
            journalInput.value = currentText + separator + finalTranscript;
            journalInput.dispatchEvent(new Event('input'));
        }
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error', event.error);
        stopRecording();
        if (event.error === 'not-allowed') {
            alert('Akses mikrofon ditolak. Izinkan akses untuk menggunakan fitur ini.');
        }
    };

    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
        micBtn.addEventListener('click', toggleRecording);
    }
}

function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    try { recognition.start(); } catch (e) { console.error('Failed to start recording:', e); }
}

function stopRecording() {
    try { recognition.stop(); } catch (e) { console.error('Failed to stop recording:', e); }
}

function updateMicUI(recording) {
    const micBtn = document.getElementById('mic-btn');
    const statusText = document.getElementById('recording-status');

    if (micBtn) {
        if (recording) {
            micBtn.classList.add('mic-active');
            micBtn.innerHTML = '⏹️';
            micBtn.title = 'Stop Rekam';
        } else {
            micBtn.classList.remove('mic-active');
            micBtn.innerHTML = '🎤';
            micBtn.title = 'Rekam Suara';
        }
    }

    if (statusText) {
        if (recording) {
            statusText.classList.remove('hidden');
        } else {
            statusText.classList.add('hidden');
        }
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
