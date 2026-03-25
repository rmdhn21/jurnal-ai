/**
 * INVESTMENT & SHARIA ECONOMY - Sistem Belajar Investasi
 * Level 1 - 5 dengan AI Lessons & Quiz (Pattern: Physics Mastery)
 */

const investmentSyllabus = {
    L1: {
        title: "Dasar Keuangan & Syariah",
        color: "#059669",
        modules: [
            { id: "inv1_1", skill: "Konsep", title: "Konsep Dasar Uang", desc: "Pertumbuhan asset, inflasi, dan time value of money." },
            { id: "inv1_2", skill: "Dasar", title: "Cashflow & Dana Darurat", desc: "Cara mengelola pengeluaran dan membangun tabungan darurat." },
            { id: "inv1_3", skill: "Investasi", title: "Mengenal Inflasi vs Investasi", desc: "Mengapa menyimpan uang di bawah bantal adalah kesalahan." },
            { id: "inv1_4", skill: "Syariah", title: "Prinsip Dasar Ekonomi Syariah", desc: "Memahami larangan Riba, Gharar, dan Maysir." },
            { id: "inv1_5", skill: "Sosial", title: "Zakat & Perencanaan Waris", desc: "Kewajiban finansial dalam Islam dan pembagian waris dasar." }
        ]
    },
    L2: {
        title: "Produk Investasi Syariah",
        color: "#10b981",
        modules: [
            { id: "inv2_1", skill: "Bank", title: "Tabungan & Deposito Syariah", desc: "Mengenal akad Mudharabah dan Wadiah pada perbankan." },
            { id: "inv2_2", skill: "Pasar Modal", title: "Reksa Dana Syariah", desc: "Investasi kolektif yang aman bagi pemula." },
            { id: "inv2_3", skill: "Surat Berharga", title: "Sukuk & Obligasi Syariah", desc: "Mengenal instrumen surat utang negara dan korporasi." },
            { id: "inv2_4", skill: "Aset", title: "Logam Mulia & Gadai Syariah", desc: "Investasi emas sebagai pelindung nilai." },
            { id: "inv2_5", skill: "Fintech", title: "P2P Lending Syariah", desc: "Mengenal urun dana dan pendanaan UMKM." }
        ]
    },
    L3: {
        title: "Analisis Fundamental & Teknikal",
        color: "#34d399",
        modules: [
            { id: "inv3_1", skill: "Analisis", title: "Laporan Keuangan", desc: "Membaca Income Statement, Balance Sheet, & Cashflow." },
            { id: "inv3_2", skill: "Rasio", title: "Rasio Penting Saham", desc: "Memahami PER, PBV, ROE, dan DER." },
            { id: "inv3_3", skill: "Pemilihan", title: "Memilih Saham Syariah", desc: "Mengenal indeks ISSI dan JII." },
            { id: "inv3_4", skill: "Grafik", title: "Dasar Analisis Teknikal", desc: "Mengenal Support, Resistance, dan Trendline." },
            { id: "inv3_5", skill: "Psikologi", title: "Psikologi Investasi", desc: "Mengelola Fear dan Greed di pasar modal." }
        ]
    },
    L4: {
        title: "Manajemen Risiko & Portofolio",
        color: "#6ee7b7",
        modules: [
            { id: "inv4_1", skill: "Strategi", title: "Asset Allocation", desc: "Mengbagi penempatan dana di berbagai kelas asset." },
            { id: "inv4_2", skill: "Keamanan", title: "Diversifikasi Portofolio", desc: "Strategi jangan menaruh semua telur di satu keranjang." },
            { id: "inv4_3", skill: "Update", title: "Rebalancing Portofolio", desc: "Menjaga proporsi investasi agar tetap sesuai profil risiko." },
            { id: "inv4_4", skill: "Proteksi", title: "Asuransi Syariah (Takaful)", desc: "Melindungi income dan kesehatan secara gotong royong." },
            { id: "inv4_5", skill: "Hukum", title: "Pajak Investasi", desc: "Kewajiban pajak atas keuntungan investasi di Indonesia." }
        ]
    },
    L5: {
        title: "Financial Independence Road",
        color: "#a7f3d0",
        modules: [
            { id: "inv5_1", skill: "Target", title: "Angka Kebebasan Finansial", desc: "Menghitung berapa dana yang dibutuhkan untuk pensiun." },
            { id: "inv5_2", skill: "Strategi", title: "Dividen & Passive Income", desc: "Strategi hidup dari hasil investasi." },
            { id: "inv5_3", skill: "Ekonomi", title: "Menghadapi Resesi", desc: "Mental dan strategi saat ekonomi sedang lesu." },
            { id: "inv5_4", skill: "Sosial", title: "Filantropi & Wakaf", desc: "Membangun keberkahan melalui wakaf produktif." },
            { id: "inv5_5", skill: "Plan", title: "Final Investment Plan", desc: "Menyusun roadmap masa depan keuangan Anda." }
        ]
    }
};

