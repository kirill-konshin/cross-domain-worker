import image from './package.png';
import {base64toBlob} from "./base64toBlob";

self.onmessage = async ({data: {msg}}) => {
    if (msg === 'request') {

        //FIXME Uncaught (in promise) DOMException: Failed to execute 'importScripts' on 'WorkerGlobalScope': The script at 'blob:http://localhost:3000/src_package_png.js' failed to load.
        // const {default: image} = await import('./package.png');

        console.log('>>> Request', image);

        // const blob = new Blob([image], {type: 'image/png'}); // assumes asset/source
        const blob = await base64toBlob(image); // assumes asset/inline

        self.postMessage({msg: 'response', blob});

    }
};