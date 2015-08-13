var Script = function(container, onFinished, args, answers, sceneClass, answerClass, buttonClass){
	this.container   = container;
	this.scenes      = [];
	this.sceneClass  = sceneClass  || '.js-scene';
	this.answerClass = answerClass || '.js-answer';
	this.buttonClass = buttonClass || '.js-button';
	this.onFinished  = onFinished  || false
	this.args        = args;
	this.answers     = answers     || new Answers();
	this.current     = 0;
	// this.init();
}
Script.prototype = {
	init : function init(){
		var self = this;
		this.container.find(this.sceneClass).each(function(){
			self.addScene($(this))
		})
		this.start();
	},

	addScene : function addScene(el, callback, args){
		var callback = callback || false;
		this.scenes.push(new Scene(el, callback, args, this, this.answerClass, this.buttonClass))
	},
	removeScene : function removeScene(){
		this.scenes.pop().destroy()
	},


	addAt : function addAt(index, el, callback, args){
		var callback = callback || false;
		this.scenes.splice(index, 0, new Scene(el, callback, args, this, this.answerClass, this.buttonClass))
	},
	removeAt : function removeAt(index){
		this.scenes.splice(index, 1)[0].destroy()
	},


	previous : function previous(){
		this.scenes[this.current].hide();
		if(this.current > 0){
			this.untick();
			return true;
		}
		this.start();
	},
	next : function next(){
		this.scenes[this.current].hide();
		if(this.scenes.length -1 > this.current){
			this.tick();
			return true;
		}
		this.finish();
	},


	tick : function tick(){
		this.current += 1;
		this.scenes[this.current].show();
	},
	untick : function untick(){
		this.current -= 1;
		this.scenes[this.current].show();
	},

	handleFunction : function handleFunction(funct, args){
		funct.call(this, args);
	},
	handleArray : function handleArray(){
		this.formatArgsArray()
		for( let i = 0; i< this.onFinished.length; i++ ){
			this.onFinished[i].call( this, this.args[i] )
		}
	},
	formatArgsArray : function formatArgsArray(){
		if( typeof this.args == 'object' ){
			return
		}
		this.args = new Array( this.args );
	},
	finish : function finish(){
		this.container.addClass('finished')
		if(this.onFinished){
			if(typeof this.onFinished == 'function' ){
				this.handleFunction( this.onFinished, this.args )
				return
			}
			this.handleArray()
		}
	},
	start : function start(){
		this.current = 0;
		this.scenes[this.current].show();
		this.container.addClass('started')
	},
	restart: function restart(){
		this.answers.resetAll()
		this.container.removeClass('finished')
		this.start()
	},
	addCallbackToScene: function(sceneIdx, callback, arg ) {
		var scene = this.scenes[sceneIdx];
		scene.args = arg;
		scene.callback = callback.bind(scene);
	}
}