let originalInvestmentHtml = '';
document.addEventListener('DOMContentLoaded', () => {
    const s = document.getElementById('investment-screen');
    if (s) originalInvestmentHtml = s.innerHTML;
    updateInvProgressUI();
});

function getInvProgress() { return JSON.parse(localStorage.getItem('inv_progress') || '{}'); }

function updateInvProgressUI() {
    const progress = getInvProgress();
    Object.keys(investmentSyllabus).forEach(level => {
        const total = investmentSyllabus[level].modules.length;
        const completed = progress[level] ? progress[level].length : 0;
        const pct = Math.min(100, Math.round((completed / total) * 100));
        const bar = document.getElementById(`inv-prog-${level}`);
        const txt = document.getElementById(`inv-pct-${level}`);
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.innerHTML = `${pct}%`;
    });
}

window.openInvLevel = function(level) {
    const data = investmentSyllabus[level]; if (!data) return;
    const progress = getInvProgress(); const completed = progress[level] || [];
    const screen = document.getElementById('investment-screen');
    const skillGroups = {}; data.modules.forEach(m => { if (!skillGroups[m.skill]) skillGroups[m.skill] = []; skillGroups[m.skill].push(m); });
    const icons = { Konsep:'📐', Dasar:'💳', Investasi:'📈', Syariah:'🌙', Sosial:'🤝', Bank:'🏦', 'Pasar Modal':'🏙️', 'Surat Berharga':'📜', Aset:'⚱️', Fintech:'📱', Analisis:'🔍', Rasio:'📊', Pemilihan:'✅', Grafik:'📉', Psikologi:'🧠', Strategi:'🗺️', Keamanan:'🛡️', Update:'🔄', Proteksi:'☂️', Hukum:'⚖️', Target:'🎯', Ekonomi:'🌍', Plan:'📝' };

    let html = `<div class="header-back"><button class="back-btn" onclick="backToInvDashboard()"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>Level ${level.replace('L','')}: ${data.title}</h2><p class="text-muted">${completed.length}/${data.modules.length} modul selesai</p>
    <div class="progress-bar-bg" style="margin-top:10px;"><div class="progress-bar-fill" style="width:${Math.round(completed.length/data.modules.length*100)}%;"></div></div></div>`;

    Object.keys(skillGroups).forEach(skill => {
        html += `<div class="card mt-md"><h3>${icons[skill]||'💰'} ${skill}</h3><div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">`;
        skillGroups[skill].forEach(mod => { const isDone = completed.includes(mod.id);
            html += `<div style="background:var(--surface-hover);padding:12px;border-radius:10px;border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;" onclick="openInvLesson('${level}','${mod.id}')"><div style="font-size:1.3rem;min-width:30px;text-align:center;">${isDone?'✅':'📝'}</div><div style="flex:1;"><div style="font-weight:600;font-size:0.95rem;color:var(--text-color);${isDone?'text-decoration:line-through;opacity:0.7;':''}">${mod.title}</div><div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${mod.desc}</div></div><span style="font-size:0.8rem;color:var(--text-muted);">→</span></div>`;
        });
        html += `</div></div>`;
    });
    screen.innerHTML = html; window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.backToInvDashboard = function() { const s = document.getElementById('investment-screen'); if (s && originalInvestmentHtml) { s.innerHTML = originalInvestmentHtml; updateInvProgressUI(); } window.scrollTo({ top: 0, behavior: 'smooth' }); };

window.openInvLesson = async function(level, moduleId) {
    const data = investmentSyllabus[level]; const mod = data.modules.find(m => m.id === moduleId); if (!mod) return;
    const screen = document.getElementById('investment-screen');
    screen.innerHTML = `<div class="header-back"><button class="back-btn" onclick="openInvLevel('${level}')"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>${mod.title}</h2><p class="text-muted">${mod.skill} • Level ${level.replace('L','')}</p></div>
    <div class="card mt-md" id="inv-lesson-content"><div class="loading-spinner" style="margin:20px auto;"></div><p class="text-center text-muted">💸 Ahli Keuangan Anda sedang menyusun materi...</p></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) { document.getElementById('inv-lesson-content').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key belum diatur.</p>'; return; }

    const prompt = `Kamu adalah Ahli Investasi, Perencana Keuangan Bersertifikat (CFP), dan Pakar Ekonomi Syariah dengan pengalaman 20 tahun. Buatkan materi pelajaran yang LENGKAP dan MENDALAM untuk topik berikut:

📌 TOPIK: ${mod.title}
📌 LEVEL: ${level.replace('L','Level ')} - ${data.title}
📌 DESKRIPSI: ${mod.desc}

FORMAT MATERI WAJIB (dalam Bahasa Indonesia):

1. **📖 Analisis Fundamental & Konsep** (minimal 5 paragraf, jelaskan mekanisme instrumen investasi, risiko, dan potensi imbal hasil secara mendalam.)

2. **⚖️ Perspektif Ekonomi Syariah** (jelaskan kesesuaian topik ini dengan prinsip Syariah: bebas Maghrib/Masyir, Gharar, Riba, dan akad yang digunakan.)

3. **📊 Strategi Portofolio & Risk Management** (langkah praktis dalam mengelola investasi dan memitigasi risiko kerugian.)

4. **📉 Contoh Riil & Simulasi** (berikan contoh kasus nyata di pasar modal atau simulasi perhitungan investasi yang logis.)

5. **💡 Tips Bijak Investor Senior** (3-5 tips strategis untuk mencapai kebebasan finansial yang berkah.)

6. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda (A, B, C, D) dengan format berikut UNTUK SETIAP SOAL:
[QUIZ]
Pertanyaan: (tulis pertanyaan analisis kasus)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf benar, contoh: B)
Penjelasan: (jelaskan logika finansial atau prinsip syariah di balik jawaban benar tersebut)
[/QUIZ]

Pastikan materi sangat profesional, akurat secara data, praktis, dan berkualitas setara literatur keuangan kelas atas!`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } })
        });
        if (response.status === 429) throw new Error('Quota Exceeded: Terlalu banyak permintaan. Mohon tunggu sejenak.');
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Gagal.';
        
        const { quizBlocks, cleanedText } = window.extractQuizAndCleanText(rawText);
        const formattedText = window.formatAIText(cleanedText);

        let quizHtml = '';
        if (quizBlocks.length) { quizHtml = `<div style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;"><h3 style="color:var(--primary);">📋 Kuis Interaktif (${quizBlocks.length} Soal)</h3>`; quizBlocks.forEach((q,i)=>{const qId=`invquiz_${moduleId}_${i}`; quizHtml+=`<div id="${qId}" style="background:var(--surface-hover);padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid var(--border);"><p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>${['a','b','c','d'].map(o=>`<button class="btn btn-secondary" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:10px;font-size:0.9rem;" onclick="checkGenericAnswer('${qId}','${o.toUpperCase()}','${q.answer}',this,'${encodeURIComponent(q.explanation)}')">${o.toUpperCase()}) ${q[o]}</button>`).join('')}<div id="${qId}_result" style="display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:0.9rem;"></div></div>`;}); quizHtml+=`<button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" onclick="completeGenericModule('investment','${level}','${moduleId}')">✅ Tandai Modul Selesai</button></div>`; }
        else { quizHtml = `<button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" onclick="completeGenericModule('investment','${level}','${moduleId}')">✅ Tandai Modul Selesai</button>`; }
        
        const actionBar = window.getActionBarHTML(mod.title, 'investment', moduleId);
        document.getElementById('inv-lesson-content').innerHTML = `
            ${actionBar}
            <div style="background:var(--surface);padding:30px;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.1);border:1px solid var(--border);">
                ${formattedText}
            </div>
            </div> <!-- Close lesson-body from actionBar -->
            ${quizHtml}
        `;
    } catch(err) { document.getElementById('inv-lesson-content').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat materi. Pastikan API Key dan internet aktif.</p><button class="btn btn-secondary mt-sm" onclick="openInvLesson('${level}','${moduleId}')">🔄 Coba Lagi</button>`; }
};
