'use strict';

/* Jasmine.js unit test suite for PasswordConfirmationInput class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class PasswordConfirmationInput', function(){
	
	it('inherits from InputWidget', function() {

		expect((new app.PasswordConfirmationInput()) instanceof app.InputWidget).toBe(true);

		expect(typeof (new app.PasswordConfirmationInput()).createProduct).toBe('function');

		expect(typeof (new app.PasswordConfirmationInput()).init).toBe('function');

		expect(typeof (new app.PasswordConfirmationInput()).validate).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.PasswordConfirmationInput()).constructor).toBe(app.PasswordConfirmationInput);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.PasswordConfirmationInput.instance().constructor).toBe(app.PasswordConfirmationInput);

		expect(app.PasswordConfirmationInput.instance()).toBe(app.PasswordConfirmationInput.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.PasswordConfirmationInput();
		});
		
		
		it('can create a new standard password confirmation field', function(){

			var el = app.UIWidgetFactory.instance().createProduct('PasswordConfirmationInput',
			{
				width: 's12',

				id: 'test-password-confirmation',

				label: 'Test Password Confirmation',

				required: true,

				//datasource: new app.Password(),

				errormessage: 'Please confirm password'
			});

			expect(el.constructor).toBe(HTMLDivElement); // outer div

			expect(el.id).toBe('test-password-confirmation-parent');

			expect(el.classList[0]).toBe('row');

			el = el.firstChild;

			expect(el.constructor).toBe(HTMLDivElement); // inner div

			expect(el.classList[2]).toBe('s12');

			el = el.firstChild;

			expect(el.type).toBe('text'); // input

			expect(el.id).toBe('test-password-confirmation');

			el = el.nextSibling;

			expect(el.htmlFor).toBe('test-password-confirmation'); // label

			el = el.firstChild;

			expect(el.nodeValue).toBe('Confirm Password');

			el = el.nextSibling;

			expect(el.classList[0]).toBe('required-indicator');
		});


		xit('can initialize an HTML number field upon rendering to the DOM', function() {


		});


		xit('can validate an HTML number field', function() {


		});


	});
});