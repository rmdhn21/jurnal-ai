// english-hse.js - Logic for English Migas & HSE Feature

let roleplayChatHistory = [];

// Text-to-Speech Utility
window.playPronunciation = function (text, lang = 'en-US') {
    if (!('speechSynthesis' in window)) {
        alert("Browser Anda tidak mendukung fitur suara (Text-to-Speech).");
        return;
    }
    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    // Clean up text (remove markdown formatting)
    const cleanText = text.replace(/\*\*/g, '').replace(/_/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for clearer learning pronunciation
    window.speechSynthesis.speak(utterance);
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if on English HSE screen
    const generateVocabBtn = document.getElementById('generate-vocab-btn');
    if (generateVocabBtn) {
        generateVocabBtn.addEventListener('click', generateDailyVocab);

        // Load initial vocab when tab is opened
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetScreen = e.target.getAttribute('data-screen');
                if (targetScreen === 'english-hse') {
                    const vocabContent = document.getElementById('hse-vocab-content');
                    if (vocabContent.innerHTML.includes('Loading')) {
                        generateDailyVocab();
                    }
                }
            });
        });
    }

    // Roleplay controls
    const startBtn = document.getElementById('start-roleplay-btn');
    const stopBtn = document.getElementById('stop-roleplay-btn');
    const sendBtn = document.getElementById('roleplay-send-btn');
    const inputField = document.getElementById('roleplay-input');
    const micBtn = document.getElementById('roleplay-mic-btn');

    if (startBtn) startBtn.addEventListener('click', startRoleplay);
    if (stopBtn) stopBtn.addEventListener('click', stopRoleplay);
    if (sendBtn) sendBtn.addEventListener('click', sendRoleplayMessage);
    if (micBtn) micBtn.addEventListener('click', toggleRoleplayMic);
    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendRoleplayMessage();
        });
    }

    // Report Assistant
    const translateBtn = document.getElementById('translate-report-btn');
    if (translateBtn) translateBtn.addEventListener('click', translateHseReport);

    // Vocab Bank features
    const saveVocabBtn = document.getElementById('save-vocab-btn');
    const startQuizBtn = document.getElementById('start-vocab-quiz-btn');
    const closeQuizBtn = document.getElementById('close-quiz-btn');

    // Listening Case Features
    const generateListeningBtn = document.getElementById('generate-listening-btn');
    const playListeningBtn = document.getElementById('play-listening-btn');
    const showTranscriptBtn = document.getElementById('show-transcript-btn');

    if (saveVocabBtn) saveVocabBtn.addEventListener('click', saveCurrentVocab);
    if (startQuizBtn) startQuizBtn.addEventListener('click', startVocabQuiz);
    if (closeQuizBtn) closeQuizBtn.addEventListener('click', closeVocabQuiz);

    if (generateListeningBtn) generateListeningBtn.addEventListener('click', generateListeningCase);
    if (playListeningBtn) playListeningBtn.addEventListener('click', playListeningAudio);
    if (showTranscriptBtn) showTranscriptBtn.addEventListener('click', toggleListeningTranscript);

    // JSA & PTW Generator Features
    const generateJsaBtn = document.getElementById('generate-jsa-btn');
    const copyJsaBtn = document.getElementById('copy-jsa-btn');
    const translateJsaBtn = document.getElementById('translate-jsa-btn');

    if (generateJsaBtn) generateJsaBtn.addEventListener('click', generateJSADocument);
    if (copyJsaBtn) copyJsaBtn.addEventListener('click', copyJsaText);
    if (translateJsaBtn) translateJsaBtn.addEventListener('click', translateJSADocument);

    // Auto render vocab bank on load
    renderVocabBank();
});

