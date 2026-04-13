// ===== STORAGE MODULE =====
const MIGRATION_KEY = 'jurnal_ai_idb_migrated';

async function migrateFromLocalStorageToIDB() {
    if (localStorage.getItem(MIGRATION_KEY) === 'true') return;

    // Safety: If IDB is not supported or failed to open, don't attempt migration
    // We check if the DB structure is accessible
    try {
        if (!db || !db.isOpen()) {
            console.warn('⚠️ IndexedDB not ready, skipping migration.');
            return;
        }
    } catch(e) {
        return;
    }

    console.log('🔄 Starting data migration to IndexedDB...');
    const overlay = document.getElementById('migration-overlay');
    const fill = document.getElementById('migration-fill');
    const status = document.getElementById('migration-status');

    if (overlay) overlay.classList.remove('hidden');

    const tables = {
        [STORAGE_KEYS.JOURNALS]: 'journals',
        [STORAGE_KEYS.TASKS]: 'tasks',
        [STORAGE_KEYS.SCHEDULES]: 'schedules',
        [STORAGE_KEYS.TRANSACTIONS]: 'transactions',
        [STORAGE_KEYS.HABITS]: 'habits',
        [STORAGE_KEYS.GOALS]: 'goals',
        [STORAGE_KEYS.WALLETS]: 'wallets',
        [STORAGE_KEYS.BUDGETS]: 'budgets'
    };

    const keys = Object.keys(tables);
    for (let i = 0; i < keys.length; i++) {
        const lsKey = keys[i];
        const tableName = tables[lsKey];
        const raw = localStorage.getItem(lsKey);
        
        if (raw) {
            try {
                const data = JSON.parse(raw);
                if (Array.isArray(data) && data.length > 0) {
                    if (status) status.textContent = `Memindahkan ${tableName}...`;
                    if (fill) fill.style.width = `${((i + 1) / keys.length) * 100}%`;
                    
                    // Use a race to avoid hanging on slow IDB write
                    await Promise.race([
                        idbBulkSave(tableName, data),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('IDB timeout')), 10000))
                    ]);
                    
                    console.log(`✅ Migrated ${data.length} items to ${tableName}`);
                }
            } catch (e) {
                console.error(`Failed to migrate ${lsKey}:`, e);
                // Continue to next table even if one fails
            }
        }
    }

    // Special case for Islamic Tracks (Object instead of Array)
    const rawTracks = localStorage.getItem(STORAGE_KEYS.ISLAMIC_TRACKS);
    if (rawTracks) {
        try {
            const tracks = JSON.parse(rawTracks);
            const trackEntries = Object.values(tracks);
            if (trackEntries.length > 0) {
                await idbBulkSave('islamic_tracks', trackEntries);
            }
        } catch (e) {}
    }

    // Special case for Daily To-Do
    const rawDailyTodos = localStorage.getItem('jurnal_ai_todo_today_data');
    if (rawDailyTodos) {
        try {
            const data = JSON.parse(rawDailyTodos);
            if (Array.isArray(data) && data.length > 0) {
                await idbBulkSave('todo_today', data.map(d => ({ ...d, updatedAt: new Date().toISOString(), synced: 0 })));
            }
        } catch (e) {}
    }

    // Special case for Workout State
    const rawWorkout = localStorage.getItem('hybrid_workout_state');
    if (rawWorkout) {
        try {
            const data = JSON.parse(rawWorkout);
            await idbSave('workout_state', { key: 'current', data, updatedAt: new Date().toISOString(), synced: 0 });
        } catch (e) {}
    }

    // Special case for Gamification
    const gamificationKeys = {
        XP: 'jurnal_ai_xp',
        LEVEL: 'jurnal_ai_level',
        BADGES: 'jurnal_ai_badges',
        INVENTORY: 'jurnal_ai_inventory',
        EQUIPPED: 'jurnal_ai_equipped'
    };
    for (const [id, lsKey] of Object.entries(gamificationKeys)) {
        const val = localStorage.getItem(lsKey);
        if (val) {
            await idbSave('gamification', { key: lsKey, value: val, updatedAt: new Date().toISOString(), synced: 0 });
        }
    }

    localStorage.setItem(MIGRATION_KEY, 'true');
    if (status) status.textContent = 'Migrasi Selesai! Memuat aplikasi...';
    setTimeout(() => { if (overlay) overlay.classList.add('hidden'); }, 1000);
}

