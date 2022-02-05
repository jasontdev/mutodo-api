const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode: 'development',
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new NodemonPlugin()],
  externals: [nodeExternals()]
};
