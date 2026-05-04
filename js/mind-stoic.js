// ============================================
// STOIC MUSLIM: Character & Aura Mastery
// Advanced Version: Suggestive Missions & Leveling
// ============================================

const stoicData = {
    quotes: [
        { q: "Apa yang melewatkanku tidak akan pernah menjadi takdirku, dan apa yang ditakdirkan untukku tidak akan pernah melewatkanku.", author: "Umar bin Khattab" },
        { q: "Anda memiliki kendali atas pikiran Anda — bukan kejadian di luar sana. Sadari hal ini, dan Anda akan menemukan kekuatan.", author: "Marcus Aurelius" },
        { q: "Kemarahan dimulai dengan kebodohan dan berakhir dengan penyesalan.", author: "Ali bin Abi Thalib" },
        { q: "Kita lebih sering menderita dalam imajinasi kita daripada dalam kenyataan.", author: "Seneca" },
        { q: "Diam itu emas, terutama ketika kata-kata tidak akan memperbaiki keadaan.", author: "Pepatah Arab" },
        { q: "Tugas utama dalam hidup adalah ini: mengidentifikasi dan memisahkan hal-hal sehingga saya bisa mengatakan dengan jelas mana yang di luar kendali saya, dan mana yang berhubungan dengan pilihan saya.", author: "Epictetus" },
        { q: "Berapa banyak hal yang tidak kubutuhkan.", author: "Socrates / Kesederhanaan" },
        { q: "Barangsiapa beriman kepada Allah dan hari akhir, hendaklah dia berkata baik atau diam.", author: "HR. Bukhari & Muslim" },
        { q: "Tidak ada seorang pun yang bebas jika dia tidak menjadi tuan atas dirinya sendiri.", author: "Epictetus" },
        { q: "Orang yang kuat bukanlah yang pandai bergulat, tetapi yang mampu menahan dirinya saat marah.", author: "HR. Bukhari & Muslim" }
    ],
    auraBank: [
        {
            id: 'm1', icon: '⏱️', img: 'img/stoic/stoic_m1.png', title: 'Jeda 3 Detik Sebelum Menjawab',
            suggestion: 'Saya adalah penguasa atas kata-kata saya. Hari ini, saya menyadari bahwa setiap jeda membuat kehadiran saya semakin berat dan berwibawa. Saya akan mengambil napas perlahan sebelum merespon siapapun.',
            insight: 'Secara psikologis, jeda menunjukkan Anda tidak reaktif dan memegang kendali penuh. Secara Islami, memberi waktu berpikir mencegah ucapan yang sia-sia dan membawa penyesalan (Sabar).'
        },
        {
            id: 'm2', icon: '👁️', img: 'img/stoic/stoic_m2.png', title: 'Ghadhul Bashar & Tatapan Tajam',
            suggestion: 'Mata saya mencerminkan kedalaman jiwa yang tenang. Hari ini, saya menatap lawan bicara dengan stabil tanpa berkedip gelisah, dan segera menundukkan pandangan dari hal yang merusak hati.',
            insight: 'Tatapan yang tenang memancarkan dominasi pasif yang membuat orang segan. Ghadhul Bashar membersihkan hati, membuat aura wajah lebih bercahaya dan bersih.'
        },
        {
            id: 'm3', icon: '🤐', img: 'img/stoic/stoic_m3.png', title: 'Bicara Seperlunya (Misteri)',
            suggestion: 'Semakin sedikit saya bicara, semakin kata-kata saya dihargai. Hari ini, saya menikmati keheningan dan membiarkan orang lain yang mengisi ruang kosong. Misteri adalah perisai dan kekuatan saya.',
            insight: 'Stoicism: "Kita punya 2 telinga & 1 mulut agar lebih banyak mendengar." Hadits: "Berkatalah yang baik atau diam." Orang yang terlalu banyak *oversharing* secara perlahan akan kehilangan wibawanya.'
        },
        {
            id: 'm4', icon: '🧍‍♂️', img: 'img/stoic/stoic_m4.png', title: 'Postur Tegap, Dada Terbuka',
            suggestion: 'Tubuh saya terhubung dengan energi ketenangan absolut. Saat saya berdiri tegak dan menarik bahu ke belakang, saya merasakan wibawa mengalir. Saya hadir utuh di momen ini.',
            insight: 'Postur secara instan memengaruhi hormon. Dada terbuka menurunkan kortisol (stres) dan menaikkan testosteron (percaya diri). Sikap tegak adalah *sunnah* berjalan Rasulullah yang kokoh.'
        },
        {
            id: 'm5', icon: '🪨', img: 'img/stoic/stoic_m5.png', title: 'Sembunyikan Rasa Sakit / Keluhan',
            suggestion: 'Saya tangguh bagaikan karang di tengah ombak. Hari ini, sekecil apapun rasa tidak nyaman, panas, lelah, atau sakit, saya menahannya dalam diam. Tidak ada satu pun keluhan keluar dari bibir saya.',
            insight: 'Mengeluh membuat Anda terlihat lemah di mata orang lain dan meracuni mental Anda sendiri. Sabar tanpa batas (Shabrun Jameel) adalah puncak dari ketangguhan seorang Muslim sejati.'
        },
        {
            id: 'm6', icon: '🚶', img: 'img/stoic/stoic_m6.png', title: 'Berjalan Sedikit Lebih Lambat',
            suggestion: 'Dunia mungkin terburu-buru dan panik, tapi saya memiliki tempo saya sendiri. Langkah kaki saya hari ini perlahan, mantap, dan menyiratkan bahwa saya tahu persis siapa saya.',
            insight: 'Orang yang berjalan tergesa-gesa terlihat cemas dan disetir oleh keadaan. Langkah yang mantap memproyeksikan status tinggi, kedamaian batin, dan aura pemimpin.'
        },
        {
            id: 'm7', icon: '😏', img: 'img/stoic/stoic_m7.png', title: 'Senyum Tipis Mematahkan Hinaan',
            suggestion: 'Tidak ada kata-kata kotor yang bisa menembus perisai ketenangan saya. Jika ada yang memancing emosi saya hari ini, saya hanya akan tersenyum tipis dan berlalu dalam diam.',
            insight: 'Stoicism: "Tidak ada orang yang bisa menyakitimu tanpa izinmu." Memaafkan dan mengabaikan orang jahil dengan elegan adalah ciri karakter Ibadurrahman (Hamba Tuhan Yang Maha Pengasih).'
        },
        {
            id: 'm8', icon: '🗿', img: 'img/stoic/stoic_m8.png', title: 'Tahan Gerakan Gelisah (No Fidgeting)',
            suggestion: 'Tangan dan kaki saya rileks total. Saya sadar, setiap kali saya ingin menggigit kuku, menggoyangkan kaki, atau menyentuh wajah, saya menahannya dan kembali diam sekokoh patung es.',
            insight: 'Gerakan kecil yang berulang menandakan kebocoran *nervousness*. Menahan tubuh tetap diam (stillness) dalam situasi tegang akan membuat orang di sekitar Anda takjub dan terintimidasi positif.'
        },
        {
            id: 'm9', icon: '🗣️', img: 'img/stoic/stoic_m9.png', title: 'Suara Perut & Intonasi Tenang',
            suggestion: 'Saat saya harus berbicara, suara saya keluar dari perut terdalam, bukan dari dada. Nada saya rendah, tenang, namun menembus ruangan. Setiap kata saya bergetar dengan keyakinan absolut.',
            insight: 'Orang yang berbicara cepat dan melengking terkesan panik. Suara bernada rendah secara biologis mengomunikasikan otoritas, kematangan, dan wibawa.'
        },
        {
            id: 'm10', icon: '🍃', img: 'img/stoic/stoic_m10.png', title: 'Tawakkal Mutlak atas Hasil',
            suggestion: 'Tugas saya hanya berjuang dengan elegan dan terhormat. Apapun hasil akhir hari ini, itu murni urusan Allah. Saya melepaskan hasrat untuk mengontrol hasil, dan hati saya menjadi seringan bulu.',
            insight: 'Dikotomi kendali (Stoic) bertemu dengan Tawakkal. Ketika Anda tidak lagi terobsesi pada hasil akhir, Anda tidak akan pernah terlihat putus asa, *needy*, atau mengemis pada keadaan.'
        },
        {
            id: 'm11', icon: '🛡️', img: 'img/stoic/stoic_m11.png', title: 'Berhenti Meminta Validasi',
            suggestion: 'Saya sudah utuh dari dalam. Hari ini, saya tidak akan menjelaskan keputusan saya secara berlebihan atau memohon persetujuan orang lain. Saya tidak butuh pengakuan.',
            insight: 'Menjelaskan diri berlebihan (*over-explaining*) adalah pertanda krisis percaya diri. Keyakinan dalam diam menandakan Anda menyadari nilai (value) diri Anda tanpa butuh tepuk tangan orang lain.'
        },
        {
            id: 'm12', icon: '🦻', img: 'img/stoic/stoic_m12.png', title: 'Mendengar Tanpa Menyiapkan Jawaban',
            suggestion: 'Ketika seseorang berbicara, isi kepala saya benar-benar kosong. Saya tidak sibuk meracik balasan. Saya diam, menatap mereka, dan mendengarkan dengan empati serta fokus setajam silet.',
            insight: 'Kehadiran yang utuh (*mindful presence*) membuat lawan bicara merasa sangat dihargai dan disorot. Pemimpin besar selalu dikenal sebagai pendengar hebat yang menenangkan.'
        },
        {
            id: 'm13', icon: '⚖️', img: 'img/stoic/stoic_m13.png', title: 'Konsistensi Sikap ke Semua Level',
            suggestion: 'Harga diri saya tidak ditentukan oleh siapa lawan bicara saya. Hari ini, saya berbicara dengan nada dan rasa hormat yang persis sama, baik kepada CEO, rekan kerja, maupun petugas kebersihan.',
            insight: 'Menjilat ke atas dan menindas ke bawah adalah sifat orang bermental budak. Integritas dan aura sejati memancar ketika Anda memiliki standar sikap yang tidak goyah.'
        },
        {
            id: 'm14', icon: '🙂', img: 'img/stoic/stoic_m14.png', title: 'Senyum yang Berharga',
            suggestion: 'Senyum saya tidak murah. Hari ini, saya berhenti tersenyum refleks hanya karena merasa canggung (*people-pleasing*). Saya hanya akan tersenyum saat ada alasan yang benar-benar bermakna.',
            insight: 'Secara psikologis, seseorang yang selalu tersenyum di setiap detik dianggap penurut dan mudah disetir. Senyum yang diberikan secara selektif jauh lebih dihormati dan ditunggu.'
        },
        {
            id: 'm15', icon: '🎯', img: 'img/stoic/stoic_m15.png', title: 'Menjawab dengan Bertanya Balik',
            suggestion: 'Jika hari ini saya ditekan atau ditanya pertanyaan menjebak, saya tidak akan defensif. Saya akan menatap mereka dalam, dan membalikkan beban dengan bertanya dengan nada sangat datar.',
            insight: 'Dalam interaksi sosial, pihak yang bertanya adalah pihak yang mengontrol *frame* (bingkai) percakapan. Ini adalah teknik melucuti lawan tanpa perlu berdebat panjang lebar.'
        },
        {
            id: 'm16', icon: '🧼', img: 'img/stoic/stoic_m16.png', title: 'Puasa Kata Toxic & Umpatan',
            suggestion: 'Bibir saya adalah gerbang kehormatan. Hari ini, saya menghapus semua kata-kata kotor, makian, dan umpatan dari kosakata saya. Pikiran saya terlalu elegan untuk diotori kata kasar.',
            insight: 'Kata-kata toxic menggerus wibawa dan menunjukkan bahwa Anda tidak bisa mengontrol emosi di bawah tekanan. Dalam Islam, Mukmin yang sejati bukanlah orang yang suka mencela atau melaknat.'
        },
        {
            id: 'm17', icon: '🗡️', img: 'img/stoic/stoic_m17.png', title: 'Integritas Mutlak (Tidak Berbohong)',
            suggestion: 'Kebenaran adalah pedang saya. Hari ini, saya memilih kejujuran yang brutal daripada kebohongan yang nyaman. Saya tidak akan melebih-lebihkan cerita atau berbohong demi terlihat baik.',
            insight: 'Berbohong adalah tanda bahwa Anda takut pada reaksi orang lain. Orang yang berani berkata jujur memancarkan *alpha energy* karena mereka siap menanggung konsekuensi apa pun dari realita.'
        },
        {
            id: 'm18', icon: '🔥', img: 'img/stoic/stoic_m18.png', title: 'Menelan Api Kemarahan',
            suggestion: 'Saya adalah tuan bagi emosi saya, bukan budaknya. Hari ini, jika ada yang menyulut amarah saya, saya akan menelannya perlahan dan merespon dengan keheningan es yang mematikan.',
            insight: 'Marah yang meledak-ledak adalah kelemahan biologis. Hadits menyebutkan pahlawan sejati adalah yang menahan marah. Kemarahan yang ditahan dan dikonversi menjadi diam jauh lebih mengintimidasi.'
        }
    ]
};

