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

            briefingHtml += `<li>✅ Jangan lupa cek <strong>Checklist & Pengingat</strong> Anda di bawah!</li>`;
            briefingHtml += `</ul>`;
            contentEl.innerHTML = briefingHtml;
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
        title: 'Checklist & Pengingat',
        icon: '✅',
        html: `<div class="card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">✅</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>✅</span> Checklist & Pengingat
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">AGENDA</span>
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

    'shift-tracker': {
        id: 'shift-tracker',
        title: 'Shift Tracker',
        icon: '📅',
        html: `<div class="card shift-card" style="position: relative; overflow: hidden; padding-bottom: 20px;">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">📅</div>
                    <div class="shift-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>📅</span> Shift Tracker
                        </h3>
                        <div class="month-controls shift-controls" style="display: flex; align-items: center; gap: 10px;">
                            <button id="shift-prevMonth" class="icon-btn focus:outline-none" style="background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 4px; padding: 2px 8px; cursor: pointer;">&lt;</button>
                            <h3 id="shift-currentMonthLabel" style="font-size: 0.9rem; font-weight: 600; min-width: 100px; text-align: center; margin: 0;">Bulan</h3>
                            <button id="shift-nextMonth" class="icon-btn focus:outline-none" style="background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 4px; padding: 2px 8px; cursor: pointer;">&gt;</button>
                        </div>
                    </div>

                    <div class="shift-main-content" style="position: relative; z-index: 1;">
                        <section class="calendar-section glass-panel shift-glass" style="padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.2);">
                            <div class="day-headers shift-day-headers" style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.7rem; color: var(--text-muted); margin-bottom: 5px;">
                                <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
                            </div>
                            <div id="shift-calendarGrid" class="calendar-grid shift-calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">
                                <!-- Days will be generated by JS -->
                            </div>
                        </section>

                        <section class="summary-section glass-panel shift-glass" style="margin-top: 15px; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.2);">
                            <h4 style="font-size: 0.8rem; margin: 0 0 10px 0; color: var(--text-secondary);">Ringkasan Bulan Ini</h4>
                            <div class="summary-grid shift-summary-grid" id="shift-summaryGrid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <!-- Summary items generated by JS -->
                            </div>
                        </section>

                        <section class="salary-section glass-panel shift-glass" style="margin-top: 15px; padding: 15px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <h4 style="font-size: 0.9rem; margin: 0; color: #10b981; display: flex; align-items: center; gap: 6px;"><span>💰</span> Estimasi Gaji</h4>
                                <span id="salary-period-label" style="font-size: 0.7rem; color: var(--text-muted); background: rgba(255,255,255,0.1); padding: 3px 6px; border-radius: 4px;">Tutup Buku: 20</span>
                            </div>
                            <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                                <label for="salary-ptkp-select" style="font-size: 0.75rem; color: var(--text-secondary);">Status PTKP (TER):</label>
                                <select id="salary-ptkp-select" style="background: rgba(0,0,0,0.3); color: white; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 4px; padding: 2px 6px; font-size: 0.75rem; outline: none; cursor: pointer;">
                                    <option value="A" selected>Kategori A (Lajang/K0)</option>
                                    <option value="B">Kategori B (K1/K2)</option>
                                    <option value="C">Kategori C (K3)</option>
                                </select>
                            </div>
                            <div id="salary-breakdown" style="font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary);">
                                <!-- Salary logic rendered by JS -->
                                Sedang menghitung...
                            </div>
                            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                                <strong style="color: var(--text);">Take Home Pay</strong>
                                <strong id="salary-net-total" style="color: #10b981; font-size: 1.1rem;">Rp 0</strong>
                            </div>
                            <div id="salary-payday-label" style="text-align: right; font-size: 0.65rem; color: var(--text-muted); margin-top: 4px;">
                                Gajian: 1 Bulan Depan
                            </div>
                        </section>
                    </div>

                    <!-- Shift Selection Modal -->
                    <div id="shift-Modal" class="shift-modal-overlay">
                        <div class="shift-modal-content glass-panel shift-glass">
                            <div class="shift-modal-header" style="display: flex; flex-direction: column; position: relative; margin-bottom: 1.5rem;">
                                <h3 style="font-size: 1.25rem; margin:0;">Pilih Shift</h3>
                                <p id="shift-modalDateLabel" style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.2rem;">Target Date</p>
                                <button id="shift-closeModal" class="icon-btn close-btn" style="position: absolute; top: 0; right: 0; border: none; background: transparent; cursor: pointer; color: white;">✕</button>
                            </div>
                            <div class="shift-options" id="shift-Options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                                <button class="shift-btn shift-cuti" data-shift="Cuti">Cuti</button>
                                <button class="shift-btn shift-izin" data-shift="Izin">Izin</button>
                                <button class="shift-btn shift-pagi25" data-shift="Pagi h-25">Pagi h-25</button>
                                <button class="shift-btn shift-pagi350" data-shift="Pagi L-350">Pagi L-350</button>
                                <button class="shift-btn shift-malam25" data-shift="Malam h-25">Malam h-25</button>
                                <button class="shift-btn shift-malam350" data-shift="Malam L-350">Malam L-350</button>
                                <button class="shift-btn shift-kantor" data-shift="Kantor">Kantor</button>
                                <button class="shift-btn shift-dinassiang" data-shift="Dinas Siang">Dinas Siang</button>
                                <button class="shift-btn shift-dinasmalam" data-shift="Dinas Malam">Dinas Malam</button>
                                <button class="shift-btn shift-dinasoff" data-shift="Dinas (Hari Off)" style="background-color: rgba(3, 105, 161, 0.2); border-color: #0369a1; color: #bae6fd;">Dinas (Hari Off)</button>
                                <button class="shift-btn shift-off" data-shift="Off">Off</button>
                            </div>
                            <div class="shift-modal-footer" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                                <button class="shift-clear-btn" id="shift-clearShiftBtn" style="width: 100%; padding: 0.75rem; border-radius: 0.75rem; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">Hapus Shift</button>
                            </div>
                        </div>
                    </div>
               </div>`,
        init: () => { if (typeof initShiftTracker === 'function') initShiftTracker(); }
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

    'ai-forecast': {
        id: 'ai-forecast',
        title: 'AI Forecast',
        icon: '🔮',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(139, 92, 246, 0.3); background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(0, 0, 0, 0.3));">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">🔮</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🔮</span> Forecast Esok Hari
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #8b5cf6; background: rgba(139, 92, 246, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(139, 92, 246, 0.3); text-transform: uppercase;">AI PROBABILITY</span>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 10px; position: relative; z-index: 1;">Prediksi probabilitas keseimbangan hidup esok hari.</p>
                    
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <div style="flex: 1; height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden;">
                            <div id="ai-forecast-bar" style="height: 100%; width: 50%; background: #8b5cf6; transition: width 1s ease;"></div>
                        </div>
                        <div id="ai-forecast-percent" style="font-size: 1.2rem; font-weight: bold; color: #8b5cf6; min-width: 50px; text-align: right;">50%</div>
                    </div>
                    
                    <div id="ai-forecast-text" style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; font-size: 0.8rem; color: var(--text-secondary); border-left: 3px solid #8b5cf6;">
                        Menganalisis data dari ekosistem Spiritual, Mental, dan Fisik Anda...
                    </div>
               </div>`,
        init: () => {
            if (typeof calculateAIForecast === 'function') {
                calculateAIForecast();
            }
        }
    },

    'stoic-muslim': {
        id: 'stoic-muslim',
        title: 'Stoic Muslim',
        icon: '🗡️',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.3); background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(0, 0, 0, 0.3)); cursor: pointer;" onclick="navigateToSubscreen('stoic-muslim')">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">🗡️</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>🗡️</span> Stoic Muslim
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">AURA MASTER</span>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 10px; position: relative; z-index: 1;">Klik untuk membuka modul latihan Karisma, Aura, dan Tawakkal Journal.</p>
                    <div id="widget-stoic-quote" style="background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 6px; font-size: 0.8rem; color: var(--text-secondary); border-left: 3px solid #10b981;">
                        Memuat prinsip hari ini...
                    </div>
               </div>`,
        init: () => {
            const el = document.getElementById('widget-stoic-quote');
            if (el && typeof stoicData !== 'undefined' && typeof stoicState !== 'undefined') {
                let quoteObj = stoicData.quotes[stoicState.dailyQuoteIndex];
                if (!quoteObj) {
                    const idx = Math.floor(Math.random() * stoicData.quotes.length);
                    quoteObj = stoicData.quotes[idx] || { q: "Tetap tenang dan kuasai diri Anda.", author: "Marcus Aurelius" };
                }
                el.innerHTML = `<strong>"${quoteObj.q}"</strong><br><small style="opacity: 0.8;">— ${quoteObj.author || 'Stoic'}</small>`;
            }
        }
    },

    'bps-roster': {
        id: 'bps-roster',
        title: 'Jadwal Roster BPS',
        icon: '👷',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(0, 84, 166, 0.3); background: linear-gradient(135deg, rgba(0, 84, 166, 0.05), rgba(0, 0, 0, 0.3)); cursor: pointer;" onclick="navigateToSubscreen('bps-roster')">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">👷</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>👷</span> Jadwal BPS (13 Jam)
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #0054A6; background: rgba(0, 84, 166, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(0, 84, 166, 0.3); text-transform: uppercase;">ROSTER</span>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 10px; position: relative; z-index: 1;">Akses cepat jadwal shift belajar Roster 13 Jam Anda.</p>
                    <div id="widget-bps-status" style="background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 6px; font-size: 0.8rem; color: var(--text-secondary); border-left: 3px solid #0054A6; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
                        <span>☀️ Pagi: <strong id="widget-bps-pagi-count">0/0</strong></span>
                        <span>🌙 Malam: <strong id="widget-bps-malam-count">0/0</strong></span>
                        <span>🏡 Off: <strong id="widget-bps-off-count">0/0</strong></span>
                    </div>
               </div>`,
        init: () => {
            const pagiEl = document.getElementById('widget-bps-pagi-count');
            const malamEl = document.getElementById('widget-bps-malam-count');
            const offEl = document.getElementById('widget-bps-off-count');
            if (pagiEl) {
                const pagiChecked = document.querySelectorAll('#bps-content-shiftPagi .bps-checkbox:checked').length;
                const pagiTotal = document.querySelectorAll('#bps-content-shiftPagi .bps-checkbox').length;
                pagiEl.textContent = `${pagiChecked}/${pagiTotal}`;
            }
            if (malamEl) {
                const malamChecked = document.querySelectorAll('#bps-content-shiftMalam .bps-checkbox:checked').length;
                const malamTotal = document.querySelectorAll('#bps-content-shiftMalam .bps-checkbox').length;
                malamEl.textContent = `${malamChecked}/${malamTotal}`;
            }
            if (offEl) {
                const offChecked = document.querySelectorAll('#bps-content-hariOff .bps-checkbox:checked').length;
                const offTotal = document.querySelectorAll('#bps-content-hariOff .bps-checkbox').length;
                offEl.textContent = `${offChecked}/${offTotal}`;
            }
        }
    },

    'quran-daily': {
        id: 'quran-daily',
        title: 'Ayat Al-Quran Harian',
        icon: '📖',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 95, 70, 0.15)); border: 1px solid rgba(16, 185, 129, 0.25);">
                    <div style="position: absolute; top: -15px; right: -15px; opacity: 0.04; font-size: 7rem; pointer-events: none;">📖</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>📖</span> Ayat Al-Qur'an Harian
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase;">TADABBUR</span>
                    </div>
                    <div id="quran-daily-content" style="position: relative; z-index: 1;">Memuat ayat...</div>
               </div>`,
        init: () => {
            const container = document.getElementById('quran-daily-content');
            if (!container) return;

            // Curated collection: 60 ayat pilihan untuk tadabbur harian
            // Sumber: Al-Qur'an (teks Arab & terjemahan resmi Kemenag RI)
            const quranVerses = [
                { ar: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ، إِنَّ مَعَ الْعُسْرِ يُسْرًا', id: 'Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.', ref: 'QS. Al-Insyirah [94]: 5-6' },
                { ar: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', id: 'Dan barangsiapa bertawakkal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.', ref: 'QS. At-Talaq [65]: 3' },
                { ar: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', id: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.', ref: 'QS. Al-Baqarah [2]: 286' },
                { ar: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ', id: 'Dan bersabarlah, karena sesungguhnya Allah tidak menyia-nyiakan pahala orang yang berbuat baik.', ref: 'QS. Hud [11]: 115' },
                { ar: 'ادْعُونِي أَسْتَجِبْ لَكُمْ', id: 'Berdoalah kepada-Ku, niscaya akan Aku perkenankan bagimu.', ref: 'QS. Ghafir [40]: 60' },
                { ar: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', id: 'Dan janganlah kamu berputus asa dari rahmat Allah.', ref: 'QS. Yusuf [12]: 87' },
                { ar: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', id: 'Maka ingatlah kepada-Ku, niscaya Aku ingat kepadamu. Bersyukurlah kepada-Ku dan janganlah kamu mengingkari (nikmat)-Ku.', ref: 'QS. Al-Baqarah [2]: 152' },
                { ar: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ', id: 'Dan apabila hamba-hamba-Ku bertanya kepadamu (Muhammad) tentang Aku, maka sesungguhnya Aku dekat. Aku mengabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku.', ref: 'QS. Al-Baqarah [2]: 186' },
                { ar: 'أَلَا إِنَّ نَصْرَ اللَّهِ قَرِيبٌ', id: 'Ingatlah, sesungguhnya pertolongan Allah itu amat dekat.', ref: 'QS. Al-Baqarah [2]: 214' },
                { ar: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', id: 'Dan sungguh, kelak Tuhanmu pasti memberikan karunia-Nya kepadamu, sehingga engkau menjadi puas.', ref: 'QS. Ad-Duha [93]: 5' },
                { ar: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', id: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.', ref: 'QS. Ar-Ra\'d [13]: 28' },
                { ar: 'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ', id: 'Dan tidak ada taufik bagiku melainkan dengan (pertolongan) Allah. Hanya kepada Allah aku bertawakkal dan hanya kepada-Nya aku kembali.', ref: 'QS. Hud [11]: 88' },
                { ar: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ', id: 'Dan Kami lebih dekat kepadanya daripada urat lehernya sendiri.', ref: 'QS. Qaf [50]: 16' },
                { ar: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', id: 'Janganlah kamu bersikap lemah, dan janganlah (pula) kamu bersedih hati, padahal kamulah orang-orang yang paling tinggi (derajatnya), jika kamu orang-orang yang beriman.', ref: 'QS. Ali Imran [3]: 139' },
                { ar: 'وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا إِنَّكَ لَن تَخْرِقَ الْأَرْضَ وَلَن تَبْلُغَ الْجِبَالَ طُولًا', id: 'Dan janganlah engkau berjalan di bumi ini dengan sombong, karena sesungguhnya engkau tidak akan dapat menembus bumi dan tidak akan mampu menjulang setinggi gunung.', ref: 'QS. Al-Isra [17]: 37' },
                { ar: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ', id: 'Sesungguhnya Allah tidak akan mengubah keadaan suatu kaum sebelum mereka mengubah keadaan diri mereka sendiri.', ref: 'QS. Ar-Ra\'d [13]: 11' },
                { ar: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', id: 'Dan katakanlah, "Ya Tuhanku, tambahkanlah ilmu kepadaku."', ref: 'QS. Taha [20]: 114' },
                { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', id: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.', ref: 'QS. Al-Baqarah [2]: 201' },
                { ar: 'وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ', id: 'Dan sungguh, telah Kami mudahkan Al-Qur\'an untuk peringatan, maka adakah orang yang mau mengambil pelajaran?', ref: 'QS. Al-Qamar [54]: 17' },
                { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ ، اللَّهُ الصَّمَدُ ، لَمْ يَلِدْ وَلَمْ يُولَدْ ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', id: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada sesuatu yang setara dengan Dia."', ref: 'QS. Al-Ikhlas [112]: 1-4' },
                { ar: 'وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا', id: 'Dan berpegangteguhlah kamu semuanya pada tali (agama) Allah, dan janganlah kamu bercerai berai.', ref: 'QS. Ali Imran [3]: 103' },
                { ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', id: 'Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan shalat. Sungguh, Allah beserta orang-orang yang sabar.', ref: 'QS. Al-Baqarah [2]: 153' },
                { ar: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ', id: 'Dan boleh jadi kamu membenci sesuatu, padahal itu baik bagimu.', ref: 'QS. Al-Baqarah [2]: 216' },
                { ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', id: 'Ya Tuhanku, lapangkanlah dadaku, dan mudahkanlah untukku urusanku.', ref: 'QS. Taha [20]: 25-26' },
                { ar: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', id: 'Sesungguhnya kami milik Allah dan kepada-Nya kami kembali.', ref: 'QS. Al-Baqarah [2]: 156' },
                { ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', id: 'Cukuplah Allah (menjadi penolong) bagi kami dan Dia sebaik-baik pelindung.', ref: 'QS. Ali Imran [3]: 173' },
                { ar: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ', id: 'Dan Aku tidak menciptakan jin dan manusia melainkan agar mereka beribadah kepada-Ku.', ref: 'QS. Adz-Dzariyat [51]: 56' },
                { ar: 'وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ', id: 'Dan bertawakallah kepada (Allah) Yang Maha Hidup, Yang tidak mati.', ref: 'QS. Al-Furqan [25]: 58' },
                { ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ', id: 'Wahai orang-orang yang beriman! Bertakwalah kepada Allah, dan bersamalah kamu dengan orang-orang yang benar.', ref: 'QS. At-Taubah [9]: 119' },
                { ar: 'وَلَا تَحْسَبَنَّ اللَّهَ غَافِلًا عَمَّا يَعْمَلُ الظَّالِمُونَ', id: 'Dan janganlah sekali-kali engkau (Muhammad) mengira bahwa Allah lalai dari apa yang diperbuat oleh orang-orang yang zalim.', ref: 'QS. Ibrahim [14]: 42' },
                { ar: 'وَأَنِيبُوا إِلَىٰ رَبِّكُمْ وَأَسْلِمُوا لَهُ', id: 'Dan kembalilah kamu kepada Tuhanmu dan berserah dirilah kepada-Nya.', ref: 'QS. Az-Zumar [39]: 54' },
                { ar: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ', id: 'Sesungguhnya shalat itu mencegah dari (perbuatan) keji dan mungkar.', ref: 'QS. Al-Ankabut [29]: 45' },
                { ar: 'وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا', id: 'Dan siapakah yang lebih baik perkataannya daripada orang yang menyeru kepada Allah dan mengerjakan kebajikan.', ref: 'QS. Fussilat [41]: 33' },
                { ar: 'وَلَا تَمُدَّنَّ عَيْنَيْكَ إِلَىٰ مَا مَتَّعْنَا بِهِ أَزْوَاجًا مِّنْهُمْ', id: 'Dan janganlah engkau tujukan pandangan matamu kepada kenikmatan hidup yang telah Kami berikan kepada beberapa golongan dari mereka.', ref: 'QS. Taha [20]: 131' },
                { ar: 'وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ', id: 'Dan berbekallah, karena sesungguhnya sebaik-baik bekal adalah takwa.', ref: 'QS. Al-Baqarah [2]: 197' },
                { ar: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ', id: 'Setiap yang bernyawa pasti akan merasakan kematian.', ref: 'QS. Ali Imran [3]: 185' },
                { ar: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', id: 'Maka nikmat Tuhanmu yang manakah yang kamu dustakan?', ref: 'QS. Ar-Rahman [55]: 13' },
                { ar: 'وَقُلْ رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ', id: 'Dan katakanlah, "Ya Tuhanku, aku berlindung kepada-Mu dari bisikan-bisikan setan."', ref: 'QS. Al-Mu\'minun [23]: 97' },
                { ar: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا', id: 'Dan orang-orang yang bersungguh-sungguh di jalan Kami, pasti akan Kami tunjukkan kepada mereka jalan-jalan Kami.', ref: 'QS. Al-Ankabut [29]: 69' },
                { ar: 'لَا تَدْرِي لَعَلَّ اللَّهَ يُحْدِثُ بَعْدَ ذَٰلِكَ أَمْرًا', id: 'Engkau tidak mengetahui, barangkali setelah itu Allah mengadakan suatu ketentuan yang baru.', ref: 'QS. At-Talaq [65]: 1' },
                { ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ', id: 'Wahai orang-orang yang beriman! Janganlah kamu saling memakan harta sesamamu dengan jalan yang batil.', ref: 'QS. An-Nisa [4]: 29' },
                { ar: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ', id: 'Dan laksanakanlah shalat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.', ref: 'QS. Al-Baqarah [2]: 43' },
                { ar: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً', id: 'Ya Tuhan kami, janganlah Engkau condongkan hati kami kepada kesesatan setelah Engkau berikan petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu.', ref: 'QS. Ali Imran [3]: 8' },
                { ar: 'وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ', id: 'Dan boleh jadi kamu menyukai sesuatu, padahal itu buruk bagimu. Allah mengetahui, sedangkan kamu tidak mengetahui.', ref: 'QS. Al-Baqarah [2]: 216' },
                { ar: 'وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ وَبَشِّرِ الصَّابِرِينَ', id: 'Dan Kami pasti akan menguji kamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa, dan buah-buahan. Dan sampaikanlah kabar gembira kepada orang-orang yang sabar.', ref: 'QS. Al-Baqarah [2]: 155' },
                { ar: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', id: 'Dan Dia bersama kamu di mana saja kamu berada.', ref: 'QS. Al-Hadid [57]: 4' },
                { ar: 'إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ', id: 'Sungguh, Allah menyukai orang-orang yang bertaubat dan orang-orang yang menyucikan diri.', ref: 'QS. Al-Baqarah [2]: 222' },
                { ar: 'وَلَا تَنسَ نَصِيبَكَ مِنَ الدُّنْيَا', id: 'Dan janganlah kamu melupakan bagianmu di dunia.', ref: 'QS. Al-Qasas [28]: 77' },
                { ar: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا', id: 'Katakanlah, "Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya."', ref: 'QS. Az-Zumar [39]: 53' },
                { ar: 'فَإِذَا فَرَغْتَ فَانصَبْ ، وَإِلَىٰ رَبِّكَ فَارْغَب', id: 'Maka apabila engkau telah selesai (dari sesuatu urusan), tetaplah bekerja keras (untuk urusan yang lain), dan hanya kepada Tuhanmulah engkau berharap.', ref: 'QS. Al-Insyirah [94]: 7-8' },
                { ar: 'رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ', id: 'Ya Tuhanku, anugerahkanlah kepadaku dari sisi-Mu keturunan yang baik. Sesungguhnya Engkau Maha Mendengar doa.', ref: 'QS. Ali Imran [3]: 38' },
                { ar: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', id: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.', ref: 'QS. Al-Alaq [96]: 1' },
                { ar: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ', id: 'Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk (menjadi) rahmat bagi seluruh alam.', ref: 'QS. Al-Anbiya [21]: 107' },
                { ar: 'وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا', id: 'Dan jika kamu menghitung nikmat Allah, niscaya kamu tidak akan mampu menghitungnya.', ref: 'QS. Ibrahim [14]: 34' },
                { ar: 'وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ', id: 'Dan sungguh, Kami telah menciptakan manusia dan mengetahui apa yang dibisikkan oleh hatinya.', ref: 'QS. Qaf [50]: 16' },
                { ar: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ', id: 'Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan permusuhan.', ref: 'QS. Al-Maidah [5]: 2' },
                { ar: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', id: 'Jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu.', ref: 'QS. Ibrahim [14]: 7' },
                { ar: 'وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ', id: 'Dan janganlah kamu mengikuti sesuatu yang tidak kamu ketahui.', ref: 'QS. Al-Isra [17]: 36' },
                { ar: 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ', id: 'Sesungguhnya Allah menyuruh (kamu) berlaku adil dan berbuat kebajikan.', ref: 'QS. An-Nahl [16]: 90' },
                { ar: 'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا', id: 'Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal.', ref: 'QS. Al-Hujurat [49]: 13' },
            ];

            // Deterministic daily rotation based on day-of-year
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 0);
            const dayOfYear = Math.floor((now - startOfYear) / 86400000);
            const verseIndex = dayOfYear % quranVerses.length;
            const verse = quranVerses[verseIndex];

            container.innerHTML = `
                <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 10px; border-left: 3px solid #10b981;">
                    <p style="font-family: 'Traditional Arabic', 'Scheherazade New', 'Amiri', serif; font-size: 1.35rem; text-align: right; direction: rtl; line-height: 2.2; color: #d4edda; margin: 0 0 12px 0; letter-spacing: 0.5px;">
                        ${verse.ar}
                    </p>
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent); margin: 12px 0;"></div>
                    <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65; margin: 0 0 10px 0; font-style: italic;">
                        "${verse.id}"
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.72rem; font-weight: 700; color: #10b981;">${verse.ref}</span>
                        <span style="font-size: 0.65rem; color: var(--text-muted);">Ayat ke-${verseIndex + 1} dari ${quranVerses.length}</span>
                    </div>
                </div>
            `;
        }
    },

    'time-tracker': {
        id: 'time-tracker',
        title: 'Time Tracker',
        icon: '⏱️',
        html: `<div class="card mt-md" style="position: relative; overflow: hidden; border: 1px solid rgba(59, 130, 246, 0.2);">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05; font-size: 6rem; pointer-events: none;">⏱️</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span>⏱️</span> Time Tracker
                        </h3>
                        <span style="font-size: 0.65rem; font-weight: 800; color: #3b82f6; background: rgba(59, 130, 246, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3); text-transform: uppercase;">PRODUCTIVITY</span>
                    </div>
                    
                    <div style="display: flex; gap: 5px; margin-bottom: 15px; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 8px;">
                        <button class="time-tab active" onclick="switchTimeTab('sleep')" style="flex: 1; border: none; background: #3b82f6; color: white; padding: 6px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">🛏️ Tidur</button>
                        <button class="time-tab" onclick="switchTimeTab('workout')" style="flex: 1; border: none; background: transparent; color: var(--text-secondary); padding: 6px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">🏋️ Olahraga</button>
                        <button class="time-tab" onclick="switchTimeTab('study')" style="flex: 1; border: none; background: transparent; color: var(--text-secondary); padding: 6px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">📚 Belajar</button>
                    </div>

                    <div id="time-content" style="text-align: center; position: relative; z-index: 1;">
                        <div id="time-display" style="font-size: 2.5rem; font-weight: 800; font-variant-numeric: tabular-nums; font-family: monospace; color: white; margin: 10px 0; text-shadow: 0 0 10px rgba(59,130,246,0.5);">00:00:00</div>
                        <div id="time-duration-today" style="font-size: 0.8rem; color: #10b981; margin-bottom: 15px; font-weight: bold;">Tercatat Hari Ini: 0 menit</div>
                        
                        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 15px;">
                            <button id="btn-timer-toggle" onclick="toggleTimer()" style="background: #10b981; border: none; color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(16,185,129,0.3); transition: all 0.2s;">
                                ▶️ Mulai
                            </button>
                        </div>
                        
                        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; text-align: left;">
                            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 5px;">Atau Input Manual (Rentang Waktu):</label>
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <input type="time" id="manual-time-start" style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px; border-radius: 6px; font-size: 0.9rem; outline: none;">
                                <span style="color: var(--text-muted); font-size: 0.8rem;">s/d</span>
                                <input type="time" id="manual-time-end" style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px; border-radius: 6px; font-size: 0.9rem; outline: none;">
                                <button onclick="addManualTime()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 15px; border-radius: 6px; cursor: pointer;">Simpan</button>
                            </div>
                        </div>
                    </div>
               </div>`,
        init: () => { if (typeof initTimeTracker === 'function') initTimeTracker(); }
    }

};

const DEFAULT_WIDGET_ORDER = [
    'morning-briefing', 'time-tracker', 'reminders', 'ai-forecast', 'quran-daily', 'water-tracker', 'rpg-stats', 'stoic-muslim', 'bps-roster', 'hsse-center', 'quick-note', 'prayer', 'motivation', 
    'brain-boost', 'hadith', 'finance-budget',
    'shift-tracker', 'weekly-report'
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
        userOrder = userOrder.filter(w => 
            w !== 'mood-chart' && 
            w !== 'ai-insight' && 
            w !== 'habit-tracker' &&
            w !== 'finance-export' &&
            w !== 'muhasabah' &&
            w !== 'spending-forecast' &&
            w !== 'daily-schedule' &&
            w !== 'life-balance' &&
            w !== 'overview' &&
            w !== 'profile' &&
            w !== 'streak-calendar' &&
            w !== 'calendar'
        );

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
    
    // Update Forecast whenever habits change
    if (typeof calculateAIForecast === 'function') calculateAIForecast();
}

// ===== AI FORECAST =====
function calculateAIForecast() {
    const barEl = document.getElementById('ai-forecast-bar');
    const percentEl = document.getElementById('ai-forecast-percent');
    const textEl = document.getElementById('ai-forecast-text');
    if (!barEl || !percentEl || !textEl) return;

    let probability = 50; // Base 50%
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Tomorrow date str
    let tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    const tmrwStr = tmrw.toISOString().split('T')[0];

    let reasons = [];

    // 1. Physical (Shifts)
    let shifts = JSON.parse(localStorage.getItem('work_shift_data') || '{}');
    let todayShift = shifts[todayStr];
    let tmrwShift = shifts[tmrwStr];

    if (todayShift === 'Dinas Malam' || todayShift === 'Malam h-25' || todayShift === 'Malam L-350') {
        probability -= 20;
        reasons.push('Fisik kelelahan pasca Dinas Malam (-20%)');
    } else if (todayShift === 'Pagi h-25' || todayShift === 'Pagi L-350') {
        probability -= 5;
    }
    
    if (tmrwShift === 'Off' || tmrwShift === 'Cuti') {
        probability += 15;
        reasons.push('Besok hari libur (+15%)');
    } else if (tmrwShift === 'Dinas Malam' || tmrwShift === 'Malam h-25' || tmrwShift === 'Malam L-350') {
        probability -= 10;
        reasons.push('Besok persiapan Dinas Malam (-10%)');
    }

    // 2. Spiritual (Prayers & Tadabbur)
    let islamicTracks = JSON.parse(localStorage.getItem('jurnal_ai_islamic_tracks') || '{}');
    let todayTrack = islamicTracks[todayStr] || { prayers: {} };
    let todayPrayer = todayTrack.prayers || {};
    let prayersDone = 0;
    ['subuh','dzuhur','ashar','maghrib','isya'].forEach(p => {
        if (todayPrayer[p]) prayersDone++;
    });

    if (prayersDone === 5) {
        probability += 25;
        reasons.push('Salat 5 waktu sempurna (+25%)');
    } else if (prayersDone > 0) {
        probability += (prayersDone * 3);
        reasons.push(`Salat terjaga ${prayersDone} waktu (+${prayersDone * 3}%)`);
    } else {
        probability -= 15;
        reasons.push('Salat terabaikan (-15%)');
    }

    if (todayTrack.quranText && todayTrack.quranText.trim() !== '') {
        probability += 10;
        reasons.push('Tadabbur Quran terpenuhi (+10%)');
    }

    // 3. Mental (Stoic / Muhasabah / Daily tasks)
    let stoicTasks = JSON.parse(localStorage.getItem('jurnal_ai_stoic_tasks') || '[]');
    let stoicDone = stoicTasks.filter(t => t.isCompleted).length;
    if (stoicDone > 0) {
        probability += 10;
        reasons.push('Misi Karisma Stoic dijalankan (+10%)');
    }

    let muhasabah = JSON.parse(localStorage.getItem('jurnal_ai_muhasabah') || '{}');
    if (muhasabah[todayStr]) {
        probability += 10;
        reasons.push('Jurnal Rasa Syukur tercatat (+10%)');
    }

    // 4. Productivity (Time Tracker: Sleep, Workout, Study)
    let timeTracker = JSON.parse(localStorage.getItem('jurnal_ai_time_tracker_data') || '{}');
    let todayTime = (timeTracker.logs && timeTracker.logs[todayStr]) ? timeTracker.logs[todayStr] : { sleep: 0, workout: 0, study: 0 };
    
    let sleepMins = Math.floor((todayTime.sleep || 0) / 60000);
    let workoutMins = Math.floor((todayTime.workout || 0) / 60000);
    let studyMins = Math.floor((todayTime.study || 0) / 60000);

    if (sleepMins >= 360) { // >= 6 hours
        probability += 10;
        reasons.push('Tidur cukup > 6 jam (+10%)');
    } else if (sleepMins > 0 && sleepMins <= 300) { // <= 5 hours but logged
        probability -= 10;
        reasons.push('Kurang tidur < 5 jam (-10%)');
    }
    
    if (workoutMins >= 30) {
        probability += 10;
        reasons.push('Olahraga > 30 menit (+10%)');
    }
    
    if (studyMins >= 30) {
        probability += 10;
        reasons.push('Belajar > 30 menit (+10%)');
    }

    // 5. Physical Health (Water)
    let waterLog = JSON.parse(localStorage.getItem('jurnal_ai_water_log') || '{}');
    let todayWater = waterLog[todayStr] || 0;
    if (todayWater >= 8) {
        probability += 10;
        reasons.push(`Air minum tercukupi ${todayWater} gelas (+10%)`);
    } else if (todayWater > 0 && todayWater < 4) {
        probability -= 5;
        reasons.push(`Kurang minum air putih (-5%)`);
    }

    // 6. Consistency (Streaks)
    let streakLog = JSON.parse(localStorage.getItem('jurnal_ai_streak_log') || '{}');
    if (streakLog[todayStr] && streakLog[todayStr] > 0) {
        probability += 5;
        reasons.push('Menjaga konsistensi streak hari ini (+5%)');
    }

    // 7. Finance
    let walletsStr = localStorage.getItem('jurnal_ai_wallets');
    if (walletsStr) {
        try {
            let wallets = JSON.parse(walletsStr);
            if (Array.isArray(wallets) && wallets.length > 0) {
                let totalBalance = wallets.reduce((s, w) => s + (w.balance || 0), 0);
                let totalReserve = wallets.length * 100000;
                if (totalBalance > totalReserve) {
                    probability += 5;
                    reasons.push('Kondisi keuangan aman terkendali (+5%)');
                } else if (totalBalance < totalReserve && totalBalance > 0) {
                    probability -= 5;
                    reasons.push('Saldo mendekati batas kritis (-5%)');
                }
            }
        } catch(e) {}
    }

    // 8. Checklists & Reminders (Productivity)
    if (window._allDashboardReminders) {
        const pendingCount = window._allDashboardReminders.length;
        if (pendingCount === 0) {
            probability += 15;
            reasons.push('Semua agenda & checklist hari ini tuntas! (+15%)');
        } else if (pendingCount <= 3) {
            probability += 5;
            reasons.push('Sebagian besar checklist sudah selesai (+5%)');
        } else if (pendingCount >= 10) {
            probability -= 5;
            reasons.push('Banyak checklist menumpuk belum dikerjakan (-5%)');
        }
    }

    // Clamp probability
    probability = Math.max(0, Math.min(100, probability));

    // Update UI
    barEl.style.width = probability + '%';
    percentEl.textContent = probability + '%';
    
    let color = '#8b5cf6'; // default purple
    if (probability >= 80) color = '#10b981'; // green
    else if (probability <= 40) color = '#ef4444'; // red
    else if (probability <= 60) color = '#f59e0b'; // orange

    barEl.style.background = color;
    percentEl.style.color = color;
    textEl.style.borderLeftColor = color;

    // AI Analysis Text
    let analysis = '';
    if (probability >= 80) {
        analysis = '<strong>Resiliensi Sangat Tinggi.</strong> Batin Anda sangat kokoh hari ini. Anda siap menghadapi hari esok dengan mental baja.';
    } else if (probability >= 60) {
        analysis = '<strong>Kondisi Stabil.</strong> Keseimbangan hidup cukup terjaga. Pertahankan momentum positif ini esok hari.';
    } else if (probability >= 40) {
        analysis = '<strong>Rentan Kelelahan.</strong> Anda mungkin merasa capek atau sedikit jenuh. Kurangi ekspektasi berlebih dan banyak beristirahat malam ini.';
    } else {
        analysis = '<strong>Peringatan Burnout!</strong> Baterai fisik atau spiritual Anda hampir habis. Sangat disarankan untuk segera *cooling down* dan memohon kekuatan pada-Nya.';
    }
    
    if (reasons.length > 0) {
        analysis += '<br><br><span style="font-size:0.7rem; opacity:0.8;">Faktor Pendorong:<br>• ' + reasons.join('<br>• ') + '</span>';
    }

    textEl.innerHTML = analysis;
}
// ===== TIME TRACKER LOGIC =====
let currentTrackerTab = 'sleep';
let trackerTimerInterval = null;

function initTimeTracker() {
    updateTimeTrackerUI();
    if (trackerTimerInterval) clearInterval(trackerTimerInterval);
    trackerTimerInterval = setInterval(updateTrackerDisplay, 1000);
}

function switchTimeTab(tab) {
    currentTrackerTab = tab;
    // Update active tab button style
    const tabs = document.querySelectorAll('.time-tab');
    tabs.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = 'var(--text-secondary)';
    });
    
    // Find the clicked tab button and style it
    const activeBtn = Array.from(tabs).find(btn => btn.getAttribute('onclick').includes(tab));
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.background = '#3b82f6';
        activeBtn.style.color = 'white';
    }
    
    updateTimeTrackerUI();
}

function updateTimeTrackerUI() {
    const activeTimers = JSON.parse(localStorage.getItem('jurnal_ai_active_timers') || '{}');
    const todayStr = new Date().toISOString().split('T')[0];
    const trackData = JSON.parse(localStorage.getItem('jurnal_ai_time_tracker_data') || '{}');
    const todayData = trackData[todayStr] || { sleep: 0, workout: 0, study: 0 };
    
    const durationEl = document.getElementById('time-duration-today');
    const btnToggle = document.getElementById('btn-timer-toggle');
    
    if (durationEl) {
        durationEl.textContent = 'Tercatat Hari Ini: ' + (todayData[currentTrackerTab] || 0) + ' menit';
    }
    
    if (btnToggle) {
        if (activeTimers[currentTrackerTab]) {
            btnToggle.innerHTML = '⏹️ Berhenti';
            btnToggle.style.background = '#ef4444';
            btnToggle.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.3)';
        } else {
            btnToggle.innerHTML = '▶️ Mulai';
            btnToggle.style.background = '#10b981';
            btnToggle.style.boxShadow = '0 4px 10px rgba(16, 185, 129, 0.3)';
        }
    }
    
    updateTrackerDisplay();
}

function updateTrackerDisplay() {
    const activeTimers = JSON.parse(localStorage.getItem('jurnal_ai_active_timers') || '{}');
    const displayEl = document.getElementById('time-display');
    if (!displayEl) return;
    
    if (activeTimers[currentTrackerTab]) {
        const startTime = activeTimers[currentTrackerTab];
        const elapsedMs = Date.now() - startTime;
        
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        displayEl.textContent = 
            String(hours).padStart(2, '0') + ':' + 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
    } else {
        displayEl.textContent = '00:00:00';
    }
}

function toggleTimer() {
    let activeTimers = JSON.parse(localStorage.getItem('jurnal_ai_active_timers') || '{}');
    
    if (activeTimers[currentTrackerTab]) {
        // Stop timer
        const startTime = activeTimers[currentTrackerTab];
        const elapsedMs = Date.now() - startTime;
        const elapsedMinutes = Math.floor(elapsedMs / 60000);
        
        delete activeTimers[currentTrackerTab];
        localStorage.setItem('jurnal_ai_active_timers', JSON.stringify(activeTimers));
        
        if (elapsedMinutes > 0) {
            saveTimeData(currentTrackerTab, elapsedMinutes);
            alert(`Berhasil menyimpan ${elapsedMinutes} menit untuk ${currentTrackerTab}!`);
        } else {
            alert('Durasi terlalu singkat (kurang dari 1 menit) tidak disimpan.');
        }
    } else {
        // Start timer
        activeTimers[currentTrackerTab] = Date.now();
        localStorage.setItem('jurnal_ai_active_timers', JSON.stringify(activeTimers));
    }
    
    updateTimeTrackerUI();
}

function addManualTime() {
    const startEl = document.getElementById('manual-time-start');
    const endEl = document.getElementById('manual-time-end');
    if (!startEl || !endEl) return;
    
    if (!startEl.value || !endEl.value) {
        alert('Harap isi kedua jam (Mulai dan Selesai)!');
        return;
    }
    
    const [startH, startM] = startEl.value.split(':').map(Number);
    const [endH, endM] = endEl.value.split(':').map(Number);

    let startTotalMins = (startH * 60) + startM;
    let endTotalMins = (endH * 60) + endM;

    // Handle crossing midnight (e.g. 21:00 to 05:00)
    if (endTotalMins < startTotalMins) {
        endTotalMins += 24 * 60; // add full 24 hours in minutes
    }
    
    const minutes = endTotalMins - startTotalMins;

    if (minutes <= 0) {
        alert('Rentang waktu tidak valid!');
        return;
    }
    
    saveTimeData(currentTrackerTab, minutes);
    startEl.value = '';
    endEl.value = '';
    alert(`Berhasil menyimpan durasi ${minutes} menit untuk ${currentTrackerTab} secara manual!`);
    updateTimeTrackerUI();
}

function saveTimeData(category, minutes) {
    const todayStr = new Date().toISOString().split('T')[0];
    let trackData = JSON.parse(localStorage.getItem('jurnal_ai_time_tracker_data') || '{}');
    if (!trackData[todayStr]) {
        trackData[todayStr] = { sleep: 0, workout: 0, study: 0 };
    }
    
    trackData[todayStr][category] += minutes;
    localStorage.setItem('jurnal_ai_time_tracker_data', JSON.stringify(trackData));
    
    // Trigger AI Forecast
    if (typeof calculateAIForecast === 'function') calculateAIForecast();
}

window.initDashboardWidgets = initDashboardWidgets;
window.refreshWidget = refreshWidget;
window.switchTimeTab = switchTimeTab;
window.toggleTimer = toggleTimer;
window.addManualTime = addManualTime;
