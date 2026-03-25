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
 */
async function showAiLessonScreen(screenId, moduleName, prompt, onComplete) {
    const screen = document.getElementById(screenId);
    if (!screen) return;

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
        screen.innerHTML = originalHtml;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        document.getElementById('lesson-content-area').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key belum diatur di Pengaturan.</p>';
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
            })
        });

        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        let text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Gagal menghasilkan materi.';

        // Parse quiz blocks [QUIZ] ... [/QUIZ] or just [QUIZ]
        const quizBlocks = [];
        // Support both [QUIZ]...[/QUIZ] and just [QUIZ] at the end
        const quizRegex = /\[QUIZ\]([\s\S]*?)(\[\/QUIZ\]|$)/g;
        text = text.replace(quizRegex, (_, block) => {
            const lines = block.trim().split('\n');
            let currentQ = null;
            
            lines.forEach(line => {
                line = line.trim();
                if (line.match(/^\d+\./)) {
                    if (currentQ) quizBlocks.push(currentQ);
                    currentQ = { q: line.replace(/^\d+\.\s*/, ''), a: '', b: '', c: '', d: '', answer: '', explanation: '' };
                } else if (line.startsWith('A.')) currentQ.a = line.replace(/^A\.\s*/, '');
                else if (line.startsWith('B.')) currentQ.b = line.replace(/^B\.\s*/, '');
                else if (line.startsWith('C.')) currentQ.c = line.replace(/^C\.\s*/, '');
                else if (line.startsWith('D.')) currentQ.d = line.replace(/^D\.\s*/, '');
                else if (line.toLowerCase().startsWith('jawaban:')) {
                    const ans = line.match(/[A-D]/i);
                    if (ans) currentQ.answer = ans[0].toUpperCase();
                } else if (line.toLowerCase().startsWith('penjelasan:')) {
                    currentQ.explanation = line.replace(/^penjelasan:\s*/i, '');
                }
            });
            if (currentQ) quizBlocks.push(currentQ);
            return '';
        });

        // Basic Markdown to HTML
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                   .replace(/^### (.*$)/gim, '<h4 style="color:var(--primary);margin-top:15px;">$1</h4>')
                   .replace(/^## (.*$)/gim, '<h3 style="color:var(--primary);margin-top:20px;">$1</h3>')
                   .replace(/^# (.*$)/gim, '<h2 style="color:var(--primary);margin-top:20px;">$1</h2>')
                   .replace(/\n/g, '<br>');

        let quizHtml = '';
        if (quizBlocks.length > 0) {
            quizHtml = `<div style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;"><h3 style="color:var(--primary);">📋 Kuis Interaktif</h3>`;
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
            quizHtml += `
                <button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" id="lesson-complete-btn">
                    ✅ Selesaikan Modul (+20 XP)
                </button>
            </div>`;
        } else {
            quizHtml = `<button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" id="lesson-complete-btn">✅ Selesaikan Modul (+20 XP)</button>`;
        }

        const formattedText = window.formatAIText(text);
        document.getElementById('lesson-content-area').innerHTML = `
            <div style="background:var(--surface);padding:20px;border-radius:12px;border:1px solid var(--border);">
                ${formattedText}
            </div>
            ${quizHtml}`;
        
        document.getElementById('lesson-complete-btn').onclick = () => {
            if (typeof addXP === 'function') addXP(20);
            onComplete(true);
        };

    } catch (err) {
        console.error('AI Lesson Error:', err);
        document.getElementById('lesson-content-area').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat materi. Coba lagi nanti.</p>
        <button class="btn btn-secondary mt-sm" onclick="showAiLessonScreen('${screenId}', '${moduleName}', '${prompt.replace(/'/g, "\\'")}', ${onComplete})">🔄 Coba Lagi</button>`;
    }
}

/**
 * Universal progress tracker
 */
window.completeGenericModule = function(storageKey, moduleKey) {
    const progress = JSON.parse(localStorage.getItem(storageKey) || '{}');
    progress[moduleKey] = true;
    localStorage.setItem(storageKey, JSON.stringify(progress));
    
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
