const CACHE_NAME = 'mercadona-flow-v1';

// Assets estáticos que se cachean al instalar
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Rutas que NUNCA deben cachearse (APIs, auth, admin, datos sensibles)
const EXCLUDED_ROUTES = [
    '/api/',
    '/auth/',
    '/admin/',
    '/_next/',
    '/supabase/',
    '/graphql',
    '/.well-known/'
];

// Extensiones de archivos que SÍ se pueden cachear
const CACHEABLE_EXTENSIONS = [
    '.html',
    '.css',
    '.js',
    '.mjs',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.woff',
    '.woff2',
    '.ttf',
    '.webp',
    '.webm',
    '.mp4',
    '.json'
];

/**
 * Verifica si una URL debe ser excluida del cache
 * @param {string} url - URL a verificar
 * @returns {boolean} - true si debe excluirse
 */
function shouldExcludeFromCache(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Excluir rutas sensibles
    for (const route of EXCLUDED_ROUTES) {
        if (pathname.startsWith(route) || pathname.includes(route)) {
            return true;
        }
    }

    return false;
}

/**
 * Verifica si una URL es cacheable basándose en la extensión
 * @param {string} url - URL a verificar
 * @returns {boolean} - true si es cacheable
 */
function isCacheableByExtension(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // La raíz siempre es cacheable
    if (pathname === '/' || pathname === '/index.html') {
        return true;
    }

    // Verificar extensión
    for (const ext of CACHEABLE_EXTENSIONS) {
        if (pathname.endsWith(ext)) {
            return true;
        }
    }

    return false;
}

/**
 * Verifica si una respuesta contiene headers sensibles que no deben cachearse
 * @param {Response} response - Respuesta a verificar
 * @returns {boolean} - true si contiene headers sensibles
 */
function hasSensitiveHeaders(response) {
    const sensitiveHeaders = ['set-cookie', 'authorization', 'www-authenticate'];

    for (const header of sensitiveHeaders) {
        if (response.headers.has(header)) {
            return true;
        }
    }

    return false;
}

/**
 * Determina si una petición/respuesta debe cachearse
 * @param {Request} request - Petición original
 * @param {Response} response - Respuesta recibida
 * @returns {boolean} - true si debe cachearse
 */
function shouldCache(request, response) {
    // Solo cachear peticiones GET
    if (request.method !== 'GET') {
        return false;
    }

    // No cachear si tiene headers sensibles
    if (hasSensitiveHeaders(response)) {
        return false;
    }

    // No cachear rutas excluidas
    if (shouldExcludeFromCache(request.url)) {
        return false;
    }

    // Solo cachear si tiene extensión cacheable o es navegación
    if (!isCacheableByExtension(request.url)) {
        // Permitir navegaciones (requests de tipo document)
        if (request.destination !== 'document') {
            return false;
        }
    }

    // Solo cachear respuestas exitosas
    return response.status === 200;
}

// ============================================
// EVENT LISTENERS
// ============================================

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Solo manejar peticiones GET
    if (request.method !== 'GET') {
        return;
    }

    // No interceptar rutas excluidas
    if (shouldExcludeFromCache(request.url)) {
        return;
    }

    // Network first, fallback to cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cachear si cumple los criterios
                if (shouldCache(request, response)) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});
