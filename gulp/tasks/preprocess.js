var gulp    = require('gulp'),
		config  = require('../config/tasks'),
		babel   = require('gulp-babel'),
		concat  = require('gulp-concat'),
		sourcemaps = require('gulp-sourcemaps');

gulp.task('preprocess', function() {
  return gulp.src( config.js.src )
  	.pipe(sourcemaps.init())
  	.pipe( babel() )
  	.pipe( concat( config.js.name ) )
  	.pipe(sourcemaps.write())
    .pipe( gulp.dest( config.js.dest ) );
});
