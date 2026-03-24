// ============================================
// PHYSICS MASTERY - Sistem Belajar Fisika
// Level 1 - 5 dengan AI Lessons & Quiz
// ============================================

const physicsSyllabus = {
    L1: {
        title: "Mekanika & Kinematika",
        color: "#3b82f6",
        modules: [
            { id: "p1_1", skill: "Konsep", title: "Besaran & Satuan", desc: "Besaran pokok, turunan, konversi satuan (SI), dimensi." },
            { id: "p1_2", skill: "Konsep", title: "Vektor & Skalar", desc: "Penjumlahan vektor, penguraian komponen, resultan gaya." },
            { id: "p1_3", skill: "Kinematika", title: "Gerak Lurus Beraturan (GLB)", desc: "Kecepatan konstan, rumus s = v × t, grafik." },
            { id: "p1_4", skill: "Kinematika", title: "Gerak Lurus Berubah Beraturan (GLBB)", desc: "Percepatan konstan, rumus v = v₀ + at, gerak jatuh bebas." },
            { id: "p1_5", skill: "Kinematika", title: "Gerak Parabola", desc: "Gerak peluru, jarak tempuh horizontal & vertikal." },
            { id: "p1_6", skill: "Kinematika", title: "Gerak Melingkar", desc: "Kecepatan sudut, percepatan sentripetal, frekuensi & periode." },
            { id: "p1_7", skill: "Dinamika", title: "Hukum Newton I, II, III", desc: "F = m × a, aksi-reaksi, inersia." },
            { id: "p1_8", skill: "Dinamika", title: "Gaya Gesek", desc: "Gesek statis vs kinetis, koefisien gesek, bidang miring." },
            { id: "p1_9", skill: "Dinamika", title: "Usaha & Energi", desc: "W = F × s, energi kinetik, energi potensial, hukum kekekalan energi." },
            { id: "p1_10", skill: "Dinamika", title: "Impuls & Momentum", desc: "Hukum kekekalan momentum, tumbukan elastis & tak elastis." },
            { id: "p1_11", skill: "Dinamika", title: "Gravitasi Newton", desc: "Gaya gravitasi, medan gravitasi, hukum Kepler." },
            { id: "p1_12", skill: "Latihan", title: "Soal Mekanika Komprehensif", desc: "Latihan soal hitungan gabungan dari seluruh materi Level 1." }
        ]
    },
    L2: {
        title: "Fluida & Termodinamika",
        color: "#06b6d4",
        modules: [
            { id: "p2_1", skill: "Fluida", title: "Tekanan Hidrostatis", desc: "P = ρgh, Hukum Pascal, Prinsip Archimedes." },
            { id: "p2_2", skill: "Fluida", title: "Fluida Dinamis", desc: "Persamaan kontinuitas, Hukum Bernoulli, Toricelli." },
            { id: "p2_3", skill: "Fluida", title: "Tegangan Permukaan & Viskositas", desc: "Kapilaritas, Hukum Stokes, aliran laminar vs turbulen." },
            { id: "p2_4", skill: "Termodinamika", title: "Suhu & Kalor", desc: "Konversi suhu (C, F, K), kalor jenis, Asas Black." },
            { id: "p2_5", skill: "Termodinamika", title: "Perpindahan Kalor", desc: "Konduksi, konveksi, radiasi." },
            { id: "p2_6", skill: "Termodinamika", title: "Teori Kinetik Gas", desc: "Gas ideal, PV = nRT, energi kinetik molekul." },
            { id: "p2_7", skill: "Termodinamika", title: "Hukum Termodinamika I & II", desc: "ΔU = Q - W, entropi, mesin Carnot." },
            { id: "p2_8", skill: "Latihan", title: "Soal Fluida & Termodinamika", desc: "Latihan soal hitungan komprehensif Level 2." }
        ]
    },
    L3: {
        title: "Gelombang, Bunyi & Cahaya",
        color: "#8b5cf6",
        modules: [
            { id: "p3_1", skill: "Gelombang", title: "Gelombang Mekanik", desc: "Transversal & longitudinal, amplitudo, frekuensi, panjang gelombang." },
            { id: "p3_2", skill: "Gelombang", title: "Superposisi & Interferensi", desc: "Gelombang stasioner, interferensi konstruktif/destruktif." },
            { id: "p3_3", skill: "Bunyi", title: "Gelombang Bunyi", desc: "Intensitas bunyi, efek Doppler, resonansi, pelayangan." },
            { id: "p3_4", skill: "Optik", title: "Cahaya & Pemantulan", desc: "Hg. pemantulan, cermin datar, cermin cekung/cembung." },
            { id: "p3_5", skill: "Optik", title: "Pembiasan & Lensa", desc: "Hk. Snellius, lensa cembung/cekung, alat optik (mata, lup, mikroskop)." },
            { id: "p3_6", skill: "Optik", title: "Difraksi & Polarisasi", desc: "Celah tunggal/ganda, kisi difraksi, polarisasi cahaya." },
            { id: "p3_7", skill: "Latihan", title: "Soal Gelombang & Optik", desc: "Latihan komprehensif Level 3." }
        ]
    },
    L4: {
        title: "Listrik & Magnet",
        color: "#f59e0b",
        modules: [
            { id: "p4_1", skill: "Listrik Statis", title: "Hukum Coulomb", desc: "Gaya elektrostatis, medan listrik, potensial listrik." },
            { id: "p4_2", skill: "Listrik Statis", title: "Kapasitor", desc: "Kapasitansi, energi tersimpan, rangkaian seri & paralel." },
            { id: "p4_3", skill: "Listrik Dinamis", title: "Hukum Ohm & Kirchhoff", desc: "V = IR, arus, hambatan, rangkaian listrik." },
            { id: "p4_4", skill: "Listrik Dinamis", title: "Daya & Energi Listrik", desc: "P = V × I, kWh, efisiensi perangkat listrik." },
            { id: "p4_5", skill: "Magnet", title: "Medan Magnet", desc: "Gaya Lorentz, kawat berarus, medan pada solenoida." },
            { id: "p4_6", skill: "Magnet", title: "Induksi Elektromagnetik", desc: "Hk. Faraday, Hk. Lenz, GGL induksi, generator, transformator." },
            { id: "p4_7", skill: "Magnet", title: "Rangkaian AC (Arus Bolak-balik)", desc: "Impedansi, RLC, resonansi, daya AC." },
            { id: "p4_8", skill: "Latihan", title: "Soal Listrik & Magnet", desc: "Latihan komprehensif Level 4." }
        ]
    },
    L5: {
        title: "Fisika Modern & Nuklir",
        color: "#ef4444",
        modules: [
            { id: "p5_1", skill: "Modern", title: "Dualisme Gelombang-Partikel", desc: "Hipotesis de Broglie, eksperimen celah ganda." },
            { id: "p5_2", skill: "Modern", title: "Efek Fotolistrik", desc: "Foton, energi ambang, fungsi kerja, persamaan Einstein." },
            { id: "p5_3", skill: "Modern", title: "Teori Relativitas Khusus", desc: "Dilatasi waktu, kontraksi panjang, E = mc²." },
            { id: "p5_4", skill: "Modern", title: "Model Atom", desc: "Atom Bohr, spektrum atom hidrogen, bilangan kuantum." },
            { id: "p5_5", skill: "Nuklir", title: "Radioaktivitas", desc: "Peluruhan α, β, γ, waktu paruh, deret radioaktif." },
            { id: "p5_6", skill: "Nuklir", title: "Reaksi Fisi & Fusi", desc: "Pembelahan inti, penggabungan inti, reaktor nuklir." },
            { id: "p5_7", skill: "Latihan", title: "Soal Fisika Modern", desc: "Latihan komprehensif Level 5." }
        ]
    }
};

