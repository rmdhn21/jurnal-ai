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
    PIN: 'jurnal_ai_pin'
};

// ===== SUPABASE CONFIG =====
const SUPABASE_URL_DEFAULT = 'https://oybywsjhgkilpceisxzn.supabase.co';
const SUPABASE_KEY_DEFAULT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ynl3c2poZ2tpbHBjZWlzeHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTQ0MDIsImV4cCI6MjA4NTk3MDQwMn0.sSNrv1LPn-WRrnrnwus0aJDEmulR6qoWMHc4KeQL_4w';

let supabaseClient = null;

function initSupabase() {
    const customUrl = localStorage.getItem('supabase_url');
    const customKey = localStorage.getItem('supabase_key');

    // Use custom creds if available, otherwise try default (if user didn't overwrite)
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

    // Check session first
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session) {
        console.warn('Sync aborted: No active session');
        updateSyncStatus('Offline');
        return;
    }

    const userId = session.user.id;
    console.log('Syncing starting for user:', userId);
    updateSyncStatus('Syncing');

    const data = {
        journals: getJournals(),
        tasks: getTasks(),
        schedules: getSchedules(),
        transactions: getTransactions(),
        habits: getHabits(),
        goals: getGoals(),
        reminderSettings: getReminderSettings(),
        wallets: getWallets(),
        updatedAt: new Date().toISOString()
    };

    try {
        const { error } = await supabaseClient
            .from('user_data')
            .upsert({ user_id: userId, data: data }, { onConflict: 'user_id' });

        if (error) {
            console.error('Sync ERROR:', error);
            updateSyncStatus('Error');
            // Show toast/alert if needed, but better to keep it silent normally unless critical
            if (error.code === '42501') {
                alert('Sync Gagal: Permission Denied. Pastikan Anda sudah setup RLS Policies di Supabase!');
            }
        } else {
            console.log('✅ Synced to cloud successfully');
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

        // Smart merge: combine local and cloud data, preferring newer items
        function mergeArrays(localArr, cloudArr) {
            const merged = new Map();

            // Add all local items first
            localArr.forEach(item => {
                merged.set(item.id, item);
            });

            // Merge cloud items - only overwrite if cloud is newer or local doesn't exist
            cloudArr.forEach(cloudItem => {
                const localItem = merged.get(cloudItem.id);
                if (!localItem) {
                    // New item from cloud
                    merged.set(cloudItem.id, cloudItem);
                } else {
                    // Compare timestamps - use newer version
                    const localTime = new Date(localItem.updatedAt || localItem.createdAt || 0).getTime();
                    const cloudTime = new Date(cloudItem.updatedAt || cloudItem.createdAt || 0).getTime();

                    if (cloudTime > localTime) {
                        merged.set(cloudItem.id, cloudItem);
                    }
                    // If local is newer or same, keep local (already in map)
                }
            });

            return Array.from(merged.values());
        }

        // Special merge for habits - also merge completions
        function mergeHabits(localHabits, cloudHabits) {
            const merged = new Map();

            localHabits.forEach(h => merged.set(h.id, { ...h }));

            cloudHabits.forEach(cloudHabit => {
                const localHabit = merged.get(cloudHabit.id);
                if (!localHabit) {
                    merged.set(cloudHabit.id, cloudHabit);
                } else {
                    // Merge completions - combine both
                    const mergedCompletions = {
                        ...cloudHabit.completions,
                        ...localHabit.completions  // Local wins for same dates
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

        // Apply smart merge
        if (cloudData.journals) {
            const merged = mergeArrays(getJournals(), cloudData.journals);
            localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(merged));
        }
        if (cloudData.tasks) {
            const merged = mergeArrays(getTasks(), cloudData.tasks);
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(merged));
        }
        if (cloudData.schedules) {
            const merged = mergeArrays(getSchedules(), cloudData.schedules);
            localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(merged));
        }
        if (cloudData.transactions) {
            const merged = mergeArrays(getTransactions(), cloudData.transactions);
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(merged));
        }
        if (cloudData.habits) {
            const merged = mergeHabits(getHabits(), cloudData.habits);
            localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(merged));
        }
        if (cloudData.reminderSettings) {
            localStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(cloudData.reminderSettings));
        }
        if (cloudData.wallets) {
            const merged = mergeArrays(getWallets(), cloudData.wallets);
            localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(merged));
        }

        console.log('✅ Smart sync from cloud completed');

        // Reload UI to show merged data
        initJournalUI();
        initPlannerUI();
        initFinanceUI();
        initHabitsUI();
        initDashboard();

        return true;
    } catch (err) {
        console.error('Sync from cloud failed:', err);
        return false;
    }
}

// Cloud-Only Sync: REPLACE local data with cloud data (no merge)
// Use this for cloud login to ensure consistency across devices
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
                // No data in cloud yet - this is first login, keep local data and sync to cloud
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

        // REPLACE local data completely with cloud data
        if (cloudData.journals) {
            localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(cloudData.journals));
        }
        if (cloudData.tasks) {
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(cloudData.tasks));
        }
        if (cloudData.schedules) {
            localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(cloudData.schedules));
        }
        if (cloudData.transactions) {
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(cloudData.transactions));
        }
        if (cloudData.habits) {
            localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(cloudData.habits));
        }
        if (cloudData.goals) {
            localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(cloudData.goals));
        }
        if (cloudData.reminderSettings) {
            localStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(cloudData.reminderSettings));
        }

        console.log('✅ Cloud-Only Sync completed - local data replaced with cloud data');

        // Reload UI to show cloud data
        if (typeof initJournalUI === 'function') initJournalUI();
        if (typeof initPlannerUI === 'function') initPlannerUI();
        if (typeof initFinanceUI === 'function') initFinanceUI();
        if (typeof initHabitsUI === 'function') initHabitsUI();
        if (typeof initGoalsUI === 'function') initGoalsUI();
        if (typeof initDashboard === 'function') initDashboard();

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

    // Remove all status classes
    indicator.classList.remove('synced', 'syncing', 'offline', 'error');

    switch (status) {
        case 'Synced':
        case 'synced':
            indicator.classList.add('synced');
            icon.textContent = '🟢';
            text.textContent = 'Synced';
            break;
        case 'Syncing':
        case 'syncing':
            indicator.classList.add('syncing');
            icon.textContent = '🔵';
            text.textContent = 'Syncing...';
            break;
        case 'Offline':
        case 'offline':
            indicator.classList.add('offline');
            icon.textContent = '⚫';
            text.textContent = 'Offline';
            break;
        case 'Error':
        case 'error':
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

// Auto-sync when data changes
function triggerCloudSync() {
    if (isCloudSyncEnabled()) {
        // Debounce sync
        clearTimeout(window.syncTimeout);
        window.syncTimeout = setTimeout(syncToCloud, 2000);
    }
}

// Journal Operations
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

// Task Operations
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

// Schedule Operations
function getSchedules() {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    return data ? JSON.parse(data) : [];
}

function saveSchedule(schedule) {
    const schedules = getSchedules();
    const existing = schedules.findIndex(s => s.id === schedule.id);

    if (existing >= 0) {
        schedules[existing] = schedule;
    } else {
        schedules.push(schedule);
    }

    schedules.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    schedules.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    triggerCloudSync();
    return schedule;
}

function deleteSchedule(id) {
    const schedules = getSchedules().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    triggerCloudSync();
}

// Transaction Operations
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

// Habit Operations
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
        // Update streak
        habit.streak = calculateStreak(habit);
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
        triggerCloudSync();
    }
    return habit;
}

// Goals Operations
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

        // Check if goal is completed
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

// API Key Operations
function getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

function saveApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}

// Utility
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

// ===== AI MODULE =====
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `Kamu adalah AI pendamping produktivitas yang tenang, non-judgmental, dan ringkas.
Tujuanmu: membantu pengguna melihat situasi dengan jernih dan memberi 1–2 saran kecil yang bisa langsung diubah menjadi tindakan (jadwal atau to-do).

INSTRUKSI OUTPUT:
Berikan output HANYA dalam format JSON dengan struktur berikut:
{
  "validation": "1-2 kalimat validasi empatik",
  "summary": ["poin 1", "poin 2", "poin 3"],
  "suggestions": [
    {"id": "1", "text": "saran pertama", "type": "todo"},
    {"id": "2", "text": "saran kedua", "type": "schedule"}
  ],
  "closing_question": "pertanyaan penutup"
}

ATURAN:
- validation: 1-2 kalimat validasi empatik
- summary: maksimal 3 poin ringkasan
- suggestions: 1-2 saran dengan type "todo", "schedule", atau "note"
- closing_question: 1 pertanyaan untuk mendorong tindakan
- Gunakan bahasa Indonesia yang hangat
- JANGAN tambahkan teks apapun di luar JSON`;

async function getAIResponse(journalText) {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('API key belum diatur. Silakan masukkan Gemini API key di pengaturan.');
    }

    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${SYSTEM_PROMPT}\n\nBerikut adalah jurnal saya:\n${journalText}\n\nBerikan respons dalam format JSON.`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
        }
    };

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('API Error:', error);
            throw new Error(error.error?.message || 'Gagal mendapatkan respon dari AI');
        }

        const data = await response.json();
        let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            console.error('Empty response from AI:', data);
            throw new Error('Respon AI kosong');
        }

        console.log('Raw AI response:', textResponse);

        // Clean up the response
        textResponse = textResponse.trim();

        // Remove markdown code blocks if present
        textResponse = textResponse.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
        textResponse = textResponse.replace(/\s*```$/i, '');

        // Try to find JSON object
        let jsonString = textResponse;

        // If response doesn't start with {, try to find it
        if (!jsonString.startsWith('{')) {
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonString = jsonMatch[0];
            }
        }

        let aiResponse;
        try {
            aiResponse = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Attempted to parse:', jsonString);

            // Try to create a fallback response
            aiResponse = createFallbackResponse(textResponse);
        }

        // Validate and fix response structure
        aiResponse = validateAndFixResponse(aiResponse);

        return aiResponse;

    } catch (error) {
        console.error('AI Error:', error);
        throw error;
    }
}

function createFallbackResponse(text) {
    // If JSON parsing failed, create a basic response from the text
    return {
        validation: "Terima kasih sudah berbagi hari ini.",
        summary: ["Jurnal Anda telah dicatat"],
        suggestions: [
            { id: "1", text: "Luangkan waktu untuk refleksi", type: "note" }
        ],
        closing_question: "Apa satu hal kecil yang bisa Anda lakukan hari ini?"
    };
}

function validateAndFixResponse(response) {
    // Ensure all required fields exist
    if (!response.validation || typeof response.validation !== 'string') {
        response.validation = "Terima kasih sudah berbagi.";
    }

    if (!Array.isArray(response.summary)) {
        response.summary = response.summary ? [String(response.summary)] : ["Jurnal Anda telah dicatat"];
    }

    if (!Array.isArray(response.suggestions)) {
        response.suggestions = [];
    }

    // Fix suggestions structure
    response.suggestions = response.suggestions.map((s, i) => ({
        id: s.id || String(i + 1),
        text: s.text || s.saran || String(s),
        type: s.type || s.tipe || "note"
    }));

    if (!response.closing_question || typeof response.closing_question !== 'string') {
        response.closing_question = "Apa langkah kecil yang bisa Anda ambil?";
    }

    return response;
}


// ===== WALLET MODULE =====
function getWallets() {
    const wallets = JSON.parse(localStorage.getItem(STORAGE_KEYS.WALLETS)) || [];
    // Ensure default wallet exists
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
    // syncToCloud(); // Auto sync
}

