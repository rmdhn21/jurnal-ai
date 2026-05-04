// ===== DASHBOARD WIDGETS SYSTEM =====
const WIDGET_REGISTRY = {
    'morning-briefing': {
        id: 'morning-briefing',
        title: 'Morning Briefing',
        icon: '🌅',
        html: `<div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05)); border: 1px solid rgba(59, 130, 246, 0.2);">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">🌅</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; position: relative; z-index: 1;">
                        <h3 id="briefing-greeting" style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🌅</span> Selamat Pagi!
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #3b82f6; background: rgba(59, 130, 246, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3); text-transform: uppercase;">JARVIS BRIEFING</span>
                    </div>
                    <div id="briefing-content" style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; position: relative; z-index: 1;">
                        Memuat briefing harian Anda...
                    </div>
               </div>`,
        init: async () => { 
            const greetingEl = document.getElementById('briefing-greeting');
            const contentEl = document.getElementById('briefing-content');
            if(!greetingEl || !contentEl) return;

            const hour = new Date().getHours();
            let greeting = 'Selamat Pagi';
            let icon = '🌅';
            if (hour >= 12 && hour < 15) { greeting = 'Selamat Siang'; icon = '☀️'; }
            else if (hour >= 15 && hour < 18) { greeting = 'Selamat Sore'; icon = '🌇'; }
            else if (hour >= 18) { greeting = 'Selamat Malam'; icon = '🌙'; }
            
            greetingEl.innerHTML = `<span>${icon}</span> ${greeting}, Kapten!`;

            // Compile briefing data
            let briefingHtml = `<ul style="padding-left: 20px; margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">`;
            
            // Finance Briefing (sinkron dengan logika Batas Aman Harian)
            if (typeof getWallets === 'function') {
                const wallets = await getWallets();
                const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
                const totalReserve = wallets.length * 100000; // 100k cadangan per dompet
                const spendableBalance = Math.max(0, totalBalance - totalReserve);
                
                const now = new Date();
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                const daysRemaining = daysInMonth - now.getDate() + 1;
                
                const safeDaily = daysRemaining > 0 ? Math.floor(spendableBalance / daysRemaining) : 0;
                briefingHtml += '<li>\ud83d\udcb0 <strong>Budget Aman Hari Ini:</strong> <span style="color:#10b981; font-weight:bold;">Rp ' + safeDaily.toLocaleString('id-ID') + '</span></li>';
            }

            // Stoic Briefing
            const storedAura = localStorage.getItem('jurnal_ai_stoic_tasks');
            if (storedAura) {
                const tasks = JSON.parse(storedAura);
                const pending = tasks.filter(t => !t.isCompleted).length;
                briefingHtml += `<li>🗡️ <strong>Misi Stoic:</strong> Tersisa <span style="color:#f59e0b; font-weight:bold;">${pending} misi</span> untuk memperkuat karakter Anda hari ini.</li>`;
            }

            briefingHtml += `<li>✅ Jangan lupa cek <strong>Habit Tracker</strong> Anda di bawah!</li>`;
            briefingHtml += `</ul>`;
            
            contentEl.innerHTML = briefingHtml;
        }
    },
    'habit-tracker': {
        id: 'habit-tracker',
        title: 'Daily Habit Tracker',
        icon: '🌱',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.2);">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">🌱</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🌱</span> Habit Checklist
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">DISIPLIN</span>
                    </div>
                    <div id="habit-tracker-list" style="display: flex; flex-direction: column; gap: 8px; position: relative; z-index: 1;"></div>
               </div>`,
        init: () => {
            const listEl = document.getElementById('habit-tracker-list');
            if(!listEl) return;

            const today = new Date().toISOString().split('T')[0];
            const habits = [
                { id: 'h1', icon: '🌙', name: 'Tahajjud' },
                { id: 'h2', icon: '☀️', name: 'Dhuha' },
                { id: 'h3', icon: '📚', name: 'Membaca Buku (10 Halaman)' },
                { id: 'h4', icon: '🏋️', name: 'Olahraga Beban / Fisik' }
            ];

            let storedHabits = JSON.parse(localStorage.getItem('jurnal_ai_habits_daily')) || {};
            if (storedHabits.date !== today) {
                storedHabits = { date: today, completed: [] };
                localStorage.setItem('jurnal_ai_habits_daily', JSON.stringify(storedHabits));
            }

            const renderHabits = () => {
                listEl.innerHTML = habits.map(h => {
                    const isDone = storedHabits.completed.includes(h.id);
                    const borderColor = isDone ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.05)';
                    const textStyle = isDone ? 'opacity: 0.6; text-decoration: line-through;' : '';
                    const circBorder = isDone ? '#10b981' : '#64748b';
                    const circBg = isDone ? '#10b981' : 'transparent';
                    const checkMark = isDone ? '✓' : '';
                    return '<div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 10px 12px; border-radius: 8px; border: 1px solid ' + borderColor + '; transition: all 0.2s; cursor: pointer;" onclick="toggleHabit(\'' + h.id + '\')">' +
                        '<div style="display: flex; align-items: center; gap: 10px; ' + textStyle + '">' +
                            '<span>' + h.icon + '</span>' +
                            '<strong>' + h.name + '</strong>' +
                        '</div>' +
                        '<div style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid ' + circBorder + '; background: ' + circBg + '; display: flex; align-items: center; justify-content: center; font-size: 14px; color: white;">' +
                            checkMark +
                        '</div>' +
                    '</div>';
                }).join('');
            };

            window.toggleHabit = (id) => {
                if (storedHabits.completed.includes(id)) {
                    storedHabits.completed = storedHabits.completed.filter(x => x !== id);
                } else {
                    storedHabits.completed.push(id);
                    if (typeof addXP === 'function') addXP(10);
                    
                    // Log to RPG Stats (Weekly Growth)
                    const habitLog = JSON.parse(localStorage.getItem('jurnal_ai_habit_log') || '[]');
                    habitLog.push({ id: id, date: today, timestamp: Date.now() });
                    localStorage.setItem('jurnal_ai_habit_log', JSON.stringify(habitLog.slice(-100)));
                }
                localStorage.setItem('jurnal_ai_habits_daily', JSON.stringify(storedHabits));
                renderHabits();
                if (typeof updateStreakLog === 'function') updateStreakLog();
                if (typeof refreshWidget === 'function') refreshWidget('rpg-stats');
            };

            renderHabits();
        }
    },
    'profile': {
        id: 'profile',
        title: 'User Profile & XP',
        icon: '👤',
        html: `<!-- Gamification Profile Card -->
               <div id="user-profile-card"></div>`,
        init: () => { if (typeof initGamification === 'function') initGamification(); }
    },
    'overview': {
        id: 'overview',
        title: 'Ringkasan Stats',
        icon: '📊',
        html: `<div class="dashboard-grid">
                    <div class="dashboard-card stat-premium" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(0, 0, 0, 0.4)); border: 1px solid rgba(99, 102, 241, 0.2);">
                        <div class="stat-blur-icon">📝</div>
                        <div class="dashboard-stat" id="stat-journals">0</div>
                        <div class="dashboard-label">Total Jurnal</div>
                    </div>
                    <div class="dashboard-card stat-premium" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(0, 0, 0, 0.4)); border: 1px solid rgba(245, 158, 11, 0.2);">
                        <div class="stat-blur-icon">⏳</div>
                        <div class="dashboard-stat" id="stat-tasks">0</div>
                        <div class="dashboard-label">Belum Dilakukan</div>
                    </div>
                    <div class="dashboard-card stat-premium" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 0, 0, 0.4)); border: 1px solid rgba(16, 185, 129, 0.2);">
                        <div class="stat-blur-icon">💰</div>
                        <div class="dashboard-stat" id="stat-balance">Rp 0</div>
                        <div class="dashboard-label">Saldo</div>
                    </div>
                    <div class="dashboard-card stat-premium" id="streak-card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(0, 0, 0, 0.4)); border: 1px solid rgba(239, 68, 68, 0.2);">
                        <div class="stat-blur-icon">🔥</div>
                        <div class="dashboard-stat" id="current-streak">0</div>
                        <div class="dashboard-label">Best Streak</div>
                    </div>
               </div>`,
        init: () => { if (typeof updateDashboardStats === 'function') updateDashboardStats(); }
    },

    'prayer': {
        id: 'prayer',
        title: 'Jadwal Sholat',
        icon: '🕌',
        html: `<div class="dashboard-card" id="prayer-card" style="grid-column: span 2; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -15px; right: -25px; opacity: 0.03; font-size: 9rem; pointer-events: none;">🕌</div>
                    <div class="prayer-card-header" style="position: relative; z-index: 1;">
                        <div class="prayer-card-left">
                            <span class="prayer-card-icon">🕌</span>
                            <div>
                                <div class="prayer-card-location" id="prayer-location">...</div>
                                <div class="prayer-card-name" id="next-prayer-name">...</div>
                            </div>
                        </div>
                        <div class="prayer-card-right">
                            <div class="prayer-card-time" id="next-prayer-time">...</div>
                            <div class="prayer-card-countdown" id="next-prayer-countdown">...</div>
                        </div>
                    </div>
                    <div class="prayer-list-mini" id="prayer-list-mini" style="position: relative; z-index: 1;"></div>
               </div>`,
        init: () => { 
            if (typeof updateDashboardPrayerCard === 'function') {
                updateDashboardPrayerCard();
                setInterval(updateDashboardPrayerCard, 60000);
            }
            if (typeof startPrayerCountdown === 'function') startPrayerCountdown();
        }
    },
    'motivation': {
        id: 'motivation',
        title: 'Motivasi Harian',
        icon: '💡',
        html: `<div class="card mt-md" id="motivation-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">💡</div>
                    <div style="position: relative; z-index: 1;">
                        <p class="text-muted">Memuat...</p>
                    </div>
               </div>`,
        init: () => { if (typeof initMotivation === 'function') initMotivation(); }
    },
    'brain-boost': {
        id: 'brain-boost',
        title: 'Brain Boost',
        icon: '🧠',
        html: `<div class="card mt-md" id="brain-boost-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">🧠</div>
                    <div class="brain-header-row" style="position: relative; z-index: 1; display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 12px;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🧠</span> Brain Boost
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #fbbf24; background: rgba(251, 191, 36, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(251, 191, 36, 0.3); text-transform: uppercase;">DAILY XP</span>
                    </div>
                    <div class="brain-tabs" style="position: relative; z-index: 1;">
                        <button class="brain-tab active" onclick="switchTab('fact')">💡 Fakta</button>
                        <button class="brain-tab" onclick="switchTab('vocab')">🇬🇧 Vocab</button>
                        <button class="brain-tab" onclick="switchTab('math')">🧮 Math</button>
                        <button class="brain-tab" onclick="switchTab('logic')">🧩 Logic</button>
                        <button class="brain-tab" onclick="switchTab('myth')">🕵️ Mitos</button>
                    </div>
                    <div id="brain-content" class="brain-content mt-sm" style="position: relative; z-index: 1;"></div>
               </div>`,
        init: () => { if (typeof initBrainBoost === 'function') initBrainBoost(); }
    },
    'hadith': {
        id: 'hadith',
        title: 'Hadits Harian',
        icon: '✨',
        html: `<div class="card mt-md hadith-card-container" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">✨</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>✨</span> Hadits Harian
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">ISLAMIC</span>
                    </div>
                    <div id="hadith-content" class="hadith-content" style="position: relative; z-index: 1;"></div>
               </div>`,
        init: () => { if (typeof initHadithCard === 'function') initHadithCard(); }
    },
    'finance-budget': {
        id: 'finance-budget',
        title: 'Batas Aman Harian',
        icon: '🛡️',
        html: `<div class="card mt-md" id="global-budget-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">🛡️</div>
                    <div class="budget-card-header" style="position: relative; z-index: 1; display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 12px;">
                        <h3 id="budget-title" style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🛡️</span> Batas Aman Harian
                        </h3>
                        <span id="global-budget-text" class="text-muted" style="font-weight:bold; font-size: 0.9rem;">...</span>
                    </div>
                    <div class="progress-bar" style="position: relative; z-index: 1; margin: 15px 0;">
                        <div id="global-budget-progress" class="progress-fill" style="width: 0%"></div>
                    </div>
                    <small id="budget-hint-text" class="text-muted budget-card-hint" style="position: relative; z-index: 1;">Sisa saldo dibagi hari tersisa sampai gajian tgl 1.</small>
               </div>`,
        init: () => { if (typeof initGlobalBudgetUI === 'function') initGlobalBudgetUI(); }
    },
    'reminders': {
        id: 'reminders',
        title: 'Reminder & Jadwal',
        icon: '🔔',
        html: `<div class="card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">🔔</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🔔</span> Reminder & Jadwal
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #f59e0b; background: rgba(245, 158, 11, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.3); text-transform: uppercase;">AGENDA</span>
                    </div>
                    <div id="dashboard-reminders" class="reminder-list" style="position: relative; z-index: 1;"></div>
               </div>`,
        init: () => { if (typeof updateDashboardReminders === 'function') updateDashboardReminders(); }
    },

    'hsse-center': {
        id: 'hsse-center',
        title: 'HSE Performance Center',
        icon: '🛡️',
        html: `<div class="card mt-md" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.05)); border: 1px solid rgba(16, 185, 129, 0.2); position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -20px; right: -20px; opacity: 0.05; font-size: 8rem; pointer-events: none;">🛡️</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🛡️</span> HSE Performance Center
                        </h3>
                        <span style="font-size: 0.6rem; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 3px 8px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.2); text-transform: uppercase;">OFFICIAL</span>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px; position: relative; z-index: 1; line-height: 1.4;">Kelola Laporan WAG, JMP ST-191, Kolase Foto, dan Checklist Demobilisasi dalam satu hub.</p>
                    <button class="btn btn-primary" onclick="navigateToSubscreen('hse-center')" style="width: 100%; border-radius: 12px; font-weight: 700; background: var(--success); border: none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
                        🚀 Masuk Pusat HSE
                    </button>
               </div>`,
        init: () => {}
    },

    'calendar': {
        id: 'calendar',
        title: 'Kalender & Event',
        icon: '📅',
        html: `<div class="card calendar-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">📅</div>
                    <div class="calendar-view" style="position: relative; z-index: 1;">
                        <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                            <h3 id="dashboard-calendar-month-year" style="margin: 0; display: flex; align-items: center; gap: 8px;">
                                <span>📅</span> ...
                            </h3>
                            <span style="font-size: 0.65rem; font-weight: 800; color: #818cf8; background: rgba(99, 102, 241, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(99, 102, 241, 0.3); text-transform: uppercase;">PLANNER</span>
                        </div>
                        <div class="calendar-grid" id="dashboard-calendar-grid"></div>
                        <div id="dashboard-selected-date-events" class="selected-date-events" style="display: none; margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <h4 id="dashboard-selected-date-label" style="font-size: 0.8rem; margin: 0 0 10px 0; color: var(--text-muted);">Events</h4>
                            <ul id="dashboard-selected-date-list" class="date-events-list" style="list-style: none; padding: 0; margin: 0;">
                                <!-- Injected by JS -->
                            </ul>
                        </div>
                    </div>

               </div>`,
        init: () => { if (typeof renderCalendar === 'function') renderCalendar(); }
    },
    'daily-schedule': {
        id: 'daily-schedule',
        title: 'Timeline Jadwal Harian',
        icon: '🕒',
        html: `<div class="card p-0 mt-md" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">🕒</div>
                    <div class="p-4" style="background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--border); position: relative; z-index: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                                <span>🕒</span> Smart Day Timeline
                            </h3>
                            <span style="font-size: 0.65rem; font-weight: 800; color: #3b82f6; background: rgba(59, 130, 246, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3); text-transform: uppercase;">LIVE SYNC</span>
                        </div>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 5px; margin-bottom: 0;">Jadwal otomatis & tersinkronisasi.</p>
                    </div>
                    <div id="daily-schedule-list" style="padding: 15px; position: relative; z-index: 1;"></div>
               </div>`,
        init: () => { if (typeof updateDailyScheduleWidget === 'function') updateDailyScheduleWidget(); }
    },
    'life-balance': {
        id: 'life-balance',
        title: 'Life Balance Radar',
        icon: '🕸️',
        html: `<div class="card" style="position: relative; overflow: hidden; min-height: 280px; display: flex; flex-direction: column;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">🕸️</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🕸️</span> Life Balance Matrix
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">ANALYSIS</span>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 10px;">Visualisasi keseimbangan antar-pilar kehidupan.</p>
                    <div style="flex: 1; min-height: 200px; position: relative;">
                         <canvas id="life-balance-chart"></canvas>
                    </div>
               </div>`,
        init: () => { 
            if (typeof lifeBalance !== 'undefined' && lifeBalance.init) {
                lifeBalance.init();
            }
        }
    },
    'weekly-report': {
        id: 'weekly-report',
        title: 'Weekly Executive Report',
        icon: '📈',
        html: `<div class="card mt-md" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid #334155; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">📈</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="color: #f8fafc; margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>📈</span> Executive AI Report
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #818cf8; background: rgba(99, 102, 241, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(99, 102, 241, 0.3); text-transform: uppercase;">Weekly CEO</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 0.8rem; line-height: 1.5; margin-bottom: 15px; position: relative; z-index: 1;">Evaluasi komprehensif 7 hari terakhir: Produktivitas, Keuangan, Kebugaran, Ibadah & Habit. Dilengkapi Rating (Grade) AI.</p>
                    <button class="btn btn-primary btn-full" onclick="generateWeeklyExecutiveReport()" style="background: #4f46e5; border: none; font-weight: 700; border-radius: 8px; position: relative; z-index: 1; padding: 12px;">
                        📊 Generate Laporan Mingguan
                    </button>
               </div>`,
        init: () => {}
    },
    'quick-note': {
        id: 'quick-note',
        title: 'Catatan Cepat',
        icon: '📝',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(234, 179, 8, 0.05), rgba(0, 0, 0, 0.2)); border: 1px solid rgba(234, 179, 8, 0.2);">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">📝</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>📝</span> Catatan Cepat
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #eab308; background: rgba(234, 179, 8, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(234, 179, 8, 0.3); text-transform: uppercase;">AUTO-SAVE</span>
                    </div>
                    <textarea id="widget-quick-note" placeholder="Ketik ide, to-do sementara, atau catatan di sini..." style="width: 100%; min-height: 120px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #f8fafc; padding: 15px; font-size: 0.95rem; resize: vertical; position: relative; z-index: 1; outline: none; line-height: 1.5;"></textarea>
                    <div id="quick-note-saved" style="font-size: 0.75rem; color: #10b981; margin-top: 8px; opacity: 0; transition: opacity 0.3s; position: relative; z-index: 1; display: flex; align-items: center; gap: 4px;">
                        <span>✅</span> Tersimpan otomatis ke memori lokal
                    </div>
               </div>`,
        init: () => { 
            const textarea = document.getElementById('widget-quick-note');
            const savedMsg = document.getElementById('quick-note-saved');
            if(textarea) {
                // Focus styling
                textarea.addEventListener('focus', () => {
                    textarea.style.borderColor = 'rgba(234, 179, 8, 0.5)';
                    textarea.style.background = 'rgba(0,0,0,0.4)';
                });
                textarea.addEventListener('blur', () => {
                    textarea.style.borderColor = 'rgba(255,255,255,0.1)';
                    textarea.style.background = 'rgba(0,0,0,0.3)';
                });
                // Logic
                textarea.value = localStorage.getItem('jurnal_ai_quick_note') || '';
                let timeout;
                textarea.addEventListener('input', () => {
                    clearTimeout(timeout);
                    localStorage.setItem('jurnal_ai_quick_note', textarea.value);
                    savedMsg.style.opacity = '1';
                    timeout = setTimeout(() => savedMsg.style.opacity = '0', 2500);
                });
            }
        }
    },

    'rpg-stats': {
        id: 'rpg-stats',
        title: 'RPG Character Stats',
        icon: '⚔️',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(139, 92, 246, 0.3); background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(0, 0, 0, 0.3));">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">⚔️</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>⚔️</span> Character Stats
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #a78bfa; background: rgba(139, 92, 246, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(139, 92, 246, 0.3); text-transform: uppercase;">RPG MODE</span>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 10px; position: relative; z-index: 1;">Atribut karakter diukur dari aktivitas harian Anda.</p>
                    <div style="min-height: 220px; position: relative; z-index: 1;">
                        <canvas id="rpg-stats-chart"></canvas>
                    </div>
                    <div id="rpg-stats-summary" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px; position: relative; z-index: 1;"></div>
               </div>`,
        init: async () => {
            const ctx = document.getElementById('rpg-stats-chart');
            if (!ctx) return;

            // Calculate stats
            let strScore = 0, wisScore = 0, disScore = 0, chaScore = 0;

            // 1. STR: Workout completions (Last 7 Days)
            let workoutLog = JSON.parse(localStorage.getItem('jurnal_ai_workout_log') || '[]');
            const recentWorkouts = workoutLog.filter(w => (Date.now() - (w.timestamp || 0)) < 7 * 86400000);
            strScore = Math.min(100, recentWorkouts.length * 10);

            // 2. WIS: Stoic missions completed (Last 7 Days)
            let stoicLog = JSON.parse(localStorage.getItem('jurnal_ai_stoic_log') || '[]');
            // Self-Correction: Jika log kosong tapi ada misi selesai hari ini, masukkan ke log
            if (stoicLog.length === 0) {
                const stoicTasks = JSON.parse(localStorage.getItem('jurnal_ai_stoic_tasks') || '[]');
                stoicTasks.forEach(t => { if (t.isCompleted) stoicLog.push({ id: t.id, timestamp: Date.now() }); });
                if (stoicLog.length > 0) localStorage.setItem('jurnal_ai_stoic_log', JSON.stringify(stoicLog));
            }
            const recentStoic = stoicLog.filter(s => (Date.now() - (s.timestamp || 0)) < 7 * 86400000);
            wisScore = Math.min(100, recentStoic.length * 5);

            // 3. DIS: Habit completion (Last 7 Days)
            let habitLog = JSON.parse(localStorage.getItem('jurnal_ai_habit_log') || '[]');
            // Self-Correction: Jika log kosong tapi ada habit selesai hari ini, masukkan ke log
            if (habitLog.length === 0) {
                const habitsData = JSON.parse(localStorage.getItem('jurnal_ai_habits_daily') || '{}');
                (habitsData.completed || []).forEach(id => { habitLog.push({ id: id, timestamp: Date.now() }); });
                if (habitLog.length > 0) localStorage.setItem('jurnal_ai_habit_log', JSON.stringify(habitLog));
            }
            const recentHabits = habitLog.filter(h => (Date.now() - (h.timestamp || 0)) < 7 * 86400000);
            disScore = Math.min(100, recentHabits.length * 3);

            // CHA: XP level as proxy for overall authority
            let chaXp = 0;
            if (typeof getGamificationStats === 'function') {
                try {
                    const gStats = await getGamificationStats();
                    chaXp = gStats.xp || 0;
                } catch(e) {}
            }
            chaScore = Math.min(100, Math.floor(chaXp / 100)); // 10,000 XP to max 100 on radar

            // Render summary boxes
            const summaryEl = document.getElementById('rpg-stats-summary');
            if (summaryEl) {
                var items = [
                    { label: 'STR', val: strScore, color: '#ef4444', emoji: '💪' },
                    { label: 'WIS', val: wisScore, color: '#f59e0b', emoji: '🧠' },
                    { label: 'DIS', val: disScore, color: '#10b981', emoji: '🛡️' },
                    { label: 'CHA', val: chaScore, color: '#8b5cf6', emoji: '👑' }
                ];
                summaryEl.innerHTML = items.map(function(s) {
                    return '<div style="background: rgba(0,0,0,0.2); padding: 6px 8px; border-radius: 6px; border: 1px solid ' + s.color + '33; text-align: center;">' +
                        '<div style="font-size: 0.65rem; color: ' + s.color + '; font-weight: 800;">' + s.emoji + ' ' + s.label + '</div>' +
                        '<div style="font-size: 1rem; font-weight: bold; color: white;">' + s.val + '</div>' +
                    '</div>';
                }).join('');
            }

            // Destroy previous chart if exists
            if (window._rpgChart) window._rpgChart.destroy();

            window._rpgChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['💪 STR (Fisik)', '🧠 WIS (Stoic)', '🛡️ DIS (Disiplin)', '👑 CHA (Otoritas)'],
                    datasets: [{
                        label: 'Character Stats',
                        data: [strScore, wisScore, disScore, chaScore],
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        borderColor: 'rgba(139, 92, 246, 0.8)',
                        borderWidth: 2,
                        pointBackgroundColor: '#a78bfa',
                        pointBorderColor: '#fff',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.08)' },
                            pointLabels: { color: '#cbd5e1', font: { size: 10, weight: 'bold' } },
                            ticks: { display: false, stepSize: 20 },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    },

    'finance-export': {
        id: 'finance-export',
        title: 'Export & Backup Data',
        icon: '💾',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(0,0,0,0.3)); border: 1px solid rgba(16, 185, 129, 0.2);">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">💾</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>💾</span> Export & Backup
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">SAFE</span>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 15px; position: relative; z-index: 1;">Cetak laporan keuangan atau backup seluruh data Anda.</p>
                    <div style="display: flex; flex-direction: column; gap: 8px; position: relative; z-index: 1;">
                        <button class="btn btn-primary" onclick="exportFinanceCSV()" style="border-radius: 8px; font-weight: 700; font-size: 0.8rem;">📊 Export Keuangan (CSV/Excel)</button>
                        <button class="btn btn-secondary" onclick="exportFullBackupJSON()" style="border-radius: 8px; font-weight: 700; font-size: 0.8rem;">💾 Backup Seluruh Data (JSON)</button>
                    </div>
               </div>`,
        init: () => {}
    },

    'streak-calendar': {
        id: 'streak-calendar',
        title: 'Streak Heatmap',
        icon: '🔥',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.2);">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">🔥</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🔥</span> Streak Calendar
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">30 HARI</span>
                    </div>
                    <div id="streak-heatmap" style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px; position: relative; z-index: 1;"></div>
                    <div id="streak-summary" style="margin-top: 10px; font-size: 0.75rem; color: var(--text-muted); position: relative; z-index: 1;"></div>
               </div>`,
        init: () => {
            const heatmap = document.getElementById('streak-heatmap');
            const summary = document.getElementById('streak-summary');
            if (!heatmap) return;

            // Load streak data from localStorage
            var streakData = JSON.parse(localStorage.getItem('jurnal_ai_streak_log') || '{}');
            var today = new Date();
            var totalActive = 0;
            var currentStreak = 0;
            var cells = [];

            for (var i = 29; i >= 0; i--) {
                var d = new Date(today);
                d.setDate(d.getDate() - i);
                var dateStr = d.toISOString().split('T')[0];
                var level = streakData[dateStr] || 0; // 0-4
                if (level > 0) totalActive++;

                var color = 'rgba(255,255,255,0.05)';
                if (level === 1) color = 'rgba(16, 185, 129, 0.2)';
                else if (level === 2) color = 'rgba(16, 185, 129, 0.4)';
                else if (level === 3) color = 'rgba(16, 185, 129, 0.65)';
                else if (level >= 4) color = 'rgba(16, 185, 129, 0.9)';

                var dayLabel = d.getDate();
                cells.push('<div title="' + dateStr + '" style="width: 100%; aspect-ratio: 1; background: ' + color + '; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: rgba(255,255,255,0.4);">' + dayLabel + '</div>');
            }

            // Calculate current streak (consecutive days from today going back)
            for (var j = 0; j <= 29; j++) {
                var dd = new Date(today);
                dd.setDate(dd.getDate() - j);
                var ds = dd.toISOString().split('T')[0];
                if ((streakData[ds] || 0) > 0) {
                    currentStreak++;
                } else {
                    break;
                }
            }

            heatmap.innerHTML = cells.join('');
            if (summary) {
                summary.innerHTML = '🔥 Streak: <strong>' + currentStreak + ' hari</strong> &nbsp;|&nbsp; Aktif: <strong>' + totalActive + '/30</strong> hari';
            }
        }
    },

    'muhasabah': {
        id: 'muhasabah',
        title: 'Muhasabah Malam',
        icon: '🌊',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(99, 102, 241, 0.2); background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(0,0,0,0.3));">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">🌊</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🌊</span> Muhasabah Malam
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #818cf8; background: rgba(99, 102, 241, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(99, 102, 241, 0.3); text-transform: uppercase;">REFLEKSI</span>
                    </div>
                    <div id="muhasabah-container" style="position: relative; z-index: 1;"></div>
               </div>`,
        init: () => {
            var container = document.getElementById('muhasabah-container');
            if (!container) return;

            var today = new Date().toISOString().split('T')[0];
            var stored = JSON.parse(localStorage.getItem('jurnal_ai_muhasabah') || '{}');
            var todayData = stored[today] || {};
            var isSaved = !!todayData.grateful;

            if (isSaved) {
                // Show saved reflection
                var stars = '';
                for (var s = 0; s < 5; s++) stars += (s < (todayData.rating || 0)) ? '⭐' : '☆';
                container.innerHTML = '<div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border-left: 3px solid #818cf8;">' +
                    '<p style="margin: 0 0 5px; font-size: 0.8rem;"><strong>Syukur:</strong> ' + (todayData.grateful || '-') + '</p>' +
                    '<p style="margin: 0 0 5px; font-size: 0.8rem;"><strong>Perbaiki:</strong> ' + (todayData.improve || '-') + '</p>' +
                    '<p style="margin: 0; font-size: 0.9rem;">' + stars + '</p>' +
                '</div>' +
                '<p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 8px;">✅ Refleksi hari ini sudah tercatat. Jazakallah khairan!</p>';
            } else {
                container.innerHTML = '<div style="display: flex; flex-direction: column; gap: 8px;">' +
                    '<input id="muh-grateful" type="text" class="input" placeholder="Apa yang saya syukuri hari ini?" style="font-size: 0.85rem;">' +
                    '<input id="muh-improve" type="text" class="input" placeholder="Apa yang bisa saya perbaiki?" style="font-size: 0.85rem;">' +
                    '<div style="display: flex; align-items: center; gap: 5px;">' +
                        '<span style="font-size: 0.8rem; color: var(--text-muted);">Rating hari ini:</span>' +
                        '<span id="muh-stars" style="font-size: 1.2rem; cursor: pointer;">☆☆☆☆☆</span>' +
                    '</div>' +
                    '<button class="btn btn-primary" onclick="saveMuhasabah()" style="border-radius: 8px; font-size: 0.8rem; font-weight: 700;">💾 Simpan Refleksi</button>' +
                '</div>';

                // Star rating click handler
                var starsEl = document.getElementById('muh-stars');
                if (starsEl) {
                    window._muhRating = 0;
                    starsEl.addEventListener('click', function(e) {
                        var rect = starsEl.getBoundingClientRect();
                        var x = e.clientX - rect.left;
                        var starWidth = rect.width / 5;
                        window._muhRating = Math.ceil(x / starWidth);
                        var display = '';
                        for (var i = 0; i < 5; i++) display += (i < window._muhRating) ? '⭐' : '☆';
                        starsEl.textContent = display;
                    });
                }
            }
        }
    },

    'water-tracker': {
        id: 'water-tracker',
        title: 'Water Tracker',
        icon: '💧',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(59, 130, 246, 0.2);">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">💧</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>💧</span> Water Tracker
                        </h3>
                        <span id="water-count-badge" style="font-size: 0.65rem; font-weight: 800; color: #3b82f6; background: rgba(59, 130, 246, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3); text-transform: uppercase;">0/8 GELAS</span>
                    </div>
                    <div id="water-glasses" style="display: flex; gap: 6px; flex-wrap: wrap; position: relative; z-index: 1;"></div>
                    <button class="btn btn-primary" onclick="addWaterGlass()" style="margin-top: 10px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; width: 100%; position: relative; z-index: 1;">💧 + 1 Gelas Air</button>
               </div>`,
        init: () => {
            var today = new Date().toISOString().split('T')[0];
            var waterData = JSON.parse(localStorage.getItem('jurnal_ai_water') || '{}');
            if (waterData.date !== today) {
                waterData = { date: today, count: 0 };
                localStorage.setItem('jurnal_ai_water', JSON.stringify(waterData));
            }
            renderWaterUI(waterData.count);
        }
    },

    'spending-forecast': {
        id: 'spending-forecast',
        title: 'Prediksi Pengeluaran AI',
        icon: '🔮',
        html: '<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.25); background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(0,0,0,0.3));">' +
                '<div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">🔮</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; position: relative; z-index: 1;">' +
                    '<h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">' +
                        '<span>🔮</span> Prediksi Keuangan' +
                    '</h3>' +
                    '<span style="font-size: 0.65rem; font-weight: 800; color: #f59e0b; background: rgba(245, 158, 11, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.3); text-transform: uppercase;">AI FORECAST</span>' +
                '</div>' +
                '<div id="forecast-content" style="position: relative; z-index: 1; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Menganalisis pola belanja...</div>' +
            '</div>',
        init: async () => {
            var el = document.getElementById('forecast-content');
            if (!el) return;

            try {
                var wallets = typeof getWallets === 'function' ? await getWallets() : [];
                var transactions = typeof getTransactions === 'function' ? await getTransactions() : [];

                var totalBalance = wallets.reduce(function(s, w) { return s + (w.balance || 0); }, 0);
                var totalReserve = wallets.length * 100000;

                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth();
                var daysInMonth = new Date(year, month + 1, 0).getDate();
                var daysPassed = now.getDate();
                var daysRemaining = daysInMonth - daysPassed + 1;

                // Get this month's expenses (excluding transfers)
                var monthExpenses = transactions.filter(function(t) {
                    var d = new Date(t.date);
                    return t.type === 'expense' && d.getMonth() === month && d.getFullYear() === year && !(t.category && t.category.indexOf('Pindah Dana') === 0);
                });

                var totalSpentThisMonth = monthExpenses.reduce(function(s, t) { return s + t.amount; }, 0);
                var avgDailySpend = daysPassed > 0 ? totalSpentThisMonth / daysPassed : 0;
                var projectedMonthSpend = Math.round(avgDailySpend * daysInMonth);
                var projectedRemaining = Math.round(avgDailySpend * (daysRemaining - 1));
                var projectedEndBalance = totalBalance - projectedRemaining;

                // Get this month's income
                var monthIncome = transactions.filter(function(t) {
                    var d = new Date(t.date);
                    return t.type === 'income' && d.getMonth() === month && d.getFullYear() === year && !(t.category && t.category.indexOf('Pindah Dana') === 0);
                }).reduce(function(s, t) { return s + t.amount; }, 0);

                // Top spending category
                var catMap = {};
                monthExpenses.forEach(function(t) {
                    var cat = t.category || 'Lain-lain';
                    catMap[cat] = (catMap[cat] || 0) + t.amount;
                });
                var topCat = '';
                var topCatAmt = 0;
                for (var c in catMap) {
                    if (catMap[c] > topCatAmt) { topCatAmt = catMap[c]; topCat = c; }
                }

                // Determine status
                var statusIcon, statusColor, statusText, adviceText;
                if (projectedEndBalance >= totalReserve) {
                    statusIcon = '✅';
                    statusColor = '#10b981';
                    statusText = 'AMAN';
                    adviceText = 'Pola belanja Anda terkendali. Saldo di akhir bulan diprediksi masih sehat.';
                } else if (projectedEndBalance > 0) {
                    statusIcon = '⚠️';
                    statusColor = '#f59e0b';
                    statusText = 'HATI-HATI';
                    adviceText = 'Saldo akhir bulan diprediksi mendekati batas cadangan. Kurangi pengeluaran non-esensial.';
                } else {
                    statusIcon = '🚨';
                    statusColor = '#ef4444';
                    statusText = 'BAHAYA';
                    adviceText = 'Dengan pola belanja saat ini, saldo Anda diprediksi MINUS di akhir bulan! Segera hemat!';
                }

                var fmtCurrency = typeof formatCurrency === 'function' ? formatCurrency : function(n) { return 'Rp ' + n.toLocaleString('id-ID'); };

                el.innerHTML = '<div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border-left: 3px solid ' + statusColor + '; margin-bottom: 10px;">' +
                    '<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">' +
                        '<span style="font-size: 1.2rem;">' + statusIcon + '</span>' +
                        '<strong style="color: ' + statusColor + '; text-transform: uppercase; font-size: 0.8rem;">' + statusText + '</strong>' +
                    '</div>' +
                    '<p style="margin: 0; font-size: 0.8rem; color: #cbd5e1;">' + adviceText + '</p>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">' +
                    '<div style="background: rgba(0,0,0,0.15); padding: 8px; border-radius: 6px; text-align: center;">' +
                        '<div style="font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase;">Rata-rata/Hari</div>' +
                        '<div style="font-size: 0.85rem; font-weight: bold; color: #f59e0b;">' + fmtCurrency(Math.round(avgDailySpend)) + '</div>' +
                    '</div>' +
                    '<div style="background: rgba(0,0,0,0.15); padding: 8px; border-radius: 6px; text-align: center;">' +
                        '<div style="font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase;">Proyeksi Bulan Ini</div>' +
                        '<div style="font-size: 0.85rem; font-weight: bold; color: ' + statusColor + ';">' + fmtCurrency(projectedMonthSpend) + '</div>' +
                    '</div>' +
                    '<div style="background: rgba(0,0,0,0.15); padding: 8px; border-radius: 6px; text-align: center;">' +
                        '<div style="font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase;">Prediksi Saldo Akhir</div>' +
                        '<div style="font-size: 0.85rem; font-weight: bold; color: ' + (projectedEndBalance >= 0 ? '#10b981' : '#ef4444') + ';">' + fmtCurrency(Math.round(projectedEndBalance)) + '</div>' +
                    '</div>' +
                    '<div style="background: rgba(0,0,0,0.15); padding: 8px; border-radius: 6px; text-align: center;">' +
                        '<div style="font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase;">Boros Terbesar</div>' +
                        '<div style="font-size: 0.85rem; font-weight: bold; color: #ef4444;">' + (topCat || '-') + '</div>' +
                    '</div>' +
                '</div>';
            } catch(e) {
                el.textContent = 'Gagal memuat prediksi.';
            }
        }
    },

};

const DEFAULT_WIDGET_ORDER = [
    'morning-briefing', 'habit-tracker', 'water-tracker', 'profile', 'rpg-stats', 'hsse-center', 'overview', 'quick-note', 'streak-calendar', 'life-balance', 'prayer', 'daily-schedule', 'motivation', 
    'brain-boost', 'hadith', 'finance-budget', 'spending-forecast', 'finance-export', 'muhasabah',
    'reminders', 'calendar', 'weekly-report'
];


async function initDashboardWidgets() {
    const container = document.getElementById('dashboard-widgets-container');
    if (!container) return;

    let userOrder;
    try {
        const storedOrder = localStorage.getItem('jurnal_ai_dashboard_widgets');
        userOrder = storedOrder ? JSON.parse(storedOrder) : [...DEFAULT_WIDGET_ORDER];
        if (!Array.isArray(userOrder)) userOrder = [...DEFAULT_WIDGET_ORDER];
        
        // Remove deleted widgets dynamically
        userOrder = userOrder.filter(w => w !== 'mood-chart' && w !== 'ai-insight');

        // Auto-inject missing new widgets (like daily-schedule)
        let orderChanged = false;
        DEFAULT_WIDGET_ORDER.forEach((id, index) => {
            if (!userOrder.includes(id)) {
                if (index < userOrder.length) userOrder.splice(index, 0, id);
                else userOrder.push(id);
                orderChanged = true;
            }
        });
        if (orderChanged) {
            localStorage.setItem('jurnal_ai_dashboard_widgets', JSON.stringify(userOrder));
        }
    } catch (e) {
        console.error('Failed to parse widget order:', e);
        userOrder = [...DEFAULT_WIDGET_ORDER];
    }
    
    // Clear and render
    container.innerHTML = '';
    
    for (const widgetId of userOrder) {
        const widget = WIDGET_REGISTRY[widgetId];
        if (!widget) continue;

        const widgetWrapper = document.createElement('div');
        widgetWrapper.className = `dashboard-widget-wrapper widget-${widgetId}`;
        widgetWrapper.setAttribute('data-id', widgetId);
        widgetWrapper.innerHTML = widget.html;
        
        container.appendChild(widgetWrapper);
    }

    // After all widgets are in DOM, initialize them
    // Use Promise.allSetled or individual try-catch to ensure one doesn't block others
    for (const widgetId of userOrder) {
        if (WIDGET_REGISTRY[widgetId] && WIDGET_REGISTRY[widgetId].init) {
            try {
                // Use a small timeout for each widget init to prevent total hang
                await Promise.race([
                    Promise.resolve(WIDGET_REGISTRY[widgetId].init()),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Widget Timeout')), 5000))
                ]);
            } catch (e) {
                console.error(`Error initializing widget ${widgetId}:`, e);
            }
        }
    }

    const spinner = container.querySelector('.loading-spinner-container');
    if (spinner) spinner.remove();
}

async function refreshWidget(widgetId) {
    if (WIDGET_REGISTRY[widgetId] && WIDGET_REGISTRY[widgetId].init) {
        try {
            await WIDGET_REGISTRY[widgetId].init();
        } catch (e) {
            console.error(`Error refreshing widget ${widgetId}:`, e);
        }
    }
}

// Add UI for customization
function openWidgetCustomizer() {
    const modalHtml = `
        <div id="widget-settings-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>⚙️ Atur Dashboard</h2>
                    <button class="close-btn" onclick="closeWidgetCustomizer()">✕</button>
                </div>
                <p class="text-muted mb-md">Seret untuk urutkan atau gunakan panah.</p>
                <div id="widget-sort-list" class="widget-sort-list"></div>
                <div class="mt-md" style="display:flex; gap:10px;">
                    <button class="btn btn-primary" style="flex:1" onclick="saveWidgetSettings()">✅ Simpan</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="resetWidgetsToDefault()">🔄 Reset</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    renderWidgetSettingsList();
}

