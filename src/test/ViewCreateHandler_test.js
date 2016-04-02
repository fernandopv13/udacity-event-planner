'use strict';

/* Jasmine.js unit test suite for ViewCreateHandler class in meetup even planner application
*
*  Being a delegate of Controller, this class also must rely on underlying app structure
* (Views, Models etc.) to be in place, so test after those.
*/

describe('class ViewCreateHandler', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testAccount, testApp, testElement, testHandler, testObserver, testView, testWindow;
	
	beforeAll(function(done){
		
		testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../dist/index.html'); // test on production version of app
		
		setTimeout(function() {

			testWindow.app.controller.views()['frontPageView'].hide(5);

			testApp = testWindow.app;

			testAccount = testApp.data.accounts[0];

			testApp.controller.onAccountSelected(testAccount);

			testView = testApp.controller.views()['eventListView'];

			testElement = testView.$renderContext();

			testView.render(testAccount);

			testView.show(5);

			testApp.controller.observers().forEach(function(observer) {

				if (observer.constructor === testApp.ViewCreateHandler) {

					testHandler = observer;
				}
			});

			testObserver = new app.TestObserver();

			testHandler.registerObserver(testObserver);

			done();

		}, 2000); // wait for page to load//500
		
	});

	

	it('inherits from ViewUpdateHandler', function() {
		
			expect(testHandler.ssuper()).toBe(testApp.ViewUpdateHandler); // verify both direct inheritance and parent constructor reference

			expect(typeof testHandler.update).toBe('function') // verify inheritance of parent methods via prototype

			// this should be enough to prove that basics of inheritance are in place, no need to test for every inherited member
	});


	it('can be instantiated', function() {

		expect((new testApp.ViewCreateHandler()).constructor).toBe(testApp.ViewCreateHandler);
	});


	describe('instance', function() {

		it('can get the type of UIAction it will respond to (expressed as an integer)', function() {

			expect(typeof testHandler.uiAction).toBe('function');

			expect(parseInt(testHandler.uiAction())).toEqual(testHandler.uiAction());
		});


		it('rejects attempt to set its UIAction', function() {

			try {

				testHandler.uiAction('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true); // Jasmine.js may not see expects in trys
		});


		// these won't work unless we're testing with a live UI

		it('executes its algorithm if updated with a matching UIAction, a Model and a View', function() {

			testObserver.notification = null;

			testHandler.update(testApp.View.UIAction.CREATE, new testApp.Event(), new testApp.EventView());
			
			expect(testObserver.notification).not.toBe(null);

			expect(testObserver.notification.length).toBe(2);

			expect(testObserver.notification[0].isInstanceOf(testApp.Event)).toBe(true);

			expect(testObserver.notification[1].isInstanceOf(testApp.EventView)).toBe(true);
		});


		it('does not execute its algorithm if updated with a non-matching UIAction', function() {

			testObserver.notification = null;

			testHandler.update(testApp.View.UIAction.DELETE, new testApp.Event(), new testApp.EventView());
			
			expect(testObserver.notification).toBe(null);
		});

		
		it('does not execute its algorithm if updated with a model that is not an instance of Model', function() {

			testObserver.notification = null;

			testHandler.update(testApp.View.UIAction.CREATE, {}, new testApp.EventView());
			
			expect(testObserver.notification).toBe(null);
		});


		it('does not execute its algorithm if updated with a view that is not an instance of View', function() {

			testObserver.notification = null;

			testHandler.update(testApp.View.UIAction.CREATE, new testApp.Event(), {});
			
			expect(testObserver.notification).toBe(null);
		});


		it('can create a new account', function() {

			void testApp.controller.selectedAccount(null);

			expect(testApp.controller.selectedAccount()).toBe(null);

			testHandler.update(testApp.View.UIAction.CREATE, new testApp.Account(), new testApp.SignUpView());

			expect(testApp.controller.selectedAccount()).not.toBe(null);
			
			expect(testApp.controller.selectedAccount().constructor).toBe(testApp.Account);
		});


		it('can create a new Event', function() {

			void testApp.controller.selectedAccount(testAccount);

			void testApp.controller.newModel(null);

			testHandler.update(testApp.View.UIAction.CREATE, new testApp.Event(), new testApp.EventView());
			
			expect(testApp.controller.newModel().constructor).toBe(testApp.Event);
		});


		it('can create a new Person (guest)', function() {

			void testApp.controller.newModel(null);

			void testApp.controller.selectedEvent(testApp.data.events[0]);

			testHandler.update(testApp.View.UIAction.CREATE, new testApp.Person(), new testApp.PersonView());
			
			expect(testApp.controller.newModel().constructor).toBe(testApp.Person);
		});
	});


	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});