/*
 * KILL SWITCH SERVICE WORKER (v10)
 * Este Service Worker está diseñado para desinstalarse a sí mismo y limpiar todo el caché.
 */
const CACHE_NAME = 'mercadona-flow-kill-v11';

self.addEventListener('install', (event) => {
    console.log('Kill Switch SW: Instalando...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Kill Switch SW: Activando y limpiando...');
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(names.map(name => caches.delete(name)));
        }).then(() => {
            console.log('Cachés eliminados. Desregistrando...');
            return self.registration.unregister();
        }).then(() => {
            return self.clients.matchAll();
        }).then((clients) => {
            console.log('Recargando clientes...');
            clients.forEach(client => {
                if (client.url && 'navigate' in client) {
                    client.navigate(client.url);
                }
            });
        })
    );
});

// No interceptar ninguna petición, dejar que pasen a la red
self.addEventListener('fetch', (event) => {
    return;
});
