'use strict';

/* Jasmine.js unit test suite for IViewable.js interface in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Interface IViewable', function(){
	
	// Mock up an object to bind to to gain access to methods inherited from IViewable

	function Viewable() {};

	app.IInterfaceable.mixInto(app.IViewable, Viewable);

	var testView = new Viewable;	


	it('cannot be instantiated', function() {
		
		try { // this shold throw an error
			
			void new app.IViewable();
		}
		
		catch(e) { // interfaces cannot be instantiated, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IViewable.constructorErrorMessage);
		}
	});
	

	it('defines an update() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.update).toBeDefined();
		
		expect(typeof app.IViewable.prototype.update).toBe('function');
	});
		
	
	it('throws an error if update() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IViewable.prototype.update();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IViewable.prototype.update.errorMessage);
		}
	});


	it('defines a default createElement() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createElement).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createElement).toBe('function');
	});
	

	it('can create a new DOM element', function(){

		var testElement = app.IViewable.prototype.default_createElement(
		{

			element: 'div',

			attributes: {id: 'test-div'},

			classList: ['row', 'col', 's12'],

			dataset: {success: 'great success', error: 'better luck next time'},

			innerHTML: 'my div'
		});

		expect(testElement.constructor).toBe(HTMLDivElement);

		expect(testElement.id).toBe('test-div');

		expect(testElement.className.indexOf('row')).toBeGreaterThan(-1);

		expect(testElement.className.indexOf('col')).toBeGreaterThan(-1);

		expect(testElement.className.indexOf('s12')).toBeGreaterThan(-1);

		expect(testElement.dataset.success).toBe('great success');

		expect(testElement.dataset.error).toBe('better luck next time');

		expect(testElement.innerHTML).toBe('my div');
	});


	it('defines a default createDateField() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createDateField).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createDateField).toBe('function');
	});
	

	it('can create a new standard date field', function(){

		var testElement = app.IViewable.prototype.default_createDateField.call(
		
			testView, // provides 'this' reference to IViewable methods

			's6',

			'test-date',

			'Test Date',

			true,

			new Date(1000)
		);

		expect(testElement.constructor).toBe(HTMLDivElement); // outer div

		expect(testElement.classList[0]).toBe('row');

		expect(testElement.firstChild.constructor).toBe(HTMLDivElement); // inner div

		expect(testElement.firstChild.classList[2]).toBe('s6');

		var el = testElement.firstChild.firstChild; // input

		expect(el.type).toBe('text');

		expect(el.id).toBe('test-date');

		expect(el.required).toBe(true);

		expect(el.value).toBe('1/1/1970');

		//expect(el.readonly).toBe(true);

		expect(el.required).toBe(true);

		expect(el.classList[1]).toBe('datepicker');

		el = el.nextSibling; // label

		expect(el.htmlFor).toBe('test-date');

		el = el.nextSibling; // custom error message

		expect(el.constructor).toBe(HTMLDivElement);

		expect(el.id).toBe('test-date-error');
	});


	it('defines a default createEmailField() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createEmailField).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createEmailField).toBe('function');
	});
	

	it('can create a new standard email field', function(){

		var testElement = app.IViewable.prototype.default_createEmailField.call(
		
			testView, // provides 'this' reference to IViewable methods

			's12',

			'test-email',

			'Test Email',

			true,

			new app.Email('test@server.domain')
		);

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


	it('defines a default createFieldDescription() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createFieldDescription).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createFieldDescription).toBe('function');
	});
	

	it('can create a new field description', function(){

		// Planning to factor out divider (to be handled by CSS), so not testing here

		var testElement = app.IViewable.prototype.default_createFieldDescription.call(
		
			testView, // provides 'this' reference to IViewable methods

			'Test field description'
		);

		expect(testElement.constructor).toBe(HTMLDivElement); // outer div

		var el = testElement.firstChild;

		expect(el.constructor).toBe(HTMLParagraphElement);

		expect(el.innerHTML).toBe('Test field description');
	});


	it('defines a default createHeading() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createHeading).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createHeading).toBe('function');
	});
	

	it('can create a new heading', function(){

		// Planning to factor out divider (to be handled by CSS), so not testing here

		var el = app.IViewable.prototype.default_createHeading.call(
		
			testView, // provides 'this' reference to IViewable methods

			's12',

			'Test Heading'
		);

		expect(el.constructor).toBe(HTMLDivElement); // outer div

		expect(el.classList[0]).toBe('row');

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLDivElement); // inner div

		expect(el.classList[1]).toBe('s12');

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLHeadingElement); // heading

		expect(el.innerHTML).toBe('Test Heading');
	});


	it('defines a default createNumberField() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createNumberField).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createNumberField).toBe('function');
	});
	

	it('can create a new standard number field', function(){

		var testElement = app.IViewable.prototype.default_createNumberField.call(
		
			testView, // provides 'this' reference to IViewable methods

			's12',

			'test-number',

			'Number',

			true,

			50,

			0,

			null,

			1,

			'Test error message'
		);

		expect(testElement.constructor).toBe(HTMLDivElement); // outer div

		expect(testElement.classList[0]).toBe('row');

		expect(testElement.firstChild.constructor).toBe(HTMLDivElement); // inner div

		expect(testElement.firstChild.classList[2]).toBe('s12');

		var el = testElement.firstChild.firstChild; // input

		expect(el.type).toBe('number');

		expect(el.id).toBe('test-number');

		expect(el.required).toBe(true);

		expect(el.value).toBe('50');

		expect(el.min).toBe('0');

		expect(el.max).toBe('');

		expect(el.step).toBe('1');

		el = el.nextSibling; // label

		expect(el.htmlFor).toBe('test-number');

		expect(el.dataset['error']).toBe('Test error message');
	});


	it('defines a default createPasswordField() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createPasswordField).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createPasswordField).toBe('function');
	});
	

	it('can create a new standard password field', function(){

		var el = app.IViewable.prototype.default_createPasswordField.call(
		
			testView, // provides 'this' reference to IViewable methods

			's12',

			'test-password',

			 'test-password-hints',

			 new app.Account()
		);

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


	it('defines a default default createPasswordConfirmationField() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createPasswordConfirmationField).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createPasswordConfirmationField).toBe('function');
	});
	

	it('can create a new standard password field', function(){

		var el = app.IViewable.prototype.default_createPasswordConfirmationField.call(
		
			testView, // provides 'this' reference to IViewable methods

			's12',

			'test-password-confirmation'
		);

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


	it('defines a default createRequiredFieldExplanation() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createRequiredFieldExplanation).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createRequiredFieldExplanation).toBe('function');
	});
	

	it('can create a new required field description', function(){

		var el = app.IViewable.prototype.default_createRequiredFieldExplanation.call(
		
			testView
		);

		expect(el.constructor).toBe(HTMLDivElement); // outer div

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLParagraphElement);

		expect(el.classList[0]).toBe('required-indicator');
	});


	it('defines a default createSubmitCancelButtons() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createSubmitCancelButtons).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createSubmitCancelButtons).toBe('function');
	});
	

	it('can create a new required field description', function(){

		var el = app.IViewable.prototype.default_createSubmitCancelButtons.call(
		
			testView,

			'test-buttons'
		);

		expect(el.constructor).toBe(HTMLDivElement); // outer div

		expect(el.classList[0]).toBe('row');

		expect(el.classList[1]).toBe('form-submit');

		el = el.firstChild;

		expect(el.id).toBe('test-buttons-cancel'); // cancel button

		expect(el.classList[2]).toBe('btn-flat');

		expect(el.innerHTML).toBe('Cancel');

		el = el.nextSibling;

		expect(el.id).toBe('test-buttons-submit'); // cancel button

		expect(el.classList[2]).toBe('btn');

		el = el.firstChild;

		expect(el.nodeValue).toBe('Done');

		el = el.nextSibling;

		expect(el.classList[0]).toBe('material-icons');

		expect(el.innerHTML).toBe('send');
	});

	
	it('defines a default createSwitchField() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createSwitchField).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createSwitchField).toBe('function');
	});
	

	it('can create a new switch field', function(){

		var el = app.IViewable.prototype.default_createSwitchField.call(
		
			testView,'s7',

			'switch-test',

			'Switch Test Label',

			true,

			'Yes',

			'No'
		);

		expect(el.constructor).toBe(HTMLDivElement); // outer div

		expect(el.classList[0]).toBe('row');

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLDivElement); // main label div

		expect(el.classList[1]).toBe('s7');

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLSpanElement); // main label span

		expect(el.classList[1]).toBe('input-switch-label');

		expect(el.innerHTML).toBe('Switch Test Label');

		el = el.parentNode.nextSibling;

		expect(el.classList[2]).toBe('s5'); // outer switch div

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLDivElement); // inner switch div

		expect(el.classList[0]).toBe('switch');

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLSpanElement); // switch span

		el = el.firstChild;

		expect(el.htmlFor).toBe('switch-test'); // minor label

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLSpanElement); // 'off' label

		expect(el.innerHTML).toBe('No');

		el = el.nextSibling;

		expect(el.constructor).toBe(HTMLInputElement); // checkbox

		expect(el.type).toBe('checkbox');

		expect(el.checked).toBe(true);

		el = el.nextSibling;

		expect(el.constructor).toBe(HTMLSpanElement); // visual presentation of switch ('lever')

		expect(el.classList[0]).toBe('lever');

		el = el.nextSibling;

		expect(el.constructor).toBe(HTMLSpanElement); // 'on' label

		expect(el.innerHTML).toBe('Yes');
	});


	it('defines a default createTextField() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createTextField).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createTextField).toBe('function');
	});
	

	it('can create a new text field', function(){

		var el = app.IViewable.prototype.default_createTextField.call(
		
			testView,'s12',

			'text-test',

			'Text Test',

			true,

			'Some text'
		);

		expect(el.constructor).toBe(HTMLDivElement); // outer div

		expect(el.classList[0]).toBe('row');

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLDivElement); // inner div

		expect(el.classList[2]).toBe('s12');

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLInputElement); // input

		expect(el.id).toBe('text-test');

		expect(el.value).toBe('Some text');

		expect(el.required).toBe(true);

		el = el.nextSibling;

		expect(el.htmlFor).toBe('text-test'); // label

		expect(el.dataset.error).toBe('Please enter text test');

		el = el.firstChild;

		expect(el.nodeValue).toBe('Text Test');

		el = el.nextSibling;

		expect(el.classList[0]).toBe('required-indicator');
	});


	it('defines a default createTimeField() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createTimeField).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createTimeField).toBe('function');
	});
	

	it('can create a new time field', function(){

		var el = app.IViewable.prototype.default_createTimeField.call(
		
			testView,'s12',

			'time-test',

			'Time Test',

			true,

			new Date(1000000)
		);

		expect(el.constructor).toBe(HTMLDivElement); // outer div

		expect(el.classList[0]).toBe('row');

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLDivElement); // inner div

		expect(el.classList[2]).toBe('s12');

		el = el.firstChild;

		expect(el.constructor).toBe(HTMLInputElement); // input

		expect(el.id).toBe('time-test');

		expect(el.value).toBe((new Date(1000000).toLocaleTimeString()));

		expect(el.required).toBe(true);

		expect(el.classList[0]).toBe('timepicker');

		el = el.nextSibling;

		expect(el.htmlFor).toBe('time-test'); // label

		expect(el.dataset.error).toBe('Please enter time');

		el = el.firstChild;

		expect(el.nodeValue).toBe('Time Test');

		el = el.nextSibling;

		expect(el.classList[0]).toBe('required-indicator');

		el = el.parentNode.nextSibling;

		expect(el.id).toBe('time-test-error');

		expect(el.classList[0]).toBe('custom-validate');
	});


	it('defines a default displayValidation() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_displayValidation).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_displayValidation).toBe('function');
	});
	

	xit('can display validation messages for a form field', function(){

		
	});


	it('defines a default validateCapacity() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_validateCapacity).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_validateCapacity).toBe('function');
	});
	

	xit('can validate an event capacity form field', function(){

		
	});


	it('defines a default validateName() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_validateName).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_validateName).toBe('function');
	});
	

	xit('can validate a person name form field', function(){

		
	});


	it('defines a default validatePassword() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_validatePassword).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_validatePassword).toBe('function');
	});
	

	xit('can validate a password form field', function(){

		
	});


	it('defines a default validatePasswordConfirmation() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_validatePasswordConfirmation).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_validatePasswordConfirmation).toBe('function');
	});
	

	xit('can validate a password confirmation field', function(){

		
	});


	it('defines a default hide() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_hide).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_hide).toBe('function');
	});
	

	xit('can hide itself in the UI', function(){

		
	});


	it('defines a default show() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_show).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_show).toBe('function');
	});
	

	xit('can show (i.e. unhide) itself in the UI', function(){

		
	});
});