// ===== NAVIGATION =====
let currentHub = 'dashboard';

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const backBtn = document.getElementById('header-back-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetScreen = btn.dataset.screen;
            currentHub = targetScreen; // Remember the hub

            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            showScreen(targetScreen);

            // Hide back button when clicking bottom nav
            if (backBtn) {
                backBtn.classList.add('hidden');
                backBtn.style.display = 'none'; // Ensure CSS hide
            }
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', handleBackButton);
    }
}

function showScreen(targetScreen) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        if (screen.id === `${targetScreen}-screen`) {
            screen.classList.add('active');
        }
    });

    // Sub-screen initializers
    if (targetScreen === 'dashboard') {
        updateDashboardStats();
        updateDashboardReminders();
        initMoodChart();
    } else if (targetScreen === 'todo-today') {
        if (typeof initTodoToday === 'function') initTodoToday();
    } else if (targetScreen === 'planner') {
        renderScheduleList();
        if (typeof renderCalendar === 'function') renderCalendar();
    } else if (targetScreen === 'kanban') {
        if (typeof renderKanbanBoard === 'function') renderKanbanBoard();
    } else if (targetScreen === 'journal') {
        renderJournalHistory();
    } else if (targetScreen === 'finance') {
        renderTransactionList();
        updateFinanceSummary();
        initFinanceChart();
    } else if (targetScreen === 'habits') {
        renderHabitsTodayList();
        renderAllHabitsList();
        initHabitsChart();
    } else if (targetScreen === 'goals') {
        renderGoalsList();
        updateGoalsStats();
    } else if (targetScreen === 'epls') {
        if (typeof initEplsHabitTracker === 'function') initEplsHabitTracker();
        if (typeof updateEplsProgressUI === 'function') updateEplsProgressUI();
    } else if (targetScreen === 'physics') {
        if (typeof updatePhysicsProgressUI === 'function') updatePhysicsProgressUI();
    } else if (targetScreen === 'hsse') {
        if (typeof updateHsseProgressUI === 'function') updateHsseProgressUI();
    } else if (targetScreen === 'automotive') {
        if (typeof updateAutoProgressUI === 'function') updateAutoProgressUI();
    }
}

// Called from HTML onclick in Hub grids
function navigateToSubscreen(targetScreen) {
    showScreen(targetScreen);

    // Show back button
    const backBtn = document.getElementById('header-back-btn');
    if (backBtn) {
        backBtn.classList.remove('hidden');
        backBtn.style.display = 'flex';
    }
}

// Shortcut: Navigate to HSE Rig and auto-switch to a specific tab (e.g. 'inspection', 'pjsm')
function navigateToRigTab(tabName) {
    navigateToSubscreen('hse-rig');
    // Auto-click the requested tab after a short delay for rendering
    setTimeout(() => {
        const tabBtn = document.querySelector(`.rig-tab[onclick*="'${tabName}'"]`);
        if (tabBtn) {
            tabBtn.click();
        } else {
            // Fallback: call switchRigChapter directly
            if (typeof switchRigChapter === 'function') switchRigChapter(tabName, null);
        }
    }, 100);
}

