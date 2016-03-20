'use strict';

/* Jasmine.js unit test suite for PasswordInput class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class PasswordInput', function(){
	
	it('inherits from InputWidget', function() {

		expect((new app.PasswordInput()) instanceof app.InputWidget).toBe(true);

		expect(typeof (new app.PasswordInput()).createProduct).toBe('function');

		expect(typeof (new app.PasswordInput()).init).toBe('function');

		expect(typeof (new app.PasswordInput()).validate).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.PasswordInput()).constructor).toBe(app.PasswordInput);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.PasswordInput.instance().constructor).toBe(app.PasswordInput);

		expect(app.PasswordInput.instance()).toBe(app.PasswordInput.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.PasswordInput();
		});
		
		
		it('can create a new standard password field', function(){

			var el = app.UIWidgetFactory.instance().createProduct('PasswordInput',
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

			expect(el.classList[0]).toBe('row');

			el = el.firstChild;

			expect(el.constructor).toBe(HTMLDivElement); // inner div

			expect(el.classList[2]).toBe('s12');

			el = el.firstChild;

			expect(el.type).toBe('text'); // input

			expect(el.id).toBe('test-password');

			el = el.nextSibling;

			expect(el.htmlFor).toBe('test-password'); // label

			el = el.parentNode.nextSibling;
			
			expect(el.constructor).toBe(HTMLDivElement); // password hints container

			expect(el.id).toBe('test-password-hints');

			el = el.firstChild;

			expect(el.constructor).toBe(HTMLParagraphElement); // first password hint

			expect(el.classList[0]).toBe('password-validation-hint');
		});


		xit('can initialize an HTML number field upon rendering to the DOM', function() {


		});


		xit('can validate an HTML number field', function() {


		});


	});
});