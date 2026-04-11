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
    { id: 'theme_midnight', type: 'theme', name: 'Midnight Gold', price: 800, value: 'midnight', desc: 'Tema gelap dengan aksen emas mewah.' },
    { id: 'theme_sakura', type: 'theme', name: 'Sakura Pink', price: 600, value: 'sakura', desc: 'Nuansa pink lembut menenangkan.' },
    { id: 'theme_ocean', type: 'theme', name: 'Ocean Blue', price: 500, value: 'ocean', desc: 'Segar seperti lautan dalam.' },
    { id: 'theme_forest', type: 'theme', name: 'Forest Green', price: 500, value: 'forest', desc: 'Hijau alam yang menyegarkan.' }
];

async function initGamification() {
    // Check if initialization is needed
    const xp = await getGamificationValue(GAMIFICATION_KEYS.XP);
    if (xp === null) {
        await saveGamificationValue(GAMIFICATION_KEYS.XP, '0');
        await saveGamificationValue(GAMIFICATION_KEYS.LEVEL, '1');
        await saveGamificationValue(GAMIFICATION_KEYS.BADGES, '[]');
        await saveGamificationValue(GAMIFICATION_KEYS.INVENTORY, '[]');
        await saveGamificationValue(GAMIFICATION_KEYS.EQUIPPED, JSON.stringify({ avatar: '🌱', theme: 'default' }));
    }
    
    await renderProfileCard();

    // Check if a theme is equipped and ensure it's applied on load
    const equippedRaw = await getGamificationValue(GAMIFICATION_KEYS.EQUIPPED);
    const equipped = JSON.parse(equippedRaw || '{}');
    if (equipped.theme && equipped.theme !== 'default' && window.applyTheme) {
        window.applyTheme(equipped.theme);
    }
}

async function getGamificationStats() {
    return {
        xp: parseInt(await getGamificationValue(GAMIFICATION_KEYS.XP, '0')),
        level: parseInt(await getGamificationValue(GAMIFICATION_KEYS.LEVEL, '1')),
        badges: JSON.parse(await getGamificationValue(GAMIFICATION_KEYS.BADGES, '[]')),
        inventory: JSON.parse(await getGamificationValue(GAMIFICATION_KEYS.INVENTORY, '[]')),
        equipped: JSON.parse(await getGamificationValue(GAMIFICATION_KEYS.EQUIPPED, '{"avatar": "🌱", "theme": "default"}'))
    };
}

async function addXP(amount, reason) {
    let stats = await getGamificationStats();
    let { xp, level, badges } = stats;
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
    await saveGamificationValue(GAMIFICATION_KEYS.XP, xp.toString());

    // Notification
    if (typeof sendPremiumNotification === 'function') {
        sendPremiumNotification(`+${amount} XP`, { body: reason || 'Aktivitas Selesai' });
    } else if (typeof showNotification === 'function') {
        showNotification(`+${amount} XP`, reason || 'Aktivitas Selesai');
    }

    if (newLevel > oldLevel) {
        level = newLevel;
        await saveGamificationValue(GAMIFICATION_KEYS.LEVEL, level.toString());
        showLevelUpModal(level);
    }

    // Check Badges
    await checkBadges(badges);

    // Update UI
    await renderProfileCard();
}

async function checkBadges(currentBadges) {
    const unlocked = [];
    
    // Get related data from storage.js (async)
    const journals = await getJournals();
    const tasks = await getTasks();
    const habits = await getHabits();

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
    
    // Streak check (assuming habits have a 'streak' property)
    if (habits.some(h => (h.streak || 0) >= 7)) unlock('habit_hero');

    if (unlocked.length > 0) {
        await saveGamificationValue(GAMIFICATION_KEYS.BADGES, JSON.stringify(currentBadges));
        unlocked.forEach(badge => {
            showBadgeUnlockModal(badge);
        });
    }
}

// --- SHOP LOGIC ---
async function buyItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, message: 'Barang tidak ditemukan' };

    let { xp, inventory } = await getGamificationStats();

    if (inventory.includes(itemId)) return { success: false, message: 'Barang sudah dimiliki' };
    if (xp < item.price) return { success: false, message: 'XP tidak cukup' };

    // Process Purchase
    xp -= item.price;
    inventory.push(itemId);

    await saveGamificationValue(GAMIFICATION_KEYS.XP, xp.toString());
    await saveGamificationValue(GAMIFICATION_KEYS.INVENTORY, JSON.stringify(inventory));

    await renderProfileCard(); // Update XP display
    return { success: true, message: `Berhasil membeli ${item.name}!` };
}

