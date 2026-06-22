// ===== DASHBOARD MODULE =====
async function initDashboard() {
    await updateDashboardStats();
    await updateDashboardReminders();
    if (typeof initMoodChart === 'function') await initMoodChart();

    updateDashboardPrayerCard(); // Initial render
    setInterval(updateDashboardPrayerCard, 60000); // Update every minute for next prayer check

    // Start distinct countdown interval
    startPrayerCountdown();

    const dailyInsightBtn = document.getElementById('get-daily-insight-btn');
    if (dailyInsightBtn) {
        dailyInsightBtn.addEventListener('click', getDailyInsight);
    }

    // Add listener for Jarvis Wisdom Card
    const wisdomCard = document.getElementById('jarvis-wisdom-card');
    if (wisdomCard) {
        wisdomCard.addEventListener('click', () => updateJarvisWisdom(true));
    }
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


async function updateDashboardStats() {
    const journals = await getJournals();
    const statJournals = document.getElementById('stat-journals');
    if (statJournals) statJournals.textContent = journals.length;

    // Aggregate Pending Items (Belum Dilakukan)
    let totalPending = 0;
    const now = new Date();
    const todayStr = getTodayString();

    // 1. Kanban Pending
    const tasks = await getTasks();
    totalPending += tasks.filter(t => !t.done && t.status !== 'done').length;

    // 2. Habits Pending Today
    const habits = await getHabits();
    totalPending += habits.filter(h => {
        if (h.completions && h.completions[todayStr]) return false;
        if (h.completedDates && h.completedDates.includes(todayStr)) return false;
        return true;
    }).length;

    // 3. To-Do List Hari Ini Pending
    const dailyTodos = await getDailyTodos();
    if (dailyTodos) {
        totalPending += dailyTodos.filter(t => !t.completed).length;
    }

    // 4. Upcoming Schedules (Planner)
    const schedules = await getSchedules();
    totalPending += schedules.filter(s => new Date(s.datetime) > now).length;

    const statTasks = document.getElementById('stat-tasks');
    if (statTasks) statTasks.textContent = totalPending;

    const transactions = await getTransactions();
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    const wallets = await getWallets();
    const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
    
    const statBalance = document.getElementById('stat-balance');
    if (statBalance) statBalance.textContent = formatCurrency(totalBalance);

    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    const currentStreak = document.getElementById('current-streak');
    if (currentStreak) currentStreak.textContent = bestStreak;
}

async function updateDashboardReminders() {
    const container = document.getElementById('dashboard-reminders');
    if (!container) return;

    let allReminders = [];
    const now = new Date();
    const todayStr = getTodayString();

    // 1. Schedules (Planner)
    try {
        const schedules = await getSchedules();
        const todayStrLocal = new Date().toISOString().split('T')[0];
        
        const activeSchedules = schedules
            .filter(s => !s.completed && (s.datetime.startsWith(todayStrLocal) || new Date(s.datetime) > now))
            .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        activeSchedules.forEach(s => {
            const date = new Date(s.datetime);
            const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            allReminders.push({
                type: 'schedule', cat: 'planner',
                icon: '📅', title: s.title, id: s.id,
                color: '#818cf8',
                timeLabel: `Planner: ${timeStr} - ${dateStr}`,
                sortWeight: date.getTime(),
                targetScreen: 'planner'
            });
        });
    } catch(e) { console.warn('Reminders: Planner error', e); }

    // 2. To-Do List Hari Ini (Incomplete)
    try {
        const dailyTodos = await getDailyTodos();
        if (dailyTodos) {
            dailyTodos.filter(t => !t.completed).forEach(t => {
                let priorityLabel = 'Hari Ini';
                let extraWeight = 500;
                if (t.priority === 'p1') { priorityLabel = 'Mendesak'; extraWeight = 0; }
                else if (t.priority === 'p2') { priorityLabel = 'Penting'; extraWeight = 200; }
                allReminders.push({
                    type: 'todo-today', cat: 'todo',
                    icon: '✅', title: t.text, id: t.id,
                    color: '#f59e0b',
                    timeLabel: `To-Do: ${priorityLabel}`,
                    sortWeight: now.getTime() + extraWeight,
                    targetScreen: 'todo-today'
                });
            });
        }
    } catch(e) { console.warn('Reminders: Todo error', e); }

    // 3. Kanban
    try {
        const tasks = await getTasks();
        const pendingTasks = tasks.filter(t => !t.done && t.status !== 'done');
        pendingTasks.forEach(t => {
            allReminders.push({
                type: 'kanban', cat: 'kanban',
                icon: '📋', title: t.title, id: t.id,
                color: '#3b82f6',
                timeLabel: 'Kanban',
                sortWeight: now.getTime() + 1000,
                targetScreen: 'kanban'
            });
        });
    } catch(e) { console.warn('Reminders: Kanban error', e); }

    // 4. Habits
    try {
        const habits = await getHabits();
        const undoneHabits = habits.filter(h => {
            if (h.completions && h.completions[todayStr]) return false;
            if (h.completedDates && h.completedDates.includes(todayStr)) return false;
            return true;
        });
        undoneHabits.forEach(h => {
            allReminders.push({
                type: 'habit', cat: 'habits',
                icon: '🌱', title: h.name, id: h.id,
                color: '#10b981',
                timeLabel: 'Habit',
                sortWeight: now.getTime() + 2000,
                targetScreen: 'habits'
            });
        });
    } catch(e) { console.warn('Reminders: Habits error', e); }

    // 5. Ibadah (Islamic Tracker) - belum sholat hari ini
    try {
        if (typeof getIslamicTrackByDate === 'function') {
            const islamData = await getIslamicTrackByDate(todayStr);
            const prayers = [
                { key: 'subuh', label: 'Sholat Subuh' },
                { key: 'dzuhur', label: 'Sholat Dzuhur' },
                { key: 'ashar', label: 'Sholat Ashar' },
                { key: 'maghrib', label: 'Sholat Maghrib' },
                { key: 'isya', label: 'Sholat Isya' }
            ];
            // Only show prayers that should have been done by now
            const hour = now.getHours();
            const prayerTimeMap = { subuh: 5, dzuhur: 12, ashar: 15, maghrib: 18, isya: 19 };
            prayers.forEach(p => {
                if (islamData.prayers && !islamData.prayers[p.key]) {
                    allReminders.push({
                        type: 'ibadah', cat: 'ibadah',
                        icon: '🕌', title: p.label, id: `prayer-${p.key}`,
                        color: '#a78bfa',
                        timeLabel: 'Ibadah',
                        sortWeight: now.getTime() - 500 + prayerTimeMap[p.key], // Sort chronologically
                        targetScreen: 'islam'
                    });
                }
            });
            // Sunnah & Others reminders
            const sunnahItems = [
                { key: 'qobliyah', label: 'Sholat Qobliyah/Ba\'diyah' },
                { key: 'dzikirPagi', label: 'Dzikir Pagi' },
                { key: 'dzikirPetang', label: 'Dzikir Petang' },
                { key: 'waqiah', label: "Baca Al-Waqi'ah" },
                { key: 'sedekah', label: 'Sedekah Harian' },
                { key: 'fasting', label: 'Puasa Sunnah' }
            ];
            sunnahItems.forEach(s => {
                if (!islamData[s.key]) {
                    allReminders.push({
                        type: 'ibadah-sunnah', cat: 'ibadah',
                        icon: '🤲', title: s.label, id: `sunnah-${s.key}`,
                        color: '#c084fc',
                        timeLabel: 'Sunnah',
                        sortWeight: now.getTime() + 100,
                        targetScreen: 'islam'
                    });
                }
            });
        }
    } catch(e) { console.warn('Reminders: Ibadah error', e); }

    // 6. Stoic Muslim (Daily Missions belum selesai)
    try {
        if (typeof stoicState !== 'undefined' && typeof stoicData !== 'undefined') {
            const undoneMissions = (stoicState.dailyMissions || []).filter(
                mId => !(stoicState.checklistProgress || []).includes(mId)
            );
            undoneMissions.forEach(mId => {
                const mission = stoicData.auraBank.find(m => m.id === mId);
                if (mission) {
                    allReminders.push({
                        type: 'stoic', cat: 'stoic',
                        icon: '🗡️', title: mission.title, id: mId,
                        color: '#10b981',
                        timeLabel: 'Stoic Muslim',
                        sortWeight: now.getTime() + 3000,
                        targetScreen: 'stoic-muslim'
                    });
                }
            });
        }
    } catch(e) { console.warn('Reminders: Stoic error', e); }

    // 7. Cortisol Control (Habits belum selesai hari ini)
    try {
        if (typeof cortisolState !== 'undefined' && typeof cortisolData !== 'undefined') {
            const doneCortisolIds = cortisolState.completedToday || [];
            const undoneCortisolHabits = cortisolData.habits.filter(h => !doneCortisolIds.includes(h.id));
            undoneCortisolHabits.forEach(h => {
                allReminders.push({
                    type: 'cortisol', cat: 'cortisol',
                    icon: h.icon || '🧘', title: h.title, id: h.id,
                    color: '#38bdf8',
                    timeLabel: 'Cortisol Control',
                    sortWeight: now.getTime() + 4000,
                    targetScreen: 'cortisol-control'
                });
            });
        }
    } catch(e) { console.warn('Reminders: Cortisol error', e); }

    // 8. Looksmaxing (Habits belum selesai hari ini)
    try {
        if (typeof looksState !== 'undefined' && typeof looksData !== 'undefined') {
            const doneLooksIds = looksState.completedToday || [];
            const undoneLooksHabits = looksData.habits.filter(h => !doneLooksIds.includes(h.id));
            undoneLooksHabits.forEach(h => {
                allReminders.push({
                    type: 'looksmaxing', cat: 'looks',
                    icon: h.icon || '✨', title: h.title, id: h.id,
                    color: '#f472b6',
                    timeLabel: 'Looksmaxing',
                    sortWeight: now.getTime() + 5000,
                    targetScreen: 'looksmaxing'
                });
            });
        }
    } catch(e) { console.warn('Reminders: Looksmaxing error', e); }

    // 9. BPS Roster (Checklist items belum selesai di tab aktif hari ini)
    try {
        const savedShifts = localStorage.getItem('work_shift_data');
        let todayShift = null;
        if (savedShifts) {
            const shiftData = JSON.parse(savedShifts);
            const todayShiftKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            todayShift = shiftData[todayShiftKey];
        }

        if (todayShift && todayShift !== 'Off' && todayShift !== 'Cuti' && todayShift !== 'Izin') {
            let bpsTab = 'shiftPagi';
            if (todayShift.includes('Malam') || todayShift === 'Dinas Malam') bpsTab = 'shiftMalam';
            
            const bpsTabEl = document.getElementById('bps-content-' + bpsTab);
            if (bpsTabEl) {
                const unchecked = bpsTabEl.querySelectorAll('.bps-checkbox:not(:checked)');
                const total = bpsTabEl.querySelectorAll('.bps-checkbox').length;
                const checked = total - unchecked.length;
                if (unchecked.length > 0) {
                    unchecked.forEach((cb, idx) => {
                        const labelText = cb.nextElementSibling ? cb.nextElementSibling.textContent.trim() : `Tugas BPS ${idx+1}`;
                        allReminders.push({
                            type: 'bps', cat: 'bps',
                            icon: '👷', title: labelText, id: cb.id,
                            color: '#0054A6',
                            timeLabel: `BPS: ${todayShift}`,
                            sortWeight: now.getTime() + 500 + idx,
                            targetScreen: 'bps-roster'
                        });
                    });
                }
            }
        } else if (!todayShift) {
            allReminders.push({
                type: 'bps-assign', cat: 'bps',
                icon: '👷', title: `Set Jadwal Shift BPS Hari Ini`, id: 'bps-assign-shift',
                color: '#0054A6',
                timeLabel: `Shift Belum Diatur`,
                sortWeight: now.getTime() + 100,
                targetScreen: 'shift-tracker'
            });
        }
    } catch(e) { console.warn('Reminders: BPS error', e); }

    // 10. Workout (Latihan hari ini berdasarkan jadwal)
    try {
        if (typeof workoutData !== 'undefined' && typeof workoutState !== 'undefined') {
            const dayIndex = now.getDay(); // 0=Sun, 1=Mon...
            const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Map JS day to workoutSchedule index
            const schedIdx = dayMap[dayIndex];
            const todaySched = typeof workoutSchedule !== 'undefined' ? workoutSchedule[schedIdx] : null;
            
            if (todaySched && todaySched.type !== 'rest') {
                // Find the corresponding data category
                let workoutCatKey = null;
                if (todaySched.type === 'gym' && todaySched.title.includes('1')) workoutCatKey = 'gym1';
                else if (todaySched.type === 'gym' && todaySched.title.includes('2')) workoutCatKey = 'gym2';
                else if (todaySched.type === 'home' && todaySched.title.includes('1')) workoutCatKey = 'home1';
                else if (todaySched.type === 'home' && todaySched.title.includes('2')) workoutCatKey = 'home2';

                if (workoutCatKey && workoutData[workoutCatKey]) {
                    const donework = workoutState.progress[workoutCatKey] || [];
                    workoutData[workoutCatKey].forEach((task, idx) => {
                        if (!donework.includes(task.id)) {
                            allReminders.push({
                                type: 'workout', cat: 'workout',
                                icon: '💪', title: task.text, id: `workout-${workoutCatKey}-${task.id}`,
                                color: '#818cf8',
                                timeLabel: `Workout: ${todaySched.title}`,
                                sortWeight: now.getTime() + 1500 + idx,
                                targetScreen: 'workout-tracker'
                            });
                        }
                    });
                } else if (todaySched.type === 'game') {
                    allReminders.push({
                        type: 'workout', cat: 'workout',
                        icon: '🏆', title: 'Game Day! Main Voli/Bola', id: 'workout-game',
                        color: '#f59e0b',
                        timeLabel: `Workout ${todaySched.day}`,
                        sortWeight: now.getTime() + 1500,
                        targetScreen: 'workout-tracker'
                    });
                }
            }
        }
    } catch(e) { console.warn('Reminders: Workout error', e); }

    // 11. Journal (Belum menulis jurnal hari ini)
    try {
        if (typeof getJournals === 'function') {
            const journals = await getJournals();
            const wroteToday = journals.some(j => j.date === todayStr);
            if (!wroteToday) {
                allReminders.push({
                    type: 'journal', cat: 'journal',
                    icon: '📝', title: 'Tulis Jurnal Hari Ini', id: 'journal-today',
                    color: '#6366f1',
                    timeLabel: 'Jurnal',
                    sortWeight: now.getTime() + 100,
                    targetScreen: 'journal'
                });
            }
        }
    } catch(e) { console.warn('Reminders: Journal error', e); }

    // Store all reminders for filtering
    window._allDashboardReminders = allReminders;

    // Render with category filter tabs
    renderReminderTabs(container, allReminders);
}

// Category filter tabs and rendering
function renderReminderTabs(container, allReminders) {
    // Count items per category
    const catCounts = {};
    allReminders.forEach(r => {
        catCounts[r.cat] = (catCounts[r.cat] || 0) + 1;
    });

    const catLabels = {
        'all': { label: 'Semua', icon: '📌', color: '#94a3b8' },
        'ibadah': { label: 'Ibadah', icon: '🕌', color: '#a78bfa' },
        'todo': { label: 'To-Do', icon: '✅', color: '#f59e0b' },
        'habits': { label: 'Habits', icon: '🌱', color: '#10b981' },
        'planner': { label: 'Planner', icon: '📅', color: '#818cf8' },
        'kanban': { label: 'Kanban', icon: '📋', color: '#3b82f6' },
        'stoic': { label: 'Stoic', icon: '🗡️', color: '#10b981' },
        'cortisol': { label: 'Cortisol', icon: '🧘', color: '#38bdf8' },
        'looks': { label: 'Looks', icon: '✨', color: '#f472b6' },
        'bps': { label: 'BPS', icon: '👷', color: '#0054A6' },
        'workout': { label: 'Workout', icon: '💪', color: '#818cf8' },
        'journal': { label: 'Jurnal', icon: '📝', color: '#6366f1' }
    };

    const activeCats = Object.keys(catCounts);
    const activeFilter = window._reminderActiveFilter || 'all';

    // Build filter tabs (only show if multiple categories exist)
    let tabsHtml = '';
    if (activeCats.length > 1) {
        tabsHtml = `<div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid var(--border);">`;
        
        // "All" tab
        const allActive = activeFilter === 'all';
        tabsHtml += `<button onclick="filterDashboardReminders('all')" style="
            font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid ${allActive ? '#94a3b8' : 'rgba(255,255,255,0.1)'}; 
            background: ${allActive ? 'rgba(148, 163, 184, 0.2)' : 'transparent'}; color: ${allActive ? '#e2e8f0' : '#94a3b8'}; 
            cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px;
        ">📌 ${allReminders.length}</button>`;

        activeCats.forEach(cat => {
            const info = catLabels[cat] || { label: cat, icon: '•', color: '#94a3b8' };
            const isActive = activeFilter === cat;
            tabsHtml += `<button onclick="filterDashboardReminders('${cat}')" style="
                font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid ${isActive ? info.color : 'rgba(255,255,255,0.1)'}; 
                background: ${isActive ? info.color + '25' : 'transparent'}; color: ${isActive ? info.color : '#94a3b8'}; 
                cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px;
            ">${info.icon} ${catCounts[cat]}</button>`;
        });
        tabsHtml += `</div>`;
    }

    // Filter reminders
    let filtered = activeFilter === 'all' ? allReminders : allReminders.filter(r => r.cat === activeFilter);
    filtered.sort((a, b) => a.sortWeight - b.sortWeight);

    if (filtered.length === 0 && allReminders.length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align:center; padding: 15px;">🎉 Semua beres! Tidak ada pengingat kegiatan.</p>';
        return;
    }

    if (filtered.length === 0) {
        container.innerHTML = tabsHtml + '<p class="text-muted" style="text-align:center; padding: 10px; font-size: 0.85rem;">✅ Kategori ini sudah beres!</p>';
        return;
    }

    // Show up to 100 items (so all checklists appear)
    const itemsHtml = filtered.slice(0, 100).map(r => `
        <div class="reminder-item" 
             style="display: flex; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); transition: all 0.2s;"
             onmouseover="this.style.background='rgba(255,255,255,0.02)'"
             onmouseout="this.style.background='transparent'">
            <div onclick="event.stopPropagation(); toggleDashboardReminderItem('${r.type}', '${r.id}')" 
                 style="width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${r.color}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;"
                 class="reminder-checkbox-btn"
                 title="Tandai Selesai">
            </div>
            <div style="display: flex; flex-direction: column; flex: 1; cursor: pointer;" onclick="${['stoic-muslim','cortisol-control','looksmaxing','workout-tracker','bps-roster','islam'].includes(r.targetScreen) ? `navigateToSubscreen('${r.targetScreen}')` : `navigateToScreen('${r.targetScreen}')`}">
                <span class="reminder-text" style="font-weight: 600; font-size: 0.9rem; color: var(--text-color);">${r.icon} ${r.title}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 500;">${r.timeLabel}</span>
            </div>
        </div>
    `).join('');

    // Summary bar at bottom
    const totalCount = allReminders.length;
    const doneMsg = totalCount > 0 
        ? `<div style="text-align: center; padding: 8px 0 2px; font-size: 0.65rem; color: var(--text-muted); opacity: 0.7;">📊 ${totalCount} tugas aktif dari semua modul</div>` 
        : '';

    container.innerHTML = tabsHtml + itemsHtml + doneMsg;
}

window.filterDashboardReminders = function(cat) {
    window._reminderActiveFilter = cat;
    const container = document.getElementById('dashboard-reminders');
    if (container && window._allDashboardReminders) {
        renderReminderTabs(container, window._allDashboardReminders);
    }
};

window.toggleDashboardReminderItem = async function(type, id) {
    const todayStr = typeof getTodayString === 'function' ? getTodayString() : new Date().toISOString().split('T')[0];
    
    try {
        if (type === 'habit') {
            if (typeof toggleHabitCompletion === 'function') {
                const habit = await toggleHabitCompletion(id, todayStr);
                if (habit && habit.completions && habit.completions[todayStr]) {
                    if (typeof addXP === 'function') {
                        addXP(10, 'Habit Selesai');
                        if (habit.streak > 0 && habit.streak % 7 === 0) {
                            addXP(20, `${habit.streak} Hari Streak!`);
                        }
                    }
                }
            }
        } else if (type === 'todo-today') {
            if (typeof toggleDailyTodo === 'function') {
                await toggleDailyTodo(id);
            }
        } else if (type === 'kanban') {
            if (typeof toggleTask === 'function') {
                const task = await toggleTask(id);
                if (task && task.done && typeof addXP === 'function') {
                    addXP(15, 'Tugas Kanban Selesai');
                }
            }
        } else if (type === 'schedule') {
            if (typeof getSchedules === 'function') {
                const schedules = await getSchedules(true);
                const sched = schedules.find(s => s.id === id);
                if (sched) {
                    sched.completed = true;
                    if (typeof saveSchedule === 'function') {
                        await saveSchedule(sched);
                        if (typeof addXP === 'function') addXP(10, 'Jadwal Selesai');
                    }
                }
            }
        } else if (type === 'ibadah') {
            // Toggle prayer checkbox in the Islam tracker
            const prayerKey = id.replace('prayer-', '');
            const el = document.getElementById('prayer-' + prayerKey);
            if (el) {
                el.checked = true;
                el.dispatchEvent(new Event('change'));
            }
            if (typeof addXP === 'function') addXP(5, 'Sholat Selesai');
        } else if (type === 'ibadah-sunnah') {
            // Toggle sunnah checkbox
            const sunnahKey = id.replace('sunnah-', '');
            const keyMap = { qobliyah: 'islam-qobliyah', dzikirPagi: 'islam-dzikir-pagi', dzikirPetang: 'islam-dzikir-petang', waqiah: 'islam-waqiah', sedekah: 'islam-sedekah', fasting: 'islam-fasting' };
            const el = document.getElementById(keyMap[sunnahKey]);
            if (el) {
                el.checked = true;
                el.dispatchEvent(new Event('change'));
            }
            if (typeof addXP === 'function') addXP(5, 'Sunnah Selesai');
        } else if (type === 'stoic') {
            // Toggle stoic mission completion
            if (typeof stoicState !== 'undefined') {
                if (!stoicState.checklistProgress) stoicState.checklistProgress = [];
                if (!stoicState.checklistProgress.includes(id)) {
                    stoicState.checklistProgress.push(id);
                    stoicState.xp = (stoicState.xp || 0) + 15;
                    if (typeof saveStoicState === 'function') saveStoicState();
                    if (typeof addXP === 'function') addXP(10, 'Misi Stoic Selesai');
                }
            }
        } else if (type === 'cortisol') {
            // Toggle cortisol habit
            if (typeof toggleCortisolHabit === 'function') {
                toggleCortisolHabit(id);
                if (typeof addXP === 'function') addXP(5, 'Cortisol Habit');
            }
        } else if (type === 'looksmaxing') {
            // Toggle looksmaxing habit
            if (typeof toggleLooksHabit === 'function') {
                toggleLooksHabit(id);
            }
        } else if (type === 'bps' || type === 'workout' || type === 'journal' || type === 'bps-assign') {
            if (type === 'workout' && id.startsWith('workout-')) {
                const parts = id.split('-');
                if (parts.length === 3 && typeof toggleWorkoutTask === 'function') {
                    await toggleWorkoutTask(parts[1], parts[2]); // e.g. workout-gym1-g1_1
                }
            } else if (type === 'bps' && id.startsWith('bps-')) {
                const el = document.getElementById(id);
                if (el) {
                    el.checked = true;
                    el.dispatchEvent(new Event('change'));
                }
            } else if (type === 'bps-assign') {
                if (typeof openShiftModal === 'function') {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getMonth();
                    const day = now.getDate();
                    const dateString = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                    
                    openShiftModal(dateString, day, monthNames[month], year);
                }
                return; // Let modal handle completion
            } else if (type === 'journal') {
                const isiJurnal = prompt("📝 Apa yang ingin Anda tulis di jurnal hari ini?\n(Batal untuk membuka halaman Jurnal)");
                if (isiJurnal !== null) {
                    if (isiJurnal.trim() !== '') {
                        if (typeof addJournalEntry === 'function') {
                            addJournalEntry("Jurnal Singkat (Dashboard)", isiJurnal, "Harian", "Senang");
                        }
                    } else {
                        // Empty string but not cancelled -> just mark it
                        if (typeof addJournalEntry === 'function') {
                            addJournalEntry("Jurnal Harian", "Telah diselesaikan dari Dashboard.", "Harian", "Biasa");
                        }
                    }
                    if (typeof addXP === 'function') addXP(15, 'Tulis Jurnal');
                } else {
                    if (typeof navigateToSubscreen === 'function') navigateToSubscreen('journal');
                    return;
                }
            } else {
                // Fallback: Navigate to module for complex interactions
                let screen = type;
                if (type === 'bps') screen = 'bps-roster';
                if (type === 'workout') screen = 'workout-tracker';
                if (type === 'journal') screen = 'journal';
                
                if (typeof navigateToSubscreen === 'function') navigateToSubscreen(screen);
                return; // Don't refresh, we're navigating away
            }
        }
    } catch(e) {
        console.error("Gagal mencentang pengingat kegiatan", e);
    }
    
    // Refresh stats and reminder widgets
    if (typeof updateDashboardStats === 'function') await updateDashboardStats();
    if (typeof updateDashboardReminders === 'function') await updateDashboardReminders();
    if (typeof refreshWidget === 'function') {
        refreshWidget('rpg-stats');
        refreshWidget('reminders');
        refreshWidget('stoic-muslim');
    }
};

async function getDailyInsight() {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('Atur API key dulu di Settings!');
        showSettings();
        return;
    }

    const insightBox = document.getElementById('quick-insight');
    insightBox.innerHTML = '<p class="text-muted">Menganalisis data Anda...</p>';

    const journals = await getJournals();
    const tasks = await getTasks();
    const habits = await getHabits();

    const prompt = `Berdasarkan data pengguna: ${journals.length} jurnal, ${tasks.filter(t => t.completed || t.done || t.status === 'done').length}/${tasks.length} task selesai, ${habits.length} habits.

Tulis TEPAT 2 kalimat motivasi singkat dalam bahasa Indonesia. Maksimal 50 kata total. Langsung tulis kalimatnya tanpa pembuka.`;

    try {
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
        };
        const text = await unifiedGeminiCall(payload);
        const finalText = text || 'Tidak ada insight';

        insightBox.innerHTML = `<p>${finalText}</p>`;
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
            data = { tasks: await getTasks(), schedules: await getSchedules() };
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
            data = await getTransactions();
            const income = data.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const expense = data.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

            const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
            const budgets = await getBudgets();

            prompt = `Anda adalah CFO/Penasihat Keuangan Profesional. Berikan analisis mendalam terhadap data keuangan berikut:

            Pemasukan: ${formatCurrency(income)}
            Pengeluaran: ${formatCurrency(expense)}
            Arus Kas Bersih: ${formatCurrency(income - expense)}
            Savings Rate: ${Math.round(savingsRate)}%
            Batas Anggaran (Budget): ${JSON.stringify(budgets)}
            Daftar Transaksi: ${JSON.stringify(data.slice(0, 20))}

            Berikan laporan profesional dalam format HTML:
            <div class="pro-analysis">
                <h4>📊 Executive Summary</h4>
                <p>Analisis kondisi kesehatan finansial saat ini menggunakan metrik standar industri.</p>
                
                <h4>🔍 Breakdown & Efisiensi</h4>
                <p>Evaluasi efisiensi pengeluaran. Identifikasi kategori yang melebihi budget atau menunjukkan anomali.</p>
                
                <h4>💡 Strategi Wealth Management</h4>
                <ul>
                    <li>Actionable step 1: Penghematan/Optimasi.</li>
                    <li>Actionable step 2: Alokasi surplus (jika ada) ke instrumen investasi/dana darurat.</li>
                </ul>
                
                <h4>🎯 KPI & Target</h4>
                <p>Rekomendasi target finansial spesifik untuk periode berikutnya untuk mencapai kebebasan finansial.</p>
            </div>

            Gunakan bahasa Indonesia yang formal namun elegan, layaknya laporan dari bank prioritas atau firma konsultasi keuangan.`;
            break;

        case 'habits':
            title = '🧠 Analisis Kebiasaan';
            data = await getHabits();

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
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024
            }
        };
        let text = await unifiedGeminiCall(payload);
        if (!text) text = 'Tidak ada hasil';
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

    setInterval(async () => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);

        if (settings.habitsEnabled && currentTime === settings.habitsTime) {
            const habits = await getHabits();
            const today = getTodayString();
            const undone = habits.filter(h => !h.completedDates?.includes(today));

            if (undone.length > 0) {
                if (typeof sendPremiumNotification === 'function') {
                    sendPremiumNotification('🔔 Reminder Habits', {
                        body: `Kamu punya ${undone.length} habits yang belum selesai hari ini!`,
                        tag: 'habit-reminder'
                    });
                } else {
                    showNotification('🔔 Reminder Habits', `Kamu punya ${undone.length} habits yang belum selesai hari ini!`);
                }
            }
        }

        // Note: Schedule and Prayer reminders are now managed by checkScheduledWidget in js/notifications.js
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

