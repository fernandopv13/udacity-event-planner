'use strict';

/* Jasmine.js test suite for EventView class in Meetup Event Planner app.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/

describe('Class EventView', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testApp, testDoc, testElement, testView, testWindow;
	
	beforeAll(function(done){
		
		testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../dist/index.html'); // test on production version of app

		setTimeout(function() {

			testDoc = testWindow.document;
			
			testApp = testWindow.app;

			testView = testApp.controller.views()['eventView'];

			testElement = testView.$renderContext();

			done();

		}, 500); // wait for page to load		
	});
	
	
	// Test generic View features

		it('inherits from FormView', function() {

			expect((new app.EventView()) instanceof app.FormView).toBe(true);
		});


		it('can render itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.render(new app.Event());

			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});
		

		xit('responds to an update() call by rendering itself to the DOM', function() {
			
			// just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.update(new app.Event(), new app.EventView());
			
			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});


		it('is hidden by default after rendering', function() {
			
			testView.render(new app.Event());

			expect(testElement.hasClass('hidden')).toBe(true);
		});


		it('can show and hide itself', function(done) {
			
			testView.render(new app.Event());

			testView.show(5);

			expect(testElement.hasClass('hidden')).toBe(false);

			expect(testElement.css('display')).toBe('block');

			testView.hide(5);

			expect(testElement.hasClass('hidden')).toBe(true);

			expect(testElement.css('display')).toBe('none');

			testView.show(5);

			setTimeout(function() {
				
				done();

			}, 25);
		});

	
	// Test presence of UI widgets

		xit('displays the main navigation', function() {
			
			expect(testWindow.$('.navbar-fixed').length).toBe(1);
		});


		it('displays a main heading', function() {
			
			expect(testElement.children().find('h4').length).toBe(1);
		});


		it('displays a required name field', function() {
			
			var el = $(testElement).find('#event-name');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).toBe('required');

		});


		it('displays an optional location field', function() {
			
			var el = $(testElement).find('#event-location');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays a required start date field', function() {
			
			var el = $(testElement).find('#event-start-date');

			expect(el.length).toBe(1);

			//expect(el.attr('type')).toBe('text');

			expect(el.data('customValidator')).toBe('EventView.prototype.validateStartDate');

			expect(el.attr('required')).toBe('required');
		});


		it('displays an optional end date field', function() {
			
			var el = $(testElement).find('#event-end-date');

			expect(el.length).toBe(1);

			//expect(el.attr('type')).toBe('text');

			expect(el.data('customValidator')).toBe('EventView.prototype.validateEndDate');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional event type field', function() {
			
			var el = $(testElement).find('#event-type');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional capacity field', function() {
			
			var el = $(testElement).find('#event-capacity');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('number');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional host field', function() {
			
			var el = $(testElement).find('#event-host');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();
		});

		
		it('displays an optional description field', function() {
			
			var el = $(testElement).find('#event-description');

			expect(el.length).toBe(1);

			expect(el.is('textarea')).toBe(true);

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays a "Cancel" link', function() {
			
			var el = testElement.children().find('#event-form-cancel');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(false);
		});


		it('displays a "Done" button', function() {
			
			var el = $(testElement).find('#event-form-submit');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(true);
		});


	// Test UI behaviours

		it('will not submit the form if there are validation errors in any fields', function() {
			
			testWindow.$('#event-name').val('');

			expect(app.FormWidget.instance().validate(testWindow.$('#event-form'))).toBe(false);

			testWindow.$('#event-form-submit').trigger('mousedown');

			expect(testApp.controller.currentView()).not.toBeDefined();
		});


		xit('submits form when the "Done" button is activated if all fields valididate', function() {
			
			testWindow.$('#event-name').val('a name');

			testWindow.$('#event-start-date').val('05/13/2011');

			testWindow.$('#event-end-date').val('05/14/2011');

			expect(app.FormWidget.instance().validate(testWindow.$('#event-form'))).toBe(true);
			
			testWindow.$('#event-form-submit').trigger('mousedown');

			expect(testApp.controller.currentView().constructor).toBe(testApp.EventListView);
		});


	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});