/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  watch: true,
  externals: [nodeExternals({ allowlist: ['webpack/hot/poll?1000'] })],
  plugins: [new CleanWebpackPlugin(), new HotModuleReplacementPlugin()],
});
