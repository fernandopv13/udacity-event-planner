'use strict';

/* Jasmine.js unit test suite for Controller class in meetup even planner application
*
* This suite relies heavily on the rest of the MVC framework to be coded and working.
*
* Trying to create mocks for all the Model and View classes would far too burdensome.
*/

describe('class Controller', function(){
	
	it('implements the IObservable interface', function() {
		
			expect(app.IInterfaceable.isImplementationOf(app.Controller, app.IObservable)).toBe(true);
	});


	it('implements the IObserver interface', function() {
		
			expect(app.IInterfaceable.isImplementationOf(app.Controller, app.IObserver)).toBe(true);
	});


	it('can be instantiated', function() {

		expect((new app.Controller()).constructor).toBe(app.Controller);
	});


	describe('Controller instance', function() {

		var testController;

		beforeEach(function(){

			testController = new app.Controller();
		});

		
		xit('can initialize', function() {

			app.init();

			testController.init();

			expect(app.controller.observers.length).toBeGreaterThan(0); // IViewables registered with controller

			expect(app.Event.registry.getObjectById(0).removeObserver(testController)).toBe(testController); // controller registered with IModelables
		});


		xit('can get and set the current (visible) view', function() {

			var testEvent = new app.Event();

			expect(testController.selectedEvent(testEvent)).toBe(testEvent);
		});


		xit('rejects attempt to set view that is not an IViewable', function() {

			try {

				testController.selectedEvent('not an Event');
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


		// IInterfaceable testing

		it('can tell if it is an implementation of a custom app interface', function() {

			expect(testController.isInstanceOf(app.IObservable)).toBe(true);

			expect(testController.isInstanceOf(app.IObserver)).toBe(true);

			expect(testController.isInstanceOf(Array)).toBe(false);
		});

	});
});