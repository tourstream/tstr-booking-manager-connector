"use strict";

const path = require('path');

module.exports = {
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [
                /node_modules/
            ],
            use: ['babel-loader']
        }]
    },
    entry: './src/BookingManagerConnector.js',
    output: {
        library: 'BookingManagerConnector',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname),
        ],
        extensions: [
            '.json',
            '.js'
        ]
    },
};

