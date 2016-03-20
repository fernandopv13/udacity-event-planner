'use strict';

/* Jasmine.js unit test suite for SwitchInput class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class SwitchInput', function(){
	
	it('inherits from InputWidget', function() {

		expect((new app.SwitchInput()) instanceof app.InputWidget).toBe(true);

		expect(typeof (new app.SwitchInput()).createProduct).toBe('function');

		expect(typeof (new app.SwitchInput()).init).toBe('function');

		expect(typeof (new app.SwitchInput()).validate).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.SwitchInput()).constructor).toBe(app.SwitchInput);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.SwitchInput.instance().constructor).toBe(app.SwitchInput);

		expect(app.SwitchInput.instance()).toBe(app.SwitchInput.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.SwitchInput();
		});
		
		
		it('can create a new standard password confirmation field', function(){

			var el = app.UIWidgetFactory.instance().createProduct('SwitchInput',
			{
				width: 's7',

				id: 'switch-test',

				label: 'Test Switch',

				datasource: true,

				yes: 'Yes',

				no: 'no'
			});

			expect(el.constructor).toBe(HTMLDivElement); // outer div

			expect(el.classList[0]).toBe('row');

			el = el.firstChild;

			expect(el.constructor).toBe(HTMLDivElement); // main label div

			expect(el.classList[1]).toBe('s7');

			el = el.firstChild;

			expect(el.constructor).toBe(HTMLSpanElement); // main label span

			expect(el.classList[1]).toBe('input-switch-label');

			expect(el.innerHTML).toBe('Test Switch');

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


		xit('can initialize an HTML number field upon rendering to the DOM', function() {


		});


		xit('can validate an HTML number field', function() {


		});


	});
});