// Change the version if you changed this file
const staticCacheName = 's-app-v1';

// Change it after building the app
const assertUrls = [
    // Core
    'index.html',

        'src/App.css',
        'src/index.css',
        'src/main.jsx',
        'src/App.jsx',
        'src/manifest.webmanifest',

        // Components
        'src/components/navbar/index.jsx',
        'src/components/navbar/navbar.module.css',
        'src/components/button/index.jsx',
        'src/components/button/button.module.css',
        'src/components/footer/index.jsx',
        'src/components/footer/footer.module.css',

        // Images
        'src/images/heart.svg',
        'src/images/logo.svg',
        'src/images/profile-icon.svg',
        'src/images/trashcan.svg'
]

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(assertUrls);

    // event.waitUntil(
    //     caches.open(staticCacheName)
    //     .then((cache) => {
    //         cache.addAll(assertUrls);
    //     })
    // )
});

self.addEventListener('activate',async event => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
        .filter(name => name !== staticCacheName)
        .map(name => caches.delete(name))
    )

    console.log('[pwa]: activate')
});

// When our app makes requests to the files whether they are static or dynamic
self.addEventListener('fetch', event => {
    console.log(event.request.url);

    event.respondWith(cacheFirst(event.request));
});

// We use cache first if it exists
const cacheFirst = async (req) => {
    console.log("cache first")
    try {

        const cached = await caches.match(req);
        console.log(cached,await fetch(req))

        return cached ?? await fetch(req);
    } catch (err) {
        console.log(err);
    }
}

