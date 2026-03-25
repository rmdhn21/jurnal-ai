/**
 * PERTAMINA MASTERY - Sistem Belajar Budaya & Bisnis Pertamina
 * Level 1 - 5 dengan AI Lessons & Quiz (Pattern: Physics Mastery)
 */

const pertaminaSyllabus = {
    L1: {
        title: "Visi & Budaya AKHLAK",
        color: "#1e3a8a",
        modules: [
            { id: "ptm1_1", skill: "Visi", title: "Sejarah & Peran Pertamina", desc: "Mengenal sejarah dan peran strategis Pertamina bagi Negeri." },
            { id: "ptm1_2", skill: "Budaya", title: "Core Values AKHLAK", desc: "Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif." },
            { id: "ptm1_3", skill: "Etika", title: "Gratifikasi & GCG", desc: "Prinsip Good Corporate Governance di lingkungan BUMN." },
            { id: "ptm1_4", skill: "Strategi", title: "Visi Global Energy Champion", desc: "Aspirasi Pertamina memimpin transisi energi dunia." },
            { id: "ptm1_5", skill: "Apresiasi", title: "Pertamina Way", desc: "Standar perilaku dan cara kerja insan Pertamina." }
        ]
    },
    L2: {
        title: "Rantai Bisnis Migas (Up-Down)",
        color: "#1e40af",
        modules: [
            { id: "ptm2_1", skill: "Upstream", title: "Eksplorasi & Produksi", desc: "Proses pencarian dan pengambilan minyak mentah (Subholding Upstream)." },
            { id: "ptm2_2", skill: "Midstream", title: "Pengolahan & Petrokimia", desc: "Operasional kilang dan produk hilir (Subholding KPI)." },
            { id: "ptm2_3", skill: "Downstream", title: "Pemasaran & Distribusi", desc: "Menyalurkan BBM & LPG ke pelosok (Subholding Patra Niaga)." },
            { id: "ptm2_4", skill: "NRE", title: "Gas, New & Renewable Energy", desc: "Eksplorasi panas bumi dan energi hijau (Subholding PNRE)." },
            { id: "ptm2_5", skill: "Logistics", title: "Integrated Marine Logistics", desc: "Transportasi laut dan pelabuhan (Subholding PIS)." }
        ]
    },
    L3: {
        title: "Standar Safety (CLSR & SUPREME)",
        color: "#ef4444",
        modules: [
            { id: "ptm3_1", skill: "CLSR", title: "12 Corporate Life Saving Rules", desc: "Aturan keselamatan mutlak di seluruh area kerja Pertamina." },
            { id: "ptm3_2", skill: "SUPREME", title: "Sistem Manajemen HSSE (SUPREME)", desc: "Standar audit dan kepuasan safety korporat." },
            { id: "ptm3_3", skill: "Risk", title: "HIRA & Mitigasi Risiko", desc: "Cara mengidentifikasi bahaya di area operasional." },
            { id: "ptm3_4", skill: "Incident", title: "Pelaporan & Investigasi", desc: "Prosedur penanganan insiden dan lesson learned." },
            { id: "ptm3_5", skill: "Culture", title: "Budaya Intervensi", desc: "Berani menegur demi keselamatan bersama." }
        ]
    },
    L4: {
        title: "Operational Excellence & ESG",
        color: "#dc2626",
        modules: [
            { id: "ptm4_1", skill: "Digital", title: "Digitalisasi di Pertamina", desc: "MyPertamina, Dashboard Operasional, dan i-PDS." },
            { id: "ptm4_2", skill: "Efficiency", title: "Cost Optimization", desc: "Menjaga keberlangsungan bisnis melalui efisiensi." },
            { id: "ptm4_3", skill: "ESG", title: "Komitmen Lingkungan & Sosial", desc: "Implementasi Environment, Social, & Governance." },
            { id: "ptm4_4", skill: "CSR", title: "Community Development", desc: "Program Tanggung Jawab Sosial dan Lingkungan (TJSL)." },
            { id: "ptm4_5", skill: "Service", title: "Shared Services", desc: "Standardisasi proses bisnis penunjang." }
        ]
    },
    L5: {
        title: "Energy Transition & Future",
        color: "#b91c1c",
        modules: [
            { id: "ptm5_1", skill: "Energy", title: "Visi Net Zero Emission (NZE)", desc: "Target dekarbonisasi Pertamina pada tahun 2060." },
            { id: "ptm5_2", skill: "Bio", title: "Bioenergy & Geothermal", desc: "Pengembangan bahan bakar nabati dan energi bumi." },
            { id: "ptm5_3", skill: "CCS", title: "Teknologi Karbon (CCS/CCUS)", desc: "Menangkap dan menyimpan karbon untuk menekan emisi." },
            { id: "ptm5_4", skill: "Future", title: "Masa Depan SPBU & EV", desc: "Transformasi layanan energi bagi kendaraan listrik." },
            { id: "ptm5_5", skill: "Leadership", title: "Pemimpin Masa Depan Pertamina", desc: "Membangun talent pool yang kompetitif di kancah global." }
        ]
    }
};