// Shortcut: Navigate to English O&G and scroll to JSA & PTW section
function navigateToJSAGenerator() {
    navigateToSubscreen('english-hse');
    setTimeout(() => {
        const jsaSection = document.getElementById('jsa-doc-type') || document.querySelector('#generate-jsa-btn');
        if (jsaSection) {
            jsaSection.closest('.card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 200);
}

function handleBackButton() {
    // Return to the last clicked Hub
    showScreen(currentHub);

    // Hide back button
    const backBtn = document.getElementById('header-back-btn');
    if (backBtn) {
        backBtn.classList.add('hidden');
        backBtn.style.display = 'none';
    }
}

// ===== SETTINGS =====
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const modal = document.getElementById('settings-modal');

    settingsBtn.addEventListener('click', showSettings);

    closeSettingsBtn.addEventListener('click', hideSettings);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideSettings();
    });

    // Save City Button
    const cityInput = document.getElementById('city-input');
    const saveCityBtn = document.getElementById('save-city-btn');

    if (saveCityBtn && cityInput) {
        // Load saved city
        const savedCity = localStorage.getItem(STORAGE_KEYS.PRAYER_CITY);
        if (savedCity) cityInput.value = savedCity;

        saveCityBtn.addEventListener('click', async () => {
            const city = cityInput.value.trim();
            if (!city) {
                alert('Nama kota tidak boleh kosong!');
                return;
            }

            localStorage.setItem(STORAGE_KEYS.PRAYER_CITY, city);

            // Refresh Prayer Times
            if (typeof initPrayerTimes === 'function') {
                saveCityBtn.innerHTML = '⏳';
                await initPrayerTimes();
                saveCityBtn.innerHTML = '💾';
            }

            alert(`Lokasi diubah ke ${city}. Jadwal sholat diperbarui.`);
        });
    }

    const saveGlobalBudgetBtn = document.getElementById('save-global-budget-btn');
    if (saveGlobalBudgetBtn) {
        saveGlobalBudgetBtn.addEventListener('click', () => {
            const dailyBudget = parseInt(document.getElementById('global-daily-budget-input').value);
            if (dailyBudget && dailyBudget > 0) {
                localStorage.setItem(STORAGE_KEYS.GLOBAL_BUDGET, dailyBudget);
                if (typeof updateGlobalBudgetUI === 'function') updateGlobalBudgetUI();
                alert(`Budget harian disimpan: ${formatCurrency(dailyBudget)}`);
            } else {
                localStorage.removeItem(STORAGE_KEYS.GLOBAL_BUDGET);
                if (typeof updateGlobalBudgetUI === 'function') updateGlobalBudgetUI();
                alert('Budget harian dihapus (tidak terbatas).');
            }
        });
    }

    saveSettingsBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        const dailyBudget = parseInt(document.getElementById('global-daily-budget-input').value);

        if (apiKey) {
            saveApiKey(apiKey);
        }

        if (dailyBudget && dailyBudget > 0) {
            localStorage.setItem(STORAGE_KEYS.GLOBAL_BUDGET, dailyBudget);
        } else {
            localStorage.removeItem(STORAGE_KEYS.GLOBAL_BUDGET);
        }

        if (typeof updateGlobalBudgetUI === 'function') {
            updateGlobalBudgetUI();
        }

        alert('Pengaturan berhasil disimpan!');
        hideSettings();
    });

    // Save Cloud Config
    const saveCloudBtn = document.getElementById('save-cloud-config-btn');
    if (saveCloudBtn) {
        saveCloudBtn.addEventListener('click', saveCloudConfig);
    }

    // Load existing API key
    apiKeyInput.value = getApiKey();

    const savedDailyBudget = localStorage.getItem(STORAGE_KEYS.GLOBAL_BUDGET);
    if (savedDailyBudget) {
        document.getElementById('global-daily-budget-input').value = savedDailyBudget;
    }

    // Export Data
    document.getElementById('export-data-btn').addEventListener('click', exportAllData);

    // Import Data
    document.getElementById('import-data-btn').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input').addEventListener('change', importAllData);

    // Encrypt/Decrypt
    document.getElementById('encrypt-data-btn').addEventListener('click', encryptAllData);
    document.getElementById('decrypt-data-btn').addEventListener('click', decryptAllData);

    // Clear All Data
    document.getElementById('clear-all-data-btn').addEventListener('click', clearAllData);

    // Delete Cloud Account
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', deleteCloudAccount);
    }

    updateEncryptionStatus();
}

function showSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
    document.getElementById('api-key-input').value = getApiKey();
    updateEncryptionStatus();
}

function hideSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

// ===== GLOBAL SEARCH =====
function initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }

        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.global-search')) {
            searchResults.classList.add('hidden');
        }
    });

    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            performSearch(searchInput.value.trim());
        }
    });
}

function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    const queryLower = query.toLowerCase();
    let results = [];

    const journals = getJournals();
    journals.forEach(journal => {
        if (journal.text.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Jurnal', icon: '📝',
                title: formatShortDate(journal.createdAt),
                preview: journal.text.substring(0, 80),
                screen: 'journal', id: journal.id
            });
        }
    });

    const goals = getGoals();
    goals.forEach(goal => {
        if (goal.title.toLowerCase().includes(queryLower) ||
            (goal.notes && goal.notes.toLowerCase().includes(queryLower))) {
            results.push({
                type: 'Goal', icon: '🎯',
                title: goal.title,
                preview: goal.completed ? 'Tercapai' : `Progress: ${goal.currentProgress || 0}/${goal.target} ${goal.unit}`,
                screen: 'goals', id: goal.id
            });
        }
    });

    const tasks = getTasks();
    tasks.forEach(task => {
        if (task.title.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Task', icon: '📋',
                title: task.title,
                preview: task.done ? '✅ Selesai' : '⏳ Belum selesai',
                screen: 'planner', id: task.id
            });
        }
    });

    const schedules = getSchedules();
    schedules.forEach(schedule => {
        if (schedule.title.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Jadwal', icon: '📅',
                title: schedule.title,
                preview: formatShortDate(schedule.datetime),
                screen: 'planner', id: schedule.id
            });
        }
    });

    const habits = getHabits();
    habits.forEach(habit => {
        if (habit.name.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Habit', icon: '✅',
                title: habit.name,
                preview: `🔥 ${habit.streak || 0} hari streak`,
                screen: 'habits', id: habit.id
            });
        }
    });

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">Tidak ada hasil untuk "' + query + '"</div>';
    } else {
        searchResults.innerHTML = results.slice(0, 10).map(result => `
            <div class="search-result-item" data-screen="${result.screen}" data-id="${result.id}">
                <div class="search-result-type">${result.icon} ${result.type}</div>
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-preview">${result.preview}</div>
            </div>
        `).join('');

        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                navigateToScreen(screen);
                searchResults.classList.add('hidden');
                document.getElementById('global-search-input').value = '';
            });
        });
    }

    searchResults.classList.remove('hidden');
}

function navigateToScreen(screenName) {
    const navBtn = document.querySelector(`.nav-btn[data-screen="${screenName}"]`);
    if (navBtn) {
        navBtn.click();
    }
}
