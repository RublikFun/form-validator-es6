var gulp    = require('gulp'),
		config  = require('../config'),
		babel   = require('gulp-babel'),
		concat  = require('gulp-concat');

gulp.task('js', [ 'lint' ], function() {
		gulp.start('preprocess');
});
