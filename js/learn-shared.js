/**
 * SHARED LEARNING UTILITIES
 * Used by Physics, HSSE, Automotive, Psychology, Investment, Coding, and Pertamina Mastery.
 */

/**
 * Shows an AI-generated lesson screen with quiz.
 * @param {string} screenId - The ID of the screen section to render in.
 * @param {string} moduleName - The name of the module being learned.
 * @param {string} prompt - The AI prompt to generate content.
 * @param {function} onComplete - Callback when user marks module as complete.
 * @param {string} moduleId - (Optional) ID for caching.
 * @param {boolean} forceRefresh - (Optional) Force new generation.
 * @param {function} onBack - (Optional) Callback when user clicks back button.
 */
window.showAiLessonScreen = async function(screenId, moduleName, prompt, onComplete, moduleId = null, forceRefresh = false, onBack = null) {
    const screen = document.getElementById(screenId);
    if (!screen) return;

    // 1. Check Edit/Cache first (if not forcing refresh)
    const cacheKey = moduleId ? `lesson_cache_${moduleId}` : null;
    const editKey = moduleId ? `lesson_edit_${moduleId}` : null;
    
    if (cacheKey && !forceRefresh) {
        const edited = editKey ? await getLearningData(editKey) : null;
        const cached = await getLearningData(cacheKey);
        
        if (edited) {
            console.log(`Loading ${moduleId} from edited version...`);
            renderLessonContent(screen, moduleName, edited, onComplete, moduleId, screenId, prompt, onBack, true);
            return;
        } else if (cached) {
            console.log(`Loading ${moduleId} from cache...`);
            renderLessonContent(screen, moduleName, cached, onComplete, moduleId, screenId, prompt, onBack);
            return;
        }
    }

    // Save previous state to allow "Back" functionality
    const originalHtml = screen.innerHTML;
    
    screen.innerHTML = `
        <div class="header-back"><button class="back-btn" id="lesson-back-btn"><span class="back-icon">←</span> Kembali</button></div>
        <div class="card mt-md">
            <h2>${moduleName}</h2>
            <p class="text-muted">Materi Pelajaran AI</p>
        </div>
        <div class="card mt-md" id="lesson-content-area">
            <div class="loading-spinner" style="margin:20px auto;"></div>
            <p class="text-center text-muted">Mencari referensi & menyusun materi...</p>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.getElementById('lesson-back-btn').onclick = () => {
        if (typeof onBack === 'function') {
            onBack();
        } else {
            screen.innerHTML = originalHtml;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        document.getElementById('lesson-content-area').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key belum diatur di Pengaturan.</p>';
        return;
    }

    try {
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        };

        const text = await unifiedGeminiCall(payload);

        // Save to cache
        if (cacheKey) await saveLearningData(cacheKey, text);

        renderLessonContent(screen, moduleName, text, onComplete, moduleId, screenId, prompt, onBack);

    } catch (err) {
        console.error('AI Lesson Error:', err);
        document.getElementById('lesson-content-area').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat materi. Coba lagi nanti.</p>
        <button class="btn btn-secondary mt-sm" id="lesson-retry-btn">🔄 Coba Lagi</button>`;
        document.getElementById('lesson-retry-btn').onclick = () => {
            showAiLessonScreen(screenId, moduleName, prompt, onComplete, moduleId, true, onBack);
        };
    }
}

/**
 * Helpler to render the parsed lesson content
 */
