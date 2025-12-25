// Sentinel Framework Service Worker
const CACHE_NAME = 'sentinel-framework-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/main.js',
    '/assets/js/login.js',
    '/assets/img/logo.png'
];

// Install service worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

// Push notification event
self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'New Sentinel Framework update available',
        icon: '/assets/img/logo.png',
        badge: '/assets/img/logo.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Update',
                icon: '/assets/img/logo.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/img/logo.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('🛡️ Sentinel Framework', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});