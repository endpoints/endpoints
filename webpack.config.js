const webpack = require('webpack');
const sourceMaps = new webpack.BannerPlugin('require("source-map-support").install();', {
  raw: true,
  entryOnly: false
});

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: __dirname,
    filename: 'index.js'
  },
  externals: /^[^.].*/,
  plugins: [sourceMaps],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  devtool: 'inline-source-map'
}
