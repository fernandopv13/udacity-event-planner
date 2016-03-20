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

			// Widget is fully covered by its own unit tests, so just verify that call works

			var testElement = app.InputWidgetFactory.instance().createProduct('DateInputWidget',
			{
				width: 's12',

				id: 'test',

				label: 'Test date',

				required: true,

				datasource: new Date(),

				errormessage: 'Please enter date'
			});

			expect(testElement.constructor).toBe(HTMLDivElement);
		});


		it('can create a standard email field', function(){

			// Widget is fully covered by its own unit tests, so just verify that call works

			var testElement = app.InputWidgetFactory.instance().createProduct('EmailInputWidget',
			{
				width: 's12',

				id: 'test-email',

				label: 'Test Email',

				required: true,

				datasource: new app.Email('test@server.domain'),

				errormessage: 'Please enter email'
			});

			expect(testElement.constructor).toBe(HTMLDivElement); // outer div

		});


		it('can create a standard number field', function(){

			// Widget is fully covered by its own unit tests, so just verify that call works

			var testElement = app.InputWidgetFactory.instance().createProduct('NumberInputWidget',
			{
				width: 's12',

				id: 'test-number',

				label: 'Test Number',

				required: true,

				datasource: 23, // anything that typeof will evaluate as 'number'

				errormessage: 'Please enter number',

				min: 0, // integer

				max: 50, // integer

				step: 1 // integer
			});

			expect(testElement.constructor).toBe(HTMLDivElement); // outer div
		});


		it('can create a standard password field', function(){

			// Widget is fully covered by its own unit tests, so just verify that call works

			var el = app.InputWidgetFactory.instance().createProduct('PasswordInputWidget',
			{
				width: 's12',

				id: 'test-password',

				label: 'Test Password',

				required: true,

				datasource: new app.Password(),

				errormessage: 'Please enter password',

				hintsprefix: 'test-password-hints'
			});

			expect(el.constructor).toBe(HTMLDivElement); // outer div
		});


		it('can create a standard password confirmation field', function(){

			// Widget is fully covered by its own unit tests, so just verify that call works

			var el = app.InputWidgetFactory.instance().createProduct('PasswordConfirmationInputWidget',
			{
				width: 's12',

				id: 'test-password-confirmation',

				label: 'Test Password Confirmation',

				required: true,

				//datasource: new app.Password(),

				errormessage: 'Please confirm password'
			});

			expect(el.constructor).toBe(HTMLDivElement); // outer div
		});


		it('can create a standard switch (checkbox) field', function(){

			// Widget is fully covered by its own unit tests, so just verify that call works

			var el = app.InputWidgetFactory.instance().createProduct('SwitchInputWidget',
			{
				width: 's7',

				id: 'switch-test',

				label: 'Test Switch',

				datasource: true,

				yes: 'Yes',

				no: 'no'
			});

			expect(el.constructor).toBe(HTMLDivElement); // outer div
		});


		it('can create a standard text field', function(){

			// Widget is fully covered by its own unit tests, so just verify that call works

			var el = app.InputWidgetFactory.instance().createProduct('TextInputWidget',
			{
				width: 's12',

				id: 'text-test',

				label: 'Test Text',

				required: true,

				datasource: 'Some text',

				datalist: 'text-test-list',

				validator: 'TextInputWidget'
			});

			expect(el.constructor).toBe(HTMLDivElement); // outer div
		});
	});
});