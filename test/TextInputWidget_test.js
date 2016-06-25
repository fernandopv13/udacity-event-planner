'use strict';

/* Jasmine.js unit test suite for TextInputWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class TextInputWidget', function(){
	
	it('inherits from InputWidget', function() {

		expect((new app.TextInputWidget()) instanceof app.InputWidget).toBe(true);

		expect(typeof (new app.TextInputWidget()).createProduct).toBe('function');

		expect(typeof (new app.TextInputWidget()).init).toBe('function');

		expect(typeof (new app.TextInputWidget()).validate).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.TextInputWidget()).constructor).toBe(app.TextInputWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.TextInputWidget.instance().constructor).toBe(app.TextInputWidget);

		expect(app.TextInputWidget.instance()).toBe(app.TextInputWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.TextInputWidget();
		});
		
		
		it('can create a new standard text field', function(){

			var el = app.UIWidgetFactory.instance().createProduct('TextInputWidget',
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

			expect(el.dataset.error).toBe('Please enter test text');

			el = el.firstChild;

			expect(el.nodeValue).toBe('Test Text');

			el = el.nextSibling;

			expect(el.classList[0]).toBe('required-indicator');
		});


		xit('can initialize an HTML number field upon rendering to the DOM', function() {


		});


		xit('can validate an HTML number field', function() {


		});


	});
});