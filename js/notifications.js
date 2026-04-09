// ===== PWA Notification Manager =====
// Handles requesting permissions and displaying premium, interactive lock-screen notifications.

async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('Browser does not support notifications.');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true; // Already granted
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            return true;
        } else {
            console.warn('Notification permission denied.');
            return false;
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
}

async function sendPremiumNotification(title, options = {}) {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported, cannot send premium notification.');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        // Premium default options for "Enak dipandang" and "Interaktif"
        // Mimicking the "Clean/Structured" look from user reference
        const defaultOptions = {
            body: '┃ Fokus Hari Ini\n📝 Selesaikan Jurnal Pagi\n⏰ 08:00 - 09:00',
            icon: './icons/icon-512.png',
            badge: './icons/icon.svg',
            vibrate: [200, 100, 200],
            requireInteraction: true,
            tag: 'jurnal-ai-premium-notif',
            actions: [
                {
                    action: 'open',
                    title: '🚀 Buka Aplikasi'
                },
                {
                    action: 'close',
                    title: 'Tutup'
                }
            ]
        };

        const mergedOptions = { ...defaultOptions, ...options };
        
        // Display the notification via the Service Worker (crucial for lock screen)
        await registration.showNotification(title, mergedOptions);
        console.log('Premium notification sent:', title);

    } catch (error) {
        console.error('Failed to send premium notification:', error);
    }
}

// Utility function to process VAPID Key
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Subscribe to Cloud Web Push (Anti-Kill)
async function subscribeToWebPush() {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return false;

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Web Push not supported.');
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        // Baca API URL dari pengaturan pengguna (Default: localhost:3000)
        let apiUrl = localStorage.getItem('jurnal_ai_cloud_api_url');
        if (!apiUrl || apiUrl.trim() === '') {
            apiUrl = 'http://localhost:3000';
        }
        
        let publicKeyStr = '';
        try {
            const res = await fetch(`${apiUrl}/vapidPublicKey`);
            const data = await res.json();
            publicKeyStr = data.publicKey;
        } catch (serverErr) {
            console.warn(`Gagal menyambung ke API Cloud di: ${apiUrl}`);
            alert(`Gagal berlangganan Push Server: Tidak bisa menghubungi ${apiUrl}. Pastikan URL valid dan server menyala.`);
            return false;
        }

        const applicationServerKey = urlB64ToUint8Array(publicKeyStr);

        // Mendaftarkan Subscription Asli di Safari
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        });

        console.log('✅ Web Push Subscription successful:', JSON.stringify(subscription));

        // Kirim hasil ini ke Server Push (Render/Vercel/Localhost)
        await fetch(`${apiUrl}/subscribe`, {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });

        alert(`Berhasil Daftar Cloud Push ke peladen: ${apiUrl}\nSaat server mengirim ping, HP Anda akan berbunyi di Lock Screen!`);
        return true;
    } catch (error) {
        console.error('Gagal saat berlangganan Push:', error);
        alert('Gagal daftar Cloud Push: ' + error.message);
        return false;
    }
}

// Window attachment for global access
window.requestNotificationPermission = requestNotificationPermission;
window.sendPremiumNotification = sendPremiumNotification;
window.subscribeToWebPush = subscribeToWebPush;

// ===== iOS LOCKSCREEN WIDGET (PUSH NOTIFICATION BASED) =====
async function generateDailyLockscreenWidget() {
    try {
        // Fetch Tasks (Menunggu)
        const tasks = typeof getTasks === 'function' ? await getTasks() : [];
        const pendingTasks = tasks.filter(t => !t.done).length;

        // Fetch Wallets (Saldo)
        const wallets = typeof getWallets === 'function' ? await getWallets() : [];
        const totalBalance = wallets.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0);

        // Fetch Budget and Expenses
        let budgetStr = 'Tidak diatur';
        // Ensure STORAGE_KEYS is accessible or fallback to string literal
        const storageKeyBudget = (typeof STORAGE_KEYS !== 'undefined' && STORAGE_KEYS.GLOBAL_BUDGET) ? STORAGE_KEYS.GLOBAL_BUDGET : 'jurnal_ai_global_budget';
        const globalBudget = parseInt(localStorage.getItem(storageKeyBudget));
        
        if (globalBudget && globalBudget > 0 && typeof getTransactions === 'function') {
            const transactions = await getTransactions();
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            
            const todayExpenses = transactions
                .filter(t => t.date === todayStr && t.type === 'expense')
                .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
                
            const remaining = globalBudget - todayExpenses;
            
            if (remaining >= 0) {
                budgetStr = `Sisa Rp ${remaining.toLocaleString('id-ID')}`;
            } else {
                budgetStr = `Over Rp ${Math.abs(remaining).toLocaleString('id-ID')} ⚠️`;
            }
        }

        const title = '📱 Jurnal AI: Daily Summary';
        const bodyContent = `📝 Tugas aktif: ${pendingTasks}\n💰 Saldo: Rp ${totalBalance.toLocaleString('id-ID')}\n📉 Budget Harian: ${budgetStr}\n\nTekan untuk buka aplikasi.`;

        await sendPremiumNotification(title, {
            body: bodyContent,
            tag: 'daily-summary-widget',
            requireInteraction: true // Keep it on screen for iOS
        });
        
        console.log('Daily Lockscreen Widget generated and sent.');
    } catch (error) {
        console.error('Error generating lockscreen widget notification:', error);
    }
}

