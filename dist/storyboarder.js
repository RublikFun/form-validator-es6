'use strict';

var Answer = function Answer(container) {
	this.ranges = {};
	this.required = {};
	this.container = container;
	this.value = {};
	this.validations = [];
	this.init();
};
Answer.prototype = {
	init: function init() {
		this.setRanges();
		this.setRequired();
		this.formatValue();
		this.setChange(this.container);
	},
	setValidation: function setValidation(arg) {
		if (typeof arg === 'boolean') {
			this.validations.push(arg);
			return;
		}
		this.validations = [];
	},
	getValidation: function getValidation() {
		var i,
		    allAreValid = true;
		for (i = 0; i < this.validations.length; i++) {
			if (this.validations[i] === false) {
				allAreValid = false;
				break;
			}
		}
		return allAreValid;
	},
	setRanges: function setRanges() {
		var self = this;
		$(this.container).each(function () {
			self.ranges[$(this).data('field')] = {
				max: $(this).data('max'),
				min: $(this).data('min')
			};
		});
	},
	setRequired: function setRequired() {
		var self = this;
		$(this.container).each(function () {
			if ($(this).data('required') === false) {
				self.required[$(this).data('field')] = false;
			} else {
				self.required[$(this).data('field')] = true;
			}
		});
	},
	setChange: function setChange(els) {
		var self = this;
		els.on('change', function () {
			self.callbackCheck();
			self.formatValue();
		});
	},
	setCallbackChange: function setCallbackChange(els) {
		var self = this,
		    elementsToBind;
		elementsToBind = els.filter(function () {
			if (self.hasField(this)) {
				return this;
			}
		});
		$(elementsToBind).on('change', function () {
			self.formatValue();
		});
	},
	unsetChange: function unsetChange(els) {
		var self = this,
		    elementsToBind;
		elementsToBind = els.filter(function () {
			if (self.hasField(this)) {
				return this;
			}
		});
		$(elementsToBind).off('change');
	},
	callbackCheck: function callbackCheck() {
		var self = this;
		$(this.container).each(function () {
			self.checkForCallback($(this));
		});
	},

	formatValue: function formatValue(shouldReset) {
		var self = this,
		    reset = shouldReset || false;
		$(this.container).each(function () {
			if (reset) {
				self.clearValue($(this));
			}
			self.trackValue($(this));
		});
	},
	trackValue: function trackValue(el) {
		var key = el.data('grouping');
		if (key !== undefined) {
			this.trackDimensionalValue(el, key);
		} else {
			$.extend(this.value, this.formattedValue(el));
		}
	},
	trackDimensionalValue: function trackDimensionalValue(el, key) {
		this.value[key] = this.value[key] === undefined ? {} : this.value[key];
		$.extend(this.value[key], this.formattedValue(el));
	},
	formattedValue: function formattedValue(el) {
		var val = {};
		var key = el.data('field');
		val[key] = this.getDefault(el);
		if (this.hasValue(el)) {
			val[key] = this.getValueOrDefault(el);
			this.removeError(key);
			return val;
		}
		if (this.shouldOverwrite(el)) {
			val[key] = this.getDefault(el);
			return val;
		}
		return;
	},
	getValueOrDefault: function getValueOrDefault(el) {
		var value = el.val();
		if (value === '') {
			value = this.getDefault(el);
		}
		return value;
	},
	getDefault: function getDefault(el) {
		var value = '';
		if (el.data('default') !== undefined) {
			value = el.data('default');
		}
		return value;
	},
	deleteValue: function deleteValue(el) {
		var self = this;
		$(el).each(function () {
			delete self.value[$(this).data('field')];
		});
	},
	checkForCallback: function checkForCallback(el) {
		if (this.hasValue(el)) {
			return this.revealCallback(el);
		}

		return this.revertCallback(el);
	},
	revealCallback: function revealCallback(el) {
		var callbackElement = $('.' + el.data('callback')),
		    self = this;
		if (callbackElement.length > 0) {
			callbackElement.each(function () {
				if (self.hasField(this)) {
					self.addAnswer($(this));
				}
			});
			callbackElement.addClass('active');
		}
	},
	revertCallback: function revertCallback(el) {
		var callbackElement = $('.' + el.data('callback'));
		if (callbackElement.length > 0) {
			this.clearValue(callbackElement);
			this.removeAnswer(callbackElement);
			callbackElement.removeClass('active');
		}
	},

	hasValue: function hasValue(container) {
		return this.isValidInput(container) || this.isValidCheckbox(container) || this.isValidSelect(container);
	},
	shouldOverwrite: function shouldOverwrite(el) {
		return this.isDuplicate(el) && this.isFirst(el) || !this.isDuplicate(el);
	},
	isDuplicate: function isUnique(el) {
		return $("[data-field='" + el.data('field') + "']").length > 1;
	},
	isFirst: function isFirst(el) {
		return $("[data-field='" + el.data('field') + "']").index(el) === 0;
	},
	clearValue: function clearValue(el) {
		if (this.isValidInput(el)) {
			el.val('');
		}
		el.prop('checked', false);
		el.prop('selected', false);
	},
	hasField: function hasField(el) {
		if ($(el).data('field')) {
			return true;
		}
		return false;
	},

	addError: function addError(answer) {
		$('[data-field="' + answer + '"]').addClass('error');
	},
	removeError: function removeError(answer) {
		$('[data-field="' + answer + '"]').removeClass('error');
	},

	isValid: function isValid() {
		this.setValidation();
		for (var answer in this.value) {
			if (typeof this.value[answer] === 'object') {
				this.setValidation(this.checkGroupValidity(this.value[answer]));
			} else {
				this.setValidation(this.checkIndividualValidity(answer, this.value[answer]));
			}
		}
		return this.getValidation();
	},
	checkGroupValidity: function checkGroupValidity(group) {
		var groupIsValid = true;
		for (var subAnswer in group) {
			groupIsValid = this.checkIndividualValidity(subAnswer, group[subAnswer]);
		}
		return groupIsValid;
	},
	checkIndividualValidity: function checkIndividualValidity(key, value) {
		var fieldIsValid = this.validatePresence(key, value) && this.validateRange(key, value);
		if (fieldIsValid) {
			this.removeError(key);
		}
		return fieldIsValid;
	},

	validatePresence: function validatePresence(key, value) {
		if (!this.isPresent(key, value)) {
			this.addError(key);
			return false;
		}
		return true;
	},
	validateRange: function validateRange(key, value) {
		if (!this.isBetween(key, value)) {
			this.addError(key);
			return false;
		}
		return true;
	},

	isValidInput: function isValidInput(el) {
		if (el.attr('type') === 'text') {
			return true;
		}
		return false;
	},
	isValidCheckbox: function isValidCheckbox(el) {
		if (el.prop('checked')) {
			return true;
		}
		return false;
	},
	isValidSelect: function isValidSelect(el) {
		if (el[0].tagName === 'SELECT' && el.val()) {
			return true;
		}
		return false;
	},

	isPresent: function isPresent(key, value) {
		return this.required[key] === false || value !== '';
	},
	isBetween: function isBetween(key, value) {
		if (this.ranges[key] === undefined) {
			return true;
		}
		var max = this.ranges[key].max;
		var min = this.ranges[key].min;
		if (max === undefined || min === undefined) {
			return true;
		}
		return value <= max && value >= min;
	},

	addAnswer: function addAnswer(container) {
		this.container = this.container.add(container);
		this.setCallbackChange(container);
		this.setRanges();
		this.setRequired();
	},
	removeAnswer: function removeAnswer(container) {
		this.container = this.container.not(container);
		this.unsetChange(container);
		this.setRanges();
		this.required = {};
		this.setRequired();
		this.deleteValue(container);
	}

};
'use strict';

