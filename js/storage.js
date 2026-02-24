// ===== STORAGE MODULE =====
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
    TUTOR_LAST_DATE: 'jurnal_ai_tutor_last_date'
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
function getJournals(includeDeleted = false) {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    const journals = data ? JSON.parse(data) : [];
    return includeDeleted ? journals : journals.filter(j => !j.deleted);
}

function saveJournal(journal) {
    const journals = getJournals(true);
    const existing = journals.findIndex(j => j.id === journal.id);

    if (!journal.deleted) delete journal.deleted;

    if (existing >= 0) {
        journals[existing] = { ...journals[existing], ...journal, updatedAt: new Date().toISOString() };
    } else {
        journals.unshift(journal);
    }
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
    triggerCloudSync();
    return journal;
}

function deleteJournal(id) {
    const journals = getJournals(true);
    const index = journals.findIndex(j => j.id === id);
    if (index >= 0) {
        journals[index].deleted = true;
        journals[index].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
        triggerCloudSync();
    }
}

// ===== TASK OPERATIONS =====
function getTasks(includeDeleted = false) {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    const tasks = data ? JSON.parse(data) : [];
    return includeDeleted ? tasks : tasks.filter(t => !t.deleted);
}

function saveTask(task) {
    const tasks = getTasks(true);
    const existing = tasks.findIndex(t => t.id === task.id);

    if (!task.deleted) delete task.deleted;

    if (existing >= 0) {
        tasks[existing] = { ...tasks[existing], ...task, updatedAt: new Date().toISOString() };
    } else {
        tasks.unshift(task);
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    triggerCloudSync();
    return task;
}

// Bulk save for reordering or status updates
function saveTasks(tasks) {
    const allTasks = getTasks(true);
    const taskMap = new Map(allTasks.map(t => [t.id, t]));

    tasks.forEach(t => {
        const existing = taskMap.get(t.id);
        taskMap.set(t.id, { ...(existing || {}), ...t, updatedAt: new Date().toISOString() });
    });

    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(Array.from(taskMap.values())));
    triggerCloudSync();
}

function deleteTask(id) {
    const tasks = getTasks(true);
    const index = tasks.findIndex(t => t.id === id);
    if (index >= 0) {
        tasks[index].deleted = true;
        tasks[index].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        triggerCloudSync();
    }
}

function toggleTask(id) {
    const tasks = getTasks(true);
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        task.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        triggerCloudSync();
    }
    return task;
}

// ===== SCHEDULE OPERATIONS =====
function getSchedules(includeDeleted = false) {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    let schedules = data ? JSON.parse(data) : [];

    // SECURITY: Always filter out prayer times from read to ensure we don't propagate duplicates
    // We filter by ID prefix AND by Title content (Mosque emoji) to catch legacy corrupted data
    schedules = schedules.filter(s => {
        const isSystemPrayer = s.isPrayer || String(s.id).startsWith('prayer-') || (s.title && s.title.includes('🕌'));
        return !isSystemPrayer;
    });

    return includeDeleted ? schedules : schedules.filter(s => !s.deleted);
}

function saveSchedule(schedule) {
    let schedules = getSchedules(true);
    const existing = schedules.findIndex(s => s.id === schedule.id);

    if (!schedule.deleted) delete schedule.deleted;

    if (existing >= 0) {
        schedules[existing] = { ...schedules[existing], ...schedule, updatedAt: new Date().toISOString() };
    } else {
        schedules.push(schedule);
    }

    // SAFETY: Ensure we never save prayer times
    // We filter by ID prefix AND by Title content (Mosque emoji) to catch legacy corrupted data
    schedules = schedules.filter(s => {
        const isSystemPrayer = s.isPrayer || String(s.id).startsWith('prayer-') || (s.title && s.title.includes('🕌'));
        return !isSystemPrayer;
    });

    schedules.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    triggerCloudSync();
    return schedule;
}

