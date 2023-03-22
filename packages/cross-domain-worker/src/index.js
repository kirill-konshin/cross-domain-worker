/**
 * With CORS
 * @param {string} workerUrl
 * @param {WorkerOptions} [options]
 * @returns {Worker}
 */
function getWorkerAsync(workerUrl, options) {
    return fetch(workerUrl)
        .then(res => res.blob())
        .then(blob => new Worker(URL.createObjectURL(blob), options));
}

/**
 * No CORS
 * @param {string} workerUrl
 * @param {WorkerOptions} [options]
 * @returns {Worker}
 */
function getWorker(workerUrl, options) {
    const blob = new Blob([`importScripts('${workerUrl}')`], {'type': 'application/javascript'});
    return  new Worker(URL.createObjectURL(blob), options);
}

const PATH = 'SET_PATH';
const ERROR = 'ERROR';

function basePath(url) {
    return url.split('/').slice(0, -1).concat('').join('/');
}

/**
 * @param {string} workerUrl
 * @param {WorkerOptions} [options]
 * @returns {Promise<Worker>}
 */
exports.createWorker = function createWorker(workerUrl, options) {
    return new Promise((resolve, reject) => {
        if (!workerUrl) throw new Error('No workerUrl provided');

        const base = basePath(workerUrl);

        const worker = getWorker(workerUrl, options);

        worker.onmessage = function onWorkerReceivedMessage(ev) {
            switch (ev.data.type) {
                case PATH:
                    if (ev.data.path !== base) {
                        reject(new Error('Path in Worker does not match path in host'));
                        return;
                    }
                    resolve(worker);
                    return;

                case ERROR:
                    console.error('Error in Worker', ev);
                    reject(new Error('Error in Worker ' + ev.data.message));
                    return;

                default:
                    console.error('Unknown message from worker', ev);
                    reject(new Error('Unknown message from Worker ' + ev.data.type));
                    return;
            }
        };

        worker.postMessage({type: PATH, path: base});
    });

}

/**
 * @param {MessageEvent} ev
 * @returns {boolean}
 */
exports.setPath = function setPath(ev) {
    try {
        if (!self) throw new Error('Function setPath has to be called in Worker Context');

        if (ev.data.type === PATH) {
            __webpack_public_path__ = __webpack_require__.p = ev.data.path;

            console.log('WORKER: Set path', __webpack_public_path__);

            self.postMessage({type: PATH, path: __webpack_public_path__});

            return true;
        }
    } catch (e) {
        self.postMessage({type: ERROR, message: e.message, stack: e.stack});
        return true;
    }
    return false;
}