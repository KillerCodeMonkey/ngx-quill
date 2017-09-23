const ENV = process.env.npm_lifecycle_event
const isTestWatch = ENV === 'test-watch'
const isTest = ENV === 'test' || isTestWatch
const path = require('path')

let _config = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: {
    'ngx-quill': path.resolve(__dirname, 'index.ts')
  }
}

if (isTest) {
  _config.devtool = 'inline-source-map'
}

let atlOptions = ''
if (isTest && !isTestWatch) {
  // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
  atlOptions = {
    inlineSourceMap: true,
    sourceMap: false
  }
}
_config.module = {
  rules: []
}
_config.module.rules.push({
  test: /\.ts$/,
  use: [{
    loader: 'awesome-typescript-loader',
    options: atlOptions
  }]
})

if (isTest && !isTestWatch) {
  // instrument only testing sources with Istanbul, covers ts files
  _config.module.rules.push({
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
  })
}

module.exports = _config
