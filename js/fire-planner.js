// ===== FIRE (Financial Independence, Retire Early) Planner =====

let fireChartInstance = null;
let currentTotalBalance = 0;

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-fire-planner-btn');
    const closeBtn = document.getElementById('close-fire-planner');
    const modal = document.getElementById('fire-planner-modal');
    const calcBtn = document.getElementById('fire-calculate-btn');

    if (openBtn && modal) {
        openBtn.addEventListener('click', async () => {
            modal.classList.remove('hidden');
            await initFirePlanner();
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Menutup modal jika klik di luar area modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateFireProgression);
    }

    // Load Islamic Finance Tip
    loadDailyIslamicTip();
});

const ISLAMIC_FINANCE_TIPS = [
    '"Jauhi paylater jika bukan keadaan darurat nyawa. Berhutang untuk gaya hidup (wants) adalah pintu gerbang menuju hilangnya keberkahan rezeki."',
    '"Sedekah subuh tidak akan mengurangi hartamu. Justru ia adalah investasi terbaik dengan return tak terhingga dari Sang Maha Pemberi Rezeki."',
    '"Sebelum membeli barang mahal, tanyakan pada diri sendiri: Apakah ini Needs (kebutuhan) atau sekadar Wants (keinginan/gengsi)? Qana\'ah adalah kekayaan sejati."',
    '"Diversifikasi itu penting, tapi pastikan instrumen investasi Anda halal. Tinggalkan yang syubhat, apalagi yang jelas-jelas riba."',
    '"Uang yang Anda investasikan di saham syariah atau reksa dana syariah adalah ikhtiar menjemput rezeki. Tapi ingat, rezeki tetap di tangan Allah, bukan di tangan market."',
    '"Jangan pernah meremehkan utang sekecil apapun. Utang yang tidak dibayar akan menjadi penghalang di akhirat kelak. Lunasi sebelum berinvestasi."',
    '"Financial Freedom dalam Islam bukan berarti menumpuk harta tanpa batas, melainkan bebas dari utang dan memiliki cukup untuk beribadah dengan tenang tanpa pusing memikirkan dunia."',
    '"Setiap rupiah yang Anda belanjakan untuk menafkahi keluarga adalah sedekah yang paling utama nilainya di sisi Allah."',
    '"Jika portofolio investasi sedang merah, bersabarlah. Rizki sudah tertakar dan tak akan tertukar. Kepanikan seringkali membawa pada keputusan finansial yang buruk."',
    '"Zakat bukan sekadar kewajiban, ia adalah pembersih hartamu. Harta yang bersih akan tumbuh (berkembang) dan membawa ketenangan jiwa."',
    '"Merasa cukup (Qana\'ah) dengan apa yang ada hari ini adalah wujud syukur terbaik. Jangan membandingkan perjalanan finansial Anda dengan orang lain di media sosial."',
    '"Investasi leher ke atas (belajar agama dan ilmu keuangan) adalah investasi yang tidak akan pernah terkena inflasi."',
    '"Hidup hemat bukan berarti pelit. Hemat adalah menempatkan harta sesuai porsinya, pelit adalah menahan harta dari haknya (seperti menahan zakat/sedekah)."',
    '"Jika tergiur investasi bodong dengan return tak masuk akal, ingatlah: Dalam Islam, keuntungan (profit) selalu beriringan dengan risiko kerugian (Al-Ghunm bil Ghurm)."'
];

function loadDailyIslamicTip() {
    const tipEl = document.getElementById('islamic-finance-tip');
    if (!tipEl) return;
    
    // Gunakan tanggal hari ini (Day of Year) untuk merotasi tip agar setiap hari berbeda
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const tipIndex = dayOfYear % ISLAMIC_FINANCE_TIPS.length;
    tipEl.innerText = ISLAMIC_FINANCE_TIPS[tipIndex];
}