function deleteWallet(id) {
    let wallets = getWallets();
    // Don't delete default wallet
    const wallet = wallets.find(w => w.id === id);
    if (wallet && wallet.isDefault) {
        alert('Tidak bisa menghapus dompet utama!');
        return;
    }

    wallets = wallets.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
    // syncToCloud(); // Auto sync
}

function updateWalletBalance(walletId, amount, type) {
    const wallets = getWallets();
    const walletIndex = wallets.findIndex(w => w.id === walletId);

    if (walletIndex !== -1) {
        // Amount is always positive from transaction, type determines sign
        // But for balance calculation:
        // Income: +amount
        // Expense: -amount
        const change = type === 'income' ? amount : -amount;
        wallets[walletIndex].balance = (wallets[walletIndex].balance || 0) + change;
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
        // syncToCloud(); // Auto sync
    }
}


// ===== BUDGET MODULE =====
function getBudgets() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS)) || [];
}

function saveBudget(budget) {
    const budgets = getBudgets();
    // Check if category already has a budget
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
    // syncToCloud(); // Auto sync
}

function deleteBudget(id) {
    let budgets = getBudgets();
    budgets = budgets.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    // syncToCloud(); // Auto sync
}

function getCategoryExpenses(category) {
    const transactions = getTransactions();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
}


// ===== THEME MODULE =====
function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    setTheme(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    // Update button icon
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        toggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// ===== CHARTS MODULE =====
let financeChart = null;
let habitsChart = null;
let moodChart = null;

// Mood value mapping
const MOOD_VALUES = {
    'great': 5,
    'good': 4,
    'neutral': 3,
    'bad': 2,
    'terrible': 1
};

const MOOD_EMOJIS = {
    'great': '😄',
    'good': '🙂',
    'neutral': '😐',
    'bad': '😔',
    'terrible': '😢'
};

function initMoodChart() {
    const ctx = document.getElementById('mood-chart');
    if (!ctx) return;

    const journals = getJournals();
    const weeklyData = getWeeklyMoodData(journals);

    if (moodChart) {
        moodChart.destroy();
    }

    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeklyData.labels,
            datasets: [{
                label: 'Mood',
                data: weeklyData.values,
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const moodNames = ['', 'Buruk', 'Kurang Baik', 'Biasa', 'Baik', 'Sangat Baik'];
                            return moodNames[context.raw] || 'Tidak ada data';
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        color: '#a0a0b0',
                        callback: function (value) {
                            const emojis = ['', '😢', '😔', '😐', '🙂', '😄'];
                            return emojis[value] || '';
                        }
                    },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: '#a0a0b0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

function getWeeklyMoodData(journals) {
    const labels = [];
    const values = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));

        // Find journal for this day
        const dayJournal = journals.find(j => {
            const journalDate = new Date(j.createdAt).toISOString().split('T')[0];
            return journalDate === dateStr;
        });

        if (dayJournal && dayJournal.mood) {
            values.push(MOOD_VALUES[dayJournal.mood] || 3);
        } else {
            values.push(null); // No data
        }
    }

    return { labels, values };
}

function initFinanceChart() {
    const ctx = document.getElementById('finance-chart');
    if (!ctx) return;

    const transactions = getTransactions();
    const monthlyData = getMonthlyFinanceData(transactions);

    if (financeChart) {
        financeChart.destroy();
    }

    financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Pemasukan',
                    data: monthlyData.income,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1
                },
                {
                    label: 'Pengeluaran',
                    data: monthlyData.expense,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#a0a0b0'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#a0a0b0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: '#a0a0b0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

function getMonthlyFinanceData(transactions) {
    const months = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months[key] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
        const date = new Date(t.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (months[key]) {
            if (t.type === 'income') {
                months[key].income += t.amount;
            } else {
                months[key].expense += t.amount;
            }
        }
    });

    const labels = Object.keys(months).map(k => {
        const [y, m] = k.split('-');
        return new Date(y, m - 1).toLocaleDateString('id-ID', { month: 'short' });
    });

    return {
        labels,
        income: Object.values(months).map(m => m.income),
        expense: Object.values(months).map(m => m.expense)
    };
}

function initHabitsChart() {
    const ctx = document.getElementById('habits-chart');
    if (!ctx) return;

    const habits = getHabits();
    const weeklyData = getWeeklyHabitData(habits);

    if (habitsChart) {
        habitsChart.destroy();
    }

    habitsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeklyData.labels,
            datasets: [{
                label: 'Habits Completed',
                data: weeklyData.completions,
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#a0a0b0' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#a0a0b0',
                        stepSize: 1
                    },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: '#a0a0b0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

function getWeeklyHabitData(habits) {
    const labels = [];
    const completions = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));

        let count = 0;
        habits.forEach(h => {
            if (h.completions && h.completions[dateStr]) {
                count++;
            }
        });
        completions.push(count);
    }

    return { labels, completions };
}

// ===== JOURNAL UI =====
let currentJournal = null;
let currentAIResponse = null;
let currentMood = null;  // Track selected mood

function initJournalUI() {
    const journalInput = document.getElementById('journal-input');
    const charCount = document.getElementById('char-count');
    const askAIBtn = document.getElementById('ask-ai-btn');
    const closeResponseBtn = document.getElementById('close-response');
    const saveJournalBtn = document.getElementById('save-journal-btn');

    // Character count
    journalInput.addEventListener('input', () => {
        charCount.textContent = `${journalInput.value.length} karakter`;
    });

    // Mood selector
    const moodOptions = document.getElementById('mood-options');
    if (moodOptions) {
        moodOptions.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove selected from all
                moodOptions.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                // Add selected to clicked
                btn.classList.add('selected');
                currentMood = btn.dataset.mood;
                console.log('Mood selected:', currentMood);
            });
        });
    }

    // Ask AI button
    askAIBtn.addEventListener('click', handleAskAI);

    // Close response
    closeResponseBtn.addEventListener('click', () => {
        document.getElementById('ai-response-section').classList.add('hidden');
    });

    // Save journal
    saveJournalBtn.addEventListener('click', handleSaveJournal);

    // Load history
    initTagInput();
    renderJournalHistory();
}

async function handleAskAI() {
    const journalInput = document.getElementById('journal-input');
    const text = journalInput.value.trim();

    if (!text) {
        alert('Tulis sesuatu dulu di jurnal ya!');
        return;
    }

    const loadingEl = document.getElementById('ai-loading');
    const responseSection = document.getElementById('ai-response-section');

    // Show loading
    loadingEl.classList.remove('hidden');
    responseSection.classList.add('hidden');

    try {
        const aiResponse = await getAIResponse(text);
        currentAIResponse = aiResponse;

        // Create journal entry with mood
        currentJournal = {
            id: generateId(),
            text: text,
            mood: currentMood || 'neutral',  // Default to neutral if not selected
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            aiResponse: aiResponse
        };

        // Render AI response
        renderAIResponse(aiResponse);

        // Show response section
        responseSection.classList.remove('hidden');

    } catch (error) {
        alert(error.message);
    } finally {
        loadingEl.classList.add('hidden');
    }
}

function renderAIResponse(response) {
    // Validation
    document.getElementById('ai-validation').textContent = response.validation;

    // Summary
    const summaryEl = document.getElementById('ai-summary');
    summaryEl.innerHTML = response.summary.map(point => `<li>${point}</li>`).join('');

    // Suggestions
    const suggestionsEl = document.getElementById('ai-suggestions');
    suggestionsEl.innerHTML = response.suggestions.map(suggestion => `
        <div class="suggestion-item" data-id="${suggestion.id}" data-type="${suggestion.type}">
            <span class="suggestion-text">${suggestion.text}</span>
            <div class="suggestion-actions">
                ${suggestion.type === 'schedule' ?
            `<button class="btn btn-small btn-primary add-schedule-btn" data-text="${suggestion.text}">📅 Jadwal</button>` :
            ''}
                ${suggestion.type === 'todo' ?
            `<button class="btn btn-small btn-primary add-todo-btn" data-text="${suggestion.text}">✓ To-Do</button>` :
            ''}
                ${suggestion.type === 'note' ?
            `<button class="btn btn-small btn-secondary">📝 Catatan</button>` :
            ''}
            </div>
        </div>
    `).join('');

    // Add event listeners to suggestion buttons
    suggestionsEl.querySelectorAll('.add-schedule-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            addScheduleFromSuggestion(text);
            btn.textContent = '✓ Ditambahkan';
            btn.disabled = true;
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
        });
    });

    suggestionsEl.querySelectorAll('.add-todo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            addTodoFromSuggestion(text);
            btn.textContent = '✓ Ditambahkan';
            btn.disabled = true;
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
        });
    });

    // Closing question
    document.getElementById('ai-closing').textContent = response.closing_question || '';
}

function handleSaveJournal() {
    if (!currentJournal) {
        alert('Tidak ada jurnal untuk disimpan');
        return;
    }

    // Add tags
    currentJournal.tags = [...currentTags];

    saveJournal(currentJournal);

    // Clear input
    document.getElementById('journal-input').value = '';
    document.getElementById('char-count').textContent = '0 karakter';
    document.getElementById('ai-response-section').classList.add('hidden');

    // Reset mood selector
    currentMood = null;
    const moodOptions = document.getElementById('mood-options');
    if (moodOptions) {
        moodOptions.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    }

    // Reset current journal
    currentJournal = null;
    currentAIResponse = null;

    // Reset tags
    currentTags = [];
    renderTags();
    updateTagFilterOptions();

    // Refresh history
    renderJournalHistory();

    alert('Jurnal berhasil disimpan!');
}

function renderJournalHistory() {
    const historyEl = document.getElementById('journal-history');
    let journals = getJournals();

    // Filter by mood
    if (activeMoodFilter !== 'all') {
        journals = journals.filter(j => j.mood === activeMoodFilter);
    }

    // Filter by tag
    if (activeTagFilter !== 'all') {
        journals = journals.filter(j => j.tags && j.tags.includes(activeTagFilter));
    }

    if (journals.length === 0) {
        historyEl.innerHTML = `
            <div class="empty-state">
                <p>Belum ada jurnal tersimpan</p>
            </div>
        `;
        return;
    }

    historyEl.innerHTML = journals.slice(0, 50).map(journal => {
        const moodEmoji = MOOD_EMOJIS[journal.mood] || '';
        const tagsHtml = journal.tags && journal.tags.length > 0
            ? `<div class="journal-tags-display">${journal.tags.map(t => `<span class="journal-tag">#${t}</span>`).join('')}</div>`
            : '';

        return `
        <div class="history-item" data-id="${journal.id}">
            <div class="history-date">
                ${moodEmoji ? `<span class="mood-indicator">${moodEmoji}</span>` : ''}
                ${formatShortDate(journal.createdAt)}
            </div>
            <div class="history-preview">${journal.text.substring(0, 100)}${journal.text.length > 100 ? '...' : ''}</div>
            ${tagsHtml}
            <button class="delete-btn" data-id="${journal.id}" title="Hapus">🗑️</button>
        </div>
    `}).join('');

    // Add click handlers to view journal
    historyEl.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            const journal = journals.find(j => j.id === item.dataset.id);
            if (journal) {
                viewJournal(journal);
            }
        });
    });

    // Add delete handlers
    historyEl.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Hapus jurnal ini?')) {
                deleteJournal(btn.dataset.id);
                renderJournalHistory();
            }
        });
    });
}

