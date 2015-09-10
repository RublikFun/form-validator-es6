/* jshint ignore:start */
describe('Scene', function(){
	var testScene = {};
  beforeEach(function() {
		fixture.load('html/scene.html');
		testScene = new Scene( $('.js-scene') );
		testScene.autoInit({});
  });
  afterEach(function(){
    testScene = {};  	
  	fixture.cleanup();
  }) 
	describe("#init", function(){
		it("should create its answer objects", function(){
			expect(testScene.answer.container.length).to.eq(1)
		})
		it("should bind its button click", function(){
			expect(testScene.bound).to.be.true
		})
	})  
	describe("#finalize", function(){
		it("should add the error class to the element if answer is invalid", function(){
			testScene.answer.container.trigger('change')
			testScene.button.trigger('click');
			expect( testScene.container ).to.have.class('error')
		})		
		it("should remove the error class from the dom element if answer is valid", function(){
			testScene.button.trigger('click');			
			expect(testScene.container).to.have.class('error')
			testScene.answer.container.val('test')
			testScene.answer.container.trigger('change')	
			testScene.button.trigger('click');			
			expect(testScene.container).not.to.have.class('error')
		})
	})
})
/* jshint ignore:end */