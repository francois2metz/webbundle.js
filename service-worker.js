import { Bundle } from 'wbn';
import { Buffer } from 'buffer';

let resolveCacheLoaded;
let onceCacheLoaded;

function readBundle(file) {
  return new Promise(async (resolve, reject) => {
    const filereader = new FileReader();
    filereader.onload = async(e) => {
      const bundle = new Bundle(Buffer.from(e.target.result));
      resolve(bundle);
    }
    filereader.readAsArrayBuffer(file);
  });
}

self.addEventListener('message', (event) => {
  console.log('message');
  onceCacheLoaded = new Promise((resolve) => {
    event.waitUntil(
      caches.open('webn').then(async function(cache) {
        console.log('cache opened')
        const bundle = await readBundle(event.data);
        for (const url of bundle.urls) {
          const newUrl = new URL(url).pathname;
          const response = bundle.getResponse(url);
          cache.put(newUrl, new Response(response.body, response));
        }
        resolve();
      })
    );
  });
});

self.addEventListener('fetch', async (event) => {
  const requestedUrl = event.request.url;
  const pathname = new URL(requestedUrl).pathname;
  console.log('fetch', requestedUrl);
  if (pathname.startsWith('/webn/')) {
    event.respondWith(
      onceCacheLoaded.then(() => {
        return caches.open('webn').then(async function(cache) {
          console.log(pathname.replace('/webn/', '/'));
          const response = await cache.match(pathname.replace('/webn/', '/'));
          console.log(pathname, response.body);
          return response;
        });
      })
    );
  } else {
    event.respondWith(
      caches.open('webn').then(async function(cache) {
        const response = cache.match(pathname);
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  }
});
