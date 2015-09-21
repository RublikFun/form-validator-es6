/* jshint ignore:start */
describe('Answers', function(){
	var testAnswers
  beforeEach(function() {
  });
  afterEach(function(){
    testAnswers = {};  	
  	fixture.cleanup();
  }) 
	describe("#report", function(){
		it("should format all answers to the kairos API format", function(){
			fixture.load('html/input-basic.html');
	    testAnswers = new Answers();	
	    testAnswers.createAnswer($('.test-input'))
			testAnswers.all[0].container.each(function(i){
				$(this).val('test'+i)
			}) 
			testAnswers.all[0].container.trigger('change')
			testAnswers.report()
			expect( JSON.stringify(testAnswers.getRecord()) ).to.eq(JSON.stringify({test: "test0", test2: "test1", test3: "test2"}) )
		})
		it("should handle multidimensional objects as well", function(){
			fixture.load('html/input-multidimensional.html');
	    testAnswers = new Answers();	
	    testAnswers.createAnswer($('.test-input'))
			testAnswers.all[0].container.each(function(i){
				$(this).val('test'+i)
			}) 
			testAnswers.all[0].container.trigger('change')
			testAnswers.report()
			expect( JSON.stringify(testAnswers.getRecord()) ).to.eq(JSON.stringify({testgroup: {test:"test0", test4: 'test1'}, test2: "test2", test3: "test3"}))
		})
	})
	describe('#resetAll', function(){
		it("should remove all recorded answer data", function(){
			fixture.load('html/input-multidimensional.html');
			testAnswers = new Answers();
			testAnswers.createAnswer($('.test-input'));
			testAnswers.all[0].container.each(function(i){
				$(this).val('test'+i);
			});
			testAnswers.all[0].container.trigger('change');
			testAnswers.report();			

			testAnswers.resetAll();
			expect( JSON.stringify(testAnswers.getRecord()) ).to.eq(JSON.stringify({testgroup: {test:'', test4: ''}, test2: '', test3: ''}))
		})
	})
	describe("#createAnswer", function(){
		it("should add an answer to the collection", function(){
			fixture.load('html/input-basic.html');
	    testAnswers = new Answers( );
	    expect( testAnswers.all ).to.be.empty;

	    testAnswers.createAnswer( $('.test-input') );
	    expect( testAnswers.all ).not.to.be.empty;

	    testAnswers.createAnswer( $('.test-input-again') );
	    expect( testAnswers.all.length ).to.equal(2);
		})
	})
	describe('#validateAll', function(){
		it("should validate all of the answers", function(){
			fixture.load('html/input-basic.html');
	    testAnswers = new Answers();
	    testAnswers.createAnswer( $('.test-input') );
	    testAnswers.createAnswer( $('.test-input-again') );	    
	    testAnswers.validateAll()
	    expect(testAnswers.all[0].container).to.have.class('js-error')
	    expect(testAnswers.all[1].container).to.have.class('js-error')	    

		})
	})	
})
/* jshint ignore:end */