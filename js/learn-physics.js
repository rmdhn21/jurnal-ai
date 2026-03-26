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

window.openPhysicsLesson = function(level, moduleId, forceRefresh = false) {
    const data = physicsSyllabus[level];
    const mod = data.modules.find(m => m.id === moduleId);
    if (!mod) return;

    const prompt = `Kamu adalah Pakar Fisika (PhD Physics) dan Pendidik berpengalaman 20 tahun. Buatkan materi pelajaran yang LENGKAP dan MENDALAM untuk topik berikut:

📌 TOPIK: ${mod.title}
📌 LEVEL: ${level.replace('L','Level ')} - ${data.title}
📌 DESKRIPSI: ${mod.desc}

⚠️ ATURAN PENTING PENULISAN SIMBOL (WAJIB):
- JANGAN GUNAKAN LaTeX ($...$, \\(...\\), \\[...\\], \\text{...}).
- Gunakan tag HTML sederhana untuk simbol matematika:
    - Pangkat: gunakan <sup> (contoh: m<sup>2</sup>, x<sup>10</sup>).
    - Indeks: gunakan <sub> (contoh: H<sub>2</sub>O).
    - Perkalian: gunakan &times; (×).
    - Pembagian: gunakan &divide; (÷).
    - Karakter Yunani: gunakan entitas HTML (contoh: &Delta;, &pi;, &rho;, &omega;).

FORMAT MATERI WAJIB (dalam Bahasa Indonesia):

1. **📖 Penjelasan Konsep & Teori** (minimal 5 paragraf, jelaskan sejelas-jelasnya dengan bahasa Indonesia yang mudah dipahami. Sertakan RUMUS dan DERIVASI jika ada.)

2. **📐 Rumus-Rumus Penting** (daftar semua rumus relevan dengan penjelasan simbol dan satuannya.)

3. **📝 Contoh Soal & Pembahasan** (minimal 3 soal hitungan yang bervariasi, berikan penyelesaian step-by-step yang logis.)

4. **💡 Tips & Tricks Senior** (3-5 tips praktis untuk memecahkan soal atau memahami konsep ini lebih cepat.)

5. **⚠️ Kesalahan Umum (Common Mistakes)** (3-5 kesalahan yang sering dilakukan siswa dalam topik ini beserta koreksinya.)

6. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda (A, B, C, D) dengan format berikut UNTUK SETIAP SOAL:
[QUIZ]
Pertanyaan: (tulis pertanyaan)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf benar, contoh: B)
Penjelasan: (jelaskan & tunjukkan perhitungannya secara detail)
[/QUIZ]

Pastikan seluruh materi sangat detail, berkualitas tinggi, and setara buku Halliday/Resnick atau Serway!`;

    const onComplete = () => {
        const progress = JSON.parse(localStorage.getItem('physics_progress') || '{}');
        if (!progress[level]) progress[level] = [];
        if (!progress[level].includes(moduleId)) {
            progress[level].push(moduleId);
            localStorage.setItem('physics_progress', JSON.stringify(progress));
            updatePhysicsProgressUI();
        }
        backToPhysicsDashboard();
    };

    showAiLessonScreen('physics-screen', mod.title, prompt, onComplete, `physics_${moduleId}`, forceRefresh, () => openPhysicsLevel(level));
};