let stoicState = {
    dailyQuoteIndex: 0,
    dailyMissions: [], // Array of mission IDs active today
    checklistProgress: [], // Array of mission IDs completed today
    tawakkalEntries: [],
    lastDate: '',
    xp: 0
};

const STOIC_STORAGE_KEY = 'jurnal_ai_stoic_data_v2'; // Upgraded key

// Ranks System
const AURA_RANKS = [
    { name: "Novice Observer", minXP: 0, color: "#64748b" },
    { name: "Calm Mind", minXP: 100, color: "#38bdf8" },
    { name: "Silent Authority", minXP: 300, color: "#818cf8" },
    { name: "Stoic Master", minXP: 600, color: "#10b981" },
    { name: "Elite Presence", minXP: 1200, color: "#f59e0b" }
];

function getAuraRank(xp) {
    let current = AURA_RANKS[0];
    for(let r of AURA_RANKS) {
        if(xp >= r.minXP) current = r;
    }
    return current;
}

function getNextAuraRank(xp) {
    for(let i=0; i<AURA_RANKS.length; i++) {
        if(xp < AURA_RANKS[i].minXP) return AURA_RANKS[i];
    }
    return null; // Max rank
}

async function initStoicMuslim() {
    loadStoicState();
    checkDailyReset();
    renderStoicQuote();
    renderAuraHeader();
    renderAuraChecklist();
    renderTawakkalJournal();
}

