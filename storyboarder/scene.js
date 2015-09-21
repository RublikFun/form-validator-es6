'use strict';

var Scene = function( klass ){
	this.container   = klass;
	this.bound       = false;
	return this;
};
Scene.prototype = {
	setCallback : function setCallback( callback=false, args=false ){
		this.callback = callback;
		this.args = args;
		return this;
	},
	setScript : function setScript( script ){
		this.script = script || undefined;
		return this;
	},
	setButton : function setButton( klass='.js-button' ){
		this.button = this.findButton( klass );
		return this;
	},
	setAnswer : function setAnswer( klass='.js-answer' ){
		this.answerClass = klass;
		return this;
	},
	bindClicks : function bindClicks(){
		var self = this;
		this.button.each(function(){
			self.bindClick($(this));
		});
	},
	init : function init( script, opts={} ){
		this.setCallback( opts.callback, opts.callbackArgs )
				.setScript( script )
				.setButton( opts.button )
				.setAnswer( opts.answer )
				.createAnswers()
				.bindClicks();
	},
	createAnswers : function createAnswers(){
		if(this.script === undefined){
			this.answer = new Answer(this.container.find(this.answerClass));
			return this;
		}
		var answerEl = this.container.find(this.answerClass);
		this.answer = this.script.answers.createAnswer( answerEl );
		return this
	},
	findButton : function findButton(buttonClass){
		if(buttonClass !== undefined){
			return this.container.find(buttonClass);
		}
		return this.container.find('.js-button');
	},
	show : function show(){
		this.container.addClass('active').addClass('js-active');
	},
	hide : function hide(){
		this.container.removeClass('active').removeClass('js-active');
	},
	shake : function shake(){
		this.container.addClass('js-error').addClass('error');
	},
	unshake : function unshake(){
		this.container.removeClass('js-error').removeClass('error');
	},
	handleCallback: function handleCallback() {
		var args = typeof this.args === 'function' ?
				this.args() : this.args;

		if ( this.callback) {
			this.callback( args );
		}
	},
	finalize : function finalize(){
		this.unshake();
		if(this.script !== undefined){
			this.script.next();
		}
		this.handleCallback();
		return true;
	},
	validate : function validate(){
		this.answer.isValid();
		if($(this.answer.container).hasClass('js-error')){
			this.shake();
			return false;
		}
		this.finalize();
	},
	bindClick : function bindClick(el){
		var self = this;
		el.click(function(){
			self.validate();
		});
		this.bound = true;
	},
	destroy: function destroy(){
		this.hide();
		delete this.answers;
		delete this;
	}
};
