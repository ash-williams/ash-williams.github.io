self.addEventListener('install', (e) => {
    //Precache files
    const cacheName = "static-shell-v1";
    const resourcesToPrecache = [
        '/',
        'index.html',
        'src/css/main.css',
        'src/js/index.js'
    ];

    e.waitUntil(
        caches.open(cacheName)
        .then((cache) => {
            return cache.addAll(resourcesToPrecache);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
    );
});