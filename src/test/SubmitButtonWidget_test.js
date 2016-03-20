'use strict';

/* Jasmine.js unit test suite for SubmitButtonWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class SubmitButtonWidget', function(){
	
	it('inherits from UIWidget', function() {

		expect((new app.SubmitButtonWidget()) instanceof app.UIWidget).toBe(true);

		expect(typeof (new app.SubmitButtonWidget()).createProduct).toBe('function');

		expect(typeof (new app.SubmitButtonWidget()).init).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.SubmitButtonWidget()).constructor).toBe(app.SubmitButtonWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.SubmitButtonWidget.instance().constructor).toBe(app.SubmitButtonWidget);

		expect(app.SubmitButtonWidget.instance()).toBe(app.SubmitButtonWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.SubmitButtonWidget();
		});
		
		
		it('can create a new submit button', function() {

			var el = app.SubmitButtonWidget.instance().createProduct(
			{
				id: 'test-submit-button',

				label: 'Done',

				icon: 'send'
			});

			expect(el.id).toBe('test-submit-button'); // submit button

			expect(el.classList[2]).toBe('btn');

			el = el.firstChild;

			expect(el.nodeValue).toBe('Done');

			el = el.nextSibling;

			expect(el.classList[0]).toBe('material-icons');

			expect(el.innerHTML).toBe('send');
		});
	});
});