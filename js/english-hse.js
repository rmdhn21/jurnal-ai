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

    // AI JSA & PTW Generator
    document.getElementById('generate-jsa-btn')?.addEventListener('click', generateJSADocument);
    document.getElementById('copy-jsa-btn')?.addEventListener('click', copyJsaText);
    document.getElementById('translate-jsa-btn')?.addEventListener('click', translateJSADocument);
    document.getElementById('export-excel-jsa-btn')?.addEventListener('click', exportJSAToExcel);
    document.getElementById('export-pdf-jsa-btn')?.addEventListener('click', exportJSAToPDF);
    document.getElementById('save-jsa-lib-btn')?.addEventListener('click', () => {
        const docType = document.getElementById('jsa-doc-type')?.value || 'JSA';
        const jobDesc = document.getElementById('jsa-job-desc')?.value || '';
        saveCurrentViewToLibrary(`${docType}: ${jobDesc.substring(0, 30)}...`, '#jsa-content', 'HSE');
    });

    // AI Incident Investigator (RCA)
    document.getElementById('generate-rca-btn')?.addEventListener('click', generateRCADocument);
    document.getElementById('copy-rca-btn')?.addEventListener('click', copyRcaText);
    document.getElementById('translate-rca-btn')?.addEventListener('click', translateRCADocument);
    document.getElementById('save-rca-lib-btn')?.addEventListener('click', () => {
        const incidentDesc = document.getElementById('rca-incident-desc')?.value || '';
        saveCurrentViewToLibrary(`RCA: ${incidentDesc.substring(0, 30)}...`, '#rca-content', 'HSE');
    });
    document.getElementById('rca-mic-btn')?.addEventListener('click', toggleRcaVoiceInput);

    // AI Daily TBT & P5M Briefing Generator
    document.getElementById('generate-tbt-btn')?.addEventListener('click', generateTBTDocument);
    document.getElementById('copy-tbt-btn')?.addEventListener('click', copyTbtText);
    document.getElementById('translate-tbt-btn')?.addEventListener('click', translateTBTDocument);
    document.getElementById('save-tbt-lib-btn')?.addEventListener('click', () => {
        const opDesc = document.getElementById('tbt-operation-desc')?.value || '';
        saveCurrentViewToLibrary(`TBT: ${opDesc.substring(0, 30)}...`, '#tbt-content', 'HSE');
    });

    // AI HSE Regulation Expert (Chatbot)
    document.getElementById('send-hse-chat-btn')?.addEventListener('click', sendHseChatMessage);
    document.getElementById('hse-chat-mic-btn')?.addEventListener('click', toggleHseChatVoiceInput);

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

        if (response.status === 429) throw new Error('Quota Exceeded: Terlalu banyak permintaan. Mohon tunggu sejenak.');
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
async function saveCurrentVocab() {
    if (!window.currentGeneratedVocab) return;

    // Requires storage.js to have saveVocabToBank
    if (typeof saveVocabToBank === 'function') {
        await saveVocabToBank(window.currentGeneratedVocab);
        await renderVocabBank(); // Update UI

        // Visual feedback
        const saveBtn = document.getElementById('save-vocab-btn');
        if (saveBtn) {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '✅ Berhasil Disimpan';
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

async function renderVocabBank() {
    const vocabListContainer = document.getElementById('vocab-bank-list');
    const vocabCountElem = document.getElementById('vocab-bank-count');
    const quizBtn = document.getElementById('start-vocab-quiz-btn');

    if (!vocabListContainer) return;

    let bank = [];
    if (typeof getVocabBank === 'function') {
        bank = await getVocabBank();
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

window.deleteVocabCard = async function (id) {
    if (confirm('Hapus kosakata ini dari bank?')) {
        if (typeof deleteVocabFromBank === 'function') {
            await deleteVocabFromBank(id);
            await renderVocabBank();
        }
    }
};

// Quiz Logic
let quizQuestions = [];
let currentQuizIndex = 0;
let score = 0;

async function startVocabQuiz() {
    let bank = typeof getVocabBank === 'function' ? await getVocabBank() : [];
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
        if (response.status === 429) throw new Error('Quota Exceeded: Terlalu banyak permintaan.');
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
        if (response.status === 429) throw new Error('Quota Exceeded: Terlalu banyak permintaan.');
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

        if (response.status === 429) throw new Error('Quota Exceeded: Terlalu banyak permintaan.');
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

            // Add Save Button
            const saveBtn = document.createElement('button');
            saveBtn.innerHTML = '💾 Simpan ke Perpustakaan';
            saveBtn.className = 'btn btn-ai mt-sm';
            saveBtn.style.display = 'block';
            saveBtn.style.width = '100%';
            saveBtn.style.background = 'var(--secondary)';
            saveBtn.onclick = () => saveCurrentViewToLibrary('HSE Report Translation', '#hse-report-result', 'HSE');
            resultDiv.appendChild(saveBtn);
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

        if (response.status === 429) throw new Error('Quota Exceeded: Mohon tunggu.');
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

let currentRcaContentEn = "";
let currentRcaContentId = "";

let currentTbtContentEn = "";
let currentTbtContentId = "";

let hseChatHistory = [
    {
        role: "user",
        parts: [{ text: "System Prompt: You are a Senior HSE Regulatory Advisor for Pertamina Hulu Energi (PHE). You have encyclopedic knowledge of Indonesian K3 Laws (Undang-Undang No. 1 Tahun 1970), PTK 005 SKK Migas, OSHA standards, API, and NEBOSH guidelines. Answer users' questions about safety protocols, required permits, safe clearances, and hazard mitigations concisely and accurately. Respond primarily in formal Indonesian suitable for the Oil & Gas industry. Never break character." }]
    },
    {
        role: "model",
        parts: [{ text: "Dimengerti. Saya siap melayani sebagai Penasihat Regulasi K3 PHE Anda." }]
    }
];

let listeningAudio = null;
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

    let prompt = "";
    if (docType === "RA") {
        prompt = `Act as a Senior HSE (Health, Safety, and Environment) Officer with international certification (NEBOSH/OSHA) working for Pertamina Hulu Energi (PHE).
Create a highly professional and realistic Risk Assessment (RA) document in ENGLISH based on this job description:
"${jobDesc}"

You must strictly output exactly 5 SEPARATE HTML TABLES that perfectly and comprehensively mirror the 5 pages/sections of the standard Pertamina Hulu Energi (PHE) JSA/RA format. DO NOT omit any fields. DO NOT collapse tables.

Table 1: Document Header
- It must contain 3 columns.
- Col 1: "Fasilitas/site:", "Tipe PTW:" (Choose between: Hot work (merah) / Critical work (kuning) / Breaking containment (hitam) / General work (biru) / Confined Space (biru)), "Deskripsi Pekerjaan (termasuk peralatan kerja):"
- Col 2: The Title "RISK ASSESSMENT (RA)" or "Job Safety Analysis (JSA)", centered, large and bold.
- Col 3: "Lokasi:", "RA No.:", "Tanggal registrasi:"

Table 2: Preparer Information & Risk Committee (Tim Kaji Risiko)
- Heading row spanning all columns: "Tim Kaji Risiko RA mengkonfirmasi bahwa risiko pekerjaan yang dideskripsikan telah dikaji dan tindakan pengendalian yang memadai telah ditetapkan untuk menurunkan risiko pekerjaan."
- Below this, a sub-table header: "Tim Kaji Risiko"
- Columns: "Nama", "Jabatan", "Tanda tangan".
- Rows exactly for: "Risk Assessment Facilitator", "AA", "PA".

Table 3: Risk Assessment (RA) Reviewer & Matrix Guide
- Heading row spanning Col 1: "Risk Assessment (RA) Reviewer. Saya telah meninjau tindakan pengendalian yang ditetapkan dapat menurunkan risiko dan menyetujui pekerjaan untuk dilaksanakan."
- Col 1 Details: Columns for "Nama", "Tanda tangan", "Tanggal".
- Col 2 (The Guide Matrix): A reference guide showing the approval levels vertically stacked.
  - Row 1: "1-3 (rendah) dan 4 (rendah ke moderate): Site Controller" [Green Background]
  - Row 2: "5-9 (moderate): Manager Lini" [Yellow Background]
  - Row 3: "10-12 (moderate ke tinggi): Field Manager/Sr. Manager" [Orange Background]
  - Row 4: "15-25 (tinggi): General Manager" [Red Background]

Table 4: The Main JSA / Hazard Identification Table (The core analysis)
- MUST use a 2-tier header row with proper HTML rowspan and colspan.
- First Header Row MUST EXACTLY BE:
  - <th rowspan="2">No (1)</th>
  - <th rowspan="2">Deskripsi Langkah Pekerjaan (2)</th>
  - <th rowspan="2">Bahaya (3)</th>
  - <th rowspan="2">Dampak (4)</th>
  - <th colspan="3">Risiko Awal (5)</th>
  - <th rowspan="2">Tindakan Pengendalian (6)</th>
  - <th colspan="3">Risiko Sisa (7)</th>
- Second Header Row MUST EXACTLY BE:
  - <th>Keparahan (5a)</th>
  - <th>Kemungkinan (5b)</th>
  - <th>Tingkat Risiko (5c)</th>
  - <th>Keparahan (7a)</th>
  - <th>Kemungkinan (7b)</th>
  - <th>Tingkat Risiko (7c)</th>
- CRITICAL: You MUST fill in the actual analysis rows based on the job description! DO NOT leave the table empty. Generate at least 3 to 5 realistic, step-by-step job sequences with their hazards.
- Tindakan Pengendalian (6) MUST list the Hierarchy of Controls explicitly (1. Eliminasi, 2. Subtitusi, 3. Engineering, 4. Administratif, 5. APD).
- Clearly state the calculated Initial and Residual Risk scores as numbers (e.g. 3) in columns 5a, 5b, 7a, 7b. Multiply them to get Tingkat Risiko (5c, 7c) as a number (e.g. 9) and color the "Tingkat Risiko" cell background (Green/Yellow/Orange/Red) with dark text.

Table 5: Sign-off & Verification
- Section 1 Header MUST EXACTLY BE: "Identifikasi Bahaya Baru Ketika Pelaksanaan Pekerjaan" with columns:
  - No (1), Deskripsi Langkah Pekerjaan (2), Bahaya (3), Tindakan Pengendalian (4), Nama Pekerja Pelaksana (5), Paraf Pelaksana (6), Tanggal dan Paraf PA (7).
- Leave 3 empty rows here for the user.
- Section 2: "Diskusi Penyelesaian Pekerjaan & Lesson Learned". (Leave a large empty text area cell for notes).
- Section 3: "Nama, Paraf PA, dan Tanggal" alongside "Nama, Paraf AA, dan Tanggal".

CRITICAL UI/CSS RULES: The output will be displayed on a dark-themed app. You MUST inject inline CSS to ensure readability:
- Main text color must be very light (e.g., 'color: #e2e8f0;').
- Tables must have clean borders (e.g., 'border: 1px solid #4a5568;' and 'border-collapse: collapse; margin-bottom: 30px; width: 100%; font-family: sans-serif;').
- Table Headers (th) must have a distinct background (e.g., 'background-color: #2d3748;') and bright text ('color: #63b3ed;').
- Table Cells (td) must have adequate padding (e.g., 'padding: 10px 14px;').
- The Risk text backgrounds (Green, Yellow, Orange, Red) MUST have dark text ('color: #000; font-weight: bold; padding: 4px; display: inline-block; border-radius: 4px;') so they are readable!
DO NOT use markdown backticks (e.g. \`\`\`html). Output strictly the HTML code starting with the first table.`;
    } else {
        prompt = `Act as a Senior HSE (Health, Safety, and Environment) Officer with international certification (NEBOSH/OSHA) working for Pertamina Hulu Energi (PHE).
Create a highly professional and realistic Job Safety Analysis (JSA) document in ENGLISH based on this job description:
"${jobDesc}"

Format the output strictly as a single, clean, styled HTML table matching standard operational JSA formats.
The document MUST ONLY include ONE table:
Table: The Main JSA / Hazard Identification Table
- Headers MUST BE EXACTLY:
  - No (1)
  - Deskripsi Langkah Pekerjaan (2)
  - Bahaya (3)
  - Tindakan Pengendalian (4)
  - Nama Pekerja Pelaksana (5)
  - Paraf Pelaksana (6)
  - Tanggal dan Paraf PA (7)
- CRITICAL: You MUST fill in the actual analysis rows based on the job description! DO NOT leave the table empty. Generate at least 3 to 5 realistic, step-by-step job sequences with their hazards.
- DO NOT INCLUDE RISK SCORES OR MATRICES. Focus purely on the practical steps, hazards, and mitigations.
- Leave columns 5, 6, 7 blank for users to sign.

CRITICAL UI/CSS RULES: The output will be displayed on a dark-themed app. You MUST inject inline CSS to ensure readability:
- Main text color must be very light (e.g., 'color: #e2e8f0;').
- Tables must have clean borders (e.g., 'border: 1px solid #4a5568;' and 'border-collapse: collapse; margin-bottom: 30px; width: 100%; font-family: sans-serif;').
- Table Headers (th) must have a distinct background (e.g., 'background-color: #2d3748;') and bright text ('color: #63b3ed;').
- Table Cells (td) must have adequate padding (e.g., 'padding: 10px 14px;').
DO NOT use markdown backticks (e.g. \`\`\`html). Output strictly the HTML code.`;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5 } }) // Lower temp for more analytical/standard output
        });

        if (response.status === 429) throw new Error('Quota Exceeded: Mohon tunggu sejenak.');
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            // Clean up backticks if model still sends them
            responseText = responseText.replace(/```html/g, '').replace(/```/g, '').trim();
            
            // Parse markdown bold specifically since the model tends to output **bold**
            responseText = responseText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Add basic table styling if not provided by AI
            if (!responseText.includes('<style>')) {
                responseText = `
                 <style>
                    .jsa-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.95em; color: var(--text-color, #e0e0e0); }
                    .jsa-table th, .jsa-table td { border: 1px solid rgba(255,255,255,0.2); padding: 12px; text-align: left; vertical-align: top; }
                    .jsa-table th { background-color: rgba(255,255,255,0.05); font-weight: bold; color: var(--primary, #64B5F6); }
                    .jsa-header { border-bottom: 2px solid var(--primary, #64B5F6); padding-bottom: 10px; margin-bottom: 20px; }
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

        if (response.status === 429) throw new Error('Quota Exceeded: Mohon tunggu.');
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
        console.error('Failed to copy text: ', err);
        alert('Gagal menyalin teks.');
    });
}

function exportJSAToExcel() {
    const contentArea = document.getElementById('jsa-content');
    if (!contentArea || !contentArea.innerHTML) {
        alert('Gagal mengekspor: Dokumen kosong.');
        return;
    }

    // Clean up empty paragraphs
    let htmlContent = contentArea.innerHTML.replace(/<p><\/p>/g, '');

    const excelContent = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:x="urn:schemas-microsoft-com:office:excel" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <!--[if gte mso 9]>
    <xml>
        <x:ExcelWorkbook>
            <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                    <x:Name>JSA_PTW</x:Name>
                    <x:WorksheetOptions>
                        <x:DisplayGridlines/>
                    </x:WorksheetOptions>
                </x:ExcelWorksheet>
            </x:ExcelWorksheets>
        </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <meta charset="utf-8">
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; }
        th { background-color: #f0f0f0; }
    </style>
</head>
<body>
    <table>
        <tr>
            <td colspan="7" style="text-align:center; font-size: 20px; font-weight:bold; padding:20px;">
                HSE DEPARTMENT - AI Generated Job Safety Analysis & Permit to Work
            </td>
        </tr>
    </table>
    ${htmlContent}
</body>
</html>
    `;

    // Create a Blob containing the Excel data
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Set dynamic filename
    const now = new Date();
    const dateStr = now.getFullYear() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
    link.download = `JSA_PTW_${dateStr}.xls`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

async function exportJSAToPDF() {
    const contentArea = document.getElementById('jsa-content');
    if (!contentArea || !contentArea.innerHTML) {
        alert('Gagal mengekspor: Dokumen kosong.');
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Grab the raw HTML content and strip dark-theme inline styles
    let rawHtml = contentArea.innerHTML;
    rawHtml = rawHtml.replace(/<style[\s\S]*?<\/style>/gi, '');
    rawHtml = rawHtml.replace(/color\s*:\s*#[0-9a-fA-F]{6}\s*;?/gi, '');
    rawHtml = rawHtml.replace(/background-color\s*:\s*#2d3748\s*;?/gi, '');
    rawHtml = rawHtml.replace(/background-color\s*:\s*rgba\(255,255,255,0\.05\)\s*;?/gi, '');
    rawHtml = rawHtml.replace(/border\s*:\s*1px solid rgba\(255,255,255,0\.2\)\s*;?/gi, '');
    rawHtml = rawHtml.replace(/border\s*:\s*1px solid #4a5568\s*;?/gi, '');
    rawHtml = rawHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=800,width=1200');
    if (!printWindow) {
        alert("Browser Anda memblokir Popup! Izinkan popup untuk aplikasi ini agar fitur Print/PDF bisa berjalan.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>JSA_PTW_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    color: #000; 
                    background: #fff; 
                    font-size: 12px;
                }
                table { 
                    border-collapse: collapse; 
                    width: 100%; 
                    margin-bottom: 20px; 
                    page-break-inside: auto; 
                }
                tr { 
                    page-break-inside: avoid; 
                    page-break-after: auto; 
                }
                th, td { 
                    border: 1px solid #000; 
                    padding: 8px; 
                    text-align: left; 
                    vertical-align: top; 
                    word-wrap: break-word;
                }
                th { 
                    background-color: #f0f0f0 !important; 
                    text-align: center; 
                    font-weight: bold;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .risk-badge { 
                    color: #000 !important; 
                    font-weight: bold; 
                    padding: 4px; 
                    display: inline-block; 
                    border-radius: 4px; 
                    border: 1px solid #000;
                }
                @media print {
                    @page { 
                        size: landscape; 
                        margin: 10mm; 
                    }
                    body { 
                        padding: 0; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 3px solid #3182ce; padding-bottom: 10px;">
                <h2 style="margin: 0; color: #3182ce;">HSE DEPARTMENT</h2>
                <p style="margin: 5px 0 0 0; color: #4a5568; font-size: 14px;">AI Generated Job Safety Analysis & Permit to Work</p>
            </div>
            <div style="margin-bottom: 20px; font-size: 12px; color: #555;">
                <strong>Tanggal:</strong> ${dateStr} &nbsp; | &nbsp; <strong>Waktu:</strong> ${timeStr} WIB
            </div>
            ${rawHtml}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    // Tunggu sebentar agar gambar/tabel sepenuhnya di-render sebelum memanggil dialog Print Chrome/Safari
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// ==========================================
// AI Incident Investigator (RCA) LOGIC
// ==========================================

let rcaRecognition = null;
let isRcaRecording = false;

function initRcaSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Browser Anda tidak mendukung fitur Voice-to-Text. Gunakan Chrome.");
        return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until manually stopped
    recognition.interimResults = true;
    recognition.lang = 'id-ID'; // We default to Indonesian for easy dictation

    return recognition;
}

function toggleRcaVoiceInput() {
    const micBtn = document.getElementById('rca-mic-btn');
    const indicator = document.getElementById('rca-recording-indicator');
    const textArea = document.getElementById('rca-incident-desc');

    if (isRcaRecording) {
        // Stop recording
        if (rcaRecognition) {
            rcaRecognition.stop();
        }
        isRcaRecording = false;
        micBtn.innerHTML = '🎙️';
        micBtn.style.color = 'var(--text-muted)';
        indicator.classList.add('hidden');
    } else {
        // Start recording
        if (!rcaRecognition) {
            rcaRecognition = initRcaSpeechRecognition();
        }

        if (!rcaRecognition) return;

        rcaRecognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Append final sentences securely, but only preview interim ones
            if (finalTranscript !== '') {
                // Append to existing text but respect cursor position roughly by just adding to end.
                // Ideally we’d need complex cursor tracking, but append is safe for now.
                const currentVal = textArea.value;
                textArea.value = currentVal + (currentVal && !currentVal.endsWith(' ') ? ' ' : '') + finalTranscript;
            }
        };

        rcaRecognition.onerror = (event) => {
            console.error("RCA Speech recognition error", event.error);
            isRcaRecording = false;
            micBtn.innerHTML = '🎙️';
            micBtn.style.color = 'var(--text-muted)';
            indicator.classList.add('hidden');
        };

        rcaRecognition.onend = () => {
            // Failsafe auto-stop UI update
            if (isRcaRecording) {
                isRcaRecording = false;
                micBtn.innerHTML = '🎙️';
                micBtn.style.color = 'var(--text-muted)';
                indicator.classList.add('hidden');
            }
        };

        rcaRecognition.start();
        isRcaRecording = true;
        micBtn.innerHTML = '🔴';
        micBtn.style.color = '#e53e3e';
        indicator.classList.remove('hidden');
    }
}

async function generateRCADocument() {
    const incidentDesc = document.getElementById('rca-incident-desc').value.trim();
    const btn = document.getElementById('generate-rca-btn');
    const resultArea = document.getElementById('rca-result-area');
    const contentArea = document.getElementById('rca-content');

    if (!incidentDesc) {
        alert("Mohon ceritakan kronologi insiden terlebih dahulu.");
        return;
    }

    // Auto stop recording if they hit generate while still recording
    if (isRcaRecording) {
        toggleRcaVoiceInput();
    }

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('⚠️ API Key Gemini belum diatur di Settings.');
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Analyzing Incident & Plotting Root Causes... <div class="loading-spinner" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; margin-left: 5px;"></div>';
    btn.disabled = true;

    resultArea.classList.remove('hidden');
    contentArea.innerHTML = '<div class="loading-spinner" style="margin: 20px auto;"></div><p class="text-center text-muted">AI is investigating the timeline and building the RCA tree...</p>';

    document.getElementById('translate-rca-btn').innerHTML = '🇮🇩 Terjemahkan';

    let prompt = `Act as a Senior HSE (Health, Safety, and Environment) Lead Investigator with international certification (NEBOSH/OSHA) working for Pertamina Hulu Energi (PHE).
Analyze the following informal incident chronology and formulate a highly professional Root Cause Analysis (RCA) report in ENGLISH using the "5-Whys" methodology.

Incident Chronology Provided:
"${incidentDesc}"

Format the output strictly as a clean, styled HTML document containing professional tables.
The document MUST include:

1. A clear header: "INCIDENT INVESTIGATION & ROOT CAUSE ANALYSIS"
2. Table 1: Incident Summary
   - Columns: "Date of Analysis", "Incident Type" (e.g. Near Miss, Recondable, LTI), "Brief Description" (Formalize the provided chronology).
3. Table 2: Immediate Causes Analysis
   - Identify the direct "Unsafe Acts" and "Unsafe Conditions" that triggered this event.
4. Table 3: The 5-Whys Root Cause Analysis. THIS IS CRITICAL.
   - Use a structured table tracing from the incident down to the systemic root cause through at least 4-5 "Why" iterations.
   - Example Structure: "Problem Statement", "Why 1", "Why 2", "Why 3", "Why 4", "Root Cause (Why 5)".
   - The final Root Cause must point to a systemic failure (e.g., Lack of training, inadequate procedure, management failure, not just "worker made a mistake").
5. Table 4: Corrective and Preventive Actions (CAPA)
   - Action Items, Responsibility (Roles), Target Date.

CRITICAL UI/CSS RULES: The output will be displayed on a dark-themed app. You MUST inject inline CSS to ensure readability:
- Main text color must be very light (e.g., 'color: #e2e8f0;').
- Tables must have clean borders (e.g., 'border: 1px solid #4a5568;' and 'border-collapse: collapse; margin-bottom: 30px; width: 100%; font-family: sans-serif;').
- Table Headers (th) must have a distinct background (e.g., 'background-color: #c53030;') and bright text ('color: #fff;').
- Table Cells (td) must have adequate padding (e.g., 'padding: 10px 14px;').
- Highlight the final Root Cause text in strong red/orange to make it stand out.
DO NOT use markdown backticks (e.g. \`\`\`html). Output strictly the HTML code starting directly with the heading or first table.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5 } })
        });

        if (response.status === 429) throw new Error('Quota Exceeded: Mohon tunggu.');
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            responseText = responseText.replace(/```html/g, '').replace(/```/g, '').trim();

            contentArea.innerHTML = responseText;
            currentRcaContentEn = responseText;
            currentRcaContentId = "";

        } else {
            throw new Error("Empty response output");
        }
    } catch (error) {
        console.error('RCA generation error:', error);
        contentArea.innerHTML = '<p class="text-danger">Gagal membuat analisis. Periksa API key atau koneksi internet Anda.</p>';
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function translateRCADocument() {
    if (!currentRcaContentEn) return;

    const contentArea = document.getElementById('rca-content');
    const translateBtn = document.getElementById('translate-rca-btn');

    if (currentRcaContentId && translateBtn.innerHTML.includes('🇬🇧')) {
        contentArea.innerHTML = currentRcaContentEn;
        translateBtn.innerHTML = '🇮🇩 Terjemahkan';
        return;
    }

    if (currentRcaContentId) {
        contentArea.innerHTML = currentRcaContentId;
        translateBtn.innerHTML = '🇬🇧 Show English';
        return;
    }

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) return;

    const originalHtml = contentArea.innerHTML;
    contentArea.innerHTML = '<div class="loading-spinner" style="margin: 20px auto;"></div><p class="text-center text-muted">Translating RCA document to Indonesian...</p>';
    translateBtn.disabled = true;

    const prompt = `Translate the following Root Cause Analysis HTML into formal Indonesian (Bahasa Indonesia baku yang digunakan di industri Migas).
Keep ALL the HTML tags and structure exactly the same. ONLY translate the text content inside the tags.
Do not wrap it in markdown block.
Here is the HTML:
${currentRcaContentEn}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3 } })
        });

        if (response.status === 429) throw new Error('Quota Exceeded: Mohon tunggu.');
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            responseText = responseText.replace(/```html/g, '').replace(/```/g, '').trim();
            currentRcaContentId = responseText;
            contentArea.innerHTML = currentRcaContentId;
            translateBtn.innerHTML = '🇬🇧 Show English';
        } else {
            throw new Error("Empty response output");
        }
    } catch (error) {
        console.error('RCA translation error:', error);
        alert('Gagal menerjemahkan dokumen RCA.');
        contentArea.innerHTML = originalHtml;
    } finally {
        translateBtn.disabled = false;
    }
}

function copyRcaText() {
    const contentArea = document.getElementById('rca-content');
    if (!contentArea || !contentArea.innerText) return;

    const textToCopy = contentArea.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.getElementById('copy-rca-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Gagal menyalin teks.');
    });
}

// ==========================================
// AI Daily TBT & P5M Briefing Generator LOGIC
// ==========================================

async function generateTBTDocument() {
    const operationDesc = document.getElementById('tbt-operation-desc').value.trim();
    const btn = document.getElementById('generate-tbt-btn');
    const resultArea = document.getElementById('tbt-result-area');
    const contentArea = document.getElementById('tbt-content');

    if (!operationDesc) {
        alert("Mohon ketik ringkasan operasi hari ini terlebih dahulu.");
        return;
    }

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('⚠️ API Key Gemini belum diatur di Settings.');
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Drafting TBT Briefing Script... <div class="loading-spinner" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; margin-left: 5px;"></div>';
    btn.disabled = true;

    resultArea.classList.remove('hidden');
    contentArea.innerHTML = '<div class="loading-spinner" style="margin: 20px auto;"></div><p class="text-center text-muted">AI is preparing the morning safety briefing...</p>';

    document.getElementById('translate-tbt-btn').innerHTML = '🇮🇩 Terjemahkan';

    let prompt = `Act as a Senior Rig Superintendent and HSE Coordinator with Pertamina Hulu Energi (PHE).
Draft a highly engaging, professional, and practical Daily Toolbox Talk (TBT) / P5M Briefing Script in ENGLISH based on today's planned operations:
"${operationDesc}"

Format the output strictly as a clean, styled HTML document. Make it highly readable so a supervisor can directly read it to the crew.
The briefing MUST include these sections:

1. <h2 style="color: #ed8936; border-bottom: 1px solid #ed8936; padding-bottom: 5px;">📢 Daily Toolbox Talk (TBT)</h2>
2. <strong>Operation Goal:</strong> Briefly state what we are trying to achieve today based on the input.
3. <h3>⚠️ Top Critical Hazards Today</h3>
   - Use an unordered list (<ul>) to highlight the 3 most dangerous/fatal hazards specific to today's task (e.g., Dropped Objects, High Pressure, Line of Fire).
4. <h3>🛑 Red Zones & Mandatory Controls</h3>
   - Use a styled box (e.g. <div style="background-color: rgba(229, 62, 62, 0.1); border-left: 4px solid #e53e3e; padding: 10px;">) to explain which physical areas are completely restricted today and the mandatory mitigations.
5. <h3>✅ Mandatory Physical Checks & PPE</h3>
   - Specific equipment or PPE that MUST be verified before work starts (e.g., "Check harness expiration", "Bump test H2S monitor").
6. <h3>🤝 SWA & Closing</h3>
   - A strong, motivational closing statement explicitly reminding every crew member they have the "Stop Work Authority" (SWA) if they see anything unsafe.

CRITICAL UI/CSS RULES: The output will be displayed on a dark-themed app. You MUST inject inline CSS to ensure readability:
- Main text color must be very light (e.g., 'color: #e2e8f0;').
- Headings (h2, h3) must be colored brightly (e.g., '#ed8936', '#fb6340').
- Bullet points must have some spacing (e.g., 'margin-bottom: 8px;').
DO NOT use markdown backticks (e.g. \`\`\`html). Output strictly the HTML code starting directly with the heading.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6 } }) // Slightly higher temp for more natural speaking tone
        });

        if (response.status === 429) throw new Error('Quota Exceeded: Mohon tunggu.');
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            responseText = responseText.replace(/```html/g, '').replace(/```/g, '').trim();

            contentArea.innerHTML = responseText;
            currentTbtContentEn = responseText;
            currentTbtContentId = "";

        } else {
            throw new Error("Empty response output");
        }
    } catch (error) {
        console.error('TBT generation error:', error);
        contentArea.innerHTML = '<p class="text-danger">Gagal membuat Draft TBT. Periksa API key atau koneksi internet Anda.</p>';
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function translateTBTDocument() {
    if (!currentTbtContentEn) return;

    const contentArea = document.getElementById('tbt-content');
    const translateBtn = document.getElementById('translate-tbt-btn');

    if (currentTbtContentId && translateBtn.innerHTML.includes('🇬🇧')) {
        contentArea.innerHTML = currentTbtContentEn;
        translateBtn.innerHTML = '🇮🇩 Terjemahkan';
        return;
    }

    if (currentTbtContentId) {
        contentArea.innerHTML = currentTbtContentId;
        translateBtn.innerHTML = '🇬🇧 Show English';
        return;
    }

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) return;

    const originalHtml = contentArea.innerHTML;
    contentArea.innerHTML = '<div class="loading-spinner" style="margin: 20px auto;"></div><p class="text-center text-muted">Translating TBT Briefing to Indonesian...</p>';
    translateBtn.disabled = true;

    const prompt = `Translate the following Toolbox Talk (TBT) HTML script into conversational yet formal Indonesian (Bahasa Indonesia campuran lapangan Migas, terdengar natural untuk diucapkan saat briefing pagi).
Keep ALL the HTML tags and structure exactly the same. ONLY translate the text content inside the tags.
Do not wrap it in markdown block.
Here is the HTML:
${currentTbtContentEn}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4 } })
        });

        if (response.status === 429) throw new Error('Quota Exceeded: Mohon tunggu.');
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            responseText = responseText.replace(/```html/g, '').replace(/```/g, '').trim();
            currentTbtContentId = responseText;
            contentArea.innerHTML = currentTbtContentId;
            translateBtn.innerHTML = '🇬🇧 Show English';
        } else {
            throw new Error("Empty response output");
        }
    } catch (error) {
        console.error('TBT translation error:', error);
        alert('Gagal menerjemahkan naskah TBT.');
        contentArea.innerHTML = originalHtml;
    } finally {
        translateBtn.disabled = false;
    }
}

