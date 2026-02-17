// ===== MOOD CALENDAR MODULE =====
let currentMoodDate = new Date();

function initMoodCalendar() {
    renderMoodCalendar(currentMoodDate);

    const prevBtn = document.getElementById('prev-month-btn');
    const nextBtn = document.getElementById('next-month-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => changeMonth(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeMonth(1));

    initYearInPixels();
}

function changeMonth(offset) {
    currentMoodDate.setMonth(currentMoodDate.getMonth() + offset);
    renderMoodCalendar(currentMoodDate);
}

function renderMoodCalendar(date) {
    const monthYear = document.getElementById('calendar-month-year');
    const calendarGrid = document.getElementById('mood-calendar-grid');

    if (!monthYear || !calendarGrid) return;

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    calendarGrid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const journals = getJournals();
    const moodMap = new Map();

    journals.forEach(j => {
        if (j.date && j.mood) {
            const jDate = new Date(j.date);
            const dateStr = `${jDate.getFullYear()}-${String(jDate.getMonth() + 1).padStart(2, '0')}-${String(jDate.getDate()).padStart(2, '0')}`;
            moodMap.set(dateStr, j.mood);
        }
    });

    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyCell);
    }

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.textContent = day;

        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            cell.classList.add('today');
        }

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (moodMap.has(dateStr)) {
            const mood = moodMap.get(dateStr);
            cell.classList.add(`mood-${mood}`);
            cell.title = `Mood: ${mood}`;
        }

        calendarGrid.appendChild(cell);
    }
}

// ===== FINANCE UPGRADES MODULE =====
function initFinanceUpgrades() {
    const globalBudgetInput = document.getElementById('global-daily-budget-input');
    const saveGlobalBudgetBtn = document.getElementById('save-global-budget-btn');

    if (globalBudgetInput) {
        const savedLimit = localStorage.getItem(STORAGE_KEYS.GLOBAL_BUDGET);
        if (savedLimit) globalBudgetInput.value = savedLimit;

        globalBudgetInput.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            if (val > 0) {
                localStorage.setItem(STORAGE_KEYS.GLOBAL_BUDGET, val);
                updateGlobalBudgetUI();
            } else {
                localStorage.removeItem(STORAGE_KEYS.GLOBAL_BUDGET);
                updateGlobalBudgetUI();
            }
        });

        if (saveGlobalBudgetBtn) {
            saveGlobalBudgetBtn.addEventListener('click', () => {
                const val = parseInt(globalBudgetInput.value);
                if (val > 0) {
                    localStorage.setItem(STORAGE_KEYS.GLOBAL_BUDGET, val);
                    updateGlobalBudgetUI();
                    alert('Budget harian global tersimpan!');
                } else {
                    localStorage.removeItem(STORAGE_KEYS.GLOBAL_BUDGET);
                    updateGlobalBudgetUI();
                    alert('Budget harian global dihapus!');
                }
            });
        }
    }

    const recurringToggle = document.getElementById('is-recurring-transaction');
    const recurringDateGroup = document.getElementById('recurring-date-group');

    if (recurringToggle && recurringDateGroup) {
        recurringToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                recurringDateGroup.classList.remove('hidden');
            } else {
                recurringDateGroup.classList.add('hidden');
            }
        });
    }

    checkRecurringTransactions();
    updateGlobalBudgetUI();
}

function updateGlobalBudgetUI() {
    const budgetCard = document.getElementById('global-budget-card');
    const budgetText = document.getElementById('global-budget-text');
    const budgetProgress = document.getElementById('global-budget-progress');

    const limit = parseInt(localStorage.getItem(STORAGE_KEYS.GLOBAL_BUDGET) || 0);
    if (!budgetCard) return;

    if (limit <= 0) {
        budgetCard.classList.remove('hidden');
        budgetText.textContent = "(Atur di Settings)";
        budgetProgress.style.width = '0%';
        return;
    }

    budgetCard.classList.remove('hidden');

    const transactions = getTransactions();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const todayExpense = transactions
        .filter(t => t.type === 'expense' && t.date === todayStr)
        .reduce((sum, t) => sum + t.amount, 0);

    const percentage = Math.min((todayExpense / limit) * 100, 100);

    budgetText.textContent = `${formatCurrency(todayExpense)} / ${formatCurrency(limit)}`;
    budgetProgress.style.width = `${percentage}%`;

    budgetProgress.className = 'progress-fill';
    if (percentage < 50) {
        budgetProgress.classList.add('bg-success');
    } else if (percentage < 80) {
        budgetProgress.classList.add('bg-warning');
    } else {
        budgetProgress.classList.add('bg-danger');
    }
}

