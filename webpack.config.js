module.exports = {
  entry: './es5/index.js',
  output: {
    libraryTarget: 'commonjs',
    path: __dirname,
    filename: 'index.js'
  },
  externals: [/^[^.].*/]
}
