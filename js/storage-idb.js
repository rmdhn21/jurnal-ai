if (typeof Dexie === 'undefined') {
    console.error('❌ Dexie library not loaded! Check your script tags.');
}

const db = new Dexie('JurnalAIDB');

// Define Schema
db.version(2).stores({
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
    saved_generations: 'id, title, category, type, createdAt, updatedAt, synced',
    settings: 'key' // For simple key-value settings
});

// Initialize Database
async function initDB() {
    try {
        await db.open();
        console.log('✅ IndexedDB (Dexie) opened successfully');
    } catch (err) {
        console.error('❌ Failed to open IDB:', err);
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
    // Soft delete support would be better for sync, but for now let's do hard delete
    // or we can add a 'deleted' flag.
    const item = await db[table].get(id);
    if (item) {
        item.deleted = true;
        item.updatedAt = new Date().toISOString();
        item.synced = 0;
        return await db[table].put(item);
    }
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
