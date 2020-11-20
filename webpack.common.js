/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const extensions = ['.js', '.ts'];

const babel = {
  test: /.(js|ts)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
  },
};

module.exports = {
  entry: [path.join(__dirname, 'index.ts')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions,
  },
  target: 'node',
  module: {
    rules: [babel],
  },
};
