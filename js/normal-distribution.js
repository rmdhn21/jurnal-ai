// ============================================
// NORMAL DISTRIBUTION ANALYSIS MODULE
// ============================================

let normalDistChartInstance = null;
let currentStatsVar = 'mood';

// Statistics Calculation Helpers
function calcMean(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function calcStdDev(arr, mean) {
    if (arr.length <= 1) return 0;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
}

function calcSkewness(arr, mean, std) {
    if (arr.length < 3 || std === 0) return 0;
    const n = arr.length;
    const sum3 = arr.reduce((sum, val) => sum + Math.pow(val - mean, 3), 0);
    const s3 = Math.pow(std, 3);
    // Unbiased sample skewness (equivalent to Excel's SKEW)
    const val = (n * sum3) / ((n - 1) * (n - 2) * s3);
    return isNaN(val) ? 0 : val;
}

function calcKurtosis(arr, mean, std) {
    if (arr.length < 4 || std === 0) return 0;
    const n = arr.length;
    const sum4 = arr.reduce((sum, val) => sum + Math.pow(val - mean, 4), 0);
    const s4 = Math.pow(std, 4);
    // Unbiased sample excess kurtosis (equivalent to Excel's KURT)
    const term1 = (n * (n + 1) * sum4) / ((n - 1) * (n - 2) * (n - 3) * s4);
    const term2 = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    const val = term1 - term2;
    return isNaN(val) ? 0 : val;
}

// Gauss Error Function (erf) approximation (A&S formula 7.1.26)
function erf(x) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = (x < 0) ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

// Normal Cumulative Distribution Function (CDF)
function normalCDF(x, mean, std) {
    if (std === 0) return x >= mean ? 1.0 : 0.0;
    return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
}

// Normal Probability Density Function (PDF)
function normalPDF(x, mean, std) {
    if (std === 0) return 0;
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(std, 2));
    return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

// Format currency
function formatIDRCurrency(val) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

// Fetch and Prepare Data
async function loadVariableData(varType) {
    let rawData = [];
    let title = '';
    let minVal = 1;
    let maxVal = 5;
    let step = 0.1;
    let unit = '';
    let latestValue = 3;

    // Default mock backups for cold starts
    const backupMoods = [4, 4, 3, 5, 4, 3, 2, 4, 4, 5, 3, 4, 5, 4, 3, 4, 4, 5, 3, 4];
    const backupHabits = [6, 5, 8, 4, 7, 5, 6, 9, 3, 5, 6, 8, 4, 7, 6, 5, 8, 7, 6, 5];
    const backupExpenses = [45000, 75000, 120000, 55000, 80000, 65000, 250000, 40000, 95000, 70000, 110000, 60000, 85000, 150000, 50000, 75000, 90000, 130000, 45000, 80000];

    if (varType === 'mood') {
        title = 'Mood Harian';
        minVal = 1;
        maxVal = 5;
        step = 0.1;
        unit = 'Skala';
        
        try {
            const journals = await idbGetAll('journals');
            const moodMap = { 'great': 5, 'good': 4, 'neutral': 3, 'bad': 2, 'terrible': 1 };
            
            rawData = journals
                .map(j => moodMap[j.mood])
                .filter(val => val !== undefined && val !== null);
            
            if (rawData.length > 0) {
                latestValue = rawData[rawData.length - 1];
            } else {
                latestValue = 4;
            }
        } catch (e) {
            console.warn('Failed to load journals database, using backup moods', e);
        }

        // Bayesian smoothing / fallback if data is too sparse
        if (rawData.length < 3) {
            rawData = [...rawData, ...backupMoods.slice(0, 20 - rawData.length)];
        }
    } 
    else if (varType === 'habits') {
        title = 'Kebiasaan Anti-Kortisol';
        minVal = 0;
        maxVal = 12;
        step = 1;
        unit = 'Habit';

        try {
            const saved = localStorage.getItem('jurnal_ai_cortisol_v1');
            if (saved) {
                const state = JSON.parse(saved);
                const historyScores = (state.history || []).map(h => h.score || 0);
                const todayScore = (state.completedToday || []).length;
                
                rawData = [...historyScores];
                if (todayScore > 0) rawData.push(todayScore);
                latestValue = todayScore || (rawData.length > 0 ? rawData[rawData.length - 1] : 5);
            }
        } catch (e) {
            console.warn('Failed to load habits state, using backup habits', e);
        }

        if (rawData.length < 3) {
            rawData = [...rawData, ...backupHabits.slice(0, 20 - rawData.length)];
            latestValue = latestValue || 6;
        }
    } 
    else if (varType === 'finance') {
        title = 'Pengeluaran Harian';
        unit = 'Rp';
        
        try {
            const transactions = await idbGetAll('transactions');
            const expenses = transactions.filter(t => t.type === 'expense');
            
            // Group by date
            const grouped = {};
            expenses.forEach(t => {
                const d = t.date || new Date(t.createdAt).toISOString().split('T')[0];
                grouped[d] = (grouped[d] || 0) + Number(t.amount);
            });
            
            // Sort by date chronologically so latestValue is truly the most recent day
            const sortedDates = Object.keys(grouped).sort();
            rawData = sortedDates.map(d => grouped[d]);
            if (rawData.length > 0) {
                latestValue = rawData[rawData.length - 1];
            } else {
                latestValue = 75000;
            }
        } catch (e) {
            console.warn('Failed to load finance transactions, using backup expenses', e);
        }

        if (rawData.length < 3) {
            rawData = [...rawData, ...backupExpenses.slice(0, 20 - rawData.length)];
        }

        // Calculate dynamic finance boundaries
        const meanTmp = calcMean(rawData);
        const stdTmp = Math.max(10000, calcStdDev(rawData, meanTmp));
        minVal = Math.max(0, Math.round((meanTmp - 3.5 * stdTmp) / 1000) * 1000);
        maxVal = Math.round((meanTmp + 3.5 * stdTmp) / 1000) * 1000;
        step = 5000;
    } 
    else if (varType === 'tkd') {
        title = 'Ujian Simulasi TKD BUMN';
        minVal = 0;
        maxVal = 100;
        step = 1;
        unit = 'Skor';

        // Load user's actual TKD progress
        let accuracy = 0.70; // default 70% accuracy
        try {
            const saved = localStorage.getItem('jurnal_ai_tkd_answers');
            if (saved) {
                const answers = JSON.parse(saved);
                const total = Object.keys(answers).length;
                if (total > 0 && typeof dbTkd !== 'undefined') {
                    let correct = 0;
                    dbTkd.forEach(q => {
                        if (answers[q.id] === q.a) correct++;
                    });
                    // Bayesian blend to prevent extreme variances
                    accuracy = (correct + 7) / (total + 10);
                }
            }
        } catch (e) {
            console.warn('Failed to parse TKD answers, using default accuracy', e);
        }

        latestValue = Math.round(accuracy * 100);
        
        // national population simulation parameters
        // Mean = 65, StdDev = 12
        rawData = [];
        const meanPop = 65;
        const stdPop = 12;
        // Seeded PRNG (mulberry32) for deterministic population generation
        // This prevents stats from fluctuating on every page load
        function seededRandom(seed) {
            return function() {
                seed |= 0; seed = seed + 0x6D2B79F5 | 0;
                let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                return ((t ^ t >>> 14) >>> 0) / 4294967296;
            };
        }
        const rng = seededRandom(42);
        // Box-Muller transform with seeded RNG for stable population data
        for (let i = 0; i < 200; i++) {
            let u1 = rng();
            let u2 = rng();
            if (u1 === 0) u1 = 0.0001; // prevent log(0)
            const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            let val = Math.round(meanPop + z * stdPop);
            val = Math.max(0, Math.min(100, val));
            rawData.push(val);
        }
    }

    return { rawData, title, minVal, maxVal, step, unit, latestValue };
}

// Render normal curve and point on Chart.js
function drawNormalCurve(mean, std, userVal, minVal, maxVal, unit, varType) {
    const canvas = document.getElementById('normal-dist-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Generate bell curve data points
    const points = [];
    const chartMin = mean - 3.5 * std;
    const chartMax = mean + 3.5 * std;
    const stepSize = (chartMax - chartMin) / 80;

    for (let x = chartMin; x <= chartMax; x += stepSize) {
        points.push({ x: x, y: normalPDF(x, mean, std) });
    }

    // Prepare vertical line representing user value
    const maxPDF = normalPDF(mean, mean, std);
    const userPDF = normalPDF(userVal, mean, std);
    const verticalLineData = [
        { x: userVal, y: 0 },
        { x: userVal, y: userPDF }
    ];

    if (normalDistChartInstance) {
        normalDistChartInstance.destroy();
    }

    // Create Canvas Gradient Fill for standard deviation regions
    const getGradient = (chart) => {
        const {ctx, chartArea} = chart;
        if (!chartArea) return null;
        
        const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
        
        // Translate statistical boundaries (mean +/- 1sd, mean +/- 2sd) to gradient stops [0, 1]
        const getStop = (val) => {
            const stop = (val - chartMin) / (chartMax - chartMin);
            return Math.max(0, Math.min(1, stop));
        };

        const stopMinus2 = getStop(mean - 2 * std);
        const stopMinus1 = getStop(mean - 1 * std);
        const stopPlus1  = getStop(mean + 1 * std);
        const stopPlus2  = getStop(mean + 2 * std);

        // Region 1: Extreme Low (Outlier) - Red
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.08)');
        gradient.addColorStop(stopMinus2, 'rgba(239, 68, 68, 0.08)');
        
        // Region 2: Volatile Low - Yellow
        gradient.addColorStop(stopMinus2, 'rgba(251, 191, 36, 0.08)');
        gradient.addColorStop(stopMinus1, 'rgba(251, 191, 36, 0.08)');
        
        // Region 3: Stable (Normal Range) - Blue/Green
        gradient.addColorStop(stopMinus1, 'rgba(16, 185, 129, 0.15)');
        gradient.addColorStop(stopPlus1, 'rgba(16, 185, 129, 0.15)');
        
        // Region 4: Volatile High - Yellow
        gradient.addColorStop(stopPlus1, 'rgba(251, 191, 36, 0.08)');
        gradient.addColorStop(stopPlus2, 'rgba(251, 191, 36, 0.08)');
        
        // Region 5: Extreme High (Outlier) - Red
        gradient.addColorStop(stopPlus2, 'rgba(239, 68, 68, 0.08)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.08)');

        return gradient;
    };

    normalDistChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Kurva Distribusi Normal',
                    data: points,
                    borderColor: 'rgba(139, 92, 246, 0.8)',
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: function(context) {
                        const chart = context.chart;
                        return getGradient(chart);
                    }
                },
                {
                    label: 'Posisi Nilai',
                    data: verticalLineData,
                    borderColor: '#f43f5e',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: function(context) {
                        // Only show dot marker at the top of the dashed line
                        return context.dataIndex === 1 ? 8 : 0;
                    },
                    pointHoverRadius: 10,
                    pointBackgroundColor: '#f43f5e',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    fill: false,
                    showLine: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const valX = context.raw.x;
                            const formattedX = varType === 'finance' ? formatIDRCurrency(valX) : valX.toFixed(2);
                            if (context.datasetIndex === 0) {
                                return `Probabilitas Kerapatan di ${formattedX}`;
                            } else {
                                return `Nilai Anda: ${formattedX}`;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: {
                        color: '#a0a0b0',
                        font: { size: 10 },
                        callback: function(value) {
                            if (varType === 'finance') {
                                return value >= 1000000 
                                    ? (value / 1000000).toFixed(1) + 'M' 
                                    : (value / 1000).toFixed(0) + 'k';
                            }
                            return value.toFixed(1);
                        }
                    }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { display: false } // Probability density values are illustrative
                }
            }
        }
    });
}

