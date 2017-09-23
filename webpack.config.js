const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = {
  entry: {
    'ngx-quill': path.resolve(__dirname, 'index.ts')
  },

  output: {
    path: path.resolve(__dirname, 'bundles'),
    libraryTarget: 'umd',
    library: 'ngx-quill',
    filename: 'ngx-quill.umd.js'
  },

  externals: [nodeExternals()],

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: {
            declaration: false
          }
        }]
      }
    ]
  },

  plugins: [
  ]
}
