'use strict';

/* Jasmine.js unit test suite for FormWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class FormWidget', function(){
	
	it('inherits from UIWidget', function() {

		expect((new app.FormWidget()) instanceof app.UIWidget).toBe(true);

		expect(typeof (new app.FormWidget()).createProduct).toBe('function');

		expect(typeof (new app.FormWidget()).init).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.FormWidget()).constructor).toBe(app.FormWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.FormWidget.instance().constructor).toBe(app.FormWidget);

		expect(app.FormWidget.instance()).toBe(app.FormWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.FormWidget();
		});
		
		it('can create a new form element', function() {

			var el = app.FormWidget.instance().createProduct(
			{
				id: 'test-form',

				autocomplete: false,

				novalidate: false
			});
			
			expect(el.constructor).toBe(HTMLFormElement);

			expect(el.id).toBe('test-form');

			// add more later
		});
	});
});