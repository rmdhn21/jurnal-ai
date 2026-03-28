// ============================================
// Hybrid Athlete Workout Tracker
// Gym Power + Silent Home Routine (Bola & Voli)
// ============================================

const workoutData = {
    wejangan: [
        { id: 'w1', title: 'Form > Beban Berat (No Ego Lifting)', desc: 'Utamakan gerakan yang benar. Beban berat dengan form hancur hanya mengundang cedera.' },
        { id: 'w2', title: 'Rest 3-5 Menit Antar Set Latihan Inti', desc: 'Beri waktu otot untuk pulih agar set berikutnya bisa maksimal (Low Volume, High Intensity).' },
        { id: 'w3', title: 'Pemanasan Rotator Cuff', desc: 'SUPER WAJIB UNTUK VOLI! Melindungi engsel bahu dari cedera aus akibat sering melakukan gerakan smash/spike.' },
        { id: 'w4', title: 'Jangan Skip Otot Kecil', desc: 'Rear delt (bahu belakang), Traps (pundak), dan Betis wajib dilatih untuk adu bodi dan keseimbangan di udara.' },
        { id: 'w5', title: 'Abs Perlu Dilatih', desc: 'Core adalah pusat keseimbangan saat melayang di udara (voli) dan power tendangan (bola).' }
    ],
    gym1: [
        { id: 'g1_1', text: 'Barbell Squat', sets: '3 Set x 5-8 Reps', how: 'Taruh barbell di punggung atas. Turun perlahan seperti mau duduk, dorong kuat ke atas.', benefit: 'Membangun tenaga ledak (power). Untuk BOLA: Lari sprint & power tendangan. Untuk VOLI: Meningkatkan daya ledak Vertical Jump saat memblok atau smash.' },
        { id: 'g1_2', text: 'Romanian Deadlift (RDL)', sets: '3 Set x 8-10 Reps', how: 'Tekuk lutut sedikit, dorong pantat ke belakang sampai punggung rata, rasakan tarikan di paha belakang.', benefit: 'Memperkuat Hamstring. Untuk BOLA: Rem alami saat lari kencang. Untuk VOLI: Meredam benturan lutut saat mendarat dari lompatan tinggi.' },
        { id: 'g1_3', text: 'Calf Raises (Jinjit Beban)', sets: '3 Set x 12-15 Reps', how: 'Pegang beban, turunkan tumit dari pijakan, lalu jinjit setinggi mungkin.', benefit: 'Betis kuat. Untuk BOLA: Akselerasi langkah pertama. Untuk VOLI: Menambah beberapa sentimeter ekstra pada lompatan vertikalmu.' },
        { id: 'g1_4', text: 'Hanging Leg Raise', sets: '3 Set x 10-12 Reps', how: 'Bergelantungan di bar, angkat kaki lurus ke depan sejajar perut (atau tekuk lutut jika berat).', benefit: 'Core stabil. BOLA: Menstabilkan pinggul saat lari. VOLI: Memberikan "hang time" (waktu melayang) lebih lama dan postur stabil saat memukul bola di udara.' }
    ],
    gym2: [
        { id: 'g2_1', text: 'Pemanasan Rotator Cuff', sets: '2 Set x 15 Reps', how: 'Gunakan kabel gym paling ringan. Siku tempel di rusuk, rotasi lengan ke arah luar badan.', benefit: 'Penyelamat Karir! Melumasi sendi bahu agar tidak robek saat melakukan ayunan smash/spike voli yang sangat eksplosif.' },
        { id: 'g2_2', text: 'Lat Pulldown / Pull Up', sets: '3 Set x 6-10 Reps', how: 'Tarik beban dari atas ke arah dada, rapatkan tulang belikat.', benefit: 'Punggung V-Shape. BOLA: Menang adu bodi (shielding). VOLI: Otot Lats adalah penyumbang tenaga terbesar saat tanganmu mengayun ke bawah saat smash.' },
        { id: 'g2_3', text: 'Dumbbell Shrugs (Traps)', sets: '3 Set x 10-12 Reps', how: 'Pegang dumbbell, angkat bahu ke arah telinga. Tahan 1 detik.', benefit: 'Pundak kuat. BOLA: Meminimalisir cedera leher saat menyundul. VOLI: Meredam benturan saat terjatuh/rolling ke lantai menyelamatkan bola.' },
        { id: 'g2_4', text: 'Face Pulls (Rear Delt)', sets: '3 Set x 12-15 Reps', how: 'Tarik tali kabel setinggi wajah ke arah hidung sambil membuka siku lebar ke belakang.', benefit: 'Menarik bahu ke belakang. Mencegah bahu melengkung ke depan karena terlalu sering melakukan gerakan memukul/smash (postur tubuh tetap tegap).' },
        { id: 'g2_5', text: 'Dumbbell Lateral Raise', sets: '3 Set x 10-12 Reps', how: 'Angkat dumbbell ringan lurus ke samping badan. Jangan diayun!', benefit: 'Bahu samping bulat & kokoh. BOLA: Kokoh saat benturan udara. VOLI: Kekuatan tambahan saat melakukan blocking di net.' }
    ],
    home1: [
        { id: 'h1_1', text: 'Wall Sit (Tanpa Suara)', sets: '3 Set x 45-60 Detik', how: 'Senderkan punggung di tembok, turunkan badan posisi duduk 90 derajat. Tahan diam.', benefit: 'Endurance paha (100% Sunyi). BOLA: Stamina babak kedua. VOLI: Ketahanan kaki saat harus terus-terusan posisi jongkok rendah menunggu receive/serve lawan.' },
        { id: 'h1_2', text: 'Resistance Band Crab Walk', sets: '3 Set x 15 Langkah', how: 'Ikat band di atas lutut, setengah jongkok, jalan menyamping pelan-pelan.', benefit: 'Kekuatan Pinggul Samping. BOLA: Kelincahan zig-zag. VOLI: Sangat krusial untuk langkah geser (side-step) cepat saat nge-block dari ujung ke ujung net.' },
        { id: 'h1_3', text: 'Glute Bridge (Tanpa Suara)', sets: '3 Set x 15 Reps', how: 'Rebahan, tekuk lutut, dorong pinggul ke atas sampai kencang.', benefit: 'Membangun stabilitas bokong. Menghasilkan tenaga dorongan dari bawah ke atas tanpa perlu melompat berisik di kamar.' },
        { id: 'h1_4', text: 'Plank & Side Plank', sets: '3 Set x 45 Detik', how: 'Tahan badan sejajar lantai dengan tumpuan siku.', benefit: 'BOLA: Tembok pertahanan saat didorong. VOLI: Memberikan kontrol tubuh sempurna saat harus spike di posisi bola yang tidak ideal (off-balance).' }
    ],
    home2: [
        { id: 'h2_1', text: 'Band Pull Aparts', sets: '3 Set x 15-20 Reps', how: 'Pegang band di depan dada, tarik memisah ke samping sampai menyentuh dada.', benefit: 'Bahu belakang kuat. Sangat penting bagi pemain voli agar bahu tidak cedera karena over-use di bagian depan (dada/depan bahu).' },
        { id: 'h2_2', text: 'Band Rotator Cuff (External)', sets: '3 Set x 15 Reps', how: 'Ikat band, siku tempel di pinggang, tarik band menjauhi badan.', benefit: 'Maintenance harian sendi bahu. Latihan wajib para spiker voli agar engselnya tidak kendor.' },
        { id: 'h2_3', text: 'Band Lateral Raises', sets: '3 Set x 12-15 Reps', how: 'Injak tengah band, angkat kedua ujung ke samping.', benefit: 'Bahu samping tanpa beban besi. Menjaga otot delt tetap kencang tanpa perlu ke gym.' },
        { id: 'h2_4', text: 'Dead Bugs (Stabilitas Otak & Core)', sets: '3 Set x 12 Reps / Sisi', how: 'Rebahan, tangan & kaki di udara. Turunkan lurus tangan KANAN & kaki KIRI bersamaan.', benefit: 'Koordinasi silang diam-diam. BOLA/VOLI: Melatih sinkronisasi otak antara tangan dan kaki saat berlari atau melompat.' }
    ]
};