// Update simulation output
function updateSimulationOutput(val, mean, std, unit, varType) {
    const zScore = (val - mean) / std;
    const percentile = normalCDF(val, mean, std) * 100;
    
    // Update labels in UI
    document.getElementById('stats-slider-value-display').innerText = varType === 'finance' ? formatIDRCurrency(val) : `${val.toFixed(1)} ${unit}`;
    document.getElementById('stats-sim-z').innerText = (zScore > 0 ? '+' : '') + zScore.toFixed(2);
    document.getElementById('stats-sim-percentile').innerText = percentile.toFixed(1) + '%';

    const statusEl = document.getElementById('stats-sim-status');
    
    // Status text & colors based on Z-Score
    if (zScore < -2) {
        statusEl.innerText = 'Ekstrim Rendah (Anomali)';
        statusEl.style.color = '#ef4444'; // Red
    } else if (zScore < -1) {
        statusEl.innerText = 'Rendah (Volatil)';
        statusEl.style.color = '#fbbf24'; // Yellow
    } else if (zScore <= 1) {
        statusEl.innerText = 'Normal (Wajar)';
        statusEl.style.color = '#10b981'; // Green
    } else if (zScore <= 2) {
        statusEl.innerText = 'Tinggi (Volatil)';
        statusEl.style.color = '#fbbf24'; // Yellow
    } else {
        statusEl.innerText = 'Ekstrim Tinggi (Anomali)';
        statusEl.style.color = '#ef4444'; // Red
    }

    // Update vertical line in Chart.js
    if (normalDistChartInstance && normalDistChartInstance.data.datasets.length > 1) {
        const userPDF = normalPDF(val, mean, std);
        normalDistChartInstance.data.datasets[1].data = [
            { x: val, y: 0 },
            { x: val, y: userPDF }
        ];
        normalDistChartInstance.update('none'); // silent update
    }
}

