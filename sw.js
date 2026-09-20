const CACHE_NAME = 'detachement-pwa-v1';

// Fichiers vitaux à garder en mémoire pour le mode hors-ligne
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Mise en cache des fichiers PWA');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  // Force l'activation immédiate du Service Worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // On retourne la version en cache si elle existe (hors-ligne)
        if (response) {
          return response;
        }
        // Sinon on va chercher sur internet
        return fetch(event.request);
      })
  );
});