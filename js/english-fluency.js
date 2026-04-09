document.addEventListener('DOMContentLoaded', () => {
    const genBtn = document.getElementById('gen-fluency-btn');
    const buildBtn = document.getElementById('build-sentence-btn');
    const builderInput = document.getElementById('fluency-builder-input');
    const intLevelBtn = document.getElementById('level-intermediate');
    const proLevelBtn = document.getElementById('level-pro');

    if (intLevelBtn) intLevelBtn.addEventListener('click', () => setFluencyLevel('intermediate'));
    if (proLevelBtn) proLevelBtn.addEventListener('click', () => setFluencyLevel('pro'));

    if (genBtn) genBtn.addEventListener('click', generateFluencyDaily);
    if (buildBtn) buildBtn.addEventListener('click', buildSimpleSentence);
    if (builderInput) {
        builderInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                buildSimpleSentence();
            }
        });
    }
});

async function generateFluencyDaily() {
    const contentArea = document.getElementById('fluency-daily-content');
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;

    if (!apiKey) {
        alert("⚠️ API Key Gemini belum diatur. Silakan atur di Settings.");
        return;
    }

    contentArea.innerHTML = `
        <div style="text-align: center; padding: 10px;">
            <div class="loading-spinner" style="margin: 0 auto; width: 20px; height: 20px;"></div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">Mencari ungkapan natural untuk Anda...</p>
        </div>
    `;

    const prompt = `Anda adalah AI English Fluency Coach untuk level ${currentLevel.toUpperCase()}. 
    Tugas: Berikan 1 ungkapan bahasa Inggris yang NATURAL dan SERU.
    PENTING: JANGAN berikan "Bite the bullet" atau "Spill the beans" karena pengguna sudah sering mendapatkannya. Berikan sesuatu yang baru dan segar!

    - Jika INTERMEDIATE: Fokus pada Idioms/Phrasal Verbs harian.
    - Jika PRO: Fokus pada Professional Collocations, Advanced Nuances, atau Business English (Elegant & Expert).

    Output HANYA JSON:
    {
      "word": "ungkapan",
      "word_translation": "arti",
      "word_pronunciation": "cara baca",
      "phrase": "contoh kalimat",
      "phrase_translation": "arti contoh",
      "explanation": "tips/nuansa"
    }`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ role: "user", parts: [{ text: prompt }] }], 
                generationConfig: { 
                    temperature: 1.0,
                    responseMimeType: "application/json" 
                } 
            })
        });

        if (response.status === 429) throw new Error('Quota Exceeded: Terlalu banyak permintaan. Mohon tunggu sejenak.');
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'API Error');
        }

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            const content = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
            renderFluencyDaily(content);
            updateFluencyMission(content.phrase);
        }
    } catch (error) {
        console.error('Fluency generation error:', error);
        contentArea.innerHTML = '<p class="text-danger text-center">Gagal mengambil materi. Coba lagi.</p>';
    }
}

