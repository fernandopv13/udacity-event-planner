'use strict';

/* Jasmine.js unit test suite for IModelable.js interface in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Interface IModelable', function(){
	
	
	it('cannot be instantiated', function() {
		
		try { // this shold throw an error
			
			void new app.IModelable();
		}
		
		catch(e) { // interfaces cannot be instantiated, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IModelable.constructorErrorMessage);
		}
	});
	

	it('defines an update() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IModelable.prototype.update).toBeDefined();
		
		expect(typeof app.IModelable.prototype.update).toBe('function');
	});
		
	
	it('throws an error if update() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IModelable.prototype.update();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IModelable.prototype.update.errorMessage);
		}
	});


	it('defines a default isInstanceOf() method', function() {
			
		// verify that method signature exists
		
		expect(app.IModelable.prototype.default_isInstanceOf).toBeDefined();
		
		expect(typeof app.IModelable.prototype.default_isInstanceOf).toBe('function');
	});


	it('can tell if an object is an instance of IModelable', function() {
			
		// verify that method signature exists
		
		var obj = new Object();

		obj.isInstanceOf = app.IModelable.prototype.default_isInstanceOf;

		expect(obj.isInstanceOf(app.IModelable)).toBe(true);

		expect(obj.isInstanceOf(Array)).toBe(false);
	});
});