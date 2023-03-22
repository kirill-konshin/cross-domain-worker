const myWorker = function createWorker(workerUrl) {
    const blob = new Blob([`importScripts('${workerUrl}');`], {'type': 'application/javascript'});
    return new Worker(URL.createObjectURL(blob));
};

const worker = myWorker("http://localhost:4000/test/main.js")

worker.onmessage = ({data: {msg, ...data}}) => {
    if (msg === 'response') {
        console.log('<<< Response', data);
        const img = document.createElement('img');

        const objectURL = URL.createObjectURL(data.blob)

        // Once the image is loaded, we'll want to do some extra cleanup
        img.onload = () => URL.revokeObjectURL(objectURL);

        img.setAttribute('src', objectURL)

        document.body.appendChild(img);
    }
};

worker.postMessage({msg: 'request'});