function viewJournal(journal) {
    document.getElementById('journal-input').value = journal.text;
    document.getElementById('char-count').textContent = `${journal.text.length} karakter`;

    if (journal.aiResponse) {
        currentJournal = journal;
        currentAIResponse = journal.aiResponse;
        renderAIResponse(journal.aiResponse);
        document.getElementById('ai-response-section').classList.remove('hidden');
    }
}

// ===== PLANNER UI =====
function initPlannerUI() {
    const addTodoBtn = document.getElementById('add-todo-btn');
    const addScheduleBtn = document.getElementById('add-schedule-btn');

    // Add todo
    addTodoBtn.addEventListener('click', handleAddTodo);
    document.getElementById('new-todo-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTodo();
    });

    // Add schedule
    addScheduleBtn.addEventListener('click', handleAddSchedule);

    // Initial render
    renderTodoList();
    renderScheduleList();
}

function handleAddTodo() {
    const input = document.getElementById('new-todo-input');
    const text = input.value.trim();

    if (!text) return;

    const task = {
        id: generateId(),
        title: text,
        done: false,
        createdAt: new Date().toISOString(),
        createdFrom: null
    };

    saveTask(task);
    input.value = '';
    renderTodoList();
}

function handleAddSchedule() {
    const titleInput = document.getElementById('new-schedule-title');
    const datetimeInput = document.getElementById('new-schedule-datetime');

    const title = titleInput.value.trim();
    const datetime = datetimeInput.value;

    if (!title || !datetime) {
        alert('Isi nama kegiatan dan waktu!');
        return;
    }

    const schedule = {
        id: generateId(),
        title: title,
        datetime: datetime,
        createdAt: new Date().toISOString(),
        createdFrom: null
    };

    saveSchedule(schedule);
    titleInput.value = '';
    datetimeInput.value = '';
    renderScheduleList();
}

function addTodoFromSuggestion(text) {
    const task = {
        id: generateId(),
        title: text,
        done: false,
        createdAt: new Date().toISOString(),
        createdFrom: 'ai_suggestion'
    };

    saveTask(task);
    renderTodoList();
}

function addScheduleFromSuggestion(text) {
    // Set default time to tomorrow at 9 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const schedule = {
        id: generateId(),
        title: text,
        datetime: tomorrow.toISOString(),
        createdAt: new Date().toISOString(),
        createdFrom: 'ai_suggestion'
    };

    saveSchedule(schedule);
    renderScheduleList();
}

// ===== POMODORO TIMER =====
const POMODORO_CONFIG = {
    focusTime: 25 * 60,  // 25 minutes in seconds
    shortBreak: 5 * 60,  // 5 minutes
    longBreak: 15 * 60,  // 15 minutes
    sessionsBeforeLongBreak: 4
};

let pomodoroState = {
    isRunning: false,
    isPaused: false,
    timeRemaining: POMODORO_CONFIG.focusTime,
    currentSession: 1,
    isBreak: false,
    todayCount: 0,
    intervalId: null
};

function initPomodoroTimer() {
    // Load today's count from localStorage
    const savedCount = localStorage.getItem('pomodoro_today_count');
    const savedDate = localStorage.getItem('pomodoro_today_date');
    const today = getTodayString();

    if (savedDate === today && savedCount) {
        pomodoroState.todayCount = parseInt(savedCount) || 0;
    } else {
        localStorage.setItem('pomodoro_today_date', today);
        localStorage.setItem('pomodoro_today_count', '0');
    }

    updatePomodoroDisplay();

    // Event listeners
    document.getElementById('timer-start')?.addEventListener('click', startTimer);
    document.getElementById('timer-pause')?.addEventListener('click', pauseTimer);
    document.getElementById('timer-reset')?.addEventListener('click', resetTimer);
}

function startTimer() {
    if (pomodoroState.isRunning) return;

    pomodoroState.isRunning = true;
    pomodoroState.isPaused = false;

    document.getElementById('timer-start').disabled = true;
    document.getElementById('timer-pause').disabled = false;

    pomodoroState.intervalId = setInterval(() => {
        if (pomodoroState.timeRemaining > 0) {
            pomodoroState.timeRemaining--;
            updatePomodoroDisplay();
        } else {
            // Timer finished
            timerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    if (!pomodoroState.isRunning) return;

    pomodoroState.isRunning = false;
    pomodoroState.isPaused = true;

    clearInterval(pomodoroState.intervalId);

    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;
}

function resetTimer() {
    clearInterval(pomodoroState.intervalId);

    pomodoroState.isRunning = false;
    pomodoroState.isPaused = false;
    pomodoroState.timeRemaining = pomodoroState.isBreak ?
        (pomodoroState.currentSession % POMODORO_CONFIG.sessionsBeforeLongBreak === 0 ?
            POMODORO_CONFIG.longBreak : POMODORO_CONFIG.shortBreak) :
        POMODORO_CONFIG.focusTime;

    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;

    updatePomodoroDisplay();
}

function timerComplete() {
    clearInterval(pomodoroState.intervalId);
    pomodoroState.isRunning = false;

    // Play notification sound (using browser notification)
    if (Notification.permission === 'granted') {
        const title = pomodoroState.isBreak ? '⏰ Istirahat Selesai!' : '🍅 Pomodoro Selesai!';
        const body = pomodoroState.isBreak ? 'Kembali fokus!' : 'Waktunya istirahat!';
        new Notification(title, { body, icon: '🍅' });
    }

    // If focus session completed, increment count
    if (!pomodoroState.isBreak) {
        pomodoroState.todayCount++;
        pomodoroState.currentSession++;
        localStorage.setItem('pomodoro_today_count', pomodoroState.todayCount.toString());
    }

    // Toggle between focus and break
    pomodoroState.isBreak = !pomodoroState.isBreak;

    // Set new time based on mode
    if (pomodoroState.isBreak) {
        // Check if it's time for a long break
        pomodoroState.timeRemaining =
            (pomodoroState.currentSession - 1) % POMODORO_CONFIG.sessionsBeforeLongBreak === 0 ?
                POMODORO_CONFIG.longBreak : POMODORO_CONFIG.shortBreak;
    } else {
        pomodoroState.timeRemaining = POMODORO_CONFIG.focusTime;
    }

    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;

    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroState.timeRemaining / 60);
    const seconds = pomodoroState.timeRemaining % 60;

    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    const labelEl = document.getElementById('timer-label');
    const sessionEl = document.getElementById('pomodoro-session');
    const countEl = document.getElementById('pomodoro-count');

    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    if (labelEl) {
        labelEl.textContent = pomodoroState.isBreak ? 'Istirahat' : 'Fokus';
        labelEl.className = `timer-label ${pomodoroState.isBreak ? 'break' : 'focus'}`;
    }
    if (sessionEl) sessionEl.textContent = `Session ${pomodoroState.currentSession}`;
    if (countEl) countEl.textContent = pomodoroState.todayCount;
}

function renderTodoList() {
    const listEl = document.getElementById('todo-list');
    const tasks = getTasks();

    if (tasks.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><p>Belum ada to-do</p></div>`;
        return;
    }

    listEl.innerHTML = tasks.map(task => `
        <div class="task-item" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}>
            <span class="task-text ${task.done ? 'done' : ''}">${task.title}</span>
            <button class="delete-btn">🗑️</button>
        </div>
    `).join('');

    // Add event listeners
    listEl.querySelectorAll('.task-item').forEach(item => {
        const checkbox = item.querySelector('.task-checkbox');
        const deleteBtn = item.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            toggleTask(item.dataset.id);
            renderTodoList();
        });

        deleteBtn.addEventListener('click', () => {
            deleteTask(item.dataset.id);
            renderTodoList();
        });
    });
}

function renderScheduleList() {
    const listEl = document.getElementById('schedule-list');
    const schedules = getSchedules();

    if (schedules.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><p>Belum ada jadwal</p></div>`;
        return;
    }

    listEl.innerHTML = schedules.map(schedule => `
        <div class="schedule-item" data-id="${schedule.id}">
            <span class="schedule-time">${formatShortDate(schedule.datetime)}</span>
            <span class="task-text">${schedule.title}</span>
            <button class="delete-btn">🗑️</button>
        </div>
    `).join('');

    // Add event listeners
    listEl.querySelectorAll('.schedule-item').forEach(item => {
        const deleteBtn = item.querySelector('.delete-btn');

        deleteBtn.addEventListener('click', () => {
            deleteSchedule(item.dataset.id);
            renderScheduleList();
        });
    });
}

// ===== FINANCE UI =====
function initFinanceUI() {
    const addTransactionBtn = document.getElementById('add-transaction-btn');

    // Set default date to today
    const dateInput = document.getElementById('transaction-date');
    if (dateInput) {
        dateInput.value = getTodayString();
    }

    addTransactionBtn.addEventListener('click', handleAddTransaction);

    renderTransactionList();
    updateFinanceSummary();
    initFinanceChart();
    if (typeof initWalletUI === 'function') initWalletUI();
    if (typeof initBudgetUI === 'function') initBudgetUI();
}

function handleAddTransaction() {
    const type = document.getElementById('transaction-type').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const category = document.getElementById('transaction-category').value.trim();
    const date = document.getElementById('transaction-date').value;
    const desc = document.getElementById('transaction-desc').value.trim();

    const walletId = document.getElementById('transaction-wallet').value;

    if (!amount || amount <= 0) {
        alert('Masukkan jumlah yang valid!');
        return;
    }

    if (!category) {
        alert('Masukkan kategori!');
        return;
    }

    if (!walletId) {
        alert('Pilih dompet!');
        return;
    }

    const transaction = {
        id: generateId(),
        type: type,
        amount: amount,
        category: category,
        description: desc,
        walletId: walletId,
        date: date || getTodayString(),
        createdAt: new Date().toISOString()
    };

    saveTransaction(transaction);
    updateWalletBalance(walletId, amount, type);

    // Clear form
    document.getElementById('transaction-amount').value = '';
    document.getElementById('transaction-category').value = '';
    document.getElementById('transaction-desc').value = '';

    renderTransactionList();
    updateFinanceSummary();
    renderWalletListSummary(); // Update UI
    updateWalletSelectOptions(); // Update Select
    initFinanceChart();
}

function renderTransactionList() {
    const listEl = document.getElementById('transaction-list');
    const transactions = getTransactions();

    if (transactions.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><p>Belum ada transaksi</p></div>`;
        return;
    }

    listEl.innerHTML = transactions.slice(0, 20).map(t => `
        <div class="transaction-item" data-id="${t.id}">
            <span class="transaction-icon">${t.type === 'income' ? '💵' : '💸'}</span>
            <div class="transaction-info">
                <div class="transaction-category">${t.category}</div>
                <div class="transaction-desc">${t.description || ''}</div>
            </div>
            <div>
                <div class="transaction-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</div>
                <div class="transaction-date">${t.date}</div>
            </div>
            <button class="delete-btn">🗑️</button>
        </div>
    `).join('');

    listEl.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.transaction-item');
            deleteTransaction(item.dataset.id);
            renderTransactionList();
            updateFinanceSummary();
            initFinanceChart();
        });
    });
}

function updateFinanceSummary() {
    const transactions = getTransactions();

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-expense').textContent = formatCurrency(expense);
    document.getElementById('total-balance').textContent = formatCurrency(income - expense);
}

// ===== HABITS UI =====
function initHabitsUI() {
    const addHabitBtn = document.getElementById('add-habit-btn');

    addHabitBtn.addEventListener('click', handleAddHabit);
    document.getElementById('new-habit-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddHabit();
    });

    // Set today's date label
    const todayLabel = document.getElementById('today-date');
    if (todayLabel) {
        todayLabel.textContent = new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    }

    renderHabitsTodayList();
    renderAllHabitsList();
    initHabitsChart();
}

function handleAddHabit() {
    const input = document.getElementById('new-habit-input');
    const name = input.value.trim();

    if (!name) return;

    const habit = {
        id: generateId(),
        name: name,
        completions: {},
        createdAt: new Date().toISOString()
    };

    saveHabit(habit);
    input.value = '';

    renderHabitsTodayList();
    renderAllHabitsList();
    initHabitsChart();
}

function renderHabitsTodayList() {
    const listEl = document.getElementById('habits-today');
    const habits = getHabits();
    const today = getTodayString();

    if (habits.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><p>Belum ada habit. Tambahkan di bawah!</p></div>`;
        return;
    }

    listEl.innerHTML = habits.map(h => {
        const isCompleted = h.completions && h.completions[today];
        return `
            <div class="habit-item" data-id="${h.id}">
                <input type="checkbox" class="habit-checkbox" ${isCompleted ? 'checked' : ''}>
                <span class="habit-name ${isCompleted ? 'completed' : ''}">${h.name}</span>
            </div>
        `;
    }).join('');

    listEl.querySelectorAll('.habit-item').forEach(item => {
        const checkbox = item.querySelector('.habit-checkbox');
        checkbox.addEventListener('change', () => {
            toggleHabitCompletion(item.dataset.id, today);
            renderHabitsTodayList();
            initHabitsChart();
        });
    });
}

function renderAllHabitsList() {
    const listEl = document.getElementById('habits-list');
    const habits = getHabits();

    if (habits.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><p>Belum ada habit</p></div>`;
        return;
    }

    listEl.innerHTML = habits.map(h => {
        const streak = calculateStreak(h);
        return `
            <div class="habit-item" data-id="${h.id}">
                <span class="habit-name">${h.name}</span>
                <span class="habit-streak">🔥 ${streak} hari</span>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
    }).join('');

    listEl.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.habit-item');
            if (confirm('Hapus habit ini?')) {
                deleteHabit(item.dataset.id);
                renderHabitsTodayList();
                renderAllHabitsList();
                initHabitsChart();
            }
        });
    });
}