function deleteSchedule(id) {
    let schedules = getSchedules(true);
    // SAFETY: Ensure we never save prayer times
    schedules = schedules.filter(s => {
        const isSystemPrayer = s.isPrayer || String(s.id).startsWith('prayer-') || (s.title && s.title.includes('🕌'));
        return !isSystemPrayer;
    });

    const index = schedules.findIndex(s => s.id === id);
    if (index >= 0) {
        schedules[index].deleted = true;
        schedules[index].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
        triggerCloudSync();
    }
}

// ===== TRANSACTION OPERATIONS =====
function getTransactions(includeDeleted = false) {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const transactions = data ? JSON.parse(data) : [];
    return includeDeleted ? transactions : transactions.filter(t => !t.deleted);
}

function saveTransaction(transaction) {
    const transactions = getTransactions(true); // Get ALL including deleted to update if re-saving
    const existing = transactions.findIndex(t => t.id === transaction.id);

    // Ensure deleted flag is preserved or reset if explicitly intended (usually new saves are not deleted)
    if (!transaction.deleted) delete transaction.deleted;

    if (existing >= 0) {
        transactions[existing] = { ...transactions[existing], ...transaction, updatedAt: new Date().toISOString() };
    } else {
        transactions.unshift(transaction);
    }
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    triggerCloudSync();
    return transaction;
}

function deleteTransaction(id) {
    const transactions = getTransactions(true);
    const index = transactions.findIndex(t => t.id === id);
    if (index >= 0) {
        const t = transactions[index];
        if (!t.deleted) {
            t.deleted = true;
            t.updatedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

            // Refund (kembalikan) saldo dompet sesuai jenis transaksi yang dihapus
            updateWalletBalance(t.walletId, -t.amount, t.type);
            triggerCloudSync();
        }
    }
}

// ===== HABIT OPERATIONS =====
function getHabits(includeDeleted = false) {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    const habits = data ? JSON.parse(data) : [];
    return includeDeleted ? habits : habits.filter(h => !h.deleted);
}

function saveHabit(habit) {
    const habits = getHabits(true);
    const existing = habits.findIndex(h => h.id === habit.id);

    if (!habit.deleted) delete habit.deleted;

    if (existing >= 0) {
        habits[existing] = { ...habits[existing], ...habit, updatedAt: new Date().toISOString() };
    } else {
        habits.push(habit);
    }
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    triggerCloudSync();
    return habit;
}

function deleteHabit(id) {
    const habits = getHabits(true);
    const index = habits.findIndex(h => h.id === id);
    if (index >= 0) {
        habits[index].deleted = true;
        habits[index].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
        triggerCloudSync();
    }
}

function toggleHabitCompletion(habitId, date) {
    const habits = getHabits(true);
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
        if (!habit.completions) habit.completions = {};
        habit.completions[date] = !habit.completions[date];
        habit.streak = calculateStreak(habit);
        habit.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
        triggerCloudSync();
    }
    return habit;
}

// ===== GOALS OPERATIONS =====
function getGoals(includeDeleted = false) {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    const goals = data ? JSON.parse(data) : [];
    return includeDeleted ? goals : goals.filter(g => !g.deleted);
}

function saveGoal(goal) {
    const goals = getGoals(true);
    const existing = goals.findIndex(g => g.id === goal.id);

    if (!goal.deleted) delete goal.deleted;

    if (existing >= 0) {
        goals[existing] = { ...goals[existing], ...goal, updatedAt: new Date().toISOString() };
    } else {
        goals.push(goal);
    }
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    triggerCloudSync();
    return goal;
}

function deleteGoal(id) {
    const goals = getGoals(true);
    const index = goals.findIndex(g => g.id === id);
    if (index >= 0) {
        goals[index].deleted = true;
        goals[index].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
        triggerCloudSync();
    }
}

function updateGoalProgress(goalId, progress) {
    const goals = getGoals(true);
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        goal.currentProgress = progress;
        goal.updatedAt = new Date().toISOString();
        if (goal.target && progress >= goal.target) {
            goal.completed = true;
            goal.completedAt = new Date().toISOString();
        }
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
        triggerCloudSync();
    }
    return goal;
}