function checkRecurringTransactions() {
    const recurringData = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECURRING) || '[]');
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const todayStr = today.toISOString().split('T')[0];

    let hasUpdates = false;
    let newTransactionsCount = 0;

    recurringData.forEach(item => {
        if (currentDay >= item.day && item.lastRunMonth !== currentMonth) {
            const newTx = {
                id: Date.now() + Math.random(),
                date: todayStr,
                type: item.type,
                amount: item.amount,
                category: item.category,
                description: `[Rutin] ${item.name}`,
                walletId: item.walletId || 'main'
            };

            const transactions = getTransactions();
            transactions.push(newTx);
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

            item.lastRunMonth = currentMonth;
            hasUpdates = true;
            newTransactionsCount++;
        }
    });

    if (hasUpdates) {
        localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurringData));
        alert(`${newTransactionsCount} Transaksi Rutin berhasil dicatat otomatis! 🔄`);
        if (typeof updateGlobalBudgetUI === 'function') updateGlobalBudgetUI();
    }
}

function saveRecurringTransaction(name, amount, type, category, walletId, day) {
    const recurringData = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECURRING) || '[]');

    const newItem = {
        id: Date.now(),
        name: name || 'Transaksi Rutin',
        amount: amount,
        type: type,
        category: category,
        walletId: walletId,
        day: day,
        lastRunMonth: new Date().getMonth() + 1
    };

    recurringData.push(newItem);
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurringData));
}

function updateBudgetUI() {
    if (typeof updateGlobalBudgetUI === 'function') {
        updateGlobalBudgetUI();
    }
}

// ===== ISLAMIC PRODUCTIVITY MODULE =====
let prayerInterval = null;

function initPrayerTimes() {
    const cityInput = document.getElementById('city-input');
    const saveCityBtn = document.getElementById('save-city-btn');

    const savedCity = localStorage.getItem(STORAGE_KEYS.PRAYER_CITY) || 'Jakarta';
    if (cityInput) cityInput.value = savedCity;

    fetchPrayerTimes(savedCity);

    if (saveCityBtn) {
        saveCityBtn.addEventListener('click', () => {
            const newCity = cityInput.value.trim();
            if (newCity) {
                localStorage.setItem(STORAGE_KEYS.PRAYER_CITY, newCity);
                fetchPrayerTimes(newCity);
                alert(`Lokasi diubah ke ${newCity}. Mengambil jadwal salat...`);
            }
        });
    }

    if (prayerInterval) clearInterval(prayerInterval);
    prayerInterval = setInterval(updatePrayerCountdown, 1000);
}

