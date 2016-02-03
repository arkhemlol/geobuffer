// Karma configuration
// Generated on Tue Oct 20 2015 16:39:12 GMT+0300 (RTZ 2 (зима))

module.exports = function(config) {
    'use strict';
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],


        // list of files / patterns to load in the browser
        files: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'bower_components/leaflet/dist/leaflet.js',
            {pattern: 'bower_components/delaunay/*.js', included: false},
            {pattern: 'test-main.js', included: true},
            {pattern: 'src/**/*.ts', included: false},
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'src/**/*.map', included: false},
            {pattern: 'tests/**/*spec.js', included: false},
            {pattern: 'tests/**/*.geojson', watched: true, served: true, included: false}
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            //'src/**/*.js': 'coverage'
        },

        reporters: ['progress', 'coverage', 'html'],


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
            reportName: 'bufferPolylineReport', // report summary filename; browser info by default


            // experimental
            preserveDescribeNesting: false, // folded suites stay folded
            foldAll: false // reports start folded (only with preserveDescribeNesting)
        },
        coverageReporter: {
            dir : 'tests/coverage/'
        }
    });
};
