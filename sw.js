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
  '/restaurant.html?id=1',
  '/restaurant.html?id=2',
  '/restaurant.html?id=3',
  '/restaurant.html?id=4',
  '/restaurant.html?id=5',
  '/restaurant.html?id=6',
  '/restaurant.html?id=7',
  '/restaurant.html?id=8',
  '/restaurant.html?id=9',
  '/restaurant.html?id=10',  
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
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => cache.addAll(filesToCache))
      .then(self.skipWaiting())
  );
});

// The service needs to be active to receives fetches
//we also delete any unused caches
self.addEventListener('activate', function(event) {
  console.log('Activating service worker...');
  event.waitUntil(
    caches.keys().then(function(staticCacheNames) {
      return Promise.all(
        staticCacheNames.filter(function(_staticCacheName) {
          return _staticCacheName.startsWith('restaurant-') &&
                 _staticCacheName != staticCacheName;
        }).map(function(_staticCacheName) {
          if (staticCacheName !== _staticCacheName) {
            return cache.delete(_staticCacheName);
          }
        })
      )
    })
  );
});

//We intercept requests for those files from the network
// and respond with the files from the cache. 
//Pages that have been visited got available offline
self.addEventListener('fetch', function(event) {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request);
    })
  );
});
