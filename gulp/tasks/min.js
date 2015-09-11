var gulp    = require( 'gulp' ),
		config  = require( '../config/tasks' ),
		size    = require( 'gulp-filesize' ),
		uglify  = require( 'gulp-uglify' ),
		sourcemaps = require('gulp-sourcemaps');		
		concat  = require('gulp-concat');

gulp.task( 'min', function() {
  return gulp.src( config.production.src )
  	.pipe( soucemaps.init() )
    .pipe( uglify() )
  	.pipe( concat( config.production.name ) )
  	.pipe( sourcemaps.write() )
    .pipe( gulp.dest( config.production.dest ) )    
    .pipe( size() );
});