const workoutSchedule = [
    { day: 'Senin', type: 'gym', title: 'Gym 1 (Leg Power & Core)', desc: 'Latihan beban berat untuk power lompatan dan lari.', color: 'blue' },
    { day: 'Selasa', type: 'home', title: 'Home 2 (Shoulder & Band)', desc: 'Latihan sunyi di kamar. Fokus pemulihan sendi bahu untuk voli.', color: 'teal' },
    { day: 'Rabu', type: 'rest', title: 'Rest / Main Ringan', desc: 'Istirahat otot, atau gunakan untuk main voli/bola ringan.', color: 'slate' },
    { day: 'Kamis', type: 'gym', title: 'Gym 2 (Upper & Stability)', desc: 'Latihan punggung & bahu agar kokoh adu bodi dan smash keras.', color: 'purple' },
    { day: 'Jumat', type: 'home', title: 'Home 1 (Silent Endurance)', desc: 'Latihan sunyi ketahanan paha. Tahan pegal!', color: 'emerald' },
    { day: 'Sabtu', type: 'game', title: 'Game Day (Voli / Bola)', desc: 'Aplikasikan hasil latihanmu di lapangan sesungguhnya.', color: 'amber' },
    { day: 'Minggu', type: 'rest', title: 'Rest Total', desc: 'Pemulihan total. Jangan lakukan aktivitas berat.', color: 'slate' }
];

