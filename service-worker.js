let resolveWebnFile;
const webnFile = new Promise((resolve, reject) => {
  resolveWebnFile = resolve;
});

function getByUrl(url) {
  return new Promise(async (resolve, reject) => {
    console.log('getByUrl');
    const file = await webnFile;
    console.log(file);
    const filereader = new FileReader();
    filereader.onload = async(e) => {
      console.log('onload');
      const bundle = new Bundle(Buffer.from(e.target.result));
      console.log(bundle.urls);
      resolve(bundle.getResponse(url));
    }
    filereader.readAsArrayBuffer(file);
  });
}

self.addEventListener('message', (event) => {
  console.log('message 4', event.data, resolveWebnFile);
  resolveWebnFile(event.data);
});

self.addEventListener('fetch', (event) => {
  const requestedUrl = event.request.url;
  const pathname = new URL(requestedUrl).pathname;
  console.log('fetch 5', requestedUrl);
  webnFile.then((file) => {
    console.log('WEBNFILE', file);
  })
  if (pathname.startsWith('/webn/')) {
    console.log('plop')
    const url = pathname.replace('/webn/', '/');
    event.respondWith(getByUrl('index.html'));
  }
});