// Generate statistical insights
function generateStatisticalInsights(mean, std, skew, kurt, latestVal, varType) {
    const container = document.getElementById('stats-insights-container');
    if (!container) return;

    let html = '';
    const zScore = (latestVal - mean) / std;
    const percentile = normalCDF(latestVal, mean, std) * 100;
    const zFormatted = (zScore > 0 ? '+' : '') + zScore.toFixed(2);

    let skewDesc = '';
    if (Math.abs(skew) < 0.5) skewDesc = 'relatif simetris (seimbang)';
    else if (skew > 0) skewDesc = 'condong positif (menceng kanan, mayoritas nilai berada di bawah rata-rata)';
    else skewDesc = 'condong negatif (menceng kiri, mayoritas nilai berada di atas rata-rata)';

    let kurtDesc = '';
    if (Math.abs(kurt) < 0.5) kurtDesc = 'Mesokurtik — distribusi wajar (mendekati kurva normal standar)';
    else if (kurt > 0) kurtDesc = 'Leptokurtik — pola data memiliki puncak yang tajam (cenderung berulang di nilai tengah) dengan ekor tebal yang berarti berisiko munculnya outlier/anomali ekstrim';
    else kurtDesc = 'Platykurtik — pola data tersebar merata (puncak lebih datar), yang menandakan nilai sering berfluktuasi secara luas ke berbagai arah tanpa titik dominan';

    if (varType === 'mood') {
        html = `
            <p><strong>Analisis Kestabilan Emosi:</strong></p>
            <ul>
                <li><strong>Rata-rata Mood Anda:</strong> ${mean.toFixed(2)} dari 5 (Skala Mood). Secara umum, emosi Anda berada pada kondisi <strong>${mean >= 4 ? 'Positif & Bahagia' : mean >= 3 ? 'Stabil & Normal' : 'Perlu Refreshing'}</strong>.</li>
                <li><strong>Deviasi Standar (&sigma; = ${std.toFixed(2)}):</strong> Menunjukkan volatilitas emosi. Standar deviasi yang <strong>${std < 0.6 ? 'kecil (< 0.6) menandakan mental Anda sangat stabil dan terkendali (Stoik)' : 'besar (&ge; 0.6) menunjukkan suasana hati Anda fluktuatif'}</strong>.</li>
                <li><strong>Kemencengan (Skewness = ${skew.toFixed(2)}):</strong> Data Anda ${skewDesc}.</li>
                <li><strong>Keruncingan (Kurtosis = ${kurt.toFixed(2)}):</strong> ${kurtDesc}.</li>
                <li><strong>Posisi Hari Ini (Nilai: ${latestVal}):</strong> Z-Score Anda adalah <strong>${zFormatted}</strong>, menempatkan Anda di <strong>persentil ${percentile.toFixed(1)}%</strong>. Ini berarti kondisi mental Anda hari ini lebih baik dari ${percentile.toFixed(0)}% hari-hari Anda yang lain.</li>
            </ul>
            <div style="margin-top: 10px; padding: 10px; background: rgba(139, 92, 246, 0.05); border-left: 3px solid #8b5cf6; border-radius: 4px;">
                <strong>🧠 Rekomendasi Stoik AI:</strong> ${zScore < -1 
                    ? 'Mood Anda saat ini terdeteksi sebagai outlier bawah. Ambil waktu jeda 10 menit untuk melatih nafas 4-7-8 atau membaca jurnal filsafat.' 
                    : 'Pertahankan momentum positif ini. Bagikan kebahagiaan Anda kepada orang terdekat.'}
            </div>
        `;
    } 
    else if (varType === 'habits') {
        // Probability of bad day (habits completed < 3)
        const probBadDay = normalCDF(2.5, mean, std) * 100;

        html = `
            <p><strong>Analisis Kedisiplinan Sirkadian & Anti-Kortisol:</strong></p>
            <ul>
                <li><strong>Rata-rata Kebiasaan Harian:</strong> Anda menyelesaikan rata-rata <strong>${mean.toFixed(1)} kebiasaan</strong> per hari dari 12 target kebiasaan anti-stres.</li>
                <li><strong>Konsistensi (&sigma; = ${std.toFixed(2)}):</strong> Standar deviasi ${std < 1.5 ? 'kecil menunjukkan Anda sangat disiplin dalam memelihara sirkadian tubuh' : 'besar menandakan fluktuasi kedisiplinan yang tinggi antara hari aktif dan malas'}.</li>
                <li><strong>Bentuk Sebaran (Kurtosis = ${kurt.toFixed(2)}):</strong> ${kurtDesc}.</li>
                <li><strong>Risiko Burnout Berdasarkan Model Gauss:</strong> Berdasarkan parameter sebaran Anda, probabilitas Anda menyelesaikan kurang dari 3 kebiasaan (zona stres tinggi) pada hari acak adalah sebesar <strong>${probBadDay.toFixed(1)}%</strong>.</li>
                <li><strong>Pencapaian Hari Ini (${latestVal} kebiasaan):</strong> Berada pada Z-Score <strong>${zFormatted}</strong> (persentil ${percentile.toFixed(1)}%).</li>
            </ul>
            <div style="margin-top: 10px; padding: 10px; background: rgba(6, 182, 212, 0.05); border-left: 3px solid #06b6d4; border-radius: 4px;">
                <strong>🔬 Insights Fisiologis:</strong> Dengan rata-rata ${mean.toFixed(1)} kebiasaan, sistem saraf otonom Anda berada dalam kondisi regulasi yang ${mean >= 5 ? 'baik untuk melawan hormon kortisol' : 'kurang optimal. Coba prioritaskan tidur 7-8 jam dan bangun sebelum subuh'}.
            </div>
        `;
    } 
    else if (varType === 'finance') {
        const limitUpper = mean + 2 * std;
        const limitLower = Math.max(0, mean - 2 * std);

        html = `
            <p><strong>Analisis Volatilitas Arus Kas Harian:</strong></p>
            <ul>
                <li><strong>Rata-rata Pengeluaran:</strong> Anda membelanjakan rata-rata <strong>${formatIDRCurrency(mean)}</strong> per hari.</li>
                <li><strong>Volatilitas (&sigma; = ${formatIDRCurrency(std)}):</strong> Rentang deviasi ini menunjukkan tingkat variabilitas belanja Anda. Semakin besar angkanya, semakin tinggi kecenderungan belanja impulsif tak terduga.</li>
                <li><strong>Profil Distribusi (Kurtosis = ${kurt.toFixed(2)}):</strong> ${kurtDesc}.</li>
                <li><strong>Batas Outlier Boros (+2&sigma;):</strong> Pengeluaran di atas <strong>${formatIDRCurrency(limitUpper)}</strong> dikategorikan sebagai anomali boros (hanya terjadi < 2.5% waktu). Zona hemat berada di bawah <strong>${formatIDRCurrency(limitLower)}</strong>.</li>
                <li><strong>Pengeluaran Terakhir (${formatIDRCurrency(latestVal)}):</strong> Memiliki Z-Score <strong>${zFormatted}</strong> (persentil ${percentile.toFixed(1)}%).</li>
            </ul>
            <div style="margin-top: 10px; padding: 10px; background: rgba(16, 185, 129, 0.05); border-left: 3px solid #10b981; border-radius: 4px;">
                <strong>💸 Keuangan Sehat:</strong> ${zScore > 2 
                    ? '⚠️ AWAS! Pengeluaran terakhir Anda adalah outlier ekstrim di atas batas +2 standar deviasi. Segera kunci alokasi budget non-primer Anda untuk minggu ini!' 
                    : 'Bagus, pengeluaran terakhir Anda terkontrol di bawah ambang batas volatilitas tinggi.'}
            </div>
        `;
    } 
    else if (varType === 'tkd') {
        html = `
            <p><strong>Prediksi Persentil Kelulusan Rekrutmen Pertamina & BUMN:</strong></p>
            <ul>
                <li><strong>Kinerja Akurasi Anda:</strong> Menjawab kuis dengan tingkat akurasi <strong>${latestVal}%</strong> (skor simulasi ${latestVal}).</li>
                <li><strong>Pemodelan Populasi Calon BUMN:</strong> Nilai rata-rata kompetitor nasional dimodelkan pada rata-rata &mu; = 65 dengan deviasi standar &sigma; = 12.</li>
                <li><strong>Peluang Mengungguli Kompetitor:</strong> Dengan skor ${latestVal}, Z-Score Anda dibandingkan populasi adalah <strong>${zFormatted}</strong>.</li>
                <li><strong>Peringkat Persentil Nasional:</strong> Anda berada di <strong>persentil ${percentile.toFixed(1)}%</strong>. Artinya, kemampuan akademis Anda diestimasi mengungguli <strong>${percentile.toFixed(1)}%</strong> dari total pelamar nasional!</li>
            </ul>
            <div style="margin-top: 10px; padding: 10px; background: rgba(59, 130, 246, 0.05); border-left: 3px solid #3b82f6; border-radius: 4px;">
                <strong>🏆 Status Daya Saing:</strong> ${percentile >= 80 
                    ? '🌟 LUAR BIASA! Anda berada di zona aman kelulusan BUMN (persentil > 80%). Lanjutkan review soal silogisme dan deret bertingkat untuk mengunci skor teratas!' 
                    : 'Akurasi Anda sudah cukup baik, namun persaingan BUMN sangat ketat. Coba naikkan target akurasi kuis hingga > 80% untuk menembus persentil aman.'}
            </div>
        `;
    }

    container.innerHTML = html;
}

