var expect = chai.expect;

describe('Script', function(){
	var testScript
  beforeEach(function() {
    $('#mocha_sandbox').html('');
  });
	describe("#addScene", function(){
		it("should add a scene to the end of the flow", function(){
	    $('#mocha_sandbox').html('<div class="test-script"><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div><div class="js-alt-scene"><input class="js-answer" type="text"><div class="js-button"></div></div></div>');					
	    testScript = new Script($('.test-script'))
	    testScript.init();
	    expect(testScript.scenes.length).to.eq(1)
	    testScript.addScene($('.js-alt-scene'))
	    expect(testScript.scenes.length).to.eq(2)	    
		})
	})
	describe("#addCallbackToScene", function(){
		it("should add a callback to the scene specified", function(){
	    $('#mocha_sandbox').html('<div class="test-script"><div class="js-scene"><input class="js-answer" type="text" value="true"><div class="js-button"></div></div> </div>');					
	    testScript = new Script($('.test-script'))
	    testScript.init();
	    var callback = function(){
	    	this.hello = this.args
	    };
	    testScript.addCallbackToScene( 0, callback, 'hello' );
	    $('.js-button').click();

	    expect(testScript.scenes[0].hello).to.eq('hello')
		})
	})	
	describe("#addAt", function(){
		it("should add a scene at the index", function(){
		    $('#mocha_sandbox').html('<div class="test-script"><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div><div class="js-alt-scene"><input class="js-answer" type="text"><div class="js-button"></div></div></div>');					
		    testScript = new Script($('.test-script'))
		    testScript.init();		    
		    expect(testScript.scenes.length).to.eq(2)
		    testScript.addAt(1, $('.js-alt-scene'))
		    expect(testScript.scenes.length).to.eq(3)		
		    expect(testScript.scenes[1].container).to.have.class('js-alt-scene')
		})
	})  
	describe("#removeAt", function(){
		it("should add a scene at the index", function(){
		    $('#mocha_sandbox').html('<div class="test-script"><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div><div class="js-alt-scene"><input class="js-answer" type="text"><div class="js-button"></div></div></div>');					
		    testScript = new Script($('.test-script'))
		    testScript.init();		    
		    expect(testScript.scenes.length).to.eq(2)
		    testScript.addAt(1, $('.js-alt-scene'))
		    testScript.removeAt(0)		    
		    expect(testScript.scenes.length).to.eq(2)		
		    expect(testScript.scenes[0].container).to.have.class('js-alt-scene')
		})
	})  	 	 	
	describe("#removeScene", function(){
		it("should remove a scene to the end of the flow", function(){
	    $('#mocha_sandbox').html('<div class="test-script"><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div></div>');					
	    testScript = new Script($('.test-script'))
	    testScript.init();	    
	    expect(testScript.scenes.length).to.eq(2)
	    testScript.removeScene()
	    expect(testScript.scenes.length).to.eq(1)	    
		})
	}) 
	describe("#next", function(){
		it("should move to the next scene if there are more scenes", function(){
	    $('#mocha_sandbox').html('<div class="test-script"><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div></div>');					
	    testScript = new Script($('.test-script'))	
	    testScript.init();	    
	    expect(testScript.scenes[0].container).to.have.class('active')			    
	    testScript.next()
	    expect(testScript.scenes[0].container).not.to.have.class('active')		
	    expect(testScript.scenes[1].container).to.have.class('active')			    
		})
		it("should finish the script if there are more scenes", function(){
	    $('#mocha_sandbox').html('<div class="test-script"><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div></div>');					
	    testScript = new Script($('.test-script'))	
	    testScript.init();	    
	    expect(testScript.scenes[0].container).to.have.class('active')			    
	    testScript.next()
	    expect(testScript.scenes[0].container).not.to.have.class('active')
	    expect(testScript.container).to.have.class('finished')		
		})		
	})   
	describe("#previous", function(){
		it("should move to the previous scene if it is not the first", function(){
	    $('#mocha_sandbox').html('<div class="test-script"><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div></div>');					
	    testScript = new Script($('.test-script'))	
	    testScript.init();	    
	    expect(testScript.scenes[0].container).to.have.class('active')			    
	    testScript.next()
	    expect(testScript.scenes[0].container).not.to.have.class('active')		
	    expect(testScript.scenes[1].container).to.have.class('active')	
	    testScript.previous()
	    expect(testScript.scenes[1].container).not.to.have.class('active')		
	    expect(testScript.scenes[0].container).to.have.class('active')		    
		})
		it("should reset the script if it is the first", function(){
	    $('#mocha_sandbox').html('<div class="test-script"><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div><div class="js-scene"><input class="js-answer" type="text"><div class="js-button"></div></div></div>');					
	    testScript = new Script($('.test-script'))	
	    testScript.init();	    
	    testScript.previous()
	    expect(testScript.scenes[0].container).to.have.class('active')					
		})		
	})  	   		 	
})

