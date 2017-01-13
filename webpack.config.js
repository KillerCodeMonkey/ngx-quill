const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './index',

  output: {
    path: './bundles',
    libraryTarget: 'umd',
    library: 'ngx-quill',
    filename: 'ngx-quill.umd.js'
  },

  externals: [nodeExternals()],

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader?declaration=false']
      }
    ]
  },

  plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin()
  ]
};
