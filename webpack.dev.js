const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/examples/leaflet-draw-example.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    alias: {
      buffer: path.resolve(__dirname, 'src/index.js')
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/examples/index.html'),
      path: path.resolve(__dirname, 'dist')
    })
  ],
  optimization: {
    usedExports: true,
    runtimeChunk: true
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
    // hot: true
  }
};
