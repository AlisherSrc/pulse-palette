// Change the version if you changed this file
const staticCacheName = 's-app-v1';
const dynamicCacheName = 'd-app-v1';

// Change it after building the app
const assertUrls = [
    // Core
    '/index.html',
    '/offline.html',
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

});

self.addEventListener('activate', async event => {
    const cacheNames = await caches.keys()
    await Promise.all(
        cacheNames
            .filter(name => name !== staticCacheName)
            .filter(name => name !== dynamicCacheName)
            .map(name => caches.delete(name))
    )
})

// When our app makes requests to the files whether they are static or dynamic
// self.addEventListener('fetch', event => {
//     console.log(event.request.url);

//     const url = new URL(event.request.url);
//     if(url.origin === location.origin){
//         event.respondWith(cacheFirst(event.request.url));
//     }else if(url.origin !== location.origin){
//         event.respondWith(networkFirst(event.request.url));
//     } 
// });

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Use the cache for the API URL
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            caches.open(dynamicCacheName).then(cache => {
                return fetch(request)
                    .then(response => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(request);
                    });
            })
        );
    } else {
        // For non-API requests, try cache first, then network.
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request);
            })
        );
    }
});


// We use cache first if it exists
const cacheFirst = async (req) => {
    console.log("cache first")
    try {

        const cached = await caches.match(req);
        console.log(cached, await fetch(req))

        return cached ?? await fetch(req);
    } catch (err) {
        console.log(err);
    }
}

const networkFirst = async (req) => {
    const cache = await caches.open(dynamicCacheName);
    console.log("Network first")
    try {
        // Try to get data from the server
        const resp = await fetch(req);
        // If we got desired data, then we cache it
        await cache.put(req, resp.clone());
        return resp;
    } catch (e) {
        // If we couldn't fetch data from the backend
        const cached = await cache.match(req);
        return cached ?? await caches.match('/offline.html')
    }
}
