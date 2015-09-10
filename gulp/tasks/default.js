'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var config = require('../config');


gulp.task('default', function() {
    gulp.start('js');
    gulp.watch(config.js.src, ['js']);
    gulp.watch(config.tests.src, ['karma']);
    ///watch all js files, run js, run karma
});