function loadStoicState() {
    const saved = localStorage.getItem(STOIC_STORAGE_KEY);
    if (saved) {
        stoicState = { ...stoicState, ...JSON.parse(saved) };
    }
    // Backward compatibility if upgrading from v1
    if (stoicState.xp === undefined) stoicState.xp = 0;
    if (!stoicState.dailyMissions) stoicState.dailyMissions = [];
}

function saveStoicState() {
    localStorage.setItem(STOIC_STORAGE_KEY, JSON.stringify(stoicState));
}

function checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    if (stoicState.lastDate !== today || stoicState.dailyMissions.length === 0) {
        // New day reset
        stoicState.lastDate = today;
        stoicState.checklistProgress = [];
        stoicState.dailyQuoteIndex = Math.floor(Math.random() * stoicData.quotes.length);
        
        // Pick 4 random missions
        const shuffled = [...stoicData.auraBank].sort(() => 0.5 - Math.random());
        stoicState.dailyMissions = shuffled.slice(0, 4).map(m => m.id);
        
        saveStoicState();
    }
}

function renderStoicQuote() {
    const quoteObj = stoicData.quotes[stoicState.dailyQuoteIndex];
    const container = document.getElementById('stoic-quote-container');
    if (!container) return;

    container.innerHTML = `
        <div style="font-size: 1.1rem; font-weight: 500; font-style: italic; color: #e2e8f0; line-height: 1.5; margin-bottom: 10px;">
            "${quoteObj.q}"
        </div>
        <div style="text-align: right; color: #94a3b8; font-size: 0.85rem; font-weight: 600;">
            — ${quoteObj.author}
        </div>
    `;
}

