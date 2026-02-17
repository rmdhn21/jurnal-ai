// ===== DASHBOARD MODULE =====
function initDashboard() {
    updateDashboardStats();
    updateUpcomingSchedules();
    updateTodayReminders();
    initMoodChart();

    updateDashboardPrayerCard(); // Initial render
    setInterval(updateDashboardPrayerCard, 60000); // Update every minute for next prayer check

    // Start distinct countdown interval
    startPrayerCountdown();

    document.getElementById('get-daily-insight-btn').addEventListener('click', getDailyInsight);
}

// Global variable for countdown interval
let prayerCountdownInterval;

function updateDashboardPrayerCard() {
    const locationEl = document.getElementById('prayer-location');
    const nameEl = document.getElementById('next-prayer-name');
    const timeEl = document.getElementById('next-prayer-time');
    const listEl = document.getElementById('prayer-list-mini');

    if (!locationEl || !nameEl || !timeEl) return;

    const city = localStorage.getItem(STORAGE_KEYS.PRAYER_CITY) || 'Jakarta';
    locationEl.textContent = city;

    const todayStr = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAYER_DATA) || '{}');

    if (!data.key || !data.key.includes(todayStr) || !data.timings) {
        nameEl.textContent = '-';
        timeEl.textContent = '--:--';
        if (listEl) listEl.innerHTML = '<div class="text-xs text-center">Data tidak tersedia</div>';
        return;
    }

    const timings = data.timings;
    const prayerMap = { 'Fajr': 'Subuh', 'Dhuhr': 'Dzuhur', 'Asr': 'Ashar', 'Maghrib': 'Maghrib', 'Isha': 'Isya' };
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    // Update Mini List
    if (listEl) {
        listEl.innerHTML = prayerOrder.map(key => `
            <div class="${isNextPrayer(timings[key]) ? 'text-primary font-bold' : ''}">
                ${prayerMap[key]}<br>${timings[key]}
            </div>
        `).join('');
    }

    // Find Next Prayer
    const now = new Date();
    const currentHm = now.toTimeString().slice(0, 5);
    let nextPrayer = null;

    for (const key of prayerOrder) {
        if (timings[key] > currentHm) {
            nextPrayer = { name: prayerMap[key], time: timings[key] };
            break;
        }
    }

    // If all passed, next is Fajr tomorrow (simplification: just show Fajr or "-" or handled by countdown)
    if (!nextPrayer) {
        // Assume next is Fajr tomorrow
        nextPrayer = { name: 'Subuh', time: timings['Fajr'] };
        // Note: Logic for tomorrow's Fajr countdown requires more robust date handling, 
        // but for now displaying today's Fajr time as "next" cycle is acceptable or just stick to current day.
        // Let's keep it simple: if no next prayer today, show "Besok: Subuh"
        nameEl.textContent = 'Subuh (Bsk)';
        timeEl.textContent = timings['Fajr'];
    } else {
        nameEl.textContent = nextPrayer.name;
        timeEl.textContent = nextPrayer.time;
    }
}

function isNextPrayer(timeStr) {
    const now = new Date();
    const currentHm = now.toTimeString().slice(0, 5);
    return timeStr > currentHm; // Very naive check, works for sorted list on same day
}

