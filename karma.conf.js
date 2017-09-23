const webpackConfig = require('./webpack.config.test')
const karmaWebpack = require('karma-webpack')
const path = require('path')

const ENV = process.env.npm_lifecycle_event
const isTestWatch = ENV === 'test-watch'

module.exports = function (config) {
  const _config = {
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
      fixWebpackSourcePaths: true,
      reports: ['text-summary']
    }
  }

  config.set(_config)
}
