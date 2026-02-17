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
    PRAYER_DATA: 'jurnal_ai_prayer_data'
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
function getJournals() {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    return data ? JSON.parse(data) : [];
}

function saveJournal(journal) {
    const journals = getJournals();
    const existing = journals.findIndex(j => j.id === journal.id);
    if (existing >= 0) {
        journals[existing] = journal;
    } else {
        journals.unshift(journal);
    }
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
    triggerCloudSync();
    return journal;
}

function deleteJournal(id) {
    const journals = getJournals().filter(j => j.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
    triggerCloudSync();
}

// ===== TASK OPERATIONS =====
function getTasks() {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
}

function saveTask(task) {
    const tasks = getTasks();
    const existing = tasks.findIndex(t => t.id === task.id);
    if (existing >= 0) {
        tasks[existing] = task;
    } else {
        tasks.unshift(task);
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    triggerCloudSync();
    return task;
}

// Bulk save for reordering or status updates
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    triggerCloudSync();
}

function deleteTask(id) {
    const tasks = getTasks().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    triggerCloudSync();
}

function toggleTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        triggerCloudSync();
    }
    return task;
}

// ===== SCHEDULE OPERATIONS =====
function getSchedules() {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    let schedules = data ? JSON.parse(data) : [];
    // SECURITY: Always filter out prayer times from read to ensure we don't propagate duplicates
    // We filter by ID prefix AND by Title content (Mosque emoji) to catch legacy corrupted data
    return schedules.filter(s => {
        const isSystemPrayer = s.isPrayer || String(s.id).startsWith('prayer-') || (s.title && s.title.includes('🕌'));
        return !isSystemPrayer;
    });
}

function saveSchedule(schedule) {
    let schedules = getSchedules(); // returns clean list
    const existing = schedules.findIndex(s => s.id === schedule.id);
    if (existing >= 0) {
        schedules[existing] = schedule;
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
    let schedules = getSchedules().filter(s => s.id !== id);
    // SAFETY: Ensure we never save prayer times
    schedules = schedules.filter(s => {
        const isSystemPrayer = s.isPrayer || String(s.id).startsWith('prayer-') || (s.title && s.title.includes('🕌'));
        return !isSystemPrayer;
    });
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    triggerCloudSync();
}

// ===== TRANSACTION OPERATIONS =====
function getTransactions() {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
}

function saveTransaction(transaction) {
    const transactions = getTransactions();
    transactions.unshift(transaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    triggerCloudSync();
    return transaction;
}

function deleteTransaction(id) {
    const transactions = getTransactions().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    triggerCloudSync();
}

// ===== HABIT OPERATIONS =====
function getHabits() {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
}

function saveHabit(habit) {
    const habits = getHabits();
    const existing = habits.findIndex(h => h.id === habit.id);
    if (existing >= 0) {
        habits[existing] = habit;
    } else {
        habits.push(habit);
    }
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    triggerCloudSync();
    return habit;
}

function deleteHabit(id) {
    const habits = getHabits().filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    triggerCloudSync();
}

function toggleHabitCompletion(habitId, date) {
    const habits = getHabits();
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
        if (!habit.completions) habit.completions = {};
        habit.completions[date] = !habit.completions[date];
        habit.streak = calculateStreak(habit);
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
        triggerCloudSync();
    }
    return habit;
}

// ===== GOALS OPERATIONS =====
function getGoals() {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
}

function saveGoal(goal) {
    const goals = getGoals();
    const existing = goals.findIndex(g => g.id === goal.id);
    if (existing >= 0) {
        goals[existing] = goal;
    } else {
        goals.push(goal);
    }
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    triggerCloudSync();
    return goal;
}

function deleteGoal(id) {
    const goals = getGoals().filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    triggerCloudSync();
}

function updateGoalProgress(goalId, progress) {
    const goals = getGoals();
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
    const goals = getGoals();
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
function getWallets() {
    const wallets = JSON.parse(localStorage.getItem(STORAGE_KEYS.WALLETS)) || [];
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
    return wallets;
}

function saveWallet(wallet) {
    const wallets = getWallets();
    wallets.push(wallet);
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
}

function deleteWallet(id) {
    let wallets = getWallets();
    const wallet = wallets.find(w => w.id === id);
    if (wallet && wallet.isDefault) {
        alert('Tidak bisa menghapus dompet utama!');
        return;
    }
    wallets = wallets.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
}

function updateWalletBalance(walletId, amount, type) {
    const wallets = getWallets();
    const walletIndex = wallets.findIndex(w => w.id === walletId);
    if (walletIndex !== -1) {
        const change = type === 'income' ? amount : -amount;
        wallets[walletIndex].balance = (wallets[walletIndex].balance || 0) + change;
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
    }
}

// ===== BUDGET OPERATIONS =====
function getBudgets() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS)) || [];
}

function saveBudget(budget) {
    const budgets = getBudgets();
    const existingIndex = budgets.findIndex(b => b.category === budget.category);
    if (existingIndex !== -1) {
        if (confirm('Kategori ini sudah ada budget-nya. Timpa dengan nilai baru?')) {
            budgets[existingIndex] = budget;
        } else {
            return;
        }
    } else {
        budgets.push(budget);
    }
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
}

function deleteBudget(id) {
    let budgets = getBudgets();
    budgets = budgets.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
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
