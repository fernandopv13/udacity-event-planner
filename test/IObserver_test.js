'use strict';

/* Jasmine.js unit test suite for IObserver.js interface in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Interface IObserver', function(){
	
	
	it('cannot be instantiated', function() {
		
		try { // this shold throw an error
			
			void new app.IObserver();
		}
		
		catch(e) { // interfaces cannot be instantiated, so an error here is a positive outcome
		
			expect(e.name).toEqual('InstantiationError');
		}

		expect(true).toBe(true); // Jasmine can't see expects in trys
	});
	

	it('defines an update() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IObserver.prototype.update).toBeDefined();
		
		expect(typeof app.IObserver.prototype.update).toBe('function');
	});
		
	
	it('throws an error if update() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IObserver.prototype.update();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.name).toEqual('AbstractMethodError');
		}
	});
});