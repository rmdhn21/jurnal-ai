// ============================================
// LOOKSMAXING: Maximize Your Appearance & Aura
// ============================================

const looksData = {
    categories: {
        skin: { label: 'Kulit', color: '#f472b6', icon: '✨' },
        hair: { label: 'Rambut', color: '#a78bfa', icon: '💇' },
        face: { label: 'Wajah', color: '#38bdf8', icon: '🧊' },
        body: { label: 'Postur', color: '#34d399', icon: '🧍' },
        style: { label: 'Style', color: '#fb923c', icon: '👔' },
        hygiene: { label: 'Hygiene', color: '#22d3ee', icon: '🧼' },
        health: { label: 'Kesehatan', color: '#4ade80', icon: '💪' },
        aura: { label: 'Aura', color: '#fbbf24', icon: '🔥' }
    },
    dailyTips: [
        { tip: "Minum 3 liter air putih hari ini. Dehidrasi membuat kulit kusam, bibir pecah, dan mata cekung — instant -2 poin attractiveness.", icon: "💧" },
        { tip: "Oleskan sunscreen SPF 30+ setiap pagi. UV adalah penyebab #1 penuaan dini — kerutan, flek hitam, dan kulit kasar.", icon: "☀️" },
        { tip: "Tidur 7-8 jam malam ini. Sleep deprivation menyebabkan kantung mata, kulit pucat, dan wajah bengkak.", icon: "😴" },
        { tip: "Berdiri tegak dan tarik bahu ke belakang. Postur yang baik bisa menambah tinggi visual 2-3 cm dan memancarkan confidence.", icon: "🧍" },
        { tip: "Potong dan rapikan kuku hari ini. Detail kecil ini sangat diperhatikan dan menunjukkan standar kebersihan tinggi.", icon: "💅" },
        { tip: "Cuci muka dengan cleanser pH rendah (5.5). Sabun biasa merusak skin barrier dan memicu jerawat.", icon: "🧴" },
        { tip: "Mewing: Letakkan seluruh lidah di langit-langit mulut. Latihan ini memperbaiki jawline dari waktu ke waktu.", icon: "👅" },
        { tip: "Kurangi gula hari ini. Gula memicu glikasi kolagen — proses yang membuat kulit kendur dan cepat tua.", icon: "🍬" },
        { tip: "Rapikan alis. Alis yang rapi membingkai wajah dan memberi tampilan lebih bersih dan terawat.", icon: "🪒" },
        { tip: "Senyum dengan mata (Duchenne smile). Ini membuat wajah Anda 10x lebih approachable dan attractive.", icon: "😊" },
        { tip: "Pakai parfum yang subtle tapi memorable. Aroma mempengaruhi persepsi attractiveness hingga 40%.", icon: "🧪" },
        { tip: "Latih eye contact yang tenang selama percakapan. Mata yang stabil memancarkan dominasi dan ketertarikan.", icon: "👁️" }
    ],
    habits: [
        {
            id: 'l1', icon: '💧', title: 'Minum 3L Air Putih',
            desc: 'Bawa botol 1.5L dan habiskan 2x sehari. Tambahkan lemon untuk detox.',
            science: 'Kulit terdiri 64% air. Dehidrasi ringan saja sudah membuat kulit kehilangan elastisitas, memperjelas kerutan, dan membuat wajah terlihat lebih tua 3-5 tahun.',
            category: 'health'
        },
        {
            id: 'l2', icon: '🧴', title: 'Skincare Pagi (Cleanser + Moisturizer + SPF)',
            desc: 'Cuci muka → moisturizer → sunscreen SPF 30+. Ini 3 langkah minimum wajib.',
            science: 'Dermatologis sepakat: sunscreen adalah produk anti-aging #1. UV-A menembus awan dan kaca, menyebabkan 80% tanda penuaan yang terlihat di wajah.',
            category: 'skin'
        },
        {
            id: 'l3', icon: '🌙', title: 'Skincare Malam (Cleanse + Treat)',
            desc: 'Double cleanse → serum (niacinamide/retinol) → moisturizer malam.',
            science: 'Kulit melakukan regenerasi sel 3x lebih cepat saat tidur (jam 10 malam - 2 pagi). Aktif ingredien yang diaplikasikan malam hari 2x lebih efektif.',
            category: 'skin'
        },
        {
            id: 'l4', icon: '👅', title: 'Mewing (Postur Lidah) 30 Menit',
            desc: 'Tekan seluruh permukaan lidah ke langit-langit mulut. Gigi mengatup ringan, bibir tertutup.',
            science: 'Dr. Mike Mew: tekanan lidah yang konsisten di palate memperlebar maxilla, memajukan midface, dan membentuk jawline yang lebih defined seiring waktu.',
            category: 'face'
        },
        {
            id: 'l5', icon: '🧍', title: 'Postur Tegap Sepanjang Hari',
            desc: 'Bahu ke belakang, dada terbuka, dagu sejajar lantai. Cek postur setiap 1 jam.',
            science: 'Postur tegak meningkatkan testosteron 20% dan menurunkan kortisol 25% (power pose study). Secara visual menambah tinggi dan memancarkan status sosial tinggi.',
            category: 'body'
        },
        {
            id: 'l6', icon: '😴', title: 'Tidur 7-8 Jam (Sebelum Jam 11)',
            desc: 'Matikan layar 1 jam sebelumnya. Tidur telentang untuk mencegah kerutan wajah.',
            science: 'Growth hormone diproduksi 70% saat deep sleep. Kurang tidur menyebabkan peningkatan kortisol yang memecah kolagen — protein utama kekencangan kulit.',
            category: 'health'
        },
        {
            id: 'l7', icon: '💪', title: 'Workout / Olahraga 30 Menit',
            desc: 'Strength training lebih baik dari cardio untuk looksmaxing. Fokus: bahu, dada, punggung.',
            science: 'Resistance training meningkatkan testosteron, memperbaiki body composition (V-taper), dan meningkatkan sirkulasi darah ke kulit yang memberi efek "glow".',
            category: 'body'
        },
        {
            id: 'l8', icon: '🪥', title: 'Oral Hygiene Lengkap',
            desc: 'Sikat gigi 2x + floss + mouthwash + bersihkan lidah.',
            science: 'Senyum adalah fitur wajah #1 yang diperhatikan. Gigi kuning/bau mulut menghancurkan first impression secara instan. Oral health juga terhubung dengan kesehatan jantung.',
            category: 'hygiene'
        },
        {
            id: 'l9', icon: '🧼', title: 'Grooming: Rambut & Alis Rapi',
            desc: 'Style rambut sesuai bentuk wajah. Rapikan alis, bulu hidung, dan facial hair.',
            science: 'Studi menunjukkan pria yang well-groomed dinilai 3-4 poin lebih tinggi dalam skala attractiveness. Rambut yang tepat bisa mengubah persepsi bentuk wajah secara dramatis.',
            category: 'hair'
        },
        {
            id: 'l10', icon: '🥗', title: 'Makan Bersih (No Junk/Gula)',
            desc: 'Prioritaskan protein, sayuran, lemak sehat. Hindari gula, gorengan, dairy berlebih.',
            science: 'Gula memicu proses glikasi yang merusak kolagen dan elastin. Dairy meningkatkan IGF-1 yang memicu produksi sebum berlebih dan jerawat pada individu sensitif.',
            category: 'health'
        },
        {
            id: 'l11', icon: '👔', title: 'Outfit yang Fit & Rapi',
            desc: 'Pakai baju yang pas di badan (tidak kebesaran/kekecilan). Warna netral + 1 aksen.',
            science: 'Studi Univ. Princeton: orang menilai kompetensi dan status sosial seseorang dalam 100ms pertama — dan pakaian adalah faktor visual dominan dalam penilaian itu.',
            category: 'style'
        },
        {
            id: 'l12', icon: '🔥', title: 'Aura Check: Kontak Mata + Senyum',
            desc: 'Latih kontak mata stabil 3-5 detik saat bicara. Senyum tipis yang genuine.',
            science: 'Eye contact mengaktifkan mirror neuron dan melepaskan oksitosin di otak lawan bicara — membuat mereka merasa terhubung dan tertarik secara bawah sadar.',
            category: 'aura'
        }
    ],
    levels: [
        { name: "Normie", minPts: 0, color: "#64748b", emoji: "😐" },
        { name: "Self-Aware", minPts: 50, color: "#38bdf8", emoji: "🪞" },
        { name: "Groomed", minPts: 150, color: "#a78bfa", emoji: "✂️" },
        { name: "Attractive", minPts: 350, color: "#f472b6", emoji: "💎" },
        { name: "Top 10%", minPts: 700, color: "#fbbf24", emoji: "👑" },
        { name: "Chad / Sigma", minPts: 1200, color: "#ef4444", emoji: "🔥" }
    ]
};