async function generateDailyVocab() {
    const vocabContainer = document.getElementById('hse-vocab-content');
    const saveVocabBtn = document.getElementById('save-vocab-btn');

    if (saveVocabBtn) saveVocabBtn.classList.add('hidden');

    // Assuming getApiKey is globally available from auth.js or encryption.js
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        vocabContainer.innerHTML = '<p class="text-danger">⚠️ API Key Gemini belum diatur. Silakan atur di Settings.</p>';
        return;
    }

    vocabContainer.innerHTML = '<div class="loading-spinner" style="margin: 20px auto;"></div><p class="text-center text-muted">Mencari kosakata...</p>';

    const prompt = `Berikan satu kosakata teknis Bahasa Inggris yang sangat relevan dan sering digunakan di industri Oil & Gas (Migas) atau Health, Safety, and Environment (HSE). 
Pastikan kosakata tersebut masuk kategori intermediate hingga advanced (jangan terlalu dasar seperti 'helmet' atau 'boots', tapi seperti 'lockout/tagout', 'scaffolding', 'hydrogen sulfide', 'permit to work').
Format respon HANYA dalam bentuk JSON valid dengan struktur berikut:
{
  "word": "kosakata bahasa inggris",
  "translation": "terjemahan bahasa indonesia",
  "definition": "penjelasan singkat dalam bahasa indonesia apa arti istilah tersebut dalam konteks migas/HSE",
  "example_en": "contoh penggunaan kalimat dalam bahasa inggris di situasi kerja nyata",
  "example_id": "terjemahan kalimat tersebut dalam bahasa indonesia"
}
JANGAN TAMBAHKAN TEKS APAPUN SELAIN JSON TERSEBUT. PASTIKAN BISA DI-PARSE.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } })
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            // Clean markdown blocks
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const vocabObj = JSON.parse(responseText);

            // Store temporarily on the window object so we can save it later
            window.currentGeneratedVocab = vocabObj;

            // Render HTML Manually
            vocabContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <h4 style="color: var(--primary); margin: 0; font-size: 1.2rem;">${vocabObj.word}</h4>
                    <button onclick="playPronunciation('${vocabObj.word.replace(/'/g, "\\'")}', 'en-US')" class="icon-btn" style="background: var(--surface); border: 1px solid var(--border); border-radius: 50%; padding: 4px 8px; cursor: pointer; font-size: 0.9rem;" title="Dengarkan pengucapan">🔊</button>
                </div>
                <p style="margin-top: 0; margin-bottom: 10px;"><span style="color: var(--text); font-size: 0.9em;">${vocabObj.translation}</span></p>
                <p style="margin-bottom: 10px;"><strong>Definisi:</strong> ${vocabObj.definition}</p>
                <div style="font-style: italic; color: var(--text-muted); background: var(--surface-hover); padding: 10px; border-radius: 6px; border-left: 3px solid var(--secondary);">
                    <div style="margin-bottom: 4px; display: flex; align-items: flex-start; gap: 6px;">
                        <span>"${vocabObj.example_en}"</span>
                        <button onclick="playPronunciation('${vocabObj.example_en.replace(/'/g, "\\'")}', 'en-US')" class="icon-btn" style="background: transparent; border: none; cursor: pointer; padding: 0; font-size: 0.8rem; margin-top: 2px;">🔊</button>
                    </div>
                    <div style="font-size: 0.85em;">"${vocabObj.example_id}"</div>
                </div>
            `;

            if (saveVocabBtn) saveVocabBtn.classList.remove('hidden');

        } else {
            vocabContainer.innerHTML = '<p class="text-danger">Gagal mengambil kosakata. Coba lagi.</p>';
        }
    } catch (error) {
        console.error('Error generating vocab:', error);
        vocabContainer.innerHTML = '<p class="text-danger">Terjadi kesalahan saat memproses data JSON vocab. Coba lagi.</p>';
    }
}

// Vocab Bank Logic
function saveCurrentVocab() {
    if (!window.currentGeneratedVocab) return;

    // Requires storage.js to have saveVocabToBank
    if (typeof saveVocabToBank === 'function') {
        saveVocabToBank(window.currentGeneratedVocab);
        renderVocabBank(); // Update UI

        // Visual feedback
        const saveBtn = document.getElementById('save-vocab-btn');
        if (saveBtn) {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '✅ Berhasil  Disimpan';
            saveBtn.disabled = true;
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
                saveBtn.classList.add('hidden'); // Hide after saving so they don't double save
            }, 2000);
        }
    } else {
        alert("Fungsi penyimpanan belum tersedia.");
    }
}

