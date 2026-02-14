// ===== PLANNER UI =====
function initPlannerUI() {
    const addTodoBtn = document.getElementById('add-todo-btn');
    const addScheduleBtn = document.getElementById('add-schedule-btn');

    addTodoBtn.addEventListener('click', handleAddTodo);
    document.getElementById('new-todo-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTodo();
    });

    addScheduleBtn.addEventListener('click', handleAddSchedule);

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
    const priority = document.getElementById('new-schedule-priority').value;

    if (!title || !datetime) {
        alert('Isi nama kegiatan dan waktu!');
        return;
    }

    const schedule = {
        id: generateId(),
        title: title,
        datetime: datetime,
        priority: priority,
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const schedule = {
        id: generateId(),
        title: text,
        datetime: tomorrow.toISOString().slice(0, 16),
        createdAt: new Date().toISOString(),
        createdFrom: 'ai_suggestion'
    };

    saveSchedule(schedule);
    renderScheduleList();
}

function renderTodoList() {
    const todoList = document.getElementById('todo-list');
    const tasks = getTasks();

    if (tasks.length === 0) {
        todoList.innerHTML = '<p class="text-muted">Belum ada to-do</p>';
        return;
    }

    todoList.innerHTML = tasks.map(task => `
        <div class="todo-item ${task.done ? 'completed' : ''}" data-id="${task.id}">
            <div class="todo-checkbox ${task.done ? 'checked' : ''}" data-id="${task.id}">
                ${task.done ? '✓' : ''}
            </div>
            <span class="todo-text">${task.title}</span>
            ${task.createdFrom === 'ai_suggestion' ? '<span class="badge badge-ai">AI</span>' : ''}
            <button class="delete-btn" data-id="${task.id}" title="Hapus">🗑️</button>
        </div>
    `).join('');

    todoList.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            toggleTask(checkbox.dataset.id);
            renderTodoList();
        });
    });

    todoList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Hapus task ini?')) {
                deleteTask(btn.dataset.id);
                renderTodoList();
            }
        });
    });
}

function renderScheduleList() {
    const listEl = document.getElementById('schedule-list');
    let schedules = getSchedules();

    // --- INTEGRATE PRAYER TIMES ---
    const todayStr = new Date().toISOString().split('T')[0];
    const cachedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAYER_DATA) || '{}');

    if (cachedData.key && cachedData.key.includes(todayStr) && cachedData.timings) {
        const timings = cachedData.timings;
        const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const prayerMap = { 'Fajr': 'Subuh', 'Dhuhr': 'Dzuhur', 'Asr': 'Ashar', 'Maghrib': 'Maghrib', 'Isha': 'Isya' };

        prayerNames.forEach(key => {
            if (timings[key]) {
                schedules.push({
                    id: `prayer-${key}`,
                    title: `🕌 ${prayerMap[key]}`,
                    datetime: `${todayStr}T${timings[key]}`,
                    isPrayer: true
                });
            }
        });
    }
    // -----------------------------

    // Sort by time
    schedules.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    if (schedules.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><p>Belum ada jadwal</p></div>`;
        return;
    }

    listEl.innerHTML = schedules.map(schedule => {
        const isPrayer = schedule.isPrayer;
        let extraClass = '';

        if (isPrayer) {
            extraClass = 'schedule-prayer';
        } else {
            const isPast = new Date(schedule.datetime) < new Date();
            if (isPast) extraClass = 'past';
        }

        const deleteBtn = isPrayer ? '' : `<button class="delete-btn" data-id="${schedule.id}" title="Hapus">🗑️</button>`;
        const timeStr = schedule.datetime.includes('T') ? schedule.datetime.split('T')[1].substring(0, 5) : formatShortDate(schedule.datetime);

        return `
        <div class="schedule-item ${extraClass}" data-id="${schedule.id}">
            <div class="schedule-info">
                <span class="schedule-time">${timeStr}</span>
                <span class="schedule-title ${isPrayer ? 'prayer-title' : ''}">${schedule.title}</span>
                ${!isPrayer && schedule.priority ? `<span class="badge badge-priority-${schedule.priority}">${getPriorityLabel(schedule.priority)}</span>` : ''}
                ${!isPrayer && schedule.createdFrom === 'ai_suggestion' ? '<span class="badge badge-ai">AI</span>' : ''}
            </div>
            ${deleteBtn}
        </div>
    `}).join('');

    // Add event listeners (only for non-prayer items)
    listEl.querySelectorAll('.schedule-item').forEach(item => {
        const deleteBtn = item.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Hapus jadwal ini?')) {
                    deleteSchedule(item.dataset.id);
                    renderScheduleList();
                }
            });
        }
    });
}

