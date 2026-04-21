// ============================================
// EPLS - English Proficiency Learning System
// A1 to C1 CEFR Learning Path with AI Lessons
// ============================================

// ============== CEFR SYLLABUS DATABASE ==============
const eplsSyllabus = {
    A1: {
        title: "Elementary Foundation",
        color: "#38a169",
        modules: [
            { id: "a1_1", skill: "Grammar", title: "Nouns & Pronouns", desc: "Kata benda (countable/uncountable) dan kata ganti (I, you, he, she, it, we, they)." },
            { id: "a1_2", skill: "Grammar", title: "To Be (am, is, are)", desc: "Struktur dasar kalimat dengan to be: I am, You are, She is." },
            { id: "a1_3", skill: "Grammar", title: "Simple Present Tense", desc: "Kebiasaan sehari-hari: I eat, She works, They play." },
            { id: "a1_4", skill: "Grammar", title: "Simple Past Tense", desc: "Menceritakan masa lalu: I went, She cooked, We played." },
            { id: "a1_5", skill: "Grammar", title: "Articles (a, an, the)", desc: "Kapan memakai a, an, dan the dalam kalimat." },
            { id: "a1_6", skill: "Vocabulary", title: "Greetings & Introduction", desc: "Hello, My name is..., Nice to meet you." },
            { id: "a1_7", skill: "Vocabulary", title: "Family & People", desc: "Father, mother, brother, sister, friend, teacher." },
            { id: "a1_8", skill: "Vocabulary", title: "Daily Routines", desc: "Wake up, take a shower, go to work, eat lunch." },
            { id: "a1_9", skill: "Vocabulary", title: "Numbers, Days & Time", desc: "Angka 1-100, hari dalam seminggu, dan jam." },
            { id: "a1_10", skill: "Reading", title: "Short Self-Introduction", desc: "Membaca dan memahami teks pendek perkenalan diri." },
            { id: "a1_11", skill: "Listening", title: "Basic Dialogues", desc: "Mendengarkan percakapan singkat sehari-hari." },
            { id: "a1_12", skill: "Writing", title: "Simple Sentences", desc: "Menulis 5-10 kalimat tentang diri sendiri." },
            { id: "a1_13", skill: "Speaking", title: "Self Introduction", desc: "Berlatih memperkenalkan diri dalam bahasa Inggris." },
            { id: "a1_14", skill: "Grammar", title: "Prepositions of Place", desc: "In, on, at, under, next to, between." },
            { id: "a1_15", skill: "Grammar", title: "Can / Can't", desc: "Kemampuan dan ketidakmampuan: I can swim, She can't drive." }
        ]
    },
    A2: {
        title: "Pre-Intermediate",
        color: "#38a169",
        modules: [
            { id: "a2_1", skill: "Grammar", title: "Present Continuous", desc: "Sedang terjadi sekarang: I am reading, They are playing." },
            { id: "a2_2", skill: "Grammar", title: "Past Continuous", desc: "Sedang terjadi di masa lampau: I was studying when..." },
            { id: "a2_3", skill: "Grammar", title: "Future (will & going to)", desc: "Rencana & prediksi masa depan." },
            { id: "a2_4", skill: "Grammar", title: "Comparatives & Superlatives", desc: "Bigger, the biggest, more beautiful, the most beautiful." },
            { id: "a2_5", skill: "Grammar", title: "Countable & Uncountable Nouns", desc: "Many/few vs. much/little. Some, any." },
            { id: "a2_6", skill: "Grammar", title: "Adverbs of Frequency", desc: "Always, usually, sometimes, rarely, never." },
            { id: "a2_7", skill: "Vocabulary", title: "Food, Drink & Restaurant", desc: "Menu, order, waiter, bill, delicious." },
            { id: "a2_8", skill: "Vocabulary", title: "Travel & Transportation", desc: "Airport, ticket, bus, train, hotel, luggage." },
            { id: "a2_9", skill: "Vocabulary", title: "Health & Body Parts", desc: "Headache, fever, doctor, medicine, hospital." },
            { id: "a2_10", skill: "Vocabulary", title: "Shopping & Money", desc: "How much, discount, receipt, expensive, cheap." },
            { id: "a2_11", skill: "Reading", title: "Short Stories & Emails", desc: "Membaca cerita pendek dan email informal." },
            { id: "a2_12", skill: "Listening", title: "Directions & Instructions", desc: "Memahami petunjuk arah dan instruksi sederhana." },
            { id: "a2_13", skill: "Writing", title: "Informal Emails & Messages", desc: "Menulis email sederhana kepada teman." },
            { id: "a2_14", skill: "Speaking", title: "Asking for Directions", desc: "Berlatih bertanya dan memberi arah." },
            { id: "a2_15", skill: "Grammar", title: "Modal Verbs (must, should, have to)", desc: "Kewajiban dan saran." },
            { id: "a2_16", skill: "Vocabulary", title: "Weather & Seasons", desc: "Sunny, rainy, cloudy, hot, cold, spring, winter." },
            { id: "a2_17", skill: "Vocabulary", title: "Jobs & Workplace", desc: "Engineer, doctor, meeting, deadline, colleague." },
            { id: "a2_18", skill: "Writing", title: "Describing a Place", desc: "Menulis deskripsi tentang rumah atau kota." },
            { id: "a2_19", skill: "Speaking", title: "Making Plans with Friends", desc: "Let's go to..., How about...?, That sounds great!" },
            { id: "a2_20", skill: "Grammar", title: "Linking Words (and, but, because, so)", desc: "Menghubungkan kalimat secara logis." }
        ]
    },
    B1: {
        title: "Intermediate Mastery",
        color: "#3182ce",
        modules: [
            { id: "b1_1", skill: "Grammar", title: "Present Perfect Tense", desc: "Pengalaman hidup: I have visited Paris. She has never eaten sushi." },
            { id: "b1_2", skill: "Grammar", title: "Present Perfect vs Past Simple", desc: "Perbedaan: I have been vs I went." },
            { id: "b1_3", skill: "Grammar", title: "Passive Voice (Basic)", desc: "The book was written by..., Rice is grown in..." },
            { id: "b1_4", skill: "Grammar", title: "Conditional Type 1 (If + Present)", desc: "If it rains, I will stay home." },
            { id: "b1_5", skill: "Grammar", title: "Relative Clauses (who, which, that)", desc: "The man who lives next door. The book that I read." },
            { id: "b1_6", skill: "Grammar", title: "Reported Speech (Basic)", desc: "She said that she was tired. He told me he would come." },
            { id: "b1_7", skill: "Vocabulary", title: "Emotions & Personality", desc: "Ambitious, anxious, confident, frustrated, relieved." },
            { id: "b1_8", skill: "Vocabulary", title: "Education & Learning", desc: "Scholarship, assignment, semester, lecture, graduation." },
            { id: "b1_9", skill: "Vocabulary", title: "Technology & Internet", desc: "Download, upload, browse, social media, software, app." },
            { id: "b1_10", skill: "Vocabulary", title: "Environment & Nature", desc: "Pollution, recycle, climate change, endangered species." },
            { id: "b1_11", skill: "Reading", title: "News Articles", desc: "Membaca dan memahami artikel berita sederhana." },
            { id: "b1_12", skill: "Listening", title: "Podcast Summarization", desc: "Mendengarkan rekaman dan merangkum poin-poin utama." },
            { id: "b1_13", skill: "Writing", title: "Opinion Essays", desc: "Menulis esai pendek berisi pendapat (setuju/tidak setuju)." },
            { id: "b1_14", skill: "Speaking", title: "Expressing Opinions & Debate", desc: "In my opinion..., I agree/disagree because..." },
            { id: "b1_15", skill: "Grammar", title: "Used to & Would", desc: "Kebiasaan masa lalu: I used to play football." },
            { id: "b1_16", skill: "Vocabulary", title: "Business & Meetings", desc: "Agenda, negotiate, proposal, revenue, stakeholder." },
            { id: "b1_17", skill: "Reading", title: "Formal Letters", desc: "Membaca surat lamaran kerja dan surat resmi." },
            { id: "b1_18", skill: "Writing", title: "Cover Letter Basics", desc: "Menulis surat lamaran kerja sederhana." },
            { id: "b1_19", skill: "Grammar", title: "Gerunds & Infinitives", desc: "I enjoy swimming. I want to learn. Stop talking!" },
            { id: "b1_20", skill: "Speaking", title: "Job Interview Practice", desc: "Tell me about yourself. What are your strengths?" },
            { id: "b1_21", skill: "Grammar", title: "Phrasal Verbs (Common)", desc: "Look up, give up, turn on, find out, carry out." },
            { id: "b1_22", skill: "Vocabulary", title: "Media & Entertainment", desc: "Documentary, broadcast, headline, review, streaming." },
            { id: "b1_23", skill: "Listening", title: "TED Talk Comprehension", desc: "Mendengarkan presentasi dan menjawab pertanyaan." },
            { id: "b1_24", skill: "Grammar", title: "Conditional Type 2 (If + Past)", desc: "If I were rich, I would travel the world." },
            { id: "b1_25", skill: "Writing", title: "Report Writing", desc: "Menulis laporan singkat berdasarkan data." }
        ]
    },
    B2: {
        title: "Upper-Intermediate",
        color: "#3182ce",
        modules: [
            { id: "b2_1", skill: "Grammar", title: "Past Perfect Tense", desc: "Urutan kejadian: She had already left when I arrived." },
            { id: "b2_2", skill: "Grammar", title: "Conditional Type 3", desc: "Penyesalan: If I had studied harder, I would have passed." },
            { id: "b2_3", skill: "Grammar", title: "Advanced Passive Voice", desc: "It is believed that..., He is said to be..." },
            { id: "b2_4", skill: "Grammar", title: "Inversion & Emphasis", desc: "Not only...but also, Hardly...when, Never have I..." },
            { id: "b2_5", skill: "Grammar", title: "Mixed Conditionals", desc: "If I had studied medicine, I would be a doctor now." },
            { id: "b2_6", skill: "Grammar", title: "Wish & If Only", desc: "I wish I had more time. If only she were here." },
            { id: "b2_7", skill: "Vocabulary", title: "Academic Vocabulary", desc: "Hypothesis, methodology, significant, analysis, correlation." },
            { id: "b2_8", skill: "Vocabulary", title: "Idioms & Expressions", desc: "Break the ice, hit the nail on the head, a piece of cake." },
            { id: "b2_9", skill: "Vocabulary", title: "Collocations", desc: "Make a decision, do research, take responsibility." },
            { id: "b2_10", skill: "Vocabulary", title: "Formal vs Informal Register", desc: "Commence vs Start, Obtain vs Get, Assist vs Help." },
            { id: "b2_11", skill: "Reading", title: "Academic Journal Abstracts", desc: "Membaca dan menganalisis abstrak jurnal ilmiah." },
            { id: "b2_12", skill: "Listening", title: "Lectures & Seminars", desc: "Note-taking dari kuliah universitas berbahasa Inggris." },
            { id: "b2_13", skill: "Writing", title: "Argumentative Essays", desc: "Menulis esai argumentatif dengan thesis statement." },
            { id: "b2_14", skill: "Speaking", title: "Presentations & Public Speaking", desc: "Menyampaikan presentasi profesional dalam bahasa Inggris." },
            { id: "b2_15", skill: "Grammar", title: "Cleft Sentences", desc: "It was John who broke the window. What I need is rest." },
            { id: "b2_16", skill: "Vocabulary", title: "Law & Politics", desc: "Legislation, amendment, verdict, jurisdiction, campaign." },
            { id: "b2_17", skill: "Reading", title: "Critical Analysis of Articles", desc: "Menganalisis bias, tone, dan argumen dalam artikel." },
            { id: "b2_18", skill: "Writing", title: "Formal Reports & Proposals", desc: "Menulis proposal bisnis dan laporan formal." },
            { id: "b2_19", skill: "Grammar", title: "Participle Clauses", desc: "Having finished the work, he went home." },
            { id: "b2_20", skill: "Speaking", title: "Negotiation & Persuasion", desc: "Teknik bernegosiasi dan meyakinkan lawan bicara." },
            { id: "b2_21", skill: "Vocabulary", title: "Science & Research", desc: "Variable, hypothesis, data, experiment, conclusion." },
            { id: "b2_22", skill: "Listening", title: "Debates & Panel Discussions", desc: "Memahami argumen dari berbagai sudut pandang." },
            { id: "b2_23", skill: "Grammar", title: "Advanced Reported Speech", desc: "Reporting verbs: He insisted, She denied, They suggested." },
            { id: "b2_24", skill: "Writing", title: "Literature Review Basics", desc: "Menulis tinjauan pustaka ringkas untuk riset." },
            { id: "b2_25", skill: "Speaking", title: "Academic Discussion", desc: "Berdiskusi topik akademis dengan argumen kuat." },
            { id: "b2_26", skill: "Vocabulary", title: "Finance & Economics", desc: "Inflation, investment, dividend, recession, GDP." },
            { id: "b2_27", skill: "Grammar", title: "Subjunctive Mood", desc: "I suggest that he be promoted. It's vital that she attend." },
            { id: "b2_28", skill: "Reading", title: "Case Studies", desc: "Membaca dan menganalisis studi kasus bisnis." },
            { id: "b2_29", skill: "Writing", title: "Comparison & Contrast Essays", desc: "Membandingkan dua topik secara akademis." },
            { id: "b2_30", skill: "Speaking", title: "Storytelling & Anecdotes", desc: "Bercerita pengalaman dengan struktur naratif yang kuat." }
        ]
    },
    C1: {
        title: "Advanced Proficiency",
        color: "#d53f8c",
        modules: [
            { id: "c1_1", skill: "Grammar", title: "Advanced Tense Review", desc: "Penguasaan seluruh 12 tenses dalam konteks kompleks." },
            { id: "c1_2", skill: "Grammar", title: "Discourse Markers & Cohesion", desc: "Nevertheless, furthermore, in spite of, whereas." },
            { id: "c1_3", skill: "Grammar", title: "Nominalization", desc: "Mengubah verba/adjektiva menjadi nomina: develop → development." },
            { id: "c1_4", skill: "Grammar", title: "Hedging Language", desc: "It could be argued that..., This may suggest..." },
            { id: "c1_5", skill: "Vocabulary", title: "C1 Academic Word List", desc: "Acquire, comprehensive, derive, facilitate, inherent." },
            { id: "c1_6", skill: "Vocabulary", title: "Advanced Phrasal Verbs", desc: "Come up with, get away with, put up with, look into." },
            { id: "c1_7", skill: "Reading", title: "Research Papers", desc: "Membaca dan memahami makalah penelitian ilmiah." },
            { id: "c1_8", skill: "Reading", title: "Literary Analysis", desc: "Menganalisis karya sastra: tema, simbolisme, gaya bahasa." },
            { id: "c1_9", skill: "Listening", title: "Native Speed Conversations", desc: "Memahami percakapan penutur asli pada kecepatan normal." },
            { id: "c1_10", skill: "Listening", title: "Academic Lectures (Full)", desc: "Mencatat poin utama dari kuliah 20+ menit." },
            { id: "c1_11", skill: "Writing", title: "Research Essay", desc: "Menulis esai riset 1000+ kata dengan referensi." },
            { id: "c1_12", skill: "Writing", title: "Creative & Persuasive Writing", desc: "Menulis teks persuasif yang meyakinkan pembaca." },
            { id: "c1_13", skill: "Speaking", title: "Impromptu Speaking", desc: "Berbicara spontan tentang topik acak selama 2 menit." },
            { id: "c1_14", skill: "Speaking", title: "Conference-Style Presentation", desc: "Presentasi selevel konferensi internasional." },
            { id: "c1_15", skill: "Grammar", title: "Ellipsis & Substitution", desc: "Menghilangkan kata yang sudah dipahami konteksnya." },
            { id: "c1_16", skill: "Vocabulary", title: "Nuance & Connotation", desc: "Perbedaan subtle: skinny vs slim, cheap vs affordable." },
            { id: "c1_17", skill: "Reading", title: "Philosophical Texts", desc: "Membaca teks filosofis dan menginterpretasikan argumen." },
            { id: "c1_18", skill: "Writing", title: "Abstract & Summary Writing", desc: "Menulis abstrak dan ringkasan ilmiah." },
            { id: "c1_19", skill: "Speaking", title: "Panel Discussion & Moderation", desc: "Memimpin dan berpartisipasi dalam diskusi panel." },
            { id: "c1_20", skill: "Vocabulary", title: "Etymology & Word Formation", desc: "Memahami akar kata Latin/Greek untuk memperluas vocab." }
        ]
    }
};

