'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var paths = require('compass-options').paths(),
    rename = require('gulp-rename'),
    insert = require('gulp-insert'),
    concat = require('gulp-concat'),
    sourcemap = require('gulp-sourcemaps'),
    gzip = require('gulp-gzip'),
    sequence = require('run-sequence'),
    fs = require('fs'),
    uglify = require('gulp-uglify');

//////////////////////////////
// Internal Vars
//////////////////////////////
var toDist = [
  paths.js + '/**/*.js',
  '!' + paths.js + '/**/*.min.js'
];

var placeDist = 'dist';

var tag = JSON.parse(fs.readFileSync('./bower.json', 'utf8')).version,
    year = new Date().getFullYear().toString();

if (year !== '2013') {
  year = '2013-' + year;
}

//////////////////////////////
// Export
//////////////////////////////
module.exports = function (gulp, distPaths, outPath) {
  // Run once
  gulp.task('dist:core', function () {
    distPaths = distPaths || toDist;
    outPath = outPath || placeDist;

    return gulp.src(distPaths)
      .pipe(sourcemap.init())
      .pipe(insert.prepend('/*! eq.js v' + tag + ' (c) ' + year + ' Sam Richard, MIT license */\n'))
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(uglify({
        preserveComments: 'some'
      }))
      .pipe(sourcemap.write('./'))
      .pipe(gulp.dest(outPath));
  });

  //////////////////////////////
  // Attach Polyfills
  //////////////////////////////
  gulp.task('dist:polyfill', function () {
    var polyfills = fs.readFileSync('./build/polyfills.js', 'utf8');

    distPaths = distPaths || toDist;
    outPath = outPath || placeDist;

    return gulp.src(distPaths)
      .pipe(sourcemap.init())
      .pipe(insert.prepend(polyfills))
      .pipe(insert.prepend('/*! eq.js (with polyfills) v' + tag + ' (c) ' + year + ' Sam Richard, MIT license */\n'))
      .pipe(rename({
        extname: '.polyfilled.min.js'
      }))
      .pipe(uglify({
        preserveComments: 'some'
      }))
      .pipe(sourcemap.write('./'))
      .pipe(gulp.dest(outPath));
  });

  //////////////////////////////
  // GZip Files
  //////////////////////////////
  gulp.task('dist:gzip', function () {
    return gulp.src('./dist/**/*.js')
      .pipe(gzip())
      .pipe(gulp.dest('./dist/'));
  });

  //////////////////////////////
  // Full Dist Task
  //////////////////////////////
  gulp.task('dist', function (cb) {
    return sequence(
      ['dist:core', 'dist:polyfill'],
      'dist:gzip',
      cb
    );
  });

}