function renderVocabBank() {
    const vocabListContainer = document.getElementById('vocab-bank-list');
    const vocabCountElem = document.getElementById('vocab-bank-count');
    const quizBtn = document.getElementById('start-vocab-quiz-btn');

    if (!vocabListContainer) return;

    let bank = [];
    if (typeof getVocabBank === 'function') {
        bank = getVocabBank();
    }

    if (vocabCountElem) {
        vocabCountElem.textContent = `${bank.length} Kata`;
    }

    if (bank.length === 0) {
        vocabListContainer.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">Belum ada flashcard yang disimpan.</p>';
        if (quizBtn) quizBtn.classList.add('hidden');
        return;
    }

    if (quizBtn && bank.length >= 3) {
        quizBtn.classList.remove('hidden');
    } else if (quizBtn) {
        quizBtn.classList.add('hidden');
    }

    vocabListContainer.innerHTML = bank.map(v => `
        <div class="flashcard-item" style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 12px; position: relative; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <button onclick="deleteVocabCard('${v.id}')" class="icon-btn" style="position: absolute; top: 8px; right: 8px; color: var(--danger); font-size: 0.8rem; background: rgba(255,0,0,0.1); border-radius: 4px; padding: 2px 6px;">✕</button>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <strong style="color: var(--primary); font-size: 1.1rem;">${v.word}</strong>
                <button onclick="playPronunciation('${v.word.replace(/'/g, "\\'")}', 'en-US')" class="icon-btn" style="padding: 0; background: transparent; font-size: 0.8rem; border: none;">🔊</button>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">${v.translation}</div>
            
            <details style="font-size: 0.85rem; padding-top: 8px; border-top: 1px dashed var(--border);">
                <summary style="cursor: pointer; color: var(--secondary); font-weight: 500;">Lihat Detail & Contoh</summary>
                <div style="margin-top: 8px;">
                    <p style="margin-top: 0; margin-bottom: 6px;"><strong>Definisi:</strong> ${v.definition}</p>
                    <div style="background: var(--surface-hover); padding: 8px; border-radius: 4px;">
                        <em style="color: var(--text-color);">"${v.example_en}"</em><br>
                        <span style="color: var(--text-muted); font-size: 0.9em;">"${v.example_id}"</span>
                    </div>
                </div>
            </details>
        </div>
    `).join('');
}

window.deleteVocabCard = function (id) {
    if (confirm('Hapus kosakata ini dari bank?')) {
        if (typeof deleteVocabFromBank === 'function') {
            deleteVocabFromBank(id);
            renderVocabBank();
        }
    }
};

// Quiz Logic
let quizQuestions = [];
let currentQuizIndex = 0;
let score = 0;

function startVocabQuiz() {
    let bank = typeof getVocabBank === 'function' ? getVocabBank() : [];
    if (bank.length < 3) {
        alert("Minimal butuh 3 kosakata tersimpan untuk mulai kuis.");
        return;
    }

    document.getElementById('start-vocab-quiz-btn').classList.add('hidden');
    document.getElementById('vocab-quiz-area').classList.remove('hidden');

    // Select up to 5 random words
    let shuffled = [...bank].sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 5);

    quizQuestions = selected.map(vocab => {
        let others = bank.filter(v => v.id !== vocab.id);
        let options = [vocab.translation];

        // Pick 2 random wrong options
        let wrongOptions = [...others].sort(() => 0.5 - Math.random()).slice(0, 2);
        options.push(...wrongOptions.map(o => o.translation));

        options = options.sort(() => 0.5 - Math.random()); // Shuffle options

        return {
            word: vocab.word,
            correct: vocab.translation,
            options: options
        };
    });

    currentQuizIndex = 0;
    score = 0;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
        finishQuiz();
        return;
    }

    const q = quizQuestions[currentQuizIndex];
    document.getElementById('quiz-progress').textContent = `${currentQuizIndex + 1}/${quizQuestions.length}`;
    document.getElementById('quiz-question').innerHTML = `Apa terjemahan dari <strong style="color:var(--primary);">'${q.word}'</strong>?`;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = q.options.map(opt => `
        <button class="btn btn-secondary quiz-option-btn" style="text-align: left; background: var(--surface); border: 1px solid var(--border);" onclick="checkQuizAnswer(this, '${opt.replace(/'/g, "\\'")}', '${q.correct.replace(/'/g, "\\'")}')">${opt}</button>
    `).join('');
}

window.checkQuizAnswer = function (btn, selectedOption, correctOption) {
    const buttons = document.querySelectorAll('.quiz-option-btn');
    buttons.forEach(b => b.disabled = true); // Disable all

    if (selectedOption === correctOption) {
        btn.style.background = 'var(--success)';
        btn.style.color = '#fff';
        score++;
    } else {
        btn.style.background = 'var(--danger)';
        btn.style.color = '#fff';
        // Highlight correct one
        buttons.forEach(b => {
            if (b.innerText.trim() === correctOption) {
                b.style.border = '2px solid var(--success)';
            }
        });
    }

    setTimeout(() => {
        currentQuizIndex++;
        renderQuizQuestion();
    }, 1200);
}

function finishQuiz() {
    document.getElementById('quiz-progress').textContent = "Selesai!";
    document.getElementById('quiz-question').innerHTML = `<strong>Kuis Selesai!</strong><br><span style="font-size: 0.9em; color: var(--text-muted);">Skor Anda: ${score}/${quizQuestions.length}</span>`;

    let btnClass = score === quizQuestions.length ? 'btn-primary' : 'btn-secondary';
    document.getElementById('quiz-options').innerHTML = `
        <button class="btn ${btnClass}" onclick="closeVocabQuiz()" style="width: 100%;">Tutup Kuis</button>
    `;

    // Add XP if using gamification
    if (typeof addXP === 'function' && score > 0) {
        addXP(score * 5, "Vocab Review");
    }
}

