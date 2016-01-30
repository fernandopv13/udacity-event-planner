'use strict';

/* Jasmine.js unit test suite for IObservable.js interface in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Interface IObservable', function(){
	
	
	it('cannot be instantiated', function() {
		
		try { // this shold throw an error
			
			void new app.IObservable();
		}
		
		catch(e) { // interfaces cannot be instantiated, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IObservable.constructorErrorMessage);
		}
	});
	

	xit('defines an observers() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IObservable.prototype.observers).toBeDefined();
		
		expect(typeof app.IObservable.prototype.observers).toBe('function');
	});
		
	
	xit('throws an error if observers() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IObservable.prototype.observers();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IObservable.prototype.observers.errorMessage);
		}
	});
	
	xit('defines a notifyObservers() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IObservable.prototype.notifyObservers).toBeDefined();
		
		expect(typeof app.IObservable.prototype.notifyObservers).toBe('function');
	});
		
	
	xit('throws an error if notifyObservers() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IObservable.prototype.notifyObservers();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IObservable.prototype.notifyObservers.errorMessage);
		}
	});
	
	it('defines a default registerObserver() method', function() {
			
		// verify that method signature exists
		
		expect(app.IObservable.prototype.default_registerObserver).toBeDefined();
		
		expect(typeof app.IObservable.prototype.default_registerObserver).toBe('function');
	});
		
	
	xit('throws an error if registerObserver() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IObservable.prototype.registerObserver();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IObservable.prototype.registerObserver.errorMessage);
		}
	});
});