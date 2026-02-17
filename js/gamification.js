// ===== GAMIFICATION MODULE =====

const GAMIFICATION_KEYS = {
    XP: 'jurnal_ai_xp',
    LEVEL: 'jurnal_ai_level',
    BADGES: 'jurnal_ai_badges',
    INVENTORY: 'jurnal_ai_inventory',
    EQUIPPED: 'jurnal_ai_equipped'
};

const LEVEL_THRESHOLDS = [
    0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 5000
];

const BADGES_CONFIG = [
    { id: 'first_step', name: 'Langkah Awal', desc: 'Menyelesaikan aktivitas pertama', icon: '🌱' },
    { id: 'journal_master', name: 'Penulis Rajin', desc: 'Menulis 10 jurnal', icon: '✍️' },
    { id: 'task_slayer', name: 'Task Slayer', desc: 'Menyelesaikan 20 tugas', icon: '⚔️' },
    { id: 'habit_hero', name: 'Habit Hero', desc: 'Mencapai 7 hari streak', icon: '🔥' },
    { id: 'finance_guru', name: 'Finance Guru', desc: 'Mencatat 50 transaksi', icon: '💰' },
    { id: 'early_bird', name: 'Early Bird', desc: 'Menyelesaikan tugas sebelum jam 9 pagi', icon: '🐦' }
];

// --- SHOP ITEMS CONFIG ---
const SHOP_ITEMS = [
    // Avatars
    { id: 'avatar_cat', type: 'avatar', name: 'Kucing Oren', price: 200, value: '🐱', desc: 'Si raja jalanan.' },
    { id: 'avatar_robot', type: 'avatar', name: 'Mecha Bot', price: 300, value: '🤖', desc: 'Teknologi masa depan.' },
    { id: 'avatar_dragon', type: 'avatar', name: 'Naga Api', price: 500, value: '🐲', desc: 'Simbol kekuatan.' },
    { id: 'avatar_wizard', type: 'avatar', name: 'Penyihir', price: 400, value: '🧙‍♂️', desc: 'Penuh misteri.' },

    // Themes
    { id: 'theme_midnight', type: 'theme', name: 'Midnight Gold', price: 800, value: 'midnight', desc: 'Tema gelap dengan aksen emas mewah.' },
    { id: 'theme_sakura', type: 'theme', name: 'Sakura Pink', price: 600, value: 'sakura', desc: 'Nuansa pink lembut menenangkan.' },
    { id: 'theme_ocean', type: 'theme', name: 'Ocean Blue', price: 500, value: 'ocean', desc: 'Segar seperti lautan dalam.' },
    { id: 'theme_forest', type: 'theme', name: 'Forest Green', price: 500, value: 'forest', desc: 'Hijau alam yang menyegarkan.' }
];

function initGamification() {
    // Initialize if empty
    if (!localStorage.getItem(GAMIFICATION_KEYS.XP)) {
        localStorage.setItem(GAMIFICATION_KEYS.XP, '0');
        localStorage.setItem(GAMIFICATION_KEYS.LEVEL, '1');
        localStorage.setItem(GAMIFICATION_KEYS.BADGES, '[]');
        localStorage.setItem(GAMIFICATION_KEYS.INVENTORY, '[]');
        localStorage.setItem(GAMIFICATION_KEYS.EQUIPPED, JSON.stringify({ avatar: '🌱', theme: 'default' }));
    }
    renderProfileCard();

    // Check if a theme is equipped and ensure it's applied on load
    const equipped = JSON.parse(localStorage.getItem(GAMIFICATION_KEYS.EQUIPPED) || '{}');
    if (equipped.theme && equipped.theme !== 'default' && window.applyTheme) {
        window.applyTheme(equipped.theme);
    }
}

