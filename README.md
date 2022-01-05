# webbundle.js

This in an experimental implementation of the Web Bundle specification in the browser.

It load the webn file in a service worker, it fill the cache and it serve it when requested.

## Usage

    yarn
    yarn dev

And go to http://localhost:1234/

## Caveat / Limitations

If the webn app unregister the service worker, stuff will not work.

## Resources

- https://github.com/WICG/webpackage
- https://web.dev/web-bundles/#playing-around-with-web-bundles

## License

(c) 2022 François de Metz

MIT
