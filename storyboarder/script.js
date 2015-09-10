'use strict';

var Script = function( container, auto=true ) {
	this.container   = container;
	this.scenes      = [];
	this.current     = 0;
	if( auto ){
		this.autoInit();
	}
	return this;
};
Script.prototype = {
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
	setAnswers: function setAnswers( answers ){
		this.answers = answers || new Answers();
		return this;
	},
	init : function init(){
		var self = this;
		this.container.find( this.sceneClass ).each( function(){
			self.addScene( $( this ) );
		} );
		this.start();
	},
	autoInit : function autoInit( opts = {} ){
		this.setFinished( opts.onFinished, opts.arguments )
				.setScene( opts.scene )
				.setButton( opts.button )
				.setAnswer( opts.answer )
				.setAnswers( opts.answers )
				.init();
	},

	addScene : function addScene( el, opts ){
		let scene = new Scene( el );
		scene.autoInit( opts );
		this.scenes.push( scene );
	},
	removeScene : function removeScene(){
		this.scenes.pop().destroy();
	},


	addAt : function addAt( index, el, opts ){
		let scene = new Scene( el );
		scene.autoInit( opts );
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
