let timeTrackerState = {
    activeTimers: {
        sleep: null,
        workout: null,
        study: null
    },
    logs: {} // e.g. "2023-10-25": { sleep: 28800000, workout: 0, study: 0 }
};

let timeTrackerIntervals = {};

function initTimeTracker() {
    const saved = localStorage.getItem('jurnal_ai_time_tracker_data');
    if (saved) {
        try {
            timeTrackerState = JSON.parse(saved);
        } catch(e) {
            console.error("Failed to parse time tracker data", e);
        }
    }
    
    // Resume active timers
    for (const type of ['sleep', 'workout', 'study']) {
        if (timeTrackerState.activeTimers[type]) {
            startTimeTrackerInterval(type);
        }
    }
    
    renderTimeTrackerUI();
}

function saveTimeTracker() {
    localStorage.setItem('jurnal_ai_time_tracker_data', JSON.stringify(timeTrackerState));
    if (typeof updateDashboardReminders === 'function') updateDashboardReminders();
    if (typeof calculateAIForecast === 'function') calculateAIForecast();
}

function toggleTimer(type) {
    if (timeTrackerState.activeTimers[type]) {
        // Stop timer
        const startTime = timeTrackerState.activeTimers[type];
        const elapsed = Date.now() - startTime;
        
        timeTrackerState.activeTimers[type] = null;
        logTime(type, elapsed);
        
        if (timeTrackerIntervals[type]) {
            clearInterval(timeTrackerIntervals[type]);
            timeTrackerIntervals[type] = null;
        }
        if (typeof addXP === 'function') addXP(5, `Tracked ${type}`);
    } else {
        // Start timer
        timeTrackerState.activeTimers[type] = Date.now();
        startTimeTrackerInterval(type);
    }
    
    saveTimeTracker();
    renderTimeTrackerUI();
}

function startTimeTrackerInterval(type) {
    if (timeTrackerIntervals[type]) clearInterval(timeTrackerIntervals[type]);
    timeTrackerIntervals[type] = setInterval(() => {
        updateTimerDisplay(type);
    }, 1000);
}

function updateTimerDisplay(type) {
    const displayEl = document.getElementById(`tt-display-${type}`);
    if (!displayEl) return;
    
    if (timeTrackerState.activeTimers[type]) {
        const elapsed = Date.now() - timeTrackerState.activeTimers[type];
        displayEl.textContent = formatMs(elapsed);
        displayEl.classList.add('text-primary');
    } else {
        displayEl.textContent = "00:00:00";
        displayEl.classList.remove('text-primary');
    }
}

function logTime(type, ms, dateStr = null) {
    if (!dateStr) {
        const now = new Date();
        dateStr = now.toISOString().split('T')[0];
    }
    
    if (!timeTrackerState.logs[dateStr]) {
        timeTrackerState.logs[dateStr] = { sleep: 0, workout: 0, study: 0 };
    }
    
    timeTrackerState.logs[dateStr][type] = (timeTrackerState.logs[dateStr][type] || 0) + ms;
    saveTimeTracker();
}

function formatMs(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Manual Input Logic
function addManualTime(type) {
    const startStr = document.getElementById(`tt-manual-start-${type}`).value;
    const endStr = document.getElementById(`tt-manual-end-${type}`).value;
    
    if (!startStr || !endStr) {
        if (typeof showNotification === 'function') {
            showNotification('Harap isi jam mulai dan selesai!', 'error');
        } else {
            alert('Harap isi jam mulai dan selesai!');
        }
        return;
    }
    
    // Parse times (assuming same day, or cross-midnight if end < start)
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    
    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    
    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60; // Crosses midnight
    }
    
    const diffMs = (endMinutes - startMinutes) * 60 * 1000;
    logTime(type, diffMs);
    
    if (typeof showNotification === 'function') {
        showNotification(`Berhasil menambah ${formatMs(diffMs)} ke ${type}`, 'success');
    }
    
    document.getElementById(`tt-manual-start-${type}`).value = '';
    document.getElementById(`tt-manual-end-${type}`).value = '';
    renderTimeTrackerUI();
}

function renderTimeTrackerUI() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const todayLogs = timeTrackerState.logs[dateStr] || { sleep: 0, workout: 0, study: 0 };
    
    for (const type of ['sleep', 'workout', 'study']) {
        // Update Button
        const btn = document.getElementById(`tt-btn-${type}`);
        if (btn) {
            if (timeTrackerState.activeTimers[type]) {
                btn.innerHTML = '🛑 Stop';
                btn.classList.add('btn-danger');
            } else {
                btn.innerHTML = '▶️ Start';
                btn.classList.remove('btn-danger');
            }
        }
        
        // Update Display
        updateTimerDisplay(type);
        
        // Update Total Today
        const totalEl = document.getElementById(`tt-total-${type}`);
        if (totalEl) {
            totalEl.textContent = formatMs(todayLogs[type] || 0);
        }
    }
}
