'use strict';

/* Jasmine.js unit test suite for EmailInputWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class EmailInputWidget', function(){
	
	it('inherits from InputWidget', function() {

		expect((new app.EmailInputWidget()) instanceof app.InputWidget).toBe(true);

		expect(typeof (new app.EmailInputWidget()).createProduct).toBe('function');

		expect(typeof (new app.EmailInputWidget()).init).toBe('function');

		expect(typeof (new app.EmailInputWidget()).validate).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.EmailInputWidget()).constructor).toBe(app.EmailInputWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.EmailInputWidget.instance().constructor).toBe(app.EmailInputWidget);

		expect(app.EmailInputWidget.instance()).toBe(app.EmailInputWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.EmailInputWidget();
		});
		
		
		it('can create a new standard email field', function(){

			var testElement = app.UIWidgetFactory.instance().createProduct('EmailInputWidget',
			{
				width: 's12',

				id: 'test-email',

				label: 'Test Email',

				required: true,

				datasource: new app.Email('test@server.domain'),

				errormessage: 'Please enter email'
			});

			expect(testElement.constructor).toBe(HTMLDivElement); // outer div

			expect(testElement.classList[0]).toBe('row');

			expect(testElement.firstChild.constructor).toBe(HTMLDivElement); // inner div

			expect(testElement.firstChild.classList[2]).toBe('s12');

			var el = testElement.firstChild.firstChild; // input

			expect(el.type).toBe('email');

			expect(el.id).toBe('test-email');

			expect(el.required).toBe(true);

			expect(el.value).toBe('test@server.domain');

			//expect(el.readonly).toBe(true);

			el = el.nextSibling; // label

			expect(el.htmlFor).toBe('test-email');

			el = el.firstChild;

			expect(el.nodeValue).toBe('Test Email');

			expect(el.nextSibling.classList[0]).toBe('required-indicator');
		});


		xit('can initialize an HTML email field upon rendering to the DOM', function() {


		});


		xit('can validate an HTML email field', function() {


		});


	});
});