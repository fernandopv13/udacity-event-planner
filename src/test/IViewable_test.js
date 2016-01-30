'use strict';

/* Jasmine.js unit test suite for IViewable.js interface in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Interface IViewable', function(){
	
	
	it('cannot be instantiated', function() {
		
		try { // this shold throw an error
			
			void new app.IViewable();
		}
		
		catch(e) { // interfaces cannot be instantiated, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IViewable.constructorErrorMessage);
		}
	});
	

	it('defines a render() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.render).toBeDefined();
		
		expect(typeof app.IViewable.prototype.render).toBe('function');
	});
		
	
	it('throws an error if render() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IViewable.prototype.render();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IViewable.prototype.render.errorMessage);
		}
	});
});