// ===== ISLAMIC TRACKER MODULE =====
let currentIslamMonthView = new Date();

function initIslamTrackerUI() {
    const todayStr = getTodayString();

    // Set date display
    const dateDisplay = document.getElementById('islam-date-display');
    if (dateDisplay) {
        dateDisplay.textContent = formatDate(new Date());
    }

    // Load today's data
    const trackData = getIslamicTrackByDate(todayStr);

    // Update Chart & Motivation On Load
    renderIslamChart();
    updateIslamMotivation(trackData);

    // Prayers
    const setChecked = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = val || false;
    };

    setChecked('prayer-subuh', trackData.prayers.subuh);
    setChecked('prayer-dzuhur', trackData.prayers.dzuhur);
    setChecked('prayer-ashar', trackData.prayers.ashar);
    setChecked('prayer-maghrib', trackData.prayers.maghrib);
    setChecked('prayer-isya', trackData.prayers.isya);

    // Sunnah & Others
    setChecked('islam-qobliyah', trackData.qobliyah);
    setChecked('islam-sedekah', trackData.sedekah);
    setChecked('islam-waqiah', trackData.waqiah);
    setChecked('islam-fasting', trackData.fasting);

    // Quran
    const quranInput = document.getElementById('islam-quran-text');
    if (quranInput) {
        quranInput.value = trackData.quranText || '';
    }

    // Dhikr
    let currentDhikr = trackData.dhikrCount || 0;
    const dhikrCountEl = document.getElementById('dhikr-count');
    if (dhikrCountEl) {
        dhikrCountEl.textContent = currentDhikr;
    }

    // ----- EVENT LISTENERS -----
    const saveState = () => {
        const newData = getIslamicTrackByDate(todayStr);

        const isChecked = (id) => {
            const el = document.getElementById(id);
            return el ? el.checked : false;
        };

        newData.prayers.subuh = isChecked('prayer-subuh');
        newData.prayers.dzuhur = isChecked('prayer-dzuhur');
        newData.prayers.ashar = isChecked('prayer-ashar');
        newData.prayers.maghrib = isChecked('prayer-maghrib');
        newData.prayers.isya = isChecked('prayer-isya');

        newData.qobliyah = isChecked('islam-qobliyah');
        newData.sedekah = isChecked('islam-sedekah');
        newData.waqiah = isChecked('islam-waqiah');
        newData.fasting = isChecked('islam-fasting');

        if (quranInput) {
            newData.quranText = quranInput.value.trim();
        }
        if (dhikrCountEl) {
            newData.dhikrCount = parseInt(dhikrCountEl.textContent) || 0;
        }

        saveIslamicTrack(todayStr, newData);

        // Re-render chart and text live
        renderIslamChart();
        updateIslamMotivation(newData);
    };

    // Attach listener to all checkboxes
    document.querySelectorAll('.islam-checkbox').forEach(cb => {
        // remove old listeners if re-initialized to prevent duplicate saving
        const newCb = cb.cloneNode(true);
        cb.parentNode.replaceChild(newCb, cb);
        newCb.addEventListener('change', saveState);
    });

    // Attach listener to text input
    if (quranInput) {
        const newQuranInput = quranInput.cloneNode(true);
        quranInput.parentNode.replaceChild(newQuranInput, quranInput);
        newQuranInput.addEventListener('change', saveState);
    }

    // Dhikr buttons
    const dhikrAdd = document.getElementById('dhikr-add-btn');
    const dhikrReset = document.getElementById('dhikr-reset-btn');

    if (dhikrAdd && dhikrCountEl) {
        const newDhikrAdd = dhikrAdd.cloneNode(true);
        dhikrAdd.parentNode.replaceChild(newDhikrAdd, dhikrAdd);

        newDhikrAdd.addEventListener('click', () => {
            currentDhikr++;
            dhikrCountEl.textContent = currentDhikr;
            saveState();

            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    }

    if (dhikrReset && dhikrCountEl) {
        const newDhikrReset = dhikrReset.cloneNode(true);
        dhikrReset.parentNode.replaceChild(newDhikrReset, dhikrReset);

        newDhikrReset.addEventListener('click', () => {
            if (confirm('Reset hitungan tasbih ke 0?')) {
                currentDhikr = 0;
                dhikrCountEl.textContent = currentDhikr;
                saveState();
            }
        });
    }

    // AI Analysis Button
    const analyzeBtn = document.getElementById('analyze-islam-btn');
    if (analyzeBtn) {
        const newAnalyzeBtn = analyzeBtn.cloneNode(true);
        analyzeBtn.parentNode.replaceChild(newAnalyzeBtn, analyzeBtn);
        newAnalyzeBtn.addEventListener('click', () => {
            if (typeof analyzeIslamicTracking === 'function') {
                analyzeIslamicTracking(todayStr);
            } else {
                alert('Fitur analisis Ibadah dengan AI akan segera hadir dalam pembaruan berikutnya!');
            }
        });
    }

    // Calendar Navigation Buttons
    const prevBtn = document.getElementById('islam-prev-month');
    const nextBtn = document.getElementById('islam-next-month');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIslamMonthView.setMonth(currentIslamMonthView.getMonth() - 1);
            renderIslamChart();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const today = new Date();
            // Optional: Limit next button so user can't navigate to future months if desired.
            // But allowing it is also fine (they will just see empty grid).
            currentIslamMonthView.setMonth(currentIslamMonthView.getMonth() + 1);
            renderIslamChart();
        });
    }
}