function renderLessonContent(screen, moduleName, rawText, onComplete, moduleId, screenId, prompt, onBack = null, isEdited = false) {
    let text = rawText;
    const { quizBlocks, cleanedText } = window.extractQuizAndCleanText(rawText);
    const formattedText = window.formatAIText(cleanedText);
    
    const actionBar = (typeof window.getActionBarHTML === 'function') ? window.getActionBarHTML(moduleName, 'mastery', moduleId) : '';

    // Header with Regenerate and Edit buttons
    screen.innerHTML = `
        <div class="header-back" style="display:flex; justify-content:space-between; align-items:center;">
            <button class="back-btn" id="lesson-back-btn"><span class="back-icon">←</span> Kembali</button>
            <div style="display:flex; gap:8px;">
                <button class="btn btn-secondary btn-small" id="lesson-edit-btn">✏️ Edit</button>
                <button class="btn btn-secondary btn-small" id="lesson-regenerate-btn">🔄 Buat Ulang</button>
            </div>
        </div>
        ${actionBar}
        <div class="card mt-md">
            <h2>${moduleName}</h2>
            <p class="text-muted">Materi Pelajaran AI ${isEdited ? '(Customized)' : ''}</p>
        </div>
        <div id="lesson-content-area-container">
            <div class="card mt-md lesson-content-card" id="lesson-content-card" style="background:var(--surface);padding:20px;border-radius:12px;border:1px solid var(--border);">
                <div id="lesson-content-editable" class="${isEdited ? '' : 'formatted-ai-content'}">
                    ${isEdited ? rawText : formattedText}
                </div>
            </div>
            
            <!-- Editor Toolbar (Hidden by default) -->
            <div id="mastery-editor-toolbar" class="mastery-editor-toolbar hidden">
                <button class="editor-tool-btn" onclick="applyMasteryStyle('bold')" title="Tebal"><strong>B</strong></button>
                <button class="editor-tool-btn" onclick="applyMasteryStyle('italic')" title="Miring"><em>I</em></button>
                <button class="editor-tool-btn" onclick="applyMasteryStyle('highlight')" title="Highlight">🖍️</button>
                <button class="editor-tool-btn" onclick="document.getElementById('mastery-image-input').click()" title="Sisipkan Gambar">🖼️</button>
                <button class="editor-tool-btn" onclick="insertMasteryNoteBlock()" title="Sisipkan Catatan">📝</button>
                <div style="width:1px; background:var(--border); margin:0 5px;"></div>
                <button class="btn btn-primary btn-small" onclick="saveMasteryEdit('${moduleId}')">💾 Simpan</button>
                <input type="file" id="mastery-image-input" accept="image/*" style="display:none;" onchange="handleMasteryImageSelection(event)">
            </div>
            
            <div id="lesson-quiz-area"></div>
        </div>
        ${actionBar ? '</div>' : ''} 
    `;

    document.getElementById('lesson-edit-btn').onclick = () => {
        toggleMasteryEditMode();
    };

    document.getElementById('lesson-back-btn').onclick = () => {
        if (typeof onBack === 'function') {
            onBack();
        } else {
            window.history.back(); 
        }
    };

    document.getElementById('lesson-regenerate-btn').onclick = async () => {
        if(confirm('Materi baru akan di-generate ulang. Semua highlight dan catatan manual Anda akan hilang. Lanjutkan?')) {
            const editKey = moduleId ? `lesson_edit_${moduleId}` : null;
            if (editKey) {
                await idbDelete('learning_progress', editKey); // Or use saveLearningData(editKey, null)
            }
            showAiLessonScreen(screenId, moduleName, prompt, onComplete, moduleId, true, onBack);
        }
    };

    document.getElementById('lesson-edit-btn').onclick = toggleMasteryEditMode;

    // Build quiz HTML
    let quizHtml = '';
    if (quizBlocks.length > 0) {
        quizHtml = `<div class="card mt-md" style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;"><h3 style="color:var(--primary);">📋 Kuis Interaktif</h3>`;
        quizBlocks.forEach((q, i) => {
            const qId = `gen_quiz_${i}`;
            quizHtml += `
                <div id="${qId}" style="background:var(--surface-hover);padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid var(--border);">
                    <p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>
                    ${['a', 'b', 'c', 'd'].filter(k => q[k]).map(opt => `
                        <button class="btn btn-secondary" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:10px;font-size:0.9rem;" 
                            onclick="checkGenericAnswer('${qId}','${opt.toUpperCase()}','${q.answer}', this, '${encodeURIComponent(q.explanation || '')}')">
                            ${opt.toUpperCase()}) ${q[opt]}
                        </button>
                    `).join('')}
                    <div id="${qId}_result" style="display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:0.9rem;"></div>
                </div>
            `;
        });
        quizHtml += `<button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" id="lesson-complete-btn">✅ Selesaikan Modul (+20 XP)</button></div>`;
    } else {
        quizHtml = `<button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" id="lesson-complete-btn">✅ Selesaikan Modul (+20 XP)</button>`;
    }

    document.getElementById('lesson-quiz-area').innerHTML = quizHtml;
    
    document.getElementById('lesson-complete-btn').onclick = () => {
        if (typeof addXP === 'function') addXP(20);
        onComplete(true);
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Universal progress tracker
 */
window.completeGenericModule = async function(storageKey, moduleKey) {
    const progressRaw = await getLearningData(storageKey);
    const progress = JSON.parse(progressRaw || '{}');
    progress[moduleKey] = true;
    await saveLearningData(storageKey, JSON.stringify(progress));
    
    // Check if we should add to general progress or history
    console.log(`Module ${moduleKey} completed in ${storageKey}`);
};

/**
 * Shared answer checker
 */
window.checkGenericAnswer = function(qId, selected, correct, btnEl, encodedExp) {
    const container = document.getElementById(qId);
    const resultDiv = document.getElementById(`${qId}_result`);
    const buttons = container.querySelectorAll('button');
    const explanation = decodeURIComponent(encodedExp);

    buttons.forEach(b => { b.disabled = true; b.style.opacity = '0.7'; });

    if (selected === correct) {
        btnEl.style.background = '#38a169';
        btnEl.style.color = 'white';
        resultDiv.style.background = 'rgba(56,161,105,0.15)';
        resultDiv.style.color = '#38a169';
        resultDiv.innerHTML = `✅ <strong>Benar!</strong> ${explanation}`;
    } else {
        btnEl.style.background = '#e53e3e';
        btnEl.style.color = 'white';
        buttons.forEach(b => {
            if (b.textContent.trim().startsWith(correct + ')')) {
                b.style.background = '#38a169';
                b.style.color = 'white';
            }
        });
        resultDiv.style.background = 'rgba(229,62,62,0.15)';
        resultDiv.style.color = '#e53e3e';
        resultDiv.innerHTML = `❌ <strong>Salah.</strong> Jawaban: ${correct}. ${explanation}`;
    }
    resultDiv.style.display = 'block';
};

// ===== MASTERY EDITOR LOGIC =====

let isMasteryEditMode = false;

function toggleMasteryEditMode() {
    isMasteryEditMode = !isMasteryEditMode;
    const editable = document.getElementById('lesson-content-editable');
    const toolbar = document.getElementById('mastery-editor-toolbar');
    const editBtn = document.getElementById('lesson-edit-btn');
    
    if (isMasteryEditMode) {
        editable.contentEditable = "true";
        editable.classList.add('lesson-editable-area');
        toolbar.classList.remove('hidden');
        editBtn.textContent = '❌ Batal';
        editBtn.classList.replace('btn-secondary', 'btn-danger');
    } else {
        editable.contentEditable = "false";
        editable.classList.remove('lesson-editable-area');
        toolbar.classList.add('hidden');
        editBtn.textContent = '✏️ Edit';
        editBtn.classList.replace('btn-danger', 'btn-secondary');
        // Optional: reload from cache? 
    }
}

function applyMasteryStyle(command) {
    if (command === 'highlight') {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'lesson-highlight';
        
        try {
            range.surroundContents(span);
        } catch (e) {
            // Fallback for complex selections
            document.execCommand('backColor', false, '#fef08a');
        }
    } else {
        document.execCommand(command, false, null);
    }
}

function handleMasteryImageSelection(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'inserted-image';
        
        const selection = window.getSelection();
        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.collapse(false);
        } else {
            document.getElementById('lesson-content-editable').appendChild(img);
        }
    };
    reader.readAsDataURL(file);
}

