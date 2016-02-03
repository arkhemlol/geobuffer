module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './build/buffer.js',
        libraryTarget: "umd",
        library: "buffer"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};