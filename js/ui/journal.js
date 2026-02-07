// Journal UI module
import { getJournals, saveJournal, generateId, formatDate, formatShortDate } from '../storage.js';
import { getAIResponse } from '../ai.js';

let currentJournal = null;
let currentAIResponse = null;

export function initJournalUI() {
    const journalInput = document.getElementById('journal-input');
    const charCount = document.getElementById('char-count');
    const askAIBtn = document.getElementById('ask-ai-btn');
    const closeResponseBtn = document.getElementById('close-response');
    const saveJournalBtn = document.getElementById('save-journal-btn');

    // Character count
    journalInput.addEventListener('input', () => {
        charCount.textContent = `${journalInput.value.length} karakter`;
    });

    // Ask AI button
    askAIBtn.addEventListener('click', handleAskAI);

    // Close response
    closeResponseBtn.addEventListener('click', () => {
        document.getElementById('ai-response-section').classList.add('hidden');
    });

    // Save journal
    saveJournalBtn.addEventListener('click', handleSaveJournal);

    // Load history
    renderJournalHistory();
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

    // Show loading
    loadingEl.classList.remove('hidden');
    responseSection.classList.add('hidden');

    try {
        const aiResponse = await getAIResponse(text);
        currentAIResponse = aiResponse;

        // Create journal entry
        currentJournal = {
            id: generateId(),
            text: text,
            createdAt: new Date().toISOString(),
            aiResponse: aiResponse
        };

        // Render AI response
        renderAIResponse(aiResponse);

        // Show response section
        responseSection.classList.remove('hidden');

    } catch (error) {
        alert(error.message);
    } finally {
        loadingEl.classList.add('hidden');
    }
}

function renderAIResponse(response) {
    // Validation
    document.getElementById('ai-validation').textContent = response.validation;

    // Summary
    const summaryEl = document.getElementById('ai-summary');
    summaryEl.innerHTML = response.summary.map(point => `<li>${point}</li>`).join('');

    // Suggestions
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

    // Add event listeners to suggestion buttons
    suggestionsEl.querySelectorAll('.add-schedule-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            window.addScheduleFromSuggestion(text);
            btn.textContent = '✓ Ditambahkan';
            btn.disabled = true;
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
        });
    });

    suggestionsEl.querySelectorAll('.add-todo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            window.addTodoFromSuggestion(text);
            btn.textContent = '✓ Ditambahkan';
            btn.disabled = true;
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
        });
    });

    // Closing question
    document.getElementById('ai-closing').textContent = response.closing_question || '';
}

function handleSaveJournal() {
    if (!currentJournal) {
        alert('Tidak ada jurnal untuk disimpan');
        return;
    }

    saveJournal(currentJournal);

    // Clear input
    document.getElementById('journal-input').value = '';
    document.getElementById('char-count').textContent = '0 karakter';
    document.getElementById('ai-response-section').classList.add('hidden');

    // Reset current journal
    currentJournal = null;
    currentAIResponse = null;

    // Refresh history
    renderJournalHistory();

    alert('Jurnal berhasil disimpan!');
}

export function renderJournalHistory() {
    const historyEl = document.getElementById('journal-history');
    const journals = getJournals();

    if (journals.length === 0) {
        historyEl.innerHTML = `
            <div class="empty-state">
                <p>Belum ada jurnal tersimpan</p>
            </div>
        `;
        return;
    }

    historyEl.innerHTML = journals.slice(0, 5).map(journal => `
        <div class="history-item" data-id="${journal.id}">
            <div class="history-date">${formatShortDate(journal.createdAt)}</div>
            <div class="history-preview">${journal.text.substring(0, 100)}${journal.text.length > 100 ? '...' : ''}</div>
        </div>
    `).join('');

    // Add click handlers to view journal
    historyEl.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const journal = journals.find(j => j.id === item.dataset.id);
            if (journal) {
                viewJournal(journal);
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
