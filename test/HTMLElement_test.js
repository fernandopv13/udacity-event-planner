'use strict';

/* Jasmine.js unit test suite for HTMLElement class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class HTMLElement', function(){
	
	it('inherits from UIWidget', function() {

		expect((new app.HTMLElement()) instanceof app.UIWidget).toBe(true);

		expect(typeof (new app.HTMLElement()).createProduct).toBe('function');

		expect(typeof (new app.HTMLElement()).init).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.HTMLElement()).constructor).toBe(app.HTMLElement);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.HTMLElement.instance().constructor).toBe(app.HTMLElement);

		expect(app.HTMLElement.instance()).toBe(app.HTMLElement.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.HTMLElement();
		});
		
		
		it('can create an HTML element', function() {

			var testElement = app.HTMLElement.instance().createProduct(
			{
				element: 'div', // the type of element required

				attributes: // an arbitrary collection of name-value pairs
				{
					id: 'demo-element',

					required: true
				},

				classList: // an arbitrary list of strings
				[
					'row',

					'col',

					's12'
				],

				dataset: // an arbitrary collection of name-value pairs
				{
					success: 'You made it!',

					error: 'Please try again'
				},
				
				innerHTML: 'Hello world',

				listeners:
				{
					click: function() {},

					blur: function() {}
				}
			});

			expect(testElement.constructor).toBe(HTMLDivElement);

			expect(testElement.id).toBe('demo-element');

			expect(testElement.className.indexOf('row')).toBeGreaterThan(-1);

			expect(testElement.className.indexOf('col')).toBeGreaterThan(-1);

			expect(testElement.className.indexOf('s12')).toBeGreaterThan(-1);

			expect(testElement.dataset.success).toBe('You made it!');

			expect(testElement.dataset.error).toBe('Please try again');

			expect(testElement.innerHTML).toBe('Hello world');
		});
	});
});