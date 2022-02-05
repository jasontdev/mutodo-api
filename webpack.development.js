const NodemonPlugin = require('nodemon-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  plugins: [new NodemonPlugin()]
});
