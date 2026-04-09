// ===== APP INITIALIZATION =====
// This is the main entry point that orchestrates all modules

function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

async function showMainApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');

    // Initialize Database and Migration with timeout
    try {
        if (typeof initDB === 'function') {
            const dbReady = await Promise.race([
                initDB(),
                new Promise(resolve => setTimeout(() => resolve(false), 5000))
            ]);
            if (dbReady && typeof migrateFromLocalStorageToIDB === 'function') {
                await migrateFromLocalStorageToIDB();
            }
        }
    } catch (e) {
        console.error('Core init failed:', e);
    }

    // Initialize all modules
    initNavigation();
    initSettings();
    
    // Critical: Dashboard must load
    try {
        if (typeof initDashboardWidgets === 'function') await initDashboardWidgets();
    } catch (e) { console.error('Dashboard init failed:', e); }

    // Other non-critical modules
    const safelyInit = async (fnName, ...args) => {
        try {
            if (typeof window[fnName] === 'function') await window[fnName](...args);
        } catch (e) { console.error(`Failed to init ${fnName}:`, e); }
    };

    await safelyInit('initJournalUI');
    await safelyInit('initPlannerUI');
    await safelyInit('initGoalsUI');
    await safelyInit('initPrayerTimes');
    await safelyInit('initFinanceUI');
    await safelyInit('initHabitsUI');
    
    initGlobalSearch();
    initAIAnalysis();
    initReminder();
    
    safelyInit('initBrainBoost');
    safelyInit('initHadithCard');
    safelyInit('initGamification');
    safelyInit('initMotivation');
    await safelyInit('initIslamTrackerUI');
    await safelyInit('initAIAssistant');

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

    // Apply UI Scale ASAP
    const savedScale = localStorage.getItem('app-ui-scale');
    if (savedScale) {
        document.documentElement.style.setProperty('--app-scale', savedScale);
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
    setTimeout(async () => {
        if (typeof initBackupRestore === 'function') initBackupRestore();
        
        // Force Update Listener for the Refresh Button
        const reloadBtn = document.getElementById('reload-app-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', async () => {
                console.log('🔄 Performing Force Update...');
                
                // 1. Unregister Service Workers
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const registration of registrations) {
                        await registration.unregister();
                        console.log('SW Unregistered');
                    }
                }

                // 2. Clear Caches
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    for (const name of cacheNames) {
                        await caches.delete(name);
                        console.log('Cache Deleted:', name);
                    }
                }

                // 3. Force Reload with Cache-Busting Timestamp
                const url = new URL(window.location.href);
                url.searchParams.set('v', Date.now());
                window.location.href = url.toString();
            });
        }

        if (typeof initTheme === 'function') initTheme();
        if (typeof initVoiceInput === 'function') {
            console.log('🎙️ Initializing Voice Input...');
            initVoiceInput();
        }
        if (typeof initSecurity === 'function') initSecurity();
        if (typeof initExportCSV === 'function') initExportCSV();
        if (typeof renderCalendar === 'function') await renderCalendar();
        if (typeof initFinanceUpgrades === 'function') await initFinanceUpgrades();
        if (typeof initWalletUI === 'function') await initWalletUI();
        if (typeof initBudgetUI === 'function') await initBudgetUI();
        if (typeof initGlobalBudgetUI === 'function') await initGlobalBudgetUI();
        if (typeof initInsightUI === 'function') await initInsightUI();

    }, 1000);
});

