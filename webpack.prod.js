const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'geobuffer.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'geobuffer'
  }
};
