const path = require("path");
module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        port: 4001,
        headers: ({ rawHeaders }) => {
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
                target: 'http://localhost:4001',
                pathRewrite: { '^/test': '' },
                secure: false,
            },
        },
    },
    target: 'web',
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
                test: /\.(png)$/,
                type: 'asset/resource',
            },
            {
                test: /worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        inline: 'fallback',
                    },
                },
            },
        ],
    },
};
