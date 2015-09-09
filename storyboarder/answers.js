'use strict';

var Answers = function(){
	this.privateValue = {};
	this.all = [];
}
Answers.prototype = {
	createAnswer : function createAnswer(dom){
		var answer = new Answer(dom);
		this.all.push(answer);
		return answer
	},
	getRecord: function(){
		this.report();
		return this.privateValue
	},
	setRecord: function(arg){
		this.privateValue = arg
	},
	validateAll : function validateAll(){
		for(var i = 0; i< this.all.length; i++){
			this.all[i].isValid()
		}
	},
	report : function report(){
		for(var i = 0; i< this.all.length; i++){
			$.extend(this.privateValue, this.all[i].value);
		}
		return this.privateValue
	},
	resetAll : function resetAll(){
		for(var i = 0; i< this.all.length; i++){
			this.all[i].formatValue(true);
		}
		this.report();
	}
}
