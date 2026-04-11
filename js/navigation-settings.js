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
        if (screen.id === 'rig-3d-viewer-screen' && screen.classList.contains('active') && targetScreen !== 'rig-3d-viewer') {
            if (typeof stopRig3DViewer === 'function') stopRig3DViewer();
        }
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
    } else if (targetScreen === 'psychology') {
        if (typeof updatePsyProgressUI === 'function') updatePsyProgressUI();
    } else if (targetScreen === 'investment') {
        if (typeof updateInvProgressUI === 'function') updateInvProgressUI();
    } else if (targetScreen === 'coding') {
        if (typeof updateCodeProgressUI === 'function') updateCodeProgressUI();
    } else if (targetScreen === 'pertamina') {
        if (typeof updatePtmProgressUI === 'function') updatePtmProgressUI();
    } else if (targetScreen === 'library') {
        if (typeof refreshLibraryUI === 'function') refreshLibraryUI();
    } else if (targetScreen === 'workout-tracker') {
        if (typeof initWorkoutTracker === 'function') initWorkoutTracker();
    } else if (targetScreen === 'oxford-vocab') {
        if (typeof renderOxfordWordList === 'function') renderOxfordWordList();
        if (typeof updateOxfordProgressBars === 'function') updateOxfordProgressBars();
    } else if (targetScreen === 'jmp-generator') {
        // No special entry logic needed yet
    } else if (targetScreen === 'rig-3d-viewer') {
        if (typeof initRig3DViewer === 'function') initRig3DViewer();
    } else if (targetScreen === 'report-collage') {
        if (typeof initReportCollage === 'function') initReportCollage();
    } else if (targetScreen === 'pro-collage') {
        if (typeof initProCollage === 'function') initProCollage();
    } else if (targetScreen === 'hse-wag-generator') {
        if (typeof initHSEDailyReport === 'function') initHSEDailyReport();
    } else if (targetScreen === 'hse-center') {
        // Logic for HSE center if needed
        currentHub = 'hse-center'; 
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

function navigateToJMPGenerator() {
    navigateToSubscreen('jmp-generator');
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

// ===== SETTINGS & UI SCALING =====
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings');

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
        
        closeSettingsBtn?.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    // UI Scaling Logic
    initUIScaling();

    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const modal = document.getElementById('settings-modal');

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

        const widgetTimeToggle = document.getElementById('widget-time-toggle');
        const widgetReminderTime = document.getElementById('widget-reminder-time');
        
        if (widgetTimeToggle && widgetReminderTime) {
            localStorage.setItem('jurnal_ai_widget_enabled', widgetTimeToggle.checked);
            localStorage.setItem('jurnal_ai_widget_time', widgetReminderTime.value);

            if (widgetTimeToggle.checked) {
                if (typeof requestNotificationPermission === 'function') requestNotificationPermission();
                if (typeof subscribeToWebPush === 'function') subscribeToWebPush();
            }
        }

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

    // Load widget settings
    const widgetTimeToggle = document.getElementById('widget-time-toggle');
    const widgetReminderTime = document.getElementById('widget-reminder-time');
    const widgetTimeSetting = document.getElementById('widget-time-setting');

    if (widgetTimeToggle && widgetReminderTime) {
        const enabled = localStorage.getItem('jurnal_ai_widget_enabled') !== 'false'; // Default true
        const timeVal = localStorage.getItem('jurnal_ai_widget_time') || '06:00';
        
        widgetTimeToggle.checked = enabled;
        widgetReminderTime.value = timeVal;
        if (!enabled && widgetTimeSetting) widgetTimeSetting.classList.add('hidden');

        widgetTimeToggle.addEventListener('change', (e) => {
            if (widgetTimeSetting) widgetTimeSetting.classList.toggle('hidden', !e.target.checked);
        });
    }

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

    // Test Notification
    const testNotifBtn = document.getElementById('test-notif-btn');
    if (testNotifBtn) {
        testNotifBtn.addEventListener('click', () => {
            if (typeof generateDailyLockscreenWidget === 'function') {
                generateDailyLockscreenWidget();
            } else if (typeof sendPremiumNotification === 'function') {
                sendPremiumNotification('🚀 Jurnal AI: Fokus & Produktif!', {
                    body: 'Notifikasi interaktif Anda sudah aktif. Gunakan aplikasi untuk memaksimalkan hari Anda.'
                });
            } else {
                alert('Modul notifikasi belum siap.');
            }
        });
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

/**
 * UI SCALING - "Ctrl +/-" for your App
 */
let appScale = 1.0;

function initUIScaling() {
    const scaleDownBtn = document.getElementById('ui-scale-down-btn');
    const scaleUpBtn = document.getElementById('ui-scale-up-btn');
    const scaleLabel = document.getElementById('ui-scale-label');

    // Load saved scale
    const savedScale = localStorage.getItem('app-ui-scale');
    if (savedScale) {
        appScale = parseFloat(savedScale);
        applyUIScale();
    }

    if (scaleDownBtn && scaleUpBtn) {
        scaleDownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (appScale > 0.7) {
                appScale -= 0.1;
                applyUIScale();
                saveUIScale();
            }
        });

        scaleUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (appScale < 1.5) {
                appScale += 0.1;
                applyUIScale();
                saveUIScale();
            }
        });
    }
}