function closeWidgetCustomizer() {
    const modal = document.getElementById('widget-settings-modal');
    if (modal) modal.remove();
}

function renderWidgetSettingsList() {
    const list = document.getElementById('widget-sort-list');
    const userOrder = JSON.parse(localStorage.getItem('jurnal_ai_dashboard_widgets') || JSON.stringify(DEFAULT_WIDGET_ORDER));
    
    list.innerHTML = userOrder.map((id, index) => {
        const widget = WIDGET_REGISTRY[id];
        if (!widget) return '';
        return `
            <div class="widget-sort-item" data-id="${id}">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="widget-icon">${widget.icon}</span>
                    <span class="widget-name">${widget.title}</span>
                </div>
                <div class="widget-sort-actions">
                    <button onclick="moveWidgetUp('${id}')">🔼</button>
                    <button onclick="moveWidgetDown('${id}')">🔽</button>
                </div>
            </div>
        `;
    }).join('');
}

function moveWidgetUp(id) {
    const userOrder = JSON.parse(localStorage.getItem('jurnal_ai_dashboard_widgets') || JSON.stringify(DEFAULT_WIDGET_ORDER));
    const index = userOrder.indexOf(id);
    if (index > 0) {
        [userOrder[index], userOrder[index - 1]] = [userOrder[index - 1], userOrder[index]];
        localStorage.setItem('jurnal_ai_dashboard_widgets', JSON.stringify(userOrder));
        renderWidgetSettingsList();
    }
}

