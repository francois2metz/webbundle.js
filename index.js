let serviceWorker;
navigator.serviceWorker.register(
  new URL('service-worker.js', import.meta.url),
  {type: 'module'}
).then(function (registration) {
  if (registration.installing) {
    serviceWorker = registration.installing;
  } else if (registration.waiting) {
    serviceWorker = registration.waiting;
  } else if (registration.active) {
    serviceWorker = registration.active;
  }
  if (serviceWorker) {
    serviceWorker.addEventListener('statechange', function (e) {
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('wbn').addEventListener('input', (e) => {
    const file = e.target.files[0];
    serviceWorker.postMessage(file);
    document.getElementById('iframe').src = '/webn/';
  });
});
