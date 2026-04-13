/**
 * LIFE BALANCE RADAR MODULE
 * Calculates and visualizes performance across 5 life domains.
 */

window.lifeBalance = {
    chart: null,

    init: async function() {
        const metrics = await this.calculateMetrics();
        this.renderChart(metrics);
    },

    calculateMetrics: async function() {
        // 1. Finance (Income vs Expense Ratio + Budget vs Spending)
        const transactions = await getTransactions();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentTrans = transactions.filter(t => new Date(t.date) >= sevenDaysAgo);
        const income = recentTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = recentTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        // Simple score: 100 if income >= expense, else percentage
        let financeScore = income > 0 ? Math.min(100, (income / (expense || 1)) * 50 + 50) : (expense > 0 ? 30 : 50);
        if (expense === 0 && income === 0) financeScore = 50;

        // 2. Productivity (Tasks completion rate)
        const tasks = await getTasks();
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const prodScore = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

        // 3. Spiritual (Salah tracking consistency)
        const islamicTracks = await getIslamicTracks();
        let prayerCount = 0;
        let totalPrayersExpected = 0;
        
        // Check last 7 days including today
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const track = islamicTracks[dateStr];
            
            if (track && track.prayers) {
                Object.values(track.prayers).forEach(v => { if (v) prayerCount++; });
            }
            totalPrayersExpected += 5;
        }
        const spiritualScore = Math.round((prayerCount / totalPrayersExpected) * 100);

        // 4. Learning (Average Mastery Progress)
        let learningScore = 0;
        if (window.masteryDashboard) {
            const totalProgress = window.masteryDashboard.modules.reduce((sum, mod) => {
                return sum + window.masteryDashboard.calculateProgress(mod);
            }, 0);
            learningScore = Math.round(totalProgress / window.masteryDashboard.modules.length);
        }

        // 5. Habits (Weekly Consistency)
        const habits = await getHabits();
        let habitCompletions = 0;
        let totalHabitSlots = habits.length * 7;
        
        habits.forEach(h => {
             if (h.completions) {
                 for (let i = 0; i < 7; i++) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    if (h.completions[dateStr]) habitCompletions++;
                 }
             }
        });
        const habitScore = totalHabitSlots > 0 ? Math.round((habitCompletions / totalHabitSlots) * 100) : 0;

        return [financeScore, prodScore, spiritualScore, learningScore, habitScore];
    },

    renderChart: function(data) {
        const ctx = document.getElementById('life-balance-chart');
        if (!ctx) return;

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Finance', 'Produktivitas', 'Spiritual', 'Learning', 'Habits'],
                datasets: [{
                    label: 'Life Balance Index',
                    data: data,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 0.8)',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: {
                            color: '#94a3b8',
                            font: { size: 10, weight: 'bold' }
                        },
                        ticks: {
                            display: false,
                            stepSize: 20
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
};
