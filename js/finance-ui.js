// ===== FINANCE UI =====
let transactionPage = 1;
const TRANSACTIONS_PER_PAGE = 20;

function initFinanceUI() {
    const addTransactionBtn = document.getElementById('add-transaction-btn');

    const dateInput = document.getElementById('transaction-date');
    if (dateInput) {
        dateInput.value = getTodayString();
    }

    addTransactionBtn.addEventListener('click', handleAddTransaction);

    transactionPage = 1;
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

    // CHECK DAILY BUDGET
    if (type === 'expense') {
        const budgets = getBudgets();
        const categoryBudget = budgets.find(b => b.category === category);

        if (categoryBudget && categoryBudget.dailyLimit > 0) {
            const today = date || getTodayString();
            const transactions = getTransactions();
            const todayExpenses = transactions
                .filter(t => t.type === 'expense' && t.category === category && t.date === today)
                .reduce((sum, t) => sum + t.amount, 0);

            if (todayExpenses + amount > categoryBudget.dailyLimit) {
                alert(`⚠️ Peringatan: Pengeluaran hari ini (${formatCurrency(todayExpenses + amount)}) melebihi batas harian (${formatCurrency(categoryBudget.dailyLimit)}) untuk kategori ${category}!`);
            }
        }
    }

    const isRecurring = document.getElementById('is-recurring-transaction').checked;
    const recurringDate = parseInt(document.getElementById('recurring-date').value);

    if (isRecurring) {
        if (!recurringDate || recurringDate < 1 || recurringDate > 31) {
            alert('Tanggal rutin harus valid (1-31)');
            return;
        }
        saveRecurringTransaction(`Transaksi ${category}`, amount, type, category, walletId, recurringDate);
        alert(`Transaksi rutin tgl ${recurringDate} berhasil dijadwalkan!`);
    }

    saveTransaction(transaction);
    updateWalletBalance(walletId, amount, type);

    // Reset form
    document.getElementById('transaction-amount').value = '';
    document.getElementById('transaction-category').value = '';
    document.getElementById('transaction-desc').value = '';
    document.getElementById('is-recurring-transaction').checked = false;
    const recurringDateGroup = document.getElementById('recurring-date-group');
    if (recurringDateGroup) recurringDateGroup.classList.add('hidden');
    document.getElementById('recurring-date').value = '';

    if (typeof updateBudgetUI === 'function') updateBudgetUI();
    if (typeof updateGlobalBudgetUI === 'function') updateGlobalBudgetUI();

    transactionPage = 1;
    renderTransactionList();
    updateFinanceSummary();
    renderWalletListSummary();
    updateWalletSelectOptions();
    initFinanceChart();
}

function renderTransactionList() {
    const listEl = document.getElementById('transaction-list');
    const transactions = getTransactions();

    if (transactions.length === 0) {
        listEl.innerHTML = '<div class="empty-state"><p>Belum ada transaksi</p></div>';
        return;
    }

    const visibleCount = transactionPage * TRANSACTIONS_PER_PAGE;
    const visibleTransactions = transactions.slice(0, visibleCount);
    const hasMore = transactions.length > visibleCount;

    listEl.innerHTML = visibleTransactions.map(t => `
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
            <button class="edit-btn" title="Edit">✏️</button>
            <button class="delete-btn">🗑️</button>
        </div>
    `).join('') + (hasMore ? `
        <button class="btn-load-more" id="load-more-transactions">
            Muat Lebih Banyak (${visibleCount}/${transactions.length})
        </button>
    ` : '');

    // Load more
    const loadMoreBtn = document.getElementById('load-more-transactions');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            transactionPage++;
            renderTransactionList();
        });
    }

    // Edit
    listEl.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.transaction-item');
            if (typeof showEditModal === 'function') showEditModal('transaction', item.dataset.id);
        });
    });

    // Delete
    listEl.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Hapus transaksi ini?')) {
                const item = btn.closest('.transaction-item');
                deleteTransaction(item.dataset.id);
                renderTransactionList();
                updateFinanceSummary();
                initFinanceChart();
            }
        });
    });
}

function updateFinanceSummary() {
    const transactions = getTransactions();
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-expense').textContent = formatCurrency(expense);
    document.getElementById('total-balance').textContent = formatCurrency(income - expense);
}

// ===== GLOBAL DAILY BUDGET LOGIC =====
function initGlobalBudgetUI() {
    const manageBtn = document.getElementById('manage-wallets-btn'); // Reuse button or add new one?
    // Actually, distinct from Wallets. Let's look for a specific trigger if any.
    // The previous code had "Budget Harian Global" card.

    // Check if we need a dedicated manage button or if it's part of Settings.
    // For now, let's just ensure it updates on load.
    updateGlobalBudgetUI();
}

function updateGlobalBudgetUI() {
    const card = document.getElementById('global-budget-card');
    const text = document.getElementById('global-budget-text');
    const progressBar = document.getElementById('global-budget-progress');

    // Get Settings directly
    const settings = getSettings();
    const globalLimit = parseFloat(settings.globalBudget) || 0;

    if (!card || !text || !progressBar) return;

    if (globalLimit <= 0) {
        card.classList.add('hidden');
        return;
    }

    card.classList.remove('hidden');

    // Make editable
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon btn-small absolute-top-right';
    editBtn.innerHTML = '✏️';
    editBtn.onclick = () => {
        const current = settings.globalBudget || 0;
        const newLimit = prompt('Masukkan batasan budget harian (Rp):', current);
        if (newLimit !== null) {
            const val = parseFloat(newLimit);
            if (!isNaN(val)) {
                localStorage.setItem(STORAGE_KEYS.GLOBAL_BUDGET, val);
                updateGlobalBudgetUI();
            }
        }
    };

    // Ensure we don't duplicate the button if it exists (naive check or clear header)
    // Better: Add it to card-header if not present
    const header = card.querySelector('.card-header');
    if (header && !header.querySelector('button')) {
        header.appendChild(editBtn);
    }

    const transactions = getTransactions();
    const today = getTodayString();

    const todayExpenses = transactions
        .filter(t => t.type === 'expense' && t.date === today)
        .reduce((sum, t) => sum + t.amount, 0);

    const percentage = Math.min((todayExpenses / globalLimit) * 100, 100);

    text.textContent = `${formatCurrency(todayExpenses)} / ${formatCurrency(globalLimit)}`;
    progressBar.style.width = `${percentage}%`;

    // Color coding
    progressBar.className = 'budget-progress-bar'; // Reset
    if (percentage >= 100) {
        progressBar.classList.add('bg-danger');
    } else if (percentage >= 75) {
        progressBar.classList.add('bg-warning');
    } else {
        progressBar.classList.add('bg-success');
    }
}
