'use strict';

/* Jasmine.js unit test suite for InputDescriptionWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class InputDescriptionWidget', function(){
	
	it('inherits from UIWidget', function() {

		expect((new app.InputDescriptionWidget()) instanceof app.UIWidget).toBe(true);

		expect(typeof (new app.InputDescriptionWidget()).createProduct).toBe('function');

		expect(typeof (new app.InputDescriptionWidget()).init).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.InputDescriptionWidget()).constructor).toBe(app.InputDescriptionWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.InputDescriptionWidget.instance().constructor).toBe(app.InputDescriptionWidget);

		expect(app.InputDescriptionWidget.instance()).toBe(app.InputDescriptionWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.InputDescriptionWidget();
		});
		
		
		it('can create a new field description', function(){

			var el = app.UIWidgetFactory.instance().createProduct('InputDescriptionWidget',
			{
				datasource: 'Test field description',

				divider: false
			});

			expect(el.constructor).toBe(HTMLDivElement); // outer div

			el = el.firstChild;

			expect(el.constructor).toBe(HTMLParagraphElement);

			expect(el.innerHTML).toBe('Test field description');
		});
	});
});