const STORAGE_KEYS = {
    JOURNALS: 'jurnal_ai_journals',
    TASKS: 'jurnal_ai_tasks',
    SCHEDULES: 'jurnal_ai_schedules',
    TRANSACTIONS: 'jurnal_ai_transactions',
    HABITS: 'jurnal_ai_habits',
    GOALS: 'jurnal_ai_goals',
    API_KEY: 'jurnal_ai_gemini_key',
    USERS: 'jurnal_ai_users',
    SESSION: 'jurnal_ai_session',
    REMINDER_SETTINGS: 'jurnal_ai_reminder_settings',
    CLOUD_SYNC: 'jurnal_ai_cloud_sync',
    WALLETS: 'jurnal_ai_wallets',
    THEME: 'jurnal_ai_theme',
    BUDGETS: 'jurnal_ai_budgets',
    DAILY_BUDGET: 'jurnal_ai_global_daily_budget',
    PIN: 'jurnal_ai_pin',
    GLOBAL_BUDGET: 'jurnal_ai_global_budget',
    RECURRING: 'jurnal_ai_recurring',
    PRAYER_CITY: 'jurnal_ai_prayer_city',
    PRAYER_DATA: 'jurnal_ai_prayer_data',
    ISLAMIC_TRACKS: 'jurnal_ai_islamic_tracks',
    CACHED_NEWS: 'jurnal_ai_cached_news',
    TUTOR_LAST_DATE: 'jurnal_ai_tutor_last_date',
    HSE_VOCAB_BANK: 'jurnal_ai_hse_vocab_bank',
    SAVED_GENERATIONS: 'jurnal_ai_saved_generations',
    HSE_ROUTES: 'jurnal_ai_hse_routes'
};

// ===== UTILITY FUNCTIONS =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getPriorityLabel(priority) {
    const labels = {
        'allah': 'Ibadah',
        'self': 'Pribadi',
        'others': 'Sosial/Kerja'
    };
    return labels[priority] || '';
}

function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

function formatShortDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// ===== JOURNAL OPERATIONS =====
async function getJournals(includeDeleted = false) {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
        const journals = data ? JSON.parse(data) : [];
        return includeDeleted ? journals : journals.filter(j => !j.deleted);
    }
    const journals = await idbGetAll('journals');
    return includeDeleted ? journals : journals.filter(j => !j.deleted);
}

async function saveJournal(journal) {
    if (!journal.id) journal.id = generateId();
    if (!journal.createdAt) journal.createdAt = new Date().toISOString();
    journal.updatedAt = new Date().toISOString();
    journal.synced = 0;

    await idbSave('journals', journal);
    triggerCloudSync();
    return journal;
}

async function deleteJournal(id) {
    await idbDelete('journals', id);
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
        if (raw) {
            let journals = JSON.parse(raw);
            journals = journals.filter(j => j.id != id);
            localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
        }
    }
    triggerCloudSync();
}

// ===== TASK OPERATIONS =====
async function getTasks(includeDeleted = false) {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.TASKS);
        const tasks = data ? JSON.parse(data) : [];
        return includeDeleted ? tasks : tasks.filter(t => !t.deleted);
    }
    const tasks = await idbGetAll('tasks');
    return includeDeleted ? tasks : tasks.filter(t => !t.deleted);
}

async function saveTask(task) {
    if (!task.id) task.id = generateId();
    task.updatedAt = new Date().toISOString();
    task.synced = 0;
    
    await idbSave('tasks', task);
    triggerCloudSync();
    return task;
}

