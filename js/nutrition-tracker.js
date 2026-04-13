// ============================================
// Bulking Nutrition Tracker (Hybrid Athlete)
// Focus: Muscle Gain & Kidney Health
// ============================================

const nutritionData = {
    pagi: [
        { id: 'p1', text: 'Air Putih (Bangun Tidur)', portion: '1 Gelas Belimbing / Mug', gram: '± 300 ml', detail: 'Bilas ginjal pagi hari' },
        { id: 'p2', text: 'Nasi Putih / Nasi Merah', portion: '1 - 1.5 Centong Penuh', gram: '± 150 - 200 gram', detail: 'Ratakan di piring' },
        { id: 'p3', text: '2 Butir Telur Utuh', portion: '2 Butir', gram: '± 100 - 120 gram', detail: 'Rebus/ceplok (~12g Protein)' },
        { id: 'p4', text: 'Sayuran (Opsional)', portion: '1 Mangkok Kecil Bakso', gram: '± 50 - 100 gram', detail: 'Tomat/timun/bayam' },
    ],
    siang: [
        { id: 's1', text: 'Nasi Putih', portion: '1.5 - 2 Centong Penuh', gram: '± 150 - 200 gram', detail: 'Tumpuk sedikit di piring' },
        { id: 's2', text: 'Dada Ayam / Ikan / Sapi', portion: 'Sebesar Telapak Tangan (Tanpa Jari)', gram: '± 100 gram (mentah)', detail: 'Tebal ~2cm (~20-25g Pro)' },
        { id: 's3', text: 'Tempe / Tahu', portion: '2 Potong Segitiga / Kotak Sedang', gram: '± 50 gram', detail: 'Protein nabati tambahan' },
        { id: 's4', text: 'Sayuran Hijau', portion: '1 Mangkok Penuh', gram: '± 100 gram', detail: 'Bening/tumis' },
    ],
    preWorkout: [
        { id: 'pw1', text: 'L-Men Creatine', portion: '1 Bungkus/Sajian', gram: '7.8 gram (3g Creatine)', detail: 'Campur 1 gelas air (200ml)' },
        { id: 'pw2', text: 'Buah Pisang (Opsional)', portion: '1 Buah Seukuran Jengkal', gram: '± 100 gram', detail: 'EnergI instan sebelum angkat beban' },
    ],
    postWorkout: [
        { id: 'po1', text: 'RimbaMass (Setengah Porsi)', portion: '3,5 Scoop / Sendok Takar', gram: '122.5 gram', detail: 'Kocok di Shaker penuh air dingin 400ml (~29.5g Pro)' },
        { id: 'po2', text: 'Air Putih Tambahan', portion: '1 Gelas Belimbing', gram: '± 300 ml', detail: 'Bilas mulut & lambung setelah susu' },
    ],
    malam: [
        { id: 'm1', text: 'Nasi Putih', portion: '1 Centong Datar', gram: '± 100 - 150 gram', detail: 'Lebih sedikit dari siang' },
        { id: 'm2', text: 'Ayam / Ikan / 2 Telur / Tempe', portion: 'Sebesar Telapak Tangan', gram: '± 100 gram', detail: 'Lauk protein wajib ada (~20g Pro)' },
    ],
    opsional: [
        { id: 'o1', text: 'RimbaMass (Sisa Setengah)', portion: '3,5 Scoop / Sendok Takar', gram: '122.5 gram', detail: 'HANYA JIKA tadi siang/malam kurang lauk' },
    ]
};

// State is partially managed in workout-tracker.js (workoutState)
// But we'll add nutrition-specific fields to it if they don't exist

function initNutritionTracker() {
    if (!workoutState.nutritionProgress) workoutState.nutritionProgress = {};
    if (workoutState.waterCount === undefined) workoutState.waterCount = 0;
    if (!workoutState.nutritionAiResponses) workoutState.nutritionAiResponses = {};
    if (!workoutState.nutritionAiQueries) workoutState.nutritionAiQueries = {};
}

