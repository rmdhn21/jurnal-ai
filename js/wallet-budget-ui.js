// ===== WALLET UI LOGIC =====
function initWalletUI() {
    const manageBtn = document.getElementById('manage-wallets-btn');
    const modal = document.getElementById('wallet-modal');
    const closeBtn = document.getElementById('close-wallet-modal');
    const addBtn = document.getElementById('add-wallet-btn');

    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('hidden');
                renderWalletManagementList();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', handleAddWallet);
    }

    renderWalletListSummary();
    updateWalletSelectOptions();
}

function handleAddWallet() {
    const nameInput = document.getElementById('new-wallet-name');
    const balanceInput = document.getElementById('new-wallet-balance');
    const name = nameInput.value.trim();
    const balance = parseFloat(balanceInput.value) || 0;

    if (!name) {
        alert('Nama dompet harus diisi!');
        return;
    }

    const wallet = {
        id: generateId(),
        name: name,
        balance: balance,
        createdAt: new Date().toISOString()
    };

    saveWallet(wallet);

    nameInput.value = '';
    balanceInput.value = '0';

    renderWalletManagementList();
    renderWalletListSummary();
    updateWalletSelectOptions();
}

function renderWalletManagementList() {
    const listEl = document.getElementById('wallet-management-list');
    if (!listEl) return;

    const wallets = getWallets();

    listEl.innerHTML = wallets.map(w => `
        <div class="wallet-management-item">
            <span class="wallet-item-name">${w.name} (${formatCurrency(w.balance || 0)})</span>
            ${!w.isDefault ? `<button class="delete-btn" onclick="deleteWalletUI('${w.id}')">🗑️</button>` : '<span class="badge badge-primary">Utama</span>'}
        </div>
    `).join('');
}

window.deleteWalletUI = function (id) {
    if (confirm('Hapus dompet ini? Transaksi terkait tidak akan dihapus (akan error tampilannya).')) {
        deleteWallet(id);
        renderWalletManagementList();
        renderWalletListSummary();
        updateWalletSelectOptions();
    }
};

function renderWalletListSummary() {
    const container = document.getElementById('wallet-list-summary');
    if (!container) return;

    const wallets = getWallets();

    container.innerHTML = wallets.map(w => `
        <div class="wallet-chip">
            <span class="wallet-name">${w.name}</span>
            <span class="wallet-balance">${formatCurrency(w.balance || 0)}</span>
        </div>
    `).join('');
}

function updateWalletSelectOptions() {
    const select = document.getElementById('transaction-wallet');
    if (!select) return;

    const wallets = getWallets();
    select.innerHTML = wallets.map(w => `
        <option value="${w.id}">${w.name} (${formatCurrency(w.balance || 0)})</option>
    `).join('');
}

// ===== BUDGET UI LOGIC =====
function initBudgetUI() {
    const manageBtn = document.getElementById('manage-budget-btn');
    const modal = document.getElementById('budget-modal');
    const closeBtn = document.getElementById('close-budget-modal');
    const addBtn = document.getElementById('add-budget-btn');

    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('hidden');
                updateBudgetCategoryOptions();
                renderBudgetManagementList();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', handleAddBudget);
    }

    renderBudgetListSummary();
}

function updateBudgetCategoryOptions() {
    const select = document.getElementById('new-budget-category');
    if (!select) return;

    const categories = [
        "Makanan", "Transport", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Lainnya"
    ];

    select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

function handleAddBudget() {
    const categorySelect = document.getElementById('new-budget-category');
    const limitInput = document.getElementById('new-budget-limit');

    const category = categorySelect.value;
    const limit = parseFloat(limitInput.value);

    if (!limit || limit <= 0) {
        alert('Masukkan nominal budget yang valid!');
        return;
    }

    const budget = {
        id: generateId(),
        category: category,
        limit: limit,
        createdAt: new Date().toISOString()
    };

    saveBudget(budget);
    limitInput.value = '';

    renderBudgetManagementList();
    renderBudgetListSummary();
}

function renderBudgetManagementList() {
    const listEl = document.getElementById('budget-management-list');
    if (!listEl) return;

    const budgets = getBudgets();

    listEl.innerHTML = budgets.map(b => `
        <div class="budget-management-item">
            <div>
                <strong class="budget-category-name">${b.category}</strong>
                <span class="budget-limit-text">Limit: ${formatCurrency(b.limit)}</span>
            </div>
            <button class="delete-btn" onclick="deleteBudgetUI('${b.id}')">🗑️</button>
        </div>
    `).join('');
}

window.deleteBudgetUI = function (id) {
    if (confirm('Hapus budget ini?')) {
        deleteBudget(id);
        renderBudgetManagementList();
        renderBudgetListSummary();
    }
};

function getCategoryExpenses(category) {
    const transactions = getTransactions();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
        .filter(t => {
            if (!t.date || t.type !== 'expense' || t.category !== category) return false;
            const [tYear, tMonth] = t.date.split('-');
            const currentMonthStr = String(currentMonth + 1).padStart(2, '0');
            return Number(tYear) === currentYear && tMonth === currentMonthStr;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function renderBudgetListSummary() {
    const container = document.getElementById('budget-list-summary');
    if (!container) return;

    const budgets = getBudgets();

    if (budgets.length === 0) {
        container.innerHTML = '<p class="text-muted budget-empty">Belum ada budget yang diatur</p>';
        return;
    }

    container.innerHTML = budgets.map(b => {
        const spent = getCategoryExpenses(b.category);
        const percentage = Math.min((spent / b.limit) * 100, 100);

        let colorClass = 'bg-success';
        if (percentage >= 100) colorClass = 'bg-danger';
        else if (percentage >= 80) colorClass = 'bg-warning';

        return `
        <div class="budget-summary-item">
            <div class="budget-header">
                <span>${b.category}</span>
                <span class="budget-amount">${formatCurrency(spent)} / ${formatCurrency(b.limit)}</span>
            </div>
            <div class="budget-progress-container">
                <div class="budget-progress-bar ${colorClass}" style="width: ${percentage}%"></div>
            </div>
        </div>
        `;
    }).join('');
}