function calculateStreak(habit) {
    if (!habit.completions) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        if (habit.completions[dateStr]) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }

    return streak;
}

// ===== GOALS UI =====
let goalsListenersAttached = false;

function initGoalsUI() {
    const addBtn = document.getElementById('add-goal-btn');
    if (addBtn) {
        addBtn.addEventListener('click', handleAddGoal);
    }

    // Set up event delegation on the active goals list (once)
    const activeListEl = document.getElementById('active-goals-list');
    const completedListEl = document.getElementById('completed-goals-list');

    // Only attach listeners once to prevent stacking
    if (!goalsListenersAttached) {
        if (activeListEl) {
            attachGoalEventListeners(activeListEl);
        }
        if (completedListEl) {
            attachGoalEventListeners(completedListEl);
        }
        goalsListenersAttached = true;
    }

    renderGoalsList();
    updateGoalsStats();
}

function handleAddGoal() {
    const title = document.getElementById('goal-title').value.trim();
    const type = document.getElementById('goal-type').value;
    const target = parseInt(document.getElementById('goal-target').value) || 0;
    const unit = document.getElementById('goal-unit').value.trim();
    const deadline = document.getElementById('goal-deadline').value;
    const notes = document.getElementById('goal-notes').value.trim();

    if (!title) {
        alert('Masukkan judul goal!');
        return;
    }

    const goal = {
        id: generateId(),
        title: title,
        type: type,
        target: target,
        unit: unit || 'item',
        deadline: deadline,
        notes: notes,
        currentProgress: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    saveGoal(goal);

    // Clear form
    document.getElementById('goal-title').value = '';
    document.getElementById('goal-target').value = '';
    document.getElementById('goal-unit').value = '';
    document.getElementById('goal-deadline').value = '';
    document.getElementById('goal-notes').value = '';

    renderGoalsList();
    updateGoalsStats();
}

function renderGoalsList() {
    const activeListEl = document.getElementById('active-goals-list');
    const completedListEl = document.getElementById('completed-goals-list');

    if (!activeListEl || !completedListEl) return;

    const goals = getGoals();
    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);

    // Render active goals
    // IMPORTANT: Use arrow function to prevent .map() from passing index as isCompleted
    if (activeGoals.length === 0) {
        activeListEl.innerHTML = '<div class="empty-state"><p>Belum ada goals aktif</p></div>';
    } else {
        activeListEl.innerHTML = activeGoals.map(g => createGoalItem(g, false)).join('');
    }

    // Render completed goals
    if (completedGoals.length === 0) {
        completedListEl.innerHTML = '<div class="empty-state"><p>Belum ada goals tercapai</p></div>';
    } else {
        completedListEl.innerHTML = completedGoals.slice(0, 5).map(g => createGoalItem(g, true)).join('');
    }
}

function createGoalItem(goal, isCompleted = false) {
    const progress = goal.target > 0 ? Math.min(100, (goal.currentProgress / goal.target) * 100) : 0;
    const typeLabels = {
        'habit': '🔄 Habit',
        'count': '🔢 Target',
        'deadline': '📅 Deadline'
    };

    return `
        <div class="goal-item ${isCompleted ? 'completed' : ''}" data-id="${goal.id}">
            <div class="goal-header">
                <span class="goal-title">${goal.title}</span>
                <span class="goal-type">${typeLabels[goal.type] || goal.type}</span>
            </div>
            ${goal.target > 0 ? `
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>${goal.currentProgress} / ${goal.target} ${goal.unit}</span>
                        <span>${Math.round(progress)}%</span>
                    </div>
                </div>
            ` : ''}
            <div class="goal-footer">
                <span class="goal-deadline">${goal.deadline ? `⏰ ${formatShortDate(goal.deadline)}` : ''}</span>
                <div class="goal-actions">
                    ${!isCompleted ? `
                    <input type="number" class="progress-input" value="1" min="1" title="Jumlah progress">
                    <button class="increment-btn" title="Tambah Progress">➕</button>
                    <button class="complete-btn" title="Selesai">✅</button>
                    ` : ''}
                    <button class="delete-goal-btn" title="Hapus">🗑️</button>
                </div>
            </div>
        </div>
    `;
}

function attachGoalEventListeners(container) {
    // Use event delegation - single listener on container
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const goalItem = btn.closest('.goal-item');
        if (!goalItem) return;

        const goalId = goalItem.dataset.id;
        e.stopPropagation();

        // Increment progress
        if (btn.classList.contains('increment-btn')) {
            const goals = getGoals();
            const goal = goals.find(g => g.id === goalId);
            if (goal) {
                // Read the amount from the input field
                const progressInput = goalItem.querySelector('.progress-input');
                const amount = progressInput ? parseInt(progressInput.value) || 1 : 1;
                const newProgress = Math.min(goal.target, (goal.currentProgress || 0) + amount);
                updateGoalProgress(goalId, newProgress);
                renderGoalsList();
                updateGoalsStats();
            }
        }

        // Complete goal
        if (btn.classList.contains('complete-btn')) {
            completeGoal(goalId);
            renderGoalsList();
            updateGoalsStats();
        }

        // Delete goal
        if (btn.classList.contains('delete-goal-btn')) {
            if (confirm('Hapus goal ini?')) {
                deleteGoal(goalId);
                renderGoalsList();
                updateGoalsStats();
            }
        }
    });
}

function updateGoalsStats() {
    const goals = getGoals();
    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);

    const activeEl = document.getElementById('stat-goals-active');
    const completedEl = document.getElementById('stat-goals-completed');

    if (activeEl) activeEl.textContent = activeGoals.length;
    if (completedEl) completedEl.textContent = completedGoals.length;
}

// ===== GLOBAL SEARCH =====
function initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    // Debounce search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }

        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.global-search')) {
            searchResults.classList.add('hidden');
        }
    });

    // Show results on focus if there's a query
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            performSearch(searchInput.value.trim());
        }
    });
}

function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    const queryLower = query.toLowerCase();
    let results = [];

    // Search journals
    const journals = getJournals();
    journals.forEach(journal => {
        if (journal.text.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Jurnal',
                icon: '📝',
                title: formatShortDate(journal.createdAt),
                preview: journal.text.substring(0, 80),
                screen: 'journal',
                id: journal.id
            });
        }
    });

    // Search goals
    const goals = getGoals();
    goals.forEach(goal => {
        if (goal.title.toLowerCase().includes(queryLower) ||
            (goal.notes && goal.notes.toLowerCase().includes(queryLower))) {
            results.push({
                type: 'Goal',
                icon: '🎯',
                title: goal.title,
                preview: goal.completed ? 'Tercapai' : `Progress: ${goal.currentProgress || 0}/${goal.target} ${goal.unit}`,
                screen: 'goals',
                id: goal.id
            });
        }
    });

    // Search tasks
    const tasks = getTasks();
    tasks.forEach(task => {
        if (task.title.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Task',
                icon: '📋',
                title: task.title,
                preview: task.done ? '✅ Selesai' : '⏳ Belum selesai',
                screen: 'planner',
                id: task.id
            });
        }
    });

    // Search schedules
    const schedules = getSchedules();
    schedules.forEach(schedule => {
        if (schedule.title.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Jadwal',
                icon: '📅',
                title: schedule.title,
                preview: formatShortDate(schedule.datetime),
                screen: 'planner',
                id: schedule.id
            });
        }
    });

    // Search habits
    const habits = getHabits();
    habits.forEach(habit => {
        if (habit.name.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Habit',
                icon: '✅',
                title: habit.name,
                preview: `🔥 ${habit.streak || 0} hari streak`,
                screen: 'habits',
                id: habit.id
            });
        }
    });

    // Render results
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">Tidak ada hasil untuk "' + query + '"</div>';
    } else {
        searchResults.innerHTML = results.slice(0, 10).map(result => `
            <div class="search-result-item" data-screen="${result.screen}" data-id="${result.id}">
                <div class="search-result-type">${result.icon} ${result.type}</div>
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-preview">${result.preview}</div>
            </div>
        `).join('');

        // Add click handlers
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                navigateToScreen(screen);
                searchResults.classList.add('hidden');
                document.getElementById('global-search-input').value = '';
            });
        });
    }

    searchResults.classList.remove('hidden');
}

function navigateToScreen(screenName) {
    const navBtn = document.querySelector(`.nav-btn[data-screen="${screenName}"]`);
    if (navBtn) {
        navBtn.click();
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetScreen = btn.dataset.screen;

            // Update nav buttons
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update screens
            screens.forEach(screen => {
                screen.classList.remove('active');
                if (screen.id === `${targetScreen}-screen`) {
                    screen.classList.add('active');
                }
            });

            // Refresh data when switching screens
            if (targetScreen === 'dashboard') {
                updateDashboardStats();
                updateUpcomingSchedules();
                updateTodayReminders();
                initMoodChart();
            } else if (targetScreen === 'planner') {
                renderTodoList();
                renderScheduleList();
            } else if (targetScreen === 'journal') {
                renderJournalHistory();
            } else if (targetScreen === 'finance') {
                renderTransactionList();
                updateFinanceSummary();
                initFinanceChart();
            } else if (targetScreen === 'habits') {
                renderHabitsTodayList();
                renderAllHabitsList();
                initHabitsChart();
            } else if (targetScreen === 'goals') {
                renderGoalsList();
                updateGoalsStats();
            }
        });
    });
}

