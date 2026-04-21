// ===== DASHBOARD WIDGETS SYSTEM =====
const WIDGET_REGISTRY = {
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

};

const DEFAULT_WIDGET_ORDER = [
    'profile', 'hsse-center', 'overview', 'life-balance', 'prayer', 'daily-schedule', 'motivation', 
    'brain-boost', 'hadith', 'finance-budget', 
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

    // Final safety: ensure loading spinner is gone if it somehow persisted
    const spinner = container.querySelector('.loading-spinner-container');
    if (spinner) spinner.remove();
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
