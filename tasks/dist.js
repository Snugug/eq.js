'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var paths = require('compass-options').paths(),
    rename = require('gulp-rename'),
    insert = require('gulp-insert'),
    concat = require('gulp-concat'),
    sourcemap = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

//////////////////////////////
// Internal Vars
//////////////////////////////
var toDist = [
  paths.js + '/**/*.js',
  '!' + paths.js + '/**/*.min.js'
];

var placeDist = 'dist';

//////////////////////////////
// Export
//////////////////////////////
module.exports = function (gulp, distPaths, outPath) {
  // Run once
  gulp.task('dist--each', function (done) {
    distPaths = distPaths || toDist;
    outPath = outPath || placeDist;

    gulp.src(distPaths)
      .pipe(sourcemap.init())
      .pipe(insert.prepend('!function(){null===window.a11y&&(window.a11y={})}()\n'))
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(uglify())
      .pipe(sourcemap.write('./'))
      .pipe(gulp.dest(outPath));
  });

  //
  gulp.task('dist--all', function (done) {
    distPaths = distPaths || toDist;
    outPath = outPath || placeDist;

    gulp.src(distPaths)
      .pipe(sourcemap.init())
      .pipe(concat('a11y.js'))
      .pipe(insert.prepend('!function(){null===window.a11y&&(window.a11y={})}()\n'))
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(uglify())
      .pipe(sourcemap.write('./'))
      .pipe(gulp.dest(outPath));
  });
}