// ===== DAILY SCHEDULE WIDGET MODULE =====
async function updateDailyScheduleWidget() {
    const container = document.getElementById('daily-schedule-list');
    if (!container) return;

    let events = [];
    const now = new Date();
    const todayStr = getTodayString();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const currentDayName = dayNames[now.getDay()];

    // 1. Get Prayer Data
    const prayerData = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAYER_DATA) || '{}');
    let timings = {};
    if (prayerData.key && prayerData.key.includes(todayStr) && prayerData.timings) {
        timings = prayerData.timings;
    } else {
        timings = { 'Fajr': '04:30', 'Dhuhr': '12:00', 'Asr': '15:15', 'Maghrib': '18:00', 'Isha': '19:15' };
    }

    const addMinutes = (timeStr, mins) => {
        let [h, m] = timeStr.split(':').map(Number);
        let date = new Date(2000, 1, 1, h, m);
        date.setMinutes(date.getMinutes() + mins);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    // 2. Add Dynamic Prayers
    events.push({ time: timings['Fajr'], title: 'Sholat Subuh', icon: '🕌', type: 'prayer' });
    events.push({ time: timings['Dhuhr'], title: 'Sholat Dzuhur', icon: '🕌', type: 'prayer' });
    events.push({ time: timings['Asr'], title: 'Sholat Ashar', icon: '🕌', type: 'prayer' });
    events.push({ time: timings['Maghrib'], title: 'Sholat Maghrib', icon: '🕌', type: 'prayer' });
    events.push({ time: timings['Isha'], title: 'Sholat Isya', icon: '🕌', type: 'prayer' });

    // 2.5 Add Saved Routines from DB
    const savedRoutines = await getRoutines();
    savedRoutines.forEach(r => {
        events.push({ time: r.time, title: r.title, icon: r.icon, type: 'routine' });
    });

    // 3. Workout Logic (Pagi jam 05:30)
    if (typeof workoutSchedule !== 'undefined') {
        const todayWorkout = workoutSchedule.find(w => w.day === currentDayName);
        if (todayWorkout && todayWorkout.type !== 'rest') {
            events.push({ time: '05:30', title: `Workout: ${todayWorkout.title}`, icon: '💪', type: 'workout' });
        }
    }

    // 4. Planner/Schedules
    const schedules = await getSchedules();
    const todaySchedules = schedules.filter(s => s.datetime && s.datetime.startsWith(todayStr));
    todaySchedules.forEach(s => {
        const timeStr = s.datetime.split('T')[1].slice(0, 5);
        events.push({ time: timeStr, title: s.title, icon: '📅', type: 'schedule' });
    });

    events.sort((a, b) => a.time.localeCompare(b.time));

    container.innerHTML = events.map((e, index) => {
        const isPast = e.time < now.toTimeString().slice(0, 5);
        return `
            <div class="timeline-item" style="display: flex; gap: 12px; align-items: stretch; position: relative;">
                <div style="width: 45px; text-align: right; font-size: 0.85rem; font-weight: 700; color: ${isPast ? 'var(--text-muted)' : 'var(--primary)'}; padding-top: 14px; opacity: ${isPast ? '0.6' : '1'};">
                    ${e.time}
                </div>
                <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 2px; height: 14px; background: ${index === 0 ? 'transparent' : 'var(--border)'};"></div>
                    <div style="width: 28px; height: 28px; border-radius: 50%; background: ${isPast ? 'var(--bg-card)' : 'var(--surface)'}; border: 2px solid ${isPast ? 'var(--border)' : 'var(--primary)'}; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; z-index: 2; opacity: ${isPast ? '0.6' : '1'};">
                        ${e.icon}
                    </div>
                    ${index !== events.length - 1 ? `<div style="width: 2px; flex: 1; background: var(--border);"></div>` : `<div style="width: 2px; height: 14px; background: transparent;"></div>`}
                </div>
                <div style="flex: 1; padding: 10px 0; margin-bottom: 2px; opacity: ${isPast ? '0.6' : '1'};">
                    <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 12px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary); text-decoration: ${e.type === 'routine' && isPast ? 'line-through' : 'none'};">${e.title}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ===== WEEKLY EXECUTIVE REPORT =====
async function generateWeeklyExecutiveReport() {
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('Atur API key dulu di Settings!');
        if (typeof showSettings === 'function') showSettings();
        return;
    }

    if (typeof showAnalysisModal === 'function') {
        showAnalysisModal('📈 Meracik Rapor Mingguan...');
    }

    const today = new Date();
    const dates = [];
    for(let i=6; i>=0; i--) {
        let d = new Date();
        d.setDate(today.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }

    // 1. Finance
    const txs = await getTransactions();
    const recentTxs = txs.filter(t => dates.includes(t.date));
    const income = recentTxs.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
    const expense = recentTxs.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);

    // 2. Habits
    const habits = await getHabits();
    let habitData = habits.map(h => {
        const doneCount = (h.completedDates || []).filter(d => dates.includes(d)).length;
        return { name: h.name, doneCount_out_of_7: doneCount };
    });

    // 3. Tasks
    const tasks = await getTasks();
    const doneRecent = tasks.filter(t => t.done && t.updatedAt && dates.includes(t.updatedAt.split('T')[0])).length;
    const pendingCount = tasks.filter(t => !t.done).length;

    // 4. Journals
    const journals = await getJournals();
    const recentJournals = journals.filter(j => dates.includes(j.createdAt.split('T')[0]));
    const moodCounts = {};
    recentJournals.forEach(j => {
        let m = j.mood || 'biasa';
        moodCounts[m] = (moodCounts[m] || 0) + 1;
    });

    // 5. Islamic
    let subuhCount = 0;
    if(typeof getIslamicTrackByDate === 'function') {
        for(let d of dates) {
            let tr = await getIslamicTrackByDate(d);
            if (tr?.prayers?.subuh) subuhCount++;
        }
    }

    // 6. Workout
    let workoutCount = 0;
    if(typeof workoutState !== 'undefined' && workoutState.history) {
        workoutCount = dates.filter(d => workoutState.history[d]).length;
    }

    const compiledData = JSON.stringify({
        dateRange: `${dates[0]} to ${dates[6]}`,
        finance: { income, expense, net: income - expense },
        tasks: { completedThisWeek: doneRecent, currentlyPending: pendingCount },
        habits: habitData,
        moods: moodCounts,
        spiritual: { subuhCompleted: subuhCount },
        fitness: { workoutDays: workoutCount }
    });

    const prompt = `Anda adalah "Senior Executive Consultant" pribadi. Berdasarkan data 7 hari terakhir, buatlah Laporan Eksekutif (Rapor) untuk dikirim ke CEO (pengguna).
    Analisis data mentah berikut secara Kritis dan Tajam:
    ${compiledData}

    FORMAT HTML OUTPUT (Wajib Rapi dan Profesional):
    <div id="executive-pdf-content" style="font-family: Arial, sans-serif; color: #1e293b;">
        <h2 style="color: #0f172a; text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px;">Executive Weekly Report</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <span>Periode: ${dates[0]} s/d ${dates[6]}</span>
            <span style="font-weight: bold; font-size: 1.2rem; background: #4f46e5; color: white; padding: 4px 12px; border-radius: 4px;">GRADE: [Nilai A/B/C/D]</span>
        </div>
        
        <h3 style="color: #334155;">📊 Executive Summary</h3>
        <p>[2 paragraf padat berisi inti kinerja minggu ini. Beri pujian jika bagus, kritik keras jika jelek/malas.]</p>
        
        <h3 style="color: #334155;">🔍 Performance Breakdown</h3>
        <ul style="line-height: 1.6;">
            <li><b>💰 Keuangan:</b> [Analisis arus kas berserta angka]</li>
            <li><b>⚡ Produktivitas & Habit:</b> [Analisis penyelesaian task & kebiasaan]</li>
            <li><b>🧘 Kebugaran & Mental:</b> [Analisis mood & workout]</li>
            <li><b>🕌 Spiritual:</b> [Analisis kelengkapan ibadah, beri teguran jika Subuh bolong]</li>
        </ul>
        
        <h3 style="color: #334155; border-top: 1px solid #cbd5e1; padding-top: 10px;">💡 Top 3 Tactic & Strategy (Minggu Depan)</h3>
        <ol style="line-height: 1.6;">
            <li>[Strategi konkrit 1 berdasarkan kelemahan/peluang minggu ini]</li>
            <li>[Strategi konkrit 2]</li>
            <li>[Strategi konkrit 3]</li>
        </ol>
    </div>
    
    Jangan berikan kata pembuka/penutup seperti "Tentu,". Hanya kembalikan elemen HTML murni (tanpa tag \`\`\`html).`;

    try {
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        };
        let text = await unifiedGeminiCall(payload);
        if (!text) text = 'Gagal memproses.';
        text = text.replace(/```html/gi, '').replace(/```/g, '');

        const contentDiv = document.getElementById('analysis-content');
        if (contentDiv) {
            // Wrapping AI response in a guaranteed ID container for PDF export
            const wrappedContent = `
                <div id="executive-pdf-content" style="font-family: Arial, sans-serif; color: #1e293b; background: white; padding: 30px;">
                    ${text}
                </div>
            `;

            contentDiv.innerHTML = wrappedContent + `
            <div style="margin-top: 25px; text-align: center;">
                <button class="btn btn-primary" onclick="exportReportToPDF()" style="background: #10b981; border: none; font-weight: bold; padding: 10px 20px; font-size: 1rem;">
                    📥 Unduh PDF Laporan
                </button>
            </div>`;
            document.getElementById('analysis-loading').classList.add('hidden');
            document.getElementById('analysis-title').textContent = '📈 Weekly CEO Report';
        }


    } catch (e) {
        console.error(e);
        const contentDiv = document.getElementById('analysis-content');
        if (contentDiv) {
            contentDiv.innerHTML = `<p style="color: red;">Gagal mengambil data laporan: ${e.message}</p>`;
            document.getElementById('analysis-loading').classList.add('hidden');
        }
    }
}

async function exportReportToPDF() {
    const el = document.getElementById('executive-pdf-content') || document.getElementById('analysis-content');
    if (!el) {
        alert('Laporan tidak ditemukan.');
        return;
    }

    // Ensure the element is visible and has white background for capture
    const originalBackground = el.style.background;
    el.style.background = 'white';
    el.style.color = '#1e293b';

    const opt = {
        margin:       0.5,
        filename:     `JurnalAI_Weekly_Report_${getTodayString()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            letterRendering: true
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    const triggerExport = (lib) => {
        lib().set(opt).from(el).toPdf().get('pdf').then(function (pdf) {
            // Restore styles after rendering
            el.style.background = originalBackground;
        }).save();
    };

    if (typeof html2pdf === 'function') {
        triggerExport(html2pdf);
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => {
            triggerExport(html2pdf);
        };
        document.head.appendChild(script);
    }
}


// ===== JARVIS DAILY WISDOM MODULE =====
async function updateJarvisWisdom(force = false) {
    const textEl = document.getElementById('jarvis-wisdom-text');
    if (!textEl) return;

    const todayStr = getTodayString();
    const storageKey = 'jurnal_ai_jarvis_wisdom_cache';
    const cached = JSON.parse(localStorage.getItem(storageKey) || '{}');

    // Use cache if same day and not forced
    if (!force && cached.date === todayStr && cached.text) {
        textEl.textContent = cached.text;
        return;
    }

    textEl.style.opacity = '0.5';
    textEl.textContent = "Menganalisis data Boss...";

    try {
        // 1. Get Context Summary (No API call yet, just local aggregation)
        const context = await aggregateUserContext();
        
        // 2. Prepare Prompt
        const prompt = `You are Jarvis (Iron Man style). Based on this summarized user data, give ONE sentence of proactive advice or a dry wit observation for today. 
        Keep it under 20 words. Use Boss/Sir. Respond in Indonesian.
        Data: ${context}`;

        // 3. Call AI (Minimal version uses existing callAI structure if available or direct fetch)
        const response = await callJarvisMinimal(prompt);
        
        if (response) {
            textEl.textContent = `"${response}"`;
            textEl.style.opacity = '1';
            // Cache it
            localStorage.setItem(storageKey, JSON.stringify({ date: todayStr, text: `"${response}"` }));
        }
    } catch (e) {
        console.error('Wisdom Error:', e);
        textEl.textContent = "Data siap, silakan tanya apa saja Boss.";
        textEl.style.opacity = '1';
    }
}

async function callJarvisMinimal(prompt) {
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : localStorage.getItem('gemini_api_key');
    if (!apiKey) return null;

    try {
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 60 }
        };
        const responseText = await unifiedGeminiCall(payload);
        return responseText?.trim() || null;
    } catch (e) {
        console.error('Jarvis API Error:', e);
        return null;
    }
}
