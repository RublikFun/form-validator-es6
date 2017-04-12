'use strict';

var Answer = function(container){
	this.ranges      = {};
	this.required    = {};
	this.restrictions= {};
	this.container   = container;
	this.value       = {};
	this.validations = [];
	this.init();
};
Answer.prototype = {
	init: function init(){
		this.setRanges();
		this.setRequired();
		this.setRestrictions();
		this.formatValue();
		this.setChange(this.container);
	},
	setValidation: function(arg){
		if(typeof arg === 'boolean'){
			this.validations.push(arg);
			return;
		}
		this.validations = [];
	},
	getValidation: function(){
		var i, allAreValid = true;
		for(i = 0; i < this.validations.length; i++) {
			if(this.validations[i] === false) {
				allAreValid = false;
				break;
			}
		}
		return allAreValid;
	},
	setRanges: function setRanges(){
		var self = this;
		$(this.container).each(function(){
			self.ranges[$(this).data('field')] = {
				max: $(this).data('max') || false,
				min: $(this).data('min') || false
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
	setRestrictions: function setRestrictions(){
		var self = this;
		$(this.container).each(function(){
			if($(this).data('numeric') === true ){
				self.restrictions[$(this).data('field')] = 'numeric';
			} else {
				self.restrictions[$(this).data('field')] = false;
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
		var key = el.data( 'field' );
				val[ key ] = this.getDefault( el );
		if( this.hasValue(el) ){
			val[ key ] = this.getValueOrDefault( el );
			this.removeError( key );
			return val;
		}
		if( this.shouldOverwrite( el ) ){
			val[ key ] = this.getDefault( el );
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
		$( el ).each( function() {
			delete self.value[ $( this ).data( 'field' ) ];
		} );
	},
	checkForCallback: function checkForCallback( el ){
		if ( this.hasValue( el ) ) {
			return this.revealCallback( el );
		}

		return this.revertCallback( el );
	},
	revealCallback: function revealCallback( el ){
		var callbackElement = $( '.' + el.data( 'callback' ) ),
		self = this;
		if( callbackElement.length > 0 ){
			callbackElement.each( function() {
				if( self.hasField( this ) ){
					self.addAnswer( $( this ) );
				}
			} );
			callbackElement.addClass( 'active' ).addClass( 'js-active' );
		}
	},
	revertCallback: function revertCallback( el ){
		var callbackElement = $( '.' + el.data( 'callback' ) );
		if( callbackElement.length > 0 ){
			this.clearValue( callbackElement );
			this.removeAnswer( callbackElement );
			callbackElement.removeClass( 'active' ).removeClass( 'js-active' );
		}
	},


	hasValue: function hasValue(container){
		return this.isValidInput(container) ||
					 this.isValidCheckbox(container) ||
					 this.isValidSelect(container);
	},
	shouldOverwrite: function shouldOverwrite(el){
		return ( this.isDuplicate(el) &&
						 this.isFirst(el) ) ||
						!this.isDuplicate(el);
	},
	isDuplicate: function isUnique(el){
		return $('[data-field="'+el.data('field')+'"]').length > 1;
	},
	isFirst: function isFirst(el){
		return $('[data-field="'+el.data('field')+'"]').index(el) === 0;
	},

	clearValue: function clearValue(el){
    if( this.isValidInput(el) ){
			el.val('');
		}
		el.prop('checked', false);
		el.find('option').prop('selected', false);
	},
	hasField: function hasField( el ){
		if ($(el).data('field')) {
			return true;
		}
		return false;
	},

	addError: function addError(answer){
		$('[data-field="'+answer+'"]').addClass('js-error').addClass('error');
	},
	removeError: function removeError(answer){
		$('[data-field="'+answer+'"]').removeClass('js-error').removeClass('error');
	},


	isValid: function isValid(){
		this.setValidation();
		for( var answer in this.value ){
			var value = this.value[answer];
			if( typeof value === 'object' ){
				let validity = this.checkGroupValidity( value );
				this.setValidation( validity );
			} else{
				let validity = this.checkIndividualValidity( answer, value );
				this.setValidation( validity );
			}
		}
		return this.getValidation();
	},
	checkGroupValidity: function checkGroupValidity(group){
		var groupIsValid = true;
		for(var subAnswer in group ){
			groupIsValid = this.checkIndividualValidity(subAnswer, group[subAnswer]);
		}
		return groupIsValid;
	},
	checkIndividualValidity: function checkIndividualValidity(key, value){
			var fieldIsValid = this.validatePresence(key, value) &&
												 this.validateContent(key, value);
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
	validateContent: function validateContent(key, value){
		if ( this.isNumericallyValid( key, value ) &&
					this.isInRange( key, value ) ) {
			return true;
		}
		this.addError(key);
		return false;
	},

  isAnAllowableInputType: function isAnAllowableInputType(el) {
    return ['text', 'tel'].indexOf(el.attr('type')) > -1;
  },

	isValidInput: function isValidInput(el) {
    if (this.isAnAllowableInputType(el)) {
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
	isNumericallyValid: function isNumericallyValid( key, value ){
		var hasRestrictions = this.restrictions !== undefined;
		if( !hasRestrictions ){ return true; }
		if( this.restrictions[key] === 'numeric' ){
			return this.isNumeric( value );
		}
		return true;
	},
	isNumeric: function isNumeric( value ){
		if( isNaN( Number( value ) ) ){
			return false;
		}
		return true;
	},
	isAbove: function isAbove( key, value ){
		var min = this.ranges[key].min;
		if( !min ){
			return true;
		}
		return this.isNumeric( value ) && value >= min;
	},
	isBelow: function isBelow( key, value ){
		var max = this.ranges[key].max;
		if( !max ){
			return true;
		}
		return this.isNumeric( value ) && value <= max;
	},


	isPresent: function isPresent(key, value){
		return this.required[key] === false || value !== '';
	},
	isInRange: function isInRange(key, value){
		if(this.ranges[key] === undefined){ return true; }
		return this.isAbove(key, value) &&
					 this.isBelow(key, value);
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