async function deleteTask(id) {
    const task = await idbGet('tasks', id);
    if (task) {
        task.deleted = true;
        task.updatedAt = new Date().toISOString();
        task.synced = 0;
        await idbSave('tasks', task);
        triggerCloudSync();
    }
}

async function toggleTask(id) {
    const task = await idbGet('tasks', id);
    if (task) {
        task.done = !task.done;
        task.updatedAt = new Date().toISOString();
        task.synced = 0;
        await idbSave('tasks', task);
        triggerCloudSync();
    }
    return task;
}

// ===== SCHEDULE OPERATIONS =====
async function getSchedules(includeDeleted = false) {
    let schedules = [];
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
        schedules = data ? JSON.parse(data) : [];
    } else {
        schedules = await idbGetAll('schedules');
    }

    schedules = schedules.filter(s => {
        const isSystemPrayer = s.isPrayer || String(s.id).startsWith('prayer-') || (s.title && s.title.includes('🕌'));
        return !isSystemPrayer;
    });

    return includeDeleted ? schedules : schedules.filter(s => !s.deleted);
}

async function saveSchedule(schedule) {
    if (!schedule.id) schedule.id = generateId();
    schedule.updatedAt = new Date().toISOString();
    schedule.synced = 0;

    await idbSave('schedules', schedule);
    triggerCloudSync();
    return schedule;
}

async function deleteSchedule(id) {
    await idbDelete('schedules', id);
    triggerCloudSync();
}

// ===== TRANSACTION OPERATIONS =====
async function getTransactions(includeDeleted = false) {
    let transactions = [];
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        transactions = data ? JSON.parse(data) : [];
    } else {
        transactions = await idbGetAll('transactions');
    }

    const filtered = includeDeleted ? transactions : transactions.filter(t => !t.deleted);
    
    // Sort: Newest Date first, then Newest CreatedAt first
    return filtered.sort((a, b) => {
        const dateCompare = (b.date || "").localeCompare(a.date || "");
        if (dateCompare !== 0) return dateCompare;
        return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
}

async function saveTransaction(transaction) {
    if (!transaction.id) transaction.id = generateId();
    transaction.updatedAt = new Date().toISOString();
    transaction.synced = 0;

    await idbSave('transactions', transaction);
    triggerCloudSync();
    return transaction;
}

async function deleteTransaction(id) {
    const transaction = await idbGet('transactions', id);
    if (transaction) {
        transaction.deleted = true;
        transaction.updatedAt = new Date().toISOString();
        transaction.synced = 0;
        await idbSave('transactions', transaction);

        // Refund (kembalikan) saldo dompet
        await updateWalletBalance(transaction.walletId, -transaction.amount, transaction.type);
        triggerCloudSync();
    }
}

// ===== HABIT OPERATIONS =====
async function getHabits(includeDeleted = false) {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.HABITS);
        const habits = data ? JSON.parse(data) : [];
        return includeDeleted ? habits : habits.filter(h => !h.deleted);
    }
    const habits = await idbGetAll('habits');
    return includeDeleted ? habits : habits.filter(h => !h.deleted);
}

async function saveHabit(habit) {
    if (!habit.id) habit.id = generateId();
    habit.updatedAt = new Date().toISOString();
    habit.synced = 0;

    await idbSave('habits', habit);
    triggerCloudSync();
    return habit;
}

async function deleteHabit(id) {
    await idbDelete('habits', id);
    triggerCloudSync();
}

async function toggleHabitCompletion(habitId, date) {
    const habit = await idbGet('habits', habitId);
    if (habit) {
        if (!habit.completions) habit.completions = {};
        habit.completions[date] = !habit.completions[date];
        habit.streak = calculateStreak(habit);
        habit.updatedAt = new Date().toISOString();
        habit.synced = 0;
        await idbSave('habits', habit);
        triggerCloudSync();
    }
    return habit;
}