function renderFluencyDaily(data) {
    const area = document.getElementById('fluency-daily-content');
    const badgeLabel = data.word_type || (currentLevel === 'pro' ? 'EXPERT PHRASING 💎' : 'IDIOM/PHRASAL VERB');
    const badgeColor = currentLevel === 'pro' ? '#a855f7' : '#10b981';

    area.style.borderStyle = 'solid';
    area.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.8rem; background: ${badgeColor}; color: white; padding: 2px 6px; border-radius: 4px;">${badgeLabel}</span>
                <strong style="font-size: 1.2rem; color: var(--primary);">${data.word}</strong>
                <button onclick="playPronunciation('${data.word.replace(/'/g, "\\'")}', 'en-US')" class="icon-btn" style="font-size: 0.9rem;">🔊</button>
            </div>
            <p style="margin: 4px 0; color: var(--text-color);">${data.word_translation} <small style="color: var(--text-muted); font-style: italic;">(${data.word_pronunciation})</small></p>
        </div>
        <hr style="border: none; border-top: 1px dashed var(--border); margin: 10px 0;">
        <div style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.8rem; background: var(--secondary); color: white; padding: 2px 6px; border-radius: 4px;">NATURAL USAGE</span>
                <strong style="color: var(--text-color); font-size: 1.1rem;">"${data.phrase}"</strong>
                <button onclick="playPronunciation('${data.phrase.replace(/'/g, "\\'")}', 'en-US')" class="icon-btn" style="font-size: 0.9rem;">🔊</button>
            </div>
            <p style="margin: 4px 0; color: var(--text-muted); font-style: italic;">"${data.phrase_translation}"</p>
        </div>
        <div style="font-size: 0.85rem; background: var(--bg-color); padding: 10px; border-radius: 6px; margin-top: 10px;">
            <strong>💡 Contextual Tip:</strong> ${data.explanation}
        </div>
    `;
}

async function buildSimpleSentence() {
    const input = document.getElementById('fluency-builder-input');
    const resultArea = document.getElementById('fluency-builder-result');
    const text = input.value.trim();

    if (!text) return;

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) return;

    resultArea.classList.remove('hidden');
    resultArea.innerHTML = '<div class="loading-spinner" style="margin: 10px auto; width: 20px; height: 20px;"></div><p class="text-center text-muted">Menganalisis kalimat...</p>';

    const prompt = `Anda adalah AI Natural English Translator level ${currentLevel.toUpperCase()}.
    Input: "${text}"

    Tugas: Berikan terjemahan paling natural. 
    - INTERMEDIATE: Gunakan phrasal verbs/idioms.
    - PRO: Gunakan professional/elegant register.

    Format JSON:
    {
      "translation": "Natural translation",
      "breakdown": "Kenapa ini natural",
      "alternatives": ["Professional: ...", "Casual: ..."],
      "intermediate_tip": "Tips nuansa/etika"
    }
    JANGAN TAMBAHKAN TEKS LAIN.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ role: "user", parts: [{ text: prompt }] }], 
                generationConfig: { 
                    temperature: 0.7,
                    responseMimeType: "application/json" 
                } 
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'API Error');
        }

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            const content = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
            
            resultArea.innerHTML = `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <strong style="font-size: 1.1rem; color: var(--primary);">${content.translation}</strong>
                        <button onclick="playPronunciation('${content.translation.replace(/'/g, "\\'")}', 'en-US')" class="icon-btn">🔊</button>
                    </div>
                </div>
                <div style="font-size: 0.85rem; line-height: 1.4; color: var(--text-color); margin-bottom: 10px;">
                    <strong>📖 Nuance:</strong> ${content.breakdown}
                </div>
                 <div style="font-size: 0.85rem; line-height: 1.4; color: var(--text-muted); margin-bottom: 10px;">
                    <strong>🔄 Variations:</strong><br>
                    ${content.alternatives.map(a => `• ${a} <button onclick="playPronunciation('${a.split(':')[1]?.trim().replace(/'/g, "\\'") || a.replace(/'/g, "\\'")}', 'en-US')" class="icon-btn" style="font-size: 0.7rem; padding: 0;">🔊</button>`).join('<br>')}
                </div>
                <div style="font-size: 0.85rem; padding: 10px; background: var(--bg-color); border-radius: 6px; border-left: 3px solid var(--secondary);">
                    <strong>💡 Pro Tip:</strong> ${content.intermediate_tip}
                </div>
            `;
        }
    } catch (error) {
        console.error('Sentence builder error:', error);
        resultArea.innerHTML = '<p class="text-danger">Gagal memproses kata. Periksa koneksi atau API Key.</p>';
    }
}

function updateFluencyMission(phrase) {
    const box = document.getElementById('fluency-mission-box');
    box.style.borderStyle = 'solid';
    box.innerHTML = `
        <p style="margin-bottom: 15px; font-weight: 500;">Misi: Mari tirukan kalimat ini dengan lantang!</p>
        <div style="background: var(--bg-color); padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 15px; border: 1px solid var(--border);">
            <h4 style="margin: 0; color: var(--primary); font-size: 1.2rem;">"${phrase}"</h4>
            <button onclick="playPronunciation('${phrase.replace(/'/g, "\\'")}', 'en-US')" class="btn btn-secondary mt-sm" style="padding: 6px 15px; font-size: 0.9rem;">🔊 Dengarkan Dulu</button>
        </div>
        
        <div id="mission-stt-area" style="text-align: center;">
            <button id="mission-mic-btn" onclick="startMissionSTT('${phrase.replace(/'/g, "\\'")}')" class="btn btn-primary" style="width: 100%; border-radius: 50px;">
                🎙️ Tekan & Katakan (Record)
            </button>
            <p id="mission-status" class="text-muted mt-sm" style="font-size: 0.8rem; min-height: 20px;"></p>
        </div>
        <div id="mission-feedback" class="hidden mt-sm" style="padding: 10px; border-radius: 6px; text-align: center; font-weight: 600;"></div>
    `;
}

let missionRecognition = null;

function startMissionSTT(targetText) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Browser Anda tidak mendukung Voice Recognition.");
        return;
    }

    const btn = document.getElementById('mission-mic-btn');
    const status = document.getElementById('mission-status');
    const feedback = document.getElementById('mission-feedback');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    missionRecognition = new SpeechRecognition();
    missionRecognition.lang = 'en-US';
    missionRecognition.interimResults = false;

    missionRecognition.onstart = () => {
        btn.innerHTML = '🛑 Sedang Mendengarkan...';
        btn.style.background = 'var(--danger)';
        status.innerText = "Katakan kalimat di atas...";
    };

    missionRecognition.onresult = (event) => {
        const resultText = event.results[0][0].transcript.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
        const targetClean = targetText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
        
        console.log('STT Result:', resultText, 'Target:', targetClean);
        
        feedback.classList.remove('hidden');
        if (resultText === targetClean || targetClean.includes(resultText) || resultText.includes(targetClean)) {
            feedback.innerHTML = "✨ Awesome! Pengucapan Anda Tepat! (+10 XP)";
            feedback.style.color = 'var(--success)';
            feedback.style.background = 'rgba(16, 185, 129, 0.1)';
            if (typeof addXP === 'function') addXP(10, 'Fluency Practice');
        } else {
            feedback.innerHTML = `🧐 Hampir! Anda bilang: "${resultText}". Coba lagi ya!`;
            feedback.style.color = 'var(--danger)';
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
        }
    };

    missionRecognition.onerror = (event) => {
        status.innerText = "Error: " + event.error;
        resetMissionBtn();
    };

    missionRecognition.onend = () => {
        resetMissionBtn();
    };

    missionRecognition.start();
}

function resetMissionBtn() {
    const btn = document.getElementById('mission-mic-btn');
    if (btn) {
        btn.innerHTML = '🎙️ Tekan & Katakan (Record)';
        btn.style.background = 'var(--primary)';
    }
}

let currentLevel = 'intermediate'; // Default to user proficiency

function setFluencyLevel(level) {
    currentLevel = level;
    const intBtn = document.getElementById('level-intermediate');
    const proBtn = document.getElementById('level-pro');
    const levelDesc = document.getElementById('level-desc');
    const step1Label = document.querySelector('#english-fluency-screen .badge-ai');
    const step1Desc = document.querySelector('#english-fluency-screen [style*="border-left: 4px solid #10b981;"] p');
    const step2Title = document.querySelector('#english-fluency-screen [style*="border-left: 4px solid #3b82f6;"] h3');

    if (level === 'intermediate') {
        // Tab styling
        if (intBtn) {
            intBtn.style.background = 'var(--primary)';
            intBtn.style.color = 'var(--bg-primary)';
            intBtn.style.fontWeight = 'bold';
            intBtn.style.boxShadow = '0 4px 10px var(--primary-glow)';
        }

        if (proBtn) {
            proBtn.style.background = 'transparent';
            proBtn.style.color = 'var(--text-muted)';
            proBtn.style.fontWeight = 'normal';
            proBtn.style.boxShadow = 'none';
        }

        if (levelDesc) {
            levelDesc.innerText = 'Fokus: Idioms, Phrasal Verbs, & Natural Phrasing.';
            levelDesc.style.color = 'var(--primary)';
        }
        if (step1Label) {
            step1Label.innerText = 'Idiom & Phrasal Verb';
            step1Label.style.background = '#10b981';
        }
        if (step1Desc) step1Desc.innerText = 'Ungkapan sehari-hari yang membuat Anda terdengar lebih seperti native speaker.';
        if (step2Title) step2Title.innerText = '🧱 Step 2: Natural Sentence Builder';
    } else {
        // PRO Level styling (Purple/Indigo theme)
        const proColor = '#a855f7'; // Purple
        const proGlow = 'rgba(168, 85, 247, 0.5)';
        
        if (proBtn) {
            proBtn.style.background = proColor;
            proBtn.style.color = 'white';
            proBtn.style.fontWeight = 'bold';
            proBtn.style.boxShadow = `0 4px 10px ${proGlow}`;
        }

        if (intBtn) {
            intBtn.style.background = 'transparent';
            intBtn.style.color = 'var(--text-muted)';
            intBtn.style.fontWeight = 'normal';
            intBtn.style.boxShadow = 'none';
        }

        if (levelDesc) {
            levelDesc.innerText = 'Fokus: Advanced Nuances, Formal Register, & Expert Fluency.';
            levelDesc.style.color = proColor;
        }
        if (step1Label) {
            step1Label.innerText = 'Expert Phrasing 💎';
            step1Label.style.background = proColor;
        }
        if (step1Desc) step1Desc.innerText = 'Pelajari cara bicara penutur asli di tingkat profesional dan akademik.';
        if (step2Title) step2Title.innerText = '🧱 Step 2: Expert Sentence Builder';
    }
}