let looksState = {
    completedToday: [],
    history: [],
    streak: 0,
    lastDate: '',
    tipIndex: 0,
    xp: 0
};

const LOOKS_STORAGE_KEY = 'jurnal_ai_looksmaxing_v1';

function loadLooksState() {
    const s = localStorage.getItem(LOOKS_STORAGE_KEY);
    if (s) looksState = { ...looksState, ...JSON.parse(s) };
}

function saveLooksState() {
    localStorage.setItem(LOOKS_STORAGE_KEY, JSON.stringify(looksState));
}

function getLooksLevel(xp) {
    let c = looksData.levels[0];
    for (const l of looksData.levels) { if (xp >= l.minPts) c = l; }
    return c;
}

function getNextLooksLevel(xp) {
    for (const l of looksData.levels) { if (xp < l.minPts) return l; }
    return null;
}

function initLooksmaxing() {
    loadLooksState();
    checkLooksDailyReset();
    renderLooksTip();
    renderLooksLevel();
    renderLooksScore();
    renderLooksHabits();
    renderLooksHistory();
}

function checkLooksDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    if (looksState.lastDate !== today) {
        if (looksState.lastDate && looksState.completedToday.length > 0) {
            looksState.history.unshift({
                date: looksState.lastDate,
                completed: [...looksState.completedToday],
                score: looksState.completedToday.length
            });
            if (looksState.history.length > 30) looksState.history.pop();
        }
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        if (looksState.lastDate === yStr && looksState.completedToday.length >= 4) {
            looksState.streak++;
        } else if (looksState.lastDate !== yStr) {
            looksState.streak = 0;
        }
        looksState.completedToday = [];
        looksState.lastDate = today;
        looksState.tipIndex = Math.floor(Math.random() * looksData.dailyTips.length);
        saveLooksState();
    }
}