function moveWidgetDown(id) {
    const userOrder = JSON.parse(localStorage.getItem('jurnal_ai_dashboard_widgets') || JSON.stringify(DEFAULT_WIDGET_ORDER));
    const index = userOrder.indexOf(id);
    if (index < userOrder.length - 1) {
        [userOrder[index], userOrder[index + 1]] = [userOrder[index + 1], userOrder[index]];
        localStorage.setItem('jurnal_ai_dashboard_widgets', JSON.stringify(userOrder));
        renderWidgetSettingsList();
    }
}

function saveWidgetSettings() {
    closeWidgetCustomizer();
    window.location.reload(); // Quickest way to re-init everything with new order
}

function resetWidgetsToDefault() {
    localStorage.removeItem('jurnal_ai_dashboard_widgets');
    renderWidgetSettingsList();
}

// ===== MUHASABAH MALAM =====
function saveMuhasabah() {
    var grateful = document.getElementById('muh-grateful');
    var improve = document.getElementById('muh-improve');
    if (!grateful || !grateful.value.trim()) {
        alert('Tuliskan setidaknya 1 hal yang Anda syukuri.');
        return;
    }

    var today = new Date().toISOString().split('T')[0];
    var stored = JSON.parse(localStorage.getItem('jurnal_ai_muhasabah') || '{}');
    stored[today] = {
        grateful: grateful.value.trim(),
        improve: improve ? improve.value.trim() : '',
        rating: window._muhRating || 3
    };
    localStorage.setItem('jurnal_ai_muhasabah', JSON.stringify(stored));

    // Update streak log
    updateStreakLog();

    // Give XP
    if (typeof addXP === 'function') addXP(15);
    alert('✅ Muhasabah tersimpan. Jazakallah khairan!');

    // Re-render widget
    var container = document.getElementById('muhasabah-container');
    if (container) {
        var todayData = stored[today];
        var stars = '';
        for (var s = 0; s < 5; s++) stars += (s < (todayData.rating || 0)) ? '⭐' : '☆';
        container.innerHTML = '<div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border-left: 3px solid #818cf8;">' +
            '<p style="margin: 0 0 5px; font-size: 0.8rem;"><strong>Syukur:</strong> ' + todayData.grateful + '</p>' +
            '<p style="margin: 0 0 5px; font-size: 0.8rem;"><strong>Perbaiki:</strong> ' + (todayData.improve || '-') + '</p>' +
            '<p style="margin: 0; font-size: 0.9rem;">' + stars + '</p>' +
        '</div>' +
        '<p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 8px;">✅ Refleksi hari ini sudah tercatat. Jazakallah khairan!</p>';
    }
}

