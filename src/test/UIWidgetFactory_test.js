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
	

	it('can get a singleton instance of itself', function() {

		expect(app.UIWidgetFactory.instance().constructor).toBe(app.UIWidgetFactory);

		expect(app.UIWidgetFactory.instance()).toBe(app.UIWidgetFactory.instance());
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


		it('can create an HTML element', function() {

			// HTMLElement is fully covered by its own unit test// Widget is fully covered by its own unit tests, so just verify that call works, so just verify that call works

			var testElement = app.UIWidgetFactory.instance().createProduct('HTMLElement',
			{
				element: 'div', // the type of element required
			});

			expect(testElement.constructor).toBe(HTMLDivElement);

		});


		it('can create a field description', function(){

			// Widget is fully covered by its own unit tests, so just verify that call works

			var el = app.UIWidgetFactory.instance().createProduct('InputDescriptionWidget',
			{
				datasource: 'Test field description',

				divider: false
			});

			expect(el.constructor).toBe(HTMLDivElement); // outer div
		});


		it('can create a form element', function() {

			// Widget is fully covered by its own unit tests, so just verify that call works

			var el = app.UIWidgetFactory.instance().createProduct('FormWidget',
			{
				id: 'test-form',

				autocomplete: false,

				novalidate: false
			});
			
			expect(el.constructor).toBe(HTMLFormElement);
		});


		it('can create a cancel button', function() {

			// Widget is fully covered by its own unit tests, so just verify that call works

			var el = app.UIWidgetFactory.instance().createProduct('CancelButtonWidget',
			{
				id: 'test-cancel-button',

				label: 'Cancel'
			});
					
			expect(el.id).toBe('test-cancel-button');
		});


		it('can create a floating action button', function() {

			// Widget is fully covered by its own unit tests, so just verify that call works

			var el = app.UIWidgetFactory.instance().createProduct('FloatingActionButtonWidget',
			{
				id: 'action-button',

				label: 'Cancel',

				color: 'red',

				icon: 'add'
			});
					
			expect(el.firstChild.id).toBe('action-button');
		});
		

		it('can create a submit button', function() {

			// Widget is fully covered by its own unit tests, so just verify that call works

			var el = app.UIWidgetFactory.instance().createProduct('SubmitButtonWidget',
			{
				id: 'test-submit-button',

				label: 'Done',

				icon: 'send'
			});

			expect(el.id).toBe('test-submit-button');
		});
	});
});