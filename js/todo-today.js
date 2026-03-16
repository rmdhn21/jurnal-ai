// ===== DAILY TO DO LIST FEATURE =====

const TODO_TODAY_KEYS = {
    DATA: 'jurnal_ai_todo_today_data',
    DATE: 'jurnal_ai_todo_today_date'
};

let dailyTodos = [];

function initTodoToday() {
    // Check Date and Reset if new day
    const savedDate = localStorage.getItem(TODO_TODAY_KEYS.DATE);
    const today = new Date().toISOString().split('T')[0];

    if (savedDate !== today) {
        // Auto Clear for a new day
        dailyTodos = [];
        localStorage.setItem(TODO_TODAY_KEYS.DATE, today);
        saveTodos();
    } else {
        const savedData = localStorage.getItem(TODO_TODAY_KEYS.DATA);
        if (savedData) {
            dailyTodos = JSON.parse(savedData);
        }
    }

    renderDailyTodos();

    // Event Listeners
    const addBtn = document.getElementById('add-daily-todo-btn');
    const input = document.getElementById('new-daily-todo-input');

    if (addBtn) {
        addBtn.addEventListener('click', addDailyTodo);
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addDailyTodo();
        });
    }
}

function saveTodos() {
    localStorage.setItem(TODO_TODAY_KEYS.DATA, JSON.stringify(dailyTodos));
    renderDailyTodos();
}

function addDailyTodo() {
    const input = document.getElementById('new-daily-todo-input');
    const prioritySelect = document.getElementById('daily-todo-priority');

    const text = input.value.trim();
    if (!text) return;

    const newTodo = {
        id: Date.now().toString(),
        text: text,
        priority: prioritySelect.value,
        completed: false
    };

    dailyTodos.push(newTodo);
    saveTodos();

    input.value = '';
}

function toggleDailyTodo(id) {
    const todo = dailyTodos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
    }
}

function deleteDailyTodo(id) {
    dailyTodos = dailyTodos.filter(t => t.id !== id);
    saveTodos();
}

function renderDailyTodos() {
    const container = document.getElementById('daily-todo-list');
    if (!container) return;

    container.innerHTML = '';

    if (dailyTodos.length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align: center; font-style: italic;">Belum ada tugas hari ini. Tambahkan sekarang!</p>';
        return;
    }

    // Sort: P1 -> P2 -> P3 -> P4, then incomplete first
    const sortedTodos = [...dailyTodos].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.priority !== b.priority) return a.priority.localeCompare(b.priority);
        return 0;
    });

    const listHtml = sortedTodos.map(todo => {
        let badgeClass = '';
        let badgeText = '';

        switch (todo.priority) {
            case 'p1':
                badgeClass = 'badge-p1';
                badgeText = 'Penting & Mendesak';
                break;
            case 'p2':
                badgeClass = 'badge-p2';
                badgeText = 'Penting (Jadwalkan)';
                break;
            case 'p3':
                badgeClass = 'badge-p3';
                badgeText = 'Mendesak (Delegasikan)';
                break;
            case 'p4':
                badgeClass = 'badge-p4';
                badgeText = 'Tidak Penting';
                break;
        }

        return `
            <div class="daily-todo-item priority-container-${todo.priority} ${todo.completed ? 'completed' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(0,0,0,0.1); border-radius: 8px; border-left: 4px solid var(--border);">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleDailyTodo('${todo.id}')" style="width: 18px; height: 18px; cursor: pointer;">
                    <div>
                        <span style="font-size: 0.95rem; text-decoration: ${todo.completed ? 'line-through' : 'none'}; color: ${todo.completed ? 'var(--text-muted)' : 'var(--text-primary)'};">${todo.text}</span>
                        <div style="margin-top: 4px;">
                            <span class="priority-badge ${badgeClass}" style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${badgeText}</span>
                        </div>
                    </div>
                </div>
                <button onclick="deleteDailyTodo('${todo.id}')" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 5px;">🗑️</button>
            </div>
        `;
    }).join('');

    container.innerHTML = listHtml;
}

// Call initialization when the file loads or when app initializes
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTodoToday);
} else {
    initTodoToday();
}
