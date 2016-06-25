'use strict';

/* Jasmine.js unit test suite for FloatingActionButtonWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class FloatingActionButtonWidget', function(){
	
	it('inherits from UIWidget', function() {

		expect((new app.FloatingActionButtonWidget()) instanceof app.UIWidget).toBe(true);

		expect(typeof (new app.FloatingActionButtonWidget()).createProduct).toBe('function');

		expect(typeof (new app.FloatingActionButtonWidget()).init).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.FloatingActionButtonWidget()).constructor).toBe(app.FloatingActionButtonWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.FloatingActionButtonWidget.instance().constructor).toBe(app.FloatingActionButtonWidget);

		expect(app.FloatingActionButtonWidget.instance()).toBe(app.FloatingActionButtonWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.FloatingActionButtonWidget();
		});
		
		
		it('can create a new floating action button', function() {

			var el = app.FloatingActionButtonWidget.instance().createProduct(
			{
				id: 'action-button',

				label: 'Cancel',

				color: 'red',

				icon: 'add'
			});
					
			expect(el.firstChild.id).toBe('action-button');

			// add more later
		});
	});
});