describe('Scene', function(){
	var testScene;
  beforeEach(function() {
    $('#mocha_sandbox').html('');
  });	
	describe("#init", function(){
		it("should create its answer objects", function(){
	    $('#mocha_sandbox').html('<div class="test-scene"><input class="js-answer" type="text"><div class="js-button"></div></div>');					
			testScene = new Scene($('.test-scene'));
			expect(testScene.answer.container.length).to.eq(1)
		})
		it("should bind its button click", function(){
	    $('#mocha_sandbox').html('<div class="test-scene"><input class="js-answer" type="text"><div class="js-button"></div></div>');					
			testScene = new Scene($('.test-scene'));
			expect(testScene.bound).to.be.true
		})
	})  
	describe("#finalize", function(){
		it("should add the error class to the element if answer is invalid", function(){
	    $('#mocha_sandbox').html('<div class="test-scene"><input class="js-answer" type="text" data-field="test"><div class="js-button"></div></div>');					
			testScene = new Scene($('.test-scene'));
			testScene.button.trigger('click');
			expect(testScene.container).to.have.class('error')
		})		
		it("should remove the error class from the dom element", function(){
	    $('#mocha_sandbox').html('<div class="test-scene"><input class="js-answer" type="text" data-field="test"><div class="js-button"></div></div>');					
			testScene = new Scene($('.test-scene'));
			testScene.button.trigger('click');			
			expect(testScene.container).to.have.class('error')
			testScene.answer.container.val('test')
			testScene.answer.container.trigger('change')	
			testScene.button.trigger('click');			
			expect(testScene.container).not.to.have.class('error')
		})
	})
})

describe('Answers', function(){
	var testAnswers
  beforeEach(function() {
    $('#mocha_sandbox').html('');
  });	
	describe("#report", function(){
		it("should format all answers to the kairos API format", function(){
	    $('#mocha_sandbox').html('<input type="text" class="test-input" data-field="test"><input type="text" class="test-input" data-field="test2"><input type="text" class="test-input" data-field="test3">');
	    testAnswers = new Answers();	
	    testAnswers.createAnswer($('.test-input'))
			testAnswers.all[0].container.each(function(i){
				$(this).val('test'+i)
			}) 
			testAnswers.all[0].container.trigger('change')
			testAnswers.report()
			expect( JSON.stringify(testAnswers.record) ).to.eq(JSON.stringify({test: "test0", test2: "test1", test3: "test2"}) )
		})
		it("should handle multidimensional objects as well", function(){
			$('#mocha_sandbox').html('<input type="text" class="test-input" data-field="test" data-grouping="testgroup"><input type="text" class="test-input" data-field="test4" data-grouping="testgroup"><input type="text" class="test-input" data-field="test2"><input type="text" class="test-input" data-field="test3">');
	    testAnswers = new Answers();	
	    testAnswers.createAnswer($('.test-input'))
			testAnswers.all[0].container.each(function(i){
				$(this).val('test'+i)
			}) 
			testAnswers.all[0].container.trigger('change')
			testAnswers.report()
			expect( JSON.stringify(testAnswers.record) ).to.eq(JSON.stringify({testgroup: {test:"test0", test4: 'test1'}, test2: "test2", test3: "test3"}))
		})
	})
	describe('#resetAll', function(){
		it("should remove all recorded answer data", function(){
			$('#mocha_sandbox').html('<input type="text" class="test-input" data-field="test" data-grouping="testgroup"><input type="text" class="test-input" data-field="test4" data-grouping="testgroup"><input type="text" class="test-input" data-field="test2"><input type="text" class="test-input" data-field="test3">');
			testAnswers = new Answers();
			testAnswers.createAnswer($('.test-input'));
			testAnswers.all[0].container.each(function(i){
				$(this).val('test'+i);
			});
			testAnswers.all[0].container.trigger('change');
			testAnswers.report();			

			testAnswers.resetAll();
			expect( JSON.stringify(testAnswers.record) ).to.eq(JSON.stringify({testgroup: {test:'', test4: ''}, test2: '', test3: ''}))
		})
	})
	describe("#createAnswer", function(){
		it("should add an answer to the collection", function(){
	    $('#mocha_sandbox').html('<input type="text" class="test-input" data-field="test"><input type="text" class="test-input-again" data-field="test2">');
	    testAnswers = new Answers();
	    expect( testAnswers.all ).to.be.empty;

	    testAnswers.createAnswer( $('.test-input') );
	    expect( testAnswers.all ).to.not.be.empty;

	    testAnswers.createAnswer( $('.test-input-again') );
	    expect( testAnswers.all.length ).to.equal(2);
		})
	})
	describe('#validateAll', function(){
		it("should validate all of the answers", function(){
	    $('#mocha_sandbox').html('<input type="text" class="test-input" data-field="test"><input type="text" class="test-input-again" data-field="test2">');		
	    testAnswers = new Answers();
	    testAnswers.createAnswer( $('.test-input') );
	    testAnswers.createAnswer( $('.test-input-again') );	    
	    testAnswers.validateAll()
	    expect(testAnswers.all[0].container).to.have.class('error')
	    expect(testAnswers.all[1].container).to.have.class('error')	    

		})
	})	
})