// ============== CORE FUNCTIONS ==============

let originalEplsHtml = '';

document.addEventListener('DOMContentLoaded', () => {
    const eplsScreen = document.getElementById('epls-screen');
    if (eplsScreen) originalEplsHtml = eplsScreen.innerHTML;
    initEplsHabitTracker();
    updateEplsProgressUI();
});

function getEplsProgress() {
    const saved = localStorage.getItem('epls_progress');
    return saved ? JSON.parse(saved) : {};
}

function saveEplsProgress(progress) {
    localStorage.setItem('epls_progress', JSON.stringify(progress));
}

function markModuleComplete(moduleId, level) {
    const progress = getEplsProgress();
    if (!progress[level]) progress[level] = [];
    if (!progress[level].includes(moduleId)) {
        progress[level].push(moduleId);
    }
    saveEplsProgress(progress);
    updateEplsProgressUI();
}

function updateEplsProgressUI() {
    const progress = getEplsProgress();
    Object.keys(eplsSyllabus).forEach(level => {
        const total = eplsSyllabus[level].modules.length;
        const completed = progress[level] ? progress[level].length : 0;
        const pct = Math.min(100, Math.round((completed / total) * 100));
        const bar = document.getElementById(`epls-prog-${level}`);
        const txt = document.getElementById(`epls-pct-${level}`);
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.innerHTML = `${pct}%`;
    });
}

