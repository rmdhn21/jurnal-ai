// ===== EDIT MODAL MODULE =====
let currentEditType = null;
let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-edit-btn');
    const closeBtn = document.getElementById('close-edit-modal');

    if (saveBtn) saveBtn.addEventListener('click', handleSaveEdit);
    if (closeBtn) closeBtn.addEventListener('click', closeEditModal);
});

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    currentEditType = null;
    currentEditId = null;
}

function showEditModal(type, id) {
    currentEditType = type;
    currentEditId = id;

    const modal = document.getElementById('edit-modal');
    const container = document.getElementById('edit-form-container');
    const title = document.getElementById('edit-modal-title');

    if (!modal || !container || !title) return;

    // Clear container
    container.innerHTML = '';

    let item = null;

    if (type === 'transaction') {
        const transactions = getTransactions();
        item = transactions.find(t => t.id === id);
        if (!item) return;

        title.textContent = 'Edit Transaksi';
        container.innerHTML = `
            <div class="form-row">
                <select id="edit-transaction-type" class="input">
                    <option value="income" ${item.type === 'income' ? 'selected' : ''}>💵 Pemasukan</option>
                    <option value="expense" ${item.type === 'expense' ? 'selected' : ''}>💸 Pengeluaran</option>
                </select>
            </div>
            <div class="form-group">
                <label>Wallet</label>
                <select id="edit-transaction-wallet" class="input">
                    <!-- Options injected -->
                </select>
            </div>
            <div class="form-row">
                <input type="number" id="edit-transaction-amount" class="input" value="${item.amount}">
                <input type="date" id="edit-transaction-date" class="input" value="${item.date}">
            </div>
            <input type="text" id="edit-transaction-category" class="input" value="${item.category}" placeholder="Kategori">
            <input type="text" id="edit-transaction-desc" class="input" value="${item.description || ''}" placeholder="Deskripsi">
        `;

        // Populate wallets
        const walletSelect = document.getElementById('edit-transaction-wallet');
        const wallets = getWallets();
        walletSelect.innerHTML = wallets.map(w =>
            `<option value="${w.id}" ${w.id === item.walletId ? 'selected' : ''}>${w.name} (${formatCurrency(w.balance)})</option>`
        ).join('');

    } else if (type === 'todo') {
        const tasks = getTasks();
        item = tasks.find(t => t.id === id);
        if (!item) return;

        title.textContent = 'Edit To-Do';
        container.innerHTML = `
            <input type="text" id="edit-todo-title" class="input" value="${item.title}" placeholder="Judul Task">
        `;

    } else if (type === 'schedule') {
        const schedules = getSchedules();
        item = schedules.find(s => s.id === id);
        if (!item) return;

        title.textContent = 'Edit Jadwal';
        container.innerHTML = `
            <input type="text" id="edit-schedule-title" class="input" value="${item.title}" placeholder="Nama Kegiatan">
            <div class="form-row">
                <input type="datetime-local" id="edit-schedule-datetime" class="input" value="${item.datetime}">
                <select id="edit-schedule-priority" class="input">
                    <option value="allah" ${item.priority === 'allah' ? 'selected' : ''}>🔴 Allah (Ibadah)</option>
                    <option value="self" ${item.priority === 'self' ? 'selected' : ''}>🟢 Diri (Istirahat/Belajar)</option>
                    <option value="others" ${item.priority === 'others' ? 'selected' : ''}>🔵 Umat (Kerja/Sosial)</option>
                </select>
            </div>
        `;

    } else if (type === 'goal') {
        const goals = getGoals();
        item = goals.find(g => g.id === id);
        if (!item) return;

        title.textContent = 'Edit Goal';
        container.innerHTML = `
             <input type="text" id="edit-goal-title" class="input" value="${item.title}" placeholder="Judul Goal">
             <div class="form-row">
                <div class="form-group flex-1">
                    <label>Target</label>
                    <input type="number" id="edit-goal-target" class="input" value="${item.target}">
                </div>
                <div class="form-group flex-1">
                    <label>Satuan</label>
                    <input type="text" id="edit-goal-unit" class="input" value="${item.unit}" placeholder="km, kali">
                </div>
             </div>
             <div class="form-group">
                <label>Deadline</label>
                <input type="date" id="edit-goal-deadline" class="input" value="${item.deadline || ''}">
             </div>
             <div class="form-group">
                <label>Catatan</label>
                <textarea id="edit-goal-notes" class="input" rows="2">${item.notes || ''}</textarea>
             </div>
        `;
    }

    modal.classList.remove('hidden');
}

function handleSaveEdit() {
    if (!currentEditId || !currentEditType) return;

    if (currentEditType === 'transaction') {
        const transactions = getTransactions();
        const item = transactions.find(t => t.id === currentEditId);
        if (!item) return;

        const oldAmount = item.amount;
        const oldType = item.type;
        const oldWalletId = item.walletId;

        item.type = document.getElementById('edit-transaction-type').value;
        item.walletId = document.getElementById('edit-transaction-wallet').value;
        item.amount = parseFloat(document.getElementById('edit-transaction-amount').value) || 0;
        item.date = document.getElementById('edit-transaction-date').value;
        item.category = document.getElementById('edit-transaction-category').value.trim();
        item.description = document.getElementById('edit-transaction-desc').value.trim();

        if (!item.amount || !item.category) {
            alert('Jumlah dan Kategori harus diisi!');
            return;
        }

        // Revert old balance
        updateWalletBalance(oldWalletId, -oldAmount, oldType); // cancel old effect
        // Apply new balance
        updateWalletBalance(item.walletId, item.amount, item.type);

        saveTransaction(item); // Update existing

        renderTransactionList();
        updateFinanceSummary();
        renderWalletListSummary();
        initFinanceChart();

    } else if (currentEditType === 'todo') {
        const tasks = getTasks();
        const item = tasks.find(t => t.id === currentEditId);
        if (!item) return;

        item.title = document.getElementById('edit-todo-title').value.trim();
        if (!item.title) {
            alert('Judul tidak boleh kosong!');
            return;
        }

        saveTask(item);
        if (typeof renderKanbanBoard === 'function') renderKanbanBoard();

    } else if (currentEditType === 'schedule') {
        const schedules = getSchedules();
        const item = schedules.find(s => s.id === currentEditId);
        if (!item) return;

        item.title = document.getElementById('edit-schedule-title').value.trim();
        item.datetime = document.getElementById('edit-schedule-datetime').value;
        item.priority = document.getElementById('edit-schedule-priority').value;

        if (!item.title || !item.datetime) {
            alert('Judul dan Waktu harus diisi!');
            return;
        }

        saveSchedule(item);
        renderScheduleList();

    } else if (currentEditType === 'goal') {
        const goals = getGoals();
        const item = goals.find(g => g.id === currentEditId);
        if (!item) return;

        item.title = document.getElementById('edit-goal-title').value.trim();
        item.target = parseInt(document.getElementById('edit-goal-target').value) || 0;
        item.unit = document.getElementById('edit-goal-unit').value.trim();
        item.deadline = document.getElementById('edit-goal-deadline').value;
        item.notes = document.getElementById('edit-goal-notes').value.trim();

        if (!item.title) {
            alert('Judul Goal harus diisi!');
            return;
        }

        saveGoal(item);
        renderGoalsList();
        if (typeof updateGoalsStats === 'function') updateGoalsStats();
    }

    closeEditModal();
}