function renderLooksTip() {
    const c = document.getElementById('looks-tip-container');
    if (!c) return;
    const tip = looksData.dailyTips[looksState.tipIndex % looksData.dailyTips.length];
    c.innerHTML = `<div style="display:flex;align-items:flex-start;gap:12px;">
        <span style="font-size:2rem;line-height:1;">${tip.icon}</span>
        <p style="margin:0;font-size:0.9rem;color:#e2e8f0;line-height:1.6;font-style:italic;">${tip.tip}</p>
    </div>`;
}

function renderLooksLevel() {
    const c = document.getElementById('looks-level-container');
    if (!c) return;
    const rank = getLooksLevel(looksState.xp);
    const next = getNextLooksLevel(looksState.xp);
    let bar = '';
    if (next) {
        const range = next.minPts - rank.minPts;
        const cur = looksState.xp - rank.minPts;
        const pct = Math.min(100, Math.max(0, (cur / range) * 100));
        bar = `<div style="margin-top:10px;background:rgba(0,0,0,0.2);border-radius:10px;padding:10px;border:1px solid rgba(255,255,255,0.05);">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:5px;">
                <span style="color:${rank.color};font-weight:bold;">${rank.emoji} ${rank.name}</span>
                <span style="color:#94a3b8;">${looksState.xp} / ${next.minPts} XP</span>
            </div>
            <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${rank.color},${rank.color}88);box-shadow:0 0 10px ${rank.color};transition:width 0.5s ease;"></div>
            </div>
            <div style="text-align:right;font-size:0.65rem;color:#64748b;margin-top:4px;">Menuju: ${next.emoji} ${next.name}</div>
        </div>`;
    } else {
        bar = `<div style="margin-top:10px;text-align:center;padding:10px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;color:#fca5a5;">
            <span style="font-size:1.2rem;">🔥</span><br><strong style="font-size:0.9rem;">MAX RANK: ${rank.name}</strong><br>
            <span style="font-size:0.75rem;">Total XP: ${looksState.xp}</span>
        </div>`;
    }
    c.innerHTML = bar;
}

