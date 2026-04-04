if (typeof Dexie === 'undefined') {
    console.error('❌ Dexie library not loaded! Check your script tags.');
}

const db = new Dexie('JurnalAIDB');

// Define Schema
db.version(5).stores({
    journals: 'id, mood, createdAt, updatedAt, synced',
    tasks: 'id, status, done, createdAt, updatedAt, synced',
    schedules: 'id, datetime, createdAt, updatedAt, synced',
    transactions: 'id, type, category, walletId, date, createdAt, updatedAt, synced',
    habits: 'id, name, createdAt, updatedAt, synced',
    goals: 'id, completed, createdAt, updatedAt, synced',
    wallets: 'id, name, createdAt, updatedAt, synced',
    budgets: 'id, category, createdAt, updatedAt, synced',
    islamic_tracks: 'date, updatedAt, synced', // Primary key is date
    hse_vocab_bank: 'id, word, createdAt, updatedAt, synced',
    oxford_mastery: 'id, level, status, updatedAt, synced',
    oxford_words: 'id, word, level, trans, def, ipa, updatedAt, synced',
    saved_generations: 'id, title, category, type, createdAt, updatedAt, synced',
    rig_memos: 'id, updatedAt, synced',
    rig_inspection_state: 'id',
    settings: 'key' // For simple key-value settings
});

// Initialize Database
async function initDB() {
    try {
        // Check if IndexedDB is available
        if (!window.indexedDB) {
            console.warn('⚠️ IndexedDB is not supported in this browser.');
            return false;
        }

        await db.open();
        console.log('✅ IndexedDB (Dexie) opened successfully');
        return true;
    } catch (err) {
        console.error('❌ Failed to open IDB:', err);
        // Safari Private Mode or other storage restrictions
        if (err.name === 'SecurityError' || err.name === 'QuotaExceededError') {
            console.warn('⚠️ Storage restriction detected (Safari Private Mode?). Falling back to LocalStorage.');
        }
        return false;
    }
}

// ===== GENERIC CRUD HELPERS =====

async function idbGet(table, id) {
    return await db[table].get(id);
}

async function idbGetAll(table) {
    return await db[table].toArray();
}

async function idbSave(table, data) {
    // Add sync metadata if not present
    if (!data.updatedAt) data.updatedAt = new Date().toISOString();
    data.synced = 0; // 0 = not synced, 1 = synced
    
    return await db[table].put(data);
}

async function idbDelete(table, id) {
    // Soft delete support
    // Try provided ID as is
    let item = await db[table].get(id);
    
    // If not found and ID looks like a number, try as number
    if (!item && typeof id === 'string' && !isNaN(id) && id.trim() !== '') {
        const numId = Number(id);
        item = await db[table].get(numId);
        if (item) id = numId; // Update ID for the final delete call if needed
    }

    if (item) {
        item.deleted = true;
        item.updatedAt = new Date().toISOString();
        item.synced = 0;
        return await db[table].put(item);
    }
    
    // Hard delete fallback if not found for soft delete
    return await db[table].delete(id);
}

async function idbBulkSave(table, items) {
    return await db[table].bulkPut(items);
}

// ===== SETTINGS HELPERS (LocalStorage bridge) =====
async function idbGetSetting(key, defaultValue = null) {
    const setting = await db.settings.get(key);
    return setting ? setting.value : defaultValue;
}

async function idbSaveSetting(key, value) {
    return await db.settings.put({ key, value });
}