window.generateDailyLockscreenWidget = generateDailyLockscreenWidget;

// ===== AUTOMATIC TIME-BASED TRIGGER (Widget, Prayers, Schedules) =====
// Bekerja maksimal di iOS jika app dalam posisi background/standby.
async function checkScheduledWidget() {
    const now = new Date();
    const currentHm = now.toTimeString().slice(0, 5);
    const todayStr = now.toISOString().split('T')[0];

    // 1. Daily Lockscreen Widget (Custom Time)
    const widgetEnabled = localStorage.getItem('jurnal_ai_widget_enabled') !== 'false';
    const widgetTime = localStorage.getItem('jurnal_ai_widget_time') || '06:00';
    
    if (widgetEnabled && currentHm >= widgetTime) {
        const lastSent = localStorage.getItem('jurnal_ai_last_widget_sent');
        if (lastSent !== todayStr && typeof generateDailyLockscreenWidget === 'function') {
            generateDailyLockscreenWidget();
            localStorage.setItem('jurnal_ai_last_widget_sent', todayStr);
            console.log('✅ Auto-triggered Daily Lockscreen Widget for today.');
        }
    }

    // 2. Prayer Times Reminder
    const storageKeyData = (typeof STORAGE_KEYS !== 'undefined' && STORAGE_KEYS.PRAYER_DATA) ? STORAGE_KEYS.PRAYER_DATA : 'jurnal_ai_prayer_data';
    const prayerData = JSON.parse(localStorage.getItem(storageKeyData) || '{}');
    
    if (prayerData.key && prayerData.key.includes(todayStr) && prayerData.timings) {
        const timings = prayerData.timings;
        // Hanya cek 5 waktu utama
        const prayersToCheck = {
            'Subuh': timings['Fajr'],
            'Dzuhur': timings['Dhuhr'],
            'Ashar': timings['Asr'],
            'Maghrib': timings['Maghrib'],
            'Isya': timings['Isha']
        };

        for (const [name, time] of Object.entries(prayersToCheck)) {
            if (!time) continue;
            // Clean time string just in case
            const cleanTime = time.substring(0, 5);
            const notifiedKey = `jurnal_ai_prayer_notif_${todayStr}_${name}`;
            
            if (currentHm === cleanTime && !localStorage.getItem(notifiedKey)) {
                if (typeof sendPremiumNotification === 'function') {
                    sendPremiumNotification(`🕌 Waktu Sholat ${name}`, {
                        body: `Telah masuk waktu sholat ${name} (${cleanTime}) untuk wilayah Anda. Mari bersiap!`,
                        tag: `prayer-${name}`
                    });
                    localStorage.setItem(notifiedKey, 'true');
                }
            }
        }
    }

    // 3. Planner Schedules Reminder (15 mins before)
    if (typeof getSchedules === 'function') {
        const schedules = await getSchedules();
        const in15Min = new Date(now.getTime() + 15 * 60000); 
        
        schedules.forEach(s => {
            const scheduleTime = new Date(s.datetime);
            // Cek jika jadwal ada di 15 menit ke depan (margin 1 menit agar presisi setInterval)
            if (Math.abs(scheduleTime - in15Min) < 60000) {
                const notifiedKey = `jurnal_ai_sched_notif_${s.id}_${todayStr}`;
                if (!localStorage.getItem(notifiedKey)) {
                    if (typeof sendPremiumNotification === 'function') {
                        sendPremiumNotification('📅 Jadwal Mendatang', {
                            body: `${s.title} akan dimulai dalam 15 menit!`,
                            tag: `schedule-${s.id}`
                        });
                        localStorage.setItem(notifiedKey, 'true');
                    }
                }
            }
        });
    }
}

// Cek saat aplikasi dimuat/dibuka (jika terlanjur ter-kill oleh iOS)
document.addEventListener('DOMContentLoaded', checkScheduledWidget);
// Cek saat masuk background atau di-"Lock"
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') checkScheduledWidget();
});
// Cek berkala setiap 1 menit (Aktif jika HP tidak me-kill Safari)
setInterval(checkScheduledWidget, 60000);
