var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';
var isTest = ENV === 'test' || isTestWatch;

var _config = {
  resolve: {
    extensions: ['', '.ts', '.js']
  }
}

if (isTest) {
    _config.devtool = 'inline-source-map';
}

var atlOptions = '';
if (isTest && !isTestWatch) {
  // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
  atlOptions = 'inlineSourceMap=true&sourceMap=false';
}

_config.module = {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader?' + atlOptions]
      }
    ],
    ts: './webpack.config.test.json'
}

if (isTest && !isTestWatch) {
    // instrument only testing sources with Istanbul, covers ts files
    _config.module.postLoaders = [{
      test: /\.ts$/,
      loader: 'istanbul-instrumenter-loader?embedSource=true&noAutoWrap=true',
      exclude: [
          'node_modules',
          /\.(e2e|spec)\.ts$/
      ]
    }];
}

module.exports = _config;
