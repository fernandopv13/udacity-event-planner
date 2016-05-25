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
		
		//testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../build/index.html'); // test on production version of app

		testWindow = window.open(app.testutil.testTarget);

		setTimeout(function() {

			testWindow.app.controller.views().frontPageView.hide(5);

			testDoc = testWindow.document;
			
			testApp = testWindow.app;

			app.testutil.resetTestData(testApp);
			
			testView = testApp.controller.views().guestListView;

			testElement = testView.$renderContext();

			testEvent = testApp.Event.registry.getObjectById(0);

			void testApp.controller.selectedEvent(testEvent);

			void testApp.controller.selectedAccount(testApp.Account.registry.getObjectById(0));

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

			setTimeout(function() {
				
				expect(testElement.hasClass('hidden')).toBe(true);

				expect(testElement.css('display')).toBe('none');

				testView.show(5);

				done();

			}, 25);
		});


	// Test presence of UI widgets
		
		/*
		it('displays the main navigation', function() {
			
			expect(testWindow.$('#nav-main').length).toBe(1);
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
		*/

	
	// Test UI behaviours

		it('navigates to person view for item in list when it is activated', function(done) {
			
			//  Safari Win fails here b/c of a timing strangeness, so skip

			if (!/ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()) // skip iOS

				&& (navigator.userAgent.indexOf('Safari') === -1 || navigator.userAgent.indexOf('Chrome') > -1) ) { // skip Safari

				expect(testApp.controller.currentView()).not.toBeDefined();

				testElement.find('.collection-item').first().trigger('click');

				setTimeout(function() { // allow some time for the view to load
						
					testElement.find('.collection-item').first().trigger('click');

					//testWindow.console.log(testApp.controller.currentView().className());

					expect(testApp.controller.currentView().constructor).toBe(testApp.PersonView);

					done();

				}, 25);
			}

			else {

				expect(true).toBe(true);

				done();
			}
		});

		it('navigates to person view for new item when the main floating action button is activated', function() {
			
			testView.render(testEvent);

			void testApp.controller.currentView(testView, testEvent);

			expect(testApp.controller.currentView()).not.toBe(testApp.PersonView);

			testElement.find('#guest-list-add').trigger('click');

			expect(testApp.controller.currentView().constructor).toBe(testApp.PersonView);
		});

	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});