function startPrayerCountdown() {
    if (prayerCountdownInterval) clearInterval(prayerCountdownInterval);

    const countdownEl = document.getElementById('next-prayer-countdown');
    if (!countdownEl) return;

    prayerCountdownInterval = setInterval(() => {
        const timeEl = document.getElementById('next-prayer-time');
        if (!timeEl) return;

        const targetTimeStr = timeEl.textContent; // HH:mm
        if (targetTimeStr === '--:--' || targetTimeStr.includes('Bsk')) {
            countdownEl.textContent = '--:--:--';
            return;
        }

        const now = new Date();
        const target = new Date();
        const [h, m] = targetTimeStr.split(':').map(Number);
        target.setHours(h, m, 0, 0);

        let diff = target - now;
        if (diff < 0) {
            // Target passed (or it's tomorrow's prayer but we used today's date)
            // If it was supposed to be tomorrow, add 1 day
            // But simple logic: if negative, refresh card to get next prayer
            updateDashboardPrayerCard();
            return;
        }

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        countdownEl.textContent = `-${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}


function updateDashboardStats() {
    const journals = getJournals();
    document.getElementById('stat-journals').textContent = journals.length;

    const tasks = getTasks();
    const completedTasks = tasks.filter(t => t.done).length;
    document.getElementById('stat-tasks').textContent = `${completedTasks}/${tasks.length}`;

    const transactions = getTransactions();
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    document.getElementById('stat-balance').textContent = formatCurrency(income - expense);

    const habits = getHabits();
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    document.getElementById('current-streak').textContent = bestStreak;
}

function updateUpcomingSchedules() {
    const schedules = getSchedules();
    const now = new Date();
    const upcoming = schedules
        .filter(s => new Date(s.datetime) > now)
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
        .slice(0, 5);

    const container = document.getElementById('upcoming-schedules');

    if (upcoming.length === 0) {
        container.innerHTML = '<p class="text-muted">Tidak ada jadwal mendatang</p>';
        return;
    }

    container.innerHTML = upcoming.map(s => {
        const date = new Date(s.datetime);
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        return `
            <div class="reminder-item schedule">
                <span class="reminder-time">${timeStr}</span>
                <span class="reminder-text">${s.title} - ${dateStr}</span>
            </div>
        `;
    }).join('');
}

function updateTodayReminders() {
    const habits = getHabits();
    const today = getTodayString();

    const container = document.getElementById('today-reminders');
    if (!container) return;

    if (habits.length === 0) {
        container.innerHTML = '<p class="text-muted">Tidak ada habits ditambahkan</p>';
        return;
    }

    const undoneHabits = habits.filter(h => {
        if (h.completions && h.completions[today]) return false;
        if (h.completedDates && h.completedDates.includes(today)) return false;
        return true;
    });

    if (undoneHabits.length === 0) {
        container.innerHTML = '<p class="text-muted">✅ Semua habits sudah selesai hari ini!</p>';
        return;
    }

    container.innerHTML = undoneHabits.map(h => `
        <div class="reminder-item">
            <span class="reminder-time">⏰</span>
            <span class="reminder-text">${h.name}</span>
        </div>
    `).join('');
}

async function getDailyInsight() {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('Atur API key dulu di Settings!');
        showSettings();
        return;
    }

    const insightBox = document.getElementById('quick-insight');
    insightBox.innerHTML = '<p class="text-muted">Menganalisis data Anda...</p>';

    const journals = getJournals();
    const tasks = getTasks();
    const habits = getHabits();

    const prompt = `Berdasarkan data pengguna: ${journals.length} jurnal, ${tasks.filter(t => t.completed).length}/${tasks.length} task selesai, ${habits.length} habits.

Tulis TEPAT 2 kalimat motivasi singkat dalam bahasa Indonesia. Maksimal 50 kata total. Langsung tulis kalimatnya tanpa pembuka.`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
            })
        });

        if (!response.ok) throw new Error('Gagal mendapatkan insight');

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada insight';

        insightBox.innerHTML = `<p>${text}</p>`;
    } catch (error) {
        insightBox.innerHTML = '<p class="text-muted">Gagal mengambil insight. Coba lagi nanti.</p>';
    }
}

// ===== AI ANALYSIS MODULE =====
function initAIAnalysis() {
    document.getElementById('analyze-planner-btn').addEventListener('click', () => analyzeWithAI('planner'));
    document.getElementById('analyze-finance-btn').addEventListener('click', () => analyzeWithAI('finance'));
    document.getElementById('analyze-habits-btn').addEventListener('click', () => analyzeWithAI('habits'));
    document.getElementById('close-analysis').addEventListener('click', hideAnalysisModal);

    const modal = document.getElementById('analysis-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideAnalysisModal();
    });
}

function showAnalysisModal(title) {
    document.getElementById('analysis-title').textContent = title;
    document.getElementById('analysis-loading').classList.remove('hidden');
    document.getElementById('analysis-content').innerHTML = '';
    document.getElementById('analysis-modal').classList.remove('hidden');
}

function hideAnalysisModal() {
    document.getElementById('analysis-modal').classList.add('hidden');
}

async function analyzeWithAI(type) {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('Atur API key dulu di Settings!');
        showSettings();
        return;
    }

    let data, prompt, title;

    switch (type) {
        case 'planner':
            title = '🧠 Analisis Produktivitas';
            data = { tasks: getTasks(), schedules: getSchedules() };
            prompt = `Analisis data produktivitas berikut dan berikan insight:
            
Tasks: ${JSON.stringify(data.tasks)}
Schedules: ${JSON.stringify(data.schedules)}

Berikan analisis dalam format HTML dengan struktur:
<h4>📊 Ringkasan</h4>
<p>ringkasan singkat</p>
<h4>✅ Yang Sudah Baik</h4>
<ul><li>poin positif</li></ul>
<h4>⚠️ Yang Perlu Perhatian</h4>
<ul><li>area improvement</li></ul>
<h4>💡 Saran</h4>
<ul><li>saran actionable</li></ul>

Gunakan bahasa Indonesia yang hangat dan memotivasi.`;
            break;

        case 'finance':
            title = '🧠 Analisis Keuangan';
            data = getTransactions();
            const income = data.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const expense = data.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

            prompt = `Analisis data keuangan berikut:

Transactions: ${JSON.stringify(data)}
Total Income: ${income}
Total Expense: ${expense}
Balance: ${income - expense}

Berikan analisis dalam format HTML dengan struktur:
<h4>📊 Ringkasan Keuangan</h4>
<p>overview singkat</p>
<h4>📈 Pola Pengeluaran</h4>
<ul><li>kategori terbesar</li></ul>
<h4>💰 Tips Penghematan</h4>
<ul><li>tips praktis</li></ul>
<h4>🎯 Target Bulan Depan</h4>
<p>rekomendasi target</p>

Gunakan bahasa Indonesia dan format currency IDR.`;
            break;

        case 'habits':
            title = '🧠 Analisis Kebiasaan';
            data = getHabits();

            prompt = `Analisis data kebiasaan/habits berikut:

Habits: ${JSON.stringify(data)}

Berikan analisis dalam format HTML dengan struktur:
<h4>📊 Overview Habits</h4>
<p>ringkasan performa</p>
<h4>🔥 Streak Terbaik</h4>
<ul><li>habits dengan streak tinggi</li></ul>
<h4>⚠️ Perlu Perhatian</h4>
<ul><li>habits yang jarang dilakukan</li></ul>
<h4>💪 Tips Konsistensi</h4>
<ul><li>tips membangun kebiasaan</li></ul>

Gunakan bahasa Indonesia yang memotivasi.`;
            break;
    }

    showAnalysisModal(title);

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024
                }
            })
        });

        if (!response.ok) throw new Error('Gagal mendapatkan analisis');

        const result = await response.json();
        let text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada hasil';
        text = text.replace(/```html/gi, '').replace(/```/g, '');

        document.getElementById('analysis-loading').classList.add('hidden');
        document.getElementById('analysis-content').innerHTML = text;

    } catch (error) {
        console.error('Analysis error:', error);
        document.getElementById('analysis-loading').classList.add('hidden');
        document.getElementById('analysis-content').innerHTML = `
            <p style="color: var(--error);">❌ Gagal menganalisis: ${error.message}</p>
            <p>Coba lagi dalam beberapa saat.</p>
        `;
    }
}

// ===== REMINDER MODULE =====
function getReminderSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDER_SETTINGS);
    return data ? JSON.parse(data) : {
        habitsEnabled: false,
        habitsTime: '08:00',
        scheduleEnabled: false
    };
}

function saveReminderSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(settings));
    triggerCloudSync();
}

function initReminder() {
    const settings = getReminderSettings();

    document.getElementById('reminder-habits-toggle').checked = settings.habitsEnabled;
    document.getElementById('reminder-schedule-toggle').checked = settings.scheduleEnabled;
    document.getElementById('habits-reminder-time').value = settings.habitsTime || '08:00';

    if (settings.habitsEnabled) {
        document.getElementById('habits-time-setting').classList.remove('hidden');
    }

    document.getElementById('reminder-habits-toggle').addEventListener('change', (e) => {
        const timeSetting = document.getElementById('habits-time-setting');
        if (e.target.checked) {
            timeSetting.classList.remove('hidden');
        } else {
            timeSetting.classList.add('hidden');
        }
    });

    document.getElementById('save-reminder-btn').addEventListener('click', saveReminderSettingsHandler);

    if (settings.habitsEnabled || settings.scheduleEnabled) {
        requestNotificationPermission();
        checkAndTriggerReminders();
    }
}

async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
}

function saveReminderSettingsHandler() {
    const settings = {
        habitsEnabled: document.getElementById('reminder-habits-toggle').checked,
        habitsTime: document.getElementById('habits-reminder-time').value,
        scheduleEnabled: document.getElementById('reminder-schedule-toggle').checked
    };

    saveReminderSettings(settings);

    if (settings.habitsEnabled || settings.scheduleEnabled) {
        requestNotificationPermission();
    }

    alert('✅ Pengaturan reminder tersimpan!');
}

function checkAndTriggerReminders() {
    const settings = getReminderSettings();

    setInterval(() => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);

        if (settings.habitsEnabled && currentTime === settings.habitsTime) {
            const habits = getHabits();
            const today = getTodayString();
            const undone = habits.filter(h => !h.completedDates?.includes(today));

            if (undone.length > 0) {
                showNotification('🔔 Reminder Habits', `Kamu punya ${undone.length} habits yang belum selesai hari ini!`);
            }
        }

        if (settings.scheduleEnabled) {
            const schedules = getSchedules();
            const in15Min = new Date(now.getTime() + 15 * 60000);

            schedules.forEach(s => {
                const scheduleTime = new Date(s.datetime);
                if (Math.abs(scheduleTime - in15Min) < 60000) {
                    showNotification('📅 Jadwal Mendatang', `${s.title} dalam 15 menit!`);
                }
            });
        }
    }, 60000);
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'icons/icon-512.png',
            badge: 'icons/icon-512.png'
        });
    }
}