// ===== SETTINGS =====
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const modal = document.getElementById('settings-modal');

    // Open settings
    settingsBtn.addEventListener('click', showSettings);

    // Close settings
    closeSettingsBtn.addEventListener('click', hideSettings);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideSettings();
    });

    // Save settings
    saveSettingsBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            saveApiKey(apiKey);
            alert('API key berhasil disimpan!');
        } else {
            alert('Masukkan API key yang valid');
        }
    });

    // Save Cloud Config
    const saveCloudBtn = document.getElementById('save-cloud-config-btn');
    if (saveCloudBtn) {
        saveCloudBtn.addEventListener('click', saveCloudConfig);
    }

    // Load existing API key
    apiKeyInput.value = getApiKey();

    // Export Data
    document.getElementById('export-data-btn').addEventListener('click', exportAllData);

    // Import Data
    document.getElementById('import-data-btn').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input').addEventListener('change', importAllData);

    // Encrypt Data
    document.getElementById('encrypt-data-btn').addEventListener('click', encryptAllData);

    // Decrypt Data
    document.getElementById('decrypt-data-btn').addEventListener('click', decryptAllData);

    // Clear All Data
    document.getElementById('clear-all-data-btn').addEventListener('click', clearAllData);

    // Delete Cloud Account
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', deleteCloudAccount);
    }

    // Update encryption status
    updateEncryptionStatus();
}

function showSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
    document.getElementById('api-key-input').value = getApiKey();

    updateEncryptionStatus();
}

function hideSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

// ===== ENCRYPTION MODULE =====
const ENCRYPTION_KEY_STORAGE = 'jurnal_ai_encrypted';
const ENCRYPTION_SALT = 'jurnal_ai_salt_v1';

async function deriveKey(password) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(ENCRYPTION_SALT);

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptData(data, password) {
    const key = await deriveKey(password);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    return btoa(String.fromCharCode(...combined));
}

async function decryptData(encryptedString, password) {
    const key = await deriveKey(password);
    const combined = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const encryptedBuffer = combined.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encryptedBuffer
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
}

function getAllData() {
    return {
        journals: getJournals(),
        tasks: getTasks(),
        schedules: getSchedules(),
        transactions: getTransactions(),
        habits: getHabits(),
        exportedAt: new Date().toISOString()
    };
}

function restoreAllData(data) {
    if (data.journals) localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(data.journals));
    if (data.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
    if (data.schedules) localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(data.schedules));
    if (data.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
    if (data.habits) localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data.habits));
}

async function encryptAllData() {
    const password = document.getElementById('encryption-password').value;
    if (!password || password.length < 4) {
        alert('Password minimal 4 karakter!');
        return;
    }

    try {
        const data = getAllData();
        const encrypted = await encryptData(data, password);

        // Store encrypted data
        localStorage.setItem(ENCRYPTION_KEY_STORAGE, encrypted);

        // Clear plain data
        localStorage.removeItem(STORAGE_KEYS.JOURNALS);
        localStorage.removeItem(STORAGE_KEYS.TASKS);
        localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
        localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
        localStorage.removeItem(STORAGE_KEYS.HABITS);

        document.getElementById('encryption-password').value = '';
        updateEncryptionStatus();
        alert('✅ Data berhasil dienkripsi! Ingat password Anda.');

        // Refresh UI
        location.reload();
    } catch (error) {
        console.error('Encryption error:', error);
        alert('Gagal mengenkripsi data: ' + error.message);
    }
}

async function decryptAllData() {
    const password = document.getElementById('encryption-password').value;
    if (!password) {
        alert('Masukkan password!');
        return;
    }

    const encrypted = localStorage.getItem(ENCRYPTION_KEY_STORAGE);
    if (!encrypted) {
        alert('Tidak ada data terenkripsi.');
        return;
    }

    try {
        const data = await decryptData(encrypted, password);

        // Restore data
        restoreAllData(data);

        // Remove encrypted data
        localStorage.removeItem(ENCRYPTION_KEY_STORAGE);

        document.getElementById('encryption-password').value = '';
        updateEncryptionStatus();
        alert('✅ Data berhasil didekripsi!');

        // Refresh UI
        location.reload();
    } catch (error) {
        console.error('Decryption error:', error);
        alert('❌ Password salah atau data rusak!');
    }
}

function updateEncryptionStatus() {
    const statusEl = document.getElementById('encryption-status');
    const isEncrypted = localStorage.getItem(ENCRYPTION_KEY_STORAGE) !== null;

    if (isEncrypted) {
        statusEl.innerHTML = '<span style="color: #f59e0b;">🔒 Data terenkripsi - masukkan password untuk membuka</span>';
    } else {
        statusEl.innerHTML = '<span style="color: #10b981;">🔓 Data tidak terenkripsi</span>';
    }
}

function exportAllData() {
    const isEncrypted = localStorage.getItem(ENCRYPTION_KEY_STORAGE) !== null;

    let exportData;
    if (isEncrypted) {
        // Export encrypted data as-is
        exportData = {
            encrypted: true,
            data: localStorage.getItem(ENCRYPTION_KEY_STORAGE),
            exportedAt: new Date().toISOString()
        };
    } else {
        // Export plain data
        exportData = {
            encrypted: false,
            ...getAllData()
        };
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jurnal-ai-backup-${getTodayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert('✅ Data berhasil di-export!');
}

function importAllData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importData = JSON.parse(event.target.result);

            if (importData.encrypted) {
                // Import encrypted data
                localStorage.setItem(ENCRYPTION_KEY_STORAGE, importData.data);
                localStorage.removeItem(STORAGE_KEYS.JOURNALS);
                localStorage.removeItem(STORAGE_KEYS.TASKS);
                localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
                localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
                localStorage.removeItem(STORAGE_KEYS.HABITS);
                alert('✅ Data terenkripsi berhasil di-import! Masukkan password untuk membuka.');
            } else {
                // Import plain data
                restoreAllData(importData);
                localStorage.removeItem(ENCRYPTION_KEY_STORAGE);
                alert('✅ Data berhasil di-import!');
            }

            updateEncryptionStatus();
            location.reload();
        } catch (error) {
            console.error('Import error:', error);
            alert('❌ File tidak valid!');
        }
    };
    reader.readAsText(file);

    // Reset file input
    e.target.value = '';
}

async function clearAllData() {
    if (!confirm('⚠️ PERINGATAN: Semua data akan dihapus permanen!\n\nAnda yakin?')) return;
    if (!confirm('Ini adalah konfirmasi terakhir. Lanjutkan hapus semua data?')) return;

    // Clear all local storage
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    localStorage.removeItem(ENCRYPTION_KEY_STORAGE);

    // Also clear data from cloud if cloud sync is enabled
    if (isCloudSyncEnabled() && supabaseClient) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                const userId = session.user.id;
                console.log('🗑️ Clearing cloud data for user:', userId);

                // Delete user data from Supabase
                const { error } = await supabaseClient
                    .from('user_data')
                    .delete()
                    .eq('user_id', userId);

                if (error) {
                    console.error('Failed to clear cloud data:', error);
                } else {
                    console.log('✅ Cloud data cleared successfully');
                }
            }
        } catch (err) {
            console.error('Error clearing cloud data:', err);
        }
    }

    alert('Semua data telah dihapus (lokal dan cloud).');
    location.reload();
}

// Delete cloud account (Supabase account + data)
async function deleteCloudAccount() {
    if (!isCloudSyncEnabled() || !supabaseClient) {
        alert('Anda tidak login dengan akun cloud.');
        return;
    }

    if (!confirm('⚠️ PERINGATAN: Akun cloud dan semua data akan dihapus permanen!\n\nAnda yakin?')) return;
    if (!confirm('Ini adalah konfirmasi terakhir.\n\nSemua data di cloud akan hilang selamanya.\n\nLanjutkan?')) return;

    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            alert('Tidak ada session aktif. Silakan login ulang.');
            return;
        }

        const userId = session.user.id;
        console.log('🗑️ Deleting cloud account for user:', userId);

        // Step 1: Delete user data from database
        const { error: dataError } = await supabaseClient
            .from('user_data')
            .delete()
            .eq('user_id', userId);

        if (dataError) {
            console.error('Failed to delete user data:', dataError);
        } else {
            console.log('✅ User data deleted');
        }

        // Step 2: Sign out
        await supabaseClient.auth.signOut();

        // Step 3: Clear local storage
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        localStorage.removeItem(ENCRYPTION_KEY_STORAGE);
        disableCloudSync();

        // Note: Supabase doesn't allow users to delete their own auth account via client SDK
        // The auth record will remain but data is deleted
        alert('✅ Data cloud telah dihapus dan Anda telah logout.\n\nNote: Untuk menghapus akun sepenuhnya, hubungi admin atau hapus dari Supabase Dashboard.');

        location.reload();
    } catch (err) {
        console.error('Error deleting cloud account:', err);
        alert('Gagal menghapus akun: ' + err.message);
    }
}

// ===== LOGIN MODULE =====
function getUsers() {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : {};
}