// ===== GOALS OPERATIONS =====
async function getGoals(includeDeleted = false) {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.GOALS);
        const goals = data ? JSON.parse(data) : [];
        return includeDeleted ? goals : goals.filter(g => !g.deleted);
    }
    const goals = await idbGetAll('goals');
    return includeDeleted ? goals : goals.filter(g => !g.deleted);
}

async function saveGoal(goal) {
    if (!goal.id) goal.id = generateId();
    goal.updatedAt = new Date().toISOString();
    goal.synced = 0;

    await idbSave('goals', goal);
    triggerCloudSync();
    return goal;
}

async function deleteGoal(id) {
    await idbDelete('goals', id);
    triggerCloudSync();
}

async function updateGoalProgress(goalId, progress) {
    const goal = await idbGet('goals', goalId);
    if (goal) {
        goal.currentProgress = progress;
        goal.updatedAt = new Date().toISOString();
        if (goal.target && progress >= goal.target) {
            goal.completed = true;
            goal.completedAt = new Date().toISOString();
        }
        goal.synced = 0;
        await idbSave('goals', goal);
        triggerCloudSync();
    }
    return goal;
}

async function completeGoal(goalId) {
    const goal = await idbGet('goals', goalId);
    if (goal) {
        goal.completed = true;
        goal.completedAt = new Date().toISOString();
        goal.updatedAt = new Date().toISOString();
        goal.synced = 0;
        await idbSave('goals', goal);
        triggerCloudSync();
    }
    return goal;
}

// ===== API KEY OPERATIONS =====
function getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

function saveApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}

// ===== WALLET OPERATIONS =====
async function getWallets(includeDeleted = false) {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.WALLETS);
        let wallets = data ? JSON.parse(data) : [];
        if (wallets.length === 0) {
            wallets.push({
                id: 'wallet_default', name: 'Tunai', balance: 0, 
                isDefault: true, createdAt: new Date().toISOString()
            });
        }
        return includeDeleted ? wallets : wallets.filter(w => !w.deleted);
    }
    let wallets = await idbGetAll('wallets');
    if (wallets.length === 0) {
        const defaultWallet = {
            id: 'wallet_default', name: 'Tunai', balance: 0,
            isDefault: true, createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(), synced: 0
        };
        await idbSave('wallets', defaultWallet);
        wallets = [defaultWallet];
    }
    return includeDeleted ? wallets : wallets.filter(w => !w.deleted);
}

async function saveWallet(wallet) {
    if (!wallet.id) wallet.id = generateId();
    wallet.updatedAt = new Date().toISOString();
    wallet.synced = 0;
    await idbSave('wallets', wallet);
    triggerCloudSync();
}

async function deleteWallet(id) {
    const wallet = await idbGet('wallets', id);
    if (wallet && wallet.isDefault) {
        alert('Tidak bisa menghapus dompet utama!');
        return;
    }
    await idbDelete('wallets', id);
    triggerCloudSync();
}

async function updateWalletBalance(walletId, amount, type) {
    // Coerce amount to number (AI may send string)
    const numAmount = parseFloat(amount) || 0;
    if (numAmount === 0) {
        console.warn('⚠️ updateWalletBalance: amount is 0 or invalid', { walletId, amount, type });
        return;
    }

    let wallet = await idbGet('wallets', walletId);
    
    // AI often sends wallet NAME instead of ID (e.g. "BCA" instead of "lz1abc...")
    // Try to find wallet by name if ID lookup fails
    if (!wallet && walletId) {
        const allWallets = await idbGetAll('wallets');
        const activeWallets = allWallets.filter(w => !w.deleted);
        const searchName = walletId.toLowerCase().trim();
        wallet = activeWallets.find(w => 
            w.name && w.name.toLowerCase().trim() === searchName
        );
        if (wallet) {
            console.log(`🔍 Wallet found by name '${walletId}' → ID: ${wallet.id}`);
        }
    }

    // Last resort: fallback to default wallet
    if (!wallet) {
        console.warn(`⚠️ Wallet '${walletId}' not found by ID or name, falling back to wallet_default`);
        wallet = await idbGet('wallets', 'wallet_default');
    }
    
    if (wallet) {
        const change = type === 'income' ? numAmount : -numAmount;
        wallet.balance = (wallet.balance || 0) + change;
        wallet.updatedAt = new Date().toISOString();
        wallet.synced = 0;
        await idbSave('wallets', wallet);
        console.log(`✅ Wallet '${wallet.name}' updated: ${change > 0 ? '+' : ''}${change} → Balance: ${wallet.balance}`);
    } else {
        console.error('❌ updateWalletBalance: No wallet found at all!', { walletId, amount: numAmount, type });
    }
}