async function initFirePlanner() {
    // 1. Ambil Total Saldo dari seluruh dompet
    try {
        if (typeof idbGetAll === 'function') {
            const wallets = await idbGetAll('wallets');
            currentTotalBalance = wallets.reduce((sum, w) => sum + (Number(w.balance) || 0), 0);
        } else {
            console.warn("Fungsi idbGetAll tidak ditemukan, saldo diset 0.");
            currentTotalBalance = 0;
        }
        document.getElementById('fire-current-balance').innerText = `Rp ${currentTotalBalance.toLocaleString('id-ID')}`;
    } catch (e) {
        console.error("Gagal memuat saldo untuk FIRE Planner:", e);
        currentTotalBalance = 0;
    }
}

function calculateFireProgression() {
    const targetMonthlyExpense = parseFloat(document.getElementById('fire-target-expense').value) || 0;
    const monthlyInvestment = parseFloat(document.getElementById('fire-monthly-investment').value) || 0;
    const annualReturnRate = parseFloat(document.getElementById('fire-return-rate').value) || 8;
    const swr = parseFloat(document.getElementById('fire-swr').value) || 4;

    // Validasi input
    if (targetMonthlyExpense <= 0) {
        alert("Target pengeluaran bulanan harus lebih dari 0");
        return;
    }

    // Hitung FIRE Number: Pengeluaran Tahunan / (SWR / 100)
    const annualExpense = targetMonthlyExpense * 12;
    const fireNumber = annualExpense / (swr / 100);

    // Tampilkan FIRE Number
    document.getElementById('fire-target-number').innerText = `Rp ${Math.round(fireNumber).toLocaleString('id-ID')}`;

    // Simulasi Compound Interest
    let currentWorth = currentTotalBalance;
    const monthlyReturnRate = annualReturnRate / 100 / 12;
    
    let months = 0;
    const maxMonths = 60 * 12; // Simulasi maksimal 60 tahun untuk mencegah infinite loop

    let yearlyData = [currentWorth]; // Mulai pada Tahun 0

    while (currentWorth < fireNumber && months < maxMonths) {
        // Tambahkan return investasi bulan ini
        currentWorth += currentWorth * monthlyReturnRate;
        // Tambahkan investasi rutin bulanan
        currentWorth += monthlyInvestment;
        months++;

        // Simpan data setiap kelipatan 12 bulan (1 tahun)
        if (months % 12 === 0) {
            yearlyData.push(currentWorth);
        }
    }

    // Jika tercapai di tengah tahun, masukkan juga nilai akhirnya
    if (months % 12 !== 0 && currentWorth >= fireNumber) {
        yearlyData.push(currentWorth);
    }

    const years = (months / 12).toFixed(1);
    
    const resultText = document.getElementById('fire-years-result');
    if (months >= maxMonths) {
        resultText.innerText = "Sangat Sulit: Target FIRE terlalu tinggi atau investasi terlalu kecil (Lebih dari 60 tahun).";
        resultText.style.color = "#ef4444"; // Red for warning
    } else {
        resultText.innerText = `🔥 Kebebasan finansial dapat dicapai dalam: ${years} Tahun`;
        resultText.style.color = "#10b981"; // Emerald green for success
    }

    // Tampilkan section hasil
    document.getElementById('fire-result-section').classList.remove('hidden');

    // Render grafik
    renderFireChart(yearlyData, fireNumber);
}

function renderFireChart(data, targetFire) {
    const ctx = document.getElementById('fire-chart');
    if (!ctx) return;

    if (fireChartInstance) {
        fireChartInstance.destroy();
    }

    const labels = data.map((_, i) => `Tahun ${i}`);
    const targetLine = data.map(() => targetFire);

    fireChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Proyeksi Net Worth',
                    data: data,
                    borderColor: '#10b981', // Emerald
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#10b981',
                    pointRadius: 2
                },
                {
                    label: 'Target FIRE',
                    data: targetLine,
                    borderColor: '#f59e0b', // Amber
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'Inter, sans-serif' } }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += 'Rp ' + Math.round(context.parsed.y).toLocaleString('id-ID');
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        callback: function(value) {
                            if (value >= 1000000000) return 'Rp ' + (value / 1000000000).toFixed(1) + ' M';
                            if (value >= 1000000) return 'Rp ' + (value / 1000000).toFixed(1) + ' Jt';
                            return value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        maxTicksLimit: 10
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}
