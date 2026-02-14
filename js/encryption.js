// ===== ENCRYPTION MODULE =====
const ENCRYPTION_KEY_STORAGE = 'jurnal_ai_encrypted';
const ENCRYPTION_SALT = 'jurnal_ai_salt_v1';

async function deriveKey(password) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(ENCRYPTION_SALT);

    const keyMaterial = await crypto.subtle.importKey(
        'raw', passwordBuffer, 'PBKDF2', false, ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: saltBuffer, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptData(data, password) {
    const key = await deriveKey(password);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv }, key, dataBuffer
    );

    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    return btoa(String.fromCharCode(...combined));
}

async function decryptData(encryptedString, password) {
    const key = await deriveKey(password);
    const combined = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const encryptedBuffer = combined.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv }, key, encryptedBuffer
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
}

function getAllData() {
    return {
        journals: getJournals(),
        tasks: getTasks(),
        schedules: getSchedules(),
        transactions: getTransactions(),
        habits: getHabits(),
        exportedAt: new Date().toISOString()
    };
}

function restoreAllData(data) {
    if (data.journals) localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(data.journals));
    if (data.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
    if (data.schedules) localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(data.schedules));
    if (data.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
    if (data.habits) localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data.habits));
}

async function encryptAllData() {
    const password = document.getElementById('encryption-password').value;
    if (!password || password.length < 4) {
        alert('Password minimal 4 karakter!');
        return;
    }

    try {
        const data = getAllData();
        const encrypted = await encryptData(data, password);

        localStorage.setItem(ENCRYPTION_KEY_STORAGE, encrypted);

        localStorage.removeItem(STORAGE_KEYS.JOURNALS);
        localStorage.removeItem(STORAGE_KEYS.TASKS);
        localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
        localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
        localStorage.removeItem(STORAGE_KEYS.HABITS);

        document.getElementById('encryption-password').value = '';
        updateEncryptionStatus();
        alert('✅ Data berhasil dienkripsi! Ingat password Anda.');
        location.reload();
    } catch (error) {
        console.error('Encryption error:', error);
        alert('Gagal mengenkripsi data: ' + error.message);
    }
}

async function decryptAllData() {
    const password = document.getElementById('encryption-password').value;
    if (!password) {
        alert('Masukkan password!');
        return;
    }

    const encrypted = localStorage.getItem(ENCRYPTION_KEY_STORAGE);
    if (!encrypted) {
        alert('Tidak ada data terenkripsi.');
        return;
    }

    try {
        const data = await decryptData(encrypted, password);
        restoreAllData(data);
        localStorage.removeItem(ENCRYPTION_KEY_STORAGE);

        document.getElementById('encryption-password').value = '';
        updateEncryptionStatus();
        alert('✅ Data berhasil didekripsi!');
        location.reload();
    } catch (error) {
        console.error('Decryption error:', error);
        alert('❌ Password salah atau data rusak!');
    }
}

function updateEncryptionStatus() {
    const statusEl = document.getElementById('encryption-status');
    const isEncrypted = localStorage.getItem(ENCRYPTION_KEY_STORAGE) !== null;

    if (isEncrypted) {
        statusEl.innerHTML = '<span style="color: #f59e0b;">🔒 Data terenkripsi - masukkan password untuk membuka</span>';
    } else {
        statusEl.innerHTML = '<span style="color: #10b981;">🔓 Data tidak terenkripsi</span>';
    }
}

function exportAllData() {
    const isEncrypted = localStorage.getItem(ENCRYPTION_KEY_STORAGE) !== null;

    let exportData;
    if (isEncrypted) {
        exportData = {
            encrypted: true,
            data: localStorage.getItem(ENCRYPTION_KEY_STORAGE),
            exportedAt: new Date().toISOString()
        };
    } else {
        exportData = {
            encrypted: false,
            ...getAllData()
        };
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jurnal-ai-backup-${getTodayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert('✅ Data berhasil di-export!');
}

function importAllData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importData = JSON.parse(event.target.result);

            if (importData.encrypted) {
                localStorage.setItem(ENCRYPTION_KEY_STORAGE, importData.data);
                localStorage.removeItem(STORAGE_KEYS.JOURNALS);
                localStorage.removeItem(STORAGE_KEYS.TASKS);
                localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
                localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
                localStorage.removeItem(STORAGE_KEYS.HABITS);
                alert('✅ Data terenkripsi berhasil di-import! Masukkan password untuk membuka.');
            } else {
                restoreAllData(importData);
                localStorage.removeItem(ENCRYPTION_KEY_STORAGE);
                alert('✅ Data berhasil di-import!');
            }

            updateEncryptionStatus();
            location.reload();
        } catch (error) {
            console.error('Import error:', error);
            alert('❌ File tidak valid!');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

async function clearAllData() {
    if (!confirm('⚠️ PERINGATAN: Semua data akan dihapus permanen!\n\nAnda yakin?')) return;
    if (!confirm('Ini adalah konfirmasi terakhir. Lanjutkan hapus semua data?')) return;

    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    localStorage.removeItem(ENCRYPTION_KEY_STORAGE);

    if (isCloudSyncEnabled() && supabaseClient) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                const userId = session.user.id;
                console.log('🗑️ Clearing cloud data for user:', userId);
                const { error } = await supabaseClient
                    .from('user_data')
                    .delete()
                    .eq('user_id', userId);

                if (error) {
                    console.error('Failed to clear cloud data:', error);
                } else {
                    console.log('✅ Cloud data cleared successfully');
                }
            }
        } catch (err) {
            console.error('Error clearing cloud data:', err);
        }
    }

    alert('Semua data telah dihapus (lokal dan cloud).');
    location.reload();
}

async function deleteCloudAccount() {
    if (!isCloudSyncEnabled() || !supabaseClient) {
        alert('Anda tidak login dengan akun cloud.');
        return;
    }

    if (!confirm('⚠️ PERINGATAN: Akun cloud dan semua data akan dihapus permanen!\n\nAnda yakin?')) return;
    if (!confirm('Ini adalah konfirmasi terakhir.\n\nSemua data di cloud akan hilang selamanya.\n\nLanjutkan?')) return;

    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            alert('Tidak ada session aktif. Silakan login ulang.');
            return;
        }

        const userId = session.user.id;
        console.log('🗑️ Deleting cloud account for user:', userId);

        const { error: dataError } = await supabaseClient
            .from('user_data')
            .delete()
            .eq('user_id', userId);

        if (dataError) {
            console.error('Failed to delete user data:', dataError);
        } else {
            console.log('✅ User data deleted');
        }

        await supabaseClient.auth.signOut();

        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        localStorage.removeItem(ENCRYPTION_KEY_STORAGE);
        disableCloudSync();

        alert('✅ Data cloud telah dihapus dan Anda telah logout.\n\nNote: Untuk menghapus akun sepenuhnya, hubungi admin atau hapus dari Supabase Dashboard.');
        location.reload();
    } catch (err) {
        console.error('Error deleting cloud account:', err);
        alert('Gagal menghapus akun: ' + err.message);
    }
}
