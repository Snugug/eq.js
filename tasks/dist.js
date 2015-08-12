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
    stream = require('stream'),
    gutil = require('gulp-util'),
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
// Functions
//
// From http://stackoverflow.com/questions/23230569/how-do-you-create-a-file-from-a-string-in-gulp
//////////////////////////////
function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src
}

//////////////////////////////
// Polyfills
//////////////////////////////
var polyfills = [
  'Object.getPrototypeOf',
  'requestAnimationFrame',
  'Event',
  'CustomEvent',
  'Event.DOMContentLoaded',
  'getComputedStyle',
  'Array/prototype/forEach'
];

var buildPolyfill = function () {
  var fill = '(function () {',
      fillPath = './bower_components/polyfill-service/polyfills/';

  polyfills.forEach(function (poly) {
    var detect = fs.readFileSync(fillPath + poly + '/detect.js', 'utf8'),
        pfill = fs.readFileSync(fillPath + poly + '/polyfill.js', 'utf8');

    fill += 'if (!(' + detect + ')){' + pfill + '}';
  });

  fill += '}());'

  return fill;
};

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
    var polyfills = buildPolyfill();

    distPaths = distPaths || toDist;
    outPath = outPath || placeDist;

    return gulp.src(distPaths)
      .pipe(sourcemap.init())
      .pipe(insert.prepend(polyfills))
      .pipe(insert.prepend('/*! eq.js (with polyfills) v' + tag + ' (c) ' + year + ' Sam Richard with thanks to the Financial Times, MIT license */\n'))
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
  // Generate just the polyfills
  //////////////////////////////
  gulp.task('dist:polyfills', function () {
    var polyfills = buildPolyfill();

    return string_src('polyfills.min.js', polyfills)
      .pipe(sourcemap.init())
      .pipe(insert.prepend('/*! eq.js polyfills v' + tag + ' (c) ' + year + ' Sam Richard with thanks to the Financial Times, MIT license */\n'))
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
      ['dist:core', 'dist:polyfill', 'dist:polyfills'],
      'dist:gzip',
      cb
    );
  });

}
