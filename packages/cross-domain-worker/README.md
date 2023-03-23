Cross-Domain Worker
===================

Correctly handles cross-domain workers with async chunks.

Usage:

```bash
$ npm install cross-domain-worker
# or
$ yarn add cross-domain-worker
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
};
```

## Workers build with Webpack

In order to properly work your Webpack Worker's `webpack.config.js` should be like this:

```js
const path = require("path");

module.exports = {
    devtool: 'source-map',
    target: 'webworker',
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/i, // this is only needed if you plan to add images to compilation
                type: 'asset/inline',
            },
        ],
    }
};

```