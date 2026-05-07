// ============================================
// CORTISOL CONTROL: Kebiasaan & Tips Menurunkan Kortisol
// ============================================

const cortisolData = {
    dailyTips: [
        { tip: "Paparan sinar matahari pagi (10-15 menit) menurunkan kortisol dan meningkatkan serotonin secara alami.", icon: "☀️" },
        { tip: "Hindari kafein setelah jam 2 siang — kafein meningkatkan kortisol hingga 30% dan mengganggu kualitas tidur.", icon: "☕" },
        { tip: "Tertawa lepas menurunkan kortisol hingga 39%. Tonton sesuatu yang lucu hari ini.", icon: "😂" },
        { tip: "Pelukan selama 20 detik melepaskan oksitosin yang secara langsung melawan kortisol.", icon: "🤗" },
        { tip: "Mengunyah permen karet terbukti menurunkan kortisol 12-16% saat situasi stres.", icon: "🫧" },
        { tip: "Mendengarkan musik 432Hz atau suara alam menurunkan kortisol lebih cepat dari keheningan.", icon: "🎵" },
        { tip: "Magnesium adalah mineral anti-stres #1. Makan pisang, alpukat, atau dark chocolate.", icon: "🍫" },
        { tip: "Cold exposure (air dingin 30 detik) melatih sistem saraf untuk lebih tahan terhadap stres.", icon: "🧊" },
        { tip: "Journaling selama 15 menit menurunkan kortisol dan meningkatkan fungsi imun.", icon: "📝" },
        { tip: "Grounding (kaki telanjang di tanah/rumput) selama 10 menit terbukti menurunkan kortisol.", icon: "🌿" },
        { tip: "Social media detox 1 jam sebelum tidur menurunkan kortisol malam hingga 23%.", icon: "📵" },
        { tip: "Berdoa/berdzikir mengaktifkan respons relaksasi parasimpatis yang melawan kortisol.", icon: "🤲" }
    ],
    habits: [
        {
            id: 'c1', icon: '🌅', title: 'Bangun Sebelum Subuh',
            desc: 'Bangun 30 menit sebelum subuh. Ritme sirkadian yang teratur menjaga kortisol tetap rendah di pagi hari.',
            science: 'Kortisol alami memuncak 30-45 menit setelah bangun (CAR - Cortisol Awakening Response). Bangun teratur membuat lonjakan ini terkontrol dan sehat.',
            category: 'sleep'
        },
        {
            id: 'c2', icon: '🧘', title: 'Nafas 4-7-8 (2 Menit)',
            desc: 'Tarik nafas 4 detik, tahan 7 detik, buang 8 detik. Ulangi 4 siklus.',
            science: 'Teknik ini mengaktifkan saraf vagus yang langsung menekan produksi kortisol oleh kelenjar adrenal. Efek terasa dalam 60 detik.',
            category: 'breathwork'
        },
        {
            id: 'c3', icon: '🚶', title: 'Jalan Kaki 20 Menit',
            desc: 'Jalan santai di luar ruangan, idealnya di area hijau atau taman.',
            science: 'Penelitian menunjukkan 20 menit jalan di alam menurunkan kortisol 21.3% lebih efektif dibanding jalan di dalam ruangan.',
            category: 'movement'
        },
        {
            id: 'c4', icon: '📵', title: 'No Screen 1 Jam Sebelum Tidur',
            desc: 'Matikan semua layar 1 jam sebelum tidur. Baca buku atau dzikir.',
            science: 'Blue light dari layar menekan melatonin dan meningkatkan kortisol malam, membuat tubuh tetap dalam mode "siaga".',
            category: 'sleep'
        },
        {
            id: 'c5', icon: '🥗', title: 'Makan Anti-Inflamasi',
            desc: 'Konsumsi makanan tinggi omega-3, sayuran hijau, atau kunyit hari ini.',
            science: 'Inflamasi kronis memicu HPA axis (Hypothalamic-Pituitary-Adrenal) yang memproduksi kortisol berlebih. Makanan anti-inflamasi memutus siklus ini.',
            category: 'nutrition'
        },
        {
            id: 'c6', icon: '🧊', title: 'Cold Shower 30 Detik',
            desc: 'Akhiri mandi dengan air dingin selama 30 detik. Mulai dari kaki.',
            science: 'Cold exposure akut menurunkan kortisol baseline dan meningkatkan norepinefrin 200-300%, membangun ketahanan stres jangka panjang.',
            category: 'hormesis'
        },
        {
            id: 'c7', icon: '🤲', title: 'Dzikir & Meditasi 10 Menit',
            desc: 'Duduk tenang, pejamkan mata. Baca istighfar atau tasbih dengan penuh kehadiran.',
            science: 'Meditasi/dzikir rutin menyusutkan amigdala (pusat ketakutan otak) dan menurunkan baseline kortisol hingga 25% dalam 8 minggu.',
            category: 'spiritual'
        },
        {
            id: 'c8', icon: '😴', title: 'Tidur 7-8 Jam',
            desc: 'Pastikan tidur berkualitas minimal 7 jam. Tidur sebelum jam 11 malam.',
            science: 'Kurang tidur 1 malam saja meningkatkan kortisol sore hari hingga 37-45%. Sleep debt adalah pembunuh hormonal #1.',
            category: 'sleep'
        },
        {
            id: 'c9', icon: '🎵', title: 'Dengarkan Musik Tenang 15 Menit',
            desc: 'Putar musik instrumental, Quran, atau suara alam sambil memejamkan mata.',
            science: 'Musik dengan tempo 60-80 BPM menyinkronkan detak jantung dan mengaktifkan sistem saraf parasimpatis, menurunkan kortisol 25%.',
            category: 'relaxation'
        },
        {
            id: 'c10', icon: '💪', title: 'Olahraga Intensitas Sedang',
            desc: 'Lakukan workout ringan-sedang 30 menit. Hindari olahraga berat di malam hari.',
            science: 'Olahraga sedang menurunkan kortisol pasca-latihan. Tapi HATI-HATI: olahraga >60 menit intensitas tinggi justru MENAIKKAN kortisol.',
            category: 'movement'
        },
        {
            id: 'c11', icon: '🌿', title: 'Grounding / Earthing 10 Menit',
            desc: 'Bertelanjang kaki di tanah, rumput, atau pasir selama 10 menit.',
            science: 'Elektron bebas dari bumi menetralisir radikal bebas dan menurunkan kortisol. Studi menunjukkan perbaikan ritme kortisol diurnal.',
            category: 'nature'
        },
        {
            id: 'c12', icon: '📖', title: 'Journaling / Curhat di Jurnal',
            desc: 'Tulis pikiran dan perasaan selama 15 menit. Jujur dan tanpa filter.',
            science: 'Expressive writing menurunkan aktivitas HPA axis. Memindahkan pikiran dari otak ke kertas mengurangi beban kognitif dan kortisol.',
            category: 'mental'
        }
    ],
    categories: {
        sleep: { label: 'Tidur', color: '#818cf8', icon: '😴' },
        breathwork: { label: 'Nafas', color: '#38bdf8', icon: '🧘' },
        movement: { label: 'Gerak', color: '#34d399', icon: '🏃' },
        nutrition: { label: 'Nutrisi', color: '#fb923c', icon: '🥗' },
        hormesis: { label: 'Hormesis', color: '#22d3ee', icon: '🧊' },
        spiritual: { label: 'Spiritual', color: '#a78bfa', icon: '🤲' },
        relaxation: { label: 'Relaksasi', color: '#f472b6', icon: '🎵' },
        nature: { label: 'Alam', color: '#4ade80', icon: '🌿' },
        mental: { label: 'Mental', color: '#fbbf24', icon: '🧠' }
    }
};

