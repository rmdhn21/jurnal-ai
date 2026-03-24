// ===== AI TUTORS MODULE (DAILY MICRO-LEARNING) =====

async function requestTutor(topic) {
    if (hasLearnedToday()) {
        alert("Kamu sudah menyelesaikan sesi belajar hari ini! Otak juga butuh istirahat. Kembali lagi besok ya! 🌟");
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        alert('API key belum diatur. Silakan masukkan Gemini API key di Tab Pengaturan terlebih dahulu.');
        return;
    }

    const contentArea = document.getElementById('tutor-content-area');
    const actionGroup = document.getElementById('tutor-action-btn-group');

    // UI Loading State
    actionGroup.style.display = 'none';
    contentArea.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
            <div class="loading-spinner" style="margin: 0 auto;"></div>
            <p style="margin-top: 15px; color: var(--primary);">Menghubungi Pakar ${topic}...</p>
        </div>
    `;
    contentArea.classList.remove('hidden');

    const prompt = `Anda adalah seorang tutor privat yang ahli, ramah, dan sangat inspiratif. 
Tujuan Anda: Mengajari saya (orang awam) 1 konsep pendek atau fakta menarik tentang: ${topic}.

ATURAN KETAT:
1. Bahas 1 topik spesifik saja (misal jika Fisika: jelaskan apa itu Entropi, ATAU Teori Relativitas Waktu; Jangan keduanya).
2. Penjelasan HARUS sangat sederhana, gunakan analogi kehidupan sehari-hari jika memungkinkan.
3. Maksimal 3-4 paragraf pendek saja (Micro-learning).
4. Gunakan bahasa Indonesia yang santai, hangat, dan beri emoji yang relevan.
5. Jangan berikan pengantar seperti "Tentu, ini dia konsepnya". Langsung mulai ke materinya dengan judul tebal (Format Markdown).`;

    const requestBody = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.8, // Sedikit kreatif untuk analogi
            maxOutputTokens: 2500
        }
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error('Gagal menghubungi Gemini.');

        const data = await response.json();
        let tutorText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!tutorText) throw new Error('Pakar sedang sibuk, tidak ada respons.');

        // Render result with "Mark as Learned" button
        contentArea.innerHTML = `
            <div class="tutor-markdown-content" style="font-size: 0.95rem; line-height: 1.6; color: var(--text);">
                ${formatTutorMarkdown(tutorText)}
            </div>
            <button class="btn btn-primary" id="btn-tutor-learned" onclick="claimTutorReward()" style="width: 100%; margin-top: 20px; background: var(--success); color: white;">
                ✓ Saya Paham! (+15 XP)
            </button>
        `;

    } catch (error) {
        console.error('Tutor Error:', error);
        contentArea.innerHTML = `
            <div style="text-align: center; padding: 15px 0;">
                <p style="color: var(--danger); margin-bottom: 15px;">Koneksi ke guru privat terputus.</p>
                <button class="btn btn-secondary" onclick="resetTutorUI()">Coba Lagi</button>
            </div>
        `;
    }
}

function formatTutorMarkdown(text) {
    // Simple regex to parse basic markdown for the UI
    let html = text.replace(/^### (.*$)/gim, '<h4 style="margin-top: 10px; margin-bottom: 5px; color: var(--primary);">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="margin-top: 10px; margin-bottom: 10px; color: var(--primary);">$1</h3>');
    html = html.replace(/^\*\*([^*]+)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\n\n/g, '<br><br>');
    return html;
}

function claimTutorReward() {
    // Mark as learned in storage
    markTutorLearned();

    // Add XP
    addXP(15);

    // Update UI
    const contentArea = document.getElementById('tutor-content-area');
    contentArea.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🎓✨</div>
            <h4 style="color: var(--success); margin-bottom: 5px;">Sesi Hari Ini Selesai!</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem;">+15 XP ditambahkan ke profilmu. Guru privat akan kembali dengan materi baru besok.</p>
        </div>
    `;

    // Change badge status
    checkTutorDailyStatus();
}

function resetTutorUI() {
    document.getElementById('tutor-content-area').classList.add('hidden');
    document.getElementById('tutor-action-btn-group').style.display = 'flex';
}

function checkTutorDailyStatus() {
    const badge = document.getElementById('tutor-status-badge');
    const actionGroup = document.getElementById('tutor-action-btn-group');
    const contentArea = document.getElementById('tutor-content-area');

    if (!badge || !actionGroup || !contentArea) return;

    if (hasLearnedToday()) {
        badge.textContent = "Selesai ✓";
        badge.style.background = "var(--success)";

        actionGroup.style.display = 'none';
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div style="text-align: center; padding: 15px 0; opacity: 0.8;">
                <div style="font-size: 2rem; margin-bottom: 5px;">💤</div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Kamu sudah belajar hari ini.<br>Istirahatkan otakmu, mari lanjut besok!</p>
            </div>
        `;
    } else {
        badge.textContent = "Tersedia";
        badge.style.background = "var(--primary)";
        actionGroup.style.display = 'flex';
        contentArea.classList.add('hidden');
    }
}
