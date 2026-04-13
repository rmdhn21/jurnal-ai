// ===== HSE TREND ANALYTICS LOGIC (20 DAYS) =====

let hseTrendChart = null;

/**
 * Initialize the HSE Trend Chart
 */
async function initHSETrendChart() {
    const ctx = document.getElementById('hse-trend-chart');
    if (!ctx) return;

    const ANALYTICS_KEY = 'hse_report_analytics';
    let rawData = [];
    try {
        const stored = localStorage.getItem(ANALYTICS_KEY);
        rawData = stored ? JSON.parse(stored) : [];
    } catch (e) { rawData = []; }

    const chartData = processHSEDataFor20Days(rawData);

    if (hseTrendChart) {
        hseTrendChart.destroy();
    }

    hseTrendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Reports Generated',
                    data: chartData.values,
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 4
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
                            return `${context.raw} Dokumen Selesai`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        stepSize: 1,
                        font: { size: 10 }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    ticks: {
                        color: '#94a3b8',
                        font: { size: 9 },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { display: false }
                }
            }
        }
    });
}

/**
 * Process raw telemetry into 20-day bins
 */
function processHSEDataFor20Days(rawData) {
    const labels = [];
    const values = [];
    const now = new Date();

    for (let i = 19; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        
        const dateStr = d.toISOString().split('T')[0];
        
        // Label format: "14 Apr"
        labels.push(d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));

        // Count items for this date
        const count = rawData.filter(item => {
            const itemDate = item.timestamp.split('T')[0];
            return itemDate === dateStr;
        }).length;

        values.push(count);
    }

    return { labels, values };
}

// Global exposure
window.initHSETrendChart = initHSETrendChart;
