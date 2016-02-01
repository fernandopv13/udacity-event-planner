'use strict';

/* Jasmine.js unit test suite for IObservable.js interface in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Interface IObservable', function(){
	
	// set up some mocks

	function TestObserver(id) {

		this.id = id;

		this.isUpdated = false;

		this.isInstanceOf = function(fnc) {return fnc === app.IObserver;};

		this.update = function() {this.isUpdated = true;};
	}
	

	var testObservable, testObserver;

	beforeEach(function() {

		testObservable = new (function() {this.observers = []})();

		testObserver = new TestObserver();
	});


	it('cannot be instantiated', function() {
		
		try { // this shold throw an error
			
			void new app.IObservable();
		}
		
		catch(e) { // interfaces cannot be instantiated, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.IObservable.constructorErrorMessage);
		}
	});
	

	it('defines a default notifyObservers() method', function() {
			
		// verify that method signature exists
		
		expect(app.IObservable.prototype.default_notifyObservers).toBeDefined();
		
		expect(typeof app.IObservable.prototype.default_notifyObservers).toBe('function');
	});
		
	
	it('can notify its observers', function(){

		var testObserver2 = new TestObserver();

		expect(testObserver.isUpdated).toBe(false);

		expect(testObserver2.isUpdated).toBe(false);

		app.IObservable.prototype.default_registerObserver.call(testObservable, testObserver);

		app.IObservable.prototype.default_registerObserver.call(testObservable, testObserver2);

		app.IObservable.prototype.default_notifyObservers.call(testObservable);

		expect(testObserver.isUpdated).toBe(true);

		expect(testObserver2.isUpdated).toBe(true);
	});

	
	it('defines a default registerObserver() method', function() {
			
		// verify that method signature exists
		
		expect(app.IObservable.prototype.default_registerObserver).toBeDefined();
		
		expect(typeof app.IObservable.prototype.default_registerObserver).toBe('function');
	});
	

	it('can register an observer', function(){

		app.IObservable.prototype.default_registerObserver.call(testObservable, testObserver);

		expect(testObservable.observers.length).toBe(1);
	});


	it('rejects attempt to register an observer that does not implement IObservable', function(){

		try {

			app.IObservable.prototype.default_registerObserver.call(testObservable, {});
		}

		catch(e) {

			expect(e.name).toBe('IllegalArgumentError');
		}

	});


	it('rejects attempt to register an observer more than once', function(){

		app.IObservable.prototype.default_registerObserver.call(testObservable, testObserver);

		expect(testObservable.observers.length).toBe(1);

		expect(app.IObservable.prototype.default_registerObserver.call(testObservable, testObserver)).toBe(null);
	});


	it('defines a default removeObserver() method', function() {
			
		// verify that method signature exists
		
		expect(app.IObservable.prototype.default_removeObserver).toBeDefined();
		
		expect(typeof app.IObservable.prototype.default_removeObserver).toBe('function');
	});
	
	it('can remove an observer', function(){

		var testObserver2 = new TestObserver(2);

		app.IObservable.prototype.default_registerObserver.call(testObservable, testObserver);

		app.IObservable.prototype.default_registerObserver.call(testObservable, testObserver2);

		expect(testObservable.observers.length).toBe(2);

		app.IObservable.prototype.default_removeObserver.call(testObservable, testObserver);

		expect(testObservable.observers.length).toBe(1);
	});
});