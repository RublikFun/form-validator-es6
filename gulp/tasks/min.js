var gulp    = require( 'gulp' ),
		config  = require( '../config' ),
		size    = require( 'gulp-filesize' ),
		uglify  = require( 'gulp-uglify' ),
		concat  = require('gulp-concat');

gulp.task( 'min', function() {
  return gulp.src( config.production.src )
    .pipe( uglify() )
  	.pipe( concat( config.production.name ) )
    .pipe( gulp.dest( config.production.dest ) )    
    .pipe( size() );
});