// Main Initialization Function Called by Navigation Router
async function initStatsDist() {
    console.log('📐 [Normal Distribution] Module Initializing...');

    // Load active variable config
    const varSelect = document.getElementById('stats-var-select');
    if (varSelect) {
        currentStatsVar = varSelect.value;
    }

    const { rawData, title, minVal, maxVal, step, unit, latestValue } = await loadVariableData(currentStatsVar);

    // Calculate core statistics
    const mean = calcMean(rawData);
    const std = Math.max(0.01, calcStdDev(rawData, mean)); // avoid division by zero
    const skew = calcSkewness(rawData, mean, std);
    const kurt = calcKurtosis(rawData, mean, std);

    // Render summary values in DOM
    document.getElementById('stats-metric-n').innerText = rawData.length;
    document.getElementById('stats-metric-mean').innerText = currentStatsVar === 'finance' ? formatIDRCurrency(mean) : mean.toFixed(2);
    document.getElementById('stats-metric-std').innerText = currentStatsVar === 'finance' ? formatIDRCurrency(std) : std.toFixed(2);
    document.getElementById('stats-metric-skew').innerText = skew.toFixed(2);
    const kurtEl = document.getElementById('stats-metric-kurt');
    if (kurtEl) kurtEl.innerText = kurt.toFixed(2);

    // Setup simulation slider limits
    const slider = document.getElementById('stats-sim-slider');
    if (slider) {
        slider.min = minVal;
        slider.max = maxVal;
        slider.step = step;
        slider.value = latestValue;
        
        // Initial slider values display
        updateSimulationOutput(latestValue, mean, std, unit, currentStatsVar);

        // Remove old event listeners to avoid duplicates
        const newSlider = slider.cloneNode(true);
        slider.parentNode.replaceChild(newSlider, slider);

        newSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            updateSimulationOutput(val, mean, std, unit, currentStatsVar);
        });
    }

    // Render Gauss Bell Curve
    drawNormalCurve(mean, std, latestValue, minVal, maxVal, unit, currentStatsVar);

    // Render automatic narrative insights
    generateStatisticalInsights(mean, std, skew, kurt, latestValue, currentStatsVar);
}

// Bind events on document ready / script execution
document.addEventListener('DOMContentLoaded', () => {
    const varSelect = document.getElementById('stats-var-select');
    if (varSelect) {
        varSelect.addEventListener('change', () => {
            initStatsDist();
        });
    }
});

// Expose functions globally
window.initStatsDist = initStatsDist;
