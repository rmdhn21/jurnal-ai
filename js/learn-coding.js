/**
 * CODING & AI MASTERY - Sistem Belajar Programming & AI
 * Level 1 - 5 dengan AI Lessons & Quiz (Pattern: Physics Mastery)
 */

const codingSyllabus = {
    L1: {
        title: "Logika & Dasar Programming",
        color: "#334155",
        modules: [
            { id: "code1_1", skill: "Logic", title: "Algoritma & Flowchart", desc: "Cara berpikir komputasional dalam menyelesaikan masalah." },
            { id: "code1_2", skill: "Syntax", title: "Variabel & Tipe Data", desc: "Dasar penyimpanan informasi dalam program (Python/JS)." },
            { id: "code1_3", skill: "Control", title: "Struktur Kondisional (If-Else)", desc: "Membuat alur keputusan dalam kode." },
            { id: "code1_4", skill: "Looping", title: "Perulangan (For & While)", desc: "Menjalankan tugas berulang secara efisien." },
            { id: "code1_5", skill: "Function", title: "Fungsi & Modularitas", desc: "Mengorganisir kode ke dalam blok yang bisa digunakan kembali." }
        ]
    },
    L2: {
        title: "Web Development (Frontend)",
        color: "#3b82f6",
        modules: [
            { id: "code2_1", skill: "HTML", title: "Struktur Semantik HTML5", desc: "Membangun kerangka web yang SEO-friendly." },
            { id: "code2_2", skill: "CSS", title: "Modern CSS Layout (Flexbox/Grid)", desc: "Menata layout web yang responsif dan cantik." },
            { id: "code2_3", skill: "JS", title: "DOM Manipulation", desc: "Membuat web interaktif dengan JavaScript." },
            { id: "code2_4", skill: "Responsive", title: "Mobile-First Design", desc: "Memastikan web tampil sempurna di semua perangkat." },
            { id: "code2_5", skill: "Framework", title: "Pengenalan React/Vite", desc: "Membangun dashboard modern dengan component-based architecture." }
        ]
    },
    L3: {
        title: "Backend & Database",
        color: "#1e293b",
        modules: [
            { id: "code3_1", skill: "Node", title: "Runtime Node.js & NPM", desc: "Menjalankan JavaScript di sisi server." },
            { id: "code3_2", skill: "API", title: "RESTful API dengan Express", desc: "Membangun endpoint komunikasi data." },
            { id: "code3_3", skill: "SQL", title: "Database Relasional (PostgreSQL)", desc: "Manajemen data menggunakan query SQL." },
            { id: "code3_4", skill: "Auth", title: "Sistem Autentikasi (JWT)", desc: "Mengamankan data pengguna dengan login & token." },
            { id: "code3_5", skill: "CRUD", title: "Integrasi Fullstack", desc: "Menghubungkan frontend dengan database backend." }
        ]
    },
    L4: {
        title: "AI & Machine Learning Dasar",
        color: "#3b82f6",
        modules: [
            { id: "code4_1", skill: "Prompt", title: "Advanced Prompt Engineering", desc: "Teknik berinteraksi dengan LLM untuk hasil maksimal." },
            { id: "code4_2", skill: "Integration", title: "Integrasi API Gemini/OpenAI", desc: "Menambahkan fitur cerdas ke dalam aplikasi web." },
            { id: "code4_3", skill: "NLP", title: "Natural Language Processing", desc: "Dasar pengolahan teks oleh komputer." },
            { id: "code4_4", skill: "Data", title: "Data Scraping & Cleaning", desc: "Mengambil dan menyiapkan data untuk AI." },
            { id: "code4_5", skill: "Agentic", title: "Membangun AI Agent Sederhana", desc: "Eksperimen dengan AI yang bisa menjalankan tugas otomatis." }
        ]
    },
    L5: {
        title: "Software Architecture & Cloud",
        color: "#2563eb",
        modules: [
            { id: "code5_1", skill: "Git", title: "Version Control (Git/GitHub)", desc: "Kolaborasi tim dan manajemen sejarah kode." },
            { id: "code5_2", skill: "Docker", title: "Kontainerisasi dengan Docker", desc: "Memastikan kode berjalan sama di semua lingkungan." },
            { id: "code5_3", skill: "Test", title: "Unit Testing & QA", desc: "Menjamin kualitas kode dengan testing otomatis." },
            { id: "code5_4", skill: "Cloud", title: "Deployment ke Vercel/Railway", desc: "Mempublikasikan aplikasi ke internet." },
            { id: "code5_5", skill: "Career", title: "Membangun Portfolio & CV", desc: "Persiapan karir sebagai Software Engineer profesional." }
        ]
    }
};