let cortisolState = {
    completedToday: [],
    history: [], // [{date, completed: [ids], score}]
    streak: 0,
    lastDate: '',
    tipIndex: 0
};

const CORTISOL_STORAGE_KEY = 'jurnal_ai_cortisol_v1';

function loadCortisolState() {
    const saved = localStorage.getItem(CORTISOL_STORAGE_KEY);
    if (saved) cortisolState = { ...cortisolState, ...JSON.parse(saved) };
}

function saveCortisolState() {
    localStorage.setItem(CORTISOL_STORAGE_KEY, JSON.stringify(cortisolState));
}

function initCortisolControl() {
    loadCortisolState();
    checkCortisolDailyReset();
    renderCortisolTip();
    renderCortisolScore();
    renderCortisolHabits();
    renderCortisolHistory();
}

function checkCortisolDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    if (cortisolState.lastDate !== today) {
        // Save yesterday's data
        if (cortisolState.lastDate && cortisolState.completedToday.length > 0) {
            cortisolState.history.unshift({
                date: cortisolState.lastDate,
                completed: [...cortisolState.completedToday],
                score: cortisolState.completedToday.length
            });
            if (cortisolState.history.length > 30) cortisolState.history.pop();
        }

        // Check streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        if (cortisolState.lastDate === yStr && cortisolState.completedToday.length >= 3) {
            cortisolState.streak++;
        } else if (cortisolState.lastDate !== yStr) {
            cortisolState.streak = 0;
        }

        cortisolState.completedToday = [];
        cortisolState.lastDate = today;
        cortisolState.tipIndex = Math.floor(Math.random() * cortisolData.dailyTips.length);
        saveCortisolState();
    }
}

