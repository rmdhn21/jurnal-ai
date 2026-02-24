// ===== SUPABASE CONFIG =====
const SUPABASE_URL_DEFAULT = 'https://oybywsjhgkilpceisxzn.supabase.co';
const SUPABASE_KEY_DEFAULT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ynl3c2poZ2tpbHBjZWlzeHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTQ0MDIsImV4cCI6MjA4NTk3MDQwMn0.sSNrv1LPn-WRrnrnwus0aJDEmulR6qoWMHc4KeQL_4w';

// Auto sync when back online
window.addEventListener('online', () => {
    console.log('🌐 Online detected, triggering sync...');
    if (isCloudSyncEnabled()) triggerCloudSync();
    updateSyncStatus('Syncing');
});

window.addEventListener('offline', () => {
    console.log('🔌 Offline detected');
    updateSyncStatus('Offline');
});

let supabaseClient = null;

function initSupabase() {
    if (supabaseClient) return true;

    const customUrl = localStorage.getItem('supabase_url');
    const customKey = localStorage.getItem('supabase_key');

    const url = customUrl || SUPABASE_URL_DEFAULT;
    const key = customKey || SUPABASE_KEY_DEFAULT;

    if (!url || !key) return false;

    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        try {
            supabaseClient = window.supabase.createClient(url, key);
            console.log('Supabase initialized with:', customUrl ? 'Custom Config' : 'Default Config');
            return true;
        } catch (e) {
            console.error('Supabase init failed:', e);
            return false;
        }
    }
    console.warn('Supabase SDK not loaded');
    return false;
}

// ===== CLOUD SYNC MODULE =====
function isCloudSyncEnabled() {
    return localStorage.getItem(STORAGE_KEYS.CLOUD_SYNC) === 'true';
}

function enableCloudSync() {
    localStorage.setItem(STORAGE_KEYS.CLOUD_SYNC, 'true');
}

function disableCloudSync() {
    localStorage.setItem(STORAGE_KEYS.CLOUD_SYNC, 'false');
}

async function syncToCloud() {
    if (!supabaseClient || !isCloudSyncEnabled()) return;

    if (!navigator.onLine) {
        updateSyncStatus('Offline');
        return;
    }

    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session) {
        console.warn('Sync aborted: No active session');
        updateSyncStatus('Offline');
        return;
    }

    const userId = session.user.id;
    updateSyncStatus('Syncing');

    try {
        console.log('🔄 Pre-sync: Pulling latest data from cloud...');
        await syncFromCloud();

        const data = {
            journals: getJournals(true),
            tasks: getTasks(true),
            schedules: getSchedules(true),
            transactions: getTransactions(true),
            habits: getHabits(true),
            goals: getGoals(true),
            reminderSettings: getReminderSettings(),
            wallets: getWallets(true),
            budgets: getBudgets(true),
            islamicTracks: getIslamicTracks(),
            updatedAt: new Date().toISOString(),
            version: '1.4'
        };

        console.log('📤 Pushing merged data to cloud...');
        const { error } = await supabaseClient
            .from('user_data')
            .upsert({ user_id: userId, data: data }, { onConflict: 'user_id' });

        if (error) {
            console.error('Sync ERROR:', error);
            updateSyncStatus('Error');
            if (error.code === '42501') {
                alert('Sync Gagal: Permission Denied. Pastikan RLS Policies sudah diset!');
            }
        } else {
            console.log('✅ Synced to cloud successfully (Pull+Push)');
            updateSyncStatus('Synced');
        }
    } catch (err) {
        console.error('Sync FAILED (Exception):', err);
        updateSyncStatus('Error');
    }
}

async function syncFromCloud() {
    if (!supabaseClient || !isCloudSyncEnabled()) return false;

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return false;

    const userId = session.user.id;
    console.log('Downloading data for user:', userId);

    try {
        const { data, error } = await supabaseClient
            .from('user_data')
            .select('data')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Download ERROR:', error);
            return false;
        }

        if (!data) {
            console.log('No data found in cloud');
            return false;
        }

        const cloudData = data.data;
        console.log('Cloud data received:', cloudData);

        function mergeArrays(localArr, cloudArr) {
            const merged = new Map();
            localArr.forEach(item => { merged.set(item.id, item); });
            cloudArr.forEach(cloudItem => {
                const localItem = merged.get(cloudItem.id);
                if (!localItem) {
                    merged.set(cloudItem.id, cloudItem);
                } else {
                    const localTime = new Date(localItem.updatedAt || localItem.createdAt || 0).getTime();
                    const cloudTime = new Date(cloudItem.updatedAt || cloudItem.createdAt || 0).getTime();
                    if (cloudTime > localTime) {
                        merged.set(cloudItem.id, cloudItem);
                    }
                }
            });
            return Array.from(merged.values());
        }

        function mergeHabits(localHabits, cloudHabits) {
            const merged = new Map();
            localHabits.forEach(h => merged.set(h.id, { ...h }));
            cloudHabits.forEach(cloudHabit => {
                const localHabit = merged.get(cloudHabit.id);
                if (!localHabit) {
                    merged.set(cloudHabit.id, cloudHabit);
                } else {
                    const mergedCompletions = {
                        ...cloudHabit.completions,
                        ...localHabit.completions
                    };
                    merged.set(cloudHabit.id, {
                        ...cloudHabit,
                        ...localHabit,
                        completions: mergedCompletions
                    });
                }
            });
            return Array.from(merged.values());
        }

        if (cloudData.journals) {
            const merged = mergeArrays(getJournals(true), cloudData.journals);
            localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(merged));
        }
        if (cloudData.tasks) {
            const merged = mergeArrays(getTasks(true), cloudData.tasks);
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(merged));
        }
        if (cloudData.schedules) {
            const merged = mergeArrays(getSchedules(true), cloudData.schedules);
            localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(merged));
        }
        if (cloudData.transactions) {
            const merged = mergeArrays(getTransactions(true), cloudData.transactions);
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(merged));
        }
        if (cloudData.habits) {
            const merged = mergeHabits(getHabits(true), cloudData.habits);
            localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(merged));
        }
        if (cloudData.goals) {
            const merged = mergeArrays(getGoals(true), cloudData.goals);
            localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(merged));
        }
        if (cloudData.reminderSettings) {
            localStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(cloudData.reminderSettings));
        }
        if (cloudData.wallets) {
            const merged = mergeArrays(getWallets(true), cloudData.wallets);
            localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(merged));
        }
        if (cloudData.budgets) {
            const merged = mergeArrays(getBudgets(true), cloudData.budgets);
            localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(merged));
        }
        if (cloudData.islamicTracks) {
            const localTracks = getIslamicTracks();
            const mergedTracks = { ...localTracks, ...cloudData.islamicTracks };
            localStorage.setItem(STORAGE_KEYS.ISLAMIC_TRACKS, JSON.stringify(mergedTracks));
        }

        console.log('✅ Smart sync from cloud completed');

        initJournalUI();
        initPlannerUI();
        initFinanceUI();
        initHabitsUI();
        initDashboard();
        if (typeof initIslamTrackerUI === 'function') initIslamTrackerUI();

        return true;
    } catch (err) {
        console.error('Sync from cloud failed:', err);
        return false;
    }
}

