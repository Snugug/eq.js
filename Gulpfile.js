var gulp = require('gulp');

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
