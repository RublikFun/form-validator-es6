var gulp    = require('gulp'),
		config  = require('../config'),
		jsLint   = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src( config.js.src )
		.pipe( jsLint( config.js.guidelines ) )
		.pipe( jsLint.reporter('jshint-stylish') );
});