function renderNutritionTab(container) {
    initNutritionTracker();

    const maxWater = 8;
    const allTasks = Object.values(nutritionData).flat();
    const completedTasks = Object.values(workoutState.nutritionProgress).flat().length;
    const progressPercent = Math.round((completedTasks / allTasks.length) * 100);

    let html = `
        <div class="nutrition-dashboard animate-in fade-in slide-in-from-bottom-2">
            <!-- Nutrition Progress -->
            <div class="card" style="background: var(--surface); border: 1px solid var(--border); margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; mb: 8px;">
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">Progress Nutrisi</span>
                    <span style="font-size: 1.1rem; font-weight: 900; color: #10b981;">${progressPercent}%</span>
                </div>
                <div style="width: 100%; height: 8px; background: var(--bg-primary); border-radius: 4px; overflow: hidden; margin-top: 8px; border: 1px solid var(--border);">
                    <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #10b981, #34d399); transition: width 0.5s ease-out;"></div>
                </div>
            </div>

            <!-- Water Tracker -->
            <div class="card water-tracker-card" style="background: linear-gradient(135deg, #0f172a, #1e293b); border: 1px solid #1e40af; overflow: hidden; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.2rem;">💧</span>
                        <h4 style="margin: 0; font-size: 1rem; color: #60a5fa;">Target Air Putih</h4>
                    </div>
                    <span class="badge-blue" style="font-size: 0.75rem;">${(workoutState.waterCount * 0.5).toFixed(1)} / 4.0 Liter</span>
                </div>

                <div style="display: flex; align-items: center; gap: 10px; position: relative; z-index: 1;">
                    <button onclick="changeWater(-1)" class="water-btn" style="width: 40px; height: 40px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: white; font-weight: bold; cursor: pointer;">-</button>
                    
                    <div style="flex: 1; display: flex; gap: 4px;">
                        ${Array.from({ length: maxWater }).map((_, i) => `
                            <div class="water-drop ${i < workoutState.waterCount ? 'active' : ''}" style="height: 35px; flex: 1; border-radius: 4px; background: ${i < workoutState.waterCount ? '#3b82f6' : '#0f172a'}; border: 1px solid ${i < workoutState.waterCount ? '#60a5fa' : '#334155'}; transition: all 0.3s ease;"></div>
                        `).join('')}
                    </div>

                    <button onclick="changeWater(1)" class="water-btn" style="width: 40px; height: 40px; border-radius: 8px; border: none; background: #2563eb; color: white; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">+</button>
                </div>
                <p style="text-align: center; font-size: 0.65rem; color: #94a3b8; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">1 Kotak = 500ml (Botol Sedang)</p>
            </div>

            <!-- Sections -->
            ${renderNutritionSection('🌅 Sarapan Pagi', 'pagi', 'emerald')}
            ${renderNutritionSection('☀️ Makan Siang', 'siang', 'teal')}
            ${renderNutritionSection('🔥 Pre-Workout', 'preWorkout', 'amber')}
            ${renderNutritionSection('💪 Post-Workout', 'postWorkout', 'blue')}
            ${renderNutritionSection('🌙 Makan Malam', 'malam', 'indigo')}
            ${renderNutritionSection('🥛 Opsional (Susu)', 'opsional', 'slate')}
        </div>
    `;

    container.innerHTML = html;
}

