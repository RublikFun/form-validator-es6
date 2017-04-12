/* jshint ignore:start */

describe('Answer', function(){
	var testAnswer;
  beforeEach(function() {
    testAnswer = {};
  });
  afterEach(function(){
  	fixture.cleanup();
  })  
	describe("#record", function(){
		it("text and tel are allowable input types", function(){
      var textInput = $(document.createElement('input'))
        .data('field', 'test')
        .attr('type', 'text')
        .val('test');

      var telInput = $(document.createElement('input'))
        .data('field', 'test')
        .attr('type', 'tel')
        .val('test');

      var badInput = $(document.createElement('input'))
        .data('field', 'test')
        .attr('type', 'bad')
        .val('test');
      var textAnswer = new Answer(textInput);
      var telAnswer = new Answer(telInput);
      var badAnswer = new Answer(badInput);

      expect(textAnswer.value.test).to.equal('test');
      expect(telAnswer.value.test).to.equal('test');
      expect(badAnswer.value.test).to.equal('');
    })   

		it("should record text answer data", function(){
			fixture.load('html/input-text.html');
	    testAnswer = new Answer($('.test-input'));					
			testAnswer.container.val('test')
			testAnswer.container.trigger('change')
			expect(testAnswer.value.test).to.equal('test')
		})   
		it("should record select answer data", function(){
			fixture.load('html/input-select.html');
	    testAnswer = new Answer($('.test-input'));					
			testAnswer.container.find('option:last-child').prop('selected', true)
			testAnswer.container.trigger('change')			
			expect(testAnswer.value.test).to.eq('test')
		})  		
		it("should record checkbox answer data", function(){
			fixture.load('html/input-checkbox.html');
	    testAnswer = new Answer($('.test-input'));					
			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'test';
			}).prop('checked', true)		
			testAnswer.container.trigger('change')			
			expect(testAnswer.value.test).to.eq('test')
		})  	
		it("should record radio answer data", function(){
			fixture.load('html/input-radio.html');
	    testAnswer = new Answer($('.test-input'));					
			testAnswer.container.filter(function(){
				return ($(this).attr('name') == 'test');
			}).prop('checked', true)
			testAnswer.container.trigger('change')			
			expect(testAnswer.value.test).to.eq('test')
		})  
		it("should allow for follow-up questions to be added", function(){
			fixture.load('html/input-additional.html');			
	    testAnswer = new Answer($('.test-input'));
			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'test';
			}).prop('checked', true)					
			testAnswer.container.trigger('change')						
			expect($('.js-callback')).to.have.class('active')  
		})	
		it("should still validate that follow-up is answered", function(){
			fixture.load('html/input-additional.html');			
	    testAnswer = new Answer($('.test-input'));
			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'test';
			}).prop('checked', true)				
			expect(testAnswer.isValid()).to.be.true						
			testAnswer.container.trigger('change')
			expect(testAnswer.isValid()).to.be.false						
		})	
	})  	
	describe("#formatValue", function(){
		it("should clear the answer field value if specified", function(){
			fixture.load('html/input-text.html');			
			testAnswer = new Answer($('.test-input'));
			testAnswer.container.val('true')		
			testAnswer.container.trigger('change')
 			testAnswer.formatValue(true)
			expect(testAnswer.container.val()).to.eq('');
		}) 	
		it("should track a default value if specified", function(){
			fixture.load('html/input-default.html');			
			testAnswer = new Answer($('.test-input'));
			testAnswer.container.val('')
			testAnswer.container.trigger('change')
			expect(testAnswer.value['test']).to.eq(false);
			testAnswer.container.val('true')			
			testAnswer.container.trigger('change')
			expect(testAnswer.value['test']).to.eq('true');			
		}) 		
	})  
	describe("#setRanges", function(){
		it("should set the max and min value if specified", function(){
			fixture.load('html/input-range.html');			
			testAnswer = new Answer($('.test-input'));
			expect(testAnswer.ranges['test'].max).to.eq(100)		
			expect(testAnswer.ranges['test'].min).to.eq(10)						
		})
	})
	describe("#setRequired", function(){
		it("should default to true unless required is specified", function(){
			fixture.load('html/input-required.html');			
			testAnswer = new Answer($('.test-input'));
			expect(testAnswer.required['test']).to.eq(true)		
			expect(testAnswer.required['test2']).to.eq(false)		
		})
	})
	describe("#isValid", function(){
		it("should check if the answer is present", function(){
			fixture.load('html/input-radio.html');			
			testAnswer = new Answer($('.test-input'));
			testAnswer.container.filter(function(){
				return ($(this).hasClass('bad') );
			}).prop('checked', true)
			testAnswer.container.trigger('change')
			expect(testAnswer.isValid()).to.be.false

			testAnswer.container.filter(function(){
				return ($(this).attr('name') == 'test');
			}).prop('checked', true)
			testAnswer.container.filter(function(){
				return ($(this).hasClass('bad') );
			}).prop('checked', false)			
			
			testAnswer.container.trigger('change')		
			expect(testAnswer.isValid()).to.be.true			
		})    
		it("should ignore nonrequired questions", function(){
			fixture.load('html/input-required.html');			
			testAnswer = new Answer($('.test-input.notrequired'));
			testAnswer.container.val('')
			testAnswer.container.trigger('change')
			expect(testAnswer.isValid()).to.be.true	
		})		
		it("should check if the answer is within range", function(){
			fixture.load('html/input-range.html');			
			testAnswer = new Answer($('.test-input'));
			testAnswer.container.filter(function(){
					return ($(this).attr('name') == 'test')
			}).val('73')
			testAnswer.container.filter(function(){
					return ($(this).attr('name') == 'test2')
			}).val('3')			
			testAnswer.container.trigger('change')
			expect(testAnswer.isValid()).to.be.false
			testAnswer.container.filter(function(){
					return ($(this).attr('name') == 'test')
			}).val('103')
			testAnswer.container.filter(function(){
					return ($(this).attr('name') == 'test2')
			}).val('3')		
			testAnswer.container.trigger('change')
			expect(testAnswer.isValid()).to.be.false
			testAnswer.container.filter(function(){
					return ($(this).attr('name') == 'test')
			}).val('53')
			testAnswer.container.filter(function(){
					return ($(this).attr('name') == 'test2')
			}).val('73')				
			testAnswer.container.trigger('change')		
			expect(testAnswer.isValid()).to.be.true		
		})
		it("should check if the answer is a number", function(){
			fixture.load('html/input-numeric.html');			
			testAnswer = new Answer($('.test-input'));
			$(testAnswer.container[0]).val('abc')
			testAnswer.container.trigger('change')		
			expect(testAnswer.isValid()).to.be.false	

			$(testAnswer.container[0]).val('1')
			testAnswer.container.trigger('change')		
			expect(testAnswer.isValid()).to.be.true				
		}) 			
	})	  
	describe("#revealCallback", function() {
		it("doesn't add the change event non-input elements", function(){
			fixture.load('html/input-callback.html');			
	    testAnswer = new Answer($('.test-input'));

			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'test';
			}).prop('checked', true)					
			testAnswer.container.trigger('change')		
			expect(testAnswer.container.length).to.eq(3)	    
		})			
	})
	describe("#destroyValue", function() {
		it("removes any trace of a an input from the answer value object", function(){
			fixture.load('html/input-callback.html');			
	    testAnswer = new Answer($('.test-input'));

			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'test';
			}).prop('checked', true)					
			testAnswer.container.trigger('change');		
			expect(testAnswer.value['testAgain']).to.eq("");

			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'test';
			}).prop('checked', false)					
			testAnswer.container.trigger('change');	
			expect(testAnswer.value['testAgain']).to.eq(undefined);

			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'bad';
			}).prop('checked', true)					
			testAnswer.container.trigger('change');
			expect(testAnswer.value['testAgain']).to.eq(undefined);
		})		
	});
	describe("#clearValue", function() {
		it("removes the user-given value without removing the intrinsic element value", function(){
			fixture.load('html/input-mixed.html');			
	    testAnswer = new Answer($('.test-input'));

			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'test';
			}).prop('checked', true)					
			testAnswer.container.trigger('change');		
			$('.text-value').val('hello')
			expect($('.text-value').val()).to.eq("hello");
			testAnswer.container.each(function(){
				testAnswer.clearValue($(this))
			});
			expect($('.text-value').val()).to.eq("");
			expect($('.check-value').val()).to.eq("bad");
			expect($('.check-value').prop('checked')).to.eq(false);


		})		
	});
})
/* jshint ignore:end */