function applyUIScale() {
    // 1. Set CSS Variable
    document.documentElement.style.setProperty('--app-scale', appScale);
    
    // 2. Update Label
    const scaleLabel = document.getElementById('ui-scale-label');
    if (scaleLabel) {
        scaleLabel.innerText = Math.round(appScale * 100) + '%';
    }
    
    console.log(`📏 UI Scale applied: ${appScale}`);
}

function saveUIScale() {
    localStorage.setItem('app-ui-scale', appScale.toFixed(1));
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

        searchTimeout = setTimeout(async () => {
            await performSearch(query);
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.global-search')) {
            searchResults.classList.add('hidden');
        }
    });

    searchInput.addEventListener('focus', async () => {
        if (searchInput.value.trim().length >= 2) {
            await performSearch(searchInput.value.trim());
        }
    });
}

async function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    const queryLower = query.toLowerCase();
    let results = [];

    const journals = await getJournals();
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

    const goals = await getGoals();
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

    const tasks = await getTasks();
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

    const schedules = await getSchedules();
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

    const habits = await getHabits();
    habits.forEach(habit => {
        if (habit.name.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Habit', icon: '🌱',
                title: habit.name,
                preview: `🔥 ${habit.streak || 0} hari streak`,
                screen: 'habits', id: habit.id
            });
        }
    });

    const transactions = await getTransactions();
    transactions.forEach(t => {
        if ((t.description && t.description.toLowerCase().includes(queryLower)) || 
            (t.category && t.category.toLowerCase().includes(queryLower))) {
            results.push({
                type: 'Transaksi', icon: t.type === 'income' ? '💰' : '💸',
                title: t.description || t.category,
                preview: `${t.type === 'income' ? '+' : '-'} Rp ${Number(t.amount).toLocaleString()}`,
                screen: 'finance', id: t.id
            });
        }
    });

    const wallets = await getWallets();
    wallets.forEach(w => {
        if (w.name.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Dompet', icon: '💳',
                title: w.name,
                preview: `Saldo: Rp ${Number(w.balance).toLocaleString()}`,
                screen: 'finance', id: w.id
            });
        }
    });

    const libraryItems = await getSavedGenerations();
    libraryItems.forEach(item => {
        if ((item.title && item.title.toLowerCase().includes(queryLower)) || 
            (item.type && item.type.toLowerCase().includes(queryLower))) {
            results.push({
                type: 'Library', icon: '📚',
                title: item.title,
                preview: `Tipe: ${item.type}`,
                screen: 'library', id: item.id
            });
        }
    });

    const vocab = await getVocabBank();
    vocab.forEach(v => {
        if (v.word.toLowerCase().includes(queryLower) || 
            v.meaning.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'Vocab', icon: '📖',
                title: v.word,
                preview: v.meaning,
                screen: 'english-hse', id: v.id
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
    // 1. Show the screen
    showScreen(screenName);

    // 2. Sync Bottom Nav (if it's a main hub)
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.screen === screenName);
    });

    // 3. Handle Back Button visibility
    const backBtn = document.getElementById('header-back-btn');
    const mainHubs = ['activity-hub', 'learning-hub', 'finance', 'workout-tracker', 'dashboard', 'jarvis'];
    
    if (backBtn) {
        if (!mainHubs.includes(screenName)) {
            // It's a sub-screen, show back button
            backBtn.classList.remove('hidden');
            backBtn.style.display = 'flex';
        } else {
            // It's a main hub, hide back button
            backBtn.classList.add('hidden');
            backBtn.style.display = 'none';
        }
    }
}
