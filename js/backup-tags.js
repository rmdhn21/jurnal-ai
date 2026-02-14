// ===== BACKUP & RESTORE =====
function initBackupRestore() {
    const exportBtn = document.getElementById('export-data-btn');
    const importBtn = document.getElementById('import-data-btn');
    const fileInput = document.getElementById('import-file-input');

    if (exportBtn) exportBtn.addEventListener('click', exportData);

    if (importBtn) {
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importData(e.target.files[0]);
            }
        });
    }
}

function exportData() {
    const data = {
        journals: getJournals(),
        goals: getGoals(),
        tasks: getTasks(),
        schedules: getSchedules(),
        habits: getHabits(),
        wallets: getWallets(),
        transactions: getTransactions(),
        settings: getSettings(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `jurnal-ai-backup-${formatShortDate(new Date()).replace(/ /g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            if (!data.exportedAt) {
                throw new Error('Format file backup tidak valid');
            }

            if (confirm(`Restore data dari backup tanggal ${formatShortDate(data.exportedAt)}? Data saat ini akan ditimpa.`)) {
                if (data.journals) localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(data.journals));
                if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
                if (data.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
                if (data.schedules) localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(data.schedules));
                if (data.habits) localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data.habits));
                if (data.wallets) localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(data.wallets));
                if (data.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
                if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));

                alert('Data berhasil direstore! Halaman akan direfresh.');
                window.location.reload();
            }
        } catch (error) {
            alert('Gagal membaca file backup: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ===== TAGGING SYSTEM =====
let currentTags = [];
let activeTagFilter = 'all';
let activeMoodFilter = 'all';

function initTagInput() {
    const tagInput = document.getElementById('tag-input');
    const tagList = document.getElementById('journal-tags');

    if (!tagInput || !tagList) return;

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.value.trim().replace(/,/g, '');
            if (tag && !currentTags.includes(tag)) {
                currentTags.push(tag);
                renderTags();
                tagInput.value = '';
            }
        }
    });

    tagList.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-delete')) {
            const tag = e.target.dataset.tag;
            currentTags = currentTags.filter(t => t !== tag);
            renderTags();
        }
    });

    const tagFilter = document.getElementById('tag-filter');
    const moodFilter = document.getElementById('mood-filter');

    if (tagFilter) {
        tagFilter.addEventListener('change', (e) => {
            activeTagFilter = e.target.value;
            renderActiveFilters();
            renderJournalHistory();
        });
    }

    if (moodFilter) {
        moodFilter.addEventListener('change', (e) => {
            activeMoodFilter = e.target.value;
            renderActiveFilters();
            renderJournalHistory();
        });
    }

    updateTagFilterOptions();
}

function renderTags() {
    const tagList = document.getElementById('journal-tags');
    if (!tagList) return;

    tagList.innerHTML = currentTags.map(tag => `
        <span class="tag-pill">
            #${tag}
            <span class="tag-delete" data-tag="${tag}">×</span>
        </span>
    `).join('');
}

function updateTagFilterOptions() {
    const tagFilter = document.getElementById('tag-filter');
    if (!tagFilter) return;

    const journals = getJournals();
    const allTags = new Set();
    journals.forEach(j => {
        if (j.tags && Array.isArray(j.tags)) {
            j.tags.forEach(t => allTags.add(t));
        }
    });

    const currentSelection = tagFilter.value;

    tagFilter.innerHTML = '<option value="all">Semua Tags</option>' +
        Array.from(allTags).sort().map(tag =>
            `<option value="${tag}">${tag}</option>`
        ).join('');

    tagFilter.value = currentSelection;
}

function renderActiveFilters() {
    const container = document.getElementById('active-filters');
    if (!container) return;

    let html = '';

    if (activeMoodFilter !== 'all') {
        const moodLabels = {
            'great': '😄 Sangat Baik',
            'good': '🙂 Baik',
            'neutral': '😐 Biasa',
            'bad': '😔 Kurang Baik',
            'terrible': '😢 Buruk'
        };
        html += `
            <span class="filter-badge">
                ${moodLabels[activeMoodFilter] || activeMoodFilter}
                <span class="filter-badge-remove" onclick="clearFilter('mood')">×</span>
            </span>
        `;
    }

    if (activeTagFilter !== 'all') {
        html += `
            <span class="filter-badge">
                #${activeTagFilter}
                <span class="filter-badge-remove" onclick="clearFilter('tag')">×</span>
            </span>
        `;
    }

    container.innerHTML = html;
}

function clearFilter(type) {
    if (type === 'mood') {
        activeMoodFilter = 'all';
        document.getElementById('mood-filter').value = 'all';
    } else if (type === 'tag') {
        activeTagFilter = 'all';
        document.getElementById('tag-filter').value = 'all';
    }
    renderActiveFilters();
    renderJournalHistory();
}