function renderNutritionSection(title, category, color) {
    const list = nutritionData[category];
    const colorHex = {
        emerald: '#10b981',
        teal: '#14b8a6',
        amber: '#f59e0b',
        blue: '#3b82f6',
        indigo: '#6366f1',
        slate: '#64748b'
    }[color];

    return `
        <div class="nutrition-section" style="margin-top: 20px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                <h3 style="font-size: 1rem; color: ${colorHex}; margin: 0;">${title}</h3>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${list.map(task => {
                    const isChecked = workoutState.nutritionProgress[category]?.includes(task.id);
                    const isExpanded = workoutState.expanded[task.id];
                    const aiResponse = workoutState.nutritionAiResponses[task.id];
                    const query = workoutState.nutritionAiQueries[task.id] || '';
                    const isLoading = workoutState.loadingAi === task.id;

                    return `
                        <div class="nutrition-card ${isChecked ? 'checked' : ''}" style="background: ${isChecked ? colorHex + '11' : 'var(--bg-card)'}; border: 1px solid ${isChecked ? colorHex + '44' : 'var(--border)'}; border-radius: 12px; padding: 12px; transition: all 0.2s ease;">
                            <div style="display: flex; gap: 12px;">
                                <div onclick="toggleNutritionTask('${category}', '${task.id}')" style="cursor: pointer; font-size: 1.4rem; padding-top: 2px;">
                                    ${isChecked ? `<span style="color: ${colorHex}">✅</span>` : '⚪'}
                                </div>
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); ${isChecked ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.text}</h4>
                                        <button onclick="toggleNutritionAi('${task.id}')" style="background: ${colorHex}22; color: ${colorHex}; border: 1px solid ${colorHex}44; padding: 2px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                            ✨ TIPS
                                        </button>
                                    </div>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                                        <span style="font-size: 0.65rem; font-weight: 700; background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.2);">🍽️ ${task.portion}</span>
                                        <span style="font-size: 0.65rem; font-weight: 700; background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.2);">⚖️ ${task.gram}</span>
                                    </div>
                                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; border-left: 2px solid ${colorHex}44; padding-left: 8px;">${task.detail}</p>
                                </div>
                            </div>

                            ${isExpanded ? `
                                <div class="nutrition-ai-box animate-in fade-in slide-in-from-top-2" style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed ${colorHex}33;">
                                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                                        <span style="font-size: 0.8rem;">👨‍⚕️</span>
                                        <span style="font-size: 0.65rem; font-weight: 800; color: ${colorHex}; text-transform: uppercase;">Sports Nutritionist AI</span>
                                    </div>

                                    ${aiResponse ? `
                                        <div style="background: rgba(0,0,0,0.2); border-left: 2px solid ${colorHex}; padding: 10px; border-radius: 4px; font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">
                                            ${aiResponse}
                                        </div>
                                    ` : ''}

                                    <div style="display: flex; gap: 8px;">
                                        <input type="text" 
                                            value="${query}" 
                                            oninput="updateNutritionAiQuery('${task.id}', this.value)"
                                            onkeydown="if(event.key === 'Enter') askNutritionAi('${category}', '${task.id}', '${task.text}')"
                                            placeholder="Ganti ayam pake protein apa?" 
                                            style="flex: 1; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; font-size: 0.75rem; color: var(--text-primary); outline: none;">
                                        <button onclick="askNutritionAi('${category}', '${task.id}', '${task.text}')" 
                                            style="background: ${colorHex}; color: white; border: none; border-radius: 8px; width: 40px; height: 35px; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                                            ${isLoading ? 'disabled' : ''}>
                                            ${isLoading ? '<div class="spinner-sm"></div>' : '✈️'}
                                        </button>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function changeWater(delta) {
    workoutState.waterCount = Math.max(0, Math.min(8, (workoutState.waterCount || 0) + delta));
    saveWorkoutState();
    renderWorkoutTab('nutrisi');
}

function toggleNutritionTask(category, id) {
    if (!workoutState.nutritionProgress) workoutState.nutritionProgress = {};
    if (!workoutState.nutritionProgress[category]) workoutState.nutritionProgress[category] = [];
    
    const index = workoutState.nutritionProgress[category].indexOf(id);
    if (index === -1) {
        workoutState.nutritionProgress[category].push(id);
        if (window.addXP) window.addXP(5, `Nutrisi: ${id}`);
    } else {
        workoutState.nutritionProgress[category].splice(index, 1);
    }
    
    saveWorkoutState();
    renderWorkoutTab('nutrisi');
}

function toggleNutritionAi(id) {
    if (!workoutState.expanded) workoutState.expanded = {};
    workoutState.expanded[id] = !workoutState.expanded[id];
    renderWorkoutTab('nutrisi');
}

function updateNutritionAiQuery(id, value) {
    if (!workoutState.nutritionAiQueries) workoutState.nutritionAiQueries = {};
    workoutState.nutritionAiQueries[id] = value;
}

async function askNutritionAi(category, taskId, foodName) {
    const query = workoutState.nutritionAiQueries[taskId];
    if (!query || query.trim() === '') return;

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('Set API Key in Settings first.');
        return;
    }

    workoutState.loadingAi = taskId;
    renderWorkoutTab('nutrisi');

    const url = `${window.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent'}?key=${apiKey}`;
    const systemPrompt = "Kamu adalah Sports Nutritionist ahli bulking/otot. Memberikan saran makanan pengganti/tips masak sehat yang ringkas (maks 3 kalimat). Fokus: Protein tinggi & hidrasi ginjal.";
    const fullPrompt = `Menu: ${foodName}. Pertanyaan: ${query}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            })
        });

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiText) {
            if (!workoutState.nutritionAiResponses) workoutState.nutritionAiResponses = {};
            workoutState.nutritionAiResponses[taskId] = aiText.trim();
            workoutState.nutritionAiQueries[taskId] = ''; // Clear
        }
    } catch (e) {
        console.error(e);
    }

    workoutState.loadingAi = null;
    saveWorkoutState();
    renderWorkoutTab('nutrisi');
}

// Global scope access
window.changeWater = changeWater;
window.toggleNutritionTask = toggleNutritionTask;
window.toggleNutritionAi = toggleNutritionAi;
window.updateNutritionAiQuery = updateNutritionAiQuery;
window.askNutritionAi = askNutritionAi;
window.renderNutritionTab = renderNutritionTab;