// ===== CHART & MOTIVATION FUNCTION =====
function renderIslamChart() {
    const gridContainer = document.getElementById('islam-yearly-grid');
    const monthLabelEl = document.getElementById('islam-current-month-label');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    const viewYear = currentIslamMonthView.getFullYear();
    const viewMonth = currentIslamMonthView.getMonth(); // 0-11

    const trackRepo = getIslamicTracks();
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    if (monthLabelEl) {
        monthLabelEl.textContent = `${monthNames[viewMonth]} ${viewYear}`;
    }

    const monthWrapper = document.createElement('div');
    monthWrapper.className = 'calendar-month';

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Add day headers
    dayNames.forEach(d => {
        const dLabel = document.createElement('div');
        dLabel.className = 'day-name';
        dLabel.textContent = d;
        grid.appendChild(dLabel);
    });

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Padding cells for first week
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'grid-cell empty';
        grid.appendChild(emptyCell);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(viewYear, viewMonth, day);
        const cell = document.createElement('div');
        cell.textContent = day;

        if (cellDate > today) {
            cell.className = 'grid-cell level-0';
            cell.title = 'Belum waktunya';
        } else {
            const monthStr = String(viewMonth + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateStr = `${viewYear}-${monthStr}-${dayStr}`;
            const trackData = trackRepo[dateStr];

            let score = 0;
            if (trackData) {
                if (trackData.prayers.subuh) score++;
                if (trackData.prayers.dzuhur) score++;
                if (trackData.prayers.ashar) score++;
                if (trackData.prayers.maghrib) score++;
                if (trackData.prayers.isya) score++;
                if (trackData.qobliyah) score++;
                if (trackData.sedekah) score++;
                if (trackData.waqiah) score++;
                if (trackData.fasting) score++;
            }

            let level = 0;
            if (score > 0) level = 1;
            if (score > 2) level = 2;
            if (score > 4) level = 3;
            if (score > 6) level = 4;
            if (score === 9) level = 5;

            cell.className = `grid-cell level-${level}`;
            cell.title = `${dateStr}: ${score} Amalan`;
        }
        grid.appendChild(cell);
    }

    monthWrapper.appendChild(grid);
    gridContainer.appendChild(monthWrapper);
}

function updateIslamMotivation(todayData) {
    const textEl = document.getElementById('islam-motivation-text');
    if (!textEl) return;

    let prayerCount = 0;
    if (todayData.prayers.subuh) prayerCount++;
    if (todayData.prayers.dzuhur) prayerCount++;
    if (todayData.prayers.ashar) prayerCount++;
    if (todayData.prayers.maghrib) prayerCount++;
    if (todayData.prayers.isya) prayerCount++;

    const quotes = [
        "Jadikan setiap sujudmu hari ini sebagai bukti syukur terdalam.",
        "Dunia ini sementara. Amal jariyah dan ketulusan ibadah adalah bekal yang kekal.",
        "Meskipun hati berat, paksakanlah melangkah ke sajadah. Allah menunggu aduanmu.",
        "Lillahi Ta'ala. Jangan ubah niatmu, lakukan amalan kecil sekalipun hanya untuk-Nya.",
        "Surah Al-Waqi'ah dan Sedekah Subuh adalah kombinasi luar biasa membuka pintu kebaikan hari ini."
    ];

    let message = "";
    if (prayerCount === 5) {
        message = "Masyaallah, 5 waktu telah dijaga dengan baik! Semoga istiqomah. 🌟 ";
    } else if (prayerCount > 0) {
        message = `Sudah ${prayerCount} waktu terjaga. Yuk sempurnakan sisa waktunya. 🤲 `;
    } else {
        message = "Menunggu panggilan cinta (Azan) hari ini. Bersiaplah mengabulkannya. ✨ ";
    }

    if (todayData.sedekah && todayData.waqiah) {
        message += " Kombinasi sedekah subuh dan Al-Waqi'ah hari ini sungguh luar biasa, insyaallah berkah!";
    }

    // fallback to random quote if too short
    if (message.length < 50) {
        message += " " + quotes[Math.floor(Math.random() * quotes.length)];
    }

    textEl.innerHTML = `<strong>Status Hari Ini:</strong> ${message}`;
}

