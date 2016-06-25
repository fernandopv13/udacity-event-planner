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
	

	it('can mix default methods from an interface into a realizing class', function() {

		function TestInterface() {}

		TestInterface.prototype.default_someMethod = function() {return 'default someMethod() called';};

		function TestClass() {

			TestClass.prototype.someInstanceMethod = function() {return 'someInstanceMethod() called';};
		}

		app.IInterfaceable.mixInto(TestInterface, TestClass);

		var testObj = new TestClass();

		expect(testObj.someMethod()).toBe('default someMethod() called');

		expect(testObj.someInstanceMethod()).toBe('someInstanceMethod() called');
	});


	it('respects local overrides when mixing default methods from an interface into a realizing class', function() {

		function TestInterface() {}

		TestInterface.prototype.default_someMethod = function() {return 'default someMethod() called';};

		
		function TestClass() {

			TestClass.prototype.someInstanceMethod = function() {return 'someInstanceMethod() called';};

			TestClass.prototype.someMethod = function() {return 'local someMethod() called';};
		}

		// To-do: Test for inheritence via TestClass' prototype chain. (Should work, but better to verify.)

		app.IInterfaceable.mixInto(TestInterface, TestClass);

		var testObj = new TestClass();

		expect(testObj.someMethod()).toBe('local someMethod() called');

		expect(testObj.someInstanceMethod()).toBe('someInstanceMethod() called');
	});

	
	it('provides a default isInstanceOf method', function(){

		expect(app.IInterfaceable.prototype.default_isInstanceOf).toBeDefined();

		expect(typeof app.IInterfaceable.prototype.default_isInstanceOf).toBe('function');
	});
});