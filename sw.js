// Nome do cache
const CACHE_NAME = 'portfolio-v1.0.0';

// Arquivos para armazenar em cache
const urlsToCache = [
    '/',
    './',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    './Captura de tela 2025-09-22 105501.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Instalação do service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna a resposta do cache ou faz a requisição real
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});