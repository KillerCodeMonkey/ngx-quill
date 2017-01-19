var webpackConfig = require('./webpack.config.test');

var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';

module.exports = function (config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {pattern: './karma-shim.js', watched: false}
    ],

    preprocessors: {
      './karma-shim.js': ['webpack', 'sourcemap']
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
  };

if (!isTestWatch) {
  _config.reporters.push('coverage');

  _config.coverageReporter = {
    dir: 'coverage/',
    reporters: [{
      type: 'html',
      dir: 'coverage',
      subdir: 'html',
    }, {
      type: 'json',
      dir: 'coverage',
      subdir: 'json',
      file: 'coverage-final.json'
    }, 
    {
        type: 'text-summary'
    }]
  };
}

  config.set(_config);
};