var Answer = function(container){
	this.ranges      = {};
	this.required    = {};
	this.container   = container;
	this.value       = {};
	this.validations = [];
	Object.defineProperty( this, 'validation', {
		get: function(){
      var i, allAreValid = true;
      for(i = 0; i < this.validations.length; i++) {
          if(this.validations[i] === false) {
              allAreValid = false;
              break;
          }
      }
      return allAreValid;
		},
		set: function(arg){
			if(typeof arg === 'boolean'){
				this.validations.push(arg);
				return;
			}
			this.validations = [];
		}
	});
	this.init();	
};
Answer.prototype = {
	init: function init(){
		this.setRanges();
		this.setRequired();
		this.formatValue();
		this.setChange(this.container);
	},
	setRanges: function setRanges(){
		var self = this;
		$(this.container).each(function(){
			self.ranges[$(this).data('field')] = {
				max: $(this).data('max'), 
				min: $(this).data('min')
			};
		});
	},
	setRequired: function setRequired(){
		var self = this;
		$(this.container).each(function(){
			if($(this).data('required') === false ){
				self.required[$(this).data('field')] = false;
			} else {
				self.required[$(this).data('field')] = true;
			}
		});
	},
	setChange: function setChange(els){
		var self = this;
		els.on( 'change', function(){
				self.callbackCheck();
				self.formatValue();
			});
	},
	setCallbackChange: function setCallbackChange(els){
		var self = this, elementsToBind;
		elementsToBind = els.filter(function(){	
			if(self.hasField(this)){
				return this;
			}
		});
		$(elementsToBind).on( 'change', function(){
				self.formatValue();
			});
	},	
	unsetChange: function unsetChange(els){
		var self = this, elementsToBind;
		elementsToBind = els.filter(function(){	
			if(self.hasField(this)){
				return this;
			}
		});
		$(elementsToBind).off('change');
	},		
	callbackCheck: function callbackCheck(){
		var self = this;
		$(this.container).each(function(){
			self.checkForCallback($(this));
		});
	},

	formatValue: function formatValue(shouldReset){
		var self = this, reset = shouldReset || false;
		$(this.container).each(function(){
			if(reset){
				self.clearValue($(this));
			}					
			self.trackValue( $(this) );
		});
	},	
	trackValue: function trackValue(el){
		var key = el.data('grouping');
		if(key !== undefined){
			this.trackDimensionalValue(el, key);
		} else {
			$.extend( this.value, this.formattedValue(el) );
		}
	},
	trackDimensionalValue: function trackDimensionalValue(el, key){
		this.value[key] = this.value[key] === undefined ? {} : this.value[key];
		$.extend( this.value[key], this.formattedValue(el) );
	},
	formattedValue: function formattedValue(el){
		var val = {};
		var key = el.data('field');
				val[key] = this.getDefault( el );		
		if( this.hasValue(el) ){
			val[key] = this.getValueOrDefault( el );
			this.removeError( key );
			return val;
		}
		if( this.shouldOverwrite(el) ){
			val[key] = this.getDefault( el );					
			return val;
		}
		return;
	},
	getValueOrDefault: function getValueOrDefault( el ){
		var value = el.val();
		if( value === '' ){
			value = this.getDefault( el );
		}
		return value;
	},
	getDefault: function getDefault( el ){
		var value = '';
		if( el.data('default') !== undefined ){
			value = el.data('default');
		}
		return value;
	},
	deleteValue: function deleteValue( el ){
		var self = this;
		$(el).each(function() {
			delete self.value[$(this).data('field')];
		});
	},
	checkForCallback: function checkForCallback(el){
		if ( this.hasValue(el) ) {
			return this.revealCallback(el);
		}

		return this.revertCallback(el);
	},
	revealCallback: function revealCallback(el){
		var callbackElement = $('.' + el.data('callback')),
		self = this;
		if(callbackElement.length > 0){
			callbackElement.each(function() {
				if(self.hasField(this)){
					self.addAnswer($(this));
				}
			});
			callbackElement.addClass('active');
		}
	},
	revertCallback: function revertCallback(el){
		var callbackElement = $('.' + el.data('callback'));
		if(callbackElement.length > 0){		
			this.clearValue(callbackElement);
			this.removeAnswer(callbackElement);
			callbackElement.removeClass('active');
		}
	},


	hasValue: function hasValue(container){
		return this.isValidInput(container) || this.isValidCheckbox(container) || this.isValidSelect(container);
	},
	shouldOverwrite: function shouldOverwrite(el){
		return ( this.isDuplicate(el) && this.isFirst(el) ) || !this.isDuplicate(el);
	},
	isDuplicate: function isUnique(el){
		return $("[data-field='"+el.data('field')+"']").length > 1;
	},
	isFirst: function isFirst(el){
		return $("[data-field='"+el.data('field')+"']").index(el) === 0;
	},
	clearValue: function clearValue(el){
		if( this.isValidInput(el) ){
			el.val('');
		}
		el.prop('checked', false);
		el.prop('selected', false);
	},
	hasField: function hasField( el ){
		if ($(el).data('field')) { 
			return true;
		}
		return false;
	},

	addError: function addError(answer){
		$('[data-field="'+answer+'"]').addClass('error');
	},
	removeError: function removeError(answer){
		$('[data-field="'+answer+'"]').removeClass('error');
	},	


	isValid: function isValid(){
		this.validation = [];
		for(var answer in this.value){
			if(typeof this.value[answer] === 'object'){
				this.validation = this.checkGroupValidity(this.value[answer]);
			} else{
				this.validation = this.checkIndividualValidity(answer, this.value[answer]);
			}
		}
		return this.validation;
	},
	checkGroupValidity: function checkGroupValidity(group){
		var groupIsValid = true;
		for(var subAnswer in group ){
			groupIsValid = this.checkIndividualValidity(subAnswer, group[subAnswer]);
		}
		return groupIsValid;
	},
	checkIndividualValidity: function checkIndividualValidity(key, value){
			var fieldIsValid = this.validatePresence(key, value) && this.validateRange(key, value);
			if(fieldIsValid){
				this.removeError(key);		
			}
			return fieldIsValid;
	},


	validatePresence: function validatePresence(key, value){
		if ( !this.isPresent(key, value) ) {
			this.addError(key);
			return false;
		}
		return true;
	},
	validateRange: function validateRange(key, value){
		if ( !this.isBetween(key, value) ) {
			this.addError(key);
			return false;
		}		
		return true;
	},


	isValidInput: function isValidInput(el) {
		if ( el.attr('type') === 'text' ) {
			return true;
		}
		return false;
	},
	isValidCheckbox: function isValidCheckbox(el) {
		if ( el.prop('checked') ) {
			return true;
		}
		return false;
	},
	isValidSelect: function isValidSelect(el) {
		if ( el[0].tagName === 'SELECT' && el.val() ) {
			return true;
		}
		return false;
	},


	isPresent: function isPresent(key, value){
		return this.required[key] === false || value !== '';
	},
	isBetween: function isBetween(key, value){
		if(this.ranges[key] === undefined){ return true }
		var max = this.ranges[key].max;
		var min = this.ranges[key].min;
		if(max === undefined || min === undefined){
			return true;
		}
		return value <= max && value >= min;
	},

	addAnswer: function addAnswer(container){
		this.container = this.container.add(container);
		this.setCallbackChange(container);		
		this.setRanges();
		this.setRequired();
	},
	removeAnswer: function removeAnswer(container){
		this.container = this.container.not(container);
		this.unsetChange(container);				
		this.setRanges();
		this.required = {};
		this.setRequired();
		this.deleteValue( container );
	}

};

