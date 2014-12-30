'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    paths = require('compass-options').paths(),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

//////////////////////////////
// Internal Vars
//////////////////////////////
var toLint = [
  paths.js + '/**/*.js',
  '!' + paths.js + '/**/*.min.js'
];

module.exports = function (gulp, lintPaths) {
  gulp.task('jshint', function () {
    lintPaths = lintPaths || toLint;

    return gulp.src(lintPaths)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(reload({stream: true}));
  });

  gulp.task('jshint--dev', function () {
    lintPaths = lintPaths || toLint;

    gulp.watch(lintPaths, ['jshint']);
  });
}
