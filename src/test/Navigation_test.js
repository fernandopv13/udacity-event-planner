'use strict';

/* Jasmine.js test suite for main navigation in Meetup Event Planner app.
*
* Using copy of EventListView test but only testing the navigation
*
*/

describe('Navigation', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testAccount, testApp, testDoc, testElement, testView, testWindow;
	
	beforeAll(function(done){

		//testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../build/index.html'); // test on production version of app

		testWindow = window.open(app.testutil.testTarget);

		setTimeout(function() {

			testWindow.app.controller.views().frontPageView.hide(5);

			testDoc = testWindow.document;
			
			testApp = testWindow.app;

			app.testutil.resetTestData(testApp);

			testView = testApp.controller.views().eventListView;

			testElement = testView.$renderContext();

			testAccount = testApp.controller.selectedAccount(testApp.Account.registry.getObjectList()[0]);

			void testApp.controller.registerObserver(testView.model(testAccount));

			void testApp.controller.selectedAccount(testAccount);

			done();

		}, 2000); // wait for page to load		
	});


	// Test generic menu features

		it('can render itself into the DOM', function() {

			testView.render(testAccount);
			
			expect(testWindow.$('#nav-main').length).toBe(1);
		});

	// Test presence of menu items
		
		it('displays the main navigation', function() {
			
			expect(testWindow.$('#nav-main').length).toBe(1);
		});


	// Test menu behaviours

		it('navigates to account settings view when its link is activated', function() {
			
			var menuItem;

			testWindow.$('.nav-menu-item').each(function(ix, el) {

				if ($(el).data('view') && $(el).data('view').toLowerCase() === 'accountsettingsview') {

					menuItem = el;
				}
			});

			testWindow.$(menuItem).trigger('mousedown');

			expect(testApp.controller.currentView().constructor).toBe(testApp.AccountSettingsView);
		});


		it('navigates to account profile view when its link is activated', function() {
			
			var menuItem;

			testWindow.$('.nav-menu-item').each(function(ix, el) {

				if ($(el).data('view') && $(el).data('view').toLowerCase() === 'accountprofileview') {

					menuItem = el;
				}
			});

			testWindow.$(menuItem).trigger('mousedown');

			expect(testApp.controller.currentView().constructor).toBe(testApp.AccountProfileView);
		});
		

		it('navigates to main page (EventListView) when its logotype link is activated', function(done) {
			
			void testWindow.$('.brand-logo').trigger('mousedown');

			setTimeout(function(){

				expect(testApp.controller.currentView().constructor).toBe(testApp.EventListView);

				done();

			}, 250);

			expect(true).toBe(true);
		});
		
	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});