function saveUser(username, passwordHash) {
    const users = getUsers();
    users[username] = { passwordHash, createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getSession() {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
}

function saveSession(username) {
    const session = { username, loginAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'jurnal_ai_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function initLoginUI() {
    // Safe event listener helper
    const addListener = (id, event, handler) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener(event, handler);
            console.log(`Listener added for ${id}`);
        } else {
            console.warn(`Element ${id} not found in initLoginUI`);
        }
    };

    // Toggle forms
    addListener('show-register-btn', 'click', () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    });

    addListener('show-login-btn', 'click', () => {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    // Login
    addListener('login-btn', 'click', handleLogin);

    const loginPass = document.getElementById('login-password');
    if (loginPass) {
        loginPass.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    // Register
    addListener('register-btn', 'click', handleRegister);

    // Logout
    addListener('logout-btn', 'click', handleLogout);

    // Cloud Login
    addListener('cloud-login-btn', 'click', () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('cloud-login-form').classList.remove('hidden');
    });

    addListener('back-to-local-btn', 'click', () => {
        document.getElementById('cloud-login-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    addListener('cloud-signin-btn', 'click', handleCloudSignIn);
    addListener('cloud-signup-btn', 'click', handleCloudSignUp);
}

async function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert('Masukkan username dan password!');
        return;
    }

    const users = getUsers();
    const user = users[username];

    if (!user) {
        alert('Username tidak ditemukan. Silakan daftar dulu.');
        return;
    }

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
        alert('Password salah!');
        return;
    }

    // Success - save session and show app
    saveSession(username);
    showMainApp();
}

async function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;

    if (!username || !password) {
        alert('Masukkan username dan password!');
        return;
    }

    if (username.length < 3) {
        alert('Username minimal 3 karakter!');
        return;
    }

    if (password.length < 4) {
        alert('Password minimal 4 karakter!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Password tidak cocok!');
        return;
    }

    const users = getUsers();
    if (users[username]) {
        alert('Username sudah dipakai!');
        return;
    }

    // Hash and save
    const passwordHash = await hashPassword(password);
    saveUser(username, passwordHash);
    saveSession(username);

    alert('✅ Akun berhasil dibuat!');
    showMainApp();
}

function handleLogout() {
    if (confirm('Yakin mau logout?')) {
        clearSession();
        disableCloudSync();

        // Also sign out from Supabase if logged in
        if (supabaseClient) {
            supabaseClient.auth.signOut();
        }

        location.reload();
    }
}

// ===== CLOUD AUTH HANDLERS =====
async function handleCloudSignIn() {
    if (!initSupabase()) {
        alert('Cloud service tidak tersedia. Coba lagi nanti.');
        return;
    }

    const email = document.getElementById('cloud-email').value.trim();
    const password = document.getElementById('cloud-password').value;

    if (!email || !password) {
        alert('Masukkan email dan password!');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert('Login gagal: ' + error.message);
            return;
        }

        // Enable cloud sync and REPLACE local data with cloud data
        // This ensures consistency across devices
        enableCloudSync();
        await syncFromCloudReplace();

        // Create local session with email
        saveSession(email);

        alert('✅ Cloud login berhasil! Data telah disinkronkan dari cloud.');
        showMainApp();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function handleCloudSignUp() {
    if (!initSupabase()) {
        alert('Cloud service tidak tersedia. Coba lagi nanti.');
        return;
    }

    const email = document.getElementById('cloud-email').value.trim();
    const password = document.getElementById('cloud-password').value;

    if (!email || !password) {
        alert('Masukkan email dan password!');
        return;
    }

    if (password.length < 6) {
        alert('Password minimal 6 karakter!');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            alert('Sign up gagal: ' + error.message);
            return;
        }

        // Enable cloud sync
        enableCloudSync();

        // Sync local data to cloud
        saveSession(email);
        await syncToCloud();

        alert('✅ Akun cloud berhasil dibuat! Cek email untuk verifikasi (opsional).');
        showMainApp();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

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
    initFinanceUI();
    initHabitsUI();
    initGlobalSearch();
    initAIAnalysis();
    initReminder();

    // Check if API key is set
    if (!getApiKey()) {
        showSettings();
    }
}

// ===== AI ANALYSIS MODULE =====
function initAIAnalysis() {
    document.getElementById('analyze-planner-btn').addEventListener('click', () => analyzeWithAI('planner'));
    document.getElementById('analyze-finance-btn').addEventListener('click', () => analyzeWithAI('finance'));
    document.getElementById('analyze-habits-btn').addEventListener('click', () => analyzeWithAI('habits'));
    document.getElementById('close-analysis').addEventListener('click', hideAnalysisModal);

    const modal = document.getElementById('analysis-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideAnalysisModal();
    });
}

function showAnalysisModal(title) {
    document.getElementById('analysis-title').textContent = title;
    document.getElementById('analysis-loading').classList.remove('hidden');
    document.getElementById('analysis-content').innerHTML = '';
    document.getElementById('analysis-modal').classList.remove('hidden');
}

function hideAnalysisModal() {
    document.getElementById('analysis-modal').classList.add('hidden');
}

async function analyzeWithAI(type) {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('Atur API key dulu di Settings!');
        showSettings();
        return;
    }

    let data, prompt, title;

    switch (type) {
        case 'planner':
            title = '🧠 Analisis Produktivitas';
            data = { tasks: getTasks(), schedules: getSchedules() };
            prompt = `Analisis data produktivitas berikut dan berikan insight:
            
Tasks: ${JSON.stringify(data.tasks)}
Schedules: ${JSON.stringify(data.schedules)}

Berikan analisis dalam format HTML dengan struktur:
<h4>📊 Ringkasan</h4>
<p>ringkasan singkat</p>
<h4>✅ Yang Sudah Baik</h4>
<ul><li>poin positif</li></ul>
<h4>⚠️ Yang Perlu Perhatian</h4>
<ul><li>area improvement</li></ul>
<h4>💡 Saran</h4>
<ul><li>saran actionable</li></ul>

Gunakan bahasa Indonesia yang hangat dan memotivasi.`;
            break;

        case 'finance':
            title = '🧠 Analisis Keuangan';
            data = getTransactions();
            const income = data.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const expense = data.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

            prompt = `Analisis data keuangan berikut:

Transactions: ${JSON.stringify(data)}
Total Income: ${income}
Total Expense: ${expense}
Balance: ${income - expense}

Berikan analisis dalam format HTML dengan struktur:
<h4>📊 Ringkasan Keuangan</h4>
<p>overview singkat</p>
<h4>📈 Pola Pengeluaran</h4>
<ul><li>kategori terbesar</li></ul>
<h4>💰 Tips Penghematan</h4>
<ul><li>tips praktis</li></ul>
<h4>🎯 Target Bulan Depan</h4>
<p>rekomendasi target</p>

Gunakan bahasa Indonesia dan format currency IDR.`;
            break;

        case 'habits':
            title = '🧠 Analisis Kebiasaan';
            data = getHabits();

            prompt = `Analisis data kebiasaan/habits berikut:

Habits: ${JSON.stringify(data)}

Berikan analisis dalam format HTML dengan struktur:
<h4>📊 Overview Habits</h4>
<p>ringkasan performa</p>
<h4>🔥 Streak Terbaik</h4>
<ul><li>habits dengan streak tinggi</li></ul>
<h4>⚠️ Perlu Perhatian</h4>
<ul><li>habits yang jarang dilakukan</li></ul>
<h4>💪 Tips Konsistensi</h4>
<ul><li>tips membangun kebiasaan</li></ul>

Gunakan bahasa Indonesia yang memotivasi.`;
            break;
    }

    showAnalysisModal(title);

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024
                }
            })
        });

        if (!response.ok) {
            throw new Error('Gagal mendapatkan analisis');
        }

        const result = await response.json();
        let text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada hasil';

        // Clean up response
        text = text.replace(/```html/gi, '').replace(/```/g, '');

        document.getElementById('analysis-loading').classList.add('hidden');
        document.getElementById('analysis-content').innerHTML = text;

    } catch (error) {
        console.error('Analysis error:', error);
        document.getElementById('analysis-loading').classList.add('hidden');
        document.getElementById('analysis-content').innerHTML = `
            <p style="color: var(--error);">❌ Gagal menganalisis: ${error.message}</p>
            <p>Coba lagi dalam beberapa saat.</p>
        `;
    }
}

// ===== MAIN INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize login UI first
    initLoginUI();

    // Check for existing session
    const session = getSession();

    if (session) {
        // User is logged in - show main app
        showMainApp();

        // Auto-restore Supabase session and sync from cloud
        // This ensures data consistency across devices on page reload
        if (isCloudSyncEnabled()) {
            updateSyncStatus('Syncing');
            try {
                const supabase = initSupabase();
                if (supabase) {
                    const { data: { session: cloudSession } } = await supabaseClient.auth.getSession();
                    if (cloudSession) {
                        console.log('☁️ Cloud session restored, syncing data...');
                        await syncFromCloudReplace();
                        console.log('✅ Auto-sync from cloud completed');
                        updateSyncStatus('Synced');
                    } else {
                        updateSyncStatus('Offline');
                    }
                } else {
                    updateSyncStatus('Offline');
                }
            } catch (err) {
                console.error('Auto-sync on load failed:', err);
                updateSyncStatus('Error');
            }
        } else {
            updateSyncStatus('Offline');
        }
    } else {
        // No session - show login screen
        showLoginScreen();
    }
});

// ===== DASHBOARD MODULE =====
function initDashboard() {
    updateDashboardStats();
    updateUpcomingSchedules();
    updateTodayReminders();
    initMoodChart();  // Mood chart visualization

    document.getElementById('get-daily-insight-btn').addEventListener('click', getDailyInsight);
}

function updateDashboardStats() {
    // Journals count
    const journals = getJournals();
    document.getElementById('stat-journals').textContent = journals.length;

    // Tasks completed
    const tasks = getTasks();
    const completedTasks = tasks.filter(t => t.done).length;
    document.getElementById('stat-tasks').textContent = `${completedTasks}/${tasks.length}`;

    // Balance
    const transactions = getTransactions();
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    document.getElementById('stat-balance').textContent = formatCurrency(income - expense);

    // Best streak
    const habits = getHabits();
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    document.getElementById('stat-streak').textContent = bestStreak;
}

function updateUpcomingSchedules() {
    const schedules = getSchedules();
    const now = new Date();
    const upcoming = schedules
        .filter(s => new Date(s.datetime) > now)
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
        .slice(0, 5);

    const container = document.getElementById('upcoming-schedules');

    if (upcoming.length === 0) {
        container.innerHTML = '<p class="text-muted">Tidak ada jadwal mendatang</p>';
        return;
    }

    container.innerHTML = upcoming.map(s => {
        const date = new Date(s.datetime);
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        return `
            <div class="reminder-item schedule">
                <span class="reminder-time">${timeStr}</span>
                <span class="reminder-text">${s.title} - ${dateStr}</span>
            </div>
        `;
    }).join('');
}

function updateTodayReminders() {
    const habits = getHabits();
    const today = getTodayString();

    const container = document.getElementById('today-reminders');
    if (!container) return;

    if (habits.length === 0) {
        container.innerHTML = '<p class="text-muted">Tidak ada habits ditambahkan</p>';
        return;
    }

    // Show undone habits for today (check both completions and completedDates for compatibility)
    const undoneHabits = habits.filter(h => {
        // Check completions object (new format)
        if (h.completions && h.completions[today]) return false;
        // Check completedDates array (old format)
        if (h.completedDates && h.completedDates.includes(today)) return false;
        return true;
    });

    if (undoneHabits.length === 0) {
        container.innerHTML = '<p class="text-muted">✅ Semua habits sudah selesai hari ini!</p>';
        return;
    }

    container.innerHTML = undoneHabits.map(h => `
        <div class="reminder-item">
            <span class="reminder-time">⏰</span>
            <span class="reminder-text">${h.name}</span>
        </div>
    `).join('');
}

async function getDailyInsight() {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('Atur API key dulu di Settings!');
        showSettings();
        return;
    }

    const insightBox = document.getElementById('quick-insight');
    insightBox.innerHTML = '<p class="text-muted">Menganalisis data Anda...</p>';

    const journals = getJournals();
    const tasks = getTasks();
    const habits = getHabits();
    const transactions = getTransactions();

    const prompt = `Berdasarkan data pengguna: ${journals.length} jurnal, ${tasks.filter(t => t.completed).length}/${tasks.length} task selesai, ${habits.length} habits.

Tulis TEPAT 2 kalimat motivasi singkat dalam bahasa Indonesia. Maksimal 50 kata total. Langsung tulis kalimatnya tanpa pembuka.`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
            })
        });

        if (!response.ok) throw new Error('Gagal mendapatkan insight');

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada insight';

        insightBox.innerHTML = `<p>${text}</p>`;
    } catch (error) {
        insightBox.innerHTML = '<p class="text-muted">Gagal mengambil insight. Coba lagi nanti.</p>';
    }
}

// ===== REMINDER MODULE =====
function getReminderSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDER_SETTINGS);
    return data ? JSON.parse(data) : {
        habitsEnabled: false,
        habitsTime: '08:00',
        scheduleEnabled: false
    };
}

function saveReminderSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(settings));
    triggerCloudSync();
}