function renderAuraHeader() {
    // We will inject the XP bar right above the checklist container
    const clContainer = document.getElementById('stoic-checklist-container');
    if (!clContainer) return;
    
    let headerContainer = document.getElementById('stoic-rank-header');
    if (!headerContainer) {
        headerContainer = document.createElement('div');
        headerContainer.id = 'stoic-rank-header';
        clContainer.parentNode.insertBefore(headerContainer, clContainer);
    }

    const rank = getAuraRank(stoicState.xp);
    const nextRank = getNextAuraRank(stoicState.xp);
    
    let progressHtml = '';
    if (nextRank) {
        const xpRange = nextRank.minXP - rank.minXP;
        const xpCurrent = stoicState.xp - rank.minXP;
        const pct = Math.min(100, Math.max(0, (xpCurrent / xpRange) * 100));
        
        progressHtml = `
            <div style="margin-top: 10px; background: rgba(0,0,0,0.2); border-radius: 10px; padding: 10px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 5px;">
                    <span style="color: ${rank.color}; font-weight: bold;">[${rank.name}]</span>
                    <span style="color: #94a3b8;">${stoicState.xp} / ${nextRank.minXP} XP</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: ${rank.color}; box-shadow: 0 0 10px ${rank.color}; transition: width 0.5s ease;"></div>
                </div>
                <div style="text-align: right; font-size: 0.65rem; color: #64748b; margin-top: 4px;">Menuju: ${nextRank.name}</div>
            </div>
        `;
    } else {
         progressHtml = `
            <div style="margin-top: 10px; text-align: center; padding: 10px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; color: #fbd38d;">
                <span style="font-size: 1.2rem;">👑</span><br>
                <strong style="font-size: 0.9rem;">MAX RANK ACHIEVED</strong><br>
                <span style="font-size: 0.75rem;">Total Aura XP: ${stoicState.xp}</span>
            </div>
        `;
    }

    headerContainer.innerHTML = progressHtml + `<hr style="border:0; border-bottom: 1px solid rgba(255,255,255,0.05); margin: 15px 0;">`;
}

