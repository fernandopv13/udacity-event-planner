'use strict';

/* Jasmine.js unit test suite for Controller class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class Controller', function(){
	
	it('implements the IObservable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.Controller, app.IObservable)).toBe(true);
	});


	xit('implements the IObserver interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.Controller, app.IObserver)).toBe(true);
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


		});


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
	});
});