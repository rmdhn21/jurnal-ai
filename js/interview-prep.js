// ===== DAILY INTERVIEW PREP COMPONENT =====

const INTERVIEW_KEYS = {
    STATE: 'jurnal_ai_interview_state',
    HISTORY: 'jurnal_ai_interview_history'
};

// --- MOCK QUESTION BANK ---
const QUESTION_BANK = {
    psychometric: [
        { id: 'psy-001', text: 'Deret: 2, 4, 8, 16, ...', options: ['18', '24', '32', '64'], correct: 2, reason: 'Pola x2 setiap langkah.' },
        { id: 'psy-002', text: 'Deret: 1, 1, 2, 3, 5, ...', options: ['7', '8', '13', '15'], correct: 1, reason: 'Fibonacci: 3+5=8.' },
        { id: 'psy-003', text: 'Sinonim: KREASI', options: ['Ciptaan', 'Rencana', 'Kemampuan', 'Berpikir'], correct: 0, reason: 'Kreasi bermakna ciptaan atau hasil daya cipta.' },
        { id: 'psy-004', text: 'Antonim: ABSURD', options: ['Gila', 'Masuk Akal', 'Aneh', 'Mustahil'], correct: 1, reason: 'Absurd artinya tidak masuk akal, lawannya adalah Masuk Akal.' },
        { id: 'psy-005', text: 'Jika A > B dan B > C, maka...', options: ['A < C', 'A = C', 'A > C', 'Tidak dapat ditentukan'], correct: 2, reason: 'Sifat transitif: jika A>B>C maka A>C.' },
        { id: 'psy-006', text: 'Manakah yang tidak termasuk kelompok?', options: ['Meja', 'Kursi', 'Lemari', 'Kucing'], correct: 3, reason: 'Kucing adalah makhluk hidup, lainnya perabot.' },
        { id: 'psy-007', text: 'Mobil : Bensin = Manusia : ...', options: ['Makanan', 'Jalan', 'Roda', 'Rumah'], correct: 0, reason: 'Mobil butuh bensin untuk energi, manusia butuh makanan.' },
        { id: 'psy-008', text: '1 jam + 40 menit = ... menit', options: ['100', '120', '80', '140'], correct: 0, reason: '60 + 40 = 100 menit.' },
        { id: 'psy-009', text: 'Gambar berikutnya dalam pola rotasi 90 derajat searah jarum jam.', options: ['A', 'B', 'C', 'D'], correct: 0, reason: 'Visual logic.' },
        { id: 'psy-010', text: 'Pilih ejaan yang benar:', options: ['Apotik', 'Apotek', 'Athlet', 'Antri'], correct: 1, reason: 'Baku: Apotek, Atlet, Antre.' },
        { id: 'psy-011', text: 'Semua burung punya sayap. Penguin adalah burung. Jadi...', options: ['Penguin bisa terbang', 'Penguin punya sayap', 'Penguin bukan burung', 'Tidak ada simpulan'], correct: 1, reason: 'Silogisme valid: Penguin punya sayap.' },
        { id: 'psy-012', text: '20% dari 500 adalah...', options: ['50', '25', '100', '150'], correct: 2, reason: '0.2 x 500 = 100.' },
        { id: 'psy-013', text: 'Padanan kata: KOSONG : HAMPA', options: ['Cair : Encer', 'Siang : Malam', 'Ubi : Akar', 'Penuh : Sesak'], correct: 0, reason: 'Sinonim.' },
        { id: 'psy-014', text: 'Berapa jumlah sisi kubus?', options: ['4', '6', '8', '12'], correct: 1, reason: 'Kubus memiliki 6 sisi persegi.' },
        { id: 'psy-015', text: 'Deret: 100, 95, 90, 85, ...', options: ['80', '75', '70', '65'], correct: 0, reason: 'Berkurang 5 setiap langkah.' }
    ],
    hse: [
        { id: 'hse-001', text: 'Kepanjangan K3 adalah...', options: ['Keamanan, Kesehatan, dan Keselamatan Kerja', 'Keselamatan dan Kesehatan Kerja', 'Kesehatan dan Keamanan Kerja', 'Kebersihan, Kesehatan, Keamanan'], correct: 1, reason: 'Standar UU No. 1 Tahun 1970.' },
        { id: 'hse-002', text: 'Warna helm safety untuk operator/pekerja umum biasanya...', options: ['Putih', 'Kuning', 'Merah', 'Biru'], correct: 1, reason: 'Kuning = Pekerja/Operator, Putih = Engineer/Manajer.' },
        { id: 'hse-003', text: 'Apa itu HIRA?', options: ['Hazard Identification and Risk Assessment', 'Health Insurance Risk Association', 'High Impact Risk Analysis', 'Hazard Impact Risk Audit'], correct: 0, reason: 'Identifikasi Bahaya dan Penilaian Resiko.' },
        { id: 'hse-004', text: 'APAR jenis CO2 cocok untuk kebakaran kelas...', options: ['A (Padat)', 'B (Cair) & C (Listrik)', 'D (Logam)', 'K (Dapur)'], correct: 1, reason: 'CO2 efektif untuk cairan mudah terbakar dan elektrikal.' },
        { id: 'hse-005', text: 'Apa arti rambu segitiga kuning dengan gambar tengkorak?', options: ['Bahaya Radiasi', 'Bahaya Listrik', 'Bahaya Bahan Beracun', 'Bahaya Masuk'], correct: 2, reason: 'Simbol Toxic/Beracun.' },
        { id: 'hse-006', text: 'Jika terjadi tumpahan minyak (oil spill) di laut, tindakan pertama adalah...', options: ['Membakar minyak', 'Melokalisir dengan Oil Boom', 'Menyiram air', 'Membiarkan menguap'], correct: 1, reason: 'Oil Boom mencegah penyebaran minyak.' },
        { id: 'hse-007', text: 'Dokumen izin kerja untuk pekerjaan berbahaya disebut...', options: ['JSA', 'SOP', 'Work Permit / PTW', 'LOTO'], correct: 2, reason: 'Permit To Work (PTW) wajib untuk hot work, confined space, dll.' },
        { id: 'hse-008', text: 'Apa tujuan LOTO (Lock Out Tag Out)?', options: ['Mengunci pintu gudang', 'Mengisolasi energi berbahaya saat perbaikan', 'Menandai barang rusak', 'Absensi karyawan'], correct: 1, reason: 'Mencegah energi menyala tidak sengaja saat maintenance.' },
        { id: 'hse-009', text: 'MSDS adalah singkatan dari...', options: ['Material Safety Data Sheet', 'Material Standard Delivery System', 'Manual Safety Data Sheet', 'Main Safety Document System'], correct: 0, reason: 'Lembar Data Keselamatan Bahan.' },
        { id: 'hse-010', text: 'Bekerja di ketinggian di atas ... meter wajib menggunakan Full Body Harness.', options: ['1.5', '1.8', '2.0', '3.0'], correct: 1, reason: 'Standar umum OSHA/Kemenaker (1.8m).' },
        { id: 'hse-011', text: 'Segitiga Api terdiri dari...', options: ['Panas, CO2, Bahan Bakar', 'Panas, Oksigen, Bahan Bakar', 'Api, Asap, Panas', 'Air, Tanah, Api'], correct: 1, reason: 'Fire Triangle: Heat, Oxygen, Fuel.' },
        { id: 'hse-012', text: 'Apa itu Near Miss?', options: ['Kecelakaan fatal', 'Kejadian hampir celaka', 'Kecelakaan ringan', 'Kerusakan alat'], correct: 1, reason: 'Insiden yang tidak menyebabkan cedera tapi berpotensi.' },
        { id: 'hse-013', text: 'APD pelindung pendengaran adalah...', options: ['Safety Glasses', 'Ear Plug / Ear Muff', 'Respirator', 'Face Shield'], correct: 1, reason: 'Melindungi dari kebisingan.' },
        { id: 'hse-014', text: 'Kebakaran Kelas A melibatkan...', options: ['Logam', 'Listrik', 'Bahan padat mudah terbakar (kertas, kayu)', 'Gas'], correct: 2, reason: 'Kelas A = Ash (Abu) -> Kertas, Kayu, Kain.' },
        { id: 'hse-015', text: 'Tindakan tidak aman (Unsafe Action) berkontribusi sebesar ...% kecelakaan.', options: ['10-20%', '30-40%', '80-90%', '50%'], correct: 2, reason: 'Teori Heinrich/Domino: Mayoritas kecelakaan karena faktor manusia.' }
    ]
};

