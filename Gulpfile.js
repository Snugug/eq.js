var gulp = require('gulp');

//////////////////////////////
// Begin Lint Tasks
//////////////////////////////
require('./tasks/jshint')(gulp, [
  'build/**/*.js',
  '!build/**/*.min.js'
]);

//////////////////////////////
// Begin Test Tasks
//////////////////////////////
require('./tasks/karma')(gulp);

//////////////////////////////
// Dist Tasks
//////////////////////////////
require('./tasks/dist')(gulp, [
  'build/**/eq.js'
]);

//////////////////////////////
// Custom Tasks
//////////////////////////////
gulp.task('dev', ['jshint--dev', 'karma--dev']);
gulp.task('travis', ['karma', 'karma--coverage']);
gulp.task('build', ['dist--each', 'dist--all']);
