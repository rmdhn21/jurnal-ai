// Storage module - handles localStorage operations for journals, tasks, and schedules

const STORAGE_KEYS = {
    JOURNALS: 'jurnal_ai_journals',
    TASKS: 'jurnal_ai_tasks',
    SCHEDULES: 'jurnal_ai_schedules',
    API_KEY: 'jurnal_ai_gemini_key'
};

// ===== Journal Operations =====
export function getJournals() {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    return data ? JSON.parse(data) : [];
}

export function saveJournal(journal) {
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

export function getJournal(id) {
    const journals = getJournals();
    return journals.find(j => j.id === id);
}

export function deleteJournal(id) {
    const journals = getJournals().filter(j => j.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
}

// ===== Task Operations =====
export function getTasks() {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
}

export function saveTask(task) {
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

export function deleteTask(id) {
    const tasks = getTasks().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function toggleTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
    return task;
}

// ===== Schedule Operations =====
export function getSchedules() {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    return data ? JSON.parse(data) : [];
}

export function saveSchedule(schedule) {
    const schedules = getSchedules();
    const existing = schedules.findIndex(s => s.id === schedule.id);
    
    if (existing >= 0) {
        schedules[existing] = schedule;
    } else {
        schedules.push(schedule);
    }
    
    // Sort by datetime
    schedules.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    return schedule;
}

export function deleteSchedule(id) {
    const schedules = getSchedules().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
}

// ===== API Key Operations =====
export function getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function saveApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}

// ===== Utility =====
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

export function formatShortDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}
