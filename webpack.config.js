const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = {
  mode: 'development',

  entry: {
    'ngx-quill': path.resolve(__dirname, 'index.ts')
  },

  output: {
    path: path.resolve(__dirname, 'dist', 'bundles'),
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
          loader: 'ts-loader'
        }]
      }
    ]
  },

  plugins: [
  ]
}
