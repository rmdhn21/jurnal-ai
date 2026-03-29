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
                    <div class="dashboard-card">
                        <div class="dashboard-icon">📝</div>
                        <div class="dashboard-stat" id="stat-journals">0</div>
                        <div class="dashboard-label">Total Jurnal</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="dashboard-icon">⏳</div>
                        <div class="dashboard-stat" id="stat-tasks">0</div>
                        <div class="dashboard-label">Belum Dilakukan</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="dashboard-icon">💰</div>
                        <div class="dashboard-stat" id="stat-balance">Rp 0</div>
                        <div class="dashboard-label">Saldo</div>
                    </div>
                    <div class="dashboard-card" id="streak-card">
                        <div class="dashboard-icon">🔥</div>
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
        html: `<div class="dashboard-card" id="prayer-card" style="grid-column: span 2;">
                    <div class="prayer-card-header">
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
                    <div class="prayer-list-mini" id="prayer-list-mini"></div>
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
        html: `<div class="card mt-md" id="motivation-card"><p class="text-muted">Memuat...</p></div>`,
        init: () => { if (typeof initMotivation === 'function') initMotivation(); }
    },
    'brain-boost': {
        id: 'brain-boost',
        title: 'Brain Boost',
        icon: '🧠',
        html: `<div class="card mt-md" id="brain-boost-card">
                    <div class="brain-header-row">
                        <h3>🧠 Brain Boost</h3>
                        <span class="badge-ai">Daily XP</span>
                    </div>
                    <div class="brain-tabs">
                        <button class="brain-tab active" onclick="switchTab('fact')">💡 Fakta</button>
                        <button class="brain-tab" onclick="switchTab('vocab')">🇬🇧 Vocab</button>
                        <button class="brain-tab" onclick="switchTab('math')">🧮 Math</button>
                        <button class="brain-tab" onclick="switchTab('logic')">🧩 Logic</button>
                        <button class="brain-tab" onclick="switchTab('myth')">🕵️ Mitos</button>
                    </div>
                    <div id="brain-content" class="brain-content mt-sm"></div>
               </div>`,
        init: () => { if (typeof initBrainBoost === 'function') initBrainBoost(); }
    },
    'hadith': {
        id: 'hadith',
        title: 'Hadits Harian',
        icon: '✨',
        html: `<div class="card mt-md hadith-card-container">
                    <h3>✨ Hadits Harian</h3>
                    <div id="hadith-content" class="hadith-content"></div>
               </div>`,
        init: () => { if (typeof initHadithCard === 'function') initHadithCard(); }
    },
    'finance-budget': {
        id: 'finance-budget',
        title: 'Budget & Arus Kas',
        icon: '📉',
        html: `<div class="card mt-md" id="global-budget-card">
                    <div class="budget-card-header">
                        <h3>📉 Budget Harian</h3>
                        <span id="global-budget-text" class="text-muted">...</span>
                    </div>
                    <div class="progress-bar">
                        <div id="global-budget-progress" class="progress-fill" style="width: 0%"></div>
                    </div>
                    <small class="text-muted budget-card-hint">Total pengeluaran hari ini dari semua wallet.</small>
               </div>`,
        init: () => { if (typeof initGlobalBudgetUI === 'function') initGlobalBudgetUI(); }
    },
    'reminders': {
        id: 'reminders',
        title: 'Reminder & Jadwal',
        icon: '🔔',
        html: `<div class="card">
                    <h3>🔔 Reminder & Jadwal</h3>
                    <div id="dashboard-reminders" class="reminder-list"></div>
               </div>`,
        init: () => { if (typeof updateDashboardReminders === 'function') updateDashboardReminders(); }
    },
    'mood-chart': {
        id: 'mood-chart',
        title: 'Mood Tracker (Visual)',
        icon: '🎭',
        html: `<div class="card">
                    <h3>🎭 Mood Minggu Ini</h3>
                    <div class="mood-chart-container">
                        <canvas id="mood-chart-canvas" height="150"></canvas>
                    </div>
               </div>`,
        init: () => { if (typeof initMoodChart === 'function') initMoodChart(); }
    },
    'calendar': {
        id: 'calendar',
        title: 'Kalender & Event',
        icon: '📅',
        html: `<div class="card calendar-card">
                    <div class="calendar-view">
                        <div class="calendar-header">
                            <h3 id="dashboard-calendar-month-year">...</h3>
                        </div>
                        <div class="calendar-grid" id="dashboard-calendar-grid"></div>
                    </div>
               </div>`,
        init: () => { if (typeof renderCalendar === 'function') renderCalendar(); }
    },
    'ai-insight': {
        id: 'ai-insight',
        title: 'AI Quick Insight',
        icon: '✨',
        html: `<div class="card">
                    <h3>🧠 Quick AI Insight</h3>
                    <div id="quick-insight" class="insight-box">
                        <p class="text-muted">Klik tombol di bawah untuk insight harian</p>
                    </div>
                    <button id="get-daily-insight-btn" class="btn btn-ai btn-full" onclick="getDailyInsight()">✨ Dapatkan Insight Harian</button>
               </div>`,
        init: () => {}
    }
};

const DEFAULT_WIDGET_ORDER = [
    'profile', 'overview', 'prayer', 'motivation', 
    'brain-boost', 'hadith', 'finance-budget', 
    'reminders', 'mood-chart', 'calendar', 'ai-insight'
];

async function initDashboardWidgets() {
    const container = document.getElementById('dashboard-widgets-container');
    if (!container) return;

    let userOrder;
    try {
        const storedOrder = localStorage.getItem('jurnal_ai_dashboard_widgets');
        userOrder = storedOrder ? JSON.parse(storedOrder) : DEFAULT_WIDGET_ORDER;
        if (!Array.isArray(userOrder)) userOrder = DEFAULT_WIDGET_ORDER;
    } catch (e) {
        console.error('Failed to parse widget order:', e);
        userOrder = DEFAULT_WIDGET_ORDER;
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
        <div id="widget-settings-modal" class="mastery-modal">
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
