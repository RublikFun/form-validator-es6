'use strict';

var Scene = function( klass ){
	this.container   = klass;
	this.bound       = false;
	return this;
};
Scene.prototype = {
	setCallback : function setCallback( callback, args ){
		this.callback = callback || false;
		this.args = args || false;
		return this;
	},
	setScript : function setScript( script ){
		this.script = script || undefined;
		return this;
	},
	setButton : function setButton( klass ){
		this.button = this.findButton( klass );
		return this;
	},
	setAnswer : function setAnswer( klass ){
		this.answerClass = klass || '.js-answer';
		return this;
	},
	init : function init(){
		var self = this;
		this.createAnswers();
		this.button.each(function(){
			self.bindClick($(this));
		});
	},
	autoInit : function autoInit( opts={} ){
		this.setCallback( opts.callback, opts.arguments )
				.setScript( opts.script )
				.setButton( opts.button )
				.setAnswer( opts.answer )
				.init();
	},
	createAnswers : function createAnswers(){
		if(this.script === undefined){
			this.answer = new Answer(this.container.find(this.answerClass));
			return true;
		}
		var answerEl = this.container.find(this.answerClass);
		this.answer = this.script.answers.createAnswer( answerEl );
	},
	findButton : function findButton(buttonClass){
		if(buttonClass !== undefined){
			return this.container.find(buttonClass);
		}
		return this.container.find('.js-button');
	},
	show : function show(){
		this.container.addClass('active');
	},
	hide : function hide(){
		this.container.removeClass('active');
	},
	shake : function shake(){
		this.container.addClass('error');
	},
	unshake : function unshake(){
		this.container.removeClass('error');
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
		if($(this.answer.container).hasClass('error')){
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
