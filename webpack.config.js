"use strict";

const webpack = require('webpack');
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
    entry: './src/UbpCrsAdapter.js',
    output: {
        library: 'UbpCrsAdapter',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        path: path.resolve(__dirname, 'dist'),
        filename: 'ubpCrsAdapter.min.js'
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
    devtool: 'cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
    ]
};