function copyTbtText() {
    const contentArea = document.getElementById('tbt-content');
    if (!contentArea || !contentArea.innerText) return;

    const textToCopy = contentArea.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.getElementById('copy-tbt-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Gagal menyalin teks.');
    });
}

// ==========================================
// AI HSE Regulation Expert (Chatbot) LOGIC
// ==========================================

let hseChatRecognition = null;
let isHseChatRecording = false;

function initHseSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Browser Anda tidak mendukung fitur Voice-to-Text. Gunakan Chrome.");
        return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';

    return recognition;
}

function toggleHseChatVoiceInput() {
    const micBtn = document.getElementById('hse-chat-mic-btn');
    const indicator = document.getElementById('hse-chat-recording-indicator');
    const inputArea = document.getElementById('hse-chat-input');

    if (isHseChatRecording) {
        if (hseChatRecognition) {
            hseChatRecognition.stop();
        }
        isHseChatRecording = false;
        micBtn.innerHTML = '🎙️';
        micBtn.style.color = 'var(--text-muted)';
        indicator.classList.add('hidden');
    } else {
        if (!hseChatRecognition) {
            hseChatRecognition = initHseSpeechRecognition();
        }

        if (!hseChatRecognition) return;

        hseChatRecognition.onresult = (event) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                }
            }

            if (finalTranscript !== '') {
                const currentVal = inputArea.value;
                inputArea.value = currentVal + (currentVal && !currentVal.endsWith(' ') ? ' ' : '') + finalTranscript;
            }
        };

        hseChatRecognition.onerror = (event) => {
            console.error("HSE Chat Speech recognition error", event.error);
            isHseChatRecording = false;
            micBtn.innerHTML = '🎙️';
            micBtn.style.color = 'var(--text-muted)';
            indicator.classList.add('hidden');
        };

        hseChatRecognition.onend = () => {
            if (isHseChatRecording) {
                isHseChatRecording = false;
                micBtn.innerHTML = '🎙️';
                micBtn.style.color = 'var(--text-muted)';
                indicator.classList.add('hidden');
            }
        };

        hseChatRecognition.start();
        isHseChatRecording = true;
        micBtn.innerHTML = '🔴';
        micBtn.style.color = '#38b2ac';
        indicator.classList.remove('hidden');
    }
}

