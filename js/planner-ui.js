// ===== PLANNER UI =====
async function initPlannerUI() {
    const addTodoBtn = document.getElementById('add-todo-btn');
    const addScheduleBtn = document.getElementById('add-schedule-btn');

    addTodoBtn.addEventListener('click', handleAddTodo);
    document.getElementById('new-todo-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTodo();
    });

    addScheduleBtn.addEventListener('click', handleAddSchedule);

    await renderKanbanBoard();
    initKanbanDragDrop();
    await renderScheduleList();
    await renderCalendar(); // Initialize Calendar
    await renderRoutinesList();
}

async function handleAddTodo() {
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

    await saveTask(task);
    input.value = '';
    await renderKanbanBoard();
}

async function handleAddSchedule() {
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

    await saveSchedule(schedule);
    titleInput.value = '';
    datetimeInput.value = '';
    await renderScheduleList();
}

async function addTodoFromSuggestion(text) {
    const task = {
        id: generateId(),
        title: text,
        done: false,
        createdAt: new Date().toISOString(),
        createdFrom: 'ai_suggestion'
    };

    await saveTask(task);
    await renderKanbanBoard();
}

async function addScheduleFromSuggestion(text) {
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

    await saveSchedule(schedule);
    await renderScheduleList();
}

// ===== DAILY ROUTINE UI FUNCTIONS =====
function switchPlannerTab(tab) {
    const eventsPanel = document.getElementById('planner-events-panel');
    const routinePanel = document.getElementById('planner-routine-panel');
    const tabs = document.querySelectorAll('#planner-screen .tab-btn');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'events') {
        eventsPanel.classList.remove('hidden');
        routinePanel.classList.add('hidden');
        tabs[0].classList.add('active');
    } else {
        eventsPanel.classList.add('hidden');
        routinePanel.classList.remove('hidden');
        tabs[1].classList.add('active');
        renderRoutinesList();
    }
}

async function renderRoutinesList() {
    const container = document.getElementById('routine-list');
    if (!container) return;

    const routines = await getRoutines();
    // Sort by time
    routines.sort((a, b) => a.time.localeCompare(b.time));

    if (routines.length === 0) {
        container.innerHTML = '<p class="text-center text-muted p-md">Belum ada rutinitas harian.</p>';
        return;
    }

    container.innerHTML = routines.map(r => `
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: var(--surface-hover); border: 1px solid var(--border);">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.2rem;">${r.icon || '⏰'}</span>
                <div>
                    <div style="font-weight: 700; font-size: 0.95rem;">${r.title}</div>
                    <div style="font-size: 0.75rem; color: var(--primary); font-weight: bold;">🕒 ${r.time}</div>
                </div>
            </div>
            <button class="icon-btn" onclick="handleDeleteRoutineUI('${r.id}')" style="color: var(--danger); font-size: 1rem;">🗑️</button>
        </div>
    `).join('');
}

async function handleAddRoutine() {
    const timeInput = document.getElementById('routine-time');
    const titleInput = document.getElementById('routine-title');
    const iconInput = document.getElementById('routine-icon');

    const time = timeInput.value;
    const title = titleInput.value.trim();
    const icon = iconInput.value.trim() || '⏰';

    if (!time || !title) {
        alert('Isi jam dan nama rutinitas!');
        return;
    }

    const routine = {
        id: generateId(),
        time,
        title,
        icon,
        updatedAt: new Date().toISOString()
    };

    await saveRoutine(routine);
    
    // Reset inputs
    titleInput.value = '';
    iconInput.value = '';
    
    await renderRoutinesList();
    if (typeof updateDailyScheduleWidget === 'function') updateDailyScheduleWidget();
}

async function handleDeleteRoutineUI(id) {
    if (!confirm('Hapus rutinitas ini?')) return;
    await deleteRoutine(id);
    await renderRoutinesList();
    if (typeof updateDailyScheduleWidget === 'function') updateDailyScheduleWidget();
}

window.switchPlannerTab = switchPlannerTab;
window.handleAddRoutine = handleAddRoutine;
window.handleDeleteRoutineUI = handleDeleteRoutineUI;