async function equipItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    let { inventory, equipped } = await getGamificationStats();

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

    await saveGamificationValue(GAMIFICATION_KEYS.EQUIPPED, JSON.stringify(equipped));
    await renderProfileCard();
    return { success: true, message: `Item digunakan!` };
}


// --- DYNAMIC AVATAR LOGIC ---
function getDynamicAvatarUrl(level) {
    const seed = `Jurnal_AI_Pioneer_Lv${level}`;
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}&backgroundColor=transparent`;
}

// --- UI FUNCTIONS ---
async function renderProfileCard() {
    const card = document.getElementById('user-profile-card');
    if (!card) return;

    const stats = await getGamificationStats();
    const { xp, level } = stats;

    const avatarUrl = getDynamicAvatarUrl(level);

    const nextLevelXP = LEVEL_THRESHOLDS[level] || 99999;
    const prevLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
    const progress = Math.min(100, Math.max(0, ((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100));

    // Get journal count for display
    const journals = await getJournals();

    card.innerHTML = `
        <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">👤</div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; position: relative; z-index: 1;">
            <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                <span>👤</span> Executive Profile
            </h3>
            <span style="font-size: 0.65rem; font-weight: 800; color: #818cf8; background: rgba(99, 102, 241, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(99, 102, 241, 0.3); text-transform: uppercase;">LEVEL ${level}</span>
        </div>
        
        <div class="profile-header" style="position: relative; z-index: 1; display: flex; gap: 15px; align-items: center; margin-bottom: 20px;">
            <div class="profile-avatar-container" onclick="showShopModal()" style="cursor: pointer; position: relative; width: 60px; height: 60px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid var(--border); padding: 5px;">
                <img src="${avatarUrl}" alt="AI Avatar" class="profile-avatar" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div class="profile-info" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">Experience Points</span>
                    <span style="font-size: 0.85rem; font-weight: bold; color: var(--primary);">${xp} / ${nextLevelXP} XP</span>
                </div>
                <div class="xp-bar-container" style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                    <div class="xp-bar-fill" style="width: ${progress}%; height: 100%; background: var(--gradient-primary); border-radius: 3px;"></div>
                </div>
            </div>
        </div>

        <div class="profile-stats" style="position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="p-stat" style="background: rgba(0,0,0,0.1); padding: 10px; border-radius: 8px; border: 1px solid var(--border); text-align: center;" onclick="showProfileModal()">
                <div class="p-val" style="font-size: 1.2rem; font-weight: bold; color: var(--text-primary);">${journals.length}</div>
                <div class="p-lbl" style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Journals</div>
            </div>
            <div class="p-stat" style="background: rgba(0,0,0,0.1); padding: 10px; border-radius: 8px; border: 1px solid var(--border); text-align: center;" onclick="showShopModal()">
                <div class="p-val" style="font-size: 1.2rem; font-weight: bold; color: var(--primary);">🛒</div>
                <div class="p-lbl" style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Marketplace</div>
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
async function showShopModal() {
    let modal = document.getElementById('shop-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'shop-modal';
        modal.className = 'modal hidden';
        document.body.appendChild(modal);
    }

    const { xp, inventory, equipped } = await getGamificationStats();

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

async function handleBuyItem(id) {
    const result = await buyItem(id);
    if (result.success) {
        if (typeof showNotification === 'function') {
            showNotification('🛒 Pembelian Berhasil', result.message);
        }
        await showShopModal(); // Refresh UI
    } else {
        alert(result.message);
    }
}

async function handleEquipItem(id) {
    const result = await equipItem(id);
    if (result.success) {
        if (typeof showNotification === 'function') {
            showNotification('✅ Berhasil', result.message);
        }
        await showShopModal(); // Refresh UI to update buttons
        await renderProfileCard(); // Update avatar on dashboard
    }
}

// Expose to window
window.initGamification = initGamification;
window.addXP = addXP;
window.showShopModal = showShopModal;
window.handleBuyItem = handleBuyItem;
window.handleEquipItem = handleEquipItem;
window.showProfileModal = showProfileModal;

async function showProfileModal() {
    const { xp, level, badges } = await getGamificationStats();

    let modal = document.getElementById('profile-modal');
    if (!modal) {
        createProfileModalDOM();
        modal = document.getElementById('profile-modal');
    }

    const badgeListHTML = BADGES_CONFIG.map(b => {
        const unlocked = badges.includes(b.id);
        return `
            <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}" style="opacity: ${unlocked ? 1 : 0.5}; display: center; align-items: center; gap: 10px; padding: 10px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 5px;">
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
        const journals = await getJournals();
        statsContainer.innerHTML = `
            <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Level</span>
                <strong>${level}</strong>
            </div>
            <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Total XP</span>
                <strong>${xp}</strong>
            </div>
            <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Total Journals</span>
                <strong>${journals.length}</strong>
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