function _parseMarkdownToHtml(text) {
    if (!text) return '';
    let html = text.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([\s\S]*?)\*/g, '<em>$1</em>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

async function sendHseChatMessage() {
    const inputField = document.getElementById('hse-chat-input');
    const userText = inputField.value.trim();
    const btn = document.getElementById('send-hse-chat-btn');
    const chatContainer = document.getElementById('hse-chat-history');

    if (!userText) return;

    // Auto stop recording
    if (isHseChatRecording) {
        toggleHseChatVoiceInput();
    }

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('⚠️ API Key Gemini belum diatur di Settings.');
        return;
    }

    // Print User Bubble
    const userBubble = document.createElement('div');
    userBubble.style.cssText = 'align-self: flex-end; background: linear-gradient(135deg, #38b2ac 0%, #319795 100%); color: white; padding: 10px 14px; border-radius: 12px; border-bottom-right-radius: 2px; max-width: 85%; line-height: 1.5; font-size: 0.9rem; margin-top: 5px;';
    userBubble.innerHTML = `<strong>👩‍🔧 Anda:</strong><br>${userText}`;
    chatContainer.appendChild(userBubble);

    inputField.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Append to memory array
    hseChatHistory.push({
        role: "user",
        parts: [{ text: userText }]
    });

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Menganalisis Regulasi... <div class="loading-spinner" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; margin-left: 5px;"></div>';
    btn.disabled = true;

    // Print loading bubble
    const loadingBubble = document.createElement('div');
    loadingBubble.id = 'hse-chat-loading-bubble';
    loadingBubble.style.cssText = 'align-self: flex-start; background: var(--surface-hover); color: var(--text-color); padding: 10px 14px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 85%; font-size: 0.9rem; margin-top: 5px; display: flex; align-items: center; gap: 10px;';
    loadingBubble.innerHTML = `<div class="loading-spinner" style="width: 15px; height: 15px;"></div> Mencari referensi regulasi...`;
    chatContainer.appendChild(loadingBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: hseChatHistory,
                generationConfig: { temperature: 0.3 } // Low temp for regulatory accuracy
            })
        });

        if (response.status === 429) throw new Error('Quota Exceeded: Mohon tunggu.');
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        loadingBubble.remove();

        if (responseText) {
            // Append AI response to memory
            hseChatHistory.push({
                role: "model",
                parts: [{ text: responseText }]
            });

            // Print AI Bubble
            const cleanHtml = _parseMarkdownToHtml(responseText);
            const aiBubble = document.createElement('div');
            aiBubble.style.cssText = 'align-self: flex-start; background: var(--surface-hover); color: var(--text-color); border: 1px solid var(--border); padding: 10px 14px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 85%; line-height: 1.5; font-size: 0.9rem; margin-top: 5px;';
            aiBubble.innerHTML = `<strong>🤖 System:</strong><br>${cleanHtml}`;
            chatContainer.appendChild(aiBubble);

        } else {
            throw new Error("Empty response output");
        }
    } catch (error) {
        console.error('HSE Chatbot error:', error);
        if (document.getElementById('hse-chat-loading-bubble')) {
            document.getElementById('hse-chat-loading-bubble').remove();
        }
        const errorBubble = document.createElement('div');
        errorBubble.style.cssText = 'align-self: center; background: rgba(229, 62, 62, 0.1); color: #e53e3e; padding: 5px 10px; border-radius: 8px; font-size: 0.8rem; margin-top: 5px; border: 1px solid #e53e3e;';
        errorBubble.innerText = '⚠️ Gagal terhubung dengan server regulasi.';
        chatContainer.appendChild(errorBubble);

        // Remove the failed user prompt from memory so it doesn't break future requests
        hseChatHistory.pop();
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}