async function renderKanbanBoard() {
    const container = document.getElementById('kanban-board');
    if (!container) return;

    const tasks = await getTasks();
    const columns = {
        todo: [],
        doing: [],
        done: []
    };

    const now = new Date();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // Migration & Sorting
    for (let task of tasks) {
        if (!task.status) {
            task.status = task.done ? 'done' : 'todo';
            await saveTask(task); // Persist migration
        }

        // Auto-delete done tasks after 24 hours
        if (task.status === 'done') {
            const doneTime = task.updatedAt ? new Date(task.updatedAt) : new Date(task.createdAt);
            if (now - doneTime > ONE_DAY_MS) {
                await deleteTask(task.id);
                continue; // Skip adding to columns, it's deleted
            }
        }

        if (columns[task.status]) {
            columns[task.status].push(task);
        } else {
            // Fallback for unknown status
            columns.todo.push(task);
        }
    }

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

        card.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm('Hapus task ini?')) {
                await deleteTask(card.dataset.id);
                await renderKanbanBoard();
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

async function updateTaskStatus(taskId, newStatus) {
    let tasks = await getTasks();
    // Use String comparison to be safe
    const taskIndex = tasks.findIndex(t => String(t.id) === String(taskId));

    console.log('Updating status:', taskId, 'to', newStatus, 'Index:', taskIndex);

    if (taskIndex > -1 && tasks[taskIndex].status !== newStatus) {
        const oldStatus = tasks[taskIndex].status;
        tasks[taskIndex].status = newStatus;
        tasks[taskIndex].done = (newStatus === 'done'); // Sync legacy field

        await saveTask(tasks[taskIndex]);

        // Reward XP if moved to Done
        if (newStatus === 'done' && oldStatus !== 'done') {
            if (typeof addXP === 'function') addXP(10, 'Task Selesai');
        }

        await renderKanbanBoard();
    }
}

// Mobile Move Menu
function showMoveMenu(btnElement, taskId, currentStatus) {
    const statuses = ['todo', 'doing', 'done'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

    // Simple toggle for now: Just move to next stage
    updateTaskStatus(taskId, nextStatus);
}


async function renderScheduleList() {
    const listEl = document.getElementById('schedule-list');
    let schedules = await getSchedules();

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

    // Sort by creation time (Newest tasks newly added appear at the top)
    schedules.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.datetime);
        const dateB = new Date(b.createdAt || b.datetime);
        return dateB - dateA;
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
            deleteBtn.addEventListener('click', async () => {
                if (confirm('Hapus jadwal ini?')) {
                    await deleteSchedule(item.dataset.id);
                    await renderScheduleList();
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
let isRenderingCalendar = false;

async function renderCalendar() {
    if (isRenderingCalendar) return;
    isRenderingCalendar = true;

    const calendarTargets = [
        {
            gridId: 'calendar-grid',
            monthYearId: 'calendar-month-year',
            prevBtnId: 'prev-month',
            nextBtnId: 'next-month'
        },
        {
            gridId: 'dashboard-calendar-grid',
            monthYearId: 'dashboard-calendar-month-year',
            prevBtnId: 'dashboard-prev-month',
            nextBtnId: 'dashboard-next-month'
        }
    ];

    try {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // 1. Pre-fetch Data (Single DB call for the whole month)
        let allSchedules = await getSchedules();
        allSchedules = allSchedules.filter(s => {
            return !(s.isPrayer || String(s.id).startsWith('prayer-') || (s.title && s.title.includes('🕌')));
        });

        const cachedPrayerData = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAYER_DATA) || '{}');
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'July', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        for (const target of calendarTargets) {
            const grid = document.getElementById(target.gridId);
            const monthYearLabel = document.getElementById(target.monthYearId);

            if (!grid || !monthYearLabel) continue;

            // Set Header Label
            monthYearLabel.textContent = `${monthNames[month]} ${year}`;

            // 2. Build Offline via Fragment (Atomic Update)
            const fragment = document.createDocumentFragment();

            // Day Headers
            dayHeaders.forEach(day => {
                const el = document.createElement('div');
                el.className = 'calendar-day-header';
                el.textContent = day;
                fragment.appendChild(el);
            });

            // Calendar Logic
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Empty cells for previous month
            for (let i = 0; i < firstDay; i++) {
                const el = document.createElement('div');
                el.className = 'calendar-day empty';
                fragment.appendChild(el);
            }

            // Days
            for (let i = 1; i <= daysInMonth; i++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                
                const el = document.createElement('div');
                el.className = 'calendar-day';
                el.textContent = i;
                el.dataset.date = dateStr;

                // Sync Highlight Logic
                if (dateStr === todayStr) el.classList.add('today');
                if (selectedDate === dateStr) el.classList.add('selected');

                // 3. Sync Event Markers (Using pre-fetched data)
                const dayEvents = allSchedules.filter(s => s.datetime && s.datetime.startsWith(dateStr));
                
                // Add dot indicators
                if (dayEvents.length > 0) {
                    const indicatorContainer = document.createElement('div');
                    indicatorContainer.className = 'event-indicator';
                    dayEvents.slice(0, 3).forEach(event => {
                        const dot = document.createElement('div');
                        dot.className = `event-dot priority-${event.priority || 'default'}`;
                        indicatorContainer.appendChild(dot);
                    });
                    el.appendChild(indicatorContainer);
                }

                // Interaction
                el.addEventListener('click', async () => {
                    selectedDate = dateStr;
                    renderCalendar(); // Recursive call, blocked by isRendering if triggered too fast
                    showSelectedDateEvents(dateStr);
                });

                fragment.appendChild(el);
            }

            // 4. Update DOM in ONE step
            grid.innerHTML = '';
            grid.appendChild(fragment);

            // Re-bind Navigation (using onclick to avoid duplicate listeners)
            const prevBtn = document.getElementById(target.prevBtnId);
            const nextBtn = document.getElementById(target.nextBtnId);

            if (prevBtn) prevBtn.onclick = () => {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
                renderCalendar();
            };
            if (nextBtn) nextBtn.onclick = () => {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
                renderCalendar();
            };
        }
    } catch (e) {
        console.error('Error rendering calendar:', e);
    } finally {
        isRenderingCalendar = false;
    }
}

async function getEventsForDate(dateStr) {
    let schedules = await getSchedules();

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

async function showSelectedDateEvents(dateStr) {
    const eventTargets = [
        { containerId: 'selected-date-events', listId: 'selected-date-list', labelId: 'selected-date-label' },
        { containerId: 'dashboard-selected-date-events', listId: 'dashboard-selected-date-list', labelId: 'dashboard-selected-date-label' }
    ];

    const events = await getEventsForDate(dateStr);

    eventTargets.forEach(target => {
        const container = document.getElementById(target.containerId);
        const list = document.getElementById(target.listId);
        const label = document.getElementById(target.labelId);

        if (!container || !list) return; // Skip if returning to a non-active screen

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
    });
}
