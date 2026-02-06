// ===== STORAGE MODULE =====
const STORAGE_KEYS = {
    JOURNALS: 'jurnal_ai_journals',
    TASKS: 'jurnal_ai_tasks',
    SCHEDULES: 'jurnal_ai_schedules',
    TRANSACTIONS: 'jurnal_ai_transactions',
    HABITS: 'jurnal_ai_habits',
    API_KEY: 'jurnal_ai_gemini_key',
    USERS: 'jurnal_ai_users',
    SESSION: 'jurnal_ai_session',
    REMINDER_SETTINGS: 'jurnal_ai_reminder_settings',
    CLOUD_SYNC: 'jurnal_ai_cloud_sync'
};

// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://oybywsjhgkilpceisxzn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ynl3c2poZ2tpbHBjZWlzeHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTQ0MDIsImV4cCI6MjA4NTk3MDQwMn0.sSNrv1LPn-WRrnrnwus0aJDEmulR6qoWMHc4KeQL_4w';

let supabaseClient = null;

function initSupabase() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase initialized');
        return true;
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

    const session = await supabaseClient.auth.getSession();
    if (!session.data.session) return;

    const userId = session.data.session.user.id;

    const data = {
        journals: getJournals(),
        tasks: getTasks(),
        schedules: getSchedules(),
        transactions: getTransactions(),
        habits: getHabits(),
        reminderSettings: getReminderSettings(),
        updatedAt: new Date().toISOString()
    };

    try {
        const { error } = await supabaseClient
            .from('user_data')
            .upsert({ user_id: userId, data: data }, { onConflict: 'user_id' });

        if (error) console.error('Sync error:', error);
        else console.log('Synced to cloud');
    } catch (err) {
        console.error('Sync failed:', err);
    }
}

async function syncFromCloud() {
    if (!supabaseClient || !isCloudSyncEnabled()) return false;

    const session = await supabaseClient.auth.getSession();
    if (!session.data.session) return false;

    const userId = session.data.session.user.id;

    try {
        const { data, error } = await supabaseClient
            .from('user_data')
            .select('data')
            .eq('user_id', userId)
            .single();

        if (error || !data) return false;

        const cloudData = data.data;

        // Merge cloud data to local
        if (cloudData.journals) localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(cloudData.journals));
        if (cloudData.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(cloudData.tasks));
        if (cloudData.schedules) localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(cloudData.schedules));
        if (cloudData.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(cloudData.transactions));
        if (cloudData.habits) localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(cloudData.habits));
        if (cloudData.reminderSettings) localStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(cloudData.reminderSettings));

        console.log('Synced from cloud');
        return true;
    } catch (err) {
        console.error('Sync from cloud failed:', err);
        return false;
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
    return journal;
}