var Answer = require('storyboarder-answer');

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
'use strict';

var Answer = require('storyboarder-answer');

var Scene = function Scene(container, callback, args, script, answerClass, buttonClass) {
	this.container = container;
	this.answerClass = answerClass || '.js-answer';
	this.button = this.findButton(buttonClass);
	this.callback = callback || false;
	this.args = args || false;
	this.bound = false;
	this.script = script || undefined;
	this.init();
};
Scene.prototype = {
	init: function init() {
		var self = this;
		this.createAnswers();
		this.button.each(function () {
			self.bindClick($(this));
		});
	},
	createAnswers: function createAnswers() {
		if (this.script === undefined) {
			this.answer = new Answer(this.container.find(this.answerClass));
			return true;
		}
		this.answer = this.script.answers.createAnswer(this.container.find(this.answerClass));
	},
	findButton: function findButton(buttonClass) {
		if (buttonClass !== undefined) {
			return this.container.find(buttonClass);
		}
		return this.container.find('.js-button');
	},
	show: function show() {
		this.container.addClass('active');
	},
	hide: function hide() {
		this.container.removeClass('active');
	},
	shake: function shake() {
		this.container.addClass('error');
	},
	unshake: function unshake() {
		this.container.removeClass('error');
	},
	handleCallback: function handleCallback() {
		var args = typeof this.args === "function" ? this.args() : this.args;

		if (this.callback) {
			this.callback(args);
		}
	},
	finalize: function finalize() {
		this.unshake();
		if (this.script !== undefined) {
			this.script.next();
		}
		this.handleCallback();
		return true;
	},
	validate: function validate() {
		this.answer.isValid();
		if ($(this.answer.container).hasClass('error')) {
			this.shake();
			return false;
		}
		this.finalize();
	},
	bindClick: function bindClick(el) {
		var self = this;
		el.click(function () {
			self.validate();
		});
		this.bound = true;
	},
	destroy: function destroy() {
		this.hide();
		delete this.answers;
		delete this;
	}
};
'use strict';

