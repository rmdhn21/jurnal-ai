// ===== PLANNER UI =====
function initPlannerUI() {
    const addTodoBtn = document.getElementById('add-todo-btn');
    const addScheduleBtn = document.getElementById('add-schedule-btn');

    addTodoBtn.addEventListener('click', handleAddTodo);
    document.getElementById('new-todo-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTodo();
    });

    addScheduleBtn.addEventListener('click', handleAddSchedule);

    renderKanbanBoard();
    initKanbanDragDrop();
    renderScheduleList();
    renderCalendar(); // Initialize Calendar
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
    renderKanbanBoard();
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
    renderKanbanBoard();
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


function renderKanbanBoard() {
    const container = document.getElementById('kanban-board');
    if (!container) return;

    const tasks = getTasks();
    const columns = {
        todo: [],
        doing: [],
        done: []
    };

    // Migration & Sorting
    tasks.forEach(task => {
        if (!task.status) {
            task.status = task.done ? 'done' : 'todo';
            saveTask(task); // Persist migration
        }
        if (columns[task.status]) {
            columns[task.status].push(task);
        } else {
            // Fallback for unknown status
            columns.todo.push(task);
        }
    });

    // Render Columns
    ['todo', 'doing', 'done'].forEach(status => {
        const colList = document.getElementById(`kanban-col-${status}`);
        if (!colList) return;

        colList.innerHTML = columns[status].map(task => createKanbanCard(task)).join('');
    });

    // Re-attach Event Listeners
    document.querySelectorAll('.kanban-card').forEach(card => {
        // Drag Events
        card.addEventListener('dragstart', handleDragStart);

        // Touch Events (Mobile Support via Click/Menu)
        const moveBtn = card.querySelector('.move-btn');
        if (moveBtn) {
            moveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showMoveMenu(moveBtn, card.dataset.id, card.dataset.status);
            });
        }

        // Edit & Delete
        card.querySelector('.edit-btn').addEventListener('click', () => {
            if (typeof showEditModal === 'function') showEditModal('todo', card.dataset.id);
        });

        card.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Hapus task ini?')) {
                deleteTask(card.dataset.id);
                renderKanbanBoard();
            }
        });
    });
}

function createKanbanCard(task) {
    const isAi = task.createdFrom === 'ai_suggestion';
    return `
        <div class="kanban-card" draggable="true" data-id="${task.id}" data-status="${task.status}">
            <div class="kanban-card-header">
                ${isAi ? '<span class="badge badge-ai">AI</span>' : ''}
                <div class="kanban-card-actions">
                    <button class="move-btn" title="Pindah Status">↔️</button>
                    <button class="edit-btn" title="Edit">✏️</button>
                    <button class="delete-btn" title="Hapus">🗑️</button>
                </div>
            </div>
            <p class="kanban-card-title">${task.title}</p>
        </div>
    `;
}

// Drag & Drop Handlers
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.id);
    console.log('Dragging task:', this.dataset.id); // DEBUG
    setTimeout(() => this.classList.add('dragging'), 0);
}

document.addEventListener('dragend', (e) => {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }
});

// Column Drop Zones
function initKanbanDragDrop() {
    const columns = document.querySelectorAll('.kanban-column');

    columns.forEach(col => {
        col.addEventListener('dragover', (e) => {
            e.preventDefault(); // Essential to allow dropping
            e.dataTransfer.dropEffect = 'move';
            col.classList.add('drag-over');
        });

        col.addEventListener('dragleave', (e) => {
            col.classList.remove('drag-over');
        });

        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.classList.remove('drag-over');

            const taskId = e.dataTransfer.getData('text/plain');
            const newStatus = col.dataset.status;

            console.log('Dropped task:', taskId, 'into:', newStatus);
            if (taskId && newStatus) {
                updateTaskStatus(taskId, newStatus);
            }
        });
    });
}

function updateTaskStatus(taskId, newStatus) {
    let tasks = getTasks();
    // Use String comparison to be safe
    const taskIndex = tasks.findIndex(t => String(t.id) === String(taskId));

    console.log('Updating status:', taskId, 'to', newStatus, 'Index:', taskIndex);

    if (taskIndex > -1 && tasks[taskIndex].status !== newStatus) {
        const oldStatus = tasks[taskIndex].status;
        tasks[taskIndex].status = newStatus;
        tasks[taskIndex].done = (newStatus === 'done'); // Sync legacy field

        saveTasks(tasks);

        // Reward XP if moved to Done
        if (newStatus === 'done' && oldStatus !== 'done') {
            if (typeof addXP === 'function') addXP(10, 'Task Selesai');
            if (typeof showGamificationModal === 'function') {
                // Optional: visual feedback
            }
        }

        renderKanbanBoard();
    }
}