function getGamificationStats() {
    return {
        xp: parseInt(localStorage.getItem(GAMIFICATION_KEYS.XP) || '0'),
        level: parseInt(localStorage.getItem(GAMIFICATION_KEYS.LEVEL) || '1'),
        badges: JSON.parse(localStorage.getItem(GAMIFICATION_KEYS.BADGES) || '[]'),
        inventory: JSON.parse(localStorage.getItem(GAMIFICATION_KEYS.INVENTORY) || '[]'),
        equipped: JSON.parse(localStorage.getItem(GAMIFICATION_KEYS.EQUIPPED) || '{"avatar": "🌱", "theme": "default"}')
    };
}

function addXP(amount, reason) {
    let { xp, level, badges } = getGamificationStats();
    const oldLevel = level;

    xp += amount;

    // Calculate new level
    let newLevel = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            newLevel = i + 1;
        } else {
            break;
        }
    }

    // Save
    localStorage.setItem(GAMIFICATION_KEYS.XP, xp.toString());

    // Notification
    showNotification(`+${amount} XP`, reason || 'Aktivitas Selesai');

    if (newLevel > oldLevel) {
        level = newLevel;
        localStorage.setItem(GAMIFICATION_KEYS.LEVEL, level.toString());
        showLevelUpModal(level);
    }

    // Check Badges
    checkBadges(badges);

    // Update UI
    renderProfileCard();
}

function checkBadges(currentBadges) {
    const unlocked = [];
    const journals = JSON.parse(localStorage.getItem('jurnal_ai_journals') || '[]');
    const tasks = JSON.parse(localStorage.getItem('jurnal_ai_tasks') || '[]');
    const habits = JSON.parse(localStorage.getItem('jurnal_ai_habits') || '[]');

    // Helper to check and add
    const unlock = (id) => {
        if (!currentBadges.includes(id)) {
            currentBadges.push(id);
            unlocked.push(BADGES_CONFIG.find(b => b.id === id));
        }
    };

    if (journals.length > 0 || tasks.some(t => t.done)) unlock('first_step');
    if (journals.length >= 10) unlock('journal_master');
    if (tasks.filter(t => t.done).length >= 20) unlock('task_slayer');
    if (habits.some(h => h.streak >= 7)) unlock('habit_hero');

    if (unlocked.length > 0) {
        localStorage.setItem(GAMIFICATION_KEYS.BADGES, JSON.stringify(currentBadges));
        unlocked.forEach(badge => {
            showBadgeUnlockModal(badge);
        });
    }
}

// --- SHOP LOGIC ---
function buyItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, message: 'Barang tidak ditemukan' };

    let { xp, inventory } = getGamificationStats();

    if (inventory.includes(itemId)) return { success: false, message: 'Barang sudah dimiliki' };
    if (xp < item.price) return { success: false, message: 'XP tidak cukup' };

    // Process Purchase
    xp -= item.price;
    inventory.push(itemId);

    localStorage.setItem(GAMIFICATION_KEYS.XP, xp.toString());
    localStorage.setItem(GAMIFICATION_KEYS.INVENTORY, JSON.stringify(inventory));

    renderProfileCard(); // Update XP display
    return { success: true, message: `Berhasil membeli ${item.name}!` };
}

function equipItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    let { inventory, equipped } = getGamificationStats();

    // Special case for default
    if (itemId === 'default_avatar') {
        equipped.avatar = '🌱';
    } else if (itemId === 'default_theme') {
        equipped.theme = 'default';
        if (typeof applyTheme === 'function') applyTheme('default');
    } else {
        if (!inventory.includes(itemId)) return { success: false, message: 'Barang belum dimiliki' };

        if (item.type === 'avatar') {
            equipped.avatar = item.value;
        } else if (item.type === 'theme') {
            equipped.theme = item.value;
            // Trigger Theme Change
            if (window.applyTheme) window.applyTheme(item.value);
        }
    }

    localStorage.setItem(GAMIFICATION_KEYS.EQUIPPED, JSON.stringify(equipped));
    renderProfileCard();
    return { success: true, message: `Item digunakan!` };
}


