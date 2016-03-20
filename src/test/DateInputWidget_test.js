'use strict';

/* Jasmine.js unit test suite for DateInputWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class DateInputWidget', function(){
	
	it('inherits from InputWidget', function() {

		expect((new app.DateInputWidget()) instanceof app.InputWidget).toBe(true);

		expect(typeof (new app.DateInputWidget()).createProduct).toBe('function');

		expect(typeof (new app.DateInputWidget()).init).toBe('function');

		expect(typeof (new app.DateInputWidget()).validate).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.DateInputWidget()).constructor).toBe(app.DateInputWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.DateInputWidget.instance().constructor).toBe(app.DateInputWidget);

		expect(app.DateInputWidget.instance()).toBe(app.DateInputWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.DateInputWidget();
		});
		
		
		it('can create a new standard date field', function(){

			var testElement = app.UIWidgetFactory.instance().createProduct('DateInputWidget',
			{
				width: 's6',

				id: 'test-date',

				label: 'Test Date',

				required: true,

				datasource: new Date(1000),

				errormessage: 'Please enter date'
			});

			expect(testElement.constructor).toBe(HTMLDivElement); // outer div

			expect(testElement.classList[0]).toBe('row');

			expect(testElement.firstChild.constructor).toBe(HTMLDivElement); // inner div

			expect(testElement.firstChild.classList[2]).toBe('s6');

			var el = testElement.firstChild.firstChild; // input

			expect(el.type).toBe('datetime-local');

			expect(el.id).toBe('test-date');

			expect(el.required).toBe(true);

			expect(Date.parse(el.value)).toBe(1000); //expect(el.value).toBe('1/1/1970');

			//expect(el.readonly).toBe(true);

			expect(el.required).toBe(true);

			expect(el.classList[1]).toBe('validate');

			el = el.nextSibling; // label

			expect(el.htmlFor).toBe('test-date');
		});


		xit('can initialize an HTML date field upon rendering to the DOM', function() {


		});


		xit('can validate an HTML date field', function() {


		});


	});
});