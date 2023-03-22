import {createWorker} from 'cross-domain-worker';

(async () => {

    //FIXME Uncaught (in promise) DOMException: Failed to construct 'Worker': Script at 'http://localhost:4000/test/main.js' cannot be accessed from origin 'http://localhost:3000'.
    // const worker = new Worker("http://localhost:4000/test/main.js");

    const worker = await createWorker("http://localhost:4000/test/main.js");

    console.log('Worker initialized');

    // const worker = new Worker(new URL("./worker.js", import.meta.url));

    worker.onmessage = async ({data: {type, ...data}}) => {
        if (type === 'response') {
            console.log('<<< Response', data);

            const img = document.createElement('img');

            const objectURL = URL.createObjectURL(data.blob)

            // Once the image is loaded, we'll want to do some extra cleanup
            img.onload = () => URL.revokeObjectURL(objectURL);

            img.setAttribute('src', objectURL);

            document.body.appendChild(img);
        }
    };

    worker.postMessage({type: 'request'});

})();