'use strict';

/* Jasmine.js unit test suite for IHost interface in meetup even planner application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Interface IHost', function(){
	
	it('cannot be instantiated', function() {
		
		try { // this shold throw an error
			
			void new app.IHost();
		}
		
		catch(e) { // interfaces cannot be instantiated, so an error here is a positive outcome
		
			expect(e.message).toEqual('Interface IHost cannot be instantiated. Realize in derived classes.');
		}
	});
	

	it('defines a hostName() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IHost.prototype.hostName).toBeDefined();

		expect(typeof app.IHost.prototype.hostName).toBe('function');
	});
		
	
	it('throws an error if hostName() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			void app.IHost.prototype.hostName();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IHost.prototype.hostName.errorMessage);
		}
	});


	it('defines an isInstanceOf() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IHost.prototype.isInstanceOf).toBeDefined();

		expect(typeof app.IHost.prototype.isInstanceOf).toBe('function');
	});
		
	
	it('throws an error if isInstanceOf() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			void app.IHost.prototype.isInstanceOf();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IHost.prototype.isInstanceOf.errorMessage);
		}
	});
});