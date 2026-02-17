// ===== JOURNAL UI =====
let currentJournal = null;
let currentAIResponse = null;
let currentMood = null;
let journalPage = 1;
const JOURNALS_PER_PAGE = 10;

function initJournalUI() {
    const journalInput = document.getElementById('journal-input');
    const charCount = document.getElementById('char-count');
    const askAIBtn = document.getElementById('ask-ai-btn');
    const closeResponseBtn = document.getElementById('close-response');
    const saveJournalBtn = document.getElementById('save-journal-btn');

    journalInput.addEventListener('input', () => {
        charCount.textContent = `${journalInput.value.length} karakter`;
    });

    const moodOptions = document.getElementById('mood-options');
    if (moodOptions) {
        moodOptions.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                moodOptions.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                currentMood = btn.dataset.mood;
            });
        });
    }

    askAIBtn.addEventListener('click', handleAskAI);

    closeResponseBtn.addEventListener('click', () => {
        document.getElementById('ai-response-section').classList.add('hidden');
    });

    saveJournalBtn.addEventListener('click', handleSaveJournal);
    initTagInput();
    renderJournalHistory();
    renderTemplates();
}

function renderTemplates() {
    const container = document.getElementById('journal-templates-container');
    if (!container) return;

    if (typeof JOURNAL_TEMPLATES === 'undefined') {
        console.warn('JOURNAL_TEMPLATES not loaded');
        return;
    }

    container.innerHTML = JOURNAL_TEMPLATES.map(t => `
        <button class="template-chip" onclick="applyTemplate('${t.id}')">
            ${t.name}
        </button>
    `).join('');
}

function applyTemplate(id) {
    const journalInput = document.getElementById('journal-input');
    const template = JOURNAL_TEMPLATES.find(t => t.id === id);

    if (!template) return;

    if (journalInput.value.trim().length > 0) {
        if (!confirm('Timpa tulisan saat ini dengan template?')) {
            return;
        }
    }

    journalInput.value = template.content;

    // Auto resize textarea
    journalInput.style.height = 'auto';
    journalInput.style.height = journalInput.scrollHeight + 'px';

    // Update char count
    const charCount = document.getElementById('char-count');
    if (charCount) charCount.textContent = `${journalInput.value.length} karakter`;
}

async function handleAskAI() {
    const journalInput = document.getElementById('journal-input');
    const text = journalInput.value.trim();

    if (!text) {
        alert('Tulis sesuatu dulu di jurnal ya!');
        return;
    }

    const loadingEl = document.getElementById('ai-loading');
    const responseSection = document.getElementById('ai-response-section');

    loadingEl.classList.remove('hidden');
    responseSection.classList.add('hidden');

    // Offline fallback
    if (!navigator.onLine) {
        const offlineResponse = {
            validation: "Kamu sedang offline, tapi refleksi tetap bisa dilakukan tanpa AI. Berikut panduan refleksi diri:",
            summary: [
                "Apa 1 hal yang kamu syukuri hari ini?",
                "Apa yang ingin kamu perbaiki besok?",
                "Bagaimana perasaanmu saat menulis ini?"
            ],
            suggestions: [
                { id: "1", text: "Tulis 3 hal yang kamu syukuri", type: "note" },
                { id: "2", text: "Tentukan 1 tindakan kecil untuk besok", type: "todo" }
            ],
            closing_question: "Setelah online, kamu bisa minta respons AI untuk analisis lebih mendalam.",
            _offline: true
        };

        currentAIResponse = offlineResponse;
        currentJournal = {
            id: generateId(),
            text: text,
            mood: currentMood || 'neutral',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            aiResponse: offlineResponse
        };

        renderAIResponse(offlineResponse);
        responseSection.classList.remove('hidden');
        loadingEl.classList.add('hidden');
        return;
    }

    try {
        const aiResponse = await getAIResponse(text);
        currentAIResponse = aiResponse;

        // Cache last AI response
        try {
            localStorage.setItem('lastAIResponse', JSON.stringify({
                response: aiResponse,
                text: text.substring(0, 100),
                timestamp: new Date().toISOString()
            }));
        } catch (e) { /* ignore storage errors */ }

        currentJournal = {
            id: generateId(),
            text: text,
            mood: currentMood || 'neutral',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            aiResponse: aiResponse
        };

        renderAIResponse(aiResponse);
        responseSection.classList.remove('hidden');
    } catch (error) {
        alert(error.message);
    } finally {
        loadingEl.classList.add('hidden');
    }
}

