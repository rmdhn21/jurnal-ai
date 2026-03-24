// ===== DEEP ANALYSIS INSIGHT MODULE =====

const INSIGHT_SYSTEM_PROMPT = `Sebagai AI Data Analyst Pribadi, analisislah data pengguna berikut (Keuangan, Mood, Kebiasaan, Jurnal) selama 7-30 hari terakhir.
Tugasmu:
1. Temukan POLA tersembunyi (misal: "Pengeluaran kopi meningkat saat mood buruk").
2. Berikan 3 Insight Spesifik (Keuangan, Produktivitas, Kesejahteraan).
3. Berikan 1 Saran Aksi nyata untuk minggu depan.

Format Output JSON:
{
  "summary": "Satu kalimat ringkasan performa minggu ini",
  "mood_analysis": "Analisis tren emosi",
  "finance_analysis": "Analisis pola pengeluaran",
  "habit_analysis": "Analisis konsistensi kebiasaan",
  "recommendation": "Satu saran aksi konkret",
  "score": 85 (Skor kesehatan produktivitas 0-100)
}
Gunakan bahasa Indonesia yang santai tapi profesional. Jangan berhalusinasi data.`;

function initInsightUI() {
    // Inject button if not exists
    const header = document.querySelector('.header');
    if (header && !document.getElementById('insight-btn')) {
        const btn = document.createElement('button');
        btn.id = 'insight-btn';
        btn.className = 'icon-btn';
        btn.innerHTML = '✨';
        btn.title = 'Analisis AI Mingguan';
        btn.style.marginLeft = 'auto'; // Push to right
        btn.style.marginRight = '10px';

        // Insert before the existing right elements if possible, or append
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            header.insertBefore(btn, themeToggle);
        } else {
            header.appendChild(btn);
        }

        btn.addEventListener('click', showInsightModal);
    }
}

async function showInsightModal() {
    // Create Modal Elements dynamically
    let modal = document.getElementById('insight-modal');
    if (!modal) {
        createInsightModalDOM();
        modal = document.getElementById('insight-modal');
    }

    // Show Modal
    modal.classList.remove('hidden');

    // Reset Content
    const container = document.getElementById('insight-content');
    container.innerHTML = `
        <div class="insight-loading">
            <div class="loading-spinner"></div>
            <p>Sedang menganalisis data kehidupanmu...</p>
            <small>Mengecek jurnal, keuangan, dan habits...</small>
        </div>
    `;

    try {
        // Gather Data
        const data = gatherUserData();

        // Call AI
        const insight = await getInsightFromAI(data);

        // Render Result
        renderInsightResult(insight);

    } catch (error) {
        console.error('Insight Error:', error);
        container.innerHTML = `
            <div class="insight-error">
                <p>⚠️ Gagal menganalisis data.</p>
                <p class="text-sm text-muted">${error.message}</p>
                <button class="btn btn-primary mt-md" onclick="showInsightModal()">Coba Lagi</button>
            </div>
        `;
    }
}

function gatherUserData() {
    const days = 7;
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);

    // 1. Finance
    const transactions = getTransactions().filter(t => new Date(t.date) >= pastDate);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const topCategories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        topCategories[t.category] = (topCategories[t.category] || 0) + t.amount;
    });

    // 2. Habits
    const habits = getHabits();
    const habitStats = habits.map(h => {
        let count = 0;
        if (h.completions) {
            Object.keys(h.completions).forEach(date => {
                if (new Date(date) >= pastDate && h.completions[date]) count++;
            });
        }
        return { name: h.name, count };
    });

    // 3. Mood/Journal
    const journals = getJournals().filter(j => new Date(j.date) >= pastDate);
    const moods = journals.map(j => j.mood).filter(m => m);

    return JSON.stringify({
        period: "Last 7 days",
        total_expense: totalExpense,
        top_expense_categories: topCategories,
        habit_performance: habitStats,
        recorded_moods: moods,
        journal_count: journals.length
    });
}

function renderInsightResult(insight) {
    const container = document.getElementById('insight-content');

    // Determine color based on score
    let scoreColor = 'var(--success)';
    if (insight.score < 50) scoreColor = 'var(--error)';
    else if (insight.score < 80) scoreColor = 'var(--warning)';

    container.innerHTML = `
        <div class="insight-header-card">
            <div class="insight-score" style="border-color: ${scoreColor}; color: ${scoreColor}">
                ${insight.score}
            </div>
            <div class="insight-summary">
                <h4>Ringkasan Mingguan</h4>
                <p>${insight.summary}</p>
            </div>
        </div>
        
        <div class="insight-grid">
            <div class="insight-card mood">
                <h5>🎭 Emosi & Mood</h5>
                <p>${insight.mood_analysis}</p>
            </div>
            <div class="insight-card finance">
                <h5>💰 Keuangan</h5>
                <p>${insight.finance_analysis}</p>
            </div>
            <div class="insight-card habit">
                <h5>🎯 Habits</h5>
                <p>${insight.habit_analysis}</p>
            </div>
        </div>
        
        <div class="insight-recommendation">
            <h5>💡 Saran Minggu Depan</h5>
            <p>${insight.recommendation}</p>
        </div>
    `;
}

async function getInsightFromAI(userData) {
    const apiKey = localStorage.getItem('jurnal_ai_gemini_key');
    if (!apiKey) throw new Error("API Key tidak ditemukan. Set di Pengaturan.");

    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: `${INSIGHT_SYSTEM_PROMPT}\n\nDATA PENGGUNA:\n${userData}` }]
            }],
            generationConfig: { responseMimeType: "application/json" }
        })
    });

    if (!response.ok) throw new Error("Gagal menghubungkan ke Gemini AI");

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Respon AI kosong");

    return JSON.parse(text);
}

function createInsightModalDOM() {
    const div = document.createElement('div');
    div.id = 'insight-modal';
    div.className = 'modal hidden';
    div.innerHTML = `
        <div class="modal-content card" style="max-width: 600px;">
            <div class="modal-header">
                <h3>✨ Analisis Mingguan AI</h3>
                <button onclick="document.getElementById('insight-modal').classList.add('hidden')" class="icon-btn">✕</button>
            </div>
            <div id="insight-content"></div>
        </div>
    `;
    document.body.appendChild(div);
}
