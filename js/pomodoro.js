// ===== POMODORO TIMER =====
const POMODORO_CONFIG = {
    focusTime: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    sessionsBeforeLongBreak: 4
};

let pomodoroState = {
    isRunning: false,
    isPaused: false,
    timeRemaining: POMODORO_CONFIG.focusTime,
    currentSession: 1,
    isBreak: false,
    todayCount: 0,
    intervalId: null
};

function initPomodoroTimer() {
    const savedCount = localStorage.getItem('pomodoro_today_count');
    const savedDate = localStorage.getItem('pomodoro_today_date');
    const today = getTodayString();

    if (savedDate === today && savedCount) {
        pomodoroState.todayCount = parseInt(savedCount) || 0;
    } else {
        localStorage.setItem('pomodoro_today_date', today);
        localStorage.setItem('pomodoro_today_count', '0');
    }

    updatePomodoroDisplay();

    document.getElementById('timer-start')?.addEventListener('click', startTimer);
    document.getElementById('timer-pause')?.addEventListener('click', pauseTimer);
    document.getElementById('timer-reset')?.addEventListener('click', resetTimer);

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const time = parseInt(btn.dataset.time);
            const modeName = btn.textContent;

            const labelEl = document.getElementById('timer-label');
            if (labelEl) labelEl.textContent = modeName;

            setPomodoroMode(time);

            document.querySelectorAll('.mode-btn').forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        });
    });
}

function setPomodoroMode(minutes) {
    if (pomodoroState.intervalId) clearInterval(pomodoroState.intervalId);

    pomodoroState.isRunning = false;
    pomodoroState.isPaused = false;
    pomodoroState.timeRemaining = minutes * 60;

    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;

    updatePomodoroDisplay();
}

function startTimer() {
    if (pomodoroState.isRunning) return;

    pomodoroState.isRunning = true;
    pomodoroState.isPaused = false;

    document.getElementById('timer-start').disabled = true;
    document.getElementById('timer-pause').disabled = false;

    pomodoroState.intervalId = setInterval(() => {
        if (pomodoroState.timeRemaining > 0) {
            pomodoroState.timeRemaining--;
            updatePomodoroDisplay();
        } else {
            timerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    if (!pomodoroState.isRunning) return;

    pomodoroState.isRunning = false;
    pomodoroState.isPaused = true;

    clearInterval(pomodoroState.intervalId);

    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;
}

function resetTimer() {
    clearInterval(pomodoroState.intervalId);

    pomodoroState.isRunning = false;
    pomodoroState.isPaused = false;
    pomodoroState.timeRemaining = pomodoroState.isBreak ?
        (pomodoroState.currentSession % POMODORO_CONFIG.sessionsBeforeLongBreak === 0 ?
            POMODORO_CONFIG.longBreak : POMODORO_CONFIG.shortBreak) :
        POMODORO_CONFIG.focusTime;

    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;

    updatePomodoroDisplay();
}

function timerComplete() {
    clearInterval(pomodoroState.intervalId);
    pomodoroState.isRunning = false;

    if (Notification.permission === 'granted') {
        const title = pomodoroState.isBreak ? '⏰ Istirahat Selesai!' : '🍅 Pomodoro Selesai!';
        const body = pomodoroState.isBreak ? 'Kembali fokus!' : 'Waktunya istirahat!';
        new Notification(title, { body, icon: '🍅' });
    }

    if (!pomodoroState.isBreak) {
        pomodoroState.todayCount++;
        pomodoroState.currentSession++;
        localStorage.setItem('pomodoro_today_count', pomodoroState.todayCount.toString());
    }

    pomodoroState.isBreak = !pomodoroState.isBreak;

    if (pomodoroState.isBreak) {
        pomodoroState.timeRemaining =
            (pomodoroState.currentSession - 1) % POMODORO_CONFIG.sessionsBeforeLongBreak === 0 ?
                POMODORO_CONFIG.longBreak : POMODORO_CONFIG.shortBreak;
    } else {
        pomodoroState.timeRemaining = POMODORO_CONFIG.focusTime;
    }

    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;

    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroState.timeRemaining / 60);
    const seconds = pomodoroState.timeRemaining % 60;

    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    const labelEl = document.getElementById('timer-label');
    const sessionEl = document.getElementById('pomodoro-session');
    const countEl = document.getElementById('pomodoro-count');

    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    if (labelEl) {
        labelEl.textContent = pomodoroState.isBreak ? 'Istirahat' : 'Fokus';
        labelEl.className = `timer-label ${pomodoroState.isBreak ? 'break' : 'focus'}`;
    }
    if (sessionEl) sessionEl.textContent = `Session ${pomodoroState.currentSession}`;
    if (countEl) countEl.textContent = pomodoroState.todayCount;
}
