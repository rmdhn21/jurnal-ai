/**
 * JS Lesson Tools - Shared utilities for AI Mastery Systems
 * Handles PDF, Summary, Voice, Presentation, and Poster features.
 */

window.lessonTools = {
    // 1. VOICEOVER / TTS
    speak: function(selector, lang = 'id-ID') {
        const el = document.querySelector(selector);
        if (!el) return;
        
        window.speechSynthesis.cancel();
        
        let tempEl = document.createElement('div');
        tempEl.innerHTML = el.innerHTML;
        tempEl.querySelectorAll('.no-print, .loading-spinner, button, [style*="display: none"]').forEach(e => e.remove());
        
        const rawText = tempEl.innerText.trim();
        if (!rawText) return;

        let hasStarted = false;
        const startSpeaking = () => {
            if (hasStarted) return;
            hasStarted = true;
            
            // Force resume in case it's paused
            window.speechSynthesis.resume();

            const utterance = new SpeechSynthesisUtterance(rawText);
            utterance.lang = lang;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const voice = voices.find(v => v.lang.startsWith(lang));
                if (voice) utterance.voice = voice;
            }

            utterance.onstart = () => console.log(`🔊 Mulai membaca dalam ${lang}...`);
            utterance.onerror = (e) => {
                if (e.error === 'interrupted') return; // Normal when resetting
                console.error("❌ TTS Error:", e);
            };
            utterance.onend = () => console.log("🏁 Selesai membaca.");

            window.speechSynthesis.speak(utterance);
        };

        // Wait for voices if empty, with a strict single-fire guard
        if (window.speechSynthesis.getVoices().length === 0) {
            const onVoices = () => {
                if (window.speechSynthesis.getVoices().length > 0) {
                    window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
                    startSpeaking();
                }
            };
            window.speechSynthesis.addEventListener('voiceschanged', onVoices);
            setTimeout(startSpeaking, 800); // Absolute fallback
        } else {
            startSpeaking();
        }
    },
    
    stopSpeech: function() {
        window.speechSynthesis.cancel();
    },

    // 2. SUMMARY (Requires AI Call)
    generateSummary: async function(system, sourceSelector, targetId) {
        const sourceEl = document.querySelector(sourceSelector);
        if (!sourceEl) return;
        
        const targetEl = document.getElementById(targetId);
        targetEl.innerHTML = '<div class="loading-spinner" style="margin:10px auto;"></div><p class="text-center text-muted">📝 Menyusun rangkuman...</p>';
        
        const lessonText = sourceEl.innerText.split('📋 Kuis')[0]; // Remove quiz
        const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
        if (!apiKey) return;

        const prompt = `Ringkaslah materi berikut menjadi rangkuman yang sangat padat, jelas, dan poin-poin penting saja (maksimal 3 paragraf). Gunakan Bahasa Indonesia yang profesional.
        
        MATERI:
        ${lessonText}`;

        try {
            const response = await fetch(`${window.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent'}?key=${apiKey}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
            });
            if (response.status === 429) throw new Error('Quota Exceeded: Mohon tunggu sejenak.');
            if (!response.ok) throw new Error('API Error');
            const result = await response.json();
            const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Gagal merangkum.';
            targetEl.innerHTML = `<div style="background:var(--surface-hover);padding:15px;border-radius:10px;border-left:4px solid var(--primary);"><h4 style="margin-top:0;">📋 Rangkuman Cepat</h4>${window.formatAIText(summary)}</div>`;
        } catch(e) { targetEl.innerHTML = '<p class="text-danger">❌ Gagal merangkum.</p>'; }
    },

    // 3. PDF EXPORT (Improved Print)
    exportPDF: function(title, selector) {
        const content = document.querySelector(selector).innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; line-height: 1.6; padding: 40px; color: #333; }
                    h2, h3, h4 { color: #2563eb; }
                    .no-print { display: none; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <div id="content">${content}</div>
                <script>
                    // Remove buttons and quiz interaction from PDF if they exist
                    document.querySelectorAll('button').forEach(b => b.remove());
                    // Wait for images to load then print
                    window.onload = () => { window.print(); window.close(); };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    // 4. (REMOVED) PRESENTATION / SLIDE VIEW
    // 5. (REMOVED) POSTER VIEW

    // 6. INTERACTIVE MIND-MAP (Markmap)
    openMindMap: async function(title, selector, system, moduleId, forceRegenerate = false) {
        const el = document.querySelector(selector);
        if (!el) return;
        
        const cacheKey = `cache_mm_${system}_${moduleId}`;
        const cachedMarkdown = localStorage.getItem(cacheKey);

        const modalId = 'mindmap-modal';
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'mastery-modal';
            modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#0f172a;z-index:20000;display:flex;flex-direction:column;padding:20px;padding-top: calc(env(safe-area-inset-top) + 20px);overflow:hidden;";
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;color:white;z-index:20001;background:rgba(30,41,59,0.5);padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);position:sticky;top:0;">
                <h3 style="margin:0;font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">🧠 Mind-Map: ${title}</h3>
                <div style="display:flex;gap:8px;">
                    <button class="btn btn-secondary btn-small" style="padding:8px 12px;border-radius:20px;" onclick="lessonTools.openMindMap('${title.replace(/'/g, "\\'")}', '${selector}', '${system}', '${moduleId}', true)">🔄</button>
                    <button class="btn btn-ai btn-small" id="save-mindmap-btn" style="background:var(--secondary);padding:8px 12px;border-radius:20px;" onclick="window.saveMindmapToLibrary('${title.replace(/'/g, "\\'")}')">💾</button>
                    <button class="btn btn-secondary btn-small" style="padding:8px 12px;border-radius:20px;" onclick="this.closest('#mindmap-modal').remove()">✕ Tutup</button>
                </div>
            </div>
            <div id="mindmap-container" style="flex:1;background:rgba(255,255,255,0.03);border-radius:20px;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,0.1);box-shadow:inset 0 0 50px rgba(0,0,0,0.5);">
                <svg id="markmap-svg" style="width:100%;height:100%;"></svg>
                <div id="mindmap-loading" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        `;

        if (cachedMarkdown && !forceRegenerate) {
            console.log('Using cached Mind-Map');
            setTimeout(() => {
                document.getElementById('mindmap-loading')?.remove();
                this.renderMarkmap(cachedMarkdown);
                window.currentMindmapMarkdown = cachedMarkdown;
            }, 300);
            return;
        }

        const lessonText = el.innerText.split('📋 Kuis')[0];
        const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
        if (!apiKey) return;

        const prompt = `Buatlah struktur Mind-Map yang LENGKAB dan MENDALAM dari materi di bawah.
        Format output WAJIB dalam Markdown Outline (hanya level judul #, ##, ###, dan list - ).
        
        MATERI:
        ${lessonText}`;

        try {
            const response = await fetch(`${window.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent'}?key=${apiKey}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
            });
            const result = await response.json();
            const markdown = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            localStorage.setItem(cacheKey, markdown);
            document.getElementById('mindmap-loading')?.remove();
            this.renderMarkmap(markdown);
            window.currentMindmapMarkdown = markdown;
        } catch(e) {
            console.error('Mindmap Error:', e);
            document.getElementById('mindmap-container').innerHTML = '<p class="text-danger p-md">❌ Gagal memuat Peta Konsep.</p>';
        }
    },

    renderMarkmap: function(markdown) {
        if (!window.markmap) {
            console.error('Markmap library not loaded');
            return;
        }
        
        const { Transformer, Markmap, loadCSS, loadJS } = window.markmap;
        const transformer = new Transformer();
        const { root, features } = transformer.transform(markdown);
        const { styles, scripts } = transformer.getUsedAssets(features);
        
        if (styles) loadCSS(styles);
        if (scripts) loadJS(scripts, { getMarkmap: () => window.markmap });
        
        const mm = Markmap.create('#markmap-svg', {
            autoFit: true,
            duration: 500,
            paddingX: 16,
            maxWidth: 300,
            initialExpandLevel: 2
        }, root);

        window.resetMindmapZoom = () => mm.rescale(1);
    },

    // 7. AI FLASHCARDS
    openFlashcards: async function(title, selector, system, moduleId, forceRegenerate = false) {
        const el = document.querySelector(selector);
        if (!el) return;

        const cacheKey = `cache_fc_${system}_${moduleId}`;
        const cachedJSON = localStorage.getItem(cacheKey);

        const modalId = 'flashcards-modal';
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'mastery-modal';
            modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.98);z-index:20000;display:flex;flex-direction:column;padding:20px;padding-top: calc(env(safe-area-inset-top) + 20px);overflow:hidden;";
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;color:white;z-index:20001;background:rgba(30,41,59,0.5);padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);position:sticky;top:0;">
                <h3 style="margin:0;font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">🗂️ Flashcards: ${title}</h3>
                <div style="display:flex;gap:8px;">
                    <button class="btn btn-secondary btn-small" style="padding:8px 12px;border-radius:20px;" onclick="lessonTools.openFlashcards('${title.replace(/'/g, "\\'")}', '${selector}', '${system}', '${moduleId}', true)">🔄</button>
                    <button class="btn btn-ai btn-small" id="save-flashcards-btn" style="background:var(--secondary);padding:8px 12px;border-radius:20px;" onclick="window.saveFlashcardsToLibrary('${title.replace(/'/g, "\\'")}')">💾</button>
                    <button class="btn btn-secondary btn-small" style="padding:8px 12px;border-radius:20px;" onclick="this.closest('#flashcards-modal').remove()">✕ Tutup</button>
                </div>
            </div>
            <div id="flashcards-container" style="flex:1;display:flex;align-items:center;justify-content:center;perspective:1000px;">
                <div class="loading-spinner"></div>
            </div>
            <div id="flashcards-controls" style="display:none;justify-content:center;gap:20px;padding:20px;">
                <button class="btn btn-secondary" id="fc-prev">⬅️</button>
                <button class="btn btn-primary" id="fc-flip">🔄 Balik</button>
                <button class="btn btn-secondary" id="fc-next">➡️</button>
            </div>
        `;

        if (cachedJSON && !forceRegenerate) {
            console.log('Using cached Flashcards');
            try {
                const cards = JSON.parse(cachedJSON);
                setTimeout(() => {
                    this.renderFlashcards(cards);
                    window.currentFlashcardsData = cards;
                }, 300);
                return;
            } catch(e) { console.warn('Cache corrupted for FC'); }
        }

        const lessonText = el.innerText.split('📋 Kuis')[0];
        const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
        if (!apiKey) return;

        const prompt = `Buatlah 10 kartu hapalan (Flashcards) dari materi berikut.
        Format output JSON murni saja: [{"front": "Pertanyaan", "back": "Jawaban"}, ...].
        
        MATERI:
        ${lessonText}`;

        try {
            const response = await fetch(`${window.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent'}?key=${apiKey}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
            });
            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text.replace(/```json|```/g, '').trim();
            const cards = JSON.parse(jsonText);
            
            localStorage.setItem(cacheKey, jsonText);
            window.currentFlashcardsData = cards;
            this.renderFlashcards(cards);
        } catch(e) {
            document.getElementById('flashcards-container').innerHTML = '<p class="text-danger">❌ Gagal memuat Flashcards.</p>';
        }
    },

    renderFlashcards: function(cards) {
        let currentIndex = 0;
        const container = document.getElementById('flashcards-container');
        const controls = document.getElementById('flashcards-controls');
        controls.style.display = 'flex';
        controls.style.gap = '15px';
        
        const updateCard = () => {
            const card = cards[currentIndex];
            container.innerHTML = `
                <div class="flashcard-inner" id="fc-card-inner" style="width:100%; max-width:450px; height:300px; cursor:pointer;" onclick="this.classList.toggle('flipped')">
                    <div class="flashcard-front" style="background:linear-gradient(135deg, #1e293b, #334155); border:1px solid rgba(255,255,255,0.1); box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); display:flex; flex-direction:column; padding:40px; text-align:center; justify-content:center;">
                        <div style="position:absolute; top:20px; left:20px; font-size:0.75rem; color:var(--primary); font-weight:600; text-transform:uppercase; letter-spacing:1px;">Question ${currentIndex + 1} / ${cards.length}</div>
                        <div style="font-size:1.6rem; font-weight:700; color:white; line-height:1.4; margin-bottom:20px;">${card.front}</div>
                        <div style="position:absolute; bottom:20px; width:100%; left:0; font-size:0.8rem; color:#94a3b8; opacity:0.6;">Tap to flip 🔄</div>
                    </div>
                    <div class="flashcard-back" style="background:linear-gradient(135deg, #0f172a, #1e293b); border:1px solid var(--primary); box-shadow:0 0 30px rgba(59,130,246,0.2); display:flex; flex-direction:column; padding:40px; text-align:center; justify-content:center;">
                        <div style="position:absolute; top:20px; left:20px; font-size:0.75rem; color:var(--success); font-weight:600; text-transform:uppercase; letter-spacing:1px;">Answer</div>
                        <div style="font-size:1.2rem; line-height:1.6; color:#e2e8f0;">${card.back}</div>
                        <div style="position:absolute; bottom:20px; width:100%; left:0; font-size:0.8rem; color:var(--primary); opacity:0.8;">Tap to go back ↩️</div>
                    </div>
                </div>
            `;
        };

        const btnStyle = "padding:12px 25px; border-radius:30px; font-weight:600; transition:all 0.3s ease; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);";
        document.getElementById('fc-flip').style.display = 'none'; // Replaced by card click
        document.getElementById('fc-prev').style = btnStyle;
        document.getElementById('fc-next').style = btnStyle;

        document.getElementById('fc-next').onclick = (e) => {
            e.stopPropagation();
            if (currentIndex < cards.length - 1) { 
                currentIndex++; 
                container.style.opacity = '0';
                setTimeout(() => { updateCard(); container.style.opacity = '1'; }, 200);
            }
        };
        document.getElementById('fc-prev').onclick = (e) => {
            e.stopPropagation();
            if (currentIndex > 0) { 
                currentIndex--; 
                container.style.opacity = '0';
                setTimeout(() => { updateCard(); container.style.opacity = '1'; }, 200);
            }
        };

        container.style.transition = 'opacity 0.2s ease';
        updateCard();
    }
};

// Injection Helper for the Action Bar
window.getActionBarHTML = function(title, system, moduleId) {
    const lang = system === 'epls' ? 'en-US' : 'id-ID';
    return `
    <div class="action-bar no-print" style="background:var(--surface-hover);padding:10px;border-radius:12px;margin-bottom:20px;display:flex;flex-wrap:wrap;gap:8px;border:1px solid var(--border);">
        <button class="btn btn-secondary" style="font-size:0.8rem;padding:6px 12px;" onclick="lessonTools.speak('#lesson-body', '${lang}')">🔊 Baca</button>
        <button class="btn btn-secondary" style="font-size:0.8rem;padding:6px 12px;" onclick="lessonTools.exportPDF('${title.replace(/'/g, "\\'")}', '#lesson-body')">📄 PDF</button>
        <button class="btn btn-secondary" style="font-size:0.8rem;padding:6px 12px;" onclick="lessonTools.generateSummary('${system}', '#lesson-body', 'lesson-summary-box')">📝 Summary</button>
        <button class="btn btn-primary" style="font-size:0.8rem;padding:6px 12px;" onclick="lessonTools.openMindMap('${title.replace(/'/g, "\\'")}', '#lesson-body', '${system}', '${moduleId}')">🧠 Mind-Map</button>
        <button class="btn btn-primary" style="font-size:0.8rem;padding:6px 12px;" onclick="lessonTools.openFlashcards('${title.replace(/'/g, "\\'")}', '#lesson-body', '${system}', '${moduleId}')">🗂️ Flashcards</button>
        <button class="btn btn-ai" id="save-to-lib-btn" style="font-size:0.8rem;padding:6px 12px;background:var(--secondary);color:white;border:none;" onclick="saveCurrentViewToLibrary('${title.replace(/'/g, "\\'")}', '#lesson-body', '${system}')">💾 Simpan</button>
    </div>
    <div id="lesson-summary-box" class="no-print" style="margin-bottom:15px;"></div>
    <div id="lesson-body">`;
};

// --- SHARED HELPERS FOR STABILITY & FORMATTING ---
window.formatAIText = function(text) {
    const codeBlocks = [];
    // 1. Extract code blocks first to protect them
    let processedText = text.replace(/```([\s\S]*?)```/g, (match, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push(`<pre style="background:#1e293b;padding:15px;border-radius:12px;overflow-x:auto;border:1px solid #334155;margin:20px 0;font-family:'Fira Code', monospace;font-size:0.85rem;color:#e2e8f0;box-shadow:inset 0 2px 4px rgba(0,0,0,0.3);"><code style="background:none;padding:0;color:inherit;">${code.trim()}</code></pre>`);
        return placeholder;
    });

    // 2. Advanced Technical Rendering (Tables & Math)
    
    // 2a. Markdown Tables
    processedText = processedText.replace(/(^\|.*\|$\n?)+/gm, (match) => {
        const rows = match.trim().split('\n');
        if (rows.length < 2) return match;
        
        let html = '<div style="overflow-x:auto;margin:20px 0;border-radius:12px;border:1px solid var(--border);"><table style="width:100%;border-collapse:collapse;font-size:0.9rem;background:var(--surface);">';
        
        rows.forEach((row, i) => {
            const cols = row.split('|').filter(c => c.trim().length > 0 || row.indexOf('|') !== row.lastIndexOf('|')).map(c => c.trim());
            if (i === 1 && row.includes('---')) return; // Skip separator line
            
            const cellTag = i === 0 ? 'th' : 'td';
            const cellStyle = i === 0 
                ? 'background:var(--primary);color:white;padding:12px;text-align:left;font-weight:600;' 
                : 'padding:10px;border-bottom:1px solid var(--border);color:var(--text);';
            
            html += '<tr>';
            cols.forEach(col => {
                html += `<${cellTag} style="${cellStyle}">${col}</${cellTag}>`;
            });
            html += '</tr>';
        });
        
        html += '</table></div>';
        return html;
    });

    // 2b. Math & LaTeX Symbols (Simplified but Effective)
    processedText = processedText
        .replace(/\\\((.*?)\\\)/g, '$1') // Strip \( \)
        .replace(/\\\[([\s\S]*?)\\\]/g, '$1') // Strip \[ \]
        .replace(/\$(.*?)\$/g, '$1') // Strip $ $
        .replace(/\\text\{(.*?)\}/g, '$1') // Strip \text{...}
        .replace(/\\times/g, '&times;')
        .replace(/\\Delta/g, '&Delta;')
        .replace(/\\cdot/g, '&bull;')
        .replace(/\\alpha/g, '&alpha;')
        .replace(/\\beta/g, '&beta;')
        .replace(/\\gamma/g, '&gamma;')
        .replace(/\\phi/g, '&phi;')
        .replace(/\\theta/g, '&theta;')
        .replace(/\\pi/g, '&pi;')
        .replace(/\\omega/g, '&omega;')
        .replace(/\\mu/g, '&mu;')
        .replace(/\\rho/g, '&rho;')
        .replace(/\\sigma/g, '&sigma;')
        .replace(/\\lambda/g, '&lambda;')
        .replace(/\\epsilon/g, '&epsilon;')
        .replace(/\\eta/g, '&eta;')
        .replace(/\\tau/g, '&tau;')
        .replace(/\\approx/g, '&approx;')
        .replace(/\\neq/g, '&ne;')
        .replace(/\\le/g, '&le;')
        .replace(/\\ge/g, '&ge;')
        // Superscripts & Subscripts (Standard and Curly Braces)
        .replace(/\^\{([\s\S]*?)\}/g, '<sup>$1</sup>')
        .replace(/\_\{([\s\S]*?)\}/g, '<sub>$1</sub>')
        .replace(/(\^)([0-9a-zA-Z\+\-\*\/]+)/g, '<sup>$2</sup>')
        .replace(/(\_)([0-9a-zA-Z]+)/g, '<sub>$2</sub>');

    // 3. Rich Formatting logic (Standard Markdown)
    processedText = processedText
        // Headers with professional styling
        .replace(/^# (.*$)/gim, '<h2 style="color:var(--primary);margin:30px 0 15px;font-size:1.8rem;border-left:5px solid var(--primary);padding-left:15px;line-height:1.2;">$1</h2>')
        .replace(/^## (.*$)/gim, '<h3 style="color:var(--primary);margin:25px 0 12px;font-size:1.5rem;display:flex;align-items:center;gap:10px;">$1</h3>')
        .replace(/^### (.*$)/gim, '<h4 style="color:var(--text);margin:20px 0 10px;font-size:1.2rem;font-weight:600;opacity:0.9;">$1</h4>')
        
        // Bold and Horizontal Rules
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--primary);font-weight:700;">$1</strong>')
        .replace(/^---$/gm, '<hr style="border:0;height:1px;background:linear-gradient(to right, transparent, var(--border), transparent);margin:30px 0;">')
        
        // Lists (Unordered)
        .replace(/^\s*[-*]\s+(.*)$/gim, '<div style="display:flex;gap:10px;margin-bottom:8px;padding-left:10px;"><span style="color:var(--primary);">•</span><span>$1</span></div>')
        
        // Numbered Lists
        .replace(/^\s*(\d+)\.\s+(.*)$/gim, '<div style="display:flex;gap:10px;margin-bottom:8px;padding-left:10px;"><span style="color:var(--primary);font-weight:bold;">$1.</span><span>$2</span></div>')
        
        // Blockquotes / Cards for Tip/Info
        .replace(/^> (.*$)/gim, '<div style="background:var(--surface-hover);border-left:4px solid var(--primary);padding:15px;margin:20px 0;border-radius:0 12px 12px 0;font-style:italic;color:var(--text);opacity:0.9;">$1</div>');

    // 4. Final Polish: Newlines (Avoid breaking tags)
    // We only replace newlines that are NOT inside a tag
    processedText = processedText.trim();
    
    // 5. Re-insert code blocks
    codeBlocks.forEach((html, i) => {
        processedText = processedText.replace(`__CODE_BLOCK_${i}__`, html);
    });

    return `<div style="line-height:1.7;font-size:1.05rem;color:var(--text);white-space:pre-line;">${processedText}</div>`;
};

window.extractQuizAndCleanText = function(text) {
    const quizBlocks = [];
    const blockRegex = /\[QUIZ\]([\s\S]*?)\[\/QUIZ\]/g;
    const cleanedText = text.replace(blockRegex, (_, block) => {
        const qParts = block.split(/Pertanyaan:\s*/i);
        qParts.forEach(part => {
            if (!part.trim()) return;
            const lines = part.trim().split('\n');
            const q = lines[0].trim();
            const a = part.match(/^A[\)\.]\s*(.*)/mi);
            const b = part.match(/^B[\)\.]\s*(.*)/mi);
            const c = part.match(/^C[\)\.]\s*(.*)/mi);
            const d = part.match(/^D[\)\.]\s*(.*)/mi);
            const ans = part.match(/Jawaban:\s*([A-D])/i);
            const exp = part.match(/Penjelasan:\s*([\s\S]*?)$/i);
            if (q && ans) {
                quizBlocks.push({
                    q: q,
                    a: a?.[1]?.trim() || '', b: b?.[1]?.trim() || '', c: c?.[1]?.trim() || '', d: d?.[1]?.trim() || '',
                    answer: ans[1].trim().toUpperCase(),
                    explanation: exp?.[1]?.trim() || ''
                });
            }
        });
        return '';
    });
    return { quizBlocks, cleanedText };
};

// Global helper to save ANY AI-generated view to the library
window.saveCurrentViewToLibrary = async function(title, selector, category) {
    const element = document.querySelector(selector);
    if (!element) {
        alert("Gagal menemukan konten untuk disimpan.");
        return;
    }

    const content = element.innerHTML;
    const item = {
        title: title || "Tanpa Judul",
        content: content,
        category: category || "General",
        type: "ai_generated_lesson",
        timestamp: new Date().toISOString()
    };

    if (typeof saveGeneration === 'function') {
        await saveGeneration(item);
        
        // Find the button to give feedback
        // Use a generic approach since this might be called from multiple places
        const btns = document.querySelectorAll('button');
        let targetBtn = null;
        btns.forEach(b => {
            if (b.innerText.includes('Simpan') || b.id === 'save-to-lib-btn') {
                // If there are multiple, try to find the one visible/closest
                if (b.getBoundingClientRect().width > 0) targetBtn = b;
            }
        });

        if (targetBtn) {
            const originalText = targetBtn.innerHTML;
            targetBtn.innerHTML = '✅ Disimpan';
            targetBtn.style.background = 'var(--success)';
            targetBtn.disabled = true;
            setTimeout(() => {
                targetBtn.innerHTML = originalText;
                targetBtn.style.background = '';
                targetBtn.disabled = false;
            }, 3000);
        } else {
            alert("✅ Berhasil disimpan ke Perpustakaan AI!");
        }
    } else {
        alert("Fitur penyimpanan belum siap.");
    }
};

window.saveMindmapToLibrary = async function(title) {
    if (!window.currentMindmapMarkdown) return;
    
    const item = {
        title: `Mind-Map: ${title}`,
        content: window.currentMindmapMarkdown,
        category: "Mind-Map",
        type: "mindmap",
        timestamp: new Date().toISOString()
    };
    
    await saveGeneration(item);
    const btn = document.getElementById('save-mindmap-btn');
    if (btn) {
        btn.innerHTML = '✅ Disimpan';
        btn.disabled = true;
    }
};

window.saveFlashcardsToLibrary = async function(title) {
    if (!window.currentFlashcardsData) return;
    
    const item = {
        title: `Flashcards: ${title}`,
        content: JSON.stringify(window.currentFlashcardsData), // Save as JSON string
        category: "Flashcards",
        type: "flashcards",
        timestamp: new Date().toISOString()
    };
    
    await saveGeneration(item);
    const btn = document.getElementById('save-flashcards-btn');
    if (btn) {
        btn.innerHTML = '✅ Disimpan';
        btn.disabled = true;
    }
};