// ===== ISLAMIC TRACKER OPERATIONS =====
async function getIslamicTracks() {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.ISLAMIC_TRACKS);
        return data ? JSON.parse(data) : {};
    }
    const tracksArray = await idbGetAll('islamic_tracks');
    const tracksObj = {};
    tracksArray.forEach(t => { tracksObj[t.date] = t; });
    return tracksObj;
}

async function getIslamicTrackByDate(dateStr) {
    const track = await idbGet('islamic_tracks', dateStr);
    return track || {
        date: dateStr,
        prayers: { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false },
        qobliyah: false, sedekah: false, waqiah: false, fasting: false,
        quranText: '', dhikrCount: 0,
        updatedAt: new Date().toISOString(), synced: 0
    };
}

async function saveIslamicTrack(dateStr, trackData) {
    trackData.date = dateStr;
    trackData.updatedAt = new Date().toISOString();
    trackData.synced = 0;
    
    await idbSave('islamic_tracks', trackData);
    triggerCloudSync();
    return trackData;
}

// ===== BUDGET OPERATIONS =====
async function getBudgets(includeDeleted = false) {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
        const budgets = data ? JSON.parse(data) : [];
        return includeDeleted ? budgets : budgets.filter(b => !b.deleted);
    }
    const budgets = await idbGetAll('budgets');
    return includeDeleted ? budgets : budgets.filter(b => !b.deleted);
}

async function saveBudget(budget) {
    if (!budget.id) budget.id = generateId();
    budget.updatedAt = new Date().toISOString();
    budget.synced = 0;
    
    await idbSave('budgets', budget);
}

async function deleteBudget(id) {
    await idbDelete('budgets', id);
    triggerCloudSync();
}

// ===== SETTINGS =====
function getSettings() {
    return {
        apiKey: getApiKey(),
        theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'dark',
        prayerCity: localStorage.getItem(STORAGE_KEYS.PRAYER_CITY) || 'Jakarta',
        globalBudget: localStorage.getItem(STORAGE_KEYS.GLOBAL_BUDGET) || '',
        reminderSettings: getReminderSettings()
    };
}