// ===== WATER TRACKER =====
function renderWaterUI(count) {
    var glassesEl = document.getElementById('water-glasses');
    var badge = document.getElementById('water-count-badge');
    if (!glassesEl) return;

    var html = '';
    for (var i = 0; i < 8; i++) {
        var filled = i < count;
        html += '<div style="width: 30px; height: 36px; border-radius: 4px; border: 2px solid ' + (filled ? '#3b82f6' : 'rgba(255,255,255,0.1)') + '; background: ' + (filled ? 'rgba(59, 130, 246, 0.3)' : 'transparent') + '; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">' + (filled ? '💧' : '') + '</div>';
    }
    glassesEl.innerHTML = html;

    if (badge) {
        badge.textContent = count + '/8 GELAS';
        if (count >= 8) {
            badge.style.color = '#10b981';
            badge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            badge.style.background = 'rgba(16, 185, 129, 0.15)';
        }
    }
}

function addWaterGlass() {
    var today = new Date().toISOString().split('T')[0];
    var waterData = JSON.parse(localStorage.getItem('jurnal_ai_water') || '{}');
    if (waterData.date !== today) {
        waterData = { date: today, count: 0 };
    }

    if (waterData.count >= 8) {
        alert('Target 8 gelas sudah tercapai hari ini! 🎉');
        return;
    }

    waterData.count++;
    localStorage.setItem('jurnal_ai_water', JSON.stringify(waterData));
    renderWaterUI(waterData.count);

    if (waterData.count >= 8) {
        if (typeof addXP === 'function') addXP(10);
        alert('🎉 Target 8 gelas tercapai! +10 XP');
    }

    // Update streak
    updateStreakLog();
}