function closeVocabQuiz() {
    document.getElementById('vocab-quiz-area').classList.add('hidden');
    document.getElementById('start-vocab-quiz-btn').classList.remove('hidden');
}

async function startRoleplay() {
    const scenarioSelect = document.getElementById('roleplay-scenario');
    const scenario = scenarioSelect.options[scenarioSelect.selectedIndex].text;

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('⚠️ API Key Gemini belum diatur di Settings.');
        return;
    }

    document.getElementById('start-roleplay-btn').classList.add('hidden');
    document.getElementById('stop-roleplay-btn').classList.remove('hidden');
    document.getElementById('roleplay-chat-area').classList.remove('hidden');

    scenarioSelect.disabled = true;

    const chatHistoryDiv = document.getElementById('roleplay-chat-history');
    chatHistoryDiv.innerHTML = '';

    // Initialize AI context
    roleplayChatHistory = [
        {
            role: "user",
            parts: [{
                text: `Kita akan melakukan simulasi percakapan (roleplay) untuk melatih Bahasa Inggris saya di industri Oil & Gas / HSE.
Skenario: ${scenario}.
Peranmu: Bertindaklah sebagai figur otoritas yang relevan dengan skenario (misalnya Supervisor, Safety Officer, atau Permit Issuer). Kamu fasih berbahasa Inggris dan menggunakan terminologi HSE standar internasional (OSHA/NEBOSH).
Tugasmu:
1. Mulai percakapan terlebih dahulu sesuai peranmu (Max 2-3 kalimat logis).
2. Tunggu balasan saya. Jika Bahasa Inggris saya salah atau kurang tepat secara tata bahasa atau istilah HSE, beritahu perbaikannya (koreksi ringan) lalu lanjutkan percakapan.
3. Tetap dalam karaktermu, jangan keluar dari skenario sampai saya bilang "STOP ROLEPLAY".
Silakan mulai sekarang.` }]
        }
    ];

    appendRoleplayMessage('system', 'System: Connecting to AI Supervisor...');

    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: roleplayChatHistory, generationConfig: { temperature: 0.7 } })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const aiMessage = data.candidates[0].content.parts[0].text;

            // Add AI response to history
            roleplayChatHistory.push({
                role: "model",
                parts: [{ text: aiMessage }]
            });

            chatHistoryDiv.innerHTML = ''; // Clear system message
            appendRoleplayMessage('ai', aiMessage);
        } else {
            throw new Error('Invalid AI response');
        }
    } catch (error) {
        console.error('Roleplay start error:', error);
        appendRoleplayMessage('system', 'Error starting scenario. Check console or API key.');
        stopRoleplay();
    }
}

function stopRoleplay() {
    document.getElementById('start-roleplay-btn').classList.remove('hidden');
    document.getElementById('stop-roleplay-btn').classList.add('hidden');
    document.getElementById('roleplay-scenario').disabled = false;

    roleplayChatHistory = [];
    appendRoleplayMessage('system', 'Roleplay ended. You can start a new scenario.');
}

async function sendRoleplayMessage() {
    const inputField = document.getElementById('roleplay-input');
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('⚠️ API Key Gemini belum diatur di Settings.');
        return;
    }

    // Show user message
    appendRoleplayMessage('user', userMessage);
    inputField.value = '';
    inputField.disabled = true;

    // Add user message to history
    roleplayChatHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    const sendBtn = document.getElementById('roleplay-send-btn');
    const originalBtnText = sendBtn.innerHTML;
    sendBtn.innerHTML = '...';
    sendBtn.disabled = true;

    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: roleplayChatHistory, generationConfig: { temperature: 0.7 } })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const aiMessage = data.candidates[0].content.parts[0].text;

            // Add AI response to history
            roleplayChatHistory.push({
                role: "model",
                parts: [{ text: aiMessage }]
            });

            appendRoleplayMessage('ai', aiMessage);
        } else {
            appendRoleplayMessage('system', 'Warning: AI failed to respond properly.');
        }
    } catch (error) {
        console.error('Roleplay send error:', error);
        appendRoleplayMessage('system', 'Error sending message. Check connection.');
    } finally {
        inputField.disabled = false;
        sendBtn.innerHTML = originalBtnText;
        sendBtn.disabled = false;
        inputField.focus();
    }
}