// ============== HABIT TRACKER ==============

function initEplsHabitTracker() {
    const container = document.getElementById('epls-habit-tracker');
    if (!container) return;

    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const history = JSON.parse(localStorage.getItem('epls_habit_history') || '[]');
    container.innerHTML = '';

    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
        const isToday = i === dayOfWeek;
        const isPast = i < dayOfWeek;
        const isChecked = history.includes(dateStr);

        let statusClass = '';
        let icon = d.getDate();
        if (isChecked) { statusClass = 'active'; icon = '✓'; }
        else if (isPast) { statusClass = 'missed'; icon = '!'; }

        container.innerHTML += `
            <div class="habit-day ${statusClass}">
                <div class="habit-circle" ${isToday && !isChecked ? 'style="border:2px dashed #ecc94b;color:#ecc94b;"' : ''}>${icon}</div>
                <span class="habit-label" ${isToday ? 'style="font-weight:bold;color:var(--text-color);"' : ''}>${days[i]}</span>
            </div>
        `;
    }

    const todayStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
    const btn = document.getElementById('epls-checkin-btn');
    if (!btn) return;

    if (history.includes(todayStr)) {
        btn.innerHTML = '✅ Sukses Belajar Hari Ini!';
        btn.disabled = true;
        btn.style.background = '#38a169';
        btn.style.color = '#fff';
        btn.style.border = 'none';
    } else {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', () => {
            history.push(todayStr);
            localStorage.setItem('epls_habit_history', JSON.stringify(history));
            newBtn.innerHTML = '✅ Sukses Belajar Hari Ini!';
            newBtn.disabled = true;
            newBtn.style.background = '#38a169';
            newBtn.style.color = '#fff';
            newBtn.style.border = 'none';
            initEplsHabitTracker();
        });
    }
}