function initReminder() {
    const settings = getReminderSettings();

    // Load saved settings
    document.getElementById('reminder-habits-toggle').checked = settings.habitsEnabled;
    document.getElementById('reminder-schedule-toggle').checked = settings.scheduleEnabled;
    document.getElementById('habits-reminder-time').value = settings.habitsTime || '08:00';

    // Toggle time setting visibility
    if (settings.habitsEnabled) {
        document.getElementById('habits-time-setting').classList.remove('hidden');
    }

    // Event listeners
    document.getElementById('reminder-habits-toggle').addEventListener('change', (e) => {
        const timeSetting = document.getElementById('habits-time-setting');
        if (e.target.checked) {
            timeSetting.classList.remove('hidden');
        } else {
            timeSetting.classList.add('hidden');
        }
    });

    document.getElementById('save-reminder-btn').addEventListener('click', saveReminderSettingsHandler);

    // Request notification permission and check reminders
    if (settings.habitsEnabled || settings.scheduleEnabled) {
        requestNotificationPermission();
        checkAndTriggerReminders();
    }
}

async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
}

function saveReminderSettingsHandler() {
    const settings = {
        habitsEnabled: document.getElementById('reminder-habits-toggle').checked,
        habitsTime: document.getElementById('habits-reminder-time').value,
        scheduleEnabled: document.getElementById('reminder-schedule-toggle').checked
    };

    saveReminderSettings(settings);

    if (settings.habitsEnabled || settings.scheduleEnabled) {
        requestNotificationPermission();
    }

    alert('✅ Pengaturan reminder tersimpan!');
}

function checkAndTriggerReminders() {
    const settings = getReminderSettings();

    // Check every minute
    setInterval(() => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);

        // Check habits reminder
        if (settings.habitsEnabled && currentTime === settings.habitsTime) {
            const habits = getHabits();
            const today = getTodayString();
            const undone = habits.filter(h => !h.completedDates?.includes(today));

            if (undone.length > 0) {
                showNotification('🔔 Reminder Habits', `Kamu punya ${undone.length} habits yang belum selesai hari ini!`);
            }
        }

        // Check schedule reminders (15 min before)
        if (settings.scheduleEnabled) {
            const schedules = getSchedules();
            const in15Min = new Date(now.getTime() + 15 * 60000);

            schedules.forEach(s => {
                const scheduleTime = new Date(s.datetime);
                if (Math.abs(scheduleTime - in15Min) < 60000) { // Within 1 minute window
                    showNotification('📅 Jadwal Mendatang', `${s.title} dalam 15 menit!`);
                }
            });
        }
    }, 60000); // Check every minute
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'icons/icon-512.png',
            badge: 'icons/icon-512.png'
        });
    }
}


// ===== APP INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Auth UI
    if (typeof initLoginUI === 'function') initLoginUI();

    // 2. Initialize Supabase Client
    if (typeof initSupabase === 'function') initSupabase();

    // 2.5. Auto-restore Supabase session if cloud sync is enabled
    if (supabaseClient && typeof isCloudSyncEnabled === 'function' && isCloudSyncEnabled()) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                console.log('✅ Cloud session restored automatically');
            }
        } catch (e) {
            console.warn('Could not restore cloud session:', e);
        }
    }

    // 3. Check Local Session
    if (typeof getSession === 'function') {
        const session = getSession();

        if (session) {
            // User is logged in
            if (typeof showMainApp === 'function') showMainApp();

            // 4. Trigger Background Cloud Sync
            if (typeof isCloudSyncEnabled === 'function' && isCloudSyncEnabled()) {
                console.log('🔄 Auto-syncing from cloud on startup...');
                // Non-blocking sync
                if (typeof syncFromCloud === 'function') {
                    syncFromCloud().then(success => {
                        if (success) {
                            console.log('✅ Startup sync complete');
                            // Refresh Dashboard to reflect new data
                            if (typeof initDashboard === 'function') initDashboard();
                        }
                    });
                }
            }
        } else {
            // User is guest
            if (typeof showLoginScreen === 'function') showLoginScreen();
        }
    }
});
// ===== TAGGING SYSTEM =====
let currentTags = [];
let activeTagFilter = 'all';
let activeMoodFilter = 'all';

function initTagInput() {
    const tagInput = document.getElementById('tag-input');
    const tagList = document.getElementById('journal-tags');

    if (!tagInput || !tagList) return;

    // Handle input
    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.value.trim().replace(/,/g, '');
            if (tag && !currentTags.includes(tag)) {
                currentTags.push(tag);
                renderTags();
                tagInput.value = '';
            }
        }
    });

    // Handle tag deletion
    tagList.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-delete')) {
            const tag = e.target.dataset.tag;
            currentTags = currentTags.filter(t => t !== tag);
            renderTags();
        }
    });

    // Initialize filters
    const tagFilter = document.getElementById('tag-filter');
    const moodFilter = document.getElementById('mood-filter');

    if (tagFilter) {
        tagFilter.addEventListener('change', (e) => {
            activeTagFilter = e.target.value;
            renderActiveFilters();
            renderJournalHistory(); // Re-render with filter
        });
    }

    if (moodFilter) {
        moodFilter.addEventListener('change', (e) => {
            activeMoodFilter = e.target.value;
            renderActiveFilters();
            renderJournalHistory(); // Re-render with filter
        });
    }

    updateTagFilterOptions();
}

function renderTags() {
    const tagList = document.getElementById('journal-tags');
    if (!tagList) return;

    tagList.innerHTML = currentTags.map(tag => `
        <span class="tag-pill">
            #${tag}
            <span class="tag-delete" data-tag="${tag}">×</span>
        </span>
    `).join('');
}

function updateTagFilterOptions() {
    const tagFilter = document.getElementById('tag-filter');
    if (!tagFilter) return;

    // Get all unique tags from journals
    const journals = getJournals();
    const allTags = new Set();
    journals.forEach(j => {
        if (j.tags && Array.isArray(j.tags)) {
            j.tags.forEach(t => allTags.add(t));
        }
    });

    // Preserve current selection if exists
    const currentSelection = tagFilter.value;

    // Rebuild options
    tagFilter.innerHTML = '<option value="all">Semua Tags</option>' +
        Array.from(allTags).sort().map(tag =>
            `<option value="${tag}">${tag}</option>`
        ).join('');

    tagFilter.value = currentSelection;
}

function renderActiveFilters() {
    const container = document.getElementById('active-filters');
    if (!container) return;

    let html = '';

    if (activeMoodFilter !== 'all') {
        const moodLabels = {
            'great': '😄 Sangat Baik',
            'good': '🙂 Baik',
            'neutral': '😐 Biasa',
            'bad': '😔 Kurang Baik',
            'terrible': '😢 Buruk'
        };
        html += `
            <span class="filter-badge">
                ${moodLabels[activeMoodFilter] || activeMoodFilter}
                <span class="filter-badge-remove" onclick="clearFilter('mood')">×</span>
            </span>
        `;
    }

    if (activeTagFilter !== 'all') {
        html += `
            <span class="filter-badge">
                #${activeTagFilter}
                <span class="filter-badge-remove" onclick="clearFilter('tag')">×</span>
            </span>
        `;
    }

    container.innerHTML = html;
}

function clearFilter(type) {
    if (type === 'mood') {
        activeMoodFilter = 'all';
        document.getElementById('mood-filter').value = 'all';
    } else if (type === 'tag') {
        activeTagFilter = 'all';
        document.getElementById('tag-filter').value = 'all';
    }
    renderActiveFilters();
    renderJournalHistory();
}

// Auto-init backup feature
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure DOM elements are ready if constructed by JS
    setTimeout(() => {
        if (typeof initBackupRestore === 'function') {
            initBackupRestore();
        }
        if (typeof initTheme === 'function') {
            initTheme();
        }
        if (typeof initVoiceInput === 'function') {
            initVoiceInput();
        }
        if (typeof initSecurity === 'function') {
            initSecurity();
        }
    }, 1000);
});

// ===== BACKUP & RESTORE =====
function initBackupRestore() {
    const exportBtn = document.getElementById('export-data-btn');
    const importBtn = document.getElementById('import-data-btn');
    const fileInput = document.getElementById('import-file-input');

    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }

    if (importBtn) {
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importData(e.target.files[0]);
            }
        });
    }
}

