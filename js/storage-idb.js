if (typeof Dexie === 'undefined') {
    console.error('❌ Dexie library not loaded! Check your script tags.');
}

const db = new Dexie('JurnalAIDB');

// Define Schema
db.version(9).stores({
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
    settings: 'key', // For simple key-value settings
    todo_today: 'id, text, completed, updatedAt, synced',
    workout_state: 'key, updatedAt, synced',
    gamification: 'key, updatedAt, synced',
    learning_progress: 'key, updatedAt, synced',
    routines: 'id, time, updatedAt, synced',
    hse_routes: 'id, timestamp, updatedAt, synced'
});

// Initialize Database
async function initDB() {
    try {
        // Check if IndexedDB is available
        if (!window.indexedDB) {
            console.warn('⚠️ IndexedDB is not supported in this browser.');
            window.idbReady = false;
            return false;
        }

        await db.open();
        window.idbReady = true;
        console.log('✅ IndexedDB (Dexie) opened successfully');
        
        // Seed default PDF document if not exists
        await seedDefaultPdfDoc();
        
        return true;
    } catch (err) {
        console.error('❌ Failed to open IDB:', err);
        window.idbReady = false;
        // Safari Private Mode or other storage restrictions
        if (err.name === 'SecurityError' || err.name === 'QuotaExceededError') {
            console.warn('⚠️ Storage restriction detected (Safari Private Mode?). Falling back to LocalStorage.');
        }
        return false;
    }
}

// ===== GENERIC CRUD HELPERS WITH LOCALSTORAGE FALLBACK =====

const IDB_LS_MAPPING = {
    journals: 'jurnal_ai_journals',
    tasks: 'jurnal_ai_tasks',
    schedules: 'jurnal_ai_schedules',
    transactions: 'jurnal_ai_transactions',
    habits: 'jurnal_ai_habits',
    goals: 'jurnal_ai_goals',
    wallets: 'jurnal_ai_wallets',
    budgets: 'jurnal_ai_budgets',
    islamic_tracks: 'jurnal_ai_islamic_tracks',
    todo_today: 'jurnal_ai_todo_today_data',
    workout_state: 'hybrid_workout_state',
    routines: 'jurnal_ai_routines',
    hse_vocab_bank: 'jurnal_ai_hse_vocab_bank',
    saved_generations: 'jurnal_ai_saved_generations',
    hse_routes: 'jurnal_ai_hse_routes'
};

function getLocalStorageFallback(table, id) {
    try {
        if (table === 'gamification') {
            const val = localStorage.getItem(id);
            return val ? { key: id, value: val } : null;
        }
        if (table === 'learning_progress') {
            const raw = localStorage.getItem(id);
            return raw ? { key: id, data: JSON.parse(raw) } : null;
        }
        if (table === 'workout_state') {
            const raw = localStorage.getItem(IDB_LS_MAPPING.workout_state);
            return raw ? { key: id, data: JSON.parse(raw) } : null;
        }
        if (table === 'islamic_tracks') {
            const raw = localStorage.getItem(IDB_LS_MAPPING.islamic_tracks);
            const tracks = raw ? JSON.parse(raw) : {};
            return tracks[id] || null;
        }
        const lsKey = IDB_LS_MAPPING[table];
        if (!lsKey) return null;
        const raw = localStorage.getItem(lsKey);
        const list = raw ? JSON.parse(raw) : [];
        if (Array.isArray(list)) {
            return list.find(item => item.id == id) || null;
        }
        return null;
    } catch (e) {
        console.error(`Error in getLocalStorageFallback for ${table}:`, e);
        return null;
    }
}

function getAllLocalStorageFallback(table) {
    try {
        if (table === 'gamification') {
            const keys = ['jurnal_ai_xp', 'jurnal_ai_level', 'jurnal_ai_badges', 'jurnal_ai_inventory', 'jurnal_ai_equipped'];
            return keys.map(k => ({ key: k, value: localStorage.getItem(k) })).filter(item => item.value !== null);
        }
        if (table === 'learning_progress') {
            const list = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('learn-')) {
                    try {
                        list.push({ key: k, data: JSON.parse(localStorage.getItem(k)) });
                    } catch (e) {}
                }
            }
            return list;
        }
        if (table === 'workout_state') {
            const raw = localStorage.getItem(IDB_LS_MAPPING.workout_state);
            return raw ? [{ key: 'current', data: JSON.parse(raw) }] : [];
        }
        if (table === 'islamic_tracks') {
            const raw = localStorage.getItem(IDB_LS_MAPPING.islamic_tracks);
            const tracks = raw ? JSON.parse(raw) : {};
            return Object.values(tracks);
        }
        const lsKey = IDB_LS_MAPPING[table];
        if (!lsKey) return [];
        const raw = localStorage.getItem(lsKey);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error(`Error in getAllLocalStorageFallback for ${table}:`, e);
        return [];
    }
}

