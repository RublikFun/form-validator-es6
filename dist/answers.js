'use strict';
var Answer = require('./answer.js');

var Answers = function Answers() {
	this.privateValue = {};
	this.all = [];
};
Answers.prototype = {
	createAnswer: function createAnswer(dom) {
		var answer = new Answer(dom);
		this.all.push(answer);
		return answer;
	},
	getRecord: function getRecord() {
		this.report();
		return this.privateValue;
	},
	setRecord: function setRecord(arg) {
		this.privateValue = arg;
	},
	validateAll: function validateAll() {
		for (var i = 0; i < this.all.length; i++) {
			this.all[i].isValid();
		}
	},
	report: function report() {
		for (var i = 0; i < this.all.length; i++) {
			$.extend(this.privateValue, this.all[i].value);
		}
		return this.privateValue;
	},
	resetAll: function resetAll() {
		for (var i = 0; i < this.all.length; i++) {
			this.all[i].formatValue(true);
		}
		this.report();
	}
};
module.exports = Answers;