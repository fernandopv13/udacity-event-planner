'use strict';

/* Jasmine.js unit test suite for IModelable.js interface in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Class Model', function(){
	
	
	it('can be instantiated', function() {
		
		expect(typeof new app.Model()).toBe('object');
		
		expect((new app.Model()).constructor).toBe(app.Model);
	});
	
	describe('Model instance', function(){
		
		var testModel;
		
		beforeEach(function(){
		
			testModel = new app.Model();
		
		});
	
	
		it('implements the IInterfaceable interface', function() {

			expect(app.IInterfaceable.isImplementationOf(app.Model, app.IInterfaceable)).toBe(true);
		});


		it('implements the IObservable interface', function() {

			expect(app.IInterfaceable.isImplementationOf(app.Model, app.IObservable)).toBe(true);
		});


		it('implements the IObserver interface', function() {

			expect(app.IInterfaceable.isImplementationOf(app.Model, app.IObserver)).toBe(true);
		});

		
		it('can delete itself', function() {

			expect(typeof testModel.delete).toBe('function');

			// Model itself is abstract so test details in derived classes
		});
		
		
		it('can get its class name', function() {

			expect(testModel.className()).toBe('Model');
		});
		
		
		it('rejects attempt to set its class name', function() {

			try {

				testModel.className('Class Name');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});


		it('can get its id', function() {

			expect(typeof testModel.id).toBe('function');
		});
		
		
		it('rejects attempt to set its id', function() {

			try {

				testModel.id(1);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});
		
		
		it('can get an array of its observers', function() {

			expect(typeof testModel.observers).toBe('function');

			expect(testModel.observers().constructor).toBe(Array);
		});
		
		
		it('rejects attempt to set its observers', function() {

			try {

				testModel.observers([1, 2, 3]);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});
		
		
		it('can get an array of its parent classes and interfaces', function() {

			expect(typeof testModel.parentList).toBe('function');

			expect(testModel.parentList().constructor).toBe(Array);
		});
		
		
		it('rejects attempt to set its parent classes and interfaces', function() {

			try {

				testModel.parentList([4,5,6]);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});
		
		
		it('can get a reference to it parent class, if inheriting', function() {

			expect(testModel.ssuper()).toBe(Object);
		});
		
		
		it('rejects attempt to set its parent class', function() {

			try {

				testModel.ssuper(Object);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		})
	});
});