function saveLocalStorageFallback(table, data) {
    try {
        if (table === 'gamification') {
            localStorage.setItem(data.key, data.value);
            return data.key;
        }
        if (table === 'learning_progress') {
            localStorage.setItem(data.key, JSON.stringify(data.data));
            return data.key;
        }
        if (table === 'workout_state') {
            localStorage.setItem(IDB_LS_MAPPING.workout_state, JSON.stringify(data.data));
            return 'current';
        }
        if (table === 'islamic_tracks') {
            const raw = localStorage.getItem(IDB_LS_MAPPING.islamic_tracks);
            const tracks = raw ? JSON.parse(raw) : {};
            tracks[data.date] = data;
            localStorage.setItem(IDB_LS_MAPPING.islamic_tracks, JSON.stringify(tracks));
            return data.date;
        }
        const lsKey = IDB_LS_MAPPING[table];
        if (!lsKey) return null;
        const raw = localStorage.getItem(lsKey);
        const list = raw ? JSON.parse(raw) : [];
        if (Array.isArray(list)) {
            const idx = list.findIndex(item => item.id == data.id);
            if (idx >= 0) {
                list[idx] = data;
            } else {
                list.push(data);
            }
            localStorage.setItem(lsKey, JSON.stringify(list));
            return data.id;
        }
    } catch (e) {
        console.error(`Error in saveLocalStorageFallback for ${table}:`, e);
    }
    return null;
}

function deleteLocalStorageFallback(table, id) {
    try {
        if (table === 'gamification') {
            localStorage.removeItem(id);
            return true;
        }
        if (table === 'learning_progress') {
            localStorage.removeItem(id);
            return true;
        }
        if (table === 'workout_state') {
            localStorage.removeItem(IDB_LS_MAPPING.workout_state);
            return true;
        }
        if (table === 'islamic_tracks') {
            const raw = localStorage.getItem(IDB_LS_MAPPING.islamic_tracks);
            const tracks = raw ? JSON.parse(raw) : {};
            delete tracks[id];
            localStorage.setItem(IDB_LS_MAPPING.islamic_tracks, JSON.stringify(tracks));
            return true;
        }
        const lsKey = IDB_LS_MAPPING[table];
        if (!lsKey) return false;
        const raw = localStorage.getItem(lsKey);
        let list = raw ? JSON.parse(raw) : [];
        if (Array.isArray(list)) {
            list = list.filter(item => item.id != id);
            localStorage.setItem(lsKey, JSON.stringify(list));
            return true;
        }
    } catch (e) {
        console.error(`Error in deleteLocalStorageFallback for ${table}:`, e);
    }
    return false;
}

async function idbGet(table, id) {
    if (!window.idbReady) {
        console.warn(`⚠️ IDB not ready. Falling back to LocalStorage for ${table}`);
        return getLocalStorageFallback(table, id);
    }
    try {
        return await db[table].get(id);
    } catch (e) {
        console.error(`Error in idbGet:`, e);
        return getLocalStorageFallback(table, id);
    }
}

async function idbGetAll(table) {
    if (!window.idbReady) {
        console.warn(`⚠️ IDB not ready. Falling back to LocalStorage for ${table}`);
        return getAllLocalStorageFallback(table);
    }
    try {
        return await db[table].toArray();
    } catch (e) {
        console.error(`Error in idbGetAll:`, e);
        return getAllLocalStorageFallback(table);
    }
}

async function idbSave(table, data) {
    if (!data.updatedAt) data.updatedAt = new Date().toISOString();
    data.synced = 0; // 0 = not synced, 1 = synced
    
    if (!window.idbReady) {
        console.warn(`⚠️ IDB not ready. Saving to LocalStorage for ${table}`);
        return saveLocalStorageFallback(table, data);
    }
    try {
        return await db[table].put(data);
    } catch (e) {
        console.error(`Error in idbSave:`, e);
        return saveLocalStorageFallback(table, data);
    }
}