function renderAIResponse(response) {
    document.getElementById('ai-validation').textContent = response.validation;

    const summaryEl = document.getElementById('ai-summary');
    summaryEl.innerHTML = response.summary.map(point => `<li>${point}</li>`).join('');

    const suggestionsEl = document.getElementById('ai-suggestions');
    suggestionsEl.innerHTML = response.suggestions.map(suggestion => `
        <div class="suggestion-item" data-id="${suggestion.id}" data-type="${suggestion.type}">
            <span class="suggestion-text">${suggestion.text}</span>
            <div class="suggestion-actions">
                ${suggestion.type === 'schedule' ?
            `<button class="btn btn-small btn-primary add-schedule-btn" data-text="${suggestion.text}">📅 Jadwal</button>` :
            ''}
                ${suggestion.type === 'todo' ?
            `<button class="btn btn-small btn-primary add-todo-btn" data-text="${suggestion.text}">✓ To-Do</button>` :
            ''}
                ${suggestion.type === 'note' ?
            `<button class="btn btn-small btn-secondary">📝 Catatan</button>` :
            ''}
            </div>
        </div>
    `).join('');

    suggestionsEl.querySelectorAll('.add-schedule-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            addScheduleFromSuggestion(text);
            btn.textContent = '✓ Ditambahkan';
            btn.disabled = true;
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
        });
    });

    suggestionsEl.querySelectorAll('.add-todo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            addTodoFromSuggestion(text);
            btn.textContent = '✓ Ditambahkan';
            btn.disabled = true;
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
        });
    });

    document.getElementById('ai-closing').textContent = response.closing_question || '';
}

function handleSaveJournal() {
    if (!currentJournal) {
        alert('Tidak ada jurnal untuk disimpan');
        return;
    }

    currentJournal.tags = [...currentTags];
    saveJournal(currentJournal);

    document.getElementById('journal-input').value = '';
    document.getElementById('char-count').textContent = '0 karakter';
    document.getElementById('ai-response-section').classList.add('hidden');

    currentMood = null;
    const moodOptions = document.getElementById('mood-options');
    if (moodOptions) {
        moodOptions.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    }

    currentJournal = null;
    currentAIResponse = null;

    currentTags = [];
    renderTags();
    updateTagFilterOptions();
    renderJournalHistory();

    alert('Jurnal berhasil disimpan!');

    // Gamification
    if (typeof addXP === 'function') addXP(10, 'Jurnal Harian');
}

function renderJournalHistory() {
    const historyEl = document.getElementById('journal-history');
    let journals = getJournals();

    if (activeMoodFilter !== 'all') {
        journals = journals.filter(j => j.mood === activeMoodFilter);
    }

    if (activeTagFilter !== 'all') {
        journals = journals.filter(j => j.tags && j.tags.includes(activeTagFilter));
    }

    if (journals.length === 0) {
        historyEl.innerHTML = `
            <div class="empty-state">
                <p>Belum ada jurnal tersimpan</p>
            </div>
        `;
        return;
    }

    const visibleCount = journalPage * JOURNALS_PER_PAGE;
    const visibleJournals = journals.slice(0, visibleCount);
    const hasMore = journals.length > visibleCount;

    historyEl.innerHTML = visibleJournals.map(journal => {
        const moodEmoji = MOOD_EMOJIS[journal.mood] || '';
        const tagsHtml = journal.tags && journal.tags.length > 0
            ? `<div class="journal-tags-display">${journal.tags.map(t => `<span class="journal-tag">#${t}</span>`).join('')}</div>`
            : '';

        return `
        <div class="history-item" data-id="${journal.id}">
            <div class="history-date">
                ${moodEmoji ? `<span class="mood-indicator">${moodEmoji}</span>` : ''}
                ${formatShortDate(journal.createdAt)}
            </div>
            <div class="history-preview">${journal.text.substring(0, 100)}${journal.text.length > 100 ? '...' : ''}</div>
            ${tagsHtml}
            <button class="delete-btn" data-id="${journal.id}" title="Hapus">🗑️</button>
        </div>
    `}).join('') + (hasMore ? `
        <button class="btn-load-more" id="load-more-journals">
            Muat Lebih Banyak (${visibleCount}/${journals.length})
        </button>
    ` : '');

    // Load more
    const loadMoreBtn = document.getElementById('load-more-journals');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            journalPage++;
            renderJournalHistory();
        });
    }

    historyEl.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            const journal = journals.find(j => j.id === item.dataset.id);
            if (journal) viewJournal(journal);
        });
    });

    historyEl.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Hapus jurnal ini?')) {
                deleteJournal(btn.dataset.id);
                renderJournalHistory();
            }
        });
    });
}

function viewJournal(journal) {
    document.getElementById('journal-input').value = journal.text;
    document.getElementById('char-count').textContent = `${journal.text.length} karakter`;

    if (journal.aiResponse) {
        currentJournal = journal;
        currentAIResponse = journal.aiResponse;
        renderAIResponse(journal.aiResponse);
        document.getElementById('ai-response-section').classList.remove('hidden');
    }
}