function renderLooksScore() {
    const c = document.getElementById('looks-score-container');
    if (!c) return;
    const done = looksState.completedToday.length;
    const total = looksData.habits.length;
    const pct = Math.round((done / total) * 100);
    let grade, gradeColor, gradeEmoji;
    if (done >= 10) { grade = 'S-Tier'; gradeColor = '#ef4444'; gradeEmoji = '🔥'; }
    else if (done >= 7) { grade = 'A-Tier'; gradeColor = '#fbbf24'; gradeEmoji = '💎'; }
    else if (done >= 4) { grade = 'B-Tier'; gradeColor = '#34d399'; gradeEmoji = '👍'; }
    else { grade = 'C-Tier'; gradeColor = '#64748b'; gradeEmoji = '😐'; }

    c.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div>
            <div style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:700;letter-spacing:1px;">Glow-Up Grade Hari Ini</div>
            <div style="font-size:1.3rem;font-weight:800;color:${gradeColor};margin-top:4px;">${gradeEmoji} ${grade}</div>
        </div>
        <div style="text-align:center;">
            <div style="font-size:2rem;font-weight:800;color:${gradeColor};">${done}<span style="font-size:1rem;color:#64748b;">/${total}</span></div>
            <div style="font-size:0.65rem;color:#64748b;">Rutinitas</div>
        </div>
    </div>
    <div style="height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${gradeColor},${gradeColor}88);transition:width 0.5s ease;border-radius:4px;"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:0.7rem;color:#64748b;">
        <span>🔥 Streak: ${looksState.streak} hari (min. 4/hari)</span><span>${pct}%</span>
    </div>`;
}

function renderLooksHabits() {
    const c = document.getElementById('looks-habits-container');
    if (!c) return;
    let html = '<div style="display:flex;flex-direction:column;gap:12px;">';
    looksData.habits.forEach(h => {
        const done = looksState.completedToday.includes(h.id);
        const cat = looksData.categories[h.category];
        html += `<div style="border-radius:12px;overflow:hidden;transition:all 0.3s;${done
            ? 'background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.3);opacity:0.85;'
            : 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);'}">
            <div style="padding:14px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;" onclick="toggleLooksHabit('${h.id}')">
                <div style="font-size:1.5rem;min-width:36px;text-align:center;">${done ? '✅' : h.icon}</div>
                <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
                        <h4 style="margin:0;font-size:0.9rem;font-weight:700;color:${done ? '#10b981' : '#e2e8f0'};${done ? 'text-decoration:line-through;' : ''}">${h.title}</h4>
                        <span style="font-size:0.6rem;padding:2px 6px;border-radius:10px;background:${cat.color}20;color:${cat.color};font-weight:700;border:1px solid ${cat.color}30;">${cat.label}</span>
                    </div>
                    <p style="margin:0;font-size:0.78rem;color:#94a3b8;line-height:1.4;">${h.desc}</p>
                </div>
                <div style="min-width:28px;text-align:center;">
                    ${done ? '<span style="color:#10b981;font-size:1.2rem;">✨</span>' : '<div style="width:22px;height:22px;border:2px solid #475569;border-radius:50%;"></div>'}
                </div>
            </div>
            <details style="padding:0 16px 14px;">
                <summary style="font-size:0.75rem;color:#f472b6;cursor:pointer;font-weight:600;">🔬 Kenapa Ini Penting?</summary>
                <div style="margin-top:8px;padding:10px 12px;background:rgba(0,0,0,0.3);border-radius:8px;border-left:3px solid ${cat.color};">
                    <p style="margin:0;font-size:0.75rem;color:#cbd5e1;line-height:1.5;">${h.science}</p>
                </div>
            </details>
        </div>`;
    });
    html += '</div>';
    c.innerHTML = html;
}

function toggleLooksHabit(id) {
    const idx = looksState.completedToday.indexOf(id);
    if (idx === -1) {
        looksState.completedToday.push(id);
        looksState.xp += 10;
        if ("vibrate" in navigator) navigator.vibrate([15, 40, 15]);
    } else {
        looksState.completedToday.splice(idx, 1);
        looksState.xp = Math.max(0, looksState.xp - 10);
    }
    saveLooksState();
    renderLooksLevel();
    renderLooksScore();
    renderLooksHabits();
    renderLooksHistory();
}

function renderLooksHistory() {
    const c = document.getElementById('looks-history-container');
    if (!c) return;
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const names = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
        const label = i === 0 ? 'Hari ini' : names[d.getDay()];
        let score = 0;
        if (i === 0) score = looksState.completedToday.length;
        else { const f = looksState.history.find(h => h.date === dStr); if (f) score = f.score; }
        days.push({ label, score });
    }
    const max = 12;
    const bars = days.map(d => {
        const h = Math.max(4, (d.score / max) * 100);
        let col = '#64748b';
        if (d.score >= 10) col = '#ef4444';
        else if (d.score >= 7) col = '#fbbf24';
        else if (d.score >= 4) col = '#34d399';
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;">
            <span style="font-size:0.65rem;color:#94a3b8;font-weight:700;">${d.score}</span>
            <div style="width:100%;max-width:28px;height:80px;background:rgba(255,255,255,0.05);border-radius:4px;display:flex;align-items:flex-end;overflow:hidden;">
                <div style="width:100%;height:${h}%;background:${col};border-radius:4px;transition:height 0.5s ease;"></div>
            </div>
            <span style="font-size:0.6rem;color:#64748b;">${d.label}</span>
        </div>`;
    }).join('');
    c.innerHTML = `<div style="display:flex;gap:6px;align-items:flex-end;justify-content:space-between;">${bars}</div>
        <div style="text-align:center;margin-top:10px;font-size:0.65rem;color:#475569;">Rutinitas looksmaxing per hari (target: 7+)</div>`;
}

window.initLooksmaxing = initLooksmaxing;
window.toggleLooksHabit = toggleLooksHabit;