// --- STATE MANAGEMENT ---
let interviewState = {
    date: null,
    questions: [],
    answers: {}, // { questionId: selectedIndex }
    isSubmitted: false,
    score: 0
};

// --- FUNCTIONS ---

function initInterviewPrep() {
    const today = new Date().toISOString().split('T')[0];
    const savedState = JSON.parse(localStorage.getItem(INTERVIEW_KEYS.STATE));

    if (savedState && savedState.date === today) {
        interviewState = savedState;
    } else {
        generateDailyQuestions(today);
    }

    renderInterviewUI();
}

function generateDailyQuestions(date) {
    // Helper to shuffle array
    const shuffle = (array) => array.sort(() => 0.5 - Math.random());

    // Pick 10 from Psychometric and 10 from HSE
    // In a real app we might use seeded random to ensure specific rotation
    const psy = shuffle([...QUESTION_BANK.psychometric]).slice(0, 10);
    const hse = shuffle([...QUESTION_BANK.hse]).slice(0, 10);

    const dailyQuestions = [...psy, ...hse];

    interviewState = {
        date: date,
        questions: dailyQuestions,
        answers: {},
        isSubmitted: false,
        score: 0
    };

    saveInterviewState();
}

function saveInterviewState() {
    localStorage.setItem(INTERVIEW_KEYS.STATE, JSON.stringify(interviewState));
}