function completeGoal(goalId) {
    const goals = getGoals(true);
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        goal.completed = true;
        goal.completedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
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
function getWallets(includeDeleted = false) {
    const data = localStorage.getItem(STORAGE_KEYS.WALLETS);
    let wallets = data ? JSON.parse(data) : [];

    if (wallets.length === 0) {
        wallets.push({
            id: 'wallet_default',
            name: 'Tunai',
            balance: 0,
            isDefault: true,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
    }

    return includeDeleted ? wallets : wallets.filter(w => !w.deleted);
}

function saveWallet(wallet) {
    const wallets = getWallets(true);
    const existing = wallets.findIndex(w => w.id === wallet.id);

    if (existing >= 0) {
        wallets[existing] = { ...wallets[existing], ...wallet, updatedAt: new Date().toISOString() };
    } else {
        wallets.push(wallet);
    }
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
}

function deleteWallet(id) {
    const wallets = getWallets(true);
    const index = wallets.findIndex(w => w.id === id);

    if (index >= 0) {
        if (wallets[index].isDefault) {
            alert('Tidak bisa menghapus dompet utama!');
            return;
        }
        wallets[index].deleted = true;
        wallets[index].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
        triggerCloudSync(); // Ensure sync triggers
    }
}

function updateWalletBalance(walletId, amount, type) {
    const wallets = getWallets(true); // Update even if somehow hidden/deleted to maintain integrity
    const walletIndex = wallets.findIndex(w => w.id === walletId);
    if (walletIndex !== -1) {
        const change = type === 'income' ? amount : -amount;
        wallets[walletIndex].balance = (wallets[walletIndex].balance || 0) + change;
        wallets[walletIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
    }
}

// ===== ISLAMIC TRACKER OPERATIONS =====
function getIslamicTracks() {
    const data = localStorage.getItem(STORAGE_KEYS.ISLAMIC_TRACKS);
    return data ? JSON.parse(data) : {};
}

function getIslamicTrackByDate(dateStr) {
    const tracks = getIslamicTracks();
    // Default structure for a new day
    return tracks[dateStr] || {
        date: dateStr,
        prayers: { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false },
        qobliyah: false,
        sedekah: false,
        waqiah: false,
        fasting: false,
        quranText: '',
        dhikrCount: 0,
        updatedAt: new Date().toISOString()
    };
}

function saveIslamicTrack(dateStr, trackData) {
    const tracks = getIslamicTracks();
    trackData.updatedAt = new Date().toISOString();
    tracks[dateStr] = trackData;

    // Opt-in cleanup: Keep only last 365 days to avoid localStorage bloat
    const keys = Object.keys(tracks).sort();
    if (keys.length > 365) {
        delete tracks[keys[0]];
    }

    localStorage.setItem(STORAGE_KEYS.ISLAMIC_TRACKS, JSON.stringify(tracks));
    triggerCloudSync();
    return trackData;
}

// ===== BUDGET OPERATIONS =====
function getBudgets(includeDeleted = false) {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    const budgets = data ? JSON.parse(data) : [];
    return includeDeleted ? budgets : budgets.filter(b => !b.deleted);
}

function saveBudget(budget) {
    const budgets = getBudgets(true);
    const existingIndex = budgets.findIndex(b => b.category === budget.category && !b.deleted); // Check active only for collision

    if (existingIndex !== -1) {
        if (confirm('Kategori ini sudah ada budget-nya. Timpa dengan nilai baru?')) {
            budgets[existingIndex] = { ...budgets[existingIndex], ...budget, updatedAt: new Date().toISOString() };
        } else {
            return;
        }
    } else {
        budgets.push(budget);
    }
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
}

function deleteBudget(id) {
    const budgets = getBudgets(true);
    const index = budgets.findIndex(b => b.id === id);
    if (index >= 0) {
        budgets[index].deleted = true;
        budgets[index].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
        triggerCloudSync();
    }
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
