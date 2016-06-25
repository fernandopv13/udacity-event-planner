'use strict';

/* Jasmine.js unit test suite for ViewUpdateHandler.js interface in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class ViewUpdateHandler', function(){
	
	
	var testHandler = new app.ViewUpdateHandler(new app.Controller());
	
	it('implements the IInterfaceable interface', function() {

		expect(app.IInterfaceable.isImplementationOf(app.ViewUpdateHandler, app.IInterfaceable)).toBe(true);
	});


	it('implements the IObserver interface', function() {

		expect(app.IInterfaceable.isImplementationOf(app.ViewUpdateHandler, app.IObserver)).toBe(true);
	});

	it('can instantiate', function() {

		expect((new app.ViewUpdateHandler(new app.Controller())).constructor).toBe(app.ViewUpdateHandler);
	});


	describe('instance', function() {

		it('can get its controller', function() {

			expect(testHandler.controller().constructor).toBe(app.Controller);
		});
		
		
		it('rejects attempt to set its controller', function() {

			try {

				testHandler.controller('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true);
		});

		
		it('can get an array of its parent classes and interfaces', function() {

			expect(typeof testHandler.parentList).toBe('function');

			expect(testHandler.parentList().constructor).toBe(Array);
		});

		
		it('rejects attempt to set array of parent classes and interfaces', function() {

			try {

				testHandler.parentList(['read', 'only']);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true);
		});
		
		
		it('can get a reference to its parent class', function() {

			expect(testHandler.ssuper()).toBe(Object);
		});
		
		
		it('rejects attempt to set its parent class', function() {

			try {

				testHandler.ssuper(Object);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true);
		});


		// Strategy pattern testing

		it('defines an abstract execute() method', function() {

			expect(typeof testHandler.execute).toBe('function');

			try {

				testHandler.execute.call(testHandler);
			}

			catch(e) {

				expect(e.name).toBe('AbstractMethodError');
			}
		});
		
		
		// IInterfaceable testing

		it('can tell if it is an instance of a given class or interface (by function reference)', function() {

			expect(testHandler.isInstanceOf(app.ViewUpdateHandler)).toBe(true);

			expect(testHandler.isInstanceOf(Array)).toBe(false);
		});



		//IObserver testing
	});
});
