// ============================================
// HSSE MASTERY - Health, Safety, Security & Environment
// Level 1 - 5 dengan AI Lessons & Quiz
// ============================================

const hsseSyllabus = {
    L1: {
        title: "Dasar K3 & Identifikasi Bahaya",
        color: "#22c55e",
        modules: [
            { id: "h1_1", skill: "Konsep K3", title: "Pengantar K3 (HSE)", desc: "Definisi, tujuan, sejarah, dan regulasi K3 di Indonesia (UU No.1/1970)." },
            { id: "h1_2", skill: "Konsep K3", title: "Hirarki Pengendalian Risiko", desc: "Eliminasi, Substitusi, Engineering, Administratif, APD." },
            { id: "h1_3", skill: "Konsep K3", title: "Hazard Identification (HIRA/IBPR)", desc: "Identifikasi bahaya, penilaian risiko, matriks risiko." },
            { id: "h1_4", skill: "APD", title: "Alat Pelindung Diri (PPE)", desc: "Jenis APD: helmet, safety glasses, gloves, coverall, safety shoes, SCBA." },
            { id: "h1_5", skill: "APD", title: "Standar & Sertifikasi APD", desc: "ANSI, EN, SNI, cara inspeksi dan perawatan APD." },
            { id: "h1_6", skill: "Dokumen", title: "JSA (Job Safety Analysis)", desc: "Cara menyusun JSA: langkah kerja, bahaya, dan pengendalian." },
            { id: "h1_7", skill: "Dokumen", title: "Permit to Work (Izin Kerja)", desc: "Jenis PTW: Hot Work, Confined Space, Working at Height, Excavation." },
            { id: "h1_8", skill: "Dokumen", title: "Toolbox Talk / Safety Meeting", desc: "Cara memimpin TBT yang efektif di lapangan." },
            { id: "h1_9", skill: "Praktik", title: "Housekeeping & 5R/5S", desc: "Ringkas, Rapi, Resik, Rawat, Rajin di area kerja." },
            { id: "h1_10", skill: "Praktik", title: "Safety Sign & Color Coding", desc: "Rambu keselamatan: prohibition, mandatory, warning, information." }
        ]
    },
    L2: {
        title: "Process Safety & High Risk Work",
        color: "#3b82f6",
        modules: [
            { id: "h2_1", skill: "LOTO", title: "Lockout/Tagout (LOTO)", desc: "Isolasi energi: prosedur, jenis lock, verifikasi zero energy." },
            { id: "h2_2", skill: "Confined Space", title: "Confined Space Entry", desc: "Definisi, gas testing, ventilasi, standby man, rescue plan." },
            { id: "h2_3", skill: "Hot Work", title: "Pekerjaan Panas (Hot Work)", desc: "Pengelasan, pemotongan, grinding: fire watch, gas testing, LEL/UEL." },
            { id: "h2_4", skill: "WAH", title: "Working at Height", desc: "Fall protection, harness, scaffolding, guardrail, rescue plan." },
            { id: "h2_5", skill: "Lifting", title: "Lifting & Rigging Operation", desc: "Crane safety, SWL, sling inspection, lift plan, signal man." },
            { id: "h2_6", skill: "Excavation", title: "Excavation & Trenching", desc: "Soil classification, shoring, sloping, underground utilities." },
            { id: "h2_7", skill: "Electrical", title: "Electrical Safety", desc: "Arc flash, grounding, GFCI, lockout, voltage categories." },
            { id: "h2_8", skill: "Process Safety", title: "Process Safety Management (PSM)", desc: "14 elemen PSM OSHA, MOC, PHA, mechanical integrity." },
            { id: "h2_9", skill: "Process Safety", title: "Line of Fire Awareness", desc: "Bahaya terjepit, terpukul, tertabrak, dropped object." },
            { id: "h2_10", skill: "Gas Testing", title: "Gas Detection & Monitoring", desc: "O2, LEL, H2S, CO: alat deteksi, batas aman, kalibrasi." }
        ]
    },
    L3: {
        title: "Emergency Response & Fire Safety",
        color: "#ef4444",
        modules: [
            { id: "h3_1", skill: "Fire Safety", title: "Segitiga Api & Klasifikasi Kebakaran", desc: "Fire triangle, kelas A/B/C/D/K, media pemadam." },
            { id: "h3_2", skill: "Fire Safety", title: "APAR & Sistem Pemadam Tetap", desc: "Jenis APAR (CO2, powder, foam), hydrant, sprinkler, deluge system." },
            { id: "h3_3", skill: "Fire Safety", title: "Fire Prevention & Detection", desc: "Smoke/heat detector, fire alarm, fireproofing, fire wall." },
            { id: "h3_4", skill: "Emergency", title: "Emergency Response Plan (ERP)", desc: "Assembly point, muster drill, chain of command, communication." },
            { id: "h3_5", skill: "Emergency", title: "First Aid & CPR", desc: "P3K dasar, DRSABCD, AED, penanganan luka bakar/patah tulang." },
            { id: "h3_6", skill: "Emergency", title: "Spill Response", desc: "Oil spill, chemical spill: containment, MSDS, clean-up procedure." },
            { id: "h3_7", skill: "Emergency", title: "H2S Emergency & Rescue", desc: "Bahaya H2S, wind direction, buddy system, SCBA, cascade system." },
            { id: "h3_8", skill: "Emergency", title: "Man Overboard & Water Rescue", desc: "Prosedur MOB, life jacket, life raft, HUET training." }
        ]
    },
    L4: {
        title: "Environmental Management",
        color: "#10b981",
        modules: [
            { id: "h4_1", skill: "Lingkungan", title: "AMDAL & UKL-UPL", desc: "Analisis dampak lingkungan, dokumen wajib, pelaporan." },
            { id: "h4_2", skill: "Lingkungan", title: "Pengelolaan Limbah B3", desc: "Klasifikasi limbah B3, penyimpanan, pengangkutan, manifest." },
            { id: "h4_3", skill: "Lingkungan", title: "Air Quality & Emission Control", desc: "Baku mutu emisi, CEMS, dust suppression, flare management." },
            { id: "h4_4", skill: "Lingkungan", title: "Water Treatment & Discharge", desc: "Produced water, oily water separator, baku mutu effluen." },
            { id: "h4_5", skill: "Lingkungan", title: "Noise & Vibration Control", desc: "Batas kebisingan (85 dBA/8 jam), audiometri, engineering control." },
            { id: "h4_6", skill: "Lingkungan", title: "Biodiversity & Conservation", desc: "Perlindungan flora/fauna, revegetasi, social responsibility." },
            { id: "h4_7", skill: "ISO", title: "ISO 14001 Environmental Management System", desc: "PDCA cycle, aspect-impact, legal compliance, audit." },
            { id: "h4_8", skill: "ISO", title: "ISO 45001 Occupational Health & Safety", desc: "Konteks organisasi, leadership, planning, operation, performance evaluation." }
        ]
    },
    L5: {
        title: "HSE Leadership & Audit",
        color: "#8b5cf6",
        modules: [
            { id: "h5_1", skill: "Investigasi", title: "Incident Investigation", desc: "Root cause analysis (RCA), 5-Why, fishbone diagram, Swiss cheese model." },
            { id: "h5_2", skill: "Investigasi", title: "Incident Classification & Reporting", desc: "Near miss, first aid, DAFWC, fatality, TRIR, LTIR." },
            { id: "h5_3", skill: "Audit", title: "HSE Audit & Inspection", desc: "Jenis audit (internal/external), checklist, findings, CAPA." },
            { id: "h5_4", skill: "Audit", title: "Behaviour Based Safety (BBS)", desc: "Observasi perilaku, kartu BBS, positive reinforcement, coaching." },
            { id: "h5_5", skill: "Leadership", title: "Safety Culture & Leadership", desc: "Bradley curve, felt leadership, safety moment, visible leadership." },
            { id: "h5_6", skill: "Leadership", title: "HSE KPI & Performance Metrics", desc: "Leading vs lagging indicators, safety dashboard, target zero." },
            { id: "h5_7", skill: "Leadership", title: "Contractor Safety Management", desc: "Pre-qualification, CSMS, bridging document, contractor audit." },
            { id: "h5_8", skill: "Sertifikasi", title: "Persiapan AK3 Umum (Ahli K3)", desc: "Syarat, materi ujian, regulasi wajib, tips lulus sertifikasi AK3." }
        ]
    }
};

