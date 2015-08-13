var Scene = function(container, callback, args, script, answerClass, buttonClass){
	this.container   = container;
	this.answerClass = answerClass || '.js-answer';
	this.button      = this.findButton(buttonClass);
	this.callback    = callback || false;
	this.args        = args || false;
	this.bound       = false;
	this.script      = script || undefined;
	this.init();
}
Scene.prototype = {
	init : function init(){
		var self = this;
		this.createAnswers();
		this.button.each(function(){
			self.bindClick($(this))
		})
	},
	createAnswers : function createAnswers(){
		if(this.script === undefined){
			this.answer = new Answer(this.container.find(this.answerClass))
			return true
		}
		this.answer = this.script.answers.createAnswer( this.container.find(this.answerClass) );
	},
	findButton : function findButton(buttonClass){
		if(buttonClass !== undefined){
			return this.container.find(buttonClass)
		}
		return this.container.find('.js-button');
	},
	show : function show(){
		this.container.addClass('active')
	},
	hide : function hide(){
		this.container.removeClass('active')
	},
	shake : function shake(){
		this.container.addClass('error')
	},
	unshake : function unshake(){
		this.container.removeClass('error')
	},
	handleCallback: function handleCallback() {
		var args = typeof this.args === "function" ? this.args() : this.args;

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
		return true
	},
	validate : function validate(){
		this.answer.isValid();
		if($(this.answer.container).hasClass('error')){
			this.shake();
			return false
		}
		this.finalize();
	},
	bindClick : function bindClick(el){
		var self = this;
		el.click(function(){
			self.validate();
		})
		this.bound = true;
	},
	destroy: function destroy(){
		this.hide()
		delete this.answers
		delete this
	}
}