describe('Answer', function(){
	var testAnswer;
  beforeEach(function() {
    $('#mocha_sandbox').html('');
    testAnswer = {};
  });	
	describe("#record", function(){
		it("should record text answer data", function(){
	    $('#mocha_sandbox').html('<input type="text" class="test-input" data-field="test">');
	    testAnswer = new Answer($('.test-input'));					
			testAnswer.container.val('test')
			testAnswer.container.trigger('change')
			expect(testAnswer.value.test).to.equal('test')
		})   
		it("should record select answer data", function(){
	    $('#mocha_sandbox').html('<select class="test-input" data-field="test"><option value="test1">Bad Option</option><option value="test">Test</option></select>');
	    testAnswer = new Answer($('.test-input'));					
			testAnswer.container.find('option:last-child').prop('selected', true)
			testAnswer.container.trigger('change')			
			console.log($('#mocha_sandbox').html())
			expect(testAnswer.value.test).to.eq('test')
		})  		
		it("should record checkbox answer data", function(){
	    $('#mocha_sandbox').html('<input type="checkbox" class="test-input" name="bad" value="bad" data-field="bad"><input type="checkbox" class="test-input" name="test" value="test" data-field="test">');
	    testAnswer = new Answer($('.test-input'));					
			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'test';
			}).prop('checked', true)		
			testAnswer.container.trigger('change')			
			expect(testAnswer.value.test).to.eq('test')
		})  	
		it("should record radio answer data", function(){
	    $('#mocha_sandbox').html('<input type="radio" class="test-input" name="test" value="test" data-field="test"><input type="radio" class="test-input" name="bad" value="bad" data-field="bad">');
	    testAnswer = new Answer($('.test-input'));					
			testAnswer.container.filter(function(){
				return ($(this).attr('name') == 'test');
			}).prop('checked', true)
			testAnswer.container.trigger('change')			
			expect(testAnswer.value.test).to.eq('test')
		})  
		it("should allow for follow-up questions to be added", function(){
	    $('#mocha_sandbox').html('<input type="checkbox" class="test-input" name="bad" value="bad" data-field="bad" data-required="false"><input type="checkbox" class="test-input" name="test" value="test" data-field="test" data-callback="js-callback" data-required="false"><input type="text" class="js-callback" data-field="testAgain" >');
	    testAnswer = new Answer($('.test-input'));
			testAnswer.container.filter(function(){
				return $(this).attr('name') == 'test';
			}).prop('checked', true)					
			testAnswer.container.trigger('change')						
			expect($('.js-callback')).to.have.class('active')	    
		})	
		it("should still validate that follow-up is answered", function(){
			$('#mocha_sandbox').html('<input type="checkbox" class="test-input" name="bad" value="bad" data-field="bad" data-required="false"><input type="checkbox" class="test-input" name="test" value="test" data-field="test" data-callback="js-callback" data-required="false"><input type="text" class="js-callback" data-field="testAgain" >');
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
	    $('#mocha_sandbox').html('<input type="text" class="test-input" data-field="test">');					
			testAnswer = new Answer($('.test-input'));
			testAnswer.container.val('true')		
			testAnswer.container.trigger('change')
 			testAnswer.formatValue(true)
			expect(testAnswer.container.val()).to.eq('');
		}) 	
		it("should track a default value if specified", function(){
	    $('#mocha_sandbox').html('<input type="text" class="test-input" data-field="test" data-default="false">');					
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
	    $('#mocha_sandbox').html('<input type="text" class="test-input" name="test" data-field="test" data-max="100" data-min="10">');			
			testAnswer = new Answer($('.test-input'));
			expect(testAnswer.ranges['test'].max).to.eq(100)		
			expect(testAnswer.ranges['test'].min).to.eq(10)						
		})
	})
	describe("#setRequired", function(){
		it("should default to true unless required is specified", function(){
	    $('#mocha_sandbox').html('<input type="text" class="test-input" name="test2" data-field="test2" data-required="false" ><input type="text" class="test-input" name="test" data-field="test" data-max="100" data-min="10">');			
			testAnswer = new Answer($('.test-input'));
			expect(testAnswer.required['test']).to.eq(true)		
			expect(testAnswer.required['test2']).to.eq(false)		
		})
	})
	describe("#isValid", function(){
		it("should check if the answer is present", function(){
	    $('#mocha_sandbox').html('<input type="radio" class="test-input bad" name="test" value="" data-field="test"><input type="radio" class="test-input" name="test" value="test" data-field="test">');			
			testAnswer = new Answer($('.test-input'));
			testAnswer.container.filter(function(){
				return ($(this).hasClass('bad') );
			}).prop('checked', true)
			testAnswer.container.trigger('change')
			expect(testAnswer.isValid()).to.be.false

			testAnswer.container.filter(function(){
				return ($(this).attr('name') == 'test');
			}).prop('checked', true)
			testAnswer.container.trigger('change')		
			expect(testAnswer.isValid()).to.be.true			
		})    
		it("should ignore nonrequired questions", function(){
	    $('#mocha_sandbox').html('<input type="text" class="test-input" name="bad" value="" data-required="false" data-field="test">');			
			testAnswer = new Answer($('.test-input'));
			testAnswer.container.val('')
			testAnswer.container.trigger('change')
			expect(testAnswer.isValid()).to.be.true	
		})		
		it("should check if the answer is within range", function(){
	    $('#mocha_sandbox').html('<input type="text" class="test-input" name="test2" data-field="test2" data-max="200" data-min="70"><input type="text" class="test-input" name="test" data-field="test" data-max="100" data-min="10">');			
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
	})	  
	describe("#revealCallback", function() {
		it("doesn't add the change event non-input elements", function(){
	    $('#mocha_sandbox').html('<input type="checkbox" class="test-input" name="bad" value="bad" data-field="bad" data-required="false"><input type="checkbox" class="test-input" name="test" value="test" data-field="test" data-callback="js-callback" data-required="false"><div class="js-callback wrong-element"><input type="text" class="js-callback" data-field="testAgain" ></div>');
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
	    $('#mocha_sandbox').html('<input type="checkbox" class="test-input" name="bad" value="bad" data-field="bad" data-required="false"><input type="checkbox" class="test-input" name="test" value="test" data-field="test" data-callback="js-callback" data-required="false"><div class="js-callback wrong-element"><input type="text" class="js-callback" data-field="testAgain" ></div>');
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
	    $('#mocha_sandbox').html('<input type="checkbox" class="test-input check-value" name="bad" value="bad" data-field="bad" data-required="false"><input type="text" class="test-input text-value" name="test" data-field="test" data-callback="js-callback" data-required="false">');
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