// ============== REUSABLE LEARNING ENGINE (same pattern as EPLS) ==============

let originalPhysicsHtml = '';

document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('physics-screen');
    if (screen) originalPhysicsHtml = screen.innerHTML;
    updatePhysicsProgressUI();
});

function getPhysicsProgress() {
    return JSON.parse(localStorage.getItem('physics_progress') || '{}');
}
function savePhysicsProgress(p) { localStorage.setItem('physics_progress', JSON.stringify(p)); }

function updatePhysicsProgressUI() {
    const progress = getPhysicsProgress();
    Object.keys(physicsSyllabus).forEach(level => {
        const total = physicsSyllabus[level].modules.length;
        const completed = progress[level] ? progress[level].length : 0;
        const pct = Math.min(100, Math.round((completed / total) * 100));
        const bar = document.getElementById(`physics-prog-${level}`);
        const txt = document.getElementById(`physics-pct-${level}`);
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.innerHTML = `${pct}%`;
    });
}

window.openPhysicsLevel = function(level) {
    const data = physicsSyllabus[level];
    if (!data) return;
    const progress = getPhysicsProgress();
    const completed = progress[level] || [];
    const screen = document.getElementById('physics-screen');
    const skillGroups = {};
    data.modules.forEach(m => { if (!skillGroups[m.skill]) skillGroups[m.skill] = []; skillGroups[m.skill].push(m); });
    const skillIcons = { Konsep: '📐', Kinematika: '🏃', Dinamika: '⚡', Fluida: '💧', Termodinamika: '🔥', Gelombang: '🌊', Bunyi: '🔊', Optik: '💡', 'Listrik Statis': '⚡', 'Listrik Dinamis': '🔌', Magnet: '🧲', Modern: '🔬', Nuklir: '☢️', Latihan: '📝' };

    let html = `<div class="header-back"><button class="back-btn" onclick="backToPhysicsDashboard()"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>Level ${level.replace('L','')}: ${data.title}</h2><p class="text-muted">${completed.length}/${data.modules.length} modul selesai</p>
    <div class="progress-bar-bg" style="margin-top:10px;"><div class="progress-bar-fill" style="width:${Math.round(completed.length/data.modules.length*100)}%;"></div></div></div>`;

    Object.keys(skillGroups).forEach(skill => {
        html += `<div class="card mt-md"><h3>${skillIcons[skill]||'📚'} ${skill}</h3><div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">`;
        skillGroups[skill].forEach(mod => {
            const isDone = completed.includes(mod.id);
            html += `<div style="background:var(--surface-hover);padding:12px;border-radius:10px;border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;" onclick="openPhysicsLesson('${level}','${mod.id}')"><div style="font-size:1.3rem;min-width:30px;text-align:center;">${isDone?'✅':'📝'}</div><div style="flex:1;"><div style="font-weight:600;font-size:0.95rem;color:var(--text-color);${isDone?'text-decoration:line-through;opacity:0.7;':''}">${mod.title}</div><div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${mod.desc}</div></div><span style="font-size:0.8rem;color:var(--text-muted);">→</span></div>`;
        });
        html += `</div></div>`;
    });
    screen.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.backToPhysicsDashboard = function() {
    const screen = document.getElementById('physics-screen');
    if (screen && originalPhysicsHtml) { screen.innerHTML = originalPhysicsHtml; updatePhysicsProgressUI(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.openPhysicsLesson = async function(level, moduleId) {
    const data = physicsSyllabus[level];
    const mod = data.modules.find(m => m.id === moduleId);
    if (!mod) return;
    const screen = document.getElementById('physics-screen');
    screen.innerHTML = `<div class="header-back"><button class="back-btn" onclick="openPhysicsLevel('${level}')"><span class="back-icon">←</span> Kembali ke Level ${level.replace('L','')}</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>${mod.title}</h2><p class="text-muted">${mod.skill} • Level ${level.replace('L','')}</p></div>
    <div class="card mt-md" id="physics-lesson-content"><div class="loading-spinner" style="margin:20px auto;"></div><p class="text-center text-muted">🧠 AI Guru Fisika sedang menyusun materi...</p></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) { document.getElementById('physics-lesson-content').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key belum diatur.</p>'; return; }

    const prompt = `Kamu adalah guru Fisika berpengalaman 15 tahun, ahli di bidang Fisika Teknik dan Fisika Dasar Universitas.

📌 TOPIK: ${mod.title}
📌 LEVEL: ${level.replace('L','Level ')} - ${data.title}
📌 DESKRIPSI: ${mod.desc}

Buatkan materi pelajaran LENGKAP dalam Bahasa Indonesia:

1. **📖 Penjelasan Konsep** (min 5 paragraf, jelaskan dengan sangat mudah dipahami, sertakan RUMUS dan DERIVASI jika ada)

2. **📐 Rumus-Rumus Penting** (daftar semua rumus relevan dengan penjelasan simbol-simbolnya)

3. **📝 Contoh Soal & Pembahasan** (min 3 soal hitungan LENGKAP dengan langkah penyelesaian step-by-step)

4. **💡 Tips & Tricks** (3-5 tips untuk menguasai topik ini)

5. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda (A, B, C, D):
[QUIZ]
Pertanyaan: (tulis pertanyaan, bisa hitungan)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf benar)
Penjelasan: (jelaskan & tunjukkan perhitungannya)
[/QUIZ]

Pastikan materi berkualitas tinggi setara buku Halliday/Resnick!`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } })
        });
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        let text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Gagal.';
        const quizBlocks = [];
        text = text.replace(/\[QUIZ\]([\s\S]*?)\[\/QUIZ\]/g, (_, block) => {
            const q = block.match(/Pertanyaan:\s*(.*)/i), a = block.match(/^A\)\s*(.*)/mi), b = block.match(/^B\)\s*(.*)/mi), c = block.match(/^C\)\s*(.*)/mi), d = block.match(/^D\)\s*(.*)/mi), ans = block.match(/Jawaban:\s*([A-D])/i), exp = block.match(/Penjelasan:\s*([\s\S]*?)$/i);
            if (q && ans) quizBlocks.push({ q: q[1].trim(), a: a?.[1]?.trim()||'', b: b?.[1]?.trim()||'', c: c?.[1]?.trim()||'', d: d?.[1]?.trim()||'', answer: ans[1].trim().toUpperCase(), explanation: exp?.[1]?.trim()||'' });
            return '';
        });
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^### (.*$)/gim, '<h4 style="color:var(--primary);margin-top:15px;">$1</h4>').replace(/^## (.*$)/gim, '<h3 style="color:var(--primary);margin-top:20px;">$1</h3>').replace(/^# (.*$)/gim, '<h2 style="color:var(--primary);margin-top:20px;">$1</h2>').replace(/\n/g, '<br>');
        let quizHtml = '';
        if (quizBlocks.length > 0) {
            quizHtml = `<div style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;"><h3 style="color:var(--primary);">📋 Kuis (${quizBlocks.length} Soal)</h3>`;
            quizBlocks.forEach((q, i) => { const qId = `pquiz_${moduleId}_${i}`;
                quizHtml += `<div id="${qId}" style="background:var(--surface-hover);padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid var(--border);"><p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>${['a','b','c','d'].map(o=>`<button class="btn btn-secondary" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:10px;font-size:0.9rem;" onclick="checkGenericAnswer('${qId}','${o.toUpperCase()}','${q.answer}',this,'${encodeURIComponent(q.explanation)}')">${o.toUpperCase()}) ${q[o]}</button>`).join('')}<div id="${qId}_result" style="display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:0.9rem;"></div></div>`;
            });
            quizHtml += `<button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" onclick="completeGenericModule('physics','${level}','${moduleId}')">✅ Tandai Modul Selesai</button></div>`;
        } else { quizHtml = `<button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" onclick="completeGenericModule('physics','${level}','${moduleId}')">✅ Tandai Modul Selesai</button>`; }
        document.getElementById('physics-lesson-content').innerHTML = `<div style="line-height:1.8;font-size:0.95rem;">${text}</div>${quizHtml}`;
    } catch (err) {
        document.getElementById('physics-lesson-content').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat. Cek API Key & internet.</p><button class="btn btn-secondary mt-sm" onclick="openPhysicsLesson('${level}','${moduleId}')">🔄 Coba Lagi</button>`;
    }
};
