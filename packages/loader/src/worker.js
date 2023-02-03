function joinSegments(a, b) {
    return '/' + a.split('/').concat(b.split('/')).filter(Boolean).join('/');
}

function replaceOrigin(blob, base) {
    const url = new URL(blob.replace('blob:', ''));
    const search = url.searchParams.toString();
    const baseUrl = new URL(base);
    return new URL(joinSegments(baseUrl.pathname, url.pathname) + (search ? '?' + search : ''), baseUrl.origin).toString();
}

self.onmessage = ({data: {msg, payload}}) => {
    if (msg === 'base') {
        const image = require('./package.png');
        console.warn('LOADER');
        console.log('Base URL from main', payload); // returns http://localhost:4001/test/ which is right
        console.log('Image', image, 'should be localhost:4001'); // returns blob:http://localhost:3000/xxx.png, should be localhost:4001
        console.log('__webpack_public_path__', __webpack_public_path__, 'should be http://localhost:4001/test/'); // returns blob:http://localhost:3000/, should be http://localhost:4001/test/

        const imageProper = replaceOrigin(image, payload);
        console.log(imageProper);
        fetch(imageProper).then(r => console.log(r));
    }
};