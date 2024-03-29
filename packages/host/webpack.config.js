const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        port: 3000,
        headers: ({rawHeaders}) => ({
            "Content-Security-Policy": "worker-src http://localhost:* blob:" //FIXME Has no effect!
        })
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
        ],
    },
    plugins: [new HtmlWebpackPlugin({
        template: 'src/index.html'
    })],
};