function handleOptionSelect(qId, optionIndex) {
    if (interviewState.isSubmitted) return;

    interviewState.answers[qId] = optionIndex;
    saveInterviewState();

    // UI Update (Scoped)
    const container = document.getElementById(`q-${qId}`);
    if (container) {
        container.querySelectorAll('.option-btn').forEach((btn, idx) => {
            if (idx === optionIndex) btn.classList.add('selected');
            else btn.classList.remove('selected');
        });
    }

    // Check if all answered to enable Submit Button
    const totalQ = interviewState.questions.length;
    const answeredCount = Object.keys(interviewState.answers).length;

    if (answeredCount === totalQ) {
        const submitBtn = document.querySelector('#interview-content .submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.innerText = '✅ Koreksi Jawaban';
        }
    }

    // Update Progress Bar
    const progressFill = document.querySelector('#interview-content .progress-fill');
    if (progressFill) {
        progressFill.style.width = `${(answeredCount / totalQ) * 100}%`;
    }
}

function submitInterview() {
    if (interviewState.isSubmitted) return;

    // Calculate Score
    let correctCount = 0;
    interviewState.questions.forEach(q => {
        if (interviewState.answers[q.id] === q.correct) {
            correctCount++;
        }
    });

    interviewState.score = Math.round((correctCount / interviewState.questions.length) * 100);
    interviewState.isSubmitted = true;
    saveInterviewState();

    renderInterviewUI(); // Re-render to show results

    // Save to History (Optional, for gamification later)
    // saveToHistory(interviewState);
}

