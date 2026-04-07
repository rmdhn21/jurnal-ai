// Service Worker for Jurnal AI PWA
const CACHE_NAME = 'jurnal-ai-v16';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './manifest.json',
    './icons/apple-touch-icon.png',
    './icons/icon-512.png',
    './icons/icon.svg',
    // Core / Data Layer
    './js/storage.js',
    './js/storage-idb.js',
    './js/cloud-sync.js',
    './js/ai.js',
    './js/ai-assistant.js',
    './js/ai-commands.js',
    './js/ai-finance.js',
    './js/ai-tutors.js',
    './js/theme.js',
    './js/encryption.js',
    './js/auth.js',
    './js/charts.js',
    './js/notifications.js',
    // UI Modules
    './js/backup-tags.js',
    './js/journal-ui.js',
    './js/planner-ui.js',
    './js/finance-ui.js',
    './js/habits-goals-ui.js',
    './js/navigation-settings.js',
    './js/dashboard.js',
    './js/dashboard-widgets.js',
    './js/wallet-budget-ui.js',
    './js/library-ui.js',
    // Feature Modules
    './js/features.js',
    './js/extras.js',
    './js/edit-modal.js',
    './js/onboarding.js',
    './js/insight.js',
    './js/gamification.js',
    './js/hadith.js',
    './js/brain-boost.js',
    './js/journal-templates.js',
    './js/motivation.js',
    './js/islam-tracker.js',
    './js/todo-today.js',
    './js/english-hse.js',
    './js/english-fluency.js',
    './js/hse-rig.js',
    './js/epls.js',
    './js/life-balance.js',
    './js/nutrition-tracker.js',
    './js/workout-tracker.js',
    './js/lesson-tools.js',
    // Learning Modules
    './js/learn-shared.js',
    './js/learn-automotive.js',
    './js/learn-coding.js',
    './js/learn-hsse.js',
    './js/learn-investment.js',
    './js/learn-pertamina.js',
    './js/learn-physics.js',
    './js/learn-psychology.js',
    './js/mastery-dashboard.js',
    // Experimental / Misc
    './js/jarvis-ui.js',
    './js/jarvis-voice.js',
    // App Initialization
    './js/app-init.js'
];


// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.log('Cache install failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - Network first, then cache fallback
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Update cache with fresh response
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        // If both fail and it's a navigation, show index.html
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

// Handling Notification Interactions
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.', event);

    event.notification.close(); // Close the notification

    if (event.action === 'close') {
        console.log('Notification closed by user via action button.');
        return;
    }

    // Default action (or specific 'open' action) - try to focus the app or open it
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