// ============== LEVEL SCREEN ==============

window.openEplsLevel = function(level) {
    const data = eplsSyllabus[level];
    if (!data) return;

    const progress = getEplsProgress();
    const completed = progress[level] || [];
    const screen = document.getElementById('epls-screen');

    // Build skill groups
    const skillGroups = {};
    data.modules.forEach(m => {
        if (!skillGroups[m.skill]) skillGroups[m.skill] = [];
        skillGroups[m.skill].push(m);
    });

    const skillIcons = { Grammar: '📐', Vocabulary: '📖', Reading: '📰', Listening: '🎧', Writing: '✍️', Speaking: '🗣️' };

    let html = `
        <div class="header-back">
            <button class="back-btn" onclick="backToEplsDashboard()">
                <span class="back-icon">←</span> Kembali ke EPLS Dashboard
            </button>
        </div>
        <div class="card mt-md" style="border-left: 4px solid ${data.color};">
            <h2>Level ${level}: ${data.title}</h2>
            <p class="text-muted">${completed.length} / ${data.modules.length} modul selesai</p>
            <div class="progress-bar-bg" style="margin-top:10px;"><div class="progress-bar-fill" style="width:${Math.round(completed.length/data.modules.length*100)}%;"></div></div>
        </div>
    `;

    Object.keys(skillGroups).forEach(skill => {
        html += `
            <div class="card mt-md">
                <h3>${skillIcons[skill] || '📚'} ${skill}</h3>
                <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
        `;
        skillGroups[skill].forEach(mod => {
            const isDone = completed.includes(mod.id);
            html += `
                <div style="background:var(--surface-hover);padding:12px;border-radius:10px;border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;transition:transform 0.2s;" 
                     onclick="openEplsLesson('${level}','${mod.id}')"
                     onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='none'">
                    <div style="font-size:1.3rem;min-width:30px;text-align:center;">${isDone ? '✅' : '📝'}</div>
                    <div style="flex:1;">
                        <div style="font-weight:600;font-size:0.95rem;color:var(--text-color);${isDone ? 'text-decoration:line-through;opacity:0.7;':''}">${mod.title}</div>
                        <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${mod.desc}</div>
                    </div>
                    <span style="font-size:0.8rem;color:var(--text-muted);">→</span>
                </div>
            `;
        });
        html += `</div></div>`;
    });

    screen.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.backToEplsDashboard = function() {
    const screen = document.getElementById('epls-screen');
    if (screen && originalEplsHtml) {
        screen.innerHTML = originalEplsHtml;
        initEplsHabitTracker();
        updateEplsProgressUI();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ============== AI LESSON GENERATION ==============

window.openEplsLesson = async function(level, moduleId, forceRefresh = false) {
    const data = eplsSyllabus[level];
    const mod = data.modules.find(m => m.id === moduleId);
    if (!mod) return;

    const screen = document.getElementById('epls-screen');
    const cacheKey = `lesson_cache_epls_${moduleId}`;

    // 1. Check Cache first
    if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            renderEplsLessonContent(screen, level, moduleId, cached);
            return;
        }
    }

    screen.innerHTML = `
        <div class="header-back">
            <button class="back-btn" onclick="openEplsLevel('${level}')">
                <span class="back-icon">←</span> Kembali ke Level ${level}
            </button>
        </div>
        <div class="card mt-md" style="border-left: 4px solid ${data.color};">
            <h2>${mod.title}</h2>
            <p class="text-muted">${mod.skill} • Level ${level}</p>
        </div>
        <div class="card mt-md" id="epls-lesson-content">
            <div class="loading-spinner" style="margin:20px auto;"></div>
            <p class="text-center text-muted">🧠 AI Guru sedang menyusun materi "${mod.title}"...</p>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        document.getElementById('epls-lesson-content').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key Gemini belum diatur. Silakan atur di Settings.</p>';
        return;
    }

    const prompt = `Kamu adalah guru Bahasa Inggris bersertifikat CELTA dan TESOL dengan pengalaman 15 tahun. Buatkan materi pelajaran yang LENGKAP dan MENDALAM untuk topik berikut:

📌 TOPIK: ${mod.title}
📌 LEVEL CEFR: ${level} (${data.title})
📌 SKILL: ${mod.skill}
📌 DESKRIPSI: ${mod.desc}

⚠️ ATURAN PENTING PENULISAN SIMBOL (WAJIB):
- JANGAN GUNAKAN LaTeX ($...$, \\(...\\), \\[...\\]).
- Gunakan tag HTML sederhana untuk simbol/satuan (seperti <sup>2</sup>).

FORMAT MATERI WAJIB (dalam Bahasa Indonesia dengan contoh Bahasa Inggris):

1. **📖 Penjelasan Materi** (minimal 5 paragraf, jelaskan sejelas-jelasnya dengan bahasa Indonesia yang sangat mudah dipahami. Sertakan RUMUS/POLA/FORMULA jika topik grammar.)

2. **📝 Contoh Kalimat** (minimal 10 contoh kalimat Bahasa Inggris beserta terjemahan Bahasa Indonesia-nya. Kelompokkan berdasarkan pola/situasi.)

3. **💡 Tips & Tricks** (3-5 tips praktis untuk menguasai topik ini lebih cepat.)

4. **⚠️ Kesalahan Umum (Common Mistakes)** (3-5 kesalahan yang sering dilakukan pelajar Indonesia beserta koreksinya.)

5. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda (A, B, C, D) dengan format berikut untuk setiap soal:
[QUIZ]
Pertanyaan: (tulis pertanyaan)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf jawaban yang benar, contoh: B)
Penjelasan: (jelaskan mengapa jawaban tersebut benar)
[/QUIZ]

Pastikan seluruh materi sangat detail, padat, and berkualitas tinggi setara buku Cambridge atau Oxford!`;

    try {
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        };

        const rawText = await unifiedGeminiCall(payload);
        
        // Save to cache
        localStorage.setItem(cacheKey, rawText);
        renderEplsLessonContent(screen, level, moduleId, rawText);

    } catch (err) {
        console.error('EPLS Lesson Error:', err);
        document.getElementById('epls-lesson-content').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat materi. Pastikan API Key dan koneksi internet Anda aktif.</p>
        <button class="btn btn-secondary mt-sm" onclick="openEplsLesson('${level}','${moduleId}')">🔄 Coba Lagi</button>`;
    }
};

