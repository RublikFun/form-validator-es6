/* jshint ignore:start */
'use strict';
describe('testrunner.js', function() {
  it('runs es6', function() {
		let b = true;
		expect(b).to.be.true;
  });
  it('supports html fixtures', function() {
  	var test = fixture.load('html/test-fixture.html');
		expect(fixture.el.firstChild).to.equal(test[0]);
  });
  it('supports json fixtures', function() {
  	var test = fixture.load('json/test-fixture.json');
		expect(fixture.json[0] ).to.equal('{test:true}');
  });  
  afterEach(function(){
  	fixture.cleanup();
  })
});
/* jshint ignore:end */