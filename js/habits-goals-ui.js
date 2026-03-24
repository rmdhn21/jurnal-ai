// ===== HABITS UI =====
function initHabitsUI() {
    const addHabitBtn = document.getElementById('add-habit-btn');

    addHabitBtn.addEventListener('click', handleAddHabit);
    document.getElementById('new-habit-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddHabit();
    });

    // Frequency toggle
    const freqSelect = document.getElementById('habit-frequency');
    if (freqSelect) {
        freqSelect.addEventListener('change', () => {
            const daysEl = document.getElementById('habit-freq-days');
            const intervalEl = document.getElementById('habit-freq-interval');
            daysEl.classList.toggle('hidden', freqSelect.value !== 'weekly');
            intervalEl.classList.toggle('hidden', freqSelect.value !== 'custom');
        });
    }

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

    const freqSelect = document.getElementById('habit-frequency');
    const frequency = freqSelect ? freqSelect.value : 'daily';

    let frequencyDays = [];
    let frequencyInterval = 1;

    if (frequency === 'weekly') {
        const checkboxes = document.querySelectorAll('#habit-freq-days input:checked');
        frequencyDays = Array.from(checkboxes).map(c => parseInt(c.value));
        if (frequencyDays.length === 0) {
            alert('Pilih minimal 1 hari!');
            return;
        }
    } else if (frequency === 'custom') {
        frequencyInterval = parseInt(document.getElementById('habit-interval-days')?.value) || 3;
    }

    const habit = {
        id: generateId(),
        name: name,
        frequency: frequency,
        frequencyDays: frequencyDays,
        frequencyInterval: frequencyInterval,
        completions: {},
        createdAt: new Date().toISOString()
    };

    saveHabit(habit);
    input.value = '';
    if (freqSelect) freqSelect.value = 'daily';
    const daysEl = document.getElementById('habit-freq-days');
    const intervalEl = document.getElementById('habit-freq-interval');
    if (daysEl) { daysEl.classList.add('hidden'); daysEl.querySelectorAll('input').forEach(c => c.checked = false); }
    if (intervalEl) intervalEl.classList.add('hidden');

    renderHabitsTodayList();
    renderAllHabitsList();
    initHabitsChart();
}

function isHabitScheduledToday(habit) {
    const freq = habit.frequency || 'daily';
    if (freq === 'daily') return true;

    const today = new Date();
    if (freq === 'weekly') {
        const dayOfWeek = today.getDay(); // 0=Sun..6=Sat
        return (habit.frequencyDays || []).includes(dayOfWeek);
    }

    if (freq === 'custom') {
        const created = new Date(habit.createdAt);
        const diffDays = Math.floor((today - created) / (1000 * 60 * 60 * 24));
        return diffDays % (habit.frequencyInterval || 3) === 0;
    }

    return true;
}

function getFrequencyLabel(habit) {
    const freq = habit.frequency || 'daily';
    if (freq === 'daily') return '';
    if (freq === 'weekly') {
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const days = (habit.frequencyDays || []).map(d => dayNames[d]).join(', ');
        return `📆 ${days}`;
    }
    if (freq === 'custom') {
        return `🔄 /${habit.frequencyInterval || 3}hari`;
    }
    return '';
}

function renderHabitsTodayList() {
    const listEl = document.getElementById('habits-today');
    const habits = getHabits();
    const today = getTodayString();

    const todaysHabits = habits.filter(h => isHabitScheduledToday(h));

    if (todaysHabits.length === 0) {
        listEl.innerHTML = '<div class="empty-state"><p>Tidak ada habit untuk hari ini</p></div>';
        return;
    }

    listEl.innerHTML = todaysHabits.map(h => {
        const isCompleted = h.completions && h.completions[today];
        const freqLabel = getFrequencyLabel(h);
        return `
            <div class="habit-item" data-id="${h.id}">
                <input type="checkbox" class="habit-checkbox" ${isCompleted ? 'checked' : ''}>
                <span class="habit-name ${isCompleted ? 'completed' : ''}">${h.name}</span>
                ${freqLabel ? `<span class="habit-freq-label">${freqLabel}</span>` : ''}
            </div>
        `;
    }).join('');

    listEl.querySelectorAll('.habit-item').forEach(item => {
        const checkbox = item.querySelector('.habit-checkbox');
        checkbox.addEventListener('change', () => {
            const habit = toggleHabitCompletion(item.dataset.id, today);

            // Gamification
            if (habit && habit.completions && habit.completions[today] && typeof addXP === 'function') {
                addXP(10, 'Habit Selesai');
                if (habit.streak > 0 && habit.streak % 7 === 0) {
                    addXP(20, `${habit.streak} Hari Streak!`);
                }
            }

            renderHabitsTodayList();
            initHabitsChart();
        });
    });
}

function renderAllHabitsList() {
    const listEl = document.getElementById('habits-list');
    const habits = getHabits();

    if (habits.length === 0) {
        listEl.innerHTML = '<div class="empty-state"><p>Belum ada habit</p></div>';
        return;
    }

    listEl.innerHTML = habits.map(h => {
        const streak = calculateStreak(h);
        const freqLabel = getFrequencyLabel(h);
        return `
            <div class="habit-item" data-id="${h.id}">
                <span class="habit-name">${h.name}</span>
                ${freqLabel ? `<span class="habit-freq-label">${freqLabel}</span>` : ''}
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
    const freq = habit.frequency || 'daily';

    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // Skip days that aren't scheduled
        if (freq === 'weekly') {
            if (!(habit.frequencyDays || []).includes(d.getDay())) continue;
        } else if (freq === 'custom') {
            const created = new Date(habit.createdAt);
            const diffDays = Math.floor((d - created) / (1000 * 60 * 60 * 24));
            if (diffDays < 0 || diffDays % (habit.frequencyInterval || 3) !== 0) continue;
        }

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

    const activeListEl = document.getElementById('active-goals-list');
    const completedListEl = document.getElementById('completed-goals-list');

    if (!goalsListenersAttached) {
        if (activeListEl) attachGoalEventListeners(activeListEl);
        if (completedListEl) attachGoalEventListeners(completedListEl);
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

    if (activeGoals.length === 0) {
        activeListEl.innerHTML = '<div class="empty-state"><p>Belum ada goals aktif</p></div>';
    } else {
        activeListEl.innerHTML = activeGoals.map(g => createGoalItem(g, false)).join('');
    }

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
                    <div class="action-buttons">
                        <button class="edit-goal-btn" title="Edit">✏️</button>
                        <button class="delete-goal-btn" title="Hapus">🗑️</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function attachGoalEventListeners(container) {
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const goalItem = btn.closest('.goal-item');
        if (!goalItem) return;

        const goalId = goalItem.dataset.id;
        e.stopPropagation();

        if (btn.classList.contains('increment-btn')) {
            const goals = getGoals();
            const goal = goals.find(g => g.id === goalId);
            if (goal) {
                const progressInput = goalItem.querySelector('.progress-input');
                const amount = progressInput ? parseInt(progressInput.value) || 1 : 1;
                const newProgress = Math.min(goal.target, (goal.currentProgress || 0) + amount);
                updateGoalProgress(goalId, newProgress);
                renderGoalsList();
                updateGoalsStats();
            }
        }

        if (btn.classList.contains('complete-btn')) {
            completeGoal(goalId);
            if (typeof addXP === 'function') addXP(50, 'Goal Tercapai!');
            renderGoalsList();
            updateGoalsStats();
        }

        if (btn.classList.contains('edit-goal-btn')) {
            if (typeof showEditModal === 'function') showEditModal('goal', goalId);
        }

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
