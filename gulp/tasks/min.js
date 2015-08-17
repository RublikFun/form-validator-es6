var gulp    = require( 'gulp' ),
		config  = require( '../config' ),
		size    = require( 'gulp-filesize' ),
		uglify  = require( 'gulp-uglify' ),
		rename  = require( 'gulp-rename' );

gulp.task( 'min', function() {
  return gulp.src( config.production.src )
    .pipe( uglify() )
    .pipe( rename( config.production.name ) ) 
    .pipe( gulp.dest( config.production.dest ) )    
    .pipe( size() );
});
