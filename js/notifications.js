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

// Window attachment for global access
window.requestNotificationPermission = requestNotificationPermission;
window.sendPremiumNotification = sendPremiumNotification;
