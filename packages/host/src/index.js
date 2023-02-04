const worker = new Worker(new URL('./worker.js', import.meta.url));

console.log('Host main', __webpack_public_path__);

worker.postMessage({msg: 'base', payload: __webpack_public_path__});

