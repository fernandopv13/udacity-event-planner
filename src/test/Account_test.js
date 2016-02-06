'use strict';

/* Jasmine.js unit test suite for javascript pseuado-classical class template */


// Mock some of the other app classes, if necessary

app.Email = app.Email || function(){this.address = function() {return 'nosuchuser@unknown.domain';};};

app.Event = app.Event || function(){this.id = function(){return 232;};this.name = function(){return 'test event';};};

app.Password = app.Password || function(){this.password = function() {return '123!abcDEF';};};

app.Person = app.Person || function(){this.name = function() {return 'Test person';};};

function TestObserver() {

	this.isUpdated = false;

	this.isInstanceOf = function(fnc) {return fnc === app.IObserver;};

	this.update = function() {this.isUpdated = true;};
}


describe('class Account', function(){
	
	app.Email = app.Email || function() {};
			
	
	it('implements the IObservable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.Account, app.IObservable)).toBe(true);
	});


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
			
			expect(e.name).toBe('IllegalArgumentError');
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
		
		var testAccount, oldPermission, testObserver;
		
		beforeEach(function(){
			
			testAccount = new app.Account();
			
			testAccount.accountHolder(new app.Person('Test person'));

			oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);

			testObserver = new TestObserver();
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
				
				expect(e.name).toBe('IllegalArgumentError');
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

		
		it('can get and set its local storage access permission preference', function() {

			expect(testAccount.localStorageAllowed()).toBe(false);

			expect(testAccount.localStorageAllowed(true)).toBe(true);

			testAccount.localStorageAllowed(false);
		});


		it('rejects attempt to set local storage permission that is not a Boolean', function() {

			try {

				testAccount.localStorageAllowed('not a Boolean');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});

		
		it('can get and set its default event capacity', function() {

			expect(testAccount.defaultEventCapacity()).toBeGreaterThan(-1);

			expect(testAccount.defaultEventCapacity(25)).toBe(25);

			expect(testAccount.defaultEventCapacity(50)).toBe(50);
		});


		it('rejects attempt to set default event capacity that is not a non-negative integer', function() {

			try {

				testAccount.defaultEventCapacity('not an integer');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			try {

				testAccount.defaultEventCapacity(-1);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});

		
		it('can get and set its default location', function() {

			expect(testAccount.defaultLocation('Las Vegas')).toBe('Las Vegas');

			if (navigator.geolocation) {

				navigator.geolocation.getCurrentPosition(

					function(position) { // success

						expect(testAccount.defaultLocation(position)).toBe(position);
					},

					function(error) { // error

						console.log(error);
					}
				)
			}
		});


		it('rejects attempt to set default location that is neither a string nor a Position', function() {

			try {

				testAccount.defaultLocation(1);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});


		it('can get its collection of events', function() {
		
			expect(testAccount.events().constructor).toBe(Object);
		});


		it('can add an event', function() {
		
			var testEvent = testAccount.addEvent(new app.Event('test event'));

			expect(testEvent.constructor).toBe(app.Event);
			
			expect(testAccount.events()[testEvent.id()].name()).toBe('test event');
		});
		
		
		it('rejects attempt to add event that is not of class Event', function() {
			
			try {
				
				testAccount.addEvent('Not an Event');
			}
			
			catch(e) {
				
				expect(e.name).toBe('IllegalArgumentError');
			}
			
			expect(true).toBe(true); //Jasmine may not notice try in catch
		});

		
		it('can remove an event', function() {
		
			var testEvent = testAccount.addEvent(new app.Event('test event'));

			var len = Object.keys(testAccount.events()).length;

			var evt = testAccount.removeEvent(testEvent);

			expect(evt.constructor).toBe(app.Event);

			expect(Object.keys(testAccount.events()).length).toBe(len - 1);
		});
		
		
		it('rejects attempt to remove event that is not of class Event', function() {
			
			try {
				
				testAccount.removeEvent('Not an Event');
			}
			
			catch(e) {
				
				expect(e.name).toBe('IllegalArgumentError');
			}
			
			expect(true).toBe(true); //Jasmine may not notice try in catch
		});


		it('rejects attempt to remove event that is not registred with account', function() {
			
			try {
				
				testAccount.removeEvent(new app.Event('unknown event'));
			}
			
			catch(e) {
				
				expect(e.name).toBe('ReferenceError');
			}
			
			expect(true).toBe(true); //Jasmine may not notice try in catch
		});

		
		// IObservable testing

		it('can register an observer', function(){

			expect(testAccount.registerObserver(testObserver)).not.toBe(null);

			var testObserver2 = new TestObserver();

			expect(testAccount.registerObserver(testObserver2)).not.toBe(null);

			expect(testAccount.observers.length).toBe(2);
		});
		

		it('rejects attempt to register an observer that does not implement IObservable', function(){

			try {

				testAccount.registerObserver({});
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

		});


		it('can notify its observers', function(){

			var testObserver2 = new TestObserver();

			expect(testObserver.isUpdated).toBe(false);

			expect(testObserver2.isUpdated).toBe(false);

			testAccount.registerObserver(testObserver);

			testAccount.registerObserver(testObserver2);

			testAccount.notifyObservers();

			expect(testObserver.isUpdated).toBe(true);

			expect(testObserver2.isUpdated).toBe(true);
		});


		it('can remove an observer', function(){

			var testObserver2 = new TestObserver(2);

			testAccount.registerObserver(testObserver);

			testAccount.registerObserver(testObserver2);

			expect(testAccount.observers.length).toBe(2);

			expect(testAccount.removeObserver(testObserver2)).toBe(testObserver2);

			expect(testAccount.observers.length).toBe(1);
		});
		
		
		// ISerializable testing

		it('can get its class name', function() {

			expect(testAccount.className()).toBe('Account');
		});
		

		it('can get its ID', function() {
		
			expect(testAccount.id()).toBeDefined();
		});
		
		
		it('rejects attempt to set ID (b/c read-only)', function() {
		
			try {
				
				testAccount.id(5);
			}
			
			catch(e) {
				
				expect(e.name).toBe('IllegalArgumentError');
			}
		});
		
				
		it('has an ID that is a positive integer or zero', function() {
		
			expect(testAccount.id()).toBeGreaterThan(-1);
			
			expect(parseInt(testAccount.id()) === testAccount.id()).toBe(true);
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