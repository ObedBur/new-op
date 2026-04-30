self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/logo.png',
      badge: '/badge.png',
      data: {
        url: data.data?.url || '/'
      },
      actions: [
        { action: 'open', title: 'Voir le produit' },
        { action: 'close', title: 'Fermer' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data.url;
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  }
});
