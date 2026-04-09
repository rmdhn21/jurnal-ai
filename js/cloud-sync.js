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
        updateSyncStatus('Unauthorized');
        return;
    }

    const userId = session.user.id;
    updateSyncStatus('Syncing', 10);

    try {
        console.log('🔄 Pre-sync: Pulling latest data from cloud...');
        await syncFromCloud(); // Merge remote data first
        updateSyncStatus('Syncing', 30);


        // Gather all data from IDB
        const journals = await getJournals(true);
        updateSyncStatus('Syncing', 40);
        const tasks = await getTasks(true);
        const schedules = await getSchedules(true);
        const transactions = await getTransactions(true);
        updateSyncStatus('Syncing', 50);
        const habits = await getHabits(true);
        const goals = await getGoals(true);
        const wallets = await getWallets(true);
        const budgets = await getBudgets(true);
        const islamicTracks = await getIslamicTracks();
        
        // Progress Data (Lightweight)
        const rigInspectionState = typeof idbGetAll === 'function' ? await idbGetAll('rig_inspection_state') : [];
        const hseVocabBank = typeof getVocabBank === 'function' ? await getVocabBank(true) : [];
        const savedGenerations = typeof getSavedGenerations === 'function' ? await getSavedGenerations(true) : [];
        
        updateSyncStatus('Syncing', 75);

        const data = {
            journals,
            tasks,
            schedules,
            transactions,
            habits,
            goals,
            reminderSettings: getReminderSettings(),
            pushSubscription: localStorage.getItem('jurnal_ai_push_subscription'),
            wallets,
            budgets,
            islamicTracks,
            rigInspectionState,
            hseVocabBank,
            savedGenerations,
            updatedAt: new Date().toISOString(),
            version: '2.0-idb'
        };

        // Size calculation
        try {
            const sizeInBytes = new Blob([JSON.stringify(data)]).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(1);
            console.log(`📦 Sync Payload Size: ${sizeInKB} KB`);
            const sizeBadge = document.getElementById('sync-payload-size');
            if (sizeBadge) {
                sizeBadge.textContent = `${sizeInKB} KB`;
                sizeBadge.classList.remove('hidden');
            }
        } catch (e) {
            console.warn('Size calculation failed:', e);
        }
        console.log('📤 Pushing merged data to cloud...');
        const { error } = await supabaseClient
            .from('user_data')
            .upsert({ user_id: userId, data: data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

        if (error) {
            console.error('Sync ERROR:', error);
            updateSyncStatus('Error', null, error);
        } else {
            console.log('✅ Synced to cloud successfully (IDB)');
            updateSyncStatus('Synced', 100);
            setTimeout(() => updateSyncStatus('Synced'), 2000); // Hide percentage after a short delay
        }
    } catch (err) {
        console.error('Sync FAILED (Exception):', err);
        updateSyncStatus('Error', null, err.message || err);
    }
}

async function syncFromCloud() {
    if (!supabaseClient || !isCloudSyncEnabled()) return false;

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return false;

    const userId = session.user.id;
    console.log('Downloading cloud data for user:', userId);

    try {
        const { data, error } = await supabaseClient
            .from('user_data')
            .select('data')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return false; // No data yet
            console.error('Download ERROR:', error);
            return false;
        }

        if (!data || !data.data) return false;

        const cloudData = data.data;
        console.log('Cloud data received, merging...');

        // Functional Merge helper
        const mergeAndSave = async (tableName, localItems, cloudItems) => {
            const merged = new Map();
            localItems.forEach(item => merged.set(item.id, item));
            
            let changed = false;
            cloudItems.forEach(cloudItem => {
                const localItem = merged.get(cloudItem.id);
                if (!localItem) {
                    merged.set(cloudItem.id, cloudItem);
                    changed = true;
                } else {
                    const localTime = new Date(localItem.updatedAt || 0).getTime();
                    const cloudTime = new Date(cloudItem.updatedAt || 0).getTime();
                    if (cloudTime > localTime) {
                        merged.set(cloudItem.id, cloudItem);
                        changed = true;
                    }
                }
            });

            if (changed) {
                await idbBulkSave(tableName, Array.from(merged.values()));
            }
        };


        // Merge all tables
        if (cloudData.journals) await mergeAndSave('journals', await getJournals(true), cloudData.journals);
        if (cloudData.tasks) await mergeAndSave('tasks', await getTasks(true), cloudData.tasks);
        if (cloudData.schedules) await mergeAndSave('schedules', await getSchedules(true), cloudData.schedules);
        if (cloudData.transactions) await mergeAndSave('transactions', await getTransactions(true), cloudData.transactions);
        if (cloudData.habits) await mergeAndSave('habits', await getHabits(true), cloudData.habits);
        if (cloudData.goals) await mergeAndSave('goals', await getGoals(true), cloudData.goals);
        if (cloudData.wallets) await mergeAndSave('wallets', await getWallets(true), cloudData.wallets);
        if (cloudData.budgets) await mergeAndSave('budgets', await getBudgets(true), cloudData.budgets);
        
        // Progress & missing tables
        if (cloudData.hseVocabBank) await mergeAndSave('hse_vocab_bank', await getVocabBank(true), cloudData.hseVocabBank);
        if (cloudData.savedGenerations) await mergeAndSave('saved_generations', await getSavedGenerations(true), cloudData.savedGenerations);
        
        if (cloudData.rigInspectionState) {
            const localState = await idbGetAll('rig_inspection_state');
            const localIds = new Set(localState.map(i => i.id));
            const cloudIds = new Set(cloudData.rigInspectionState.map(i => i.id));
            
            const mergedIds = new Set([...localIds, ...cloudIds]);
            const mergedState = Array.from(mergedIds).map(id => ({ id }));
            await idbBulkSave('rig_inspection_state', mergedState);
        }
        if (cloudData.islamicTracks) {
            const localTracks = await getIslamicTracks();
            const mergedTracks = { ...localTracks, ...cloudData.islamicTracks };
            await idbBulkSave('islamic_tracks', Object.values(mergedTracks));
        }

        console.log('✅ Smart IDB Sync from cloud completed');
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
        if (cloudData.pushSubscription) localStorage.setItem('jurnal_ai_push_subscription', cloudData.pushSubscription);

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

let lastSyncErrorString = '';

function updateSyncStatus(status, percentage = null, details = null) {
    console.log('Sync Status:', status);

    const indicator = document.getElementById('sync-status-indicator');
    const icon = document.getElementById('sync-icon');
    const text = document.getElementById('sync-text');
    const percentageEl = document.getElementById('sync-percentage');

    if (!indicator || !icon || !text) return;
    const errorContainer = document.getElementById('sync-error-container');
    const errorMsg = document.getElementById('sync-error-msg');
    const sizeBadge = document.getElementById('sync-payload-size');

    if (status === 'Error' || status === 'error') {
        if (details) {
            lastSyncErrorString = typeof details === 'object' ? JSON.stringify(details) : String(details);
            if (errorMsg) errorMsg.textContent = lastSyncErrorString;
            if (errorContainer) errorContainer.classList.remove('hidden');
        }
    } else if (status === 'Syncing' || status === 'syncing' || status === 'Synced') {
        if (errorContainer) errorContainer.classList.add('hidden');
    }


    indicator.classList.remove('synced', 'syncing', 'offline', 'error', 'unauthorized');

    if (percentageEl) {
        if (percentage !== null) {
            percentageEl.textContent = `${percentage}%`;
            percentageEl.classList.remove('hidden');
        } else {
            percentageEl.classList.add('hidden');
        }
    }

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
        case 'Unauthorized': case 'unauthorized':
            indicator.classList.add('unauthorized');
            icon.textContent = '🟡';
            text.textContent = 'Login Cloud';
            break;
        default:
            indicator.classList.add('offline');
            icon.textContent = '⚫';
            text.textContent = 'Offline';
    }
    // Dropdown Sync Status Logic
    const dropText = document.getElementById('dropdown-sync-text');
    const dropPercentage = document.getElementById('dropdown-sync-percentage');
    const dropProgressFill = document.getElementById('dropdown-sync-progress-fill');
    const dropSyncBtn = document.getElementById('dropdown-sync-now-btn');

    if (dropText) dropText.textContent = status;
    if (percentage !== null) {
        if (dropPercentage) dropPercentage.textContent = `${percentage}%`;
        if (dropProgressFill) dropProgressFill.style.width = `${percentage}%`;
    }

    if (dropSyncBtn) {
        const s = status.toLowerCase();
        if (s === 'synced') {
            dropSyncBtn.textContent = '✅ Berhasil'; dropSyncBtn.disabled = false;
        } else if (s === 'syncing') {
            dropSyncBtn.textContent = '🔄 Sinkronisasi...'; dropSyncBtn.disabled = true;
        } else if (s === 'error') {
            dropSyncBtn.textContent = '⚠️ Coba Lagi'; dropSyncBtn.disabled = false;
        } else if (s === 'unauthorized') {
            dropSyncBtn.textContent = '🔐 Login ke Cloud'; dropSyncBtn.disabled = false;
        } else {
            dropSyncBtn.textContent = '🔄 Mulai Sinkronisasi'; dropSyncBtn.disabled = false;
        }
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

document.addEventListener('DOMContentLoaded', () => {
    const syncIndicator = document.getElementById('sync-status-indicator');
    if (syncIndicator) {
        syncIndicator.addEventListener('click', (e) => {
            e.stopPropagation();



            const syncDropdown = document.getElementById('sync-dropdown-menu');
            const syncNowBtn = document.getElementById('dropdown-sync-now-btn');
            
            if (syncDropdown) {
                syncDropdown.classList.toggle('hidden');
                
                // Close dropdown when clicking outside
                if (!window._syncDropdownInited) {
                    window._syncDropdownInited = true;
                    document.addEventListener('click', (ev) => {
                        if (!syncIndicator.contains(ev.target) && !syncDropdown.contains(ev.target)) {
                            syncDropdown.classList.add('hidden');
                        }
                    });
                    
                    // Prevent dropdown from closing when clicking inside it
                    syncDropdown.addEventListener('click', ev => ev.stopPropagation());
                    
                    if (syncNowBtn) {
                        syncNowBtn.addEventListener('click', (ev) => {
                            const status = document.getElementById('dropdown-sync-text')?.textContent?.toLowerCase();
                            
                            if (status === 'unauthorized' || status === 'login cloud') {
                                if (typeof showLoginScreen === 'function') {
                                    showLoginScreen();
                                    const cloudBtn = document.getElementById('cloud-login-btn');
                                    if (cloudBtn) cloudBtn.click();
                                    return;
                                }
                            }

                            if (!isCloudSyncEnabled() || !navigator.onLine) {
                                alert('Cloud Sync belum aktif atau Anda sedang offline. Silakan login ke cloud-sync terlebih dahulu.');
                                return;
                            }
                            triggerCloudSync();
                        });
                    }
                }
            }
        });
    }
});

function copySyncError() {
    const msg = document.getElementById('sync-error-msg')?.textContent;
    if (msg) {
        navigator.clipboard.writeText(msg).then(() => {
            alert('Pesan error berhasil disalin!');
        });
    }
}
