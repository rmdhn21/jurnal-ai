/**
 * MASTERY HEXAGON DASHBOARD
 * Handles the visual progress tree for all 7 modules.
 */

window.masteryDashboard = {
    modules: [
        { id: 'epls', title: 'English', icon: '🇬🇧', color: '#3b82f6', storage: 'epls_progress', isEpls: true },
        { id: 'physics', title: 'Fisika', icon: '🔬', color: '#7c3aed', storage: 'physics_progress', levels: 5 },
        { id: 'hsse', title: 'HSSE', icon: '🛡️', color: '#10b981', storage: 'hsse_progress', levels: 5 },
        { id: 'automotive', title: 'Mesin', icon: '🔧', color: '#f59e0b', storage: 'auto_progress', levels: 5 },
        { id: 'psychology', title: 'Psikologi', icon: '🧠', color: '#d946ef', storage: 'psy_progress', levels: 5 },
        { id: 'investment', title: 'Investasi', icon: '📈', color: '#059669', storage: 'inv_progress', levels: 5 },
        { id: 'coding', title: 'Coding', icon: '💻', color: '#475569', storage: 'code_progress', levels: 5 },
        { id: 'pertamina', title: 'Pertamina', icon: '⛽', color: '#ef4444', storage: 'ptm_progress', levels: 5 }
    ],

    init: function() {
        this.render();
    },

    render: function() {
        const container = document.getElementById('mastery-hexagon-dashboard');
        if (!container) return;

        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'hexagon-dashboard';

        this.modules.forEach(mod => {
            const progress = this.calculateProgress(mod);
            const isCompleted = progress === 100;

            const node = document.createElement('div');
            node.className = `hexagon-node ${isCompleted ? 'completed' : ''}`;
            node.style.borderColor = mod.color;
            node.onclick = () => window.navigateToSubscreen(mod.id);

            node.innerHTML = `
                <div class="hexagon-icon">${mod.icon}</div>
                <div class="hexagon-title">${mod.title}</div>
                <div class="hexagon-progress">
                    <div class="hexagon-progress-fill" style="width: ${progress}%; background: ${mod.color}; shadow: 0 0 10px ${mod.color};"></div>
                </div>
                <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 5px;">${progress}%</div>
            `;
            grid.appendChild(node);
        });

        container.appendChild(grid);
    },

    calculateProgress: function(mod) {
        // Handle different storage formats
        const data = localStorage.getItem(mod.storage);
        if (!data) return 0;
        
        try {
            const progress = JSON.parse(data);

            if (mod.isEpls) {
                // EPLS progress is { A1: [], A2: [], ... }
                let totalCompleted = 0;
                Object.values(progress).forEach(arr => {
                    if (Array.isArray(arr)) totalCompleted += arr.length;
                });
                return Math.min(100, Math.round((totalCompleted / 122) * 100));
            }
            
            // For other modules, progress is { L1: [topics], L2: [], ... }, some use {L1: true, L2: true}
            let completedCount = 0;
            if (mod.id === 'physics' || mod.id === 'hsse' || mod.id === 'automotive') {
                // New format: { L1: [modIds], L2: [...] }
                Object.values(progress).forEach(levelMods => {
                    if (Array.isArray(levelMods) && levelMods.length > 0) completedCount++;
                });
            } else {
                // Older/Simple format: { L1: true, L2: true }
                Object.values(progress).forEach(val => {
                    if (val === true || (Array.isArray(val) && val.length > 0)) completedCount++;
                });
            }

            return Math.min(100, Math.round((completedCount / mod.levels) * 100));
        } catch (e) {
            console.warn(`Error calculating progress for ${mod.id}:`, e);
            return 0;
        }
    }
};

// Auto-init when dashboard is shown
document.addEventListener('DOMContentLoaded', () => {
    // Initial check in case we start on learning-hub
    const activeScreen = document.querySelector('.screen:not(.hidden)');
    if (activeScreen && activeScreen.id === 'learning-hub-screen') {
        setTimeout(() => window.masteryDashboard.init(), 200);
    }

    // Hook into showScreen for reliable initialization
    const originalShowScreen = window.showScreen;
    window.showScreen = function(targetScreen) {
        if (originalShowScreen) originalShowScreen(targetScreen);
        
        // If we're entering the learning hub, init/refresh the dashboard
        if (targetScreen === 'learning-hub') {
            setTimeout(() => {
                if (window.masteryDashboard) window.masteryDashboard.init();
            }, 100);
        }
    };
});