let workoutState = {
    progress: {}, // { category: [id1, id2] }
    expanded: {}, // { taskId: true/false }
    activeTab: 'jadwal',
    aiResponses: {}, // { taskId: responseText }
    aiQueries: {}, // { taskId: queryText }
    loadingAi: null, // taskId being processed
    history: {}, // { yyyy-mm-dd: true }
    earnedXpToday: [] // [taskId1, taskId2] to avoid double XP
};

function initWorkoutTracker() {
    loadWorkoutState();
    setupWorkoutTabs();
    renderWorkoutTab(workoutState.activeTab);
}

function loadWorkoutState() {
    const saved = localStorage.getItem('hybrid_workout_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        workoutState = { ...workoutState, ...parsed };
        workoutState.loadingAi = null;

        // Reset daily XP tracker if it's a new day
        const today = new Date().toISOString().split('T')[0];
        if (!workoutState.history[today]) {
            workoutState.earnedXpToday = [];
        }
    }
}

function saveWorkoutState() {
    localStorage.setItem('hybrid_workout_state', JSON.stringify(workoutState));
}

function setupWorkoutTabs() {
    const tabs = document.querySelectorAll('#workout-tabs .tab-btn');
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            workoutState.activeTab = tab.dataset.tab;
            renderWorkoutTab(workoutState.activeTab);
            saveWorkoutState();
        };
    });
}

function renderWorkoutTab(tabId) {
    const container = document.getElementById('workout-content-area');
    if (!container) return;

    // Premium Background and Motivation Dashboard
    let dashboardHtml = renderMotivationDashboard();
    
    container.innerHTML = dashboardHtml + '<div id="workout-list-content"></div>';
    const listContainer = document.getElementById('workout-list-content');

    if (tabId === 'jadwal') {
        renderWorkoutSchedule(listContainer);
    } else if (tabId === 'nutrisi') {
        if (window.renderNutritionTab) {
            window.renderNutritionTab(listContainer);
        } else {
            listContainer.innerHTML = '<div class="text-center p-md text-muted">Loading Nutrition Module...</div>';
        }
    } else if (tabId === 'rules') {
        renderWorkoutRules(listContainer);
    } else {
        renderWorkoutCategory(listContainer, tabId);
    }

}

