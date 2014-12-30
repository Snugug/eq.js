'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var karma = require('karma').server;

//////////////////////////////
// Internal Vars
//////////////////////////////
var karmaOptions = {
  configFile: __dirname + '/../karma.conf.js',
  singleRun: false
}

//////////////////////////////
// Export
//////////////////////////////
module.exports = function (gulp, options) {
  // Run once
  gulp.task('karma', function (done) {
    options = options || karmaOptions;
    options.singleRun = true;

    karma.start(options, done);
  });

  // Run continuously
  gulp.task('karma--dev', function (done) {
    options = options || karmaOptions;
    options.singleRun = false;

    karma.start(options, done);
  });

  // Get code coverage
  gulp.task('karma--coverage', function (done) {
    options = options || karmaOptions;
    options.singleRun = true;
    options.preprocessors = {};
    options.preprocessors['build/**/*.js'] = ['coverage'];
    options.reporters = ['coverage', 'coveralls'];
    options.coverageReporter = {
      type: 'lcov',
      dir: 'coverage/'
    }

    karma.start(options, done);
  });
}
