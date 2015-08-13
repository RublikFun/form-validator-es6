var Answers = function(){
	this.privateValue = {};
	this.all = [];
	Object.defineProperty( this, 'record', {
		get: function(){
			this.report()
			return this.privateValue
		},
		set: function(arg){
			this.privateValue = arg
		}
	})
}
Answers.prototype = {
	createAnswer : function createAnswer(dom){
		var answer = new Answer(dom)
		this.all.push(answer)
		return answer
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