function insertMasteryNoteBlock() {
    const div = document.createElement('div');
    div.className = 'inserted-note-block';
    div.innerHTML = 'Ketik catatan penting Anda di sini...';
    
    const selection = window.getSelection();
    if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.insertNode(div);
        range.collapse(false);
    } else {
        document.getElementById('lesson-content-editable').appendChild(div);
    }
}

async function saveMasteryEdit(moduleId) {
    const editable = document.getElementById('lesson-content-editable');
    const html = editable.innerHTML;
    
    await saveLearningData(`lesson_edit_${moduleId}`, html);
    
    alert('Perubahan berhasil disimpan!');
    toggleMasteryEditMode();
    
    // Refresh subtitle
    const subtitle = editable.closest('.card').previousElementSibling.querySelector('p');
    if (subtitle) subtitle.textContent = 'Materi Pelajaran AI (Customized)';
}

window.checkGenericAnswer = function(qId, selected, correct, btnEl, encodedExp) {
    const container = document.getElementById(qId);
    const resultDiv = document.getElementById(`${qId}_result`);
    if (!container || !resultDiv) return;
    
    const buttons = container.querySelectorAll('button');
    const explanation = decodeURIComponent(encodedExp);
    buttons.forEach(b => { b.disabled = true; b.style.opacity = '0.7'; });
    
    if (selected === correct) {
        btnEl.style.background = '#38a169'; btnEl.style.color = 'white'; btnEl.style.border = '2px solid #38a169';
        resultDiv.style.background = 'rgba(56,161,105,0.15)'; resultDiv.style.color = '#38a169';
        resultDiv.innerHTML = `✅ <strong>Benar!</strong> ${explanation}`;
    } else {
        btnEl.style.background = '#e53e3e'; btnEl.style.color = 'white'; btnEl.style.border = '2px solid #e53e3e';
        buttons.forEach(b => { if (b.textContent.trim().startsWith(correct + ')')) { b.style.background = '#38a169'; b.style.color = 'white'; b.style.border = '2px solid #38a169'; } });
        resultDiv.style.background = 'rgba(229,62,62,0.15)'; resultDiv.style.color = '#e53e3e';
        resultDiv.innerHTML = `❌ <strong>Salah.</strong> Jawaban: <strong>${correct}</strong>. ${explanation}`;
    }
    resultDiv.style.display = 'block';
};
window.toggleMasteryEditMode = toggleMasteryEditMode;
window.applyMasteryStyle = applyMasteryStyle;
window.handleMasteryImageSelection = handleMasteryImageSelection;
window.insertMasteryNoteBlock = insertMasteryNoteBlock;
window.saveMasteryEdit = saveMasteryEdit;
