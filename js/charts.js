// ===== CHARTS MODULE =====
let financeChart = null;
let habitsChart = null;
let moodChart = null;

const MOOD_VALUES = {
    'great': 5,
    'good': 4,
    'neutral': 3,
    'bad': 2,
    'terrible': 1
};

const MOOD_EMOJIS = {
    'great': '😄',
    'good': '🙂',
    'neutral': '😐',
    'bad': '😔',
    'terrible': '😢'
};

function initMoodChart() {
    const ctx = document.getElementById('mood-chart');
    if (!ctx) return;

    const journals = getJournals();
    const weeklyData = getWeeklyMoodData(journals);

    if (moodChart) { moodChart.destroy(); }

    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeklyData.labels,
            datasets: [{
                label: 'Mood',
                data: weeklyData.values,
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const moodNames = ['', 'Buruk', 'Kurang Baik', 'Biasa', 'Baik', 'Sangat Baik'];
                            return moodNames[context.raw] || 'Tidak ada data';
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0, max: 5,
                    ticks: {
                        stepSize: 1, color: '#a0a0b0',
                        callback: function (value) {
                            const emojis = ['', '😢', '😔', '😐', '🙂', '😄'];
                            return emojis[value] || '';
                        }
                    },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: '#a0a0b0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

function getWeeklyMoodData(journals) {
    const labels = [];
    const values = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));

        const dayJournal = journals.find(j => {
            const journalDate = new Date(j.createdAt).toISOString().split('T')[0];
            return journalDate === dateStr;
        });

        if (dayJournal && dayJournal.mood) {
            values.push(MOOD_VALUES[dayJournal.mood] || 3);
        } else {
            values.push(null);
        }
    }

    return { labels, values };
}

let currentChartPeriod = 'month';

function initFinanceChart(period) {
    if (period) currentChartPeriod = period;

    const ctx = document.getElementById('finance-chart');
    if (!ctx) return;

    // Create filter buttons if not exists
    let filterContainer = document.getElementById('chart-filter-container');
    if (!filterContainer) {
        filterContainer = document.createElement('div');
        filterContainer.id = 'chart-filter-container';
        filterContainer.className = 'chart-filter';
        filterContainer.innerHTML = `
            <button class="chart-filter-btn ${currentChartPeriod === 'week' ? 'active' : ''}" data-period="week">Minggu</button>
            <button class="chart-filter-btn ${currentChartPeriod === 'month' ? 'active' : ''}" data-period="month">Bulan</button>
            <button class="chart-filter-btn ${currentChartPeriod === 'quarter' ? 'active' : ''}" data-period="quarter">Kuartal</button>
            <button class="chart-filter-btn ${currentChartPeriod === 'year' ? 'active' : ''}" data-period="year">Tahun</button>
        `;
        ctx.parentElement.insertBefore(filterContainer, ctx);

        filterContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.chart-filter-btn');
            if (!btn) return;
            filterContainer.querySelectorAll('.chart-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            initFinanceChart(btn.dataset.period);
        });
    } else {
        // Update active state
        filterContainer.querySelectorAll('.chart-filter-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.period === currentChartPeriod);
        });
    }

    const transactions = getTransactions();
    const chartData = getFinanceDataByPeriod(transactions, currentChartPeriod);

    if (financeChart) { financeChart.destroy(); }

    financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Pemasukan',
                    data: chartData.income,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1
                },
                {
                    label: 'Pengeluaran',
                    data: chartData.expense,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#a0a0b0' } } },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#a0a0b0' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { ticks: { color: '#a0a0b0' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

function getFinanceDataByPeriod(transactions, period) {
    const now = new Date();

    if (period === 'week') {
        // Last 7 days
        const labels = [];
        const incomeData = [];
        const expenseData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));
            const dayTx = transactions.filter(t => t.date === dateStr);
            incomeData.push(dayTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
            expenseData.push(dayTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
        }
        return { labels, income: incomeData, expense: expenseData };
    }

    if (period === 'quarter') {
        // Last 4 quarters
        const labels = [];
        const incomeData = [];
        const expenseData = [];
        for (let i = 3; i >= 0; i--) {
            const qMonth = now.getMonth() - (i * 3);
            const qStart = new Date(now.getFullYear(), qMonth, 1);
            const qEnd = new Date(now.getFullYear(), qMonth + 3, 0);
            const qLabel = `Q${Math.floor(qStart.getMonth() / 3) + 1} ${qStart.getFullYear()}`;
            labels.push(qLabel);
            const qTx = transactions.filter(t => {
                const td = new Date(t.date);
                return td >= qStart && td <= qEnd;
            });
            incomeData.push(qTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
            expenseData.push(qTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
        }
        return { labels, income: incomeData, expense: expenseData };
    }

    if (period === 'year') {
        // Last 3 years
        const labels = [];
        const incomeData = [];
        const expenseData = [];
        for (let i = 2; i >= 0; i--) {
            const year = now.getFullYear() - i;
            labels.push(String(year));
            const yearTx = transactions.filter(t => new Date(t.date).getFullYear() === year);
            incomeData.push(yearTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
            expenseData.push(yearTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
        }
        return { labels, income: incomeData, expense: expenseData };
    }

    // Default: monthly (last 6 months)
    return getMonthlyFinanceData(transactions);
}

function getMonthlyFinanceData(transactions) {
    const months = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months[key] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
        const date = new Date(t.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (months[key]) {
            if (t.type === 'income') { months[key].income += t.amount; }
            else { months[key].expense += t.amount; }
        }
    });

    const labels = Object.keys(months).map(k => {
        const [y, m] = k.split('-');
        return new Date(y, m - 1).toLocaleDateString('id-ID', { month: 'short' });
    });

    return {
        labels,
        income: Object.values(months).map(m => m.income),
        expense: Object.values(months).map(m => m.expense)
    };
}

function initHabitsChart() {
    const ctx = document.getElementById('habits-chart');
    if (!ctx) return;

    const habits = getHabits();
    const weeklyData = getWeeklyHabitData(habits);

    if (habitsChart) { habitsChart.destroy(); }

    habitsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeklyData.labels,
            datasets: [{
                label: 'Habits Completed',
                data: weeklyData.completions,
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#a0a0b0' } } },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#a0a0b0', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { ticks: { color: '#a0a0b0' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

function getWeeklyHabitData(habits) {
    const labels = [];
    const completions = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));

        let count = 0;
        habits.forEach(h => {
            if (h.completions && h.completions[dateStr]) { count++; }
        });
        completions.push(count);
    }

    return { labels, completions };
}
