'use strict';

/* Jasmine.js unit test suite for IInterfaceable.js interface in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Interface IInterfaceable', function(){
	
	it('cannot be instantiated', function() {
		
		try { // this shold throw an error
			
			void new app.IInterfaceable();
		}
		
		catch(e) { // interfaces cannot be instantiated, so an error here is a positive outcome
		
			expect(e.name).toBe('InstantiationError');
		}
	});
	

	it('defines an isInstanceOf() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IInterfaceable.prototype.isInstanceOf).toBeDefined();
		
		expect(typeof app.IInterfaceable.prototype.isInstanceOf).toBe('function');
	});
		
	
	it('throws an error if isInstanceOf() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IInterfaceable.prototype.isInstanceOf();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.name).toBe('AbstractMethodError');
		}
	});
});