function resetInterview() {
    if (confirm('Reset latihan hari ini? (Progres akan hilang)')) {
        const today = new Date().toISOString().split('T')[0];
        generateDailyQuestions(today);
        renderInterviewUI();
    }
}

// --- RENDER ---
function renderInterviewUI() {
    const container = document.getElementById('interview-content');
    if (!container) return;

    if (interviewState.isSubmitted) {
        // === RESULT VIEW ===
        let resultHTML = `
            <div class="interview-result">
                <h3>Skor Kamu: ${interviewState.score}/100</h3>
                <p>${interviewState.score >= 70 ? '🎉 Bagus sekali! Siap untuk interview.' : '📚 Perlu latihan lagi.'}</p>
                <div class="result-breakdown">
        `;

        interviewState.questions.forEach((q, index) => {
            const userAns = interviewState.answers[q.id];
            const isCorrect = userAns === q.correct;
            const statusClass = isCorrect ? 'correct' : (userAns !== undefined ? 'wrong' : 'skipped');

            resultHTML += `
                <div class="question-review ${statusClass}">
                    <div class="q-header">
                        <span class="q-num">#${index + 1}</span>
                        <span class="q-text">${q.text}</span>
                    </div>
                    <div class="q-feedback">
                        <div class="ans-row">
                            <span>Jawabanmu: </span>
                            <strong>${userAns !== undefined ? q.options[userAns] : '-'}</strong>
                            ${isCorrect ? '✅' : '❌'}
                        </div>
                        ${!isCorrect ? `
                        <div class="ans-row correct-ans">
                            <span>Jawaban Benar: </span>
                            <strong>${q.options[q.correct]}</strong>
                        </div>
                        ` : ''}
                        <div class="reason-box">
                            💡 <em>${q.reason}</em>
                        </div>
                    </div>
                </div>
            `;
        });

        resultHTML += `
                </div>
                <button class="btn-primary" onclick="initInterviewPrep()">Latihan Lagi (Soal Baru Besok)</button>
                <button class="btn-secondary" onclick="resetInterview()">Ulangi Latihan Ini</button>
            </div>
        `;
        container.innerHTML = resultHTML;

    } else {
        // === QUESTION VIEW ===
        let qHTML = `
            <div class="interview-header">
                <h2>📝 Daily Interview Prep</h2>
                <p>20 Soal (Psikotes + HSE Migas) | Reset Setiap Hari</p>
                <div class="progress-bar-container">
                    <div class="progress-fill" style="width: ${(Object.keys(interviewState.answers).length / 20) * 100}%"></div>
                </div>
            </div>
            <div class="questions-list">
        `;

        interviewState.questions.forEach((q, index) => {
            const savedAns = interviewState.answers[q.id];

            qHTML += `
                <div class="question-card" id="q-${q.id}">
                    <div class="question-text">
                        <span class="q-num">${index + 1}.</span> ${q.text}
                    </div>
                    <div class="options-grid">
                        ${q.options.map((opt, idx) => `
                            <button class="option-btn ${savedAns === idx ? 'selected' : ''}" 
                                onclick="handleOptionSelect('${q.id}', ${idx})">
                                <span class="opt-label">${String.fromCharCode(65 + idx)}</span>
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        const allAnswered = Object.keys(interviewState.answers).length === interviewState.questions.length;

        qHTML += `
            </div>
            <div class="interview-actions">
                <button class="btn-primary submit-btn" onclick="submitInterview()" ${!allAnswered ? 'disabled style="opacity:0.5"' : ''}>
                    ${allAnswered ? '✅ Koreksi Jawaban' : 'Jawab Semua Soal Dulu'}
                </button>
            </div>
        `;
        container.innerHTML = qHTML;
    }
}

// Export for global access if needed (or just attach to window for simple integration)
window.initInterviewPrep = initInterviewPrep;
window.handleOptionSelect = handleOptionSelect;
window.submitInterview = submitInterview;
window.resetInterview = resetInterview;