let originalCodeHtml = '';
document.addEventListener('DOMContentLoaded', () => {
    const s = document.getElementById('coding-screen');
    if (s) originalCodeHtml = s.innerHTML;
    updateCodeProgressUI();
});

function getCodeProgress() { return JSON.parse(localStorage.getItem('code_progress') || '{}'); }

function updateCodeProgressUI() {
    const progress = getCodeProgress();
    Object.keys(codingSyllabus).forEach(level => {
        const total = codingSyllabus[level].modules.length;
        const completed = progress[level] ? progress[level].length : 0;
        const pct = Math.min(100, Math.round((completed / total) * 100));
        const bar = document.getElementById(`code-prog-${level}`);
        const txt = document.getElementById(`code-pct-${level}`);
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.innerHTML = `${pct}%`;
    });
}

window.openCodeLevel = function(level) {
    const data = codingSyllabus[level]; if (!data) return;
    const progress = getCodeProgress(); const completed = progress[level] || [];
    const screen = document.getElementById('coding-screen');
    const skillGroups = {}; data.modules.forEach(m => { if (!skillGroups[m.skill]) skillGroups[m.skill] = []; skillGroups[m.skill].push(m); });
    const icons = { Logic:'🧠', Syntax:'⌨️', Control:'🚦', Looping:'🔄', Function:'📦', HTML:'🌐', CSS:'🎨', JS:'⚡', Responsive:'📱', Framework:'⚛️', Node:'🟢', API:'🔌', SQL:'🗄️', Auth:'🔐', CRUD:'💾', Prompt:'💬', Integration:'🤖', NLP:'📖', Data:'📊', Agentic:'🚀', Git:'🌿', Docker:'🐳', Test:'🧪', Cloud:'☁️', Career:'💼' };

    let html = `<div class="header-back"><button class="back-btn" onclick="backToCodeDashboard()"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>Level ${level.replace('L','')}: ${data.title}</h2><p class="text-muted">${completed.length}/${data.modules.length} modul selesai</p>
    <div class="progress-bar-bg" style="margin-top:10px;"><div class="progress-bar-fill" style="width:${Math.round(completed.length/data.modules.length*100)}%;"></div></div></div>`;

    Object.keys(skillGroups).forEach(skill => {
        html += `<div class="card mt-md"><h3>${icons[skill]||'👨‍💻'} ${skill}</h3><div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">`;
        skillGroups[skill].forEach(mod => { const isDone = completed.includes(mod.id);
            html += `<div style="background:var(--surface-hover);padding:12px;border-radius:10px;border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;" onclick="openCodeLesson('${level}','${mod.id}')"><div style="font-size:1.3rem;min-width:30px;text-align:center;">${isDone?'✅':'📝'}</div><div style="flex:1;"><div style="font-weight:600;font-size:0.95rem;color:var(--text-color);${isDone?'text-decoration:line-through;opacity:0.7;':''}">${mod.title}</div><div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${mod.desc}</div></div><span style="font-size:0.8rem;color:var(--text-muted);">→</span></div>`;
        });
        html += `</div></div>`;
    });
    screen.innerHTML = html; window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.backToCodeDashboard = function() { const s = document.getElementById('coding-screen'); if (s && originalCodeHtml) { s.innerHTML = originalCodeHtml; updateCodeProgressUI(); } window.scrollTo({ top: 0, behavior: 'smooth' }); };

window.openCodeLesson = async function(level, moduleId) {
    const data = codingSyllabus[level]; const mod = data.modules.find(m => m.id === moduleId); if (!mod) return;
    const screen = document.getElementById('coding-screen');
    screen.innerHTML = `<div class="header-back"><button class="back-btn" onclick="openCodeLevel('${level}')"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>${mod.title}</h2><p class="text-muted">${mod.skill} • Level ${level.replace('L','')}</p></div>
    <div class="card mt-md" id="code-lesson-content"><div class="loading-spinner" style="margin:20px auto;"></div><p class="text-center text-muted">💻 Mentormu sedang meninjau kode instruksi AI...</p></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) { document.getElementById('code-lesson-content').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key belum diatur.</p>'; return; }

    const prompt = `Kamu adalah Senior Software Engineer, Fullstack Developer, dan Pakar AI dengan pengalaman 15 tahun di perusahaan teknologi global. Buatkan materi pelajaran yang LENGKAP dan MENDALAM untuk topik berikut:

📌 TOPIK: ${mod.title}
📌 LEVEL: ${level.replace('L','Level ')} - ${data.title}
📌 DESKRIPSI: ${mod.desc}

FORMAT MATERI WAJIB (dalam Bahasa Indonesia):

1. **📖 Penjelasan Konsep & Arsitektur** (minimal 5 paragraf, jelaskan fundamental pemrograman, algoritma, atau logika AI yang mendasari topik ini sejelas mungkin.)

2. **💻 Code Implementation (Best Practices)** (berikan contoh blok kode yang bersih, efisien, dan terdokumentasi dengan baik disertai penjelasan tiap barisnya.)

3. **🏗️ Proyek Kecil / Latihan Praktis** (instruksi langkah-demi-langkah untuk mencoba konsep ini dalam proyek nyata.)

4. **🛠️ Debugging & Troubleshooting** (3-5 kesalahan umum/bug yang sering ditemui saat mengimplementasikan konsep ini dan cara memperbaikinya.)

5. **💡 Tips Senior Developer** (3-5 tips produktivitas, standar industri, atau optimasi performa.)

6. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda (A, B, C, D) dengan format berikut UNTUK SETIAP SOAL:
[QUIZ]
Pertanyaan: (tulis pertanyaan teknis atau cuplikan kode untuk dianalisis)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf benar, contoh: B)
Penjelasan: (jelaskan logika pemrograman atau hasil eksekusi kode di balik jawaban tersebut)
[/QUIZ]

Pastikan materi sangat teknis, akurat, up-to-date, dan berkualitas setara dokumentasi teknologi kelas dunia!`;

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
        if (quizBlocks.length) { quizHtml = `<div style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;"><h3 style="color:var(--primary);">📋 Kuis Interaktif (${quizBlocks.length} Soal)</h3>`; quizBlocks.forEach((q,i)=>{const qId=`codequiz_${moduleId}_${i}`; quizHtml+=`<div id="${qId}" style="background:var(--surface-hover);padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid var(--border);"><p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>${['a','b','c','d'].map(o=>`<button class="btn btn-secondary" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:10px;font-size:0.9rem;" onclick="checkGenericAnswer('${qId}','${o.toUpperCase()}','${q.answer}',this,'${encodeURIComponent(q.explanation)}')">${o.toUpperCase()}) ${q[o]}</button>`).join('')}<div id="${qId}_result" style="display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:0.9rem;"></div></div>`;}); quizHtml+=`<button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" onclick="completeGenericModule('coding','${level}','${moduleId}')">✅ Tandai Modul Selesai</button></div>`; }
        else { quizHtml = `<button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" onclick="completeGenericModule('coding','${level}','${moduleId}')">✅ Tandai Modul Selesai</button>`; }
        
        const actionBar = window.getActionBarHTML(mod.title, 'coding', moduleId);
        document.getElementById('code-lesson-content').innerHTML = `
            ${actionBar}
            <div style="background:var(--surface);padding:30px;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.1);border:1px solid var(--border);">
                ${formattedText}
            </div>
            </div> <!-- Close lesson-body from actionBar -->
            ${quizHtml}
        `;
    } catch(err) { document.getElementById('code-lesson-content').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat materi. Pastikan API Key dan internet aktif.</p><button class="btn btn-secondary mt-sm" onclick="openCodeLesson('${level}','${moduleId}')">🔄 Coba Lagi</button>`; }
};
