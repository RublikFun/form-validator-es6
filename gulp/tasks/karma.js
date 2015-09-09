'use strict';

var gulp = require('gulp');
var karma = require('karma');
var notifier = require('node-notifier');

var karmaTask = function(done) {
  var server = new karma.Server({
    configFile: process.cwd() + '/karma.conf.js'
  }, done);
  server.start();
};
var handleError = function(arg){
	if( arg > 0 ){
	  notifier.notify({
	  	title: "Something Failed",
	  	message: "sucking at something is the first step to being sort of good at something",
	  	sound: 'Sosumi'	  	
	  });
	  return;
	}
  notifier.notify({
  	title: "All Tests Passed",
  	message: "All tests passed! This is either really great or really bad.",
  	sound: 'Purr'
  });	
};
gulp.task('karma', function(){
	karmaTask(handleError);
});

module.exports = karmaTask;
