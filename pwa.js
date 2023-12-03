const staticCacheName = 's-app-v1';

const assertUrls = [
    'index.html'
]

self.addEventListener('install',event => {
    event.waitUntil(
        caches.open(staticCacheName)
        .then((cache) => {
            cache.addAll(assertUrls);
        })
    )
});

self.addEventListener('activate',event => {
    console.log('[pwa]: activate')
});