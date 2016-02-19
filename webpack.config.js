module.exports = {
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
        "leaflet": "L"
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