function renderEplsLessonContent(screen, level, moduleId, rawText) {
    const data = eplsSyllabus[level]; 
    const mod = data.modules.find(m => m.id === moduleId);
    const { quizBlocks, cleanedText } = window.extractQuizAndCleanText(rawText);
    const formattedText = window.formatAIText(cleanedText);

    let html = `
        <div class="header-back" style="display:flex; justify-content:space-between; align-items:center;">
            <button class="back-btn" onclick="openEplsLevel('${level}')">
                <span class="back-icon">←</span> Kembali ke Level ${level}
            </button>
            <button class="btn btn-secondary btn-small" onclick="openEplsLesson('${level}','${moduleId}', true)">🔄 Buat Ulang</button>
        </div>
        <div class="card mt-md" style="border-left: 4px solid ${data.color};">
            <h2>${mod.title}</h2>
            <p class="text-muted">${mod.skill} • Level ${level}</p>
        </div>
        <div id="epls-lesson-content" class="card mt-md">
            <div style="background:var(--surface);padding:30px;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.1);border:1px solid var(--border);position:relative;">
                <div style="margin-bottom: 25px;">
                    ${window.getActionBarHTML ? window.getActionBarHTML(mod.title, 'epls', moduleId) : ''}
                    ${formattedText}
                </div>
                    ${formattedText}
                </div>
            </div>
    `;

    // Build quiz HTML
    let quizHtml = '';
    if (quizBlocks.length > 0) {
        quizHtml = `<div style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;">
            <h3 style="color:var(--primary);">📋 Kuis Interaktif (${quizBlocks.length} Soal)</h3>`;
        quizBlocks.forEach((q, i) => {
            const qId = `quiz_${moduleId}_${i}`;
            quizHtml += `
            <div id="${qId}" style="background:var(--surface-hover);padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid var(--border);">
                <p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>
                ${['a','b','c','d'].map(opt => `
                    <button class="btn btn-secondary" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:10px;font-size:0.9rem;" 
                        onclick="checkEplsAnswer('${qId}','${opt.toUpperCase()}','${q.answer}', this, '${encodeURIComponent(q.explanation)}')">
                        ${opt.toUpperCase()}) ${q[opt]}
                    </button>
                `).join('')}
                <div id="${qId}_result" style="display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:0.9rem;"></div>
            </div>`;
        });
        quizHtml += `
            <button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" 
                onclick="completeEplsModule('${level}','${moduleId}')">
                ✅ Tandai Modul Selesai & Kembali
            </button>
        </div>`;
    } else {
        quizHtml = `
            <button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" 
                onclick="completeEplsModule('${level}','${moduleId}')">
                ✅ Tandai Modul Selesai & Kembali
            </button>`;
    }

    html += quizHtml + `</div>`;
    screen.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============== QUIZ SYSTEM ==============