// ===== AI ANALYSIS FUNCTION (GEMINI) =====
async function analyzeIslamicTracking() {
    const resultDiv = document.getElementById('islam-ai-result');
    if (!resultDiv) return;

    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) {
        alert('API key Gemini belum diatur. Silakan masukkan di Pengaturan terlebih dahulu.');
        return;
    }

    // Show loading
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div class="loading-spinner" style="display: inline-block; margin-bottom: 10px;"></div>
            <p class="text-muted">Menganalisis pola ibadah 7 hari terakhir dengan AI...</p>
        </div>
    `;

    // Collect last 7 days of data
    const allTracks = getIslamicTracks();
    const today = new Date();
    let weekSummary = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${day}`;
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const dayName = dayNames[d.getDay()];

        const track = allTracks[dateStr];
        if (track) {
            const prayers = track.prayers || {};
            const prayerCount = [prayers.subuh, prayers.dzuhur, prayers.ashar, prayers.maghrib, prayers.isya].filter(Boolean).length;
            weekSummary.push(`${dayName} (${dateStr}): Salat ${prayerCount}/5 (Subuh:${prayers.subuh ? 'Ya' : 'Tidak'}, Dzuhur:${prayers.dzuhur ? 'Ya' : 'Tidak'}, Ashar:${prayers.ashar ? 'Ya' : 'Tidak'}, Maghrib:${prayers.maghrib ? 'Ya' : 'Tidak'}, Isya:${prayers.isya ? 'Ya' : 'Tidak'}), Qobliyah Subuh:${track.qobliyah ? 'Ya' : 'Tidak'}, Sedekah:${track.sedekah ? 'Ya' : 'Tidak'}, Al-Waqi\'ah:${track.waqiah ? 'Ya' : 'Tidak'}, Puasa:${track.fasting ? 'Ya' : 'Tidak'}, Zikir:${track.dhikrCount || 0}x, Quran: ${track.quranText || '-'}`);
        } else {
            weekSummary.push(`${dayName} (${dateStr}): Tidak ada data tercatat.`);
        }
    }

    const dataText = weekSummary.join('\n');

    const prompt = `Kamu adalah seorang USTADZ AI yang bijaksana, lembut, dan penuh hikmah. Tugasmu adalah menganalisis rekam jejak ibadah harian seorang muslim selama 7 hari terakhir.

Berikut data ibadahnya:
${dataText}

Berikan analisis dalam format berikut (dalam Bahasa Indonesia):
1. **Ringkasan Umum (2-3 kalimat):** Evaluasi singkat tren ibadah minggu ini secara keseluruhan.
2. **Kelebihan:** Sebutkan 1-2 kebiasaan baik yang sudah konsisten terjaga (jika ada).
3. **Area Perbaikan:** Sebutkan 1-2 waktu salat/amalan yang paling sering terlewatkan dan berikan motivasi Islami singkat untuk memperbaikinya (sertakan dalil Al-Quran atau Hadits pendek jika relevan).
4. **Nasihat Penutup:** Satu kalimat motivasi Islami yang menyentuh hati untuk minggu depan.

ATURAN PENTING:
- Gunakan bahasa Indonesia yang hangat seperti ustadz yang membimbing muridnya.
- Jangan menghakimi, tapi berikan dorongan positif.
- Jika data kosong banyak hari, beri semangat untuk memulai lagi tanpa menyalahkan.
- Format respons sebagai teks biasa yang rapi (BUKAN JSON). Gunakan emoji secukupnya.
- Maksimal 250 kata.`;

    try {
        const requestBody = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024
            }
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Gagal menghubungi Gemini AI.');
        }

        const data = await response.json();
        let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) throw new Error('Respon AI kosong.');

        // Clean markdown formatting
        aiText = aiText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        aiText = aiText.replace(/\n/g, '<br>');

        resultDiv.innerHTML = `
            <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.5rem;">🕌</span>
                <strong style="font-size: 1.1rem;">Evaluasi Ibadah Mingguan</strong>
            </div>
            <div style="font-size: 0.95rem; line-height: 1.7; color: var(--text);">${aiText}</div>
            <div style="text-align: right; margin-top: 12px;">
                <small class="text-muted">Dianalisis oleh Gemini AI • ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
            </div>
        `;

        // Award XP for self-reflection
        if (typeof addXP === 'function') addXP(10, 'Islamic AI Analysis completed');

    } catch (error) {
        console.error('Islam AI Analysis Error:', error);
        resultDiv.innerHTML = `
            <div style="text-align: center; padding: 15px; color: var(--danger);">
                <p><strong>⚠️ Gagal Menganalisis</strong></p>
                <p style="font-size: 0.9rem;">${error.message}</p>
                <p class="text-muted" style="font-size: 0.85rem; margin-top: 8px;">Pastikan API Key Gemini sudah benar dan koneksi internet aktif.</p>
            </div>
        `;
    }
}
