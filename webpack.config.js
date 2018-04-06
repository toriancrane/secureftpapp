const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  // The entry module that requires or imports the rest of your project.
  // Must start with `./`!
  entry: './app.js',
  // Place output files in `./dist/my-app.js`
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-app.js'
  },
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: '/node_modules/'
      }
    ]
  }
};