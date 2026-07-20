/**
 * Service Worker for LifeFlow PWA
 * Provides offline support and caching strategies
 */

const CACHE_NAME = 'lifeflow-v1';
const RUNTIME_CACHE = 'lifeflow-runtime';

// Files to cache on install (app shell)
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching app shell');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first with cache fallback for API, cache first for static
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // API calls - network first, then cache
    if (url.pathname.startsWith('/api') || url.hostname.includes('firestore')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Static assets - cache first, then network
    if (
        request.method === 'GET' &&
        (request.destination === 'style' ||
            request.destination === 'script' ||
            request.destination === 'image' ||
            request.destination === 'font')
    ) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Navigation - network first with offline fallback
    if (request.mode === 'navigate') {
        event.respondWith(
            networkFirst(request).catch(() => {
                return caches.match('/index.html');
            })
        );
        return;
    }

    // Default - network first
    event.respondWith(networkFirst(request));
});

// Cache first strategy
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.log('[SW] Network failed for:', request.url);
        return new Response('Offline', { status: 503 });
    }
}

// Network first strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        throw error;
    }
}

// Handle push notifications
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'Emergency blood request',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'emergency',
        data: data.url ? { url: data.url } : {},
        actions: [
            { action: 'view', title: 'View Request' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'LifeFlow Alert', options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
            // Focus existing window if open
            for (const client of windowClients) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

console.log('[SW] Service Worker loaded');
