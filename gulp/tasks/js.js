var gulp    = require('gulp'),
		config  = require('../config'),
		babel   = require('gulp-babel'),
		concat  = require('gulp-concat'),
		jsLint   = require('gulp-jshint');

gulp.task('js', function() {
  return gulp.src( config.js.src )
		.pipe( jsLint( config.js.guidelines ) )
		.pipe( jsLint.reporter('jshint-stylish') )
  	.pipe( babel() )
  	// .pipe( concat( 'storyboarder.js' ) )
    .pipe( gulp.dest( config.js.dest ) );
});
