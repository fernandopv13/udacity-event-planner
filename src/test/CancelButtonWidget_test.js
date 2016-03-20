'use strict';

/* Jasmine.js unit test suite for CancelButtonWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class CancelButtonWidget', function(){
	
	it('inherits from UIWidget', function() {

		expect((new app.CancelButtonWidget()) instanceof app.UIWidget).toBe(true);

		expect(typeof (new app.CancelButtonWidget()).createProduct).toBe('function');

		expect(typeof (new app.CancelButtonWidget()).init).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.CancelButtonWidget()).constructor).toBe(app.CancelButtonWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.CancelButtonWidget.instance().constructor).toBe(app.CancelButtonWidget);

		expect(app.CancelButtonWidget.instance()).toBe(app.CancelButtonWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.CancelButtonWidget();
		});
		
		
		it('can create a new cancel button', function() {

			var el = app.CancelButtonWidget.instance().createProduct(
			{
				id: 'test-cancel-button',

				label: 'Cancel'
			});
					
			expect(el.id).toBe('test-cancel-button'); // cancel button

			expect(el.classList[2]).toBe('btn-flat');

			expect(el.innerHTML).toBe('Cancel');
		});
	});
});