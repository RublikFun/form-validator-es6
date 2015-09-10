/* jshint ignore:start */
describe('Script', function(){
	var testScript
  beforeEach(function() {
		fixture.load('html/script-basic.html');
    testScript = new Script( $('.test-script') )
  });
  afterEach(function(){
    testScript = {};  	
  	fixture.cleanup();
  }) 
	describe("#addScene", function(){
		it("should add a scene to the end of the flow", function(){
	    expect(testScript.scenes.length).to.eq(2)
	    testScript.addScene($('.js-alt-scene'))
	    expect(testScript.scenes.length).to.eq(3)	    
		})
		it("should take an argument object to construct the scene", function(){
	    expect(testScript.scenes.length).to.eq(2)			
			testScript.addScene($('.js-alt-scene'), {callback: 'hello'} )
			expect(testScript.scenes[2].callback).to.eq('hello')
		})		
	})
	describe("#addCallbackToScene", function(){
		it("should add a callback to the scene specified", function(){
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
	    expect(testScript.scenes.length).to.eq(2)
	    testScript.addAt(1, $('.js-alt-scene'))
	    expect(testScript.scenes.length).to.eq(3)		
	    expect(testScript.scenes[1].container).to.have.class('js-alt-scene')
		})
		it("should take an argument object to construct the scene", function(){
	    testScript.addAt(0, $('.js-alt-scene'), {callback: 'hello'})
	    expect(testScript.scenes[0].callback).to.eq('hello')
		})				
	})  
	describe("#removeAt", function(){
		it("should remove a scene at the index", function(){
	    expect(testScript.scenes.length).to.eq(2)
	    testScript.addAt(1, $('.js-alt-scene'))
	    testScript.removeAt(0)		    
	    expect(testScript.scenes.length).to.eq(2)		
	    expect(testScript.scenes[0].container).to.have.class('js-alt-scene')
		})
	})  	 	 	
	describe("#removeScene", function(){
		it("should remove a scene at the end of the flow", function(){
	    expect(testScript.scenes.length).to.eq(2)
	    testScript.removeScene()
	    expect(testScript.scenes.length).to.eq(1)	    
		})
	}) 
	describe("#next", function(){
		it("should move to the next scene if there are more scenes", function(){
	    expect(testScript.scenes[0].container).to.have.class('active')			    
	    testScript.next()
	    expect(testScript.scenes[0].container).not.to.have.class('active')		
	    expect(testScript.scenes[1].container).to.have.class('active')			    
		})
		it("should finish the script if there are no more scenes", function(){
	    expect(testScript.scenes[0].container).to.have.class('active')			    
	    testScript.next()
	    testScript.next()
	    expect(testScript.scenes[0].container).not.to.have.class('active')
	    expect(testScript.container).to.have.class('finished')		
		})		
	})   
	describe("#previous", function(){
		it("should move to the previous scene if it is not the first", function(){
	    expect(testScript.scenes[0].container).to.have.class('active')			    
	    testScript.next()
	    expect(testScript.scenes[0].container).not.to.have.class('active')		
	    expect(testScript.scenes[1].container).to.have.class('active')	
	    testScript.previous()
	    expect(testScript.scenes[1].container).not.to.have.class('active')		
	    expect(testScript.scenes[0].container).to.have.class('active')		    
		})
		it("should reset the script if it is the first", function(){
	    testScript.previous()
	    expect(testScript.scenes[0].container).to.have.class('active')					
		})		
	})  	   		 	
})
/* jshint ignore:end */