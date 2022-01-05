import { Bundle } from 'wbn';
import { Buffer } from 'buffer';

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
  console.log('message', event.data);
  event.waitUntil(
    caches.open('webn').then(async function(cache) {
      console.log('cache opened')
      const bundle = await readBundle(event.data);
      for (const url of bundle.urls) {
        const newUrl = new URL(url).pathname;
        console.log(newUrl);
        const response = bundle.getResponse(url);
        cache.put(newUrl, new Response(response.body, response));
      }
    })
  );
});

self.addEventListener('fetch', async (event) => {
  const requestedUrl = event.request.url;
  const pathname = new URL(requestedUrl).pathname;
  console.log('fetch', requestedUrl);
  if (pathname.startsWith('/webn/')) {
    event.respondWith(
      caches.open('webn').then(function(cache) {
        console.log(pathname.replace('/webn/', '/'));
        return cache.match(pathname.replace('/webn/', '/')).then((result) => {
          console.log(result, result.body);
          return result;
        })
      })
    );
  } else {
    event.respondWith(
      caches.open('webn').then(function(cache) {
        return cache.match(event.request);
      })
    );
  }
});