// Mobile Move Menu
function showMoveMenu(btnElement, taskId, currentStatus) {
    const statuses = ['todo', 'doing', 'done'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

    // Simple toggle for now: Just move to next stage
    updateTaskStatus(taskId, nextStatus);
}


function renderScheduleList() {
    const listEl = document.getElementById('schedule-list');
    let schedules = getSchedules();

    // STRICT CLEANUP: Remove ANY prayer times from the main list
    // We filter out anything that looks like a prayer (by ID, isPrayer flag, or title keywords)
    const prayerKeywords = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya', 'Fajr', 'Dhuhr', 'Asr', 'Isha'];

    schedules = schedules.filter(s => {
        const isSystemPrayer = s.isPrayer || String(s.id).startsWith('prayer-') || (s.title && s.title.includes('🕌'));
        const isLegacyPrayer = prayerKeywords.includes(s.title);
        return !isSystemPrayer && !isLegacyPrayer;
    });

    // 1. Identify all unique dates in the user's schedules (for grouping if needed later)
    const uniqueDates = new Set();
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    schedules.forEach(s => {
        if (s.datetime && s.datetime.includes('T')) {
            uniqueDates.add(s.datetime.split('T')[0]);
        }
    });

    // NO PRAYER INJECTION HERE anymore.
    // Prayer times are only shown in the Calendar Detail View (getEventsForDate).

    // DEDUPLICATION: Final safety net
    // Use a Map to ensure unique IDs (Last one wins, though for prayers it doesn't matter)
    const uniqueSchedules = new Map();
    schedules.forEach(s => {
        // If it's a prayer, only keep one per time slot per date if multiple exist (unlikely with ID check but...)
        uniqueSchedules.set(s.id, s);
    });
    schedules = Array.from(uniqueSchedules.values());

    // Sort by time (Robust Date Comparison)
    schedules.sort((a, b) => {
        const dateA = new Date(a.datetime);
        const dateB = new Date(b.datetime);
        return dateA - dateB;
    });

    if (schedules.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><p>Belum ada jadwal</p></div>`;
        return;
    }

    listEl.innerHTML = schedules.map(schedule => {
        const isPrayer = schedule.isPrayer;
        let extraClass = '';
        const scheduleDateStr = schedule.datetime.split('T')[0];
        const isToday = scheduleDateStr === todayStr;

        if (isPrayer) {
            extraClass = 'schedule-prayer';
        } else {
            const isPast = new Date(schedule.datetime) < new Date();
            if (isPast) extraClass = 'past';
        }

        const deleteBtn = isPrayer ? '' : `<button class="delete-btn" data-id="${schedule.id}" title="Hapus">🗑️</button>`;

        // Fix Double Time Display
        let timeDisplay = '';
        if (schedule.datetime.includes('T')) {
            const timePart = schedule.datetime.split('T')[1].substring(0, 5);
            if (isToday) {
                timeDisplay = timePart;
            } else {
                // Manually format date to exclude time, e.g., "18 Feb"
                const d = new Date(schedule.datetime);
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                const datePart = `${d.getDate()} ${monthNames[d.getMonth()]}`;
                timeDisplay = `${datePart}, ${timePart}`;
            }
        } else {
            timeDisplay = formatShortDate(schedule.datetime); // Fallback for non-ISO
        }

        return `
        <div class="schedule-item ${extraClass}" data-id="${schedule.id}">
            <div class="schedule-info">
                <span class="schedule-time">${timeDisplay}</span>
                <span class="schedule-title ${isPrayer ? 'prayer-title' : ''}">${schedule.title}</span>
                ${!isPrayer && schedule.priority ? `<span class="badge badge-priority-${schedule.priority}">${getPriorityLabel(schedule.priority)}</span>` : ''}
                ${!isPrayer && schedule.createdFrom === 'ai_suggestion' ? '<span class="badge badge-ai">AI</span>' : ''}
            </div>
            <div class="action-buttons">
                ${!isPrayer ? `<button class="edit-btn" data-id="${schedule.id}" title="Edit">✏️</button>` : ''}
                ${deleteBtn}
            </div>
        </div>
    `}).join('');

    // Add event listeners (only for non-prayer items)
    listEl.querySelectorAll('.schedule-item').forEach(item => {
        const editBtn = item.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                if (typeof showEditModal === 'function') showEditModal('schedule', item.dataset.id);
            });
        }

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


// =========================================
// CALENDAR VIEW LOGIC
// =========================================
let currentCalendarDate = new Date();
let selectedDate = null;

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthYearLabel = document.getElementById('calendar-month-year');

    // Safety check for elements
    if (!grid || !monthYearLabel) {
        console.warn('Calendar elements not found');
        return;
    }

    try {
        grid.innerHTML = '';

        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();

        // Set Header
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'July', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        monthYearLabel.textContent = `${monthNames[month]} ${year}`;

        // Day Headers
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        days.forEach(day => {
            const el = document.createElement('div');
            el.className = 'calendar-day-header';
            el.textContent = day;
            grid.appendChild(el);
        });

        // Calendar Days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            const el = document.createElement('div');
            el.className = 'calendar-day empty';
            grid.appendChild(el);
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            // Fix: Use local date string construction to avoid UTC shift
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

            const el = document.createElement('div');
            el.className = 'calendar-day';
            el.textContent = i;
            el.dataset.date = dateStr;

            // Highlight Today
            if (date.toDateString() === today.toDateString()) {
                el.classList.add('today');
            }

            // Highlight Selected
            if (selectedDate === dateStr) {
                el.classList.add('selected');
            }

            // Add Event Indicators
            const events = getEventsForDate(dateStr);
            // FILTER: Don't show dots for prayer times (too cluttered)
            const visibleEvents = events.filter(e => !e.isPrayer);

            if (visibleEvents.length > 0) {
                const indicatorContainer = document.createElement('div');
                indicatorContainer.className = 'event-indicator';

                // Limit dots to 3
                visibleEvents.slice(0, 3).forEach(event => {
                    const dot = document.createElement('div');
                    dot.className = `event-dot priority-${event.priority || 'default'}`;
                    indicatorContainer.appendChild(dot);
                });
                el.appendChild(indicatorContainer);
            }

            // Interaction
            el.addEventListener('click', () => {
                selectedDate = dateStr;
                renderCalendar(); // Re-render to update highlights
                showSelectedDateEvents(dateStr);
            });

            grid.appendChild(el);
        }

        // Navigation Listeners (Attached once or re-attached safely)
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');

        // Remove old listeners to prevent clones (simple approach: clone node replacement or just overwrite onclick)
        if (prevBtn) prevBtn.onclick = () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar();
        };
        if (nextBtn) nextBtn.onclick = () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar();
        };
    } catch (e) {
        console.error('Error rendering calendar:', e);
        grid.innerHTML = '<p class="error-text">Gagal memuat kalender</p>';
    }
}

function getEventsForDate(dateStr) {
    let schedules = getSchedules();

    // CLEANUP: Remove any persisted prayer times
    schedules = schedules.filter(s => {
        const isSystemPrayer = s.isPrayer || String(s.id).startsWith('prayer-') || (s.title && s.title.includes('🕌'));
        return !isSystemPrayer;
    });

    // 1. Get User Schedules for this date
    let events = schedules.filter(s => s.datetime.startsWith(dateStr));

    // 2. Inject Prayer Times for this date
    const cachedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAYER_DATA) || '{}');
    const city = localStorage.getItem(STORAGE_KEYS.PRAYER_CITY) || 'Jakarta';

    // We check if the cached data actually matches the requested date.
    // The cache key format is usually "City-YYYY-MM-DD".
    // If the cache key contains the requested dateStr, we can use it.

    // We use cached data as a baseline for ALL dates
    // Ideally we would fetch for specific date, but for offline/simple usage, today's timings are acceptable approx.
    if (cachedData.timings) {
        const timings = cachedData.timings;
        const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const prayerMap = { 'Fajr': 'Subuh', 'Dhuhr': 'Dzuhur', 'Asr': 'Ashar', 'Maghrib': 'Maghrib', 'Isha': 'Isya' };

        prayerNames.forEach(key => {
            if (timings[key]) {
                let timeStr = timings[key];
                if (timeStr.length === 5) timeStr += ':00'; // HH:mm -> HH:mm:00

                // Add prayer time for this specific date
                events.push({
                    id: `prayer-${key}-${dateStr}`,
                    title: `🕌 ${prayerMap[key]}`,
                    datetime: `${dateStr}T${timeStr}`, // Correctly combine date and time
                    isPrayer: true
                });
            }
        });
    }

    // 3. Sort by time
    events.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    return events;
}

function showSelectedDateEvents(dateStr) {
    const container = document.getElementById('selected-date-events');
    const list = document.getElementById('selected-date-list');
    const label = document.getElementById('selected-date-label');

    const events = getEventsForDate(dateStr);

    if (events.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    if (label) label.textContent = formatShortDate(dateStr);

    list.innerHTML = events.map(schedule => {
        const isPrayer = schedule.isPrayer;
        const priorityClass = isPrayer ? 'allah' : (schedule.priority || 'default');
        const timePart = schedule.datetime.split('T')[1].substring(0, 5);
        const titleClass = isPrayer ? 'prayer-title' : '';

        return `
        <li class="schedule-item-mini">
            <span class="badge badge-priority-${priorityClass}">●</span>
            <span class="${titleClass}">${timePart} - ${schedule.title}</span>
        </li>
    `}).join('');
}