function appendRoleplayMessage(sender, text) {
    const chatHistoryDiv = document.getElementById('roleplay-chat-history');
    const bubble = document.createElement('div');

    bubble.style.padding = '10px 14px';
    bubble.style.borderRadius = '12px';
    bubble.style.maxWidth = '85%';
    bubble.style.fontSize = '0.95rem';
    bubble.style.lineHeight = '1.4';
    bubble.style.wordBreak = 'break-word';

    if (sender === 'user') {
        bubble.style.alignSelf = 'flex-end';
        bubble.style.background = 'var(--primary)';
        bubble.style.color = '#fff';
        bubble.style.borderBottomRightRadius = '2px';
        bubble.innerHTML = text.replace(/\\n/g, '<br>');
    } else if (sender === 'ai') {
        bubble.style.alignSelf = 'flex-start';
        bubble.style.background = 'var(--surface)';
        bubble.style.color = 'var(--text)';
        bubble.style.borderBottomLeftRadius = '2px';
        bubble.style.border = '1px solid var(--border)';
        // Parse basic markdown if AI sends bold text
        bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

        // Add speech button
        const speakContainer = document.createElement('div');
        speakContainer.style.marginTop = '8px';
        speakContainer.style.textAlign = 'right';

        const speakBtn = document.createElement('button');
        speakBtn.innerHTML = '🔊 Dengarkan';
        speakBtn.className = 'btn btn-secondary btn-small';
        speakBtn.style.padding = '4px 8px';
        speakBtn.style.fontSize = '0.75rem';
        speakBtn.onclick = () => playPronunciation(text, 'en-US');

        speakContainer.appendChild(speakBtn);
        bubble.appendChild(speakContainer);
    } else {
        bubble.style.alignSelf = 'center';
        bubble.style.background = 'transparent';
        bubble.style.color = 'var(--text-muted)';
        bubble.style.fontSize = '0.85rem';
        bubble.style.fontStyle = 'italic';
        bubble.innerText = text;
    }

    chatHistoryDiv.appendChild(bubble);
    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}

async function translateHseReport() {
    const inputField = document.getElementById('hse-report-input');
    const resultDiv = document.getElementById('hse-report-result');
    const draftText = inputField.value.trim();

    if (!draftText) {
        alert('Silakan ketik draft laporan Anda terlebih dahulu.');
        return;
    }

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('⚠️ API Key Gemini belum diatur di Settings.');
        return;
    }

    const btn = document.getElementById('translate-report-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '🔄 Sedang Menerjemahkan/Menyempurnakan...';
    btn.disabled = true;
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<div class="loading-spinner" style="margin: 0;"></div> Memproses draft...';

    const prompt = `Anda adalah seorang HSE Manager yang berpengalaman dengan standar internasional (OSHA/NEBOSH).
Saya memiliki sebuah draft laporan insiden atau observasi K3. Draft ini bisa jadi campuran Bahasa Indonesia, Bahasa Inggris patah-patah, atau tidak terstruktur.
Tugas Anda:
1. Terjemahkan dan perbaiki bahasa tersebut menjadi paragraf Bahasa Inggris teknis HSE yang sangat baku, profesional, dan akurat (Formal Incident Report format).
2. Jika ada informasi yang terkesan kurang detil secara safety (misal: gagal menyebutkan APD spesifik), tambahkan [Bracket] untuk menyarankan informasi yang harus diisi.
3. Berikan juga penjelasan singkat (1-2 kalimat Bahasa Indonesia) di bawahnya mengenai perbaikan istilah spesifik yang Anda ubah (misalnya: "Saya mengubah 'jatuh' menjadi 'fall from height', dan 'sabuk pengaman' menjadi 'safety harness'").

Draft laporan:
"${draftText}"

Tampilkan struktur respon:
**Professional HSE Report:**
[Hasil laporan dalam Bahasa Inggris]

**Istilah yang disempurnakan:**
[Penjelasan singkat]`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3 } })
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            // Basic markdown parsing for rendering
            // Extract English part to separate for TTS
            const englishPartMatch = responseText.match(/\*\*Professional HSE Report:\*\*\s*([\s\S]*?)(?=\n\*\*Istilah yang disempurnakan:)/);
            const englishTextOnly = englishPartMatch ? englishPartMatch[1].trim() : "Failed to extract English text";

            // Basic markdown parsing for rendering
            const formatted = responseText
                .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--primary);">$1</strong>')
                .replace(/\n/g, '<br>');

            resultDiv.innerHTML = formatted;

            // Add play button to read the professional report
            if (englishPartMatch) {
                const speakBtn = document.createElement('button');
                speakBtn.innerHTML = '🔊 Bacakan Report Bahasa Inggris';
                speakBtn.className = 'btn btn-secondary mt-sm';
                speakBtn.style.display = 'block';
                speakBtn.style.width = '100%';
                speakBtn.onclick = () => playPronunciation(englishTextOnly, 'en-US');
                resultDiv.insertBefore(speakBtn, resultDiv.firstChild);
            }
        } else {
            resultDiv.innerHTML = '<span class="text-danger">Gagal memproses laporan. Silakan coba lagi.</span>';
        }
    } catch (error) {
        console.error('Report translation error:', error);
        resultDiv.innerHTML = '<span class="text-danger">Terjadi kesalahan. Periksa koneksi atau API Key Anda.</span>';
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Speech-to-Text for Roleplay
let roleplaySpeechRecognition = null;
let isRoleplayRecording = false;

function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Browser Anda belum mendukung fitur Voice (Speech-to-Text). Silakan gunakan Chrome/Edge terbaru.");
        return false;
    }

    if (!roleplaySpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        roleplaySpeechRecognition = new SpeechRecognition();
        roleplaySpeechRecognition.lang = 'en-US'; // English context
        roleplaySpeechRecognition.interimResults = false;
        roleplaySpeechRecognition.maxAlternatives = 1;

        roleplaySpeechRecognition.onstart = function () {
            isRoleplayRecording = true;
            const micBtn = document.getElementById('roleplay-mic-btn');
            if (micBtn) {
                micBtn.innerHTML = '🛑';
                micBtn.classList.replace('btn-secondary', 'btn-danger');
            }
            const inputField = document.getElementById('roleplay-input');
            if (inputField) inputField.placeholder = "Mendengarkan ucapan Anda (English)...";
        };

        roleplaySpeechRecognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            const inputField = document.getElementById('roleplay-input');
            if (inputField) {
                const currentText = inputField.value.trim();
                inputField.value = currentText ? currentText + " " + transcript : transcript;
            }
        };

        roleplaySpeechRecognition.onerror = function (event) {
            console.error("Speech recognition error", event.error);
            stopRoleplayMic();
        };

        roleplaySpeechRecognition.onend = function () {
            stopRoleplayMic();
        };
    }
    return true;
}