function deleteJournal(id) {
    const journals = getJournals().filter(j => j.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
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
    return task;
}

function deleteTask(id) {
    const tasks = getTasks().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

function toggleTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
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
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    return schedule;
}

function deleteSchedule(id) {
    const schedules = getSchedules().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
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
    return transaction;
}

function deleteTransaction(id) {
    const transactions = getTransactions().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
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
    return habit;
}

function deleteHabit(id) {
    const habits = getHabits().filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

function toggleHabitCompletion(habitId, date) {
    const habits = getHabits();
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
        if (!habit.completions) habit.completions = {};
        habit.completions[date] = !habit.completions[date];
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    }
    return habit;
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


// ===== CHARTS MODULE =====
let financeChart = null;
let habitsChart = null;

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

    // Ask AI button
    askAIBtn.addEventListener('click', handleAskAI);

    // Close response
    closeResponseBtn.addEventListener('click', () => {
        document.getElementById('ai-response-section').classList.add('hidden');
    });

    // Save journal
    saveJournalBtn.addEventListener('click', handleSaveJournal);

    // Load history
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

        // Create journal entry
        currentJournal = {
            id: generateId(),
            text: text,
            createdAt: new Date().toISOString(),
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

    saveJournal(currentJournal);

    // Clear input
    document.getElementById('journal-input').value = '';
    document.getElementById('char-count').textContent = '0 karakter';
    document.getElementById('ai-response-section').classList.add('hidden');

    // Reset current journal
    currentJournal = null;
    currentAIResponse = null;

    // Refresh history
    renderJournalHistory();

    alert('Jurnal berhasil disimpan!');
}

function renderJournalHistory() {
    const historyEl = document.getElementById('journal-history');
    const journals = getJournals();

    if (journals.length === 0) {
        historyEl.innerHTML = `
            <div class="empty-state">
                <p>Belum ada jurnal tersimpan</p>
            </div>
        `;
        return;
    }

    historyEl.innerHTML = journals.slice(0, 5).map(journal => `
        <div class="history-item" data-id="${journal.id}">
            <div class="history-date">${formatShortDate(journal.createdAt)}</div>
            <div class="history-preview">${journal.text.substring(0, 100)}${journal.text.length > 100 ? '...' : ''}</div>
            <button class="delete-btn" data-id="${journal.id}" title="Hapus">🗑️</button>
        </div>
    `).join('');

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
}

function handleAddTransaction() {
    const type = document.getElementById('transaction-type').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const category = document.getElementById('transaction-category').value.trim();
    const date = document.getElementById('transaction-date').value;
    const desc = document.getElementById('transaction-desc').value.trim();

    if (!amount || amount <= 0) {
        alert('Masukkan jumlah yang valid!');
        return;
    }

    if (!category) {
        alert('Masukkan kategori!');
        return;
    }

    const transaction = {
        id: generateId(),
        type: type,
        amount: amount,
        category: category,
        description: desc,
        date: date || getTodayString(),
        createdAt: new Date().toISOString()
    };

    saveTransaction(transaction);

    // Clear form
    document.getElementById('transaction-amount').value = '';
    document.getElementById('transaction-category').value = '';
    document.getElementById('transaction-desc').value = '';

    renderTransactionList();
    updateFinanceSummary();
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
            if (targetScreen === 'planner') {
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

function clearAllData() {
    if (!confirm('⚠️ PERINGATAN: Semua data akan dihapus permanen!\n\nAnda yakin?')) return;
    if (!confirm('Ini adalah konfirmasi terakhir. Lanjutkan hapus semua data?')) return;

    // Clear all storage
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    localStorage.removeItem(ENCRYPTION_KEY_STORAGE);

    alert('Semua data telah dihapus.');
    location.reload();
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
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Toggle forms
    showRegisterBtn.addEventListener('click', () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    });

    showLoginBtn.addEventListener('click', () => {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    // Login
    loginBtn.addEventListener('click', handleLogin);
    document.getElementById('login-password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Register
    registerBtn.addEventListener('click', handleRegister);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Cloud Login - with null checks
    const cloudLoginBtn = document.getElementById('cloud-login-btn');
    const backToLocalBtn = document.getElementById('back-to-local-btn');
    const cloudSigninBtn = document.getElementById('cloud-signin-btn');
    const cloudSignupBtn = document.getElementById('cloud-signup-btn');

    if (cloudLoginBtn) {
        cloudLoginBtn.addEventListener('click', () => {
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('cloud-login-form').classList.remove('hidden');
        });
    }

    if (backToLocalBtn) {
        backToLocalBtn.addEventListener('click', () => {
            document.getElementById('cloud-login-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        });
    }

    if (cloudSigninBtn) {
        cloudSigninBtn.addEventListener('click', handleCloudSignIn);
    }

    if (cloudSignupBtn) {
        cloudSignupBtn.addEventListener('click', handleCloudSignUp);
    }
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

        // Enable cloud sync and sync data
        enableCloudSync();
        await syncFromCloud();

        // Create local session with email
        saveSession(email);

        alert('✅ Cloud login berhasil!');
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
    initFinanceUI();
    initHabitsUI();
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
document.addEventListener('DOMContentLoaded', () => {
    // Initialize login UI first
    initLoginUI();

    // Check for existing session
    const session = getSession();

    if (session) {
        // User is logged in - show main app
        showMainApp();
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

    document.getElementById('get-daily-insight-btn').addEventListener('click', getDailyInsight);
}

function updateDashboardStats() {
    // Journals count
    const journals = getJournals();
    document.getElementById('stat-journals').textContent = journals.length;

    // Tasks completed
    const tasks = getTasks();
    const completedTasks = tasks.filter(t => t.completed).length;
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
    const settings = getReminderSettings();

    const container = document.getElementById('today-reminders');

    if (!settings.habitsEnabled || habits.length === 0) {
        container.innerHTML = '<p class="text-muted">Tidak ada reminder hari ini</p>';
        return;
    }

    // Show undone habits for today
    const undoneHabits = habits.filter(h => {
        const doneToday = h.completedDates && h.completedDates.includes(today);
        return !doneToday;
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

    const prompt = `Berikan insight singkat dalam 2-3 kalimat motivasi berdasarkan data berikut:
- ${journals.length} jurnal ditulis
- ${tasks.filter(t => t.completed).length}/${tasks.length} task selesai
- ${habits.length} habits dilacak
- Saldo: ${transactions.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0)}

Berikan dalam format singkat, motivatif, bahasa Indonesia. Jangan gunakan format list.`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.8, maxOutputTokens: 256 }
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