// ==== NEWS CACHE FUNCTIONS ====
function getCachedNews(category) {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CACHED_NEWS}_${category}`);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function saveCachedNews(category, data, timestamp) {
    const cacheObj = {
        timestamp: timestamp,
        data: data
    };
    localStorage.setItem(`${STORAGE_KEYS.CACHED_NEWS}_${category}`, JSON.stringify(cacheObj));
}

// ==== AI TUTOR DAILY LIMIT FUNCTIONS ====
function hasLearnedToday() {
    const lastDate = localStorage.getItem(STORAGE_KEYS.TUTOR_LAST_DATE);
    if (!lastDate) return false;

    // Check if the stored date string matches today's date string
    const today = new Date().toLocaleDateString('en-CA'); // strict YYYY-MM-DD format
    return lastDate === today;
}

function markTutorLearned() {
    const today = new Date().toLocaleDateString('en-CA');
    localStorage.setItem(STORAGE_KEYS.TUTOR_LAST_DATE, today);
}

// ==== HSE VOCAB BANK FUNCTIONS ====
async function getVocabBank(includeDeleted = false) {
    let items = [];
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.HSE_VOCAB_BANK);
        items = data ? JSON.parse(data) : [];
    } else {
        items = await idbGetAll('hse_vocab_bank');
    }
    return includeDeleted ? items : items.filter(v => !v.deleted);
}

async function saveVocabToBank(vocabObject) {
    if (!vocabObject.id) vocabObject.id = generateId();
    if (!vocabObject.createdAt) vocabObject.createdAt = new Date().toISOString();
    vocabObject.updatedAt = new Date().toISOString();
    vocabObject.synced = 0;

    await idbSave('hse_vocab_bank', vocabObject);
    triggerCloudSync();
    return vocabObject;
}

async function deleteVocabFromBank(id) {
    await idbDelete('hse_vocab_bank', id);
    triggerCloudSync();
}

// ==== SAVED GENERATIONS FUNCTIONS ====
async function getSavedGenerations(includeDeleted = false) {
    let items = [];
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.SAVED_GENERATIONS);
        items = data ? JSON.parse(data) : [];
    } else {
        items = await idbGetAll('saved_generations');
    }
    return includeDeleted ? items : items.filter(it => !it.deleted);
}

async function saveGeneration(item) {
    if (!item.id) item.id = generateId();
    if (!item.createdAt) item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    item.synced = 0;

    await idbSave('saved_generations', item);
    triggerCloudSync();
    return item;
}

async function deleteSavedGeneration(id) {
    await idbDelete('saved_generations', id);
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const raw = localStorage.getItem(STORAGE_KEYS.SAVED_GENERATIONS);
        if (raw) {
            let items = JSON.parse(raw);
            items = items.filter(it => it.id != id);
            localStorage.setItem(STORAGE_KEYS.SAVED_GENERATIONS, JSON.stringify(items));
        }
    }
    triggerCloudSync();
}

// ==== DAILY TODO TODAY FUNCTIONS ====
async function getDailyTodos(includeDeleted = false) {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem('jurnal_ai_todo_today_data');
        const items = data ? JSON.parse(data) : [];
        return includeDeleted ? items : items.filter(t => !t.deleted);
    }
    const items = await idbGetAll('todo_today');
    return includeDeleted ? items : items.filter(t => !t.deleted);
}

async function saveDailyTodo(todo) {
    if (!todo.id) todo.id = generateId();
    todo.updatedAt = new Date().toISOString();
    todo.synced = 0;
    await idbSave('todo_today', todo);
    triggerCloudSync();
    return todo;
}

async function deleteDailyTodo(id) {
    await idbDelete('todo_today', id);
    triggerCloudSync();
}

// ==== WORKOUT TRACKER FUNCTIONS ====
async function getWorkoutState() {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem('hybrid_workout_state');
        return data ? JSON.parse(data) : null;
    }
    const row = await idbGet('workout_state', 'current');
    return row ? row.data : null;
}

async function saveWorkoutState(state) {
    const row = {
        key: 'current',
        data: state,
        updatedAt: new Date().toISOString(),
        synced: 0
    };
    await idbSave('workout_state', row);
    triggerCloudSync();
}

// ==== GAMIFICATION FUNCTIONS ====
async function getGamificationValue(key, defaultValue = null) {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        return localStorage.getItem(key) || defaultValue;
    }
    const row = await idbGet('gamification', key);
    return row ? row.value : defaultValue;
}

async function saveGamificationValue(key, value) {
    const row = {
        key: key,
        value: value,
        updatedAt: new Date().toISOString(),
        synced: 0
    };
    await idbSave('gamification', row);
    triggerCloudSync();
}

// ==== LEARNING PROGRESS FUNCTIONS ====
async function getLearningData(key) {
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        return localStorage.getItem(key);
    }
    const row = await idbGet('learning_progress', key);
    return row ? row.data : null;
}

async function saveLearningData(key, data) {
    const row = {
        key: key,
        data: data,
        updatedAt: new Date().toISOString(),
        synced: 0
    };
    await idbSave('learning_progress', row);
    triggerCloudSync();
}

// ==== DAILY ROUTINE FUNCTIONS ====
async function getRoutines(includeDeleted = false) {
    const items = await idbGetAll('routines');
    return includeDeleted ? items : items.filter(t => !t.deleted);
}

async function saveRoutine(routine) {
    if (!routine.id) routine.id = generateId();
    routine.updatedAt = new Date().toISOString();
    routine.synced = 0;
    await idbSave('routines', routine);
    triggerCloudSync();
    return routine;
}

// ==== HSE GEO-MAPPER ROUTES FUNCTIONS ====
async function getHSERoutes(includeDeleted = false) {
    let items = [];
    if (localStorage.getItem(MIGRATION_KEY) !== 'true') {
        const data = localStorage.getItem(STORAGE_KEYS.HSE_ROUTES);
        items = data ? JSON.parse(data) : [];
    } else {
        items = await idbGetAll('hse_routes');
    }
    const filtered = includeDeleted ? items : items.filter(r => !r.deleted);
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

async function saveHSERoute(routeObject) {
    if (!routeObject.id) routeObject.id = generateId();
    if (!routeObject.timestamp) routeObject.timestamp = new Date().toISOString();
    routeObject.updatedAt = new Date().toISOString();
    routeObject.synced = 0;

    // Use IndexedDB if migrated, otherwise fallback
    if (localStorage.getItem(MIGRATION_KEY) === 'true') {
        await idbSave('hse_routes', routeObject);
    } else {
        const data = await getHSERoutes(true);
        const idx = data.findIndex(r => r.id === routeObject.id);
        if (idx >= 0) data[idx] = routeObject;
        else data.push(routeObject);
        localStorage.setItem(STORAGE_KEYS.HSE_ROUTES, JSON.stringify(data));
    }
    triggerCloudSync();
    return routeObject;
}

async function deleteHSERoute(id) {
    if (localStorage.getItem(MIGRATION_KEY) === 'true') {
        const route = await idbGet('hse_routes', id);
        if (route) {
            route.deleted = true;
            route.updatedAt = new Date().toISOString();
            route.synced = 0;
            await idbSave('hse_routes', route);
        }
    } else {
        const data = await getHSERoutes(true);
        const idx = data.findIndex(r => r.id === id);
        if (idx >= 0) {
            data[idx].deleted = true;
            data[idx].updatedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.HSE_ROUTES, JSON.stringify(data));
        }
    }
    triggerCloudSync();
}

async function deleteRoutine(id) {
    await idbDelete('routines', id);
    triggerCloudSync();
}

async function migrateDefaultRoutines() {
    const routines = await idbGetAll('routines');
    if (routines.length > 0) return; // Already exists

    const defaults = [
        { id: 'r1', time: '04:00', title: 'Bangun Tidur & Tahajud', icon: '⏰' },
        { id: 'r2', time: '04:20', title: 'Persiapan & Sedekah Subuh', icon: '💦' },
        { id: 'r3', time: '06:30', title: 'Mandi Pagi & Persiapan', icon: '🚿' },
        { id: 'r4', time: '07:00', title: 'Sarapan Pagi (Nutrisi)', icon: '🍳' },
        { id: 'r5', time: '08:00', title: 'Mulai Kerja / Selesaikan Todo', icon: '💼' },
        { id: 'r6', time: '22:00', title: 'Evaluasi Jurnal & Tidur', icon: '😴' }
    ];

    for (const d of defaults) {
        await idbSave('routines', {
            ...d,
            updatedAt: new Date().toISOString(),
            synced: 0
        });
    }
    console.log('✅ Default routines migrated');
}