function renderCortisolTip() {
    const container = document.getElementById('cortisol-tip-container');
    if (!container) return;
    const tip = cortisolData.dailyTips[cortisolState.tipIndex % cortisolData.dailyTips.length];
    container.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <span style="font-size: 2rem; line-height: 1;">${tip.icon}</span>
            <p style="margin: 0; font-size: 0.9rem; color: #e2e8f0; line-height: 1.6; font-style: italic;">${tip.tip}</p>
        </div>
    `;
}

function renderCortisolScore() {
    const container = document.getElementById('cortisol-score-container');
    if (!container) return;

    const done = cortisolState.completedToday.length;
    const total = cortisolData.habits.length;
    const pct = Math.round((done / total) * 100);

    // Cortisol level estimation (inverse of habits done)
    let level, levelColor, levelLabel, levelEmoji;
    if (done >= 8) { level = 'Sangat Rendah'; levelColor = '#10b981'; levelLabel = 'Zen Master'; levelEmoji = '🧘'; }
    else if (done >= 5) { level = 'Rendah'; levelColor = '#34d399'; levelLabel = 'Tenang & Terkontrol'; levelEmoji = '😌'; }
    else if (done >= 3) { level = 'Sedang'; levelColor = '#fbbf24'; levelLabel = 'Perlu Perhatian'; levelEmoji = '😐'; }
    else { level = 'Tinggi'; levelColor = '#ef4444'; levelLabel = 'Waspada Stres!'; levelEmoji = '😰'; }

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Estimasi Level Kortisol</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: ${levelColor}; margin-top: 4px;">${levelEmoji} ${level}</div>
                <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">${levelLabel}</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: 800; color: ${levelColor};">${done}<span style="font-size: 1rem; color: #64748b;">/${total}</span></div>
                <div style="font-size: 0.65rem; color: #64748b;">Kebiasaan</div>
            </div>
        </div>
        <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, ${levelColor}, ${levelColor}88); transition: width 0.5s ease; border-radius: 4px;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.7rem; color: #64748b;">
            <span>🔥 Streak: ${cortisolState.streak} hari (min. 3 habit/hari)</span>
            <span>${pct}% selesai</span>
        </div>
    `;
}