var Answers = require('storyboarder-answers');
var Scene = require('storyboarder-scene');
module.exports = {};
var Script = function Script(container, onFinished, args, answers, sceneClass, answerClass, buttonClass) {
	this.container = container;
	this.scenes = [];
	this.sceneClass = sceneClass || '.js-scene';
	this.answerClass = answerClass || '.js-answer';
	this.buttonClass = buttonClass || '.js-button';
	this.onFinished = onFinished || false;
	this.args = args;
	this.answers = answers || new Answers();
	this.current = 0;
	// this.init();
};
Script.prototype = {
	init: function init() {
		var self = this;
		this.container.find(this.sceneClass).each(function () {
			self.addScene($(this));
		});
		this.start();
	},

	addScene: function addScene(el, callback, args) {
		var callback = callback || false;
		this.scenes.push(new Scene(el, callback, args, this, this.answerClass, this.buttonClass));
	},
	removeScene: function removeScene() {
		this.scenes.pop().destroy();
	},

	addAt: function addAt(index, el, callback, args) {
		var callback = callback || false;
		this.scenes.splice(index, 0, new Scene(el, callback, args, this, this.answerClass, this.buttonClass));
	},
	removeAt: function removeAt(index) {
		this.scenes.splice(index, 1)[0].destroy();
	},

	previous: function previous() {
		this.scenes[this.current].hide();
		if (this.current > 0) {
			this.untick();
			return true;
		}
		this.start();
	},
	next: function next() {
		this.scenes[this.current].hide();
		if (this.scenes.length - 1 > this.current) {
			this.tick();
			return true;
		}
		this.finish();
	},

	tick: function tick() {
		this.current += 1;
		this.scenes[this.current].show();
	},
	untick: function untick() {
		this.current -= 1;
		this.scenes[this.current].show();
	},

	handleFunction: function handleFunction(funct, args) {
		funct.call(this, args);
	},

	handleArray: function handleArray() {
		this.formatArgsArray();
		for (var i = 0; i < this.onFinished.length; i++) {
			this.onFinished[i].call(this, this.args[i]);
		}
	},
	formatArgsArray: function formatArgsArray() {
		if (typeof this.args == 'object') {
			return;
		}
		this.args = new Array(this.args);
	},
	finish: function finish() {
		this.container.addClass('finished');
		if (this.onFinished) {
			if (typeof this.onFinished == 'function') {
				this.handleFunction(this.onFinished, this.args);
				return;
			}
			this.handleArray();
		}
	},
	start: function start() {
		this.current = 0;
		this.scenes[this.current].show();
		this.container.addClass('started');
	},
	restart: function restart() {
		this.answers.resetAll();
		this.container.removeClass('finished');
		this.start();
	},
	addCallbackToScene: function addCallbackToScene(sceneIdx, callback, arg) {
		var scene = this.scenes[sceneIdx];
		scene.args = arg;
		scene.callback = callback.bind(scene);
	}
};