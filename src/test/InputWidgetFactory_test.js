'use strict';

/* Jasmine.js unit test suite for InputWidgetFactory class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class InputWidgetFactory', function(){
	
	it('inherits from Factory', function() {

		expect((new app.InputWidgetFactory()) instanceof app.Factory).toBe(true);

		expect(typeof (new app.InputWidgetFactory()).createProduct).toBe('function');
	});


	it('can create a new instance', function() {
			
			expect((new app.InputWidgetFactory()).constructor).toBe(app.InputWidgetFactory);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.InputWidgetFactory.instance().constructor).toBe(app.InputWidgetFactory);

		expect(app.InputWidgetFactory.instance()).toBe(app.InputWidgetFactory.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.InputWidgetFactory();
		});
		
		
		it('can get the name of the type (class) of the InputWidgetFactory', function() {
			
			expect(testFactory.productName()).toBe('InputWidget');
		});
		
		
		it('can get the type of Product required by the factory (by function reference)', function() {
			
			expect(testFactory.productType()).toBe(app.InputWidget);
		});

		it('can create a date input field', function() {

			var element = app.InputWidgetFactory.instance().createProduct('DateInput',
			{
				width: 's12',

				id: 'test',

				label: 'Test date',

				required: true,

				datasource: new Date(),

				errormessage: 'Please enter date'
			});
		});

	});
});