// --- UI FUNCTIONS ---
function renderProfileCard() {
    const card = document.getElementById('user-profile-card');
    if (!card) return;

    const { xp, level, equipped } = getGamificationStats();

    // Safety check for equipped
    const currentAvatar = equipped && equipped.avatar ? equipped.avatar : '🌱';

    const nextLevelXP = LEVEL_THRESHOLDS[level] || 99999;
    const prevLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
    const progress = Math.min(100, Math.max(0, ((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100));

    card.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar-container" onclick="showShopModal()" style="cursor: pointer; position: relative;">
                <div class="profile-avatar">${currentAvatar}</div>
                <div class="profile-level-badge">${level}</div>
            </div>
            <div class="profile-info">
                <h3>Pengguna</h3>
                <div class="xp-bar-container">
                    <div class="xp-bar-fill" style="width: ${progress}%"></div>
                </div>
                <div class="xp-text">
                    ${xp} / ${nextLevelXP} XP 
                    <button onclick="showShopModal()" style="float:right; background:none; border:none; color:var(--primary); cursor:pointer; font-size: 0.9em;">
                        🛒 Shop
                    </button>
                </div>
            </div>
        </div>
        <div class="profile-stats">
            <div class="p-stat">
                <div class="p-val">${JSON.parse(localStorage.getItem('jurnal_ai_journals') || '[]').length}</div>
                <div class="p-lbl">Journal</div>
            </div>
            <div class="p-stat">
                <div class="p-val">${JSON.parse(localStorage.getItem('jurnal_ai_tasks') || '[]').filter(t => t.done).length}</div>
                <div class="p-lbl">Task</div>
            </div>
        </div>
    `;
}

function showLevelUpModal(level) {
    const modal = document.createElement('div');
    modal.className = 'gamification-modal';
    modal.innerHTML = `
        <div class="gamification-modal-content level-up">
            <div class="modal-icon">🎉</div>
            <h2>Level Up!</h2>
            <p>Selamat! Kamu mencapai <strong>Level ${level}</strong></p>
            <button onclick="this.parentElement.parentElement.remove()">Lanjut</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);
}

function showBadgeUnlockModal(badge) {
    const modal = document.createElement('div');
    modal.className = 'gamification-modal';
    modal.innerHTML = `
        <div class="gamification-modal-content badge-unlock">
            <div class="modal-icon">${badge.icon}</div>
            <h2>Badge Unlocked!</h2>
            <p>Mendapatkan Badge: <strong>${badge.name}</strong></p>
            <p class="badge-desc">${badge.desc}</p>
            <button onclick="this.parentElement.parentElement.remove()">Keren!</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);
}

// --- SHOP UI MODAL ---
function showShopModal() {
    let modal = document.getElementById('shop-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'shop-modal';
        modal.className = 'modal hidden';
        document.body.appendChild(modal);
    }

    const { xp, inventory, equipped } = getGamificationStats();

    let itemsHTML = '';
    SHOP_ITEMS.forEach(item => {
        const isOwned = inventory.includes(item.id);
        const isEquipped = (item.type === 'avatar' && equipped.avatar === item.value) ||
            (item.type === 'theme' && equipped.theme === item.value);

        let btnAction = '';
        if (isEquipped) {
            btnAction = `<button class="btn-shop equipped" disabled>Dipakai</button>`;
        } else if (isOwned) {
            btnAction = `<button class="btn-shop owned" onclick="handleEquipItem('${item.id}')">Pakai</button>`;
        } else {
            const canBuy = xp >= item.price;
            btnAction = `<button class="btn-shop buy ${canBuy ? '' : 'disabled'}" 
                onclick="handleBuyItem('${item.id}')" ${canBuy ? '' : 'disabled'}>
                Beli (${item.price} XP)
            </button>`;
        }

        itemsHTML += `
            <div class="shop-item card">
                <div class="shop-icon">${item.type === 'theme' ? '🎨' : item.value}</div>
                <div class="shop-details">
                    <h4>${item.name}</h4>
                    <p>${item.desc}</p>
                </div>
                <div class="shop-action">
                    ${btnAction}
                </div>
            </div>
        `;
    });

    // Add Default Options
    itemsHTML += `
        <div class="shop-item card">
            <div class="shop-icon">🌱</div>
            <div class="shop-details">
                <h4>Default Avatar</h4>
                <p>Kembali ke awal</p>
            </div>
            <div class="shop-action">
                <button class="btn-shop owned" onclick="handleEquipItem('default_avatar')">Pakai</button>
            </div>
        </div>
        <div class="shop-item card">
            <div class="shop-icon">🌑</div>
            <div class="shop-details">
                <h4>Default Theme</h4>
                <p>Tema bawaan</p>
            </div>
            <div class="shop-action">
                <button class="btn-shop owned" onclick="handleEquipItem('default_theme')">Pakai</button>
            </div>
        </div>
    `;

    modal.innerHTML = `
        <div class="modal-content card" style="max-width: 500px">
            <div class="modal-header">
                <h3>🛍️ Toko XP (Saldo: ${xp} XP)</h3>
                <button onclick="document.getElementById('shop-modal').classList.add('hidden')" class="icon-btn">✕</button>
            </div>
            <div class="shop-grid">
                ${itemsHTML}
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function handleBuyItem(id) {
    const result = buyItem(id);
    if (result.success) {
        showNotification('🛒 Pembelian Berhasil', result.message);
        showShopModal(); // Refresh UI
    } else {
        alert(result.message);
    }
}

function handleEquipItem(id) {
    const result = equipItem(id);
    if (result.success) {
        showNotification('✅ Berhasil', result.message);
        showShopModal(); // Refresh UI to update buttons
        renderProfileCard(); // Update avatar on dashboard
    }
}

// Expose to window
window.initGamification = initGamification;
window.addXP = addXP;
window.showShopModal = showShopModal;
window.handleBuyItem = handleBuyItem;
window.handleEquipItem = handleEquipItem;
window.showProfileModal = showProfileModal;

function showProfileModal() {
    const { xp, level, badges } = getGamificationStats();

    let modal = document.getElementById('profile-modal');
    if (!modal) {
        createProfileModalDOM();
        modal = document.getElementById('profile-modal');
    }

    const badgeListHTML = BADGES_CONFIG.map(b => {
        const unlocked = badges.includes(b.id);
        return `
            <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}" style="opacity: ${unlocked ? 1 : 0.5}; display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 5px;">
                <div class="badge-icon" style="font-size: 1.5rem;">${b.icon}</div>
                <div>
                    <div class="badge-name" style="font-weight: bold;">${b.name}</div>
                    <div class="badge-desc" style="font-size: 0.8rem; color: #aaa;">${b.desc}</div>
                </div>
                ${unlocked ? '✅' : '🔒'}
            </div>
        `;
    }).join('');

    const statsContainer = document.getElementById('profile-stats-content');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Level</span>
                <strong>${level}</strong>
            </div>
            <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Total XP</span>
                <strong>${xp}</strong>
            </div>
        `;
    }

    const badgesContainer = document.getElementById('profile-badges-list');
    if (badgesContainer) {
        badgesContainer.innerHTML = badgeListHTML;
    }

    modal.classList.remove('hidden');
}

function createProfileModalDOM() {
    const div = document.createElement('div');
    div.id = 'profile-modal';
    div.className = 'modal hidden';
    div.innerHTML = `
        <div class="modal-content card" style="max-width: 500px">
            <div class="modal-header">
                <h3>👤 Profil Pengguna</h3>
                <button onclick="document.getElementById('profile-modal').classList.add('hidden')" class="icon-btn">✕</button>
            </div>
            <div class="profile-details-view">
                 <div id="profile-stats-content" class="profile-stats-grid" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);"></div>
                 <h4>Badges Collection</h4>
                 <div id="profile-badges-list" class="badges-grid" style="max-height: 300px; overflow-y: auto;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(div);
}
