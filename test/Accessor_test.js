'use strict';

/* Jasmine.js unit test suite for Accessor helper class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Class Accessor', function(){
	
	function TestClass() {

		var _attr1 = 'read-only', _attr2, _attr3, _attr4;

		this.attribute1 = new app.Accessor(_attr1, true);

		this.attribute2 = new app.Accessor(_attr2, false);

		this.attribute3 = new app.Accessor(_attr3, false, 'number');

		this.attribute4 = new app.Accessor(_attr4, false, TestClass, 'TestClass');
	}


	var testObject;
		
		beforeEach(function() {
			
			testObject = new TestClass();
		});
	
	
	it('can instantiate', function() {
		
		expect(testObject.constructor).toBe(TestClass);
	});
	
	
	describe('instance', function() {
				
		beforeEach(function() {
			
			testObject = new TestClass();
		});
		

		it('can create a getter for read-only properties', function() {

			expect(testObject.attribute1()).toBe('read-only');

			try {

				testObject.attribute1('not allowed');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			
		});


		it('can create a unified accessor without type checking', function() {

			expect(testObject.attribute2('not checking')).toBe('not checking');

			expect(testObject.attribute2([])).toEqual([]);
		});
		
		
		it('can create a unified accessor with typechecking for JavaScript primitives', function() {

			expect(testObject.attribute3(5)).toBe(5);

			try {

				testObject.attribute3({});
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});


		it('can create a unified accessor with typechecking for complex objects', function() {

			var obj = new TestClass();

			expect(testObject.attribute4(obj)).toBe(obj);

			try {

				testObject.attribute4({that: 'will not work'});
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});
	});
	
});