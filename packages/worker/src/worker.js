import {setPath} from 'cross-domain-worker';

self.onmessage = async (ev) => {
    if (setPath(ev)) return;

    const {data: {type}} = ev;

    if (type === 'request') {
        console.log('>>> Request', ev);

        const {default: image} = await import('./package.png');
        const res = await fetch(image);
        const blob = await res.blob();

        self.postMessage({type: 'response', blob});

    }
};