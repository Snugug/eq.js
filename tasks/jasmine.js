'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var jasmine = require('gulp-jasmine');

//////////////////////////////
// Internal Vars
//////////////////////////////
var toTest = [
  'tests/**/test-*.js'
];

//////////////////////////////
// Export
//////////////////////////////
module.exports = function (gulp, testPaths) {
  gulp.task('jasmine', function () {
    var verbose = process.argv.indexOf('--verbose') > -1 ? true : false,
        trace = process.argv.indexOf('--trace') > -1 ? true : false;

    testPaths = testPaths || toTest;

    return gulp.src(testPaths)
      .pipe(jasmine({
	       'verbose': verbose,
	       'includeStackTrace': trace
      }));
  });
}
