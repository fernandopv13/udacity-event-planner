'use strict';

/* Jasmine.js unit test suite for NumberInputWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class NumberInputWidget', function(){
	
	it('inherits from InputWidget', function() {

		expect((new app.NumberInputWidget()) instanceof app.InputWidget).toBe(true);

		expect(typeof (new app.NumberInputWidget()).createProduct).toBe('function');

		expect(typeof (new app.NumberInputWidget()).init).toBe('function');

		expect(typeof (new app.NumberInputWidget()).validate).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.NumberInputWidget()).constructor).toBe(app.NumberInputWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.NumberInputWidget.instance().constructor).toBe(app.NumberInputWidget);

		expect(app.NumberInputWidget.instance()).toBe(app.NumberInputWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.NumberInputWidget();
		});
		
		
		it('can create a new standard number field', function(){

			var testElement = app.UIWidgetFactory.instance().createProduct('NumberInputWidget',
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

			expect(testElement.classList[0]).toBe('row');

			expect(testElement.firstChild.constructor).toBe(HTMLDivElement); // inner div

			expect(testElement.firstChild.classList[2]).toBe('s12');

			var el = testElement.firstChild.firstChild; // input

			expect(el.type).toBe('number');

			expect(el.id).toBe('test-number');

			expect(el.required).toBe(true);

			expect(el.value).toBe('23');

			expect(el.min).toBe('0');

			expect(el.max).toBe('50');

			expect(el.step).toBe('1');

			el = el.nextSibling; // label

			expect(el.htmlFor).toBe('test-number');

			expect(el.dataset.error).toBe('Please enter number');

			el = el.firstChild; // label text

			expect(el.nodeValue).toBe('Test Number');

			el = el.nextSibling; // required indicator

			expect(el.constructor).toBe(HTMLSpanElement);

			expect(el.classList[0]).toBe('required-indicator');

			//expect(el.nodeValue).toBe('*');
		});


		xit('can initialize an HTML number field upon rendering to the DOM', function() {


		});


		xit('can validate an HTML number field', function() {


		});


	});
});