/**
 * OXFORD 3000 VOCABULARY MASTERY - AI DISCOVERY EDITION
 * Fetches words from Gemini and caches them in IndexedDB
 */

let currentOxfordLevel = 'A1';
let oxfordMastery = {};
let discoveredWords = []; // Array of word objects for current level
let currentOxfordWord = null;

document.addEventListener('DOMContentLoaded', () => {
    initOxfordVocab();
});

async function initOxfordVocab() {
    // 1. Initial Data Load
    await loadOxfordMastery();
    
    // 2. Event Listeners
    const levelCards = document.querySelectorAll('.oxford-level-card');
    levelCards.forEach(card => {
        card.addEventListener('click', async () => {
            levelCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentOxfordLevel = card.dataset.level;
            await loadLevelWords();
            renderOxfordWordList();
        });
    });

    const discoverBtn = document.getElementById('oxford-load-more-btn');
    if (discoverBtn) {
        discoverBtn.innerText = '🧠 Temukan Kata Baru (AI)';
        discoverBtn.onclick = discoverMoreWords;
    }

    const masteryBtn = document.getElementById('oxford-mastery-btn');
    if (masteryBtn) {
        masteryBtn.onclick = toggleWordMastery;
    }

    const aiGenBtn = document.getElementById('oxford-ai-gen-btn');
    if (aiGenBtn) {
        aiGenBtn.onclick = generateOxfordAiExample;
    }

    const closeBtn = document.getElementById('close-oxford-modal-btn');
    if (closeBtn) {
        closeBtn.onclick = closeOxfordModal;
    }

    const audioBtn = document.getElementById('oxford-modal-audio');
    if (audioBtn) {
        audioBtn.onclick = () => {
            if (currentOxfordWord && typeof playPronunciation === 'function') {
                playPronunciation(currentOxfordWord.word, 'en-US');
            }
        };
    }

    // Initial render
    await loadLevelWords();
    renderOxfordWordList();
    updateOxfordProgressBars();
}

async function loadOxfordMastery() {
    if (typeof idbGetAll === 'function') {
        const masteryList = await idbGetAll('oxford_mastery');
        oxfordMastery = {};
        masteryList.forEach(item => {
            oxfordMastery[item.id] = item.status;
        });
    }
}

async function loadLevelWords() {
    if (typeof idbGetAll === 'function') {
        const allWords = await idbGetAll('oxford_words');
        discoveredWords = allWords.filter(w => w.level === currentOxfordLevel);
    }
}

async function saveDiscoveredWord(wordObj) {
    if (typeof idbSave === 'function') {
        await idbSave('oxford_words', {
            id: wordObj.word.toLowerCase(),
            ...wordObj,
            level: currentOxfordLevel,
            updatedAt: new Date().toISOString()
        });
    }
}

