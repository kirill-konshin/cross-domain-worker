const path = require("path");

module.exports = {
    entry: './src/worker',
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        allowedHosts: 'all',
        port: 4000,
        headers: ({rawHeaders}) => {
            const originKeyOffset = rawHeaders.indexOf('Origin');
            if (originKeyOffset === -1) {
                return;
            }
            const origin = rawHeaders[originKeyOffset + 1];
            return {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
            };
        },
        proxy: {
            '/test': {
                target: 'http://localhost:4000',
                pathRewrite: {'^/test': ''},
            },
        },
    },
    target: 'webworker',
    cache: {
        type: 'filesystem',
        allowCollectingMemory: true,
    },
    output: {
        path: path.join(__dirname, 'dist'),
        crossOriginLoading: 'anonymous',
        publicPath: 'auto',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/i,
                type: 'asset/inline',
            },
        ],
    },
    externals: {
        // events: 'commonjs events',
        // 'html-entities': 'commonjs html-entities',
        // 'ansi-html-community': 'commonjs ansi-html-community'
    }
};