let originalHsseHtml = '';
document.addEventListener('DOMContentLoaded', () => { const s = document.getElementById('hsse-screen'); if (s) originalHsseHtml = s.innerHTML; updateHsseProgressUI(); });

function getHsseProgress() { return JSON.parse(localStorage.getItem('hsse_progress') || '{}'); }
function saveHsseProgress(p) { localStorage.setItem('hsse_progress', JSON.stringify(p)); }

function updateHsseProgressUI() {
    const progress = getHsseProgress();
    Object.keys(hsseSyllabus).forEach(level => {
        const total = hsseSyllabus[level].modules.length;
        const completed = progress[level] ? progress[level].length : 0;
        const pct = Math.min(100, Math.round((completed / total) * 100));
        const bar = document.getElementById(`hsse-prog-${level}`);
        const txt = document.getElementById(`hsse-pct-${level}`);
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.innerHTML = `${pct}%`;
    });
}

window.openHsseLevel = function(level) {
    const data = hsseSyllabus[level]; if (!data) return;
    const progress = getHsseProgress(); const completed = progress[level] || [];
    const screen = document.getElementById('hsse-screen');
    const skillGroups = {}; data.modules.forEach(m => { if (!skillGroups[m.skill]) skillGroups[m.skill] = []; skillGroups[m.skill].push(m); });
    const icons = { 'Konsep K3':'🛡️', APD:'👷', Dokumen:'📋', Praktik:'🔧', LOTO:'🔒', 'Confined Space':'🕳️', 'Hot Work':'🔥', WAH:'🧗', Lifting:'🏗️', Excavation:'⛏️', Electrical:'⚡', 'Process Safety':'⚙️', 'Gas Testing':'🧪', 'Fire Safety':'🧯', Emergency:'🚨', Lingkungan:'🌿', ISO:'📜', Investigasi:'🔍', Audit:'📊', Leadership:'👑', Sertifikasi:'🎓' };

    let html = `<div class="header-back"><button class="back-btn" onclick="backToHsseDashboard()"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>Level ${level.replace('L','')}: ${data.title}</h2><p class="text-muted">${completed.length}/${data.modules.length} modul selesai</p>
    <div class="progress-bar-bg" style="margin-top:10px;"><div class="progress-bar-fill" style="width:${Math.round(completed.length/data.modules.length*100)}%;"></div></div></div>`;

    Object.keys(skillGroups).forEach(skill => {
        html += `<div class="card mt-md"><h3>${icons[skill]||'📚'} ${skill}</h3><div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">`;
        skillGroups[skill].forEach(mod => { const isDone = completed.includes(mod.id);
            html += `<div style="background:var(--surface-hover);padding:12px;border-radius:10px;border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;" onclick="openHsseLesson('${level}','${mod.id}')"><div style="font-size:1.3rem;min-width:30px;text-align:center;">${isDone?'✅':'📝'}</div><div style="flex:1;"><div style="font-weight:600;font-size:0.95rem;color:var(--text-color);${isDone?'text-decoration:line-through;opacity:0.7;':''}">${mod.title}</div><div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${mod.desc}</div></div><span style="font-size:0.8rem;color:var(--text-muted);">→</span></div>`;
        });
        html += `</div></div>`;
    });
    screen.innerHTML = html; window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.backToHsseDashboard = function() { const s = document.getElementById('hsse-screen'); if (s && originalHsseHtml) { s.innerHTML = originalHsseHtml; updateHsseProgressUI(); } window.scrollTo({ top: 0, behavior: 'smooth' }); };

window.openHsseLesson = async function(level, moduleId) {
    const data = hsseSyllabus[level]; const mod = data.modules.find(m => m.id === moduleId); if (!mod) return;
    const screen = document.getElementById('hsse-screen');
    screen.innerHTML = `<div class="header-back"><button class="back-btn" onclick="openHsseLevel('${level}')"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>${mod.title}</h2><p class="text-muted">${mod.skill} • Level ${level.replace('L','')}</p></div>
    <div class="card mt-md" id="hsse-lesson-content"><div class="loading-spinner" style="margin:20px auto;"></div><p class="text-center text-muted">🛡️ AI HSSE Expert sedang menyusun materi...</p></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) { document.getElementById('hsse-lesson-content').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key belum diatur.</p>'; return; }

    const prompt = `Kamu adalah Senior HSSE Manager bersertifikat NEBOSH IGC dan Pakar K3 Industri dengan pengalaman 20 tahun. Buatkan materi pelajaran yang LENGKAP dan MENDALAM untuk topik berikut:

📌 TOPIK: ${mod.title}
📌 LEVEL: ${level.replace('L','Level ')} - ${data.title}
📌 DESKRIPSI: ${mod.desc}

FORMAT MATERI WAJIB (dalam Bahasa Indonesia):

1. **📖 Penjelasan Materi & Regulasi** (minimal 5 paragraf, jelaskan konsep keselamatan, landasan hukum/UU No.1 1970, dan standar internasional OSHA/ISO.)

2. **📋 Prosedur Keselamatan (SOP)** (langkah-langkah kerja aman yang sangat detail dan teknis.)

3. **⚠️ Studi Kasus & Mitigasi** (minimal 2 contoh insiden nyata di industri, analisis penyebab, dan langkah pencegahannya.)

4. **🛠️ Peralatan & APD Terkait** (daftar peralatan pendukung dan spesifikasi APD yang wajib digunakan.)

5. **💡 Tips Praktis Lapangan (Safety Culture)** (3-5 tips praktis untuk pekerja di lapangan/rig/pabrik.)

6. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda (A, B, C, D) dengan format berikut UNTUK SETIAP SOAL:
[QUIZ]
Pertanyaan: (tulis pertanyaan)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf benar, contoh: B)
Penjelasan: (jelaskan aspek keselamatan dan alasan logis jawabannya)
[/QUIZ]

Pastikan materi sangat profesional, akurat secara teknis, dan menjunjung tinggi prinsip "Zero Accident"!`;

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
        if (quizBlocks.length) { quizHtml = `<div style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;"><h3 style="color:var(--primary);">📋 Kuis Interaktif (${quizBlocks.length} Soal)</h3>`; quizBlocks.forEach((q,i)=>{const qId=`hquiz_${moduleId}_${i}`; quizHtml+=`<div id="${qId}" style="background:var(--surface-hover);padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid var(--border);"><p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>${['a','b','c','d'].map(o=>`<button class="btn btn-secondary" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:10px;font-size:0.9rem;" onclick="checkGenericAnswer('${qId}','${o.toUpperCase()}','${q.answer}',this,'${encodeURIComponent(q.explanation)}')">${o.toUpperCase()}) ${q[o]}</button>`).join('')}<div id="${qId}_result" style="display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:0.9rem;"></div></div>`;}); quizHtml+=`<button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" onclick="completeGenericModule('hsse','${level}','${moduleId}')">✅ Tandai Modul Selesai</button></div>`; }
        else { quizHtml = `<button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" onclick="completeGenericModule('hsse','${level}','${moduleId}')">✅ Tandai Modul Selesai</button>`; }
        
        const actionBar = window.getActionBarHTML(mod.title, 'hsse', moduleId);
        document.getElementById('hsse-lesson-content').innerHTML = `
            ${actionBar}
            <div style="background:var(--surface);padding:30px;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.1);border:1px solid var(--border);">
                ${formattedText}
            </div>
            </div> <!-- Close lesson-body from actionBar -->
            ${quizHtml}
        `;
    } catch(err) { document.getElementById('hsse-lesson-content').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat materi. Pastikan API Key dan internet aktif.</p><button class="btn btn-secondary mt-sm" onclick="openHsseLesson('${level}','${moduleId}')">🔄 Coba Lagi</button>`; }
};
