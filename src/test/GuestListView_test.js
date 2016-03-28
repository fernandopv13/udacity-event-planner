'use strict';

/* Jasmine.js test suite for GuestListView class in Meetup Event Planner app.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/

describe('class GuestListView', function(){
	
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

			testView = testApp.controller.views()['guestListView'];

			testElement = testView.$renderContext();

			testEvent = testApp.data.events[0];

			done();

		}, 2000); // wait for page to load		
	});


	// Test generic class features

		it('inherits from ListView', function() {

			expect((new app.GuestListView()) instanceof app.ListView).toBe(true);
		})


		it('implements the IObservable interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.GuestListView, app.IObservable)).toBe(true);
		});


		it('implements the IObserver interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.GuestListView, app.IObserver)).toBe(true);
		});


		it('can be instantiated', function() {

			expect((new app.GuestListView()).constructor).toBe(app.GuestListView);
		});

	
	// Test generic View features

		it('can render itself into the DOM', function() {

			testElement.empty();

			expect(testElement.children().length).toBe(0);

			testView.render(testEvent);

			expect(testElement.children().length).toBeGreaterThan(0);
		});


		xit('responds to an update() call by rendering itself to the DOM', function() {
			
			// just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.update(testEvent, new app.EventView());
			
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

		
		it('displays a list of events', function() {
			
			expect(testElement.find('ul').length).toBe(1);

			expect(testElement.find('ul').find('li').length).toBeGreaterThan(0);
		});


		it('displays a main floating action button', function() {
			
			expect(testElement.find('.fixed-action-btn').length).toBe(1);
		});

	
	// Test UI behaviours

		xit('navigates to person view for item in list when it is activated', function() {
			
			expect(testApp.controller.currentView()).not.toBeDefined();

			testElement.find('.collection-item').first().trigger('mousedown');

			expect(testApp.controller.currentView().constructor).toBe(testApp.PersonView);
		});


		xit('navigates to person view for new item when the main floating action button is activated', function(done) {
			
			testView.render(testEvent);

			testView.show(5);

			setTimeout(function() {
				
				//expect(testApp.controller.currentView()).not.toBeDefined();

				testElement.find('#event-list-add').trigger('mousedown');

				expect(testApp.controller.currentView().constructor).toBe(testApp.EventView);

				done();

			}, 25);
		});

	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});