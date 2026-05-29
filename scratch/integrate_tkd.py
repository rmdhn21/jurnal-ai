# -*- coding: utf-8 -*-
from __future__ import print_function, division, unicode_literals
import json
import codecs
import os

def main():
    print("Memulai integrasi TKD...")
    
    json_path = os.path.join("scratch", "tkd_1000_questions.json")
    js_path = os.path.join("js", "learn-tkd.js")
    
    if not os.path.exists(json_path):
        print("Error: file " + json_path + " tidak ditemukan!")
        return
        
    print("Membaca data soal dari " + json_path + "...")
    with codecs.open(json_path, 'r', 'utf-8') as f:
        questions = json.load(f)
        
    print("Berhasil membaca " + str(len(questions)) + " soal.")
    
    # Serialize questions to JSON string
    questions_json = json.dumps(questions, ensure_ascii=False, indent=2)
    
    # JavaScript template code
    js_code = """// ==========================================
// DATABASE LENGKAP TKD 1000 MASTERY
// Generated automatically from JSON
// ==========================================

const dbTkd = {QUESTIONS_JSON};

// ==========================================
// STATE MANAGEMENT & RUNTIME LOGIC
// ==========================================

let tkdMasteryState = {
    view: 'home', // 'home', 'quiz'
    index: 0,
    currentCategory: 'ALL',
    filteredQuestions: [],
    answers: {} // Map of question ID (1-based) -> selected option index
};

function initTkdMastery() {
    tkdMasteryState.view = 'home';
    tkdMasteryState.index = 0;
    tkdMasteryState.currentCategory = 'ALL';
    tkdMasteryState.filteredQuestions = dbTkd;
    
    // Load progress from localStorage
    const saved = localStorage.getItem('jurnal_ai_tkd_answers');
    if (saved) {
        try {
            tkdMasteryState.answers = JSON.parse(saved);
        } catch (e) {
            tkdMasteryState.answers = {};
        }
    } else {
        tkdMasteryState.answers = {};
    }
    
    renderTkdMastery();
}

function resetTkdProgress() {
    if (confirm("Apakah Anda yakin ingin menghapus semua progress belajar TKD? Semua jawaban akan diset ulang.")) {
        localStorage.removeItem('jurnal_ai_tkd_answers');
        tkdMasteryState.answers = {};
        renderTkdMastery();
    }
}

function selectTkdCategory(cat) {
    tkdMasteryState.view = 'quiz';
    tkdMasteryState.currentCategory = cat;
    tkdMasteryState.index = 0;
    
    if (cat === 'ALL') {
        tkdMasteryState.filteredQuestions = dbTkd;
    } else {
        tkdMasteryState.filteredQuestions = dbTkd.filter(q => q.c === cat);
    }
    
    // Resume to first unanswered question in this category
    let resumeIndex = 0;
    for (let i = 0; i < tkdMasteryState.filteredQuestions.length; i++) {
        const qId = tkdMasteryState.filteredQuestions[i].id;
        if (tkdMasteryState.answers[qId] === undefined) {
            resumeIndex = i;
            break;
        }
    }
    tkdMasteryState.index = resumeIndex;
    
    renderTkdMastery();
}

function renderTkdMastery() {
    const container = document.getElementById('tkd-mastery-content');
    if (!container) return;

    if (tkdMasteryState.view === 'home') {
        container.innerHTML = renderTkdHome();
    } else {
        container.innerHTML = renderTkdQuiz();
    }
    
    // Scroll screen back to top
    const screenEl = document.getElementById('tkd-mastery-screen');
    if (screenEl) {
        screenEl.scrollTop = 0;
    }
}

// ==========================================
// RENDER VIEWS (TEMPLATE COMPILING)
// ==========================================

function renderTkdHome() {
    const totalQuestions = dbTkd.length;
    const answeredCount = Object.keys(tkdMasteryState.answers).length;
    
    let correctCount = 0;
    let wrongCount = 0;
    dbTkd.forEach(q => {
        const ans = tkdMasteryState.answers[q.id];
        if (ans !== undefined) {
            if (ans === q.a) {
                correctCount++;
            } else {
                wrongCount++;
            }
        }
    });
    
    const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
    
    const categories = [
        { name: 'Semua Soal', key: 'ALL', count: 1000, icon: '⚡', desc: 'Campuran 1.000 soal verbal, numerik, dan logika.', color: '#3b82f6' },
        { name: 'Numerik (Deret Angka)', key: 'Numerik (Deret Angka)', count: 300, icon: '📈', desc: 'Latihan deret aritmatika, geometri, Fibonacci, bertingkat, dan lompat.', color: '#fbbf24' },
        { name: 'Numerik (Aritmatika & Aljabar)', key: 'Numerik (Aritmatika & Aljabar)', count: 300, icon: '🔢', desc: 'Soal aljabar dasar, cerita kecepatan-waktu-jarak, umur, dan laba-rugi.', color: '#10b981' },
        { name: 'Logika (Silogisme)', key: 'Logika (Silogisme)', count: 200, icon: '🧩', desc: 'Penarikan kesimpulan logis dari premis-premis formal.', color: '#ef4444' },
        { name: 'Verbal (Analogi)', key: 'Verbal (Analogi)', count: 100, icon: '🗣️', desc: 'Pasangan hubungan analogi kata yang setara.', color: '#818cf8' },
        { name: 'Verbal (Kosakata)', key: 'Verbal (Kosakata)', count: 100, icon: '📚', desc: 'Uji sinonim (persamaan kata) dan antonim (lawan kata).', color: '#ec4899' }
    ];
    
    function getCategoryStats(catKey) {
        let catQuestions = dbTkd;
        if (catKey !== 'ALL') {
            catQuestions = dbTkd.filter(q => q.c === catKey);
        }
        const catTotal = catQuestions.length;
        let catAnswered = 0;
        let catCorrect = 0;
        
        catQuestions.forEach(q => {
            const ans = tkdMasteryState.answers[q.id];
            if (ans !== undefined) {
                catAnswered++;
                if (ans === q.a) {
                    catCorrect++;
                }
            }
        });
        
        return {
            total: catTotal,
            answered: catAnswered,
            correct: catCorrect,
            percent: catTotal > 0 ? Math.round((catAnswered / catTotal) * 100) : 0
        };
    }
    
    let cardsHtml = '';
    categories.forEach(cat => {
        const stats = getCategoryStats(cat.key);
        cardsHtml += `
            <div class="card clickable-card" onclick="selectTkdCategory('${cat.key}')" style="border-left: 5px solid ${cat.color}; cursor: pointer; transition: all 0.2s; padding: 20px; display: flex; align-items: center; gap: 20px; background: var(--bg-card); margin-bottom: 15px;">
                <div style="background: rgba(255, 255, 255, 0.05); width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0; color: ${cat.color};">
                    ${cat.icon}
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 5px; margin-bottom: 8px;">
                        <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">${cat.name}</h3>
                        <span style="font-size: 0.75rem; background: rgba(255,255,255,0.08); color: var(--text-secondary); padding: 3px 8px; border-radius: 20px; font-weight: bold;">
                            ${stats.answered}/${stats.total} Soal (${stats.percent}%)
                        </span>
                    </div>
                    <p class="text-muted" style="margin: 6px 0 10px 0; font-size: 0.82rem; line-height: 1.4;">${cat.desc}</p>
                    <div class="progress-bar-bg" style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                        <div class="progress-bar-fill" style="width: ${stats.percent}%; height: 100%; background: ${cat.color}; border-radius: 3px; transition: width 0.3s;"></div>
                    </div>
                </div>
                <div style="font-size: 1.2rem; color: var(--text-muted); margin-left: 10px;">→</div>
            </div>
        `;
    });
    
    return `
    <div style="max-width: 900px; margin: 0 auto; padding: 10px 0 30px;" class="animate-in fade-in duration-300">
        <!-- Banner Header -->
        <div class="card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(29, 78, 216, 0.03) 100%); border: 1px solid rgba(59, 130, 246, 0.2); text-align: center; padding: 30px 20px; margin-bottom: 25px; border-radius: 20px;">
            <h1 style="font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, #60a5fa, #3b82f6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>⚡</span> TKD 1000 Mastery
            </h1>
            <p class="text-muted" style="margin: 0 auto; max-width: 600px; font-size: 0.95rem; line-height: 1.5;">
                Persiapkan Tes Kemampuan Dasar (TKD) secara komprehensif dengan 1.000 soal interaktif lengkap dengan pembahasan mendalam dan progress tracking otomatis.
            </p>
        </div>

        <!-- Stats Counter Row -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;" class="tkd-stats-row">
            <div class="card" style="padding: 15px; text-align: center; margin-bottom: 0; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Progress Total</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #3b82f6;">${progressPercent}%</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${answeredCount} / ${totalQuestions} Soal</div>
            </div>
            <div class="card" style="padding: 15px; text-align: center; margin-bottom: 0; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Jawaban Benar</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #10b981;">${correctCount}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Akurasi: ${answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%</div>
            </div>
            <div class="card" style="padding: 15px; text-align: center; margin-bottom: 0; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Jawaban Salah</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #ef4444;">${wrongCount}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Perlu dipelajari lagi</div>
            </div>
            <div class="card" style="padding: 15px; text-align: center; margin-bottom: 0; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <button class="btn btn-secondary" onclick="resetTkdProgress()" style="padding: 8px 12px; font-size: 0.75rem; font-weight: bold; width: 100%; border-radius: 8px; color: #ef4444; border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.05); cursor: pointer;">
                    🔄 Reset Progress
                </button>
            </div>
        </div>

        <!-- Categories Section -->
        <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 15px; color: var(--text-primary);">Pilih Kategori Belajar</h2>
        <div style="display: flex; flex-direction: column;">
            ${cardsHtml}
        </div>
    </div>
    `;
}

function renderTkdQuiz() {
    const total = tkdMasteryState.filteredQuestions.length;
    if (total === 0) {
        return `
            <div style="text-align: center; padding: 50px;">
                <h2>Tidak ada soal ditemukan di kategori ini.</h2>
                <button class="btn btn-primary" onclick="initTkdMastery()">Kembali ke Menu</button>
            </div>
        `;
    }
    
    const index = tkdMasteryState.index;
    const question = tkdMasteryState.filteredQuestions[index];
    const qId = question.id;
    const progressPercent = Math.round(((index + 1) / total) * 100);
    
    const userChoice = tkdMasteryState.answers[qId];
    const hasAnsweredCurrent = userChoice !== undefined;
    
    // Create options list HTML
    let optionsHtml = '';
    question.o.forEach((opt, idx) => {
        let btnStyle = '';
        let badgeStyle = '';
        let disabledAttr = hasAnsweredCurrent ? 'disabled' : '';
        let optionClass = 'option-btn';
        
        if (hasAnsweredCurrent) {
            if (idx === question.a) {
                // Correct answer
                btnStyle = 'background: rgba(16, 185, 129, 0.08); color: #a7f3d0; border-color: #10b981;';
                badgeStyle = 'background: #10b981; color: white; border-color: #10b981;';
            } else if (idx === userChoice) {
                // User chose this, but it is wrong
                btnStyle = 'background: rgba(239, 68, 68, 0.08); color: #fca5a5; border-color: #ef4444;';
                badgeStyle = 'background: #ef4444; color: white; border-color: #ef4444;';
            } else {
                // Neutral and disabled
                btnStyle = 'opacity: 0.5; cursor: not-allowed;';
            }
        }
        
        optionsHtml += `
            <button class="${optionClass}" ${disabledAttr} onclick="selectTkdOption(${idx})" style="width: 100%; text-align: left; padding: 15px 20px; border-radius: 12px; font-family: inherit; font-size: 0.95rem; font-weight: 600; background: var(--bg-primary); color: var(--text-primary); border: 2px solid var(--border); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; margin-bottom: 12px; ${btnStyle}">
                <div class="option-badge" style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; flex-shrink: 0; ${badgeStyle}">
                    ${String.fromCharCode(65 + idx)}
                </div>
                <span>${opt}</span>
            </button>
        `;
    });
    
    // CBT numbers pagination/grid
    const groupSize = 50;
    const totalGroups = Math.ceil(total / groupSize);
    const currentGroup = Math.floor(index / groupSize);
    
    let groupSelectHtml = '';
    if (totalGroups > 1) {
        groupSelectHtml += `<select onchange="changeTkdGroup(this.value)" style="background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border); padding: 5px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; outline: none; cursor: pointer;">`;
        for (let g = 0; g < totalGroups; g++) {
            const startNum = g * groupSize + 1;
            const endNum = Math.min((g + 1) * groupSize, total);
            groupSelectHtml += `<option value="${g}" ${g === currentGroup ? 'selected' : ''}>Soal ${startNum} - ${endNum}</option>`;
        }
        groupSelectHtml += `</select>`;
    }
    
    // Build active group number buttons
    let numbersHtml = '';
    const startIdx = currentGroup * groupSize;
    const endIdx = Math.min(startIdx + groupSize, total);
    for (let i = startIdx; i < endIdx; i++) {
        const qNum = i + 1;
        const qObj = tkdMasteryState.filteredQuestions[i];
        const ansVal = tkdMasteryState.answers[qObj.id];
        
        let numStyle = 'background: rgba(255,255,255,0.02); border: 1px solid var(--border); color: var(--text-secondary);';
        
        if (i === index) {
            numStyle = 'background: #3b82f6; color: white; border-color: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);';
        } else if (ansVal !== undefined) {
            if (ansVal === qObj.a) {
                numStyle = 'background: #10b981; color: white; border-color: #10b981;';
            } else {
                numStyle = 'background: #ef4444; color: white; border-color: #ef4444;';
            }
        }
        
        numbersHtml += `
            <button onclick="jumpToTkdQuizQuestion(${i})" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: all 0.2s; ${numStyle}">
                ${qNum}
            </button>
        `;
    }
    
    let categoryBadgeColor = '#3b82f6';
    if (question.c.includes('Deret')) categoryBadgeColor = '#fbbf24';
    else if (question.c.includes('Aritmatika')) categoryBadgeColor = '#10b981';
    else if (question.c.includes('Silogisme')) categoryBadgeColor = '#ef4444';
    else if (question.c.includes('Analogi')) categoryBadgeColor = '#818cf8';
    else if (question.c.includes('Kosakata')) categoryBadgeColor = '#ec4899';
    
    return `
    <div class="animate-in fade-in duration-300" style="max-width: 950px; margin: 0 auto; display: flex; gap: 20px; padding: 10px 0 50px; flex-wrap: wrap;">
        <!-- Left Side: Back Button & Quiz Card -->
        <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column;">
            
            <!-- Quiz Card Header Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; gap: 10px;">
                <button class="btn btn-secondary" onclick="initTkdMastery()" style="padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    ← Menu Utama
                </button>
                <div style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary); background: rgba(255,255,255,0.03); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border);">
                    Kategori: <span style="color: ${categoryBadgeColor};">${question.c}</span>
                </div>
            </div>

            <!-- Quiz Card -->
            <div class="card" style="padding: 30px; margin-bottom: 0; min-height: 420px; display: flex; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);">
                <!-- Card Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 0.8rem; font-weight: bold; border-bottom: 1px solid var(--border); padding-bottom: 15px;">
                    <span style="color: var(--text-muted);">SOAL NO. <strong style="font-size: 1.1rem; color: var(--text-primary);">${index + 1}</strong> dari ${total} (ID: ${qId})</span>
                    <span style="color: var(--text-muted);">${progressPercent}% Selesai</span>
                </div>
                
                <!-- Progress Line -->
                <div class="progress-bar-bg" style="height: 4px; background: rgba(255,255,255,0.05); margin-bottom: 25px; border-radius: 2px; overflow: hidden;">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%; height: 100%; background: #3b82f6; border-radius: 2px; transition: width 0.3s;"></div>
                </div>

                <!-- Question Text -->
                <p class="question-text" style="font-size: 1.15rem; font-weight: 700; line-height: 1.6; margin: 0 0 25px 0; color: var(--text-primary); white-space: pre-wrap;">
                    ${question.q}
                </p>

                <!-- Options list -->
                <div style="margin-bottom: 25px;">
                    ${optionsHtml}
                </div>

                <!-- Explanation Panel (after answer) -->
                ${hasAnsweredCurrent ? `
                    <div class="animate-in fade-in duration-300" style="margin-bottom: 25px; border-radius: 12px; border: 1px solid; padding: 18px; ${userChoice === question.a ? 'background: rgba(16, 185, 129, 0.04); border-color: rgba(16, 185, 129, 0.2);' : 'background: rgba(239, 68, 68, 0.04); border-color: rgba(239, 68, 68, 0.2);'}">
                        <div style="display: flex; gap: 15px; align-items: flex-start;">
                            <div style="font-size: 1.8rem; line-height: 1; ${userChoice === question.a ? 'color: #10b981;' : 'color: #ef4444;'}">
                                ${userChoice === question.a ? '✅' : '❌'}
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0; font-size: 1rem; font-weight: 800; ${userChoice === question.a ? 'color: #10b981;' : 'color: #ef4444;'}">
                                    ${userChoice === question.a ? 'Jawaban Anda Benar!' : 'Jawaban Anda Kurang Tepat!'}
                                </h4>
                                <p style="margin: 6px 0 12px 0; font-size: 0.85rem; font-weight: 500; color: var(--text-secondary);">
                                    Kunci Jawaban: <strong style="background: rgba(255,255,255,0.05); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; color: var(--text-primary);">${String.fromCharCode(65 + question.a)}. ${question.o[question.a]}</strong>
                                </p>

                                <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px; padding: 12px 14px;">
                                    <span style="font-weight: bold; color: #fbbf24; display: flex; align-items: center; gap: 6px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                                        💡 Detail Pembahasan:
                                    </span>
                                    <p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); font-weight: 500;">
                                        ${question.e}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Prev/Next Control Row -->
                <div style="margin-top: auto; border-top: 1px solid var(--border); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <button class="btn btn-secondary" onclick="tkdPrevQuestion()" ${index === 0 ? 'disabled style="opacity: 0.4; cursor: not-allowed; padding: 10px 20px;"' : 'style="padding: 10px 20px; cursor: pointer;"'}>
                        ← Sebelumnya
                    </button>
                    
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 0.8rem; color: var(--text-muted);">Lompat ke:</span>
                        <input type="number" id="tkd-jump-input" value="${index + 1}" min="1" max="${total}" onchange="jumpToTkdQuestion(this.value)" style="width: 60px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-primary); color: var(--text-primary); text-align: center; font-weight: bold; font-size: 0.85rem; outline: none;">
                    </div>

                    <button class="btn btn-primary" onclick="tkdNextQuestion()" style="padding: 10px 20px; cursor: pointer;">
                        ${index === total - 1 ? 'Selesai Belajar' : 'Selanjutnya →'}
                    </button>
                </div>

            </div>
        </div>

        <!-- Right Column: Navigation Grid Panel (CBT-like) -->
        <div class="tkd-grid-panel" style="width: 280px; flex-shrink: 0; display: flex; flex-direction: column; gap: 15px;">
            <div class="card" style="padding: 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; display: flex; flex-direction: column; margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">Daftar Nomor</h3>
                    ${groupSelectHtml}
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; overflow-y: auto; max-height: 250px; padding-bottom: 10px;" class="no-scrollbar">
                    ${numbersHtml}
                </div>

                <!-- Legend -->
                <div style="border-top: 1px solid var(--border); margin-top: 15px; padding-top: 12px; display: flex; flex-direction: column; gap: 6px; font-size: 0.72rem; font-weight: bold; color: var(--text-muted);">
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:#10b981; border-radius:3px;"></div> Benar</div>
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:#ef4444; border-radius:3px;"></div> Salah</div>
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius:3px;"></div> Belum Dijawab</div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function selectTkdOption(optIdx) {
    const index = tkdMasteryState.index;
    const question = tkdMasteryState.filteredQuestions[index];
    const qId = question.id;
    
    if (tkdMasteryState.answers[qId] !== undefined) return; // already answered
    
    tkdMasteryState.answers[qId] = optIdx;
    
    // Save to localStorage
    localStorage.setItem('jurnal_ai_tkd_answers', JSON.stringify(tkdMasteryState.answers));
    
    renderTkdMastery();
}

function tkdNextQuestion() {
    const total = tkdMasteryState.filteredQuestions.length;
    if (tkdMasteryState.index < total - 1) {
        tkdMasteryState.index++;
        renderTkdMastery();
    } else {
        // Go back home
        initTkdMastery();
    }
}

function tkdPrevQuestion() {
    if (tkdMasteryState.index > 0) {
        tkdMasteryState.index--;
        renderTkdMastery();
    }
}

function jumpToTkdQuestion(val) {
    let num = parseInt(val) - 1;
    const total = tkdMasteryState.filteredQuestions.length;
    if (isNaN(num) || num < 0) num = 0;
    if (num >= total) num = total - 1;
    tkdMasteryState.index = num;
    renderTkdMastery();
}

function jumpToTkdQuizQuestion(idx) {
    tkdMasteryState.index = idx;
    renderTkdMastery();
}

function changeTkdGroup(groupVal) {
    const group = parseInt(groupVal);
    const groupSize = 50;
    tkdMasteryState.index = group * groupSize;
    renderTkdMastery();
}

// Expose globally
window.initTkdMastery = initTkdMastery;
window.selectTkdCategory = selectTkdCategory;
window.renderTkdMastery = renderTkdMastery;
window.selectTkdOption = selectTkdOption;
window.tkdNextQuestion = tkdNextQuestion;
window.tkdPrevQuestion = tkdPrevQuestion;
window.jumpToTkdQuestion = jumpToTkdQuestion;
window.jumpToTkdQuizQuestion = jumpToTkdQuizQuestion;
window.changeTkdGroup = changeTkdGroup;
window.resetTkdProgress = resetTkdProgress;
"""

    # Inject JSON database
    js_final = js_code.replace("{QUESTIONS_JSON}", questions_json)
    
    # Save the file
    print("Menulis ke " + js_path + "...")
    with codecs.open(js_path, 'w', 'utf-8') as f:
        f.write(js_final)
        
    print("Integrasi TKD Selesai! File js/learn-tkd.js berhasil dibuat.")

if __name__ == "__main__":
    main()
