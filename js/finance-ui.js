// ===== FINANCE UI =====
let transactionPage = 1;
const TRANSACTIONS_PER_PAGE = 20;

async function initFinanceUI() {
    const addTransactionBtn = document.getElementById('add-transaction-btn');

    const dateInput = document.getElementById('transaction-date');
    if (dateInput) {
        dateInput.value = getTodayString();
    }

    addTransactionBtn.addEventListener('click', handleAddTransaction);

    // Dynamic Category Filtering
    const typeSelect = document.getElementById('transaction-type');
    const categorySelect = document.getElementById('transaction-category');
    if (typeSelect && categorySelect) {
        typeSelect.addEventListener('change', filterCategoriesByType);
        // Initial filter
        filterCategoriesByType();
    }

    // New Event Listeners
    const viewReportBtn = document.getElementById('view-pro-report-btn');
    if (viewReportBtn) viewReportBtn.addEventListener('click', renderProfessionalReport);

    const closeReportBtn = document.getElementById('close-pro-report-modal');
    if (closeReportBtn) closeReportBtn.addEventListener('click', () => {
        document.getElementById('pro-report-modal').classList.add('hidden');
    });

    if (typeof setupChartToggle === 'function') setupChartToggle();

    // Filter Listeners
    const filterType = document.getElementById('filter-type');
    const filterCategory = document.getElementById('filter-category');
    const filterSearch = document.getElementById('filter-search');
    const handleFilterChange = () => {
        transactionPage = 1;
        renderTransactionList();
    };
    if (filterType) filterType.addEventListener('change', handleFilterChange);
    if (filterCategory) filterCategory.addEventListener('change', handleFilterChange);
    if (filterSearch) filterSearch.addEventListener('input', handleFilterChange);

    transactionPage = 1;
    await renderTransactionList();
    await updateFinanceSummary();
    await initFinanceChart();
    await updateFinancialHealthScore();

    if (typeof initWalletUI === 'function') await initWalletUI();
    if (typeof initBudgetUI === 'function') await initBudgetUI();
}

async function updateFinancialHealthScore() {
    const transactions = await getTransactions();
    if (transactions.length === 0) return;

    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

    // Calculate Score (Simple Model)
    // 50% from savings rate (target 20%+)
    // 50% from budget adherence (to be implemented more deeply)
    let score = Math.max(0, Math.min(100, (savingsRate / 20) * 50 + 30)); 
    if (income === 0 && expense > 0) score = 10;
    if (income > 0 && expense === 0) score = 100;

    const scoreCircle = document.getElementById('health-score-circle');
    const scoreValue = document.getElementById('health-score-value');
    const statusText = document.getElementById('health-status-text');
    const adviceText = document.getElementById('health-advice');
    const statSavingsRate = document.getElementById('stat-savings-rate');

    if (!scoreCircle) return;

    scoreValue.textContent = Math.round(score);
    statSavingsRate.textContent = `${Math.round(savingsRate)}%`;

    scoreCircle.className = 'health-score-circle';
    if (score >= 75) {
        scoreCircle.classList.add('good');
        statusText.textContent = 'Sangat Sehat 🚀';
        adviceText.textContent = 'Pertahankan pola menabung Anda. Anda berada di jalur yang tepat untuk kebebasan finansial.';
    } else if (score >= 50) {
        scoreCircle.classList.add('warning');
        statusText.textContent = 'Perlu Perhatian ⚠️';
        adviceText.textContent = 'Cobalah untuk menekan pengeluaran non-esensial. Targetkan savings rate minimal 20%.';
    } else {
        scoreCircle.classList.add('danger');
        statusText.textContent = 'Waspada 🚨';
        adviceText.textContent = 'Pengeluaran Anda hampir atau sudah melebihi pemasukan. Segera evaluasi pos pengeluaran Anda.';
    }
}

