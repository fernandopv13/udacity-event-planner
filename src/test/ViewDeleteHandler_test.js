'use strict';

/* Jasmine.js unit test suite for ViewDeleteHandler class in meetup even planner application
*
*  Being a delegate of Controller, this class also must rely on underlying app structure
* (Views, Models etc.) to be in place, so test after those.
*/

describe('class ViewDeleteHandler', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testAccount, testApp, testElement, testEvent, testPerson, testHandler, testObserver, testView, testWindow;
	
	beforeAll(function(done){
		
		//testWindow = window.open('../index.html'); // test on development version of app

		testWindow = window.open('../../build/index.html'); // test on production version of app
		
		setTimeout(function() {

			testWindow.app.controller.views().frontPageView.hide(5);

			testApp = testWindow.app;

			testAccount = testApp.data.accounts[0];

			testEvent = testAccount.events()[0];

			void testApp.controller.selectedEvent(testEvent);

			testPerson = testEvent.guests()[0];

			void testApp.controller.selectedGuest(testPerson);

			testApp.controller.onAccountSelected(testAccount);

			testView = testApp.controller.views().eventListView;

			testElement = testView.$renderContext();

			testView.render(testAccount);

			testView.show(5);


			testApp.controller.observers().forEach(function(observer) {

				if (observer.constructor === testApp.ViewDeleteHandler) {

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

		expect((new testApp.ViewDeleteHandler()).constructor).toBe(testApp.ViewDeleteHandler);
	});


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

	xit('executes its algorithm if updated with a matching UIAction, a Model and a View', function() {

		testObserver.notification = null;

		testHandler.update(testApp.View.UIAction.DELETE, new testApp.Event(), new testApp.EventView());
		
		expect(testObserver.notification).not.toBe(null);

		expect(testObserver.notification.length).toBe(2);

		expect(testObserver.notification[0].isInstanceOf(testApp.Event)).toBe(true);

		expect(testObserver.notification[1].isInstanceOf(testApp.EventView)).toBe(true);
	});


	xit('does not execute its algorithm if updated with a non-matching UIAction', function() {

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


	it('can remove a guest', function() {

		var ctrl = testApp.controller,

		guest = ctrl.selectedGuest(testPerson),

		id = guest.id(),

		len = testEvent.guests().length;

		
		void ctrl.selectedEvent(testEvent);

		expect(guest.isInstanceOf(testApp.Person)).toBe(true);

		expect(testApp.Person.registry.getObjectById(id)).toBe(guest);

		
		testHandler.update(testApp.View.UIAction.DELETE, guest, new testApp.PersonView());
		
		
		expect(testEvent.guests().length).not.toEqual(len);

		expect(ctrl.selectedGuest()).toBe(null);

		expect(testApp.Person.registry.getObjectById(id)).toBe(guest);

		expect(ctrl.currentView().constructor).toBe(testApp.EventListView); // bit of a hack, refine later
	});

	
	it('can delete an Event', function() {

		var ctrl = testApp.controller,

		event = ctrl.selectedEvent(testEvent),

		id = event.id();

		
		void ctrl.selectedAccount(testAccount);

		expect(event.isInstanceOf(testApp.Event)).toBe(true);

		expect(testApp.Event.registry.getObjectById(id)).toBe(event);

		
		testHandler.update(testApp.View.UIAction.DELETE, event, new testApp.EventView());
		
		
		expect(ctrl.selectedEvent()).toBe(null);

		expect(testApp.Event.registry.getObjectById(id)).not.toBe(event);

		expect(ctrl.currentView().constructor).toBe(testApp.EventListView);
	});


	it('can delete an account', function() {

		var ctrl = testApp.controller,

		account = ctrl.selectedAccount(testAccount),

		id = account.id();

		
		expect(account.isInstanceOf(testApp.Account)).toBe(true);

		expect(testApp.Account.registry.getObjectById(id)).toBe(account);

		
		testHandler.update(testApp.View.UIAction.DELETE, account, new testApp.FrontPageView());
		
		
		expect(ctrl.selectedAccount()).toBe(null);

		expect(testApp.Account.registry.getObjectById(id)).not.toBe(account);

		expect(ctrl.currentView().constructor).toBe(testApp.FrontPageView);
	});


	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});