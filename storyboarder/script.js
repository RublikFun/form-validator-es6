'use strict';

var Script = function( container, auto=true ) {
	this.container   = container || $('.js-script');
	this.scenes      = [];
	this.current     = 0;
	this.answers     = new Answers();
	if( auto ){
		this.init();
	}
	return this;
};
Script.prototype = {
	report: function report(){
		return this.answers.report();
	},
	setFinished : function setFinished( onFinished, args ){
		this.onFinished = onFinished  || false;
		this.args = args || false;
		return this;
	},
	setScene : function setScene( klass ){
		this.sceneClass  = klass  || '.js-scene';
		return this;
	},
	setButton : function setButton( klass ){
		this.buttonClass = klass || '.js-button';
		return this;
	},
	setAnswer : function setAnswer( klass ){
		this.answerClass = klass || '.js-answer';
		return this;
	},
	makeScenes : function makeScenes( opts ){
		if( this.answers !== undefined ){
			opts.answers = this.answers;
		}
		var self = this;
		this.container.find( this.sceneClass ).each( function(){
			self.addScene( $( this ), opts );
		} );
		return this
	},
	init : function init( opts = {} ){
		this.setFinished( opts.onFinished, opts.onFinishedArgs )
				.setScene( opts.scene )
				.setButton( opts.button )
				.setAnswer( opts.answer )
				.makeScenes( opts )
				.start();
	},

	addScene : function addScene( el, opts ){
		let scene = new Scene( el );
		scene.init( this, opts );
		this.scenes.push( scene );
	},
	removeScene : function removeScene(){
		this.scenes.pop().destroy();
	},


	addAt : function addAt( index, el, opts ){
		let scene = new Scene( el );
		scene.init( this, opts );
		this.scenes.splice( index, 0, scene );
	},
	removeAt : function removeAt( index ){
		this.scenes.splice( index, 1 )[ 0 ].destroy();
	},


	previous : function previous(){
		this.scenes[ this.current ].hide();
		if( this.current > 0 ){
			this.untick();
			return true;
		}
		this.start();
	},
	next : function next(){
		this.scenes[ this.current ].hide();
		if( this.scenes.length -1 > this.current ){
			this.tick();
			return true;
		}
		this.finish();
	},


	tick : function tick(){
		this.current += 1;
		this.scenes[ this.current ].show();
	},
	untick : function untick(){
		this.current -= 1;
		this.scenes[ this.current ].show();
	},

	handleFunction : function handleFunction( funct, args ){
		funct.call( this, args );
	},

	handleArray : function handleArray(){
		this.formatArgsArray();
		for( let i = 0; i< this.onFinished.length; i++ ){
			this.onFinished[ i ].call( this, this.args[ i ] );
		}
	},
	formatArgsArray : function formatArgsArray(){
		if( typeof this.args === 'object' ){
			return;
		}
		this.args = new Array( this.args );
	},
	finish : function finish(){
		this.container.addClass('finished');
		if( this.onFinished ){
			if( typeof this.onFinished === 'function' ){
				this.handleFunction( this.onFinished, this.args );
				return;
			}
			this.handleArray();
		}
	},
	start : function start(){
		this.current = 0;
		this.scenes[ this.current ].show();
		this.container.addClass( 'started' );
	},
	restart: function restart(){
		this.answers.resetAll();
		this.container.removeClass( 'finished' );
		this.start();
	},
	addCallbackToScene: function( sceneIdx, callback, arg ) {
		var scene = this.scenes[ sceneIdx ];
		scene.args = arg;
		scene.callback = callback.bind( scene );
	}
};