async function discoverMoreWords() {
    const btn = document.getElementById('oxford-load-more-btn');
    const listArea = document.getElementById('oxford-word-list');
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;

    if (!apiKey) {
        alert("API Key Gemini belum diset.");
        return;
    }

    btn.disabled = true;
    const originalText = btn.innerText;
    btn.innerHTML = '<div class="loading-spinner" style="width:16px;height:16px;margin:0 auto;"></div>';

    // Get list of already discovered words for this level to avoid duplicates
    const existingWords = discoveredWords.map(w => w.word).join(', ');
    
    const prompt = `Anda adalah AI English Teacher. 
    Berikan 10 kata berbeda dari daftar "Oxford 3000"™ untuk level CEFR ${currentOxfordLevel}.
    PENTING: Jangan berikan kata-kata ini karena sudah ditemukan: [${existingWords}].
    
    Output HANYA JSON array:
    [
      {"word": "word", "trans": "terjemahan", "def": "simple definition", "ipa": "/ipa/"},
      ...
    ]`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const newWords = JSON.parse(cleanText);
            
            for (const w of newWords) {
                await saveDiscoveredWord(w);
            }
            
            await loadLevelWords();
            renderOxfordWordList();
            updateOxfordProgressBars();
        }
    } catch (e) {
        console.error(e);
        alert("Gagal menemukan kata baru. Coba lagi.");
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

function renderOxfordWordList() {
    const listArea = document.getElementById('oxford-word-list');
    const levelTitle = document.getElementById('oxford-current-level-title');
    const countBadge = document.getElementById('oxford-count-badge');
    
    if (!listArea) return;

    levelTitle.innerText = `Level ${currentOxfordLevel} Discovered`;
    
    const masteredCount = discoveredWords.filter(w => oxfordMastery[w.word.toLowerCase()] === 'mastered').length;
    countBadge.innerText = `${masteredCount} / ${discoveredWords.length}`;

    listArea.innerHTML = '';
    
    if (discoveredWords.length === 0) {
        listArea.innerHTML = '<p class="text-muted text-center" style="grid-column: 1/-1; padding: 20px;">Belum ada kata ditemukan. Klik tombol di bawah untuk eksplorasi!</p>';
        return;
    }

    discoveredWords.forEach(w => {
        const isMastered = oxfordMastery[w.word.toLowerCase()] === 'mastered';
        const div = document.createElement('div');
        div.className = `oxford-word-item ${isMastered ? 'mastered' : ''}`;
        div.innerText = w.word;
        div.onclick = () => openOxfordModal(w);
        listArea.appendChild(div);
    });
}

function openOxfordModal(wordObj) {
    currentOxfordWord = wordObj;
    const modal = document.getElementById('oxford-learning-modal');
    const status = oxfordMastery[wordObj.word.toLowerCase()] === 'mastered';
    
    document.getElementById('oxford-modal-word').innerText = wordObj.word;
    document.getElementById('oxford-modal-ipa').innerText = wordObj.ipa || '';
    document.getElementById('oxford-modal-translation').innerText = wordObj.trans;
    document.getElementById('oxford-modal-def').innerText = wordObj.def;
    
    const masteryBtn = document.getElementById('oxford-mastery-btn');
    masteryBtn.innerText = status ? '🔄 Belum Dikuasai' : '✅ Kuasai Kata';
    masteryBtn.style.background = status ? 'var(--secondary)' : 'var(--primary)';

    document.getElementById('oxford-ai-example').style.display = 'none';
    modal.classList.remove('hidden');
}

function closeOxfordModal() {
    document.getElementById('oxford-learning-modal').classList.add('hidden');
}

async function toggleWordMastery() {
    if (!currentOxfordWord) return;
    
    const wordId = currentOxfordWord.word.toLowerCase();
    const currentStatus = oxfordMastery[wordId];
    const newStatus = currentStatus === 'mastered' ? 'learning' : 'mastered';
    
    const data = {
        id: wordId,
        level: currentOxfordLevel,
        status: newStatus,
        updatedAt: new Date().toISOString()
    };

    if (typeof idbSave === 'function') {
        await idbSave('oxford_mastery', data);
    }
    
    oxfordMastery[wordId] = newStatus;
    
    renderOxfordWordList();
    updateOxfordProgressBars();
    
    const masteryBtn = document.getElementById('oxford-mastery-btn');
    masteryBtn.innerText = newStatus === 'mastered' ? '🔄 Belum Dikuasai' : '✅ Kuasai Kata';
    masteryBtn.style.background = newStatus === 'mastered' ? 'var(--secondary)' : 'var(--primary)';

    if (newStatus === 'mastered') {
        if (typeof addXP === 'function') addXP(5, 'Oxford Vocab');
    }
}

async function updateOxfordProgressBars() {
    const allWords = await idbGetAll('oxford_words');
    const targetCounts = { 'A1': 500, 'A2': 600, 'B1': 700, 'B2': 800, 'C1': 400 }; // Oxford approximate targets

    ['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
        const levelDiscovered = allWords.filter(w => w.level === lvl);
        const levelMastered = levelDiscovered.filter(w => oxfordMastery[w.word.toLowerCase()] === 'mastered').length;
        
        // Progress bar based on discovered words (visual feedback for current session)
        // or based on the 3000 target. Let's use the 3000 target for the main bar.
        const pct = Math.round((levelMastered / (targetCounts[lvl] || 600)) * 100);
        const fill = document.getElementById(`oxford-progress-${lvl}`);
        if (fill) {
            fill.style.width = `${Math.max(2, pct)}%`; // Min width for visibility
            fill.title = `${levelMastered} mastered of ${levelDiscovered.length} discovered`;
        }
    });
}

async function generateOxfordAiExample() {
    if (!currentOxfordWord) return;
    
    const area = document.getElementById('oxford-ai-example');
    const phraseEl = document.getElementById('oxford-ai-phrase');
    const transEl = document.getElementById('oxford-ai-trans');
    const genBtn = document.getElementById('oxford-ai-gen-btn');
    
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) return;

    genBtn.disabled = true;
    genBtn.innerHTML = '<div class="loading-spinner" style="width:14px;height:14px;margin:0 auto;"></div>';

    const prompt = `Berikan 1 contoh kalimat NATURAL menggunakan kata "${currentOxfordWord.word}" untuk level ${currentOxfordLevel}.
    HANYA JSON: {"phrase": "...", "translation": "..."}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
            const result = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
            phraseEl.innerText = `"${result.phrase}"`;
            transEl.innerText = `"${result.translation}"`;
            area.style.display = 'block';
        }
    } catch (e) {
        console.error(e);
    } finally {
        genBtn.disabled = false;
        genBtn.innerText = '🧠 Minta Contoh AI';
    }
}