async function fetchPrayerTimes(city) {
    const todayStr = new Date().toISOString().split('T')[0];
    const cachedData = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAYER_DATA) || '{}');
    const cacheKey = `${city}-${todayStr}`;

    if (cachedData.key === cacheKey && cachedData.timings) {
        renderPrayerUI(cachedData.timings, city);
        return;
    }

    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=20`);
        const data = await response.json();

        if (data.code === 200) {
            const timings = data.data.timings;
            const cacheObj = { key: cacheKey, timings: timings };
            localStorage.setItem(STORAGE_KEYS.PRAYER_DATA, JSON.stringify(cacheObj));
            renderPrayerUI(timings, city);
        } else {
            const locEl = document.getElementById('prayer-location');
            if (locEl) locEl.textContent = 'Error mengambil data';
        }
    } catch (error) {
        console.error('Network Error:', error);
        const locEl = document.getElementById('prayer-location');
        if (locEl) locEl.textContent = 'Offline / Error';
    }
}

function renderPrayerUI(timings, city) {
    const locationEl = document.getElementById('prayer-location');
    const listEl = document.getElementById('prayer-list-mini');

    if (locationEl) locationEl.textContent = city;

    const mainPrayers = {
        'Subuh': timings.Fajr,
        'Dzuhur': timings.Dhuhr,
        'Ashar': timings.Asr,
        'Maghrib': timings.Maghrib,
        'Isya': timings.Isha
    };

    if (listEl) {
        listEl.innerHTML = Object.entries(mainPrayers).map(([name, time]) => `
            <div class="prayer-time-item">
                <div class="prayer-name">${name}</div>
                <div class="prayer-time">${time}</div>
            </div>
        `).join('');
    }

    updateNextPrayer(mainPrayers);
}

function updateNextPrayer(timings) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let nextPrayerName = 'Besok';
    let nextPrayerTime = '';
    let minDiff = Infinity;

    const parseTime = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    for (const [name, timeStr] of Object.entries(timings)) {
        const pMod = parseTime(timeStr);
        let diff = pMod - currentTime;

        if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextPrayerName = name;
            nextPrayerTime = timeStr;
        }
    }

    if (nextPrayerName === 'Besok') {
        nextPrayerName = 'Subuh';
        nextPrayerTime = timings['Subuh'];
    }

    const nameEl = document.getElementById('next-prayer-name');
    const timeEl = document.getElementById('next-prayer-time');

    if (nameEl) nameEl.textContent = nextPrayerName;
    if (timeEl) timeEl.textContent = nextPrayerTime;

    window.currentNextPrayer = { name: nextPrayerName, time: nextPrayerTime };
    updatePrayerCountdown();
}

function updatePrayerCountdown() {
    if (!window.currentNextPrayer) return;

    const { time } = window.currentNextPrayer;
    if (!time) return;

    const now = new Date();
    const [h, m] = time.split(':').map(Number);

    let target = new Date();
    target.setHours(h, m, 0, 0);

    if (target < now) {
        target.setDate(target.getDate() + 1);
    }

    const diff = target - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const countdownEl = document.getElementById('next-prayer-countdown');
    if (countdownEl) {
        countdownEl.textContent = `-${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// ===== YEAR IN PIXELS MODULE =====
let currentPixelsYear = new Date().getFullYear();

function initYearInPixels() {
    const btn = document.getElementById('year-view-btn');
    const modal = document.getElementById('year-in-pixels-modal');
    const closeBtn = document.getElementById('close-year-pixels');
    const prevYearBtn = document.getElementById('prev-year-btn');
    const nextYearBtn = document.getElementById('next-year-btn');

    if (btn) {
        btn.addEventListener('click', () => {
            renderYearInPixels(currentPixelsYear);
            modal.classList.remove('hidden');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (prevYearBtn) {
        prevYearBtn.addEventListener('click', () => {
            currentPixelsYear--;
            renderYearInPixels(currentPixelsYear);
        });
    }

    if (nextYearBtn) {
        nextYearBtn.addEventListener('click', () => {
            currentPixelsYear++;
            renderYearInPixels(currentPixelsYear);
        });
    }

    // Close on click outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }
}

function renderYearInPixels(year) {
    const grid = document.getElementById('year-pixels-matrix');
    const title = document.getElementById('year-pixels-title');

    if (!grid || !title) return;

    title.textContent = year;
    grid.innerHTML = '';

    const journals = getJournals();
    const moodMap = new Map();

    journals.forEach(j => {
        if (j.date && j.mood) {
            moodMap.set(j.date, j.mood);
        }
    });

    // 1. Header Row (Month Names)
    // First cell empty (corner)
    const corner = document.createElement('div');
    grid.appendChild(corner);

    const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    monthNames.forEach(m => {
        const header = document.createElement('div');
        header.className = 'pixel-header-col';
        header.textContent = m;
        grid.appendChild(header);
    });

    // 2. Grid Rows (Days 1-31)
    for (let day = 1; day <= 31; day++) {
        // Day Number Column
        const dayHeader = document.createElement('div');
        dayHeader.className = 'pixel-header-row';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);

        // 12 Months Columns
        for (let month = 0; month < 12; month++) {
            const cell = document.createElement('div');
            cell.className = 'pixel-cell';

            // Check if date is valid (e.g., Feb 30 doesn't exist)
            const date = new Date(year, month, day);
            if (date.getMonth() !== month) {
                cell.style.background = 'transparent'; // Invalid date
                cell.style.pointerEvents = 'none';
            } else {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                if (moodMap.has(dateStr)) {
                    const mood = moodMap.get(dateStr);
                    cell.classList.add(`mood-${mood}`);
                    cell.title = `${dateStr}: ${mood}`;
                } else {
                    cell.title = dateStr;
                }
            }
            grid.appendChild(cell);
        }
    }
}
