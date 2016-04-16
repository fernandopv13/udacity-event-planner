'use strict';

/* Jasmine.js unit test suite for Controller class in meetup even planner application
*
* This suite relies heavily on the rest of the MVC framework to be coded and working.
*
* Trying to create mocks for all the Model and View classes would far too burdensome.
*/

describe('class Controller', function(){
	
	it('implements the IInterfaceable interface', function() {
		
			expect(app.IInterfaceable.isImplementationOf(app.Controller, app.IInterfaceable)).toBe(true);
	});


	it('implements the IObservable interface', function() {
	
			expect(app.IInterfaceable.isImplementationOf(app.Controller, app.IObservable)).toBe(true);
	});


	it('implements the IObserver interface', function() {
		
			expect(app.IInterfaceable.isImplementationOf(app.Controller, app.IObserver)).toBe(true);
	});


	it('can be instantiated', function() {

		expect((new app.Controller()).constructor).toBe(app.Controller);
	});


	describe('instance', function() {

		var testController = new app.Controller(), testObserver = new app.TestObserver();

		testController.init();

		testController.registerObserver(testObserver);

		it('can initialize', function() {

			app.init();

			testController.init();

			expect(app.controller.observers().length).toBeGreaterThan(0); // IViewables registered with controller

			expect(app.Event.registry.getObjectById(0).removeObserver(testController)).toBe(testController); // controller registered with IModelables
		});


		// Accessor testing

			xit('can get and set the current (visible) view', function() {

				var testView = new app.FrontPageView();

				expect(testController.currentView(testView, null)).toBe(testView);
			});


			xit('rejects attempt to set view that is not a View instance', function() {

				try {

					testController.currentView('not a View');
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}
			});

			
			xit('displays the current view being set and hides all others', function() {
			})


			it('can get and set the selected (active) account', function() {

				var testAccount = new app.Account();

				expect(testController.selectedAccount(testAccount)).toBe(testAccount);
			});


			it('rejects attempt to set account that is not an Account', function() {

				try {

					testController.selectedAccount('not an Account');
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}
			});


			it('can get and set the selected (active) event', function() {

				var testEvent = new app.Event();

				expect(testController.selectedEvent(testEvent)).toBe(testEvent);
			});


			it('rejects attempt to set event that is not an Event', function() {

				try {

					testController.selectedEvent('not an Event');
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}
			});


			it('can get and set the selected (active) guest', function() {

				var testGuest = new app.Person();

				expect(testController.selectedGuest(testGuest)).toBe(testGuest);
			});


			it('rejects attempt to set guest that is not a Guest', function() {

				try {

					testController.selectedGuest('not a Person');
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}
			});


			it('can get and set its newModel', function() {

				var testSource = new app.Person();

				expect(testController.newModel(testSource)).toBe(testSource);
			});


			it('rejects attempt to set newModel that is not a Model', function() {

				try {

					testController.newModel('not a Model');
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}
			});


			it('can get and set its sourceModel', function() {

				var testSource = new app.Person();

				expect(testController.sourceModel(testSource)).toBe(testSource);
			});


			it('rejects attempt to set sourceModel that is not a Model', function() {

				try {

					testController.sourceModel('not a Model');
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}
			});


			it('can get and set its cloneModel', function() {

				var testSource = new app.Person();

				expect(testController.sourceModel(testSource)).toBe(testSource);

				expect(testController.cloneModel(testSource)).toBe(testSource);
			});


			it('rejects attempt to set cloneModel that is not a Model', function() {

				try {

					testController.cloneModel('not a Model');
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}
			});


			it('rejects attempt to set cloneModel that not of same class as sourceModel', function() {

				void testController.sourceModel(new app.Email());

				try {

					testController.cloneModel(new app.Password());
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}
			});



		describe('communication protocol', function() {

			beforeEach(function() {

				testObserver.notification = null;
			});


			xit('can notify its Views of an update from a Model', function() {

				// input signature: update(Model)

				// output signature: nofityObservers(Model, View)

				testController.views()['eventView'].render(new app.Event());

				testController.update(new app.Event());

				expect(testObserver.notification.length).toEqual(2);

				expect(testObserver.notification[0].constructor).toBe(app.Event);

				expect(testObserver.notification[1].constructor).toBe(app.EventView);
			});

			
			xit('can notify its ViewUpdateHandlers of an update from a View', function() {

				// input signature: update(View, Model, int)

				// output signature: notifyObservers(int, Model, View)

				testController.update(new app.EventView(), new app.Event(), 7);

				expect(testObserver.notification.length).toEqual(3);

				expect(testObserver.notification[0]).toEqual(1);

				expect(testObserver.notification[1].constructor).toBe(app.Event);

				expect(testObserver.notification[2].constructor).toBe(app.EventView);
			});


			xit('can notify its Models of an update from a ViewUpdateHandler', function() {

				// input signature: update(Model, int)

				// output signature: notifyObservers(Model, int)

				testController.update(new app.Email('ada@weweq.gwegwe'), 7);

				expect(testObserver.notification.length).toEqual(2);

				expect(testObserver.notification[0].constructor).toBe(app.Email);

				expect(testObserver.notification[1]).toEqual(1);
			});


			xit('can notify its Views of an update from a ViewUpdateHandler', function() {

				// input signature: update(Model, View)

				// output signature: notifyObservers(Model, View)

				testController.update(new app.Event(), new app.EventView());

				expect(testObserver.notification.length).toEqual(2);

				expect(testObserver.notification[0].constructor).toBe(app.Event);

				expect(testObserver.notification[1].constructor).toBe(app.EventView);
			});
		});
			

		// IInterfaceable testing

		xit('can tell if it is an implementation of a custom app interface', function() {

			expect(testController.isInstanceOf(app.IObservable)).toBe(true);

			expect(testController.isInstanceOf(app.IObserver)).toBe(true);

			expect(testController.isInstanceOf(Array)).toBe(false);
		});
	});
});