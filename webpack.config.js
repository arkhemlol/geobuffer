var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
module.exports = {
    target: "web",
    entry: {
        buffer: './src/index.ts',
        helpers: './src/helpers.ts'
    },
    output: {
        filename: './build/[name].js',
        libraryTarget: "umd",
        library: "[name]"
    },
    externals: {
        "leaflet": "L",
        "jquery": "jQuery"
    },
    resolve: {
        extensions: ['', '.js', '.ts'],
        modules: ['node_modules', 'src']
    },
    module: {
        loaders: [
            {test: /\.ts$/, exclude: '/node_modules/', loader: 'ts-loader'},
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/client/index.html',
            filename: './.tmp/index.html'
        })
    ],
    debug: true,
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './.tmp',
        historyApiFallback: true
    }
};