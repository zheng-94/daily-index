// serviceWorker.js
self.addEventListener("install", (e) => {
    // 当确定要访问某些资源时，提前请求并添加到缓存中。
    // 这个模式叫做“预缓存”
    e.waitUntil(
      caches.open("service-worker-test-precache").then((cache) => {
        return cache.addAll([
          "/static/index.js",
          "/static/index.jpg",
        ]);
      })
    );
  });
  
  self.addEventListener("fetch", (e) => {
    // 缓存中能找到就返回，找不到就网络请求，之后再写入缓存并返回。
    // 这个称为 CacheFirst 的缓存策略。
    return e.respondWith(
      caches.open("service-worker-test-precache").then((cache) => {
        return cache.match(e.request).then((matchedResponse) => {
          return (
            matchedResponse ||
            fetch(e.request).then((fetchedResponse) => {
              cache.put(e.request, fetchedResponse.clone());
              return fetchedResponse;
            })
          );
        });
      })
    );
  });
  