async function syncFromCloudReplace() {
    if (!supabaseClient || !isCloudSyncEnabled()) return false;

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return false;

    const userId = session.user.id;
    console.log('📥 Cloud-Only Sync: Downloading and replacing local data for user:', userId);

    try {
        const { data, error } = await supabaseClient
            .from('user_data')
            .select('data')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('📤 No cloud data found. Uploading local data to cloud...');
                await syncToCloud();
                return true;
            }
            console.error('Cloud-Only Sync ERROR:', error);
            return false;
        }

        if (!data || !data.data) {
            console.log('📤 Empty cloud data. Uploading local data to cloud...');
            await syncToCloud();
            return true;
        }

        const cloudData = data.data;
        console.log('☁️ Cloud data received, replacing local data...');

        if (cloudData.journals) localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(cloudData.journals));
        if (cloudData.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(cloudData.tasks));
        if (cloudData.schedules) localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(cloudData.schedules));
        if (cloudData.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(cloudData.transactions));
        if (cloudData.habits) localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(cloudData.habits));
        if (cloudData.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(cloudData.goals));
        if (cloudData.wallets) localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(cloudData.wallets));
        if (cloudData.budgets) localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(cloudData.budgets));
        if (cloudData.islamicTracks) localStorage.setItem(STORAGE_KEYS.ISLAMIC_TRACKS, JSON.stringify(cloudData.islamicTracks));
        if (cloudData.reminderSettings) localStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(cloudData.reminderSettings));

        console.log('✅ Cloud-Only Sync completed - local data replaced with cloud data');

        if (typeof initJournalUI === 'function') initJournalUI();
        if (typeof initPlannerUI === 'function') initPlannerUI();
        if (typeof initFinanceUI === 'function') initFinanceUI();
        if (typeof initHabitsUI === 'function') initHabitsUI();
        if (typeof initGoalsUI === 'function') initGoalsUI();
        if (typeof initDashboard === 'function') initDashboard();
        if (typeof initIslamTrackerUI === 'function') initIslamTrackerUI();

        return true;
    } catch (err) {
        console.error('Cloud-Only Sync failed:', err);
        return false;
    }
}

function updateSyncStatus(status) {
    console.log('Sync Status:', status);

    const indicator = document.getElementById('sync-status-indicator');
    const icon = document.getElementById('sync-icon');
    const text = document.getElementById('sync-text');

    if (!indicator || !icon || !text) return;

    indicator.classList.remove('synced', 'syncing', 'offline', 'error');

    switch (status) {
        case 'Synced': case 'synced':
            indicator.classList.add('synced');
            icon.textContent = '🟢';
            text.textContent = 'Synced';
            break;
        case 'Syncing': case 'syncing':
            indicator.classList.add('syncing');
            icon.textContent = '🔵';
            text.textContent = 'Syncing...';
            break;
        case 'Offline': case 'offline':
            indicator.classList.add('offline');
            icon.textContent = '⚫';
            text.textContent = 'Offline';
            break;
        case 'Error': case 'error':
            indicator.classList.add('error');
            icon.textContent = '🔴';
            text.textContent = 'Error';
            break;
        default:
            indicator.classList.add('offline');
            icon.textContent = '⚫';
            text.textContent = 'Offline';
    }
}

function triggerCloudSync() {
    if (isCloudSyncEnabled()) {
        clearTimeout(window.syncTimeout);
        window.syncTimeout = setTimeout(syncToCloud, 2000);
    }
}

function saveCloudConfig() {
    const url = document.getElementById('supabase-url-input')?.value?.trim();
    const key = document.getElementById('supabase-key-input')?.value?.trim();

    if (url) localStorage.setItem('supabase_url', url);
    if (key) localStorage.setItem('supabase_key', key);

    supabaseClient = null;
    initSupabase();
    alert('Cloud config saved!');
}
