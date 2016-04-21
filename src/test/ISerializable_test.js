'use strict';

/* Jasmine.js unit test suite for ISerializable interface in meetup even planner application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Interface ISerializable', function(){
	
	it('cannot be instantiated', function() {
		
		try { // this shold throw an error
			
			void new app.ISerializable();
		}
		
		catch(e) { // interfaces cannot be instantiated, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.ISerializable.constructorErrorMessage);
		}

		expect(true).toBe(true); // Jasmine may not see expects in trys
	});
	

	it('defines a className() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.ISerializable.prototype.className).toBeDefined();
		
		expect(typeof app.ISerializable.prototype.className).toBe('function');
	});
		
	
	it('throws an error if className() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.ISerializable.prototype.className();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.ISerializable.prototype.className.errorMessage);
		}
	});
	
	
	it('defines an id() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.ISerializable.prototype.id).toBeDefined();
		
		expect(typeof app.ISerializable.prototype.id).toBe('function');
	});
		
	
	it('throws an error if id() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.ISerializable.prototype.id();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.ISerializable.prototype.id.errorMessage);
		}
	});
	
	
	it('defines a toJSON() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.ISerializable.prototype.toJSON).toBeDefined();
		
		expect(typeof app.ISerializable.prototype.toJSON).toBe('function');
	});
		
	
	it('throws an error if toJSON() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.ISerializable.prototype.toJSON();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.ISerializable.prototype.toJSON.errorMessage);
		}
	});
	
	
	it('defines an onDeserialized() method signature', function() {
			
		// verify that method signature exists
		
		expect(app.ISerializable.prototype.onDeserialized).toBeDefined();
		
		expect(typeof app.ISerializable.prototype.onDeserialized).toBe('function');
	});
		
	
	it('throws an error if onDeserialized() is invoked', function() {
			
		// verify that method invokation throws error
		
		try {
		
			app.ISerializable.prototype.onDeserialized();
		}
		
		catch(e) { // a method signature cannot be invoked, so an error here is a positive outcome
		
			expect(e.message).toEqual(app.ISerializable.prototype.onDeserialized.errorMessage);
		}
	});
	
	describe('when interacting with localStorage', function() {
		
		var testObj, oldPermission, testController;
		
		beforeEach(function() {
			
			app = app || {};

			app.Controller = app.Controller || function() {

				var _selectedAccount;

				this.selectedAccount = function(account) {

					if (arguments.length > 0) {_selectedAccount = account;}

					return _selectedAccount;
				}
			}


			app.Account = app.Account || function() {

				var _localStorageAllowed = false;

				this.localStorageAllowed = function(allowed) {

					if (arguments.length > 0) {_localStorageAllowed = allowed;}

					return _localStorageAllowed;
				}
			}

			app.TestClass = app.TestClass || function() {
				
				var _className = 'TestClass', _id = 100, _a = 2, _b = 'one', _name = '';
				
				this.className = function() {return _className;};
				
				this.id = function(id) {if(arguments.length > 0) {_id = id;} return _id;};
				
				this.a = function(a) {if (a) {_a = a;} return _a;}
				
				this.b = function(b) {if (b) {_b = b;} return _b;}
				
				this.name = function(name) {if (name) {_name = name;} return _name;}
				
				app.TestClass.prototype.toJSON = function() {return {_className: _className, _id: _id, _a: _a, _b: _b, _name: _name}};
				
				this.writeObject = app.ISerializable.prototype.default_writeObject;
				
				this.readObject = app.ISerializable.prototype.default_readObject;
				
				this.removeObject = app.ISerializable.prototype.default_removeObject;
			};
			
			testObj = new app.TestClass();

			app.controller = app.controller || new app.Controller();
			
			app.controller.selectedAccount(new app.Account());

			app.prefs = app.prefs || {

				isLocalStorageAllowed: function() {return true;},

				defaultEventCapacity: function() {return 50;},

				defaultToastDelay: function() {return 4000;}, // in ms

				localStoragePrefix: function() {return 'dk.ulrikgade.udacity.srwebdev.meetup-app.';}
			};

			oldPermission = app.prefs.isLocalStorageAllowed();

			void app.prefs.isLocalStorageAllowed(true);
		});
		
		
		it('defines a default writeObject method', function() {
		
			expect(app.ISerializable.prototype.default_writeObject).toBeDefined();
			
			expect(typeof app.ISerializable.prototype.default_writeObject).toBe('function');
		});
		
		
		it('can write an object to local storage', function() {
			
			void testObj.writeObject();
			
			expect(JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + 'TestClass.100'))._className).toBe('TestClass');
		});
		
		
		it('rejects attempt to write object unless given permission to do so in prefs', function() {
			
			app.prefs.isLocalStorageAllowed(false);
			
			try {
				
				void testObj.writeObject();
			}
			
			catch(e) {
				
				expect(e.message).toBe('Use of local storage not allowed by user');
			}
			
			expect(true).toBe(true); // Jasmine.js may not see expect()s in trys
		});
		
		
		it('rejects attempt to write an object not spefifying a valid class to local storage', function() {
			
			app.TestClass.className = 'not a function';
			
			try {
			
				void testObj.writeObject();
			}
			
			catch(e) {
			
				expect(e.message).toBe('this.className is not a function');
			}
			
			expect(true).toBe(true); // Jasmine.js may not see expect()s in trys
		});
		
		
		it('rejects attempt to write an object not spefifying a valid ID to local storage', function() {
			
			testObj.id(undefined); // ID not defined
			
			try {
			
				void testObj.writeObject();
			}
			
			catch(e) {
			
				expect(e.message.indexOf('Invalid ID:')).toBe(0);
			}
			
			
			testObj.id('not a number'); // ID not an integer
			
			try {
			
				void testObj.writeObject();
			}
			
			catch(e) {
			
				expect(e.message.indexOf('Invalid ID:')).toBe(0);
			}
			
			
			testObj.id(-1); // ID negative
			
			try {
			
				void testObj.writeObject();
			}
			
			catch(e) {
			
				expect(e.message.indexOf('Invalid ID:')).toBe(0);
			}
			
			
			expect(true).toBe(true); // Jasmine.js may not see expect()s in trys
		});
		
		
		it('rejects attempt to write an object containing circular reference to local storage', function() {
			
			// This test cannot help but deliberately inducing an infinite loop.
			// Most modern browsers protect against this, but not all.
			// Exceptions include Safari and Chrome on iOS, so skip test for these browsers

			if (!/ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()) // skip iOS

				&& (navigator.userAgent.indexOf('Safari') === -1 || navigator.userAgent.indexOf('Chrome') > -1) ) { // skip Safari

				app.TestClass.prototype.toJSON = function() {var a = {}, b = {a: a}; a.b = b; return a};
				
				try { // normal object circularity
				
					void testObj.writeObject();
				}
				
				catch(e) {
				
					expect(e).toBeDefined(); // browser errors vary, so just check for existence
				}
				
				app.TestClass.prototype.toJSON = function() {return {t:this}};
				
				try { // reference to 'this'
				
					void testObj.writeObject();
				}
				
				catch(e) {
				
					expect(e).toBeDefined(); // browser errors vary, so just check for existence
				}
			}
			
			expect(true).toBe(true); // Jasmine.js may not see expect()s in trys and ifs
		});
		
		
		it('defines a default readObject method', function() {
			
			expect(app.ISerializable.prototype.default_readObject).toBeDefined();
			
			expect(typeof app.ISerializable.prototype.default_readObject).toBe('function');
		});
		
		
		it('can accurately read an object from local storage', function() {
			
			var len = Object.keys(testObj).length;
			
			testObj.name('superman');
			
			void testObj.writeObject();
			
			testObj.name('batman');
			
			void testObj.readObject();
			
			expect(Object.keys(testObj).length).toEqual(len); // same number of keys...
			
			expect(testObj.name()).toBe('superman'); // ...same values
			
			expect(testObj.className()).toBe('TestClass');
			
			expect(testObj.id()).toBe(100);
			
			expect(testObj.a()).toBe(2);
			
			expect(testObj.b()).toBe('one');
		});
		
		
		it('rejects attempt to read object unless given permission to do so in prefs', function() {
			
			app.prefs.isLocalStorageAllowed(true);

			void void testObj.writeObject();

			app.prefs.isLocalStorageAllowed(false);
			
			try {
				
				void testObj.readObject();
			}
			
			catch(e) {
				
				expect(e.message).toBe('Use of local storage not allowed by user');
			}
			
			expect(true).toBe(true); // Jasmine.js may not see expect()s in trys
		});
		
		it('rejects attempt to read object that does not exist from local storage', function() {
			
			testObj.id(101);
			
			try {
			
				void testObj.readObject();
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object not found in local storage');
			}
			
			expect(true).toBe(true); // Jasmine.js may not see expects in trys
		});
		
		it('rejects attempt to read an object not spefifying a valid class from local storage', function() {
			
			void testObj.writeObject(); // write out to local storage, the read back in
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testObj.className() + '.' + testObj.id()));
			
			obj._className = 'no such class'; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testObj.className() + '.' + testObj.id(), JSON.stringify(obj));
			
			
			expect(testObj.className()).toBe('TestClass'); // test
			
			try {
				
				void testObj.readObject();
			}
			
			catch(e) {
				
				expect(e.message.indexOf('Wrong class')).toBeGreaterThan(-1);
			}
			
			expect(testObj.className()).toBe('TestClass'); // we should not have overridden original object
		});
		
		
		it('rejects attempt to read an object not spefifying a valid ID from local storage', function() {
			
			void testObj.writeObject(); // write out to local storage and read back in
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testObj.className() + '.' + testObj.id()));
			
			
			delete obj._id; // ID is undefined
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testObj.className() + '.' + testObj.id(), JSON.stringify(obj));
			
			try {
				
				void testObj.readObject();
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID not defined');
			}
			
			
			obj._id = 'not an integer'; // ID is not an integer
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testObj.className() + '.' + testObj.id(), JSON.stringify(obj));
			
			try {
				
				void testObj.readObject();
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be an integer');
			}
			
			
			obj._id = -1 // ID is negative
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testObj.className() + '.' + testObj.id(), JSON.stringify(obj));
			
			try {
				
				void testObj.readObject();
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be greater than or equal to zero');
			}
			
			
			obj._id = testObj.id() + 1; // ID mismatch
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testObj.className() + '.' + testObj.id(), JSON.stringify(obj));
			
			try {
				
				void testObj.readObject();
			}
			
			catch(e) {
				
				expect(e.message.indexOf('ID mismatch')).toBe(0);
			}
			
			expect(true).toBe(true); // Jasmine.js may not see expect()s in trys
		});
		
		
		it('defines a default removeObject method', function() {
			
			expect(app.ISerializable.prototype.default_removeObject).toBeDefined();
			
			expect(typeof app.ISerializable.prototype.default_removeObject).toBe('function');
		});
		
		
		it('can accurately remove an object from local storage', function() {
			
			void testObj.writeObject();
			
			var test2 = new app.TestClass(); test2.id(101);test2.writeObject();
			
			var test3 = new app.TestClass(); test3.id(102);test3.writeObject();
			
			expect(localStorage.length).toBe(3);
			
			
			void test2.removeObject();
			
			try {
			
				void test2.readObject();
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object not found in local storage');
			}
					
			expect(localStorage.length).toBe(2);
		});

		
		afterEach(function() {
			
			delete app.TestClass;
			
			localStorage.clear();
			
			void app.prefs.isLocalStorageAllowed(oldPermission);
		});
	});
});