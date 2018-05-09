const path = require('path')

let _config = {
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: {
    'ngx-quill': path.resolve(__dirname, 'index.ts')
  },
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      use: [{
        loader: 'ts-loader'
      }]
    }, {
      // instrument only testing sources with Istanbul, covers ts files
      test: /\.ts$/,
      enforce: 'post',
      use: [{
        loader: 'istanbul-instrumenter-loader',
        options: {
          embedSource: true,
          noAutoWrap: true
        }
      }],
      exclude: [
        'node_modules',
        /\.(e2e|spec)\.ts$/
      ]
    }]
  }
}

module.exports = _config
