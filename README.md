Cross-Domain Worker
===================

Correctly handles cross-domain (aka cross-origin) workers with Webpack async chunks.

## Usage

```bash
$ npm install cross-domain-worker
# or
$ yarn add cross-domain-worker
```

Prerequisite:

In order to properly work your Worker's `webpack.config.js` should have `target: 'webworker'` like this:

```js
module.exports = {
    target: 'webworker',
    devtool: 'source-map', // suggested for better sourcemaps support
    // ... rest of the stuff
};
```

In the main thread:

```js
import { createWorker } from 'cross-domain-worker';

const worker = await createWorker("http://localhost:4000/worker.js");
// or
createWorker("http://localhost:4000/test/main.js").then(worker => { /* your code */ });
```

In the worker:

```js
import { setPath } from 'cross-domain-worker';

self.onmessage = async (ev) => {
    if (setPath(ev)) return;

    // your code
    
    // will work as expected, e.g. will be downloaded from proper URL, and will create a separate chunk as expected
    await import('./dynamic-module');
};
```

## Webpack Asset Modules

[Webpack Asset Modules](https://webpack.js.org/guides/asset-modules/) are fully supported.

You can use standard `webpack.config.js` syntax:

```js
module.exports = {
    // ... rest of the stuff
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset', // or 'asset/inline' or 'asset/resource'
            },
        ],
    }
};
```

And then load them as usual:

```js
const {default: image} = await import('./path-to/image.png');
const res = await fetch(image);
const blob = await res.blob();
```

## More reading

Package started as solution for https://github.com/webpack/webpack/issues/16696. During exploration library-worty technique has emereged. Read the ticket for extra information on cross-origin Worker limitations.

Consider situation when you have main script in `https://a.com` and request worker from `https://b.com`.

Without the library you will get errors like `Uncaught DOMException: Failed to construct 'Worker': Script at 'http://b.com/worker.js' cannot be accessed from origin 'https://a.com'.`.

Even setting proper header `Content-Security-Policy: worker-src https://b.com` will not help.

This can be fixed by using `Blob` technique:

```js
const blob = new Blob([`importScripts('https://b.com/worker.js')`], {'type': 'application/javascript'});
const worker = new Worker(URL.createObjectURL(blob));
```

But in this case if you are using dynamic `import()` in the worker you will get error `Uncaught (in promise) DOMException: Failed to execute 'importScripts' on 'WorkerGlobalScope': The script at 'blob:http://a.com/script.js' failed to load.` — note that browser will try to load chunk from `https://a.com` (host) and not `https://b.com` (worker).

This library conveniently fixes both issues, so that "things just work".

## How to demo

```bash
npm install
npm start
```

Open http://localhost:3000 and check console.

## Similar packages

All these packages use same `Blob` technique to overcome cross-origin Worker limitations, but they do not fix the Webpack paths of chunks:

- https://www.npmjs.com/package/remote-web-worker
- https://www.npmjs.com/package/co-web-worker
- https://www.npmjs.com/package/cross-domain-worker-url
- https://www.npmjs.com/package/crossoriginworker