async function renderProfessionalReport() {
    const modal = document.getElementById('pro-report-modal');
    modal.classList.remove('hidden');

    const transactions = await getTransactions();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthName = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    document.getElementById('report-period-title').textContent = `Laporan Keuangan - ${monthName}`;
    document.getElementById('report-date-generated').textContent = `Generated on: ${new Date().toLocaleString('id-ID')}`;

    const monthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

    document.getElementById('report-total-income').textContent = formatCurrency(income);
    document.getElementById('report-total-expense').textContent = formatCurrency(expense);
    document.getElementById('report-net-cash').textContent = formatCurrency(income - expense);
    document.getElementById('report-savings-rate').textContent = `${Math.round(savingsRate)}%`;

    // Top Expenses
    const categories = {};
    monthTransactions.filter(t => t.type === 'expense').forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    const topCats = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topExpensesList = document.getElementById('report-top-expenses');
    topExpensesList.innerHTML = topCats.map(([cat, amt]) => `
        <div class="flex-row justify-between mb-xs">
            <span class="text-sm">🔹 ${cat}</span>
            <span class="text-sm font-bold">${formatCurrency(amt)}</span>
        </div>
    `).join('') || '<p class="text-muted text-xs">Tidak ada data pengeluaran.</p>';

    // Budget Adherence
    const budgets = getBudgets();
    const budgetList = document.getElementById('report-budget-list');
    budgetList.innerHTML = budgets.map(b => {
        const spent = categories[b.category] || 0;
        const perc = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
        return `
            <div class="mb-sm">
                <div class="flex-row justify-between text-xs mb-xs">
                    <span>${b.category}</span>
                    <span class="${perc > 100 ? 'expense' : 'success'}">${perc}%</span>
                </div>
                <div class="progress-bar-mini" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                    <div style="width: ${Math.min(perc, 100)}%; height: 100%; background: ${perc > 100 ? 'var(--error)' : 'var(--success)'}"></div>
                </div>
            </div>
        `;
    }).join('') || '<p class="text-muted text-xs">Belum ada budget yang diatur secara spesifik.</p>';

    // Advisor Notes (Simulated or triggered)
    const adviceText = document.getElementById('report-ai-advice');
    adviceText.textContent = "Menganalisis data...";
    
    // Quick local logic for advice if AI is slow
    let advice = "Pola keuangan Anda terlihat stabil. ";
    if (savingsRate < 10) advice = "Savings rate Anda di bawah 10%. Pertimbangkan untuk memotong pengeluaran gaya hidup. ";
    if (income < expense) advice = "PERINGATAN: Pengeluaran melebihi pemasukan bulan ini! Segera evaluasi hutang atau pengeluaran besar. ";
    
    const maxCat = topCats[0];
    if (maxCat) advice += `Pengeluaran terbesar ada pada kategori ${maxCat[0]}. Coba cari alternatif yang lebih hemat di kategori ini.`;

    adviceText.textContent = advice;
    
    // Summary Table (Excel-like)
    const summaryTable = document.getElementById('report-summary-table');
    if (summaryTable) {
        summaryTable.innerHTML = `
            <table class="w-full text-xs" style="border-collapse: collapse; margin-top: 15px;">
                <thead style="background: rgba(255,255,255,0.05);">
                    <tr>
                        <th class="p-xs text-left border border-white-10">Kategori</th>
                        <th class="p-xs text-right border border-white-10">Nominal</th>
                        <th class="p-xs text-right border border-white-10">%</th>
                    </tr>
                </thead>
                <tbody>
                    ${topCats.map(([cat, amt]) => `
                        <tr>
                            <td class="p-xs border border-white-10">${cat}</td>
                            <td class="p-xs text-right border border-white-10">${formatCurrency(amt)}</td>
                            <td class="p-xs text-right border border-white-10">${Math.round((amt / (expense || 1)) * 100)}%</td>
                        </tr>
                    `).join('')}
                    <tr class="font-bold" style="background: rgba(255,100,100,0.1);">
                        <td class="p-xs border border-white-10 text-primary">Total Pengeluaran Bulan Ini</td>
                        <td class="p-xs text-right border border-white-10 text-primary">${formatCurrency(expense)}</td>
                        <td class="p-xs text-right border border-white-10">100%</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}

async function handleAddTransaction() {
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
        const budgets = await getBudgets();
        const categoryBudget = budgets.find(b => b.category === category);

        if (categoryBudget && categoryBudget.dailyLimit > 0) {
            const today = date || getTodayString();
            const transactions = await getTransactions();
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
        if (typeof saveRecurringTransaction === 'function') {
            await saveRecurringTransaction(`Transaksi ${category}`, amount, type, category, walletId, recurringDate);
            alert(`Transaksi rutin tgl ${recurringDate} berhasil dijadwalkan!`);
        }
    }

    await saveTransaction(transaction);
    await updateWalletBalance(walletId, amount, type);

    // Reset form
    document.getElementById('transaction-amount').value = '';
    document.getElementById('transaction-category').value = '';
    document.getElementById('transaction-desc').value = '';
    const isRecur = document.getElementById('is-recurring-transaction');
    if (isRecur) isRecur.checked = false;
    const recurringDateGroup = document.getElementById('recurring-date-group');
    if (recurringDateGroup) recurringDateGroup.classList.add('hidden');
    const recDate = document.getElementById('recurring-date');
    if (recDate) recDate.value = '';

    // Re-filter categories based on default type (usually expense)
    filterCategoriesByType();

    if (typeof updateBudgetUI === 'function') await updateBudgetUI();
    if (typeof updateGlobalBudgetUI === 'function') await updateGlobalBudgetUI();

    transactionPage = 1;
    await renderTransactionList();
    await updateFinanceSummary();
    if (typeof renderWalletListSummary === 'function') await renderWalletListSummary();
    if (typeof updateWalletSelectOptions === 'function') await updateWalletSelectOptions();
    await initFinanceChart();
    await updateFinancialHealthScore();
}

async function renderTransactionList() {
    const listEl = document.getElementById('transaction-list');
    if (!listEl) return;

    let transactions = await getTransactions();

    // --- APPLY FILTERS ---
    const filterType = document.getElementById('filter-type')?.value || 'all';
    const filterCategory = document.getElementById('filter-category')?.value || 'all';
    const filterSearch = document.getElementById('filter-search')?.value.toLowerCase() || '';

    if (filterType !== 'all') {
        transactions = transactions.filter(t => t.type === filterType);
    }
    if (filterCategory !== 'all') {
        transactions = transactions.filter(t => t.category === filterCategory);
    }
    if (filterSearch) {
        transactions = transactions.filter(t => 
            (t.description && t.description.toLowerCase().includes(filterSearch)) ||
            (t.category && t.category.toLowerCase().includes(filterSearch))
        );
    }

    if (transactions.length === 0) {
        listEl.innerHTML = '<div class="empty-state"><p>Tidak ada transaksi yang cocok</p></div>';
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
        btn.addEventListener('click', async () => {
            if (confirm('Hapus transaksi ini?')) {
                const item = btn.closest('.transaction-item');
                await deleteTransaction(item.dataset.id);
                await renderTransactionList();
                await updateFinanceSummary();
                if (typeof renderWalletListSummary === 'function') await renderWalletListSummary();
                if (typeof updateWalletSelectOptions === 'function') await updateWalletSelectOptions();
                await initFinanceChart();
                await updateFinancialHealthScore();
            }
        });
    });
}

async function updateFinanceSummary() {
    const transactions = await getTransactions();
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const wallets = await getWallets();
    const totalWalletBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expense');
    const balanceEl = document.getElementById('total-balance');

    if (incomeEl) incomeEl.textContent = formatCurrency(income);
    if (expenseEl) expenseEl.textContent = formatCurrency(expense);
    if (balanceEl) balanceEl.textContent = formatCurrency(totalWalletBalance);
    
    // Also update dashboard if visible
    if (typeof updateDashboardStats === 'function') await updateDashboardStats();
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

async function updateGlobalBudgetUI() {
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
    editBtn.onclick = async () => {
        const current = settings.globalBudget || 0;
        const newLimit = prompt('Masukkan batasan budget harian (Rp):', current);
        if (newLimit !== null) {
            const val = parseFloat(newLimit);
            if (!isNaN(val)) {
                localStorage.setItem(STORAGE_KEYS.GLOBAL_BUDGET, val);
                await updateGlobalBudgetUI();
            }
        }
    };

    // Ensure we don't duplicate the button if it exists
    const header = card.querySelector('.card-header');
    if (header && !header.querySelector('button')) {
        header.appendChild(editBtn);
    }

    const transactions = await getTransactions();
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

function filterCategoriesByType() {
    const type = document.getElementById('transaction-type').value;
    const categorySelect = document.getElementById('transaction-category');
    if (!categorySelect) return;

    const optgroups = categorySelect.querySelectorAll('optgroup');
    optgroups.forEach(group => {
        if (type === 'income') {
            const isIncomeGroup = group.label.includes('Pemasukan') || group.label.includes('Inflow');
            group.style.display = isIncomeGroup ? '' : 'none';
        } else {
            const isExpenseGroup = group.label.includes('Pengeluaran') || group.label.includes('Outflow');
            group.style.display = isExpenseGroup ? '' : 'none';
        }
    });

    // Reset selection if the current one is now hidden
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    if (selectedOption && selectedOption.parentElement && selectedOption.parentElement.tagName === 'OPTGROUP') {
        if (selectedOption.parentElement.style.display === 'none') {
            categorySelect.value = "";
        }
    }
}
