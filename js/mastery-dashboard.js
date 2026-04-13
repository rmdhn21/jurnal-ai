/**
 * ELITE MASTERY SKILL TREE
 * Handles the visual progress tree, neural connections, and global XP.
 */

window.masteryDashboard = {
    modules: [
        { id: 'epls', title: 'English', icon: '🇬🇧', color: '#3b82f6', storage: 'epls_progress', isEpls: true, pos: { x: 20, y: 15 } },
        { id: 'coding', title: 'Coding', icon: '💻', color: '#6366f1', storage: 'code_progress', levels: 5, pos: { x: 15, y: 40 } },
        { id: 'pertamina', title: 'Pertamina', icon: '⛽', color: '#ef4444', storage: 'ptm_progress', levels: 5, pos: { x: 20, y: 70 } },
        
        { id: 'physics', title: 'Fisika', icon: '🔬', color: '#8b5cf6', storage: 'physics_progress', levels: 5, pos: { x: 80, y: 15 } },
        { id: 'psychology', title: 'Psikologi', icon: '🧠', color: '#d946ef', storage: 'psy_progress', levels: 5, pos: { x: 85, y: 40 } },
        { id: 'investment', title: 'Investasi', icon: '📈', color: '#10b981', storage: 'inv_progress', levels: 5, pos: { x: 80, y: 70 } },
        
        { id: 'hsse', title: 'HSSE', icon: '🛡️', color: '#f59e0b', storage: 'hsse_progress', levels: 5, pos: { x: 50, y: 25 } },
        { id: 'automotive', title: 'Mesin', icon: '🔧', color: '#94a3b8', storage: 'auto_progress', levels: 5, pos: { x: 50, y: 60 } }
    ],

    connections: [
        { from: 'epls', to: 'coding' },
        { from: 'coding', to: 'pertamina' },
        { from: 'physics', to: 'psychology' },
        { from: 'psychology', to: 'investment' },
        { from: 'hsse', to: 'automotive' },
        { from: 'coding', to: 'hsse' }, // Cross path
        { from: 'psychology', to: 'hsse' } // Cross path
    ],

    init: function() {
        this.render();
        this.updateGlobalMastery();
        // Redraw on resize to keep SVG lines accurate
        window.addEventListener('resize', () => this.drawConnections());
    },

    render: function() {
        const dashboard = document.getElementById('mastery-hexagon-dashboard');
        if (!dashboard) return;

        // Clear existing nodes but keep SVG
        dashboard.querySelectorAll('.hexagon-node').forEach(n => n.remove());

        this.modules.forEach(mod => {
            const progress = this.calculateProgress(mod);
            const tierClass = this.getTierClass(progress);
            
            const node = document.createElement('div');
            node.id = `node-${mod.id}`;
            node.className = `hexagon-node ${tierClass}`;
            node.style.left = `${mod.pos.x}%`;
            node.style.top = `${mod.pos.y}%`;
            node.style.transform = `translate(-50%, -50%)`;
            node.onclick = () => window.navigateToSubscreen(mod.id);

            node.innerHTML = `
                <div class="hexagon-icon">${mod.icon}</div>
                <div class="hexagon-title">${mod.title}</div>
                <div class="hexagon-progress">
                    <div class="hexagon-progress-fill" style="width: ${progress}%; background: ${mod.color}; box-shadow: 0 0 10px ${mod.color};"></div>
                </div>
                <div style="font-size: 0.6rem; color: #94a3b8; margin-top: 5px; font-weight:800;">${progress}%</div>
            `;
            dashboard.appendChild(node);
        });

        // Delay connection drawing to ensure nodes are positioned
        setTimeout(() => this.drawConnections(), 100);
    },

    getTierClass: function(progress) {
        if (progress >= 100) return 'mastery-grandmaster';
        if (progress >= 75) return 'mastery-master';
        if (progress >= 50) return 'mastery-elite';
        if (progress >= 25) return 'mastery-adept';
        return 'mastery-novice';
    },

    drawConnections: function() {
        const svg = document.getElementById('mastery-tree-svg');
        const dashboard = document.getElementById('mastery-hexagon-dashboard');
        if (!svg || !dashboard) return;

        svg.innerHTML = '';
        const rect = dashboard.getBoundingClientRect();

        this.connections.forEach(conn => {
            const fromEl = document.getElementById(`node-${conn.from}`);
            const toEl = document.getElementById(`node-${conn.to}`);
            
            if (fromEl && toEl) {
                const fromRect = fromEl.getBoundingClientRect();
                const toRect = toEl.getBoundingClientRect();

                const x1 = (fromRect.left + fromRect.width / 2) - rect.left;
                const y1 = (fromRect.top + fromRect.height / 2) - rect.top;
                const x2 = (toRect.left + toRect.width / 2) - rect.left;
                const y2 = (toRect.top + toRect.height / 2) - rect.top;

                const fromMod = this.modules.find(m => m.id === conn.from);
                const fromProgress = this.calculateProgress(fromMod);
                const isCompleted = fromProgress >= 100;

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x1);
                line.setAttribute("y1", y1);
                line.setAttribute("x2", x2);
                line.setAttribute("y2", y2);
                line.setAttribute("class", `mastery-connection ${isCompleted ? 'completed' : ''}`);
                line.style.setProperty('--connection-color', fromMod.color);
                line.setAttribute("stroke", isCompleted ? fromMod.color : "rgba(255,255,255,0.1)");
                
                svg.appendChild(line);
            }
        });
    },

    updateGlobalMastery: function() {
        let totalProgress = 0;
        this.modules.forEach(mod => {
            totalProgress += this.calculateProgress(mod);
        });

        const avgProgress = Math.round(totalProgress / this.modules.length);
        
        const bar = document.getElementById('global-mastery-bar');
        const text = document.getElementById('global-mastery-percent');
        const rank = document.getElementById('mastery-rank-text');

        if (bar) bar.style.width = `${avgProgress}%`;
        if (text) text.innerText = `${avgProgress}%`;
        
        if (rank) {
            if (avgProgress >= 100) rank.innerText = "🔱 Supreme Grandmaster of Knowledge";
            else if (avgProgress >= 80) rank.innerText = "💎 Elite Strategic Master";
            else if (avgProgress >= 60) rank.innerText = "🎖️ Advanced Professional";
            else if (avgProgress >= 40) rank.innerText = "⚔️ Respected Adept";
            else if (avgProgress >= 20) rank.innerText = "🌱 Growing Apprentice";
            else rank.innerText = "Memulai perjalanan keahlian...";
        }

        this.updateAIAdvice(avgProgress);
        this.renderDetailedList();
    },

    updateAIAdvice: function(avgProgress) {
        const adviceContainer = document.getElementById('mastery-ai-advice');
        const adviceText = document.getElementById('mastery-suggestion-text');
        if (!adviceContainer || !adviceText) return;

        // Find the module with lowest progress (but > 0 if possible, or just lowest)
        const sortedModules = [...this.modules].sort((a, b) => this.calculateProgress(a) - this.calculateProgress(b));
        const focusMod = sortedModules[0];
        const focusProgress = this.calculateProgress(focusMod);

        let suggestion = "";
        if (avgProgress === 0) {
            suggestion = `Selamat datang! Saya sarankan mulai dengan modul **${focusMod.title}** untuk membangun fondasi yang kuat hari ini.`;
        } else if (focusProgress < 100) {
            suggestion = `Analisis saya menunjukkan fokus terbaik Anda saat ini adalah **${focusMod.title}** (${focusProgress}%). Selesaikan level berikutnya untuk menyeimbangkan statistik Mastery Anda.`;
        } else {
            suggestion = "Luar biasa! Semua modul dasar telah dikuasai. Terus tinjau materi secara berkala untuk menjaga ketajaman mental Anda.";
        }

        adviceText.innerHTML = suggestion;
        adviceContainer.style.display = 'block';
    },

    renderDetailedList: function() {
        const listContainer = document.getElementById('mastery-detailed-list');
        if (!listContainer) return;

        listContainer.innerHTML = this.modules.map(mod => {
            const progress = this.calculateProgress(mod);
            return `
                <div class="card mt-sm" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; cursor: pointer; padding: 15px; position: relative; overflow: hidden;" onclick="navigateToSubscreen('${mod.id}')">
                    <div style="position: absolute; top: -5px; right: -5px; opacity: 0.05; font-size: 2.5rem; pointer-events: none;">${mod.icon}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
                        <div>
                            <h4 style="margin:0; font-size: 0.95rem;">${mod.title} Mastery</h4>
                            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">${this.getTierName(progress)} Level</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1rem; font-weight: 800; color: ${mod.color};">${progress}%</div>
                        </div>
                    </div>
                    <div class="progress-bar-bg" style="height: 4px; margin-top: 10px; background: rgba(255,255,255,0.05);">
                        <div class="progress-bar-fill" style="width: ${progress}%; background: ${mod.color};"></div>
                    </div>
                </div>
            `;
        }).join('');
    },

    getTierName: function(progress) {
        if (progress >= 100) return 'Grandmaster';
        if (progress >= 75) return 'Master';
        if (progress >= 50) return 'Elite';
        if (progress >= 25) return 'Adept';
        return 'Novice';
    },


    calculateProgress: function(mod) {
        const data = localStorage.getItem(mod.storage);
        if (!data) return 0;
        
        try {
            const progress = JSON.parse(data);

            if (mod.isEpls) {
                let totalCompleted = 0;
                Object.values(progress).forEach(arr => {
                    if (Array.isArray(arr)) totalCompleted += arr.length;
                });
                return Math.min(100, Math.round((totalCompleted / 122) * 100));
            }
            
            let completedCount = 0;
            const levelsToCount = mod.levels || 5;
            
            Object.values(progress).forEach(val => {
                if (val === true || (Array.isArray(val) && val.length > 0)) completedCount++;
            });

            return Math.min(100, Math.round((completedCount / levelsToCount) * 100));
        } catch (e) {
            return 0;
        }
    }
};

// Initial registration for navigation
const originalShowScreen = window.showScreen;
window.showScreen = function(targetScreen) {
    if (originalShowScreen) originalShowScreen(targetScreen);
    if (targetScreen === 'learning-hub') {
        setTimeout(() => {
            if (window.masteryDashboard) window.masteryDashboard.init();
        }, 100);
    }
};

// Auto-init on load if already on hub
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('learning-hub-screen')?.classList.contains('active')) {
        window.masteryDashboard.init();
    }
});
