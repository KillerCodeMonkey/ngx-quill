// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
process.env.CHROME_BIN = require('puppeteer').executablePath()
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-mocha-reporter'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    preprocessors: {
      'src/**/*.ts': ['coverage']
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/ngx-quill'),
      reporters: [
        { type: 'html',
          subdir: 'report-html' },
        { type: 'lcovonly',
          subdir: '.',
          file: 'report-lcovonly.txt' },
        { type: 'text-summary',
          subdir: '.',
          file: 'text-summary.txt' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    },
    reporters: ['mocha', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    restartOnFileChange: true
  })
}
