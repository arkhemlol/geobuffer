// Karma configuration
// Generated on Tue Oct 20 2015 16:39:12 GMT+0300 (RTZ 2 (зима))
var webpackConfig = require('webpack.config.js');
module.exports = function(config) {
    'use strict';
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'jasmine-matchers', 'chai'],


        // list of files / patterns to load in the browser
        files: [
            'tests/**/*.spec.ts'
        ],

        preprocessors: {
           'tests/**/*.ts': ['webpack', 'coverage']
        },

        reporters: ['progress', 'coverage', 'html', 'mocha'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        //the default configuration
        htmlReporter: {
            outputDir: 'tests/reports/', // where to put the reports
            templatePath: null, // set if you moved jasmine_template.html
            focusOnFailures: true, // reports show failures on start
            namedFiles: false, // name files instead of creating sub-directories
            pageTitle: null, // page title for reports; browser info by default
            urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
            reportName: 'bufferReport', // report summary filename; browser info by default


            // experimental
            preserveDescribeNesting: false, // folded suites stay folded
            foldAll: false // reports start folded (only with preserveDescribeNesting)
        },
        coverageReporter: {
            dir : 'tests/coverage/'
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo:true
        }
    });
};
