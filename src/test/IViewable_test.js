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
	

	it('defines an update() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.update).toBeDefined();
		
		expect(typeof app.IViewable.prototype.update).toBe('function');
	});
		
	
	it('throws an error if update() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.IViewable.prototype.update();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IViewable.prototype.update.errorMessage);
		}
	});


	it('defines a default createElement() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_createElement).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_createElement).toBe('function');
	});
	

	it('can create a new DOM element', function(){

		var testElement = app.IViewable.prototype.default_createElement(
		{

			element: 'div',

			attributes: {id: 'test-div'},

			classList: ['row', 'col', 's12'],

			dataset: {success: 'great success', error: 'better luck next time'},

			innerHTML: 'my div'
		});

		expect(testElement.constructor).toBe(HTMLDivElement);

		expect(testElement.id).toBe('test-div');

		expect(testElement.className.indexOf('row')).toBeGreaterThan(-1);

		expect(testElement.className.indexOf('col')).toBeGreaterThan(-1);

		expect(testElement.className.indexOf('s12')).toBeGreaterThan(-1);

		expect(testElement.dataset.success).toBe('great success');

		expect(testElement.dataset.error).toBe('better luck next time');

		expect(testElement.innerHTML).toBe('my div');
	});


	it('defines a default isInstanceOf() method', function() {
			
		// verify that method signature exists
		
		expect(app.IViewable.prototype.default_isInstanceOf).toBeDefined();
		
		expect(typeof app.IViewable.prototype.default_isInstanceOf).toBe('function');
	});


	it('can tell if an object is an instance of IViewable', function() {
			
		// verify that method signature exists
		
		var obj = new Object();

		obj.isInstanceOf = app.IViewable.prototype.default_isInstanceOf;

		expect(obj.isInstanceOf(app.IViewable)).toBe(true);

		expect(obj.isInstanceOf(Array)).toBe(false);
	});
});