// ===== STREAK LOGGER =====
// Called from habits, muhasabah, water, etc. to track daily activity level
function updateStreakLog() {
    var today = new Date().toISOString().split('T')[0];
    var streakData = JSON.parse(localStorage.getItem('jurnal_ai_streak_log') || '{}');

    // Count activities done today
    var level = 0;

    // 1. Habits
    var habits = JSON.parse(localStorage.getItem('jurnal_ai_habits_daily') || '{}');
    if (habits.date === today) level += (habits.completed || []).length;

    // 2. Muhasabah
    var muh = JSON.parse(localStorage.getItem('jurnal_ai_muhasabah') || '{}');
    if (muh[today]) level++;

    // 3. Water
    var water = JSON.parse(localStorage.getItem('jurnal_ai_water') || '{}');
    if (water.date === today && water.count >= 4) level++;

    // 4. Stoic
    var stoic = JSON.parse(localStorage.getItem('jurnal_ai_stoic_tasks') || '[]');
    var stoicDone = stoic.filter(function(t) { return t.isCompleted; }).length;
    if (stoicDone > 0) level++;

    // Cap at 4
    streakData[today] = Math.min(4, level);
    localStorage.setItem('jurnal_ai_streak_log', JSON.stringify(streakData));
}

window.initDashboardWidgets = initDashboardWidgets;
window.refreshWidget = refreshWidget;