function toggleRoleplayMic() {
    if (isRoleplayRecording) {
        if (roleplaySpeechRecognition) roleplaySpeechRecognition.stop();
        stopRoleplayMic();
    } else {
        if (initSpeechRecognition()) {
            roleplaySpeechRecognition.start();
        }
    }
}

function stopRoleplayMic() {
    isRoleplayRecording = false;
    const micBtn = document.getElementById('roleplay-mic-btn');
    if (micBtn) {
        micBtn.innerHTML = '🎙️';
        if (micBtn.classList.contains('btn-danger')) {
            micBtn.classList.replace('btn-danger', 'btn-secondary');
        }
    }
    const inputField = document.getElementById('roleplay-input');
    if (inputField) inputField.placeholder = "Type your message...";
}

// ==========================================
// DAILY LISTENING CASE COMPREHENSION LOGIC
// ==========================================
let currentListeningCase = null;

async function generateListeningCase() {
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('⚠️ API Key Gemini belum diatur di Settings.');
        return;
    }

    const btn = document.getElementById('generate-listening-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Membuat Skenario... <div class="loading-spinner" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; margin-left: 5px;"></div>';
    btn.disabled = true;

    const area = document.getElementById('listening-case-area');
    area.classList.add('hidden');

    const prompt = `Buatlah sebuah skenario/cerita insiden/near-miss singkat di bidang Oil & Gas Migas atau HSE (sekitar 3-4 kalimat panjang) dalam Bahasa Inggris profesional.
Kemudian buat 2 buah pertanyaan pilihan ganda terkait detail pada cerita (untuk menguji listening/pemahaman pendengaran).
Setiap pertanyaan memiliki 4 opsi (A, B, C, D) dalam Bahasa Inggris.

Format HANYA berupa JSON valid dengan struktur:
{
  "story": "Cerita skenario incident dalam bahasa inggris",
  "questions": [
     {
       "question": "Isi pertanyaan 1 (dalam bahasa Inggris)",
       "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
       "correct_answer": "Kalimat opsi yang paling benar (harus persis sama dengan salah satu opsi)"
     },
     {
       "question": "Isi pertanyaan 2 (dalam bahasa Inggris)",
       "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
       "correct_answer": "Kalimat opsi yang rata"
     }
  ]
}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.8 } })
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            currentListeningCase = JSON.parse(responseText);
            renderListeningCase();
        } else {
            throw new Error("Invalid output format");
        }
    } catch (error) {
        console.error('Listening case generation error:', error);
        alert('Gagal mengambil materi listening. Periksa API key atau koneksi internet Anda.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function renderListeningCase() {
    if (!currentListeningCase) return;

    document.getElementById('listening-case-area').classList.remove('hidden');
    document.getElementById('listening-transcript').classList.add('hidden');
    document.getElementById('listening-transcript').innerHTML = currentListeningCase.story;
    document.getElementById('show-transcript-btn').textContent = "Tampilkan Teks (Transcript)";

    const questionsArea = document.getElementById('listening-questions-area');
    questionsArea.innerHTML = '';

    currentListeningCase.questions.forEach((q, index) => {
        let questionHtml = `
            <div class="listening-question-box" style="margin-top: 15px; border-top: 1px solid var(--border); padding-top: 15px;">
                <p style="font-weight: 500; margin-bottom: 10px;">${index + 1}. ${q.question}</p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
        `;

        q.options.forEach((opt, optIndex) => {
            const escapedOpt = opt.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const escapedCorrect = q.correct_answer.replace(/'/g, "\\'").replace(/"/g, '&quot;');

            questionHtml += `
                <label class="btn btn-secondary listening-option-label" style="text-align: left; padding: 10px; display: flex; align-items: flex-start; gap: 10px; cursor: pointer; border: 1px solid var(--border); font-size: 0.95rem;">
                    <input type="radio" name="listening-q${index}" value="${escapedOpt}" onchange="checkListeningAnswer(this, ${index}, '${escapedCorrect}')" style="margin-top: 3px;">
                    <span style="flex: 1;">${opt}</span>
                </label>
            `;
        });

        questionHtml += `
                </div>
                <div id="listening-feedback-${index}" class="mt-sm" style="font-weight: 500; font-size: 0.9rem;"></div>
            </div>
        `;

        questionsArea.innerHTML += questionHtml;
    });
}

function playListeningAudio() {
    if (currentListeningCase && currentListeningCase.story) {
        playPronunciation(currentListeningCase.story, 'en-US');
    }
}

function toggleListeningTranscript() {
    const transcriptDiv = document.getElementById('listening-transcript');
    const btn = document.getElementById('show-transcript-btn');
    if (transcriptDiv.classList.contains('hidden')) {
        transcriptDiv.classList.remove('hidden');
        btn.textContent = "Sembunyikan Teks (Transcript)";
    } else {
        transcriptDiv.classList.add('hidden');
        btn.textContent = "Tampilkan Teks (Transcript)";
    }
}

window.checkListeningAnswer = function (radioInput, questionIndex, correctAnswer) {
    const parentContainer = radioInput.closest('.listening-question-box');
    const labels = parentContainer.querySelectorAll('.listening-option-label');
    const feedbackDiv = document.getElementById(`listening-feedback-${questionIndex}`);

    // Disable all options for this question
    const allRadios = parentContainer.querySelectorAll('input[type="radio"]');
    allRadios.forEach(r => r.disabled = true);

    // Reset label styles then color correct/wrong
    labels.forEach(lbl => {
        lbl.style.background = 'var(--surface)';
        lbl.style.color = 'var(--text-color)';

        const rInput = lbl.querySelector('input');
        if (rInput.value === correctAnswer) {
            lbl.style.border = '2px solid var(--success)';
        }
    });

    // Highlight the selected one specifically
    const selectedLabel = radioInput.closest('label');
    if (radioInput.value === correctAnswer) {
        selectedLabel.style.background = 'var(--success)';
        selectedLabel.style.color = '#fff';
        feedbackDiv.innerHTML = '<span style="color: var(--success);">✅ Correct!</span>';

        if (typeof addXP === 'function') addXP(10, "Listening Practice");
    } else {
        selectedLabel.style.background = 'var(--danger)';
        selectedLabel.style.color = '#fff';
        feedbackDiv.innerHTML = `<span style="color: var(--danger);">❌ Incorrect.</span>`;
    }
};

// ==========================================
// AI JSA & PTW GENERATOR LOGIC
// ==========================================
let currentJsaContentEn = "";
let currentJsaContentId = "";

async function generateJSADocument() {
    const jobDescInput = document.getElementById('jsa-job-desc');
    const docTypeSelect = document.getElementById('jsa-doc-type');
    const resultArea = document.getElementById('jsa-result-area');
    const contentArea = document.getElementById('jsa-content');
    const btn = document.getElementById('generate-jsa-btn');

    const jobDesc = jobDescInput ? jobDescInput.value.trim() : '';
    const docType = docTypeSelect ? docTypeSelect.value : 'JSA';

    if (!jobDesc) {
        alert("Mohon isi deskripsi pekerjaan terlebih dahulu.");
        return;
    }

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('⚠️ API Key Gemini belum diatur di Settings.');
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generating Document... <div class="loading-spinner" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; margin-left: 5px;"></div>';
    btn.disabled = true;

    resultArea.classList.remove('hidden');
    contentArea.innerHTML = '<div class="loading-spinner" style="margin: 20px auto;"></div><p class="text-center text-muted">AI is analyzing the task and building the document...</p>';

    document.getElementById('translate-jsa-btn').innerHTML = '🇮🇩 Terjemahkan'; // Reset translate button

    const prompt = `Act as a Senior HSE (Health, Safety, and Environment) Officer with international certification (NEBOSH/OSHA).
Create a professional, highly detailed, and realistic ${docType} (Job Safety Analysis / Permit to Work) document in ENGLISH based on this job description:
"${jobDesc}"

Format the output as a clean, styled HTML structure (using standard table tags, divs, h3, ul, li).
Include the following sections if applicable to the document type:
1. Document header (Title, Date, Task Description).
2. For JSA: A detailed table with 4 columns: Sequence of Basic Job Steps, Potential Hazards, Recommended Safe Job Procedures (Mitigations), Required PPE.
3. For PTW: General requirements, Specific hazards checker (Yes/No format), Control measures, and Sign-off section.
Ensure the English vocabulary used is formal, technical, and accurate to the Oil & Gas / construction industry standard.
DO NOT use markdown backticks (e.g. \`\`\`html). Output strictly the HTML code.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5 } }) // Lower temp for more analytical/standard output
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            // Clean up backticks if model still sends them
            responseText = responseText.replace(/```html/g, '').replace(/```/g, '').trim();

            // Add basic table styling if not provided by AI
            if (!responseText.includes('<style>')) {
                responseText = `
                 <style>
                    .jsa-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9em; }
                    .jsa-table th, .jsa-table td { border: 1px solid var(--border); padding: 8px; text-align: left; vertical-align: top; }
                    .jsa-table th { background-color: var(--surface-hover); font-weight: bold; color: var(--primary); }
                    .jsa-header { border-bottom: 2px solid var(--primary); padding-bottom: 10px; margin-bottom: 15px; }
                 </style>
                 ` + responseText;
            }

            contentArea.innerHTML = responseText;
            currentJsaContentEn = responseText;
            currentJsaContentId = ""; // Clear existing translation

        } else {
            throw new Error("Empty response output");
        }
    } catch (error) {
        console.error('JSA generation error:', error);
        contentArea.innerHTML = '<p class="text-danger">Gagal membuat dokumen. Periksa API key atau koneksi internet Anda.</p>';
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function translateJSADocument() {
    if (!currentJsaContentEn) return;

    const contentArea = document.getElementById('jsa-content');
    const translateBtn = document.getElementById('translate-jsa-btn');

    // Toggle back to English if already translated
    if (currentJsaContentId && translateBtn.innerHTML.includes('🇬🇧')) {
        contentArea.innerHTML = currentJsaContentEn;
        translateBtn.innerHTML = '🇮🇩 Terjemahkan';
        return;
    }

    // If translation already exists, just show it
    if (currentJsaContentId) {
        contentArea.innerHTML = currentJsaContentId;
        translateBtn.innerHTML = '🇬🇧 Show English';
        return;
    }

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) return;

    const originalHtml = contentArea.innerHTML;
    contentArea.innerHTML = '<div class="loading-spinner" style="margin: 20px auto;"></div><p class="text-center text-muted">Translating document to Indonesian...</p>';
    translateBtn.disabled = true;

    const prompt = `Translate the following HSE Document HTML into formal Indonesian (Bahasa Indonesia baku yang digunakan di industri Migas).
Keep ALL the HTML tags and structure exactly the same. ONLY translate the text content inside the tags.
Do not wrap it in markdown block.
Here is the HTML:
${currentJsaContentEn}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3 } })
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            responseText = responseText.replace(/```html/g, '').replace(/```/g, '').trim();
            currentJsaContentId = responseText;
            contentArea.innerHTML = currentJsaContentId;
            translateBtn.innerHTML = '🇬🇧 Show English';
        } else {
            throw new Error("Empty response output");
        }
    } catch (error) {
        console.error('JSA translation error:', error);
        alert('Gagal menerjemahkan dokumen.');
        contentArea.innerHTML = originalHtml; // Revert
    } finally {
        translateBtn.disabled = false;
    }
}

function copyJsaText() {
    const contentArea = document.getElementById('jsa-content');
    if (!contentArea || !contentArea.innerText) return;

    // We try to copy just the rendered text, not the HTML source
    const textToCopy = contentArea.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.getElementById('copy-jsa-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
        alert('Gagal menyalin teks.');
    });
}
