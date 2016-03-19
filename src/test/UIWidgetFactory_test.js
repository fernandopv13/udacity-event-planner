'use strict';

/* Jasmine.js unit test suite for UIWidgetFactory class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class UIWidgetFactory', function(){
	
	it('inherits from Factory', function() {

		expect((new app.UIWidgetFactory()) instanceof app.Factory).toBe(true);
	});


	it('can create a new instance', function() {
			
			expect((new app.UIWidgetFactory()).constructor).toBe(app.UIWidgetFactory);
	});
		
		
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.UIWidgetFactory();
		});
		
		
		it('can get the name of the type (class) of the UIWidgetFactory', function() {
			
			expect(testFactory.productName()).toBe('UIWidget');
		});
		
		
		it('can get the type of Product required by the factory (by function reference)', function() {
			
			expect(testFactory.productType()).toBe(app.UIWidget);
		});

	});
});