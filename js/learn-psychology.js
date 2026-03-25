/**
 * PSYCHOLOGY & EQ MASTERY - Sistem Belajar Psikologi
 * Level 1 - 5 dengan AI Lessons & Quiz (Pattern: Physics Mastery)
 */

const psychologySyllabus = {
    L1: {
        title: "Dasar Psikologi & Perilaku",
        color: "#d946ef",
        modules: [
            { id: "psy1_1", skill: "Konsep", title: "Pengantar Psikologi & Sejarahnya", desc: "Mengenal asal-usul ilmu psikologi dan tokoh pentingnya." },
            { id: "psy1_2", skill: "Biologis", title: "Sistem Saraf & Otak", desc: "Bagaimana otak mengontrol pikiran dan perilaku kita." },
            { id: "psy1_3", skill: "Kognitif", title: "Sensasi & Persepsi", desc: "Cara panca indra menerima dan memproses informasi." },
            { id: "psy1_4", skill: "Kepribadian", title: "Tipe-Tipe Kepribadian", desc: "Mengenal MBTI, Big Five, dan teori kepribadian lainnya." },
            { id: "psy1_5", skill: "Kognitif", title: "Psikologi Berpikir", desc: "Bagaimana manusia mengambil keputusan dan memecahkan masalah." }
        ]
    },
    L2: {
        title: "Kecerdasan Emosional (EQ)",
        color: "#a855f7",
        modules: [
            { id: "psy2_1", skill: "Dasar EQ", title: "5 Pilar Daniel Goleman", desc: "Membedah komponen utama kecerdasan emosional." },
            { id: "psy2_2", skill: "Self", title: "Self-Awareness (Kesadaran Diri)", desc: "Mengenali emosi dan dampaknya terhadap orang lain." },
            { id: "psy2_3", skill: "Self", title: "Self-Regulation (Manajemen Diri)", desc: "Mengelola emosi negatif dan tetap tenang di bawah tekanan." },
            { id: "psy2_4", skill: "Sosial", title: "Empati & Kemampuan Sosial", desc: "Memahami perasaan orang lain dan membangun hubungan." },
            { id: "psy2_5", skill: "Motivasi", title: "Motivasi Intrinsik vs Ekstrinsik", desc: "Mendorong diri dari dalam untuk mencapai tujuan jangka panjang." }
        ]
    },
    L3: {
        title: "Komunikasi & Hubungan",
        color: "#8b5cf6",
        modules: [
            { id: "psy3_1", skill: "Listening", title: "Active Listening & Validasi", desc: "Seni mendengar aktif agar orang merasa dipahami." },
            { id: "psy3_2", skill: "Gaya Komp", title: "Komunikasi Asertif", desc: "Menyampaikan keinginan tanpa menjadi agresif atau pasif." },
            { id: "psy3_3", skill: "Non-Verbal", title: "Bahasa Tubuh & Micro-expressions", desc: "Membaca isyarat tubuh dan ekspresi wajah lawan bicara." },
            { id: "psy3_4", skill: "Konflik", title: "Resolusi Konflik & Negosiasi", desc: "Mencari solusi win-win dalam situasi sulit." },
            { id: "psy3_5", skill: "Sosial", title: "Psikologi Pengaruh Kelompok", desc: "Konformitas, otoritas, dan perilaku sosial dalam tim." }
        ]
    },
    L4: {
        title: "Mental Health & Resilience",
        color: "#6366f1",
        modules: [
            { id: "psy4_1", skill: "Manajemen", title: "Manajemen Stres & Burnout", desc: "Mengenali gejala kelelahan mental dan cara mengatasinya." },
            { id: "psy4_2", skill: "Teknik", title: "Mindfulness & Meditasi Dasar", desc: "Latihan hadir di saat ini untuk menurunkan kecemasan." },
            { id: "psy4_3", skill: "Resilience", title: "Membangun Ketangguhan Mental", desc: "Cara bangkit dari kegagalan dan tantangan hidup." },
            { id: "psy4_4", skill: "Klinis Dasar", title: "Mengenal Anxiety & Depresi", desc: "Wawasan dasar tentang gangguan mental yang umum." },
            { id: "psy4_5", skill: "Mindset", title: "Growth Mindset vs Fixed Mindset", desc: "Mengubah pola pikir untuk terus berkembang." }
        ]
    },
    L5: {
        title: "Leadership & Coaching",
        color: "#3b82f6",
        modules: [
            { id: "psy5_1", skill: "Lead", title: "Psikologi Kepemimpinan", desc: "Gaya kepemimpinan yang efektif berdasarkan situasi." },
            { id: "psy5_2", skill: "Coach", title: "Teknik Coaching & Mentoring", desc: "Membantu orang lain menemukan potensi terbaik mereka." },
            { id: "psy5_3", skill: "Feedback", title: "Memberi Feedback yang Membangun", desc: "Cara menegur atau mengapresiasi secara psikologis." },
            { id: "psy5_4", skill: "Persuasi", title: "Seni Persuasi & Pengaruh", desc: "Teknik Cialdini dalam mempengaruhi keputusan orang." },
            { id: "psy5_5", skill: "Org", title: "Budaya Kerja & Motivasi Tim", desc: "Membangun lingkungan kerja yang sehat secara psikis." }
        ]
    }
};

