// ===== APP INITIALIZATION =====
// This is the main entry point that orchestrates all modules

function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');

    // Initialize all modules
    initNavigation();
    initSettings();
    initDashboard();
    initJournalUI();
    initPlannerUI();
    initPomodoroTimer();
    initGoalsUI();

    try {
        if (typeof initPrayerTimes === 'function') {
            initPrayerTimes();
        }
    } catch (e) {
        console.error('Failed to init Prayer Times:', e);
    }

    initFinanceUI();
    initHabitsUI();
    initGlobalSearch();
    initAIAnalysis();
    initAIAnalysis();
    initReminder();
    if (typeof initBrainBoost === 'function') initBrainBoost();
    if (typeof initHadithCard === 'function') initHadithCard();
    if (typeof initGamification === 'function') initGamification();
    if (typeof initMotivation === 'function') initMotivation();
    if (typeof initIslamTrackerUI === 'function') initIslamTrackerUI();

    // Check if Onboarding is needed
    if (typeof initOnboarding === 'function') initOnboarding();

    // Init AI Tutors Check
    if (typeof checkTutorDailyStatus === 'function') checkTutorDailyStatus();

    // Check if API key is set
    if (!getApiKey()) {
        showSettings();
    }
}

// Main DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 App Initializing...');

    // Load theme
    const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Initialize Auth UI
    if (typeof initLoginUI === 'function') initLoginUI();

    // Initialize Supabase Client
    if (typeof initSupabase === 'function') initSupabase();

    // Auto-restore Supabase session if cloud sync is enabled
    if (typeof supabaseClient !== 'undefined' && supabaseClient && typeof isCloudSyncEnabled === 'function' && isCloudSyncEnabled()) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                console.log('✅ Cloud session restored automatically');
            }
        } catch (e) {
            console.warn('Could not restore cloud session:', e);
        }
    }

    // Check Local Session
    if (typeof getSession === 'function') {
        const session = getSession();

        if (session) {
            showMainApp();

            // Trigger Background Cloud Sync
            if (typeof isCloudSyncEnabled === 'function' && isCloudSyncEnabled()) {
                console.log('🔄 Auto-syncing from cloud on startup...');
                if (typeof syncFromCloud === 'function') {
                    syncFromCloud().then(success => {
                        if (success) {
                            console.log('✅ Startup sync complete');
                            if (typeof initDashboard === 'function') initDashboard();
                        }
                    });
                }
            }
        } else {
            showLoginScreen();
        }
    }

    // Delayed init for secondary features
    setTimeout(() => {
        if (typeof initBackupRestore === 'function') initBackupRestore();
        if (typeof initTheme === 'function') initTheme();
        if (typeof initVoiceInput === 'function') initVoiceInput();
        if (typeof initSecurity === 'function') initSecurity();
        if (typeof initExportCSV === 'function') initExportCSV();
        if (typeof initMoodCalendar === 'function') initMoodCalendar();
        if (typeof initFinanceUpgrades === 'function') initFinanceUpgrades();
        if (typeof initWalletUI === 'function') initWalletUI();
        if (typeof initBudgetUI === 'function') initBudgetUI();
        if (typeof initGlobalBudgetUI === 'function') initGlobalBudgetUI();
        if (typeof initInsightUI === 'function') initInsightUI();

    }, 1000);
});