function exportData() {
    const data = {
        journals: getJournals(),
        goals: getGoals(),
        tasks: getTasks(),
        schedules: getSchedules(),
        habits: getHabits(),
        wallets: getWallets(),
        transactions: getTransactions(),
        settings: getSettings(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `jurnal-ai-backup-${formatShortDate(new Date()).replace(/ /g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            // Validate basic structure
            if (!data.exportedAt) {
                throw new Error('Format file backup tidak valid');
            }

            if (confirm(`Restore data dari backup tanggal ${formatShortDate(data.exportedAt)}? Data saat ini akan ditimpa.`)) {
                // Restore logic
                if (data.journals) localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(data.journals));
                if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
                if (data.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
                if (data.schedules) localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(data.schedules));
                if (data.habits) localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data.habits));
                if (data.wallets) localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(data.wallets));
                if (data.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
                if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));

                alert('Data berhasil direstore! Halaman akan direfresh.');
                window.location.reload();
            }
        } catch (error) {
            alert('Gagal membaca file backup: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ===== WALLET UI LOGIC =====
function initWalletUI() {
    const manageBtn = document.getElementById('manage-wallets-btn');
    const modal = document.getElementById('wallet-modal');
    const closeBtn = document.getElementById('close-wallet-modal');
    const addBtn = document.getElementById('add-wallet-btn');

    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('hidden');
                renderWalletManagementList();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', handleAddWallet);
    }

    renderWalletListSummary();
    updateWalletSelectOptions();
}

function handleAddWallet() {
    const nameInput = document.getElementById('new-wallet-name');
    const balanceInput = document.getElementById('new-wallet-balance');
    const name = nameInput.value.trim();
    const balance = parseFloat(balanceInput.value) || 0;

    if (!name) {
        alert('Nama dompet harus diisi!');
        return;
    }

    const wallet = {
        id: generateId(),
        name: name,
        balance: balance,
        createdAt: new Date().toISOString()
    };

    saveWallet(wallet);

    nameInput.value = '';
    balanceInput.value = '0';

    renderWalletManagementList();
    renderWalletListSummary();
    updateWalletSelectOptions();
}

function renderWalletManagementList() {
    const listEl = document.getElementById('wallet-management-list');
    if (!listEl) return;

    const wallets = getWallets();

    listEl.innerHTML = wallets.map(w => `
        <div class="habit-item" style="justify-content: space-between;">
            <span class="habit-name">${w.name} (${formatCurrency(w.balance || 0)})</span>
            ${!w.isDefault ? `<button class="delete-btn" onclick="deleteWalletUI('${w.id}')">🗑️</button>` : '<span class="badge" style="background:var(--primary); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Utama</span>'}
        </div>
    `).join('');
}

window.deleteWalletUI = function (id) {
    if (confirm('Hapus dompet ini? Transaksi terkait tidak akan dihapus (akan error tampilannya).')) {
        deleteWallet(id);
        renderWalletManagementList();
        renderWalletListSummary();
        updateWalletSelectOptions();
    }
};

function renderWalletListSummary() {
    const container = document.getElementById('wallet-list-summary');
    if (!container) return;

    const wallets = getWallets();

    container.innerHTML = wallets.map(w => `
        <div class="wallet-chip" style="display: inline-block; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; margin-right: 8px; margin-bottom: 8px;">
            <span class="wallet-name" style="font-weight: bold; color: #fff;">${w.name}</span>
            <span class="wallet-balance" style="display: block; font-size: 0.9rem; color: #aaa;">${formatCurrency(w.balance || 0)}</span>
        </div>
    `).join('');
}

function updateWalletSelectOptions() {
    const select = document.getElementById('transaction-wallet');
    if (!select) return;

    const wallets = getWallets();
    select.innerHTML = wallets.map(w => `
        <option value="${w.id}">${w.name} (${formatCurrency(w.balance || 0)})</option>
    `).join('');
}

// ===== BUDGET UI LOGIC =====
function initBudgetUI() {
    const manageBtn = document.getElementById('manage-budget-btn');
    const modal = document.getElementById('budget-modal');
    const closeBtn = document.getElementById('close-budget-modal');
    const addBtn = document.getElementById('add-budget-btn');

    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('hidden');
                updateBudgetCategoryOptions();
                renderBudgetManagementList();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', handleAddBudget);
    }

    renderBudgetListSummary();
}

function updateBudgetCategoryOptions() {
    const select = document.getElementById('new-budget-category');
    if (!select) return;

    const categories = [
        "Makanan", "Transport", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Lainnya"
    ];

    select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

function handleAddBudget() {
    const categorySelect = document.getElementById('new-budget-category');
    const limitInput = document.getElementById('new-budget-limit');

    const category = categorySelect.value;
    const limit = parseFloat(limitInput.value);

    if (!limit || limit <= 0) {
        alert('Masukkan nominal budget yang valid!');
        return;
    }

    const budget = {
        id: generateId(),
        category: category,
        limit: limit,
        createdAt: new Date().toISOString()
    };

    saveBudget(budget);

    limitInput.value = '';

    renderBudgetManagementList();
    renderBudgetListSummary();
}

function renderBudgetManagementList() {
    const listEl = document.getElementById('budget-management-list');
    if (!listEl) return;

    const budgets = getBudgets();

    listEl.innerHTML = budgets.map(b => `
        <div class="budget-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 8px;">
            <div>
                <strong style="color: var(--text-primary); display: block;">${b.category}</strong>
                <span style="color: var(--text-muted); font-size: 0.9rem;">Limit: ${formatCurrency(b.limit)}</span>
            </div>
            <button class="delete-btn" onclick="deleteBudgetUI('${b.id}')">🗑️</button>
        </div>
    `).join('');
}

window.deleteBudgetUI = function (id) {
    if (confirm('Hapus budget ini?')) {
        deleteBudget(id);
        renderBudgetManagementList();
        renderBudgetListSummary();
    }
};

function renderBudgetListSummary() {
    const container = document.getElementById('budget-list-summary');
    if (!container) return;

    const budgets = getBudgets();

    if (budgets.length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align: center; font-size: 0.9rem;">Belum ada budget yang diatur</p>';
        return;
    }

    container.innerHTML = budgets.map(b => {
        const spent = getCategoryExpenses(b.category);
        const percentage = Math.min((spent / b.limit) * 100, 100);

        let colorClass = 'bg-success';
        if (percentage >= 100) colorClass = 'bg-danger';
        else if (percentage >= 80) colorClass = 'bg-warning';

        return `
        <div class="budget-item" style="margin-bottom: 12px;">
            <div class="budget-header">
                <span>${b.category}</span>
                <span class="budget-amount">${formatCurrency(spent)} / ${formatCurrency(b.limit)}</span>
            </div>
            <div class="budget-progress-container">
                <div class="budget-progress-bar ${colorClass}" style="width: ${percentage}%"></div>
            </div>
        </div>
        `;
    }).join('');
}

// ===== VOICE INPUT MODULE =====
let recognition;
let isRecording = false;

function initVoiceInput() {
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Voice input not supported in this browser.');
        const micBtn = document.getElementById('mic-btn');
        if (micBtn) micBtn.style.display = 'none';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep recording even after pauses
    recognition.interimResults = true; // Show results while speaking
    recognition.lang = 'id-ID'; // Set language to Indonesian

    recognition.onstart = function () {
        isRecording = true;
        updateMicUI(true);
    };

    recognition.onend = function () {
        isRecording = false;
        updateMicUI(false);
    };

    recognition.onresult = function (event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        const journalInput = document.getElementById('journal-input');
        if (journalInput && (finalTranscript || interimTranscript)) {
            // If it's a new result, append it. 
            // Note: This simple logic might duplicate text in some edge cases with interim results.
            // A better approach for production is to track the last finalized index.
            // For simplicity here, we'll just append final results.

            if (finalTranscript) {
                const currentText = journalInput.value;
                const separator = currentText.length > 0 && !currentText.endsWith(' ') ? ' ' : '';
                journalInput.value = currentText + separator + finalTranscript;

                // Trigger input event to update char count if any
                journalInput.dispatchEvent(new Event('input'));
            }
        }
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error', event.error);
        stopRecording();
        if (event.error === 'not-allowed') {
            alert('Akses mikrofon ditolak. Izinkan akses untuk menggunakan fitur ini.');
        }
    };

    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
        micBtn.addEventListener('click', toggleRecording);
    }
}

function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    try {
        recognition.start();
    } catch (e) {
        console.error('Failed to start recording:', e);
    }
}

function stopRecording() {
    try {
        recognition.stop();
    } catch (e) {
        console.error('Failed to stop recording:', e);
    }
}

function updateMicUI(recording) {
    const micBtn = document.getElementById('mic-btn');
    const statusText = document.getElementById('recording-status');

    if (micBtn) {
        if (recording) {
            micBtn.classList.add('mic-active');
            micBtn.innerHTML = '⏹️'; // Stop icon
            micBtn.title = 'Stop Rekam';
        } else {
            micBtn.classList.remove('mic-active');
            micBtn.innerHTML = '🎤'; // Mic icon
            micBtn.title = 'Rekam Suara';
        }
    }

    if (statusText) {
        if (recording) {
            statusText.classList.remove('hidden');
        } else {
            statusText.classList.add('hidden');
        }
    }
}

// ===== SECURITY MODULE (PIN LOCK) =====
let currentPinInput = '';
let isSettingUpPin = false; // 'set', 'confirm', 'change_old'
let tempNewPin = '';

function initSecurity() {
    // Check if PIN is set
    const savedPin = localStorage.getItem(STORAGE_KEYS.PIN);

    // UI References
    const lockScreen = document.getElementById('app-lock-screen');
    const keypad = document.querySelector('.pin-keypad');

    // Initial Lock
    if (savedPin) {
        if (lockScreen) lockScreen.classList.remove('hidden');
    }

    // Keypad Event Listeners
    if (keypad) {
        keypad.addEventListener('click', (e) => {
            if (e.target.classList.contains('pin-btn')) {
                const value = e.target.dataset.value;
                handlePinInput(value);
            }
        });
    }

    // Settings UI
    const pinToggle = document.getElementById('pin-lock-toggle');
    const changePinBtn = document.getElementById('change-pin-btn');
    const pinSetupSection = document.getElementById('pin-setup-section');

    if (pinToggle) {
        // Init toggle state
        pinToggle.checked = !!savedPin;
        if (savedPin && pinSetupSection) pinSetupSection.classList.remove('hidden');

        pinToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                // Turn ON: Start setup flow
                if (!localStorage.getItem(STORAGE_KEYS.PIN)) {
                    startPinSetup();
                }
            } else {
                // Turn OFF: Confirm with PIN
                if (localStorage.getItem(STORAGE_KEYS.PIN)) {
                    e.target.checked = true; // Revert first, wait for auth
                    if (confirm('Matikan PIN Lock?')) {
                        // Ideally ask for PIN here too, but for simplicity:
                        localStorage.removeItem(STORAGE_KEYS.PIN);
                        e.target.checked = false;
                        if (pinSetupSection) pinSetupSection.classList.add('hidden');
                        alert('PIN Lock dimatikan.');
                    }
                }
            }
        });
    }

    if (changePinBtn) {
        changePinBtn.addEventListener('click', () => {
            startPinSetup(true);
        });
    }
}

function handlePinInput(value) {
    if (value === 'clear') {
        currentPinInput = '';
    } else if (value === 'back') {
        currentPinInput = currentPinInput.slice(0, -1);
    } else {
        if (currentPinInput.length < 4) {
            currentPinInput += value;
        }
    }

    updatePinDisplay();

    if (currentPinInput.length === 4) {
        // Small delay for visual feedback
        setTimeout(() => {
            if (isSettingUpPin) {
                processPinSetupStep();
            } else {
                validatePin();
            }
        }, 100);
    }
}

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < currentPinInput.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
        dot.classList.remove('error');
    });
}

function validatePin() {
    const savedPin = localStorage.getItem(STORAGE_KEYS.PIN);
    if (currentPinInput === savedPin) {
        // Unlock
        const lockScreen = document.getElementById('app-lock-screen');
        if (lockScreen) {
            lockScreen.classList.add('hidden');
            // reset logic
            currentPinInput = '';
            updatePinDisplay();
        }
    } else {
        // Error
        showPinError();
    }
}

function showPinError() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach(dot => dot.classList.add('error'));

    // Shake animation
    const pinDisplay = document.querySelector('.pin-display');

    setTimeout(() => {
        currentPinInput = '';
        updatePinDisplay();
    }, 500);
}

function startPinSetup(isChange = false) {
    isSettingUpPin = isChange ? 'change_old' : 'set';
    currentPinInput = '';
    tempNewPin = '';

    // Show lock screen with different title
    const lockScreen = document.getElementById('app-lock-screen');
    const lockTitle = document.getElementById('lock-title');

    if (lockScreen && lockTitle) {
        lockScreen.classList.remove('hidden');
        lockTitle.textContent = isChange ? 'Masukkan PIN Lama' : 'Buat PIN Baru (4 angka)';
        // Add a "Cancel" button for setup mode if needed, 
        // but for now relying on reload if stuck or clean flow.
    }
}

function processPinSetupStep() {
    const lockTitle = document.getElementById('lock-title');
    const lockScreen = document.getElementById('app-lock-screen');
    const pinSetupSection = document.getElementById('pin-setup-section');
    const pinToggle = document.getElementById('pin-lock-toggle');

    if (isSettingUpPin === 'change_old') {
        // Verifying old PIN
        const savedPin = localStorage.getItem(STORAGE_KEYS.PIN);
        if (currentPinInput === savedPin) {
            isSettingUpPin = 'set';
            currentPinInput = '';
            updatePinDisplay();
            lockTitle.textContent = 'Masukkan PIN Baru';
        } else {
            showPinError();
        }
    } else if (isSettingUpPin === 'set') {
        // First entry of new PIN
        tempNewPin = currentPinInput;
        isSettingUpPin = 'confirm';
        currentPinInput = '';
        updatePinDisplay();
        lockTitle.textContent = 'Konfirmasi PIN Baru';
    } else if (isSettingUpPin === 'confirm') {
        // Confirmation of new PIN
        if (currentPinInput === tempNewPin) {
            // Success
            localStorage.setItem(STORAGE_KEYS.PIN, currentPinInput);
            alert('PIN berhasil disimpan!');

            // Clean up
            isSettingUpPin = false;
            currentPinInput = '';
            tempNewPin = '';
            updatePinDisplay();
            lockScreen.classList.add('hidden');
            lockTitle.textContent = 'Masukkan PIN'; // Reset title for normal lock

            // Update Settings UI
            if (pinSetupSection) pinSetupSection.classList.remove('hidden');
            if (pinToggle) pinToggle.checked = true;

        } else {
            alert('PIN tidak cocok. Ulangi.');
            isSettingUpPin = 'set';
            currentPinInput = '';
            tempNewPin = '';
            updatePinDisplay();
            lockTitle.textContent = 'Buat PIN Baru (4 angka)';
        }
    }
}