function renderMotivationDashboard() {
    const streak = calculateStreak();
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    return `
        <div class="motivation-dashboard" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); border-radius: 16px; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(129, 140, 248, 0.3); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                    <h4 style="color: #c7d2fe; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Consistency Tracker</h4>
                    <div style="display: flex; align-items: baseline; gap: 5px; margin-top: 2px;">
                        <span style="font-size: 1.8rem; font-weight: 900; color: white;">${streak}</span>
                        <span style="font-size: 0.8rem; font-weight: 600; color: #818cf8;">Hari Streak 🔥</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="background: rgba(99, 102, 241, 0.2); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(99, 102, 241, 0.4);">
                        <span style="font-size: 0.7rem; font-weight: 700; color: #818cf8;">XP GAIN READY ✨</span>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; padding: 10px 5px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                ${last7Days.map(date => {
                    const d = new Date(date);
                    const isToday = date === today.toISOString().split('T')[0];
                    const isActive = workoutState.history[date];
                    return `
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1;">
                            <span style="font-size: 0.6rem; color: ${isToday ? '#818cf8' : '#6366f1'}; font-weight: ${isToday ? '800' : '500'}">${dayNames[d.getDay()]}</span>
                            <div style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid ${isActive ? '#818cf8' : 'rgba(129, 140, 248, 0.1)'}; background: ${isActive ? '#818cf8' : 'transparent'}; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                                ${isActive ? '<span style="font-size: 0.7rem;">✓</span>' : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function calculateStreak() {
    let streak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Check if we worked out today or yesterday (to keep the streak alive)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (!workoutState.history[todayStr] && !workoutState.history[yesterdayStr]) {
        return 0;
    }

    let checkDate = new Date(today);
    // If we haven't worked out today, start checking from yesterday
    if (!workoutState.history[todayStr]) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const currentStr = checkDate.toISOString().split('T')[0];
        if (workoutState.history[currentStr]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

function renderWorkoutSchedule(container) {
    let html = `
        <div class="card" style="background: var(--surface); border: 1px solid var(--border); margin-bottom: 15px;">
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Jadwal ini dirancang agar otot mendapat waktu istirahat (recovery) yang pas. Kamu bebas menggeser harinya asalkan <strong>Gym 1 dan Gym 2 tidak dilakukan di hari yang berurutan.</strong>
            </p>
        </div>
        <div class="workout-schedule-list" style="display: flex; flex-direction: column; gap: 10px;">
    `;

    workoutSchedule.forEach(day => {
        const colorHex = getWorkoutColor(day.color);
        html += `
            <div class="workout-day-card" style="display: flex; background: var(--bg-card); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border); ${day.type === 'game' ? 'border-color: #f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.1);' : ''}">
                <div style="width: 70px; background: ${colorHex}22; display: flex; align-items: center; justify-content: center; border-right: 1px solid var(--border); padding: 10px;">
                    <span style="font-size: 0.75rem; font-weight: 700; color: ${colorHex}; text-transform: uppercase; letter-spacing: 1px;">${day.day}</span>
                </div>
                <div style="flex: 1; padding: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${day.type === 'game' ? '<span>🏆</span>' : ''}
                        <h4 style="font-size: 0.9rem; font-weight: 700; color: ${colorHex}">${day.title}</h4>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${day.desc}</p>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function renderWorkoutRules(container) {
    let html = `<div style="display: flex; flex-direction: column; gap: 12px;">`;
    workoutData.wejangan.forEach(w => {
        html += `
            <div class="card" style="margin-bottom: 0; border-left: 4px solid #f59e0b; background: var(--surface);">
                <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 5px;">${w.title}</h4>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${w.desc}</p>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
}

function renderWorkoutCategory(container, category) {
    const list = workoutData[category];
    const completed = workoutState.progress[category] || [];
    const progressPct = Math.round((completed.length / list.length) * 100);
    const colorHex = getCategoryColorHex(category);

    let html = `
        <div class="workout-header" style="display: flex; justify-content: space-between; align-items: center; background: var(--surface); padding: 15px; border-radius: var(--radius-lg); border: 1px solid var(--border); margin-bottom: 15px;">
            <div style="flex: 1;">
                <h3 style="color: ${colorHex}; margin-bottom: 5px; font-weight: 800;">${getCategoryTitle(category)}</h3>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 100px; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${progressPct}%; height: 100%; background: ${colorHex}; transition: width 0.3s ease;"></div>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">${progressPct}%</span>
                </div>
            </div>
            <button onclick="resetWorkoutCategory('${category}')" style="background: rgba(255,255,255,0.05); border: none; width: 32px; height: 32px; border-radius: 50%; color: var(--text-muted); cursor: pointer;">🔄</button>
        </div>

        <div class="workout-task-list" style="display: flex; flex-direction: column; gap: 10px;">
    `;

    list.forEach(task => {
        const isDone = completed.includes(task.id);
        const isExpanded = workoutState.expanded[task.id];
        const aiResponse = workoutState.aiResponses[task.id] || '';
        const aiQuery = workoutState.aiQueries[task.id] || '';
        const isLoading = workoutState.loadingAi === task.id;

        html += `
            <div class="workout-task-card" style="background: ${isDone ? colorHex + '11' : 'var(--bg-card)'}; border: 1px solid ${isDone ? colorHex + '33' : 'var(--border)'}; border-radius: var(--radius-md); transition: all 0.2s ease;">
                <div style="display: flex; align-items: flex-start; padding: 12px; gap: 12px;">
                    <div onclick="toggleWorkoutTask('${category}', '${task.id}')" style="cursor: pointer; font-size: 1.4rem; min-width: 30px; margin-top: 2px;">
                        ${isDone ? `<span style="color: ${colorHex}">✅</span>` : '⚪'}
                    </div>
                    <div style="flex: 1; cursor: pointer;" onclick="toggleWorkoutExpand('${task.id}')">
                        <h4 style="font-size: 0.95rem; font-weight: 700; ${isDone ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.text}</h4>
                        <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                            <span style="font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: ${colorHex}33; color: ${colorHex}">${task.sets}</span>
                        </div>
                    </div>
                    <div style="color: var(--text-muted); cursor: pointer;" onclick="toggleWorkoutExpand('${task.id}')">
                        ${isExpanded ? '▲' : '▼'}
                    </div>
                </div>

                ${isExpanded ? `
                    <div style="padding: 0 15px 15px 54px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 0; padding-top: 10px;">
                        <div style="margin-bottom: 12px;">
                            <h5 style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: var(--info); margin-bottom: 4px;">Cara Melakukan</h5>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${task.how}</p>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #f59e0b; margin-bottom: 4px;">Fungsi Bola & Voli</h5>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${task.benefit}</p>
                        </div>

                        <!-- AI Coach Section -->
                        <div class="ai-coach-container" style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px; padding: 10px; margin-top: 10px;">
                            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                                <span style="font-size: 0.9rem;">✨</span>
                                <span style="font-size: 0.7rem; font-weight: 800; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px;">AI Coach</span>
                            </div>

                            ${aiResponse ? `
                                <div class="ai-response-bubble" style="background: rgba(99, 102, 241, 0.1); border-left: 2px solid #818cf8; padding: 8px; border-radius: 0 4px 4px 0; font-size: 0.75rem; color: var(--text-primary); line-height: 1.4; margin-bottom: 10px;">
                                    ${aiResponse}
                                </div>
                            ` : ''}

                            <div style="display: flex; gap: 8px;">
                                <input type="text" 
                                    value="${aiQuery}" 
                                    oninput="updateAiQuery('${task.id}', this.value)"
                                    onkeydown="if(event.key === 'Enter') askAiCoach('${task.id}', '${task.text}')"
                                    placeholder="Tanya tips atau alternatif..." 
                                    style="flex: 1; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; font-size: 0.75rem; color: var(--text-primary); outline: none;"
                                    ${isLoading ? 'disabled' : ''}>
                                <button onclick="askAiCoach('${task.id}', '${task.text}')" 
                                    style="background: #6366f1; color: white; border: none; border-radius: 6px; padding: 0 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; min-width: 42px;"
                                    ${isLoading || !aiQuery.trim() ? 'disabled' : ''}>
                                    ${isLoading ? '<div class="spinner-sm"></div>' : '<span style="font-size: 0.9rem;">✈️</span>'}
                                </button>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

async function askAiCoach(taskId, exerciseName) {
    const userQuery = workoutState.aiQueries[taskId];
    if (!userQuery || userQuery.trim() === '') return;

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('Mohon masukkan API Key di pengaturan untuk menggunakan AI Coach.');
        return;
    }

    workoutState.loadingAi = taskId;
    renderWorkoutTab(workoutState.activeTab);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const systemPrompt = "Kamu adalah pelatih fisik ahli sepak bola dan bola voli. User sedang berlatih di rumah (kamar) atau gym dengan alat terbatas. User butuh bantuan terkait latihan spesifik. Berikan jawaban berupa TIPS KEAMANAN atau ALTERNATIF GERAKAN yang ringkas, jelas, bahasa santai, maksimal 3 kalimat saja.";
    const fullPrompt = `Saya sedang di menu latihan: ${exerciseName}. Kendala/Pertanyaan saya: ${userQuery}. Bantu saya Coach!`;

    const delays = [1000, 2000, 4000];
    let success = false;

    for (let i = 0; i <= delays.length; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aiText) {
                workoutState.aiResponses[taskId] = aiText.trim();
                workoutState.aiQueries[taskId] = ''; // Clear input on success
                success = true;
                break;
            }
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed:`, error);
            if (i < delays.length) {
                await new Promise(res => setTimeout(res, delays[i]));
            }
        }
    }

    if (!success) {
        workoutState.aiResponses[taskId] = "Maaf Coach AI sedang gangguan. Coba lagi nanti ya!";
    }

    workoutState.loadingAi = null;
    saveWorkoutState();
    renderWorkoutTab(workoutState.activeTab);
}

function updateAiQuery(taskId, value) {
    workoutState.aiQueries[taskId] = value;
}

function toggleWorkoutTask(category, id) {
    if (!workoutState.progress[category]) workoutState.progress[category] = [];
    const index = workoutState.progress[category].indexOf(id);
    const today = new Date().toISOString().split('T')[0];

    if (index === -1) {
        workoutState.progress[category].push(id);
        
        // Activity tracking & XP
        workoutState.history[today] = true;
        
        // Award XP only once per exercise per day
        if (window.addXP && !workoutState.earnedXpToday.includes(id)) {
            window.addXP(5, 'Latihan Hybrid Athlete');
            workoutState.earnedXpToday.push(id);
        }

        // Full category goal bonus
        const list = workoutData[category];
        if (workoutState.progress[category].length === list.length) {
            if (window.addXP) window.addXP(50, `Lengkap sudah: ${getCategoryTitle(category)}!`);
        }
    } else {
        workoutState.progress[category].splice(index, 1);
    }
    
    saveWorkoutState();
    renderWorkoutTab(workoutState.activeTab);
}

function toggleWorkoutExpand(taskId) {
    workoutState.expanded[taskId] = !workoutState.expanded[taskId];
    renderWorkoutTab(workoutState.activeTab);
}

function resetWorkoutCategory(category) {
    if (confirm('Reset progress latihan ini?')) {
        workoutState.progress[category] = [];
        saveWorkoutState();
        renderWorkoutTab(workoutState.activeTab);
    }
}

// Helpers
function getWorkoutColor(color) {
    const colors = {
        blue: '#3b82f6',
        teal: '#14b8a6',
        slate: '#94a3b8',
        purple: '#a855f7',
        emerald: '#10b981',
        amber: '#f59e0b'
    };
    return colors[color] || '#94a3b8';
}

function getCategoryColorHex(category) {
    if (category === 'gym1') return '#3b82f6';
    if (category === 'gym2') return '#a855f7';
    if (category === 'home1') return '#10b981';
    if (category === 'home2') return '#14b8a6';
    return '#f59e0b';
}

function getCategoryColorClass(category) {
    if (category === 'gym1') return 'blue';
    if (category === 'gym2') return 'purple';
    if (category === 'home1') return 'emerald';
    if (category === 'home2') return 'teal';
    return 'amber';
}

function getCategoryTitle(category) {
    if (category === 'gym1') return 'Gym 1: Leg Power';
    if (category === 'gym2') return 'Gym 2: Upper & Stability';
    if (category === 'home1') return 'Home 1: Silent Endurance';
    if (category === 'home2') return 'Home 2: Band Mobility';
    return 'Latihan';
}

// Global scope access for HTML onclick
window.initWorkoutTracker = initWorkoutTracker;
window.toggleWorkoutTask = toggleWorkoutTask;
window.toggleWorkoutExpand = toggleWorkoutExpand;
window.resetWorkoutCategory = resetWorkoutCategory;
window.askAiCoach = askAiCoach;
window.updateAiQuery = updateAiQuery;
