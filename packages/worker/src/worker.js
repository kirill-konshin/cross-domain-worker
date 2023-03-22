import {setPath} from 'cross-domain-worker';
import {base64toBlob} from "./base64toBlob";

self.onmessage = async (ev) => {
    if (setPath(ev)) return;

    const {data: {type}} = ev;

    if (type === 'request') {
        console.log('>>> Request', ev);

        const blob = await base64toBlob((await import('./package.png')).default);

        self.postMessage({type: 'response', blob});

    }
};