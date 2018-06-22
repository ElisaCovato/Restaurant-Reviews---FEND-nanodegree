// Adapted from https://developers.google.com/web/ilt/pwa/lab-caching-files-with-service-worker
'use strict';

// Files that we want to catch
var filesToCache = [
  '/',
  //cache css files
  'css/media-queries.css',
  'css/styles.css',
  //cache images
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  //cache html
  'index.html',
  'restaurant.html', 
  //cache js files
  'js/main.js',
  'js/restaurant_info.js',
  "js/dbhelper.js",
  //cache data
  'data/restaurants.json'
];

// Cache name. All the updatings happen here
var staticCacheName = 'pages-cache-1';

//We create the cache and we add the files to it.
//We wrap the event in event.waitUntil so that the event terminates
//when all the files are added to che cache succesfully
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(filesToCache);
      })
  );
});

// The service needs to be active to receives fetches
//we also delete any unused caches
self.addEventListener('activate', function(event) {
  console.log('Activating service worker...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('pages-') && cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })    
      );
    })
  );
});

//We intercept requests for those files from the network
// and respond with the files from the cache. 
//Pages that have been visited got available offline
self.addEventListener('fetch', (event) => {
  console.log(event.request);
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(response => {
      if (response) {
        console.log('Found in cache:', event.request.url);
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request).then(networkResponse => {
        if (networkResponse.status === 404) {
          console.log(networkResponse.status);
          return;
        }
        return caches.open(staticCacheName).then(cache => {
          cache.put(event.request.url, networkResponse.clone());
          console.log('Fetched and cached', event.request.url);
          return networkResponse;
        })
      })
    }).catch(error => {
      console.log('Error:', error, event.request);
      return;
    })
  );
});


