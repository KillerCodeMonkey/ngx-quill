var webpackConfig = require('./webpack.config.test')
var karmaWebpack = require('karma-webpack')

var ENV = process.env.npm_lifecycle_event
var isTestWatch = ENV === 'test-watch'

module.exports = function (config) {
  var _config = {
    basePath: '',

    plugins: ['karma-coverage-istanbul-reporter', 'karma-phantomjs-launcher', 'karma-mocha-reporter', karmaWebpack, 'karma-sourcemap-loader', 'karma-jasmine'],

    frameworks: ['jasmine'],

    files: [
      {pattern: './karma-shim.js', watched: false}
    ],

    preprocessors: {
      './karma-shim.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  }

  if (!isTestWatch) {
    _config.reporters.push('coverage-istanbul')

    _config.coverageIstanbulReporter = {
      dir: 'coverage/',
      reporters: [{
        type: 'html',
        dir: 'coverage',
        subdir: 'html'
      }, {
        type: 'json',
        dir: 'coverage',
        subdir: 'json',
        file: 'coverage-final.json'
      },
      {
        type: 'text-summary'
      }]
    }
  }

  config.set(_config)
}