function renderCortisolHabits() {
    const container = document.getElementById('cortisol-habits-container');
    if (!container) return;

    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';

    cortisolData.habits.forEach(habit => {
        const isDone = cortisolState.completedToday.includes(habit.id);
        const cat = cortisolData.categories[habit.category];

        html += `
            <div style="border-radius: 12px; overflow: hidden; transition: all 0.3s; ${isDone
                ? 'background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.3); opacity: 0.85;'
                : 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);'}">
                <div style="padding: 14px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px;" onclick="toggleCortisolHabit('${habit.id}')">
                    <div style="font-size: 1.5rem; min-width: 36px; text-align: center;">
                        ${isDone ? '✅' : habit.icon}
                    </div>
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
                            <h4 style="margin: 0; font-size: 0.9rem; font-weight: 700; color: ${isDone ? '#10b981' : '#e2e8f0'}; ${isDone ? 'text-decoration: line-through;' : ''}">${habit.title}</h4>
                            <span style="font-size: 0.6rem; padding: 2px 6px; border-radius: 10px; background: ${cat.color}20; color: ${cat.color}; font-weight: 700; border: 1px solid ${cat.color}30;">${cat.label}</span>
                        </div>
                        <p style="margin: 0; font-size: 0.78rem; color: #94a3b8; line-height: 1.4;">${habit.desc}</p>
                    </div>
                    <div style="min-width: 28px; text-align: center;">
                        ${isDone
                            ? '<span style="color: #10b981; font-size: 1.2rem;">✨</span>'
                            : '<div style="width: 22px; height: 22px; border: 2px solid #475569; border-radius: 50%;"></div>'}
                    </div>
                </div>
                <details style="padding: 0 16px 14px;">
                    <summary style="font-size: 0.75rem; color: #60a5fa; cursor: pointer; font-weight: 600;">🔬 Sains di Baliknya</summary>
                    <div style="margin-top: 8px; padding: 10px 12px; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 3px solid ${cat.color};">
                        <p style="margin: 0; font-size: 0.75rem; color: #cbd5e1; line-height: 1.5;">${habit.science}</p>
                    </div>
                </details>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function toggleCortisolHabit(habitId) {
    const idx = cortisolState.completedToday.indexOf(habitId);
    if (idx === -1) {
        cortisolState.completedToday.push(habitId);
        if ("vibrate" in navigator) navigator.vibrate([15, 40, 15]);
    } else {
        cortisolState.completedToday.splice(idx, 1);
    }
    saveCortisolState();
    renderCortisolScore();
    renderCortisolHabits();
    renderCortisolHistory();
}

function renderCortisolHistory() {
    const container = document.getElementById('cortisol-history-container');
    if (!container) return;

    // Show last 7 days as mini bar chart
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const label = i === 0 ? 'Hari ini' : dayNames[d.getDay()];

        let score = 0;
        if (i === 0) {
            score = cortisolState.completedToday.length;
        } else {
            const found = cortisolState.history.find(h => h.date === dStr);
            if (found) score = found.score;
        }
        days.push({ label, score, date: dStr });
    }

    const maxScore = 12;

    let barsHtml = days.map(d => {
        const h = Math.max(4, (d.score / maxScore) * 100);
        let color = '#ef4444';
        if (d.score >= 8) color = '#10b981';
        else if (d.score >= 5) color = '#34d399';
        else if (d.score >= 3) color = '#fbbf24';

        return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1;">
                <span style="font-size: 0.65rem; color: #94a3b8; font-weight: 700;">${d.score}</span>
                <div style="width: 100%; max-width: 28px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 4px; display: flex; align-items: flex-end; overflow: hidden;">
                    <div style="width: 100%; height: ${h}%; background: ${color}; border-radius: 4px; transition: height 0.5s ease;"></div>
                </div>
                <span style="font-size: 0.6rem; color: #64748b;">${d.label}</span>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div style="display: flex; gap: 6px; align-items: flex-end; justify-content: space-between;">
            ${barsHtml}
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 0.65rem; color: #475569;">
            Jumlah kebiasaan anti-kortisol per hari (target: 5+)
        </div>
    `;
}

// Global scope
window.initCortisolControl = initCortisolControl;
window.toggleCortisolHabit = toggleCortisolHabit;