let originalPsychologyHtml = '';
document.addEventListener('DOMContentLoaded', () => {
    const s = document.getElementById('psychology-screen');
    if (s) originalPsychologyHtml = s.innerHTML;
    updatePsyProgressUI();
});

function getPsyProgress() { return JSON.parse(localStorage.getItem('psy_progress') || '{}'); }

function updatePsyProgressUI() {
    const progress = getPsyProgress();
    Object.keys(psychologySyllabus).forEach(level => {
        const total = psychologySyllabus[level].modules.length;
        const completed = progress[level] ? progress[level].length : 0;
        const pct = Math.min(100, Math.round((completed / total) * 100));
        const bar = document.getElementById(`psy-prog-${level}`);
        const txt = document.getElementById(`psy-pct-${level}`);
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.innerHTML = `${pct}%`;
    });
}

window.openPsyLevel = function(level) {
    const data = psychologySyllabus[level]; if (!data) return;
    const progress = getPsyProgress(); const completed = progress[level] || [];
    const screen = document.getElementById('psychology-screen');
    const skillGroups = {}; data.modules.forEach(m => { if (!skillGroups[m.skill]) skillGroups[m.skill] = []; skillGroups[m.skill].push(m); });
    const icons = { Konsep:'📐', Biologis:'🧠', Kognitif:'⚙️', Kepribadian:'🎭', 'Dasar EQ':'💎', Self:'🧘', Sosial:'👥', Motivasi:'🔥', Listening:'👂', 'Gaya Komp':'🗣️', 'Non-Verbal':'👁️', Konflik:'⚖️', Manajemen:'🔋', Teknik:'✨', Resilience:'🧗', 'Klinis Dasar':'🏥', Mindset:'🌱', Lead:'👑', Coach:'📣', Feedback:'📝', Persuasi:'🧲', Org:'🏢' };

    let html = `<div class="header-back"><button class="back-btn" onclick="backToPsyDashboard()"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>Level ${level.replace('L','')}: ${data.title}</h2><p class="text-muted">${completed.length}/${data.modules.length} modul selesai</p>
    <div class="progress-bar-bg" style="margin-top:10px;"><div class="progress-bar-fill" style="width:${Math.round(completed.length/data.modules.length*100)}%;"></div></div></div>`;

    Object.keys(skillGroups).forEach(skill => {
        html += `<div class="card mt-md"><h3>${icons[skill]||'📚'} ${skill}</h3><div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">`;
        skillGroups[skill].forEach(mod => { const isDone = completed.includes(mod.id);
            html += `<div style="background:var(--surface-hover);padding:12px;border-radius:10px;border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;" onclick="openPsyLesson('${level}','${mod.id}')"><div style="font-size:1.3rem;min-width:30px;text-align:center;">${isDone?'✅':'📝'}</div><div style="flex:1;"><div style="font-weight:600;font-size:0.95rem;color:var(--text-color);${isDone?'text-decoration:line-through;opacity:0.7;':''}">${mod.title}</div><div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${mod.desc}</div></div><span style="font-size:0.8rem;color:var(--text-muted);">→</span></div>`;
        });
        html += `</div></div>`;
    });
    screen.innerHTML = html; window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.backToPsyDashboard = function() { const s = document.getElementById('psychology-screen'); if (s && originalPsychologyHtml) { s.innerHTML = originalPsychologyHtml; updatePsyProgressUI(); } window.scrollTo({ top: 0, behavior: 'smooth' }); };

window.openPsyLesson = async function(level, moduleId) {
    const data = psychologySyllabus[level]; const mod = data.modules.find(m => m.id === moduleId); if (!mod) return;
    const screen = document.getElementById('psychology-screen');
    screen.innerHTML = `<div class="header-back"><button class="back-btn" onclick="openPsyLevel('${level}')"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>${mod.title}</h2><p class="text-muted">${mod.skill} • Level ${level.replace('L','')}</p></div>
    <div class="card mt-md" id="psy-lesson-content"><div class="loading-spinner" style="margin:20px auto;"></div><p class="text-center text-muted">🧠 Tutor Psikologi Anda sedang menyusun materi...</p></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) { document.getElementById('psy-lesson-content').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key belum diatur.</p>'; return; }

    const prompt = `Kamu adalah Psikolog Klinis dan Pakar Kecerdasan Emosional (EQ) dengan pengalaman praktik 20 tahun. Buatkan materi pelajaran yang LENGKAP dan MENDALAM untuk topik berikut:

📌 TOPIK: ${mod.title}
📌 LEVEL: ${level.replace('L','Level ')} - ${data.title}
📌 DESKRIPSI: ${mod.desc}

FORMAT MATERI WAJIB (dalam Bahasa Indonesia):

1. **📖 Teori Dasar & Psikologi** (minimal 5 paragraf, jelaskan landasan ilmiah, fungsi otak/amigdala, dan konsep psikologis yang mendasari topik ini.)

2. **💡 Strategi Pengembangan EQ** (langkah-langkah praktis dan latihan mental untuk melatih kecerdasan emosional.)

3. **🧘 Aktivitas / Latihan Mandiri** (instruksi latihan praktis yang bisa dilakukan pengguna saat ini juga.)

4. **💼 Penerapan dalam Kehidupan & Karir** (bagaimana konsep ini membantu dalam hubungan sosial dan profesional.)

5. **🌟 Tips dari Pakar EQ** (3-5 nasihat bijak untuk menjaga kesehatan mental dan stabilitas emosi.)

6. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda (A, B, C, D) dengan format berikut UNTUK SETIAP SOAL:
[QUIZ]
Pertanyaan: (tulis pertanyaan berbasis kasus atau konsep)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf benar, contoh: B)
Penjelasan: (jelaskan alasan psikologis di balik jawaban benar tersebut)
[/QUIZ]

Pastikan materi sangat empatik, ilmiah, praktis, dan berkualitas setara literatur psikologi modern!`;

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
        if (quizBlocks.length) { quizHtml = `<div style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;"><h3 style="color:var(--primary);">📋 Kuis Interaktif (${quizBlocks.length} Soal)</h3>`; quizBlocks.forEach((q,i)=>{const qId=`psyquiz_${moduleId}_${i}`; quizHtml+=`<div id="${qId}" style="background:var(--surface-hover);padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid var(--border);"><p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>${['a','b','c','d'].map(o=>`<button class="btn btn-secondary" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:10px;font-size:0.9rem;" onclick="checkGenericAnswer('${qId}','${o.toUpperCase()}','${q.answer}',this,'${encodeURIComponent(q.explanation)}')">${o.toUpperCase()}) ${q[o]}</button>`).join('')}<div id="${qId}_result" style="display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:0.9rem;"></div></div>`;}); quizHtml+=`<button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" onclick="completeGenericModule('psychology','${level}','${moduleId}')">✅ Tandai Modul Selesai</button></div>`; }
        else { quizHtml = `<button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" onclick="completeGenericModule('psychology','${level}','${moduleId}')">✅ Tandai Modul Selesai</button>`; }
        
        const actionBar = window.getActionBarHTML(mod.title, 'psychology', moduleId);
        document.getElementById('psy-lesson-content').innerHTML = `
            ${actionBar}
            <div style="background:var(--surface);padding:30px;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.1);border:1px solid var(--border);">
                ${formattedText}
            </div>
            </div> <!-- Close lesson-body from actionBar -->
            ${quizHtml}
        `;
    } catch(err) { document.getElementById('psy-lesson-content').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat materi. Pastikan API Key dan internet aktif.</p><button class="btn btn-secondary mt-sm" onclick="openPsyLesson('${level}','${moduleId}')">🔄 Coba Lagi</button>`; }
};
