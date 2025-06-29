// Nombre del cache para la aplicación
const CACHE_NAME = 'ai-life-v1';

// Lista de recursos para cachear inicialmente
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/AILife.png',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estrategia de caché: Network first, falling back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, clonarla y almacenarla en el caché
        if (event.request.method === 'GET' && response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Si falla la solicitud, intentar recuperar desde el caché
        return caches.match(event.request)
          .then(cachedResponse => {
            // Si tenemos una respuesta en caché, la devolvemos
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Si es una solicitud de página (HTML), devolver la página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Para otros recursos, devolver null (error 404)
            return null;
          });
      })
  );
});

// Actualización del service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Eliminar los caches antiguos
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestión de notificaciones push
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Notificación de emergencia',
      icon: '/icons/AILife.png',
      badge: '/icons/AILife.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'AI Life - Emergencia', options)
    );
  }
});

// Gestión de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
