const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()]
};