window.checkEplsAnswer = function(qId, selected, correct, btnEl, encodedExp) {
    const container = document.getElementById(qId);
    const resultDiv = document.getElementById(`${qId}_result`);
    const buttons = container.querySelectorAll('button');
    const explanation = decodeURIComponent(encodedExp);

    // Disable all buttons
    buttons.forEach(b => { b.disabled = true; b.style.opacity = '0.7'; });

    // Highlight correct / wrong
    if (selected === correct) {
        btnEl.style.background = '#38a169';
        btnEl.style.color = 'white';
        btnEl.style.border = '2px solid #38a169';
        resultDiv.style.background = 'rgba(56,161,105,0.15)';
        resultDiv.style.color = '#38a169';
        resultDiv.innerHTML = `✅ <strong>Benar!</strong> ${explanation}`;
    } else {
        btnEl.style.background = '#e53e3e';
        btnEl.style.color = 'white';
        btnEl.style.border = '2px solid #e53e3e';
        // Highlight correct one
        buttons.forEach(b => {
            if (b.textContent.trim().startsWith(correct + ')')) {
                b.style.background = '#38a169';
                b.style.color = 'white';
                b.style.border = '2px solid #38a169';
            }
        });
        resultDiv.style.background = 'rgba(229,62,62,0.15)';
        resultDiv.style.color = '#e53e3e';
        resultDiv.innerHTML = `❌ <strong>Salah.</strong> Jawaban yang benar: <strong>${correct}</strong>. ${explanation}`;
    }
    resultDiv.style.display = 'block';
};

window.completeEplsModule = function(level, moduleId) {
    markModuleComplete(moduleId, level);
    openEplsLevel(level);
};

// ============== EXAM PREP ==============

window.openEplsExam = function(exam) {
    alert(`Modul persiapan ${exam} akan tersedia di update mendatang.\n\nUntuk saat ini, selesaikan dahulu level A1-C1 agar fondasi Anda kuat sebelum masuk ke simulasi ujian!`);
};
