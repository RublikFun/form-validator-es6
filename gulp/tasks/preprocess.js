var gulp    = require('gulp'),
		config  = require('../config'),
		babel   = require('gulp-babel'),
		concat  = require('gulp-concat');

gulp.task('preprocess', function() {
  return gulp.src( config.js.src )
  	.pipe( babel() )
  	.pipe( concat( config.js.name ) )
    .pipe( gulp.dest( config.js.dest ) );
});