async function idbDelete(table, id) {
    if (!window.idbReady) {
        console.warn(`⚠️ IDB not ready. Deleting from LocalStorage for ${table}`);
        return deleteLocalStorageFallback(table, id);
    }
    try {
        let item = await db[table].get(id);
        
        if (!item && typeof id === 'string' && !isNaN(id) && id.trim() !== '') {
            const numId = Number(id);
            item = await db[table].get(numId);
            if (item) id = numId;
        }

        if (item) {
            item.deleted = true;
            item.updatedAt = new Date().toISOString();
            item.synced = 0;
            return await db[table].put(item);
        }
        
        return await db[table].delete(id);
    } catch (e) {
        console.error(`Error in idbDelete:`, e);
        return deleteLocalStorageFallback(table, id);
    }
}

async function idbBulkSave(table, items) {
    if (!window.idbReady) {
        console.warn(`⚠️ IDB not ready. Bulk saving to LocalStorage for ${table}`);
        for (const item of items) {
            saveLocalStorageFallback(table, item);
        }
        return items;
    }
    try {
        return await db[table].bulkPut(items);
    } catch (e) {
        console.error(`Error in idbBulkSave:`, e);
        for (const item of items) {
            saveLocalStorageFallback(table, item);
        }
        return items;
    }
}

// ===== SETTINGS HELPERS (LocalStorage bridge) =====
async function idbGetSetting(key, defaultValue = null) {
    if (!window.idbReady) {
        return localStorage.getItem(key) || defaultValue;
    }
    try {
        const setting = await db.settings.get(key);
        return setting ? setting.value : defaultValue;
    } catch (e) {
        console.error('Error in idbGetSetting:', e);
        return localStorage.getItem(key) || defaultValue;
    }
}

async function idbSaveSetting(key, value) {
    if (!window.idbReady) {
        localStorage.setItem(key, value);
        return key;
    }
    try {
        return await db.settings.put({ key, value });
    } catch (e) {
        console.error('Error in idbSaveSetting:', e);
        localStorage.setItem(key, value);
        return key;
    }
}

