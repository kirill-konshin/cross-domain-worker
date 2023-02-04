self.onmessage = ({data: {msg, payload}}) => {
    if (msg === 'base') {
        const image = require('./package.png');
        console.warn('HOST');
        console.log('Base URL from main', payload); // returns http://localhost:3000/test/ which is right
        console.log('Image', image); // returns http://localhost:3000/test/...
        console.log('__webpack_public_path__', __webpack_public_path__); // returns http://localhost:3000/test/

        fetch(image).then(r => r.blob()).then(b => console.log(b));
    }
};