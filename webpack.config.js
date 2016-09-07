var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    target: "web",
    entry: {
        buffer: ['./src/index.js'],
        client: './src/client/client.js'
    },
    output: {
        filename: './build/[name].js',
        libraryTarget: "umd",
        library: "[name]",
        chunkFilename: "[id].js"
    },
    externals: {
        "leaflet": "L",
        "jquery": "jQuery"
    },
    resolve: {
        extensions: ['', '.js', '.css', '.svg', '.png', '.jpeg', '.jpg'],
        modules: ['node_modules', 'src']
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.(png|svg|jpeg|jpg)$/, loader: 'url-loader?limit=100000&name=./build/[hash].[ext]'}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/client/index.html',
            filename: './.tmp/index.html'
        }),
        new ExtractTextPlugin("./build/bundle.css")
    ],
    debug: true,
    devtool: 'source-map',
    devServer: {
        contentBase: './.tmp'
    }
};