async function seedDefaultPdfDoc() {
    try {
        const item = await db.saved_generations.get('gen_pdf_numeric_reasoning');
        if (!item) {
            await db.saved_generations.put({
                id: 'gen_pdf_numeric_reasoning',
                title: 'Tes Penalaran Numerik - Potensia',
                category: 'EPLS',
                type: 'document',
                timestamp: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                synced: 0,
                content: `<div class="test-container" style="max-width: 800px; margin: 0 auto; font-family: 'Inter', sans-serif; color: var(--text-primary);">
    <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid var(--border); padding-bottom: 15px;">
        <h3 style="color: var(--primary); margin: 0 0 10px 0; font-size: 1.5rem;">📚 TES PENALARAN NUMERIK</h3>
        <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 10px;">Diambil dari: <strong>Potensia (Numerical Reasoning Test)</strong></p>
        <span class="badge-ai" style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); font-weight: 800; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem;">15 SOAL PILIHAN GANDA</span>
    </div>

    <div class="instructions" style="background: rgba(255,255,255,0.02); border-left: 4px solid var(--primary); padding: 15px; border-radius: 8px; margin-bottom: 25px;">
        <h5 style="margin: 0 0 8px 0; color: var(--text-primary); font-size: 1rem;">📝 Instruksi:</h5>
        <p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
            Perhatikan grafik atau tabel yang ditampilkan untuk setiap soal, lalu pilih satu jawaban yang paling tepat. Kuis ini mengukur kemampuan analisis data dari grafik, tabel, dan diagram.
        </p>
    </div>

    <!-- SOAL 1-3 CONTEXT -->
    <div class="data-block" style="background: var(--surface-hover); border-radius: 8px; padding: 15px; margin-bottom: 25px; border: 1px solid var(--border);">
        <strong style="color: var(--primary); display: block; margin-bottom: 10px; font-size: 0.9rem;">📊 Rujukan Soal 1 - 3 (Penjualan Laptop & Harga):</strong>
        <p style="font-size: 0.8rem; margin: 0 0 10px 0; color: var(--text-secondary);">
            <strong>Daftar Harga & Ketentuan Paket Penjualan:</strong><br>
            • <strong>Series X:</strong> IDR 50 juta per 10 unit (IDR 5 juta/unit)<br>
            • <strong>Series Y:</strong> IDR 125 juta per 25 unit (IDR 5 juta/unit)<br>
            • <strong>Series Z:</strong> IDR 80 juta per 20 unit (IDR 4 juta/unit)
        </p>
        <table style="width:100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
            <thead>
                <tr style="border-bottom: 1px solid var(--border); color: var(--text-primary);">
                    <th style="padding: 6px;">Series</th>
                    <th style="padding: 6px;">Maret</th>
                    <th style="padding: 6px;">Juni</th>
                    <th style="padding: 6px;">September</th>
                    <th style="padding: 6px;">Desember</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Series X</strong></td>
                    <td style="padding: 6px;">135 unit</td>
                    <td style="padding: 6px;">160 unit</td>
                    <td style="padding: 6px;">205 unit</td>
                    <td style="padding: 6px;">180 unit</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Series Y</strong></td>
                    <td style="padding: 6px;">100 unit</td>
                    <td style="padding: 6px;">130 unit</td>
                    <td style="padding: 6px;">175 unit</td>
                    <td style="padding: 6px;">145 unit</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Series Z</strong></td>
                    <td style="padding: 6px;">120 unit</td>
                    <td style="padding: 6px;">145 unit</td>
                    <td style="padding: 6px;">170 unit</td>
                    <td style="padding: 6px;">205 unit</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- SOAL 1 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 1: Berapa penjualan laptop series X dan Z yang terjual pada bulan September?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. IDR 1.650 juta</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">B. IDR 1.725 juta (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">C. IDR 24.500 juta</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. IDR 30.375 juta</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Series X Sep = 205 unit &times; IDR 5 juta = IDR 1.025 juta.<br>
            • Series Z Sep = 175 unit &times; IDR 4 juta = IDR 700 juta.<br>
            • Total = 1.025 + 700 = IDR 1.725 juta.
        </div>
    </div>

    <!-- SOAL 2 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 2: Jika produksi laptop series Y di bulan Juli mengalami peningkatan sebesar 20% dari jumlah unit terjual di bulan Juni, berapakah nilai penjualan yang diperoleh pada Juli jika seluruh unit habis terjual?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. IDR 625 juta</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. IDR 725 juta</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">C. IDR 750 juta (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. IDR 925 juta</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Unit terjual Juni Series Y = 125 unit.<br>
            • Produksi Juli = 125 &times; 120% = 150 unit.<br>
            • Nilai penjualan Juli = 150 &times; IDR 5 juta = IDR 750 juta.
        </div>
    </div>

    <!-- SOAL 3 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 3: Berapa rasio pendapatan dari dua series laptop dengan penjualan unit terbanyak pada bulan Desember?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 1 : 5</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. 3 : 4</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">C. 4 : 3</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">D. 10 : 9 (Benar)</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Unit terbanyak Desember: Series X (200 unit) dan Series Y (180 unit).<br>
            • Pendapatan X = 200 &times; 5 = IDR 1.000 juta. Pendapatan Y = 180 &times; 5 = IDR 900 juta.<br>
            • Rasio = 1.000 : 900 = 10 : 9.
        </div>
    </div>

    <!-- SOAL 4-6 CONTEXT -->
    <div class="data-block" style="background: var(--surface-hover); border-radius: 8px; padding: 15px; margin-bottom: 25px; border: 1px solid var(--border);">
        <strong style="color: var(--primary); display: block; margin-bottom: 10px; font-size: 0.9rem;">📊 Rujukan Soal 4 - 6 (Penonton Bioskop dalam Ribu):</strong>
        <table style="width:100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
            <thead>
                <tr style="border-bottom: 1px solid var(--border); color: var(--text-primary);">
                    <th style="padding: 6px;">Kota</th>
                    <th style="padding: 6px;">Jumat</th>
                    <th style="padding: 6px;">Sabtu</th>
                    <th style="padding: 6px;">Minggu</th>
                    <th style="padding: 6px;">Rata-rata</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Jakarta</strong></td>
                    <td style="padding: 6px;">650 rb</td>
                    <td style="padding: 6px;">750 rb</td>
                    <td style="padding: 6px;">880 rb</td>
                    <td style="padding: 6px;">760 rb</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Medan</strong></td>
                    <td style="padding: 6px;">580 rb</td>
                    <td style="padding: 6px;">700 rb</td>
                    <td style="padding: 6px;">760 rb</td>
                    <td style="padding: 6px;">680 rb</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Makassar</strong></td>
                    <td style="padding: 6px;">500 rb</td>
                    <td style="padding: 6px;">530 rb</td>
                    <td style="padding: 6px;">550 rb</td>
                    <td style="padding: 6px;">527 rb</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- SOAL 4 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 4: Berapa selisih rata-rata penonton bioskop di Jakarta dan Makassar?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 217 ribu</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. 223 ribu</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">C. 233 ribu (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. 340 ribu</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Rata-rata Jakarta = (650+750+880)/3 = 760 ribu.<br>
            • Rata-rata Makassar = (500+530+550)/3 = 527 ribu.<br>
            • Selisih = 760 - 527 = 233 ribu.
        </div>
    </div>

    <!-- SOAL 5 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 5: Seberapa besar kontribusi penonton bioskop di kota Jakarta terhadap total penonton di seluruh kota pada hari Minggu?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 15%</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. 39%</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">C. 40% (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. 67%</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Penonton Minggu di Jakarta = 880 ribu.<br>
            • Total penonton Minggu = 880 + 760 + 550 = 2.190 ribu.<br>
            • Persentase = 880 / 2.190 = 40.18% &asymp; 40%.
        </div>
    </div>

    <!-- SOAL 6 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 6: Berapa kontribusi kenaikan jumlah penonton bioskop di kota Medan terhadap total kenaikan jumlah penonton di seluruh kota dari hari Jumat ke hari Sabtu?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">A. 45% (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. 50%</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">C. 55%</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. 60%</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Kenaikan Medan (Jum-Sab) = 700 - 580 = 120 ribu.<br>
            • Total Kenaikan seluruh kota = (1980 - 1710) = 270 ribu.<br>
            • Kontribusi = 120 / 270 = 44.4% &asymp; 45%.
        </div>
    </div>

    <!-- SOAL 7-9 CONTEXT -->
    <div class="data-block" style="background: var(--surface-hover); border-radius: 8px; padding: 15px; margin-bottom: 25px; border: 1px solid var(--border);">
        <strong style="color: var(--primary); display: block; margin-bottom: 10px; font-size: 0.9rem;">📊 Rujukan Soal 7 - 9 (Kinerja Penjualan Platform Digital):</strong>
        <table style="width:100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
            <thead>
                <tr style="border-bottom: 1px solid var(--border); color: var(--text-primary);">
                    <th style="padding: 6px;">Platform</th>
                    <th style="padding: 6px;">Q1 (rb)</th>
                    <th style="padding: 6px;">Q2 (rb)</th>
                    <th style="padding: 6px;">Q3 (rb)</th>
                    <th style="padding: 6px;">Q4 (rb)</th>
                    <th style="padding: 6px;">Total Pembeli</th>
                    <th style="padding: 6px;">Rating</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Toktok</strong></td>
                    <td style="padding: 6px;">520</td>
                    <td style="padding: 6px;">770</td>
                    <td style="padding: 6px;">430</td>
                    <td style="padding: 6px;">810</td>
                    <td style="padding: 6px;">2160</td>
                    <td style="padding: 6px;">4.8</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Diagram</strong></td>
                    <td style="padding: 6px;">610</td>
                    <td style="padding: 6px;">720</td>
                    <td style="padding: 6px;">500</td>
                    <td style="padding: 6px;">740</td>
                    <td style="padding: 6px;">2070</td>
                    <td style="padding: 6px;">4.9</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Youtip</strong></td>
                    <td style="padding: 6px;">370</td>
                    <td style="padding: 6px;">450</td>
                    <td style="padding: 6px;">280</td>
                    <td style="padding: 6px;">520</td>
                    <td style="padding: 6px;">1270</td>
                    <td style="padding: 6px;">4.4</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Soping</strong></td>
                    <td style="padding: 6px;">720</td>
                    <td style="padding: 6px;">680</td>
                    <td style="padding: 6px;">630</td>
                    <td style="padding: 6px;">790</td>
                    <td style="padding: 6px;">1940</td>
                    <td style="padding: 6px;">4.6</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Tersedia</strong></td>
                    <td style="padding: 6px;">500</td>
                    <td style="padding: 6px;">530</td>
                    <td style="padding: 6px;">460</td>
                    <td style="padding: 6px;">630</td>
                    <td style="padding: 6px;">1520</td>
                    <td style="padding: 6px;">4.7</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- SOAL 7 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 7: Platform manakah yang memberikan penjualan (keuntungan) terbesar berdasarkan akumulasi Q1-Q4?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. Toktok (2.530)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. Diagram (2.570)</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">C. Soping (2.820) (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. Tersedia (2.120)</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Soping total = 720 + 680 + 630 + 790 = 2.820 ribu.<br>
            • Ini adalah jumlah penjualan/kemampuan transaksi terbesar di antara platform lainnya.
        </div>
    </div>

    <!-- SOAL 8 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 8: Berapa selisih rating pelanggan pada platform dengan jumlah pembeli terbesar dan terkecil?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 0.1</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. 0.2</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">C. 0.4 (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. 0.5</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Pembeli terbesar: Toktok (2160 pembeli, rating 4.8).<br>
            • Pembeli terkecil: Youtip (1270 pembeli, rating 4.4).<br>
            • Selisih rating = 4.8 - 4.4 = 0.4.
        </div>
    </div>

    <!-- SOAL 9 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 9: Platform mana yang memberikan selisih terbesar pada Q2 dan Q3?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">A. Toktok (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. Diagram</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">C. Youtip</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. Soping</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Selisih Toktok (Q2 - Q3) = 770 - 430 = 340 (terbesar).<br>
            • Diagram = 220, Youtip = 170, Soping = 50, Tersedia = 70.
        </div>
    </div>

    <!-- SOAL 10-12 CONTEXT -->
    <div class="data-block" style="background: var(--surface-hover); border-radius: 8px; padding: 15px; margin-bottom: 25px; border: 1px solid var(--border);">
        <strong style="color: var(--primary); display: block; margin-bottom: 10px; font-size: 0.9rem;">📊 Rujukan Soal 10 - 12 (Volume Ekspor Kopi dalam Ton):</strong>
        <table style="width:100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
            <thead>
                <tr style="border-bottom: 1px solid var(--border); color: var(--text-primary);">
                    <th style="padding: 6px;">Tujuan</th>
                    <th style="padding: 6px;">Kopi Gayo</th>
                    <th style="padding: 6px;">Kopi Kintamani</th>
                    <th style="padding: 6px;">Kopi Jawa</th>
                    <th style="padding: 6px;">Kopi Toraja</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Domestik</strong></td>
                    <td style="padding: 6px;">17 ton</td>
                    <td style="padding: 6px;">11 ton</td>
                    <td style="padding: 6px;">6 ton</td>
                    <td style="padding: 6px;">8 ton</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Amerika</strong></td>
                    <td style="padding: 6px;">12 ton</td>
                    <td style="padding: 6px;">8 ton</td>
                    <td style="padding: 6px;">7 ton</td>
                    <td style="padding: 6px;">16 ton</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Eropa</strong></td>
                    <td style="padding: 6px;">16 ton</td>
                    <td style="padding: 6px;">9 ton</td>
                    <td style="padding: 6px;">3 ton</td>
                    <td style="padding: 6px;">16 ton</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 6px;"><strong>Asia</strong></td>
                    <td style="padding: 6px;">12 ton</td>
                    <td style="padding: 6px;">14 ton</td>
                    <td style="padding: 6px;">13 ton</td>
                    <td style="padding: 6px;">7 ton</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- SOAL 10 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 10: Berapa total ekspor kopi Gayo dan Toraja ke Asia dan Amerika?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 45 ton</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">B. 47 ton (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">C. 51 ton</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. 53 ton</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Ekspor ke Amerika: Gayo (12) + Toraja (16) = 28 ton.<br>
            • Ekspor ke Asia: Gayo (12) + Toraja (7) = 19 ton.<br>
            • Total = 28 + 19 = 47 ton.
        </div>
    </div>

    <!-- SOAL 11 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 11: Berapa proporsi ekspor kopi Jawa ke Eropa dari total ekspor kopi Jawa?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 6.8%</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">B. 10.3% (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">C. 16.3%</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. 28.3%</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Ekspor kopi Jawa ke Eropa = 3 ton.<br>
            • Total ekspor Kopi Jawa = 6 + 7 + 3 + 13 = 29 ton.<br>
            • Proporsi = 3 / 29 &asymp; 10.34%.
        </div>
    </div>

    <!-- SOAL 12 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 12: Jika ekspor kopi Kintamani untuk Domestik diperkirakan akan meningkat 20% dari ekspor kopi Jawa untuk Domestik pada tahun ini. Berapakah perkiraan jumlah ekspor kopi Kintamani untuk Domestik?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 7.2 ton</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. 8.2 ton</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">C. 12.2 ton (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. 13.2 ton</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Kopi Jawa Domestik = 6 ton. Peningkatan = 20% &times; 6 ton = 1.2 ton.<br>
            • Kopi Kintamani Domestik awal = 11 ton.<br>
            • Perkiraan baru = 11 + 1.2 = 12.2 ton.
        </div>
    </div>

    <!-- SOAL 13-15 CONTEXT -->
    <div class="data-block" style="background: var(--surface-hover); border-radius: 8px; padding: 15px; margin-bottom: 25px; border: 1px solid var(--border);">
        <strong style="color: var(--primary); display: block; margin-bottom: 10px; font-size: 0.9rem;">📊 Rujukan Soal 13 - 15 (Penjualan Tiket Global):</strong>
        <p style="font-size: 0.8rem; margin: 0 0 10px 0; color: var(--text-secondary);">
            <strong>Jumlah Tiket Terjual Keseluruhan:</strong> 25.000.000 tiket.<br>
            <strong>Proporsi Negara:</strong> Korea (36%), Amerika Serikat (24%), Inggris (20%), Jepang (12%), China (8%).<br>
            <strong>Ketentuan Konversi & Harga Jual:</strong><br>
            • <strong>AS:</strong> $24/tiket ($1 USD = Rp 15.000)<br>
            • <strong>China:</strong> &yen;140/tiket (&yen;1 CNY = Rp 2.500)<br>
            • <strong>Jepang:</strong> &yen;3.500/tiket (&yen;1 JPY = Rp 100)<br>
            • <strong>Korea:</strong> &omega;30.000/tiket (&omega;1 KRW = Rp 12)<br>
            • <strong>Inggris:</strong> &pound;18/tiket (&pound;1 GBP = Rp 20.000)
        </p>
    </div>

    <!-- SOAL 13 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 13: Berapa nilai penjualan tiket di Amerika dalam rupiah?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 1.440.000.000.000</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. 1.800.000.000.000</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">C. 2.100.000.000.000</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">D. 2.160.000.000.000 (Benar)</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Tiket di Amerika = 24% &times; 25.000.000 = 6.000.000 tiket.<br>
            • Harga dalam Rupiah = $24 &times; Rp 15.000 = Rp 360.000 per tiket.<br>
            • Total Penjualan = 6.000.000 &times; Rp 360.000 = Rp 2.160.000.000.000.
        </div>
    </div>

    <!-- SOAL 14 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 14: Berapa persentase peningkatan jumlah penjualan yang harus dicapai di Inggris agar nilai penjualan tiketnya sama dengan Korea?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 55%</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. 60%</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">C. 80% (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. 120%</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Harga tiket Inggris = &pound;18 &times; Rp 20.000 = Rp 360.000. Korea = &omega;30.000 &times; Rp 12 = Rp 360.000.<br>
            • Karena harga per tiket sama, rasio nilai penjualan sama dengan rasio jumlah tiket.<br>
            • Kenaikan yang dibutuhkan = (36% - 20%) / 20% = 16% / 20% = 80%.
        </div>
    </div>

    <!-- SOAL 15 -->
    <div class="question-block" style="background: var(--surface); padding: 18px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border);">
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary);">Soal 15: Berapa tambahan jumlah tiket yang harus dijual di Jepang agar rasio penjualannya terhadap China menjadi 5 : 2?</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">A. 1.000.000 tiket</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">B. 1.500.000 tiket</div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold;">C. 2.000.000 tiket (Benar)</div>
            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">D. 3.000.000 tiket</div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">
            <strong>💡 Pembahasan:</strong><br>
            • Penjualan China (8%) = 2.000.000 tiket.<br>
            • Rasio Target Jepang : China = 5 : 2. Target Jepang = (5 / 2) &times; 2.000.000 = 5.000.000 tiket.<br>
            • Penjualan Jepang awal (12%) = 3.000.000 tiket.<br>
            • Tambahan yang dibutuhkan = 5.000.000 - 3.000.000 = 2.000.000 tiket.
        </div>
    </div>
</div>`
            });
            console.log('📖 Seeded Tes Penalaran Numerik into Library');
        }
    } catch (e) {
        console.warn('Failed to seed PDF document:', e);
    }
}
