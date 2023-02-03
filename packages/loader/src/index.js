const WorkerModule = require('./worker');

const worker = new (WorkerModule.default)();

console.log('Loader main', __webpack_public_path__);

worker.postMessage({msg: 'base', payload: __webpack_public_path__});
