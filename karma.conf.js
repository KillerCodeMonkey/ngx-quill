const webpackConfig = require('./webpack.config.test')
const karmaWebpack = require('karma-webpack')
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  const _config = {
    basePath: '',

    plugins: ['karma-coverage-istanbul-reporter', 'karma-chrome-launcher', 'karma-mocha-reporter', karmaWebpack, 'karma-sourcemap-loader', 'karma-jasmine'],

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
    browsers: ['ChromeHeadless'],
    singleRun: true
  }

  _config.reporters.push('coverage-istanbul')

  _config.coverageIstanbulReporter = {
    fixWebpackSourcePaths: true,
    reports: ['text-summary']
  }

  config.set(_config)
}
