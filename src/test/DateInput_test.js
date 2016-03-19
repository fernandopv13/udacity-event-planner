'use strict';

/* Jasmine.js unit test suite for DateInput class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class DateInput', function(){
	
	it('inherits from InputWidget', function() {

		expect((new app.DateInput()) instanceof app.InputWidget).toBe(true);

		expect(typeof (new app.DateInput()).createProduct).toBe('function');

		expect(typeof (new app.DateInput()).init).toBe('function');

		expect(typeof (new app.DateInput()).validate).toBe('function');
	});


	it('can create a new instance', function() {
			
			expect((new app.DateInput()).constructor).toBe(app.DateInput);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.DateInput.instance().constructor).toBe(app.DateInput);

		expect(app.DateInput.instance()).toBe(app.DateInput.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.DateInput();
		});
		
		
		xit('can create an HTML date field', function() {


		});


		xit('can initialize an HTML date field upon rendering to the DOM', function() {


		});


		xit('can validate an HTML date field', function() {


		});


	});
});