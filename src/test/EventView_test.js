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
	
	var testApp, testDoc, testElement, testEvent, testView, testWindow;
	
	beforeAll(function(done){
		
		testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../dist/index.html'); // test on production version of app

		setTimeout(function() {

			testWindow.app.controller.views()['frontPageView'].hide(5);

			testDoc = testWindow.document;
			
			testApp = testWindow.app;

			void testApp.controller.selectedAccount(testApp.data.accounts[0]);

			testView = testApp.controller.views()['eventView'];

			testElement = testView.$renderContext();

			testEvent = testApp.data.events[0];

			void testApp.controller.selectedEvent(testApp.data.events[0]);

			void testView.model(testEvent);

			done();

		}, 2000); // wait for page to load		
	});
	
	
	// Test generic class features

		it('inherits from FormView', function() {

			expect((new app.EventView()) instanceof app.FormView).toBe(true);
		});

		
		it('implements the IObservable interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.EventView, app.IObservable)).toBe(true);
		});


		it('implements the IObserver interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.EventView, app.IObserver)).toBe(true);
		});


		it('can be instantiated', function() {

			expect((new app.EventView()).constructor).toBe(app.EventView);
		});

	
	// Test generic View features

		it('can render itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.render(testEvent);

			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});
		

		it('responds to an update() call by rendering itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.update(testEvent, new testApp.EventView());
			
			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});


		it('is hidden by default after rendering', function() {
			
			testView.render(testEvent);

			expect(testElement.hasClass('hidden')).toBe(true);
		});


		it('can show and hide itself', function(done) {
			
			testView.render(testEvent);

			testView.show(5);

			expect(testElement.hasClass('hidden')).toBe(false);

			expect(testElement.css('display')).toBe('block');

			testView.hide(5);

			expect(testElement.hasClass('hidden')).toBe(true);

			expect(testElement.css('display')).toBe('none');

			testView.show(5);

			setTimeout(function() {
				
				done();

			}, 1000);
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


		it('submits form when the "Done" button is activated if all fields valididate', function() {
			
			void testView.model().name('');

			void testView.model().location('');

			void testView.model().start(null);

			void testView.model().end(null);

			void testView.model().type('');

			void testView.model().capacity(0);

			void testView.model().host(null);

			void testView.model().description('');

			

			testWindow.$('#event-name').val('Darth Wader');

			testWindow.$('#event-location').val('Death Star');

			testWindow.$('#event-start-date').val('05/13/2250');

			testWindow.$('#event-end-date').val('05/14/2250');

			testWindow.$('#event-type').val('Attack Launch Day');

			testWindow.$('#event-capacity').val('10000');

			testWindow.$('#event-host').val('Sith Lord');

			testWindow.$('#event-description').val('Death to the rebels!');



			expect(app.FormWidget.instance().validate(testWindow.$('#event-form'))).toBe(true);
			
			testWindow.$('#event-form-submit').trigger('mousedown');


			expect(testView.model().name()).toBe('Darth Wader');

			expect(testView.model().location()).toBe('Death Star');

			expect(testView.model().start().valueOf()).toBe(8847352800000);

			expect(testView.model().end().valueOf()).toBe(8847439200000);

			expect(testView.model().type()).toBe('Attack Launch Day');

			expect(testView.model().host().hostName()).toBe('Sith Lord');

			expect(testView.model().description()).toBe('Death to the rebels!');
		});


		xit('discards entries and navigates out of form if "Cancel" button is activated', function() {


		});



	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});