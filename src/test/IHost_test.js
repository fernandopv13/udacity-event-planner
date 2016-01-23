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
	
	
	/*
	it('defines a setHostName() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IHost.prototype.setHostName).toBeDefined();
	});
		
	
	it('throws an error if setHostName() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IHost.prototype.setHostName('');
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IHost.prototype.setHostName.errorMessage);
		}
	});
		
	
	it('defines a getHostName() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IHost.prototype.getHostName).toBeDefined();
	});
		
	
	it('throws an error if getHostName() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			void app.IHost.prototype.getHostName();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IHost.prototype.getHostName.errorMessage);
		}
	});
	*/
	
	it('defines a hostName() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IHost.prototype.hostName).toBeDefined();
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
});