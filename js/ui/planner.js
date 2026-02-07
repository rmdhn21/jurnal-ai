// Planner UI module
import { getTasks, saveTask, deleteTask, toggleTask, getSchedules, saveSchedule, deleteSchedule, generateId, formatShortDate } from '../storage.js';

export function initPlannerUI() {
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

    // Expose global functions for suggestion buttons
    window.addTodoFromSuggestion = addTodoFromSuggestion;
    window.addScheduleFromSuggestion = addScheduleFromSuggestion;
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

export function addTodoFromSuggestion(text) {
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

export function addScheduleFromSuggestion(text) {
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

export function renderTodoList() {
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

export function renderScheduleList() {
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
