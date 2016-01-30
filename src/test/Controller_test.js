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
	});
});