function renderAuraChecklist() {
    const container = document.getElementById('stoic-checklist-container');
    if (!container) return;

    // Get active missions
    const activeMissions = stoicState.dailyMissions.map(id => stoicData.auraBank.find(m => m.id === id)).filter(Boolean);

    let html = '<div style="display: flex; flex-direction: column; gap: 16px;">';
    
    activeMissions.forEach((task, index) => {
        const isDone = stoicState.checklistProgress.includes(task.id);
        const cardStyle = isDone 
            ? 'background: rgba(16, 185, 129, 0.05); border: 1px solid #10b981; opacity: 0.8;' 
            : 'background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-left: 4px solid #3b82f6;';
        
        // Random gradient colors for the visual cover
        const gradients = [
            'linear-gradient(135deg, #1e3a8a, #0f172a)',
            'linear-gradient(135deg, #064e3b, #0f172a)',
            'linear-gradient(135deg, #4c1d95, #0f172a)',
            'linear-gradient(135deg, #7f1d1d, #0f172a)'
        ];
        const coverGradient = gradients[index % gradients.length];
        
        html += `
            <div class="stoic-task-card" style="border-radius: 12px; overflow: hidden; transition: all 0.3s; ${cardStyle}">
                <!-- Visual Header (Image Cover) -->
                <div style="height: 250px; background-color: #0f172a; background-image: url('${task.img}'); background-size: contain; background-repeat: no-repeat; background-position: center; display: flex; align-items: center; justify-content: center; position: relative;">
                    <span style="font-size: 3rem; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.8)); z-index: 2;">${task.icon}</span>
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.2); z-index: 1;"></div>
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 40%; background: linear-gradient(to top, rgba(0,0,0,0.95), transparent); z-index: 1;"></div>
                </div>

                <!-- Header part (Click to toggle completion) -->
                <div style="padding: 12px 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 10px; background: rgba(0,0,0,0.2);" onclick="toggleAuraTask('${task.id}')">
                    <div>
                        <h4 style="margin: 0; font-size: 1rem; font-weight: 700; color: ${isDone ? '#10b981' : '#e2e8f0'}; ${isDone ? 'text-decoration: line-through;' : ''}">${task.title}</h4>
                        ${!isDone ? `<span style="font-size: 0.7rem; color: #fbbf24; background: rgba(251, 191, 36, 0.1); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 5px; font-weight: bold;">+15 XP</span>` : ''}
                    </div>
                    <div style="font-size: 1.5rem; min-width: 30px; text-align: center;">
                        ${isDone ? '✨' : '<div style="width: 24px; height: 24px; border: 2px solid #64748b; border-radius: 50%; margin: auto;"></div>'}
                    </div>
                </div>

                <!-- Deep Insight & Suggestion (Hypnosis text) -->
                <div style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0 0 10px 0; font-size: 0.85rem; color: #cbd5e1; line-height: 1.6; font-style: italic; position: relative; padding-left: 10px; border-left: 2px solid rgba(255,255,255,0.2);">
                        ${task.suggestion}
                    </p>
                    <div style="background: rgba(0,0,0,0.3); padding: 10px 12px; border-radius: 6px;">
                        <p style="margin: 0; font-size: 0.75rem; color: #94a3b8; line-height: 1.5;"><strong>💡 Rahasia:</strong> ${task.insight}</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    
    container.innerHTML = html;
}

function toggleAuraTask(taskId) {
    const idx = stoicState.checklistProgress.indexOf(taskId);
    if (idx === -1) {
        stoicState.checklistProgress.push(taskId);
        stoicState.xp += 15; // Give XP
        
        // Log to RPG Stats (Weekly Growth)
        const today = new Date().toISOString().split('T')[0];
        const stoicLog = JSON.parse(localStorage.getItem('jurnal_ai_stoic_log') || '[]');
        stoicLog.push({ id: taskId, date: today, timestamp: Date.now() });
        localStorage.setItem('jurnal_ai_stoic_log', JSON.stringify(stoicLog.slice(-100)));

        if ("vibrate" in navigator) navigator.vibrate([20, 50, 20]);
    } else {
        // Can't un-done easily to prevent XP farming exploit, but let's allow it for user correction
        stoicState.checklistProgress.splice(idx, 1);
        stoicState.xp -= 15; 
        if(stoicState.xp < 0) stoicState.xp = 0;
    }
    saveStoicState();
    
    // Sync with RPG Stats widget
    const exportTasks = stoicState.dailyMissions.map(id => ({
        id: id,
        isCompleted: stoicState.checklistProgress.includes(id)
    }));
    localStorage.setItem('jurnal_ai_stoic_tasks', JSON.stringify(exportTasks));
    if (typeof refreshWidget === 'function') refreshWidget('rpg-stats');

    renderAuraHeader(); // Update XP bar
    renderAuraChecklist(); // Re-render list
}

async function addTawakkalEntry() {
    const input = document.getElementById('tawakkal-input');
    const btn = document.querySelector('#stoic-muslim-screen button[onclick="addTawakkalEntry()"]');
    const text = input.value.trim();
    
    if (!text) return;

    // Optional AI Advice
    let aiAdvice = "";
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;

    if (apiKey && typeof unifiedGeminiCall === 'function') {
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = `<div class="loading-spinner" style="width: 14px; height: 14px; border-width: 2px;"></div>`;
        btn.disabled = true;
        input.disabled = true;

        const prompt = `Sebagai seorang penasihat yang bijak, gabungkan filosofi Stoikisme (Dikotomi Kendali) dan ajaran Islam (Tawakkal & Sabar). Berikan nasihat yang sangat menenangkan hati, sugestif positif, suportif, dan singkat (maksimal 2 paragraf pendek) untuk seseorang yang sedang merasa terbebani oleh pikiran berikut ini: "${text}". Jangan menggurui, gunakan kata-kata yang mensugesti pikiran untuk tenang dan ikhlas menyerahkan segalanya pada Allah.`;

        try {
            const payload = {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 800 }
            };
            
            let response = await unifiedGeminiCall(payload);
            if (response) {
                // Clean formatting
                response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                aiAdvice = response;
            }
        } catch (e) {
            console.error("Gagal mendapatkan nasihat AI:", e);
        } finally {
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
            input.disabled = false;
        }
    }

    const newEntry = {
        id: Date.now().toString(),
        text: text,
        date: new Date().toISOString().split('T')[0],
        aiAdvice: aiAdvice,
        status: 'let_go' // Just let go visually
    };

    stoicState.tawakkalEntries.unshift(newEntry);
    if (stoicState.tawakkalEntries.length > 50) stoicState.tawakkalEntries.pop(); // Keep limit

    saveStoicState();
    input.value = '';
    renderTawakkalJournal();
}

function renderTawakkalJournal() {
    const container = document.getElementById('tawakkal-list-container');
    if (!container) return;

    if (stoicState.tawakkalEntries.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: #64748b; font-size: 0.85rem; padding: 20px;">Belum ada beban yang dilepaskan hari ini. Tuliskan kekhawatiran Anda di atas.</div>`;
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    
    stoicState.tawakkalEntries.forEach(entry => {
        let aiHtml = '';
        if (entry.aiAdvice) {
            aiHtml = `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(16, 185, 129, 0.3); font-size: 0.8rem; color: #a7f3d0; line-height: 1.5;">
                    <span style="font-size: 1rem; margin-right: 5px;">💡</span> <em>${entry.aiAdvice}</em>
                </div>
            `;
        }

        html += `
            <div style="background: rgba(0,0,0,0.2); padding: 12px 15px; border-radius: 8px; border: 1px dashed rgba(148, 163, 184, 0.3); position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1; padding-right: 25px;">
                        <p style="margin: 0; font-size: 0.85rem; color: #cbd5e1; font-weight: 500;">"${entry.text}"</p>
                        <span style="font-size: 0.65rem; color: #64748b; margin-top: 4px; display: block;">${entry.date} • Diserahkan pada Allah 🍃</span>
                    </div>
                    <button onclick="deleteTawakkal('${entry.id}')" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: #ef4444; font-size: 1.1rem; cursor: pointer; padding: 5px; line-height: 1;">×</button>
                </div>
                ${aiHtml}
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Attach to global scope for HTML calls
window.initStoicMuslim = initStoicMuslim;
window.toggleAuraTask = toggleAuraTask;
window.addTawakkalEntry = addTawakkalEntry;
window.deleteTawakkal = deleteTawakkal;