let originalPertaminaHtml = '';
document.addEventListener('DOMContentLoaded', () => {
    const s = document.getElementById('pertamina-screen');
    if (s) originalPertaminaHtml = s.innerHTML;
    updatePtmProgressUI();
});

function getPtmProgress() { return JSON.parse(localStorage.getItem('ptm_progress') || '{}'); }

function updatePtmProgressUI() {
    const progress = getPtmProgress();
    Object.keys(pertaminaSyllabus).forEach(level => {
        const total = pertaminaSyllabus[level].modules.length;
        const completed = progress[level] ? progress[level].length : 0;
        const pct = Math.min(100, Math.round((completed / total) * 100));
        const bar = document.getElementById(`ptm-prog-${level}`);
        const txt = document.getElementById(`ptm-pct-${level}`);
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.innerHTML = `${pct}%`;
    });
}

window.openPtmLevel = function(level) {
    const data = pertaminaSyllabus[level]; if (!data) return;
    const progress = getPtmProgress(); const completed = progress[level] || [];
    const screen = document.getElementById('pertamina-screen');
    const skillGroups = {}; data.modules.forEach(m => { if (!skillGroups[m.skill]) skillGroups[m.skill] = []; skillGroups[m.skill].push(m); });
    const icons = { Visi:'🌍', Budaya:'🤝', Etika:'⚖️', Strategi:'🗺️', Apresiasi:'🎖️', Upstream:'⛴️', Midstream:'🏗️', Downstream:'⛽', NRE:'🍃', Logistics:'🚢', CLSR:'🔥', SUPREME:'🛡️', Risk:'🔍', Incident:'⚠️', Culture:'🙌', Digital:'📱', Efficiency:'📉', ESG:'🌱', CSR:'🏘️', Service:'⚙️', Energy:'🔋', Bio:'🌽', CCS:'🌫️', Future:'🚀', Leadership:'👑' };

    let html = `<div class="header-back"><button class="back-btn" onclick="backToPtmDashboard()"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>Level ${level.replace('L','')}: ${data.title}</h2><p class="text-muted">${completed.length}/${data.modules.length} modul selesai</p>
    <div class="progress-bar-bg" style="margin-top:10px;"><div class="progress-bar-fill" style="width:${Math.round(completed.length/data.modules.length*100)}%;"></div></div></div>`;

    Object.keys(skillGroups).forEach(skill => {
        html += `<div class="card mt-md"><h3>${icons[skill]||'🏢'} ${skill}</h3><div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">`;
        skillGroups[skill].forEach(mod => { const isDone = completed.includes(mod.id);
            html += `<div style="background:var(--surface-hover);padding:12px;border-radius:10px;border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;" onclick="openPtmLesson('${level}','${mod.id}')"><div style="font-size:1.3rem;min-width:30px;text-align:center;">${isDone?'✅':'📝'}</div><div style="flex:1;"><div style="font-weight:600;font-size:0.95rem;color:var(--text-color);${isDone?'text-decoration:line-through;opacity:0.7;':''}">${mod.title}</div><div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${mod.desc}</div></div><span style="font-size:0.8rem;color:var(--text-muted);">→</span></div>`;
        });
        html += `</div></div>`;
    });
    screen.innerHTML = html; window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.backToPtmDashboard = function() { const s = document.getElementById('pertamina-screen'); if (s && originalPertaminaHtml) { s.innerHTML = originalPertaminaHtml; updatePtmProgressUI(); } window.scrollTo({ top: 0, behavior: 'smooth' }); };

window.openPtmLesson = async function(level, moduleId) {
    const data = pertaminaSyllabus[level]; const mod = data.modules.find(m => m.id === moduleId); if (!mod) return;
    const screen = document.getElementById('pertamina-screen');
    screen.innerHTML = `<div class="header-back"><button class="back-btn" onclick="openPtmLevel('${level}')"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>${mod.title}</h2><p class="text-muted">${mod.skill} • Level ${level.replace('L','')}</p></div>
    <div class="card mt-md" id="ptm-lesson-content"><div class="loading-spinner" style="margin:20px auto;"></div><p class="text-center text-muted">⛽ Instruktur Pertamina sedang menyusun materi AKHLAK...</p></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) { document.getElementById('ptm-lesson-content').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key belum diatur.</p>'; return; }

    const prompt = `Kamu adalah Pakar Industri Energi, Senior Manager Pertamina, dan Konsultan Strategis dengan pengalaman 25 tahun di sektor hulu-hilir Migas. Buatkan materi pelajaran yang LENGKAP dan MENDALAM untuk topik berikut:

📌 TOPIK: ${mod.title}
📌 LEVEL: ${level.replace('L','Level ')} - ${data.title}
📌 DESKRIPSI: ${mod.desc}

FORMAT MATERI WAJIB (dalam Bahasa Indonesia):

1. **📖 Analisis Sektor & Fundamental** (minimal 5 paragraf, jelaskan ekosistem bisnis, rantai pasok, dan peran strategis Pertamina dalam kedaulatan energi nasional.)

2. **🔍 Operasional & Standar Teknis** (penjelasan detail mengenai proses bisnis dan standar industri yang berlaku di lingkungan Pertamina.)

3. **🏗️ Proyek Strategis & Inovasi** (bahas proyek nyata atau inovasi terkini yang relevan dengan topik ini.)

4. **📈 Tantangan & Masa Depan Energi** (3-5 tantangan yang dihadapi industri dan visi ke depan/transisi energi.)

5. **💡 Wawasan Eksklusif (Insight Korporat)** (3-5 tips atau wawasan penting untuk memahami budaya kerja dan efisiensi operasional.)

6. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda (A, B, C, D) dengan format berikut UNTUK SETIAP SOAL:
[QUIZ]
Pertanyaan: (tulis pertanyaan analisis atau pengetahuan industri)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf benar, contoh: B)
Penjelasan: (jelaskan wawasan industri atau data yang mendasari jawaban benar tersebut)
[/QUIZ]

Pastikan materi sangat profesional, berwawasan luas, akurat secara data, dan berkualitas setara laporan tahunan atau jurnal energi kelas dunia!`;

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
        if (quizBlocks.length) { quizHtml = `<div style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;"><h3 style="color:var(--primary);">📋 Kuis Interaktif (${quizBlocks.length} Soal)</h3>`; quizBlocks.forEach((q,i)=>{const qId=`ptmquiz_${moduleId}_${i}`; quizHtml+=`<div id="${qId}" style="background:var(--surface-hover);padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid var(--border);"><p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>${['a','b','c','d'].map(o=>`<button class="btn btn-secondary" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:10px;font-size:0.9rem;" onclick="checkGenericAnswer('${qId}','${o.toUpperCase()}','${q.answer}',this,'${encodeURIComponent(q.explanation)}')">${o.toUpperCase()}) ${q[o]}</button>`).join('')}<div id="${qId}_result" style="display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:0.9rem;"></div></div>`;}); quizHtml+=`<button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" onclick="completeGenericModule('pertamina','${level}','${moduleId}')">✅ Tandai Modul Selesai</button></div>`; }
        else { quizHtml = `<button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" onclick="completeGenericModule('pertamina','${level}','${moduleId}')">✅ Tandai Modul Selesai</button>`; }
        
        const actionBar = window.getActionBarHTML(mod.title, 'pertamina', moduleId);
        document.getElementById('ptm-lesson-content').innerHTML = `
            ${actionBar}
            <div style="background:var(--surface);padding:30px;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.1);border:1px solid var(--border);">
                ${formattedText}
            </div>
            </div> <!-- Close lesson-body from actionBar -->
            ${quizHtml}
        `;
    } catch(err) { document.getElementById('ptm-lesson-content').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat materi. Pastikan API Key dan internet aktif.</p><button class="btn btn-secondary mt-sm" onclick="openPtmLesson('${level}','${moduleId}')">🔄 Coba Lagi</button>`; }
};
