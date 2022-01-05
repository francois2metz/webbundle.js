import { Bundle } from 'wbn';
import { Buffer } from 'buffer';

function readSectionLengths(result) {
  const sectionLengths = cbor.decode(result[0][3]);
  console.log(sectionLengths);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('wbn').addEventListener('input', (e) => {
    const file = e.target.files[0];
    const filereader = new FileReader();
    filereader.onload = async (e) => {
      const bundle = new Bundle(Buffer.from(e.target.result));
      const exchanges = [];
      for (const url of bundle.urls) {
        const resp = bundle.getResponse(url);
        exchanges.push({
          url,
          status: resp.status,
          headers: resp.headers,
          body: resp.body.toString('utf-8')
        });
      }
      const blob = new Blob([exchanges[0].body], {type : 'text/html'});
      const rootURL = URL.createObjectURL(blob)
      document.getElementById('iframe').src = rootURL;
    }
    filereader.readAsArrayBuffer(file);
  });
});
