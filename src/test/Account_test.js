'use strict';

/* Jasmine.js unit test suite for javascript pseuado-classical class template */


// Mock some of the other app classes, if necessary

app.Email = app.Email || function(){this.address = function() {return 'nosuchuser@unknown.domain';};};

app.Password = app.Password || function(){this.password = function() {return '123!abcDEF';};};

app.Person = app.Person || function(){this.name = function() {return 'Test person';};};


describe('class Account', function(){
	
	app.Email = app.Email || function() {};
			
	
	it('implements the ISerializable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.Account, app.ISerializable)).toBe(true);
	});
	
	
	it('can be created with an email and a valid password', function() {
		
		expect((new app.Account(new app.Email(), new app.Password('123!abcDEF'))).constructor).toBe(app.Account);
	});
	
	
	it('can be created with an email, a valid password, and an account holder', function() {
		
		expect((new app.Account(new app.Email(), new app.Password('123!abcDEF'), new app.Person('Test person'))).constructor).toBe(app.Account);
	});


	it('rejects attempt to create with an email that is not an Email', function() {
			
		try {
			
			this.success = new app.Account('Not an Email', 'Abcd!123');
		}
		
		catch(e) {
			
			expect(e.message).toBe('Wrong type: Email must be an instance of the Email class');
		}
		
		expect(this.success).not.toBeDefined();
	});
	
	
	it('rejects attempt to create with an insecure password', function() {
			
		try {
			
			this.success = new app.Account(new app.Email(), 'Abcd123');
		}
		
		catch(e) {
			
			expect(e.name).toBe('IllegalArgumentError');
		}
		
		expect(this.success).not.toBeDefined();
	});
	
	
	it('rejects attempt to create with an account holder that is not a Person', function() {
			
			try {
				
				this.success = new app.Account(new app.Email(), new app.Password('123!abcDEF'), 'Not a person');
			}
			
			catch(e) {
				
				expect(e.message).toBe('Account holder must be a Person');
			}
			
			expect(this.success).not.toBeDefined();
	});


	it('has an object registry', function() {
		
		expect(app.Account.registry.constructor).toBe(app.ObjectRegistry);
		
		expect(app.Account.registry.type()).toBe(app.Account);
	});
	
	
	describe('Account instance', function() {
		
		var testAccount, oldPermission;
		
		beforeEach(function(){
			
			testAccount = new app.Account();
			
			testAccount.accountHolder(new app.Person('Test person'));

			oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
		});
		
		
		it('can get its ID', function() {
		
			expect(testAccount.id()).toBeDefined();
		});
		
		
		it('rejects attempt to set ID (b/c read-only', function() {
		
			try {
				
				testAccount.id(5);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Illegal parameter: id is read-only');
			}
		});
		
				
		it('has an ID that is a positive integer or zero', function() {
		
			expect(testAccount.id()).toBeGreaterThan(-1);
			
			expect(parseInt(testAccount.id()) === testAccount.id()).toBe(true);
		});
		
		
		it('can set and get its email', function() {
		
			testAccount.email(new app.Email('test@noserver.nodomain'));
			
			expect(testAccount.email().address()).toBe('test@noserver.nodomain');
		});
		
		
		it('rejects attempt to set an email that is not of class Email', function() {
			
			try {
				
				testAccount.email('Not an Email');
			}
			
			catch(e) {
				
				expect(e.message).toBe('Wrong type: Email must be an instance of the Email class');
			}
			
			expect(testAccount.email()).not.toBeDefined();
		});
		
		it('can set and get its password', function() {
		
			testAccount.password(new app.Password('123!abcDEF'));
			
			expect(testAccount.password().password()).toBe('123!abcDEF');
		});
		
		
		it('rejects attempt to set an insecure password', function() {
			
			try {
				
				testAccount.password(new app.Password('insecure'));
			}
			
			catch(e) {
				
				expect(e.name).toBe('IllegalArgumentError');
			}
			
			expect(testAccount.password()).not.toBeDefined();
		});
		

		it('can set and get its account holder', function() {
		
			testAccount.accountHolder(new app.Person('No such person'));
			
			expect(testAccount.accountHolder().name()).toBe('No such person');
		});
		
		
		it('rejects attempt to set an account holder that is not of class Person', function() {
			
			try {
				
				testAccount.accountHolder('Not a Person');
			}
			
			catch(e) {
				
				expect(e.message).toBe('Account holder must be a Person');
			}
			
			expect(testAccount.accountHolder().name()).toBe('Test person');
		});

		
		it('can be serialized to a valid JSON string', function() {
			
			testAccount.password(new app.Password('adsghlkggAGA435q23!'));
			
			var obj = JSON.parse(JSON.stringify(testAccount));
			
			expect(typeof obj).toBe('object');
			
			expect(obj._className).toBeDefined();
			
			expect(obj._id).toBeDefined();
			
			expect(obj._email).not.toBeDefined();
			
			expect(obj._password).toBeDefined();

			expect(obj._accountHolder).toBeDefined();
		});
		
		
		it('can write itself to local storage', function() {
			
			testAccount.writeObject();
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id()));
			
			expect(testAccount.className()).toEqual(obj._className);
			
			expect(testAccount.id()).toEqual(obj._id);

			expect(testAccount.accountHolder().id()).toEqual(obj._accountHolder._id);
			
			expect(JSON.stringify(testAccount).split('').sort().join()).toBe(JSON.stringify(obj).split('').sort().join());
		});
		
		
		it('can read (i.e. re-instantiate) itself from local storage', function() {
			
			testAccount.password(new app.Password('Pass!Word2')); // set a value to test for
			
			testAccount.writeObject(); // write out to local storage
			
			app.Account.registry = new app.ObjectRegistry(app.Account, 'Account'); // reset registry
			
			expect(Object.keys(app.Account.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			testAccount = new app.Account(testAccount.id()); // re-instantiate from local storage
			
			expect(testAccount.className()).toBe('Account'); // test
			
			expect(testAccount.password()._className).toBe('Password');

			expect(testAccount.accountHolder()._className).toBe('Person'); // not deserialized yet
		});
		
		
		it('can remove itself from local storage', function() {
			
			testAccount.password(new app.Password('Pass!Word2')); // set a value to test for
			
			testAccount.writeObject(); // write out to local storage
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id()));
			
			expect(obj._password._className).toBe('Password'); // verify write
			
			testAccount.removeObject(); // remove from local storage
			
			obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id()));
			
			expect(obj).toBe(null); // test that it's gone
		});
		
		
		it('rejects attempt to recreate itself from local storage if JSON has the wrong class', function() {
			
			testAccount.writeObject(); // write out to local storage, the read back in
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id()));
			
			obj._className = 'no such class'; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id(), JSON.stringify(obj));
			
			app.Account.registry = new app.ObjectRegistry(app.Account, 'Account'); // reset registry
			
			expect(Object.keys(app.Account.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			
			expect(testAccount.className()).toBe('Account'); // test
			
			try {
				
				testAccount = new app.Account(testAccount.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('Wrong class')).toBeGreaterThan(-1);
			}
			
			expect(Object.keys(app.Account.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
			
			expect(testAccount.className()).toBe('Account'); // we should not have overridden original object
		});
		
		
		it('rejects attempt to recreate itself from storage if JSON does not have a valid ID', function() {

			testAccount.writeObject(); // write out to local storage
			
			app.Account.registry = new app.ObjectRegistry(app.Account, 'Account'); // reset registry
			
			expect(Object.keys(app.Account.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id()));
			
			
			delete obj._id; // ID is undefined
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id(), JSON.stringify(obj));
			
			try {
				
				testAccount = new app.Account(testAccount.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID not defined');
			}
			
			
			obj._id = 'not an integer'; // ID is not an integer
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id(), JSON.stringify(obj));
			
			try {
				
				testAccount = new app.Account(testAccount.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be an integer');
			}
			
			
			obj._id = -1 // ID is negative
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id(), JSON.stringify(obj));
			
			try {
				
				testAccount = new app.Account(testAccount.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be greater than or equal to zero');
			}
			
			
			obj._id = testAccount.id() + 1; // ID mismatch
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testAccount.className() + '.' + testAccount.id(), JSON.stringify(obj));
			
			try {
				
				testAccount = new app.Account(testAccount.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('ID mismatch')).toBe(0);
			}
			
			expect(Object.keys(app.Account.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
		});
			
		
		it('can re-establish object references when de-serializing from JSON', function(){
			
			testAccount.password(new app.Password('Pass!Word76')); // set a value to test for
			
			testAccount.email(new app.Email('nosuchuser@undef.nowhere'));
			
			var id = testAccount.email().id();
			
			
			testAccount.writeObject(); // write out to local storage
			
			app.Account.registry.remove(testAccount); // remove from registry
			
			testAccount = new app.Account(testAccount.id()); // re-instantiate from local storage
			
			
			expect(testAccount.className()).toBe('Account'); // verify re-instantiation
			
			expect(testAccount.password()._className).toBe('Password');
			
			expect(testAccount.email()._id).toBe(id);
			
			
			testAccount.onDeserialized(); // verify deserialization
			
			expect(testAccount.email().address()).toBe('nosuchuser@undef.nowhere');

			expect(testAccount.accountHolder().name()).toBe('Test person')
		});
		
		afterEach(function() {
			
			app.prefs.isLocalStorageAllowed(oldPermission);
			
			localStorage.clear()
		});
		
		
		afterAll(function() {
			
			testAccount = undefined;
		});
	});
});