'use strict';

var gulp = require('gulp');
var karma = require('karma');
var sysNotifier = require('../util/sysNotifier');
var config = require('../config/karma.conf')
var args = require('yargs').argv
var karmaParseConfig = require('karma/lib/config').parseConfig;

function runKarma( options, done ) {

	var configFilePath = process.cwd() + '/gulp/config/karma.conf.js';

	var config = karmaParseConfig(configFilePath, {});

    Object.keys(options).forEach(function(key) {
      config[key] = options[key];
    });

  var server = new karma.Server( config, done );	
  server.start();

}

function processFile( file ){
	var added = file || '*';
			added += '.js';
	var suite = [ 'spec/fixtures/**/*', 'dist/storyboarder.js', 'spec/tests/'+added ];
	return suite;
}
function processRun( bool ){
	if( bool == 'false' ){
		return false;
	}
	return true;
}

gulp.task('karma', function(){
	runKarma({singleRun: processRun( args.single ), 
						files: processFile( args.file ) }, sysNotifier);
});

module.exports = runKarma;
