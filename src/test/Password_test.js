'use strict';

/* Jasmine.js unit test suite for Password class in meetup even planner application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class Password', function(){
	
	var testPassword;
		
		beforeEach(function() {
			
			testPassword = new app.Password('123abc!DEF');
		});
	
	
	it('implements the ISerializable interface', function() { // uses InterfaceTester.js
		
			expect(app.InterfaceTester.isImplementationOf(app.Password, app.ISerializable)).toBe(true);
	});
	
	
	it('can be instantiated', function() {
		
		expect((testPassword).constructor).toBe(app.Password);
	});
	
	
	it('has an object registry', function() {
		
		expect(app.Password.registry.constructor).toBe(app.ObjectRegistry);
		
		expect(app.Password.registry.type()).toBe(app.Password);
	});
	

	it('can tell if a password has the required number of characters', function() {
	
		expect(app.Password.hasValidCharacterCount('123@5.7')).toBe(false);
		
		expect(app.Password.hasValidCharacterCount('123@56.8')).toBe(true);
	});

	
	it('can tell if a password has the required number of upper case letters', function() {
		
		expect(app.Password.hasValidUpperCaseCount('abc@defg.hij')).toBe(false);

		expect(app.Password.hasValidUpperCaseCount('abc@defg.hIj')).toBe(true);
	});


	it('can tell if a password has the required number of lower case letters', function() {
		
		expect(app.Password.hasValidLowerCaseCount('ABC@DEFG.HIJ')).toBe(false);

		expect(app.Password.hasValidLowerCaseCount('ABC@dEFG.HIJ')).toBe(true);
	});

	
	it('can tell if a password has the required number of numerical characters', function() {
	
		expect(app.Password.hasValidNumberCount('ABC@DEFG.HIJ')).toBe(false);

		expect(app.Password.hasValidNumberCount('ABC@dE2G.HIJ')).toBe(true);
	});

	
	it('can tell if a password has the required number of non-alphanumeric characters', function() {
		
		expect(app.Password.hasValidPunctuationCount('ABCDEFG.HIJ')).toBe(false);

		expect(app.Password.hasValidPunctuationCount('ABC@dE2G.HIJ')).toBe(true);
	});
	

	it('can tell if a password contains illegal characters', function() {
		
		expect(app.Password.hasIllegalCharacters('ABCDEFGHIJ')).toBe(null);

		expect(app.Password.hasIllegalCharacters('AB;C@dE2G.HIJ')).not.toBe(null);
	});
	

	describe('Password instance', function() {
		
		var testPassword, oldPermission;
		
		beforeEach(function() {
			
			testPassword = new app.Password('123abc!DEF');
			
			oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
		
		});
		
		
		it('can set and get its password', function() {
		
			testPassword.password('1234abc!DEF');
			
			expect(testPassword.password()).toBe('1234abc!DEF');
		});
		
		
		it('rejects attempt to set password that is too short', function() {

			try {

				testPassword.password('1234');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}
		});


		it('rejects attempt to set password without uppercase characters', function() {

			try {

				testPassword.password('1234!abcd');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(testPassword.password('1234!ABcd')).toBeDefined();
		});


		it('rejects attempt to set password without lowercase characters', function() {

			try {

				testPassword.password('1234!ABCD');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(testPassword.password('1234!ABcd')).toBeDefined();
		});


		it('rejects attempt to set password without numerical characters', function() {

			try {

				testPassword.password('ABCD!abcd');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(testPassword.password('1234!ABcd')).toBeDefined();
		});


		it('rejects attempt to set password without punctuation', function() {

			try {

				testPassword.password('1234abcd');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(testPassword.password('1234!ABcd')).toBeDefined();
		});


		it('rejects attempt to set password with illegal characters', function() {

			try {

				testPassword.password('1234.abcd');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(testPassword.password('1234!ABcd')).toBeDefined();
		});
		
		
		// ISerializable testing

		it('can get its class name', function() {

			expect(testPassword.className()).toBe('Password');
		});

		
		it('can get its ID', function() {
		
			expect(testPassword.id()).toBeDefined();
		});
		
		
		it('rejects attempt to set ID (b/c read-only)', function() {
		
			try {
				
				testPassword.id(5);
			}
			
			catch(e) {
				
				expect(e.name).toBe('IllegalArgumentError');
			}
		});
		
				
		it('has an ID that is a positive integer or zero', function() {
		
			expect(testPassword.id()).toBeGreaterThan(-1);
			
			expect(parseInt(testPassword.id()) === testPassword.id()).toBe(true);
		});


		it('can be serialized to a valid JSON string', function() {
			
			var obj = JSON.parse(JSON.stringify(testPassword));
			
			expect(typeof obj).toBe('object');
			
			expect(obj._className).toBeDefined();
			
			expect(obj._id).toBeDefined();
			
			expect(obj._password).toBeDefined();
		});
		
		
		it('can write itself to local storage', function() {
			
			testPassword.writeObject();
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id()));
			
			expect(testPassword.className()).toEqual(obj._className);
			
			expect(testPassword.id()).toEqual(obj._id);
			
			expect(JSON.stringify(testPassword).split('').sort().join()).toBe(JSON.stringify(obj).split('').sort().join());
		});
		
		
		it('can read (i.e. re-instantiate) itself from local storage', function() {
			
			testPassword.password('345!garet#WER'); // set a value to test for
			
			testPassword.writeObject(); // write out to local storage
			
			app.Password.registry = new app.ObjectRegistry(app.Password, 'Password'); // reset registry
			
			expect(Object.keys(app.Password.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			testPassword = new app.Password(testPassword.id()); // re-instantiate from local storage
			
			expect(testPassword.className()).toBe('Password'); // test
			
			expect(testPassword.password()).toBe('345!garet#WER');
		});

		
		it('can remove itself from local storage', function() {
			
			testPassword.password('345!garet#WER'); // set a value to test for
			
			testPassword.writeObject(); // write out to local storage
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id()));
			
			expect(obj._password).toBe('345!garet#WER'); // verify write
			
			testPassword.removeObject(); // remove from local storage
			
			obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id()));
			
			expect(obj).toBe(null); // test that it's gone
			
		});
		
		
		it('rejects attempt to recreate itself from local storage if JSON has the wrong class', function() {
			
			testPassword.writeObject(); // write out to local storage, the read back in
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id()));
			
			obj._className = 'no such class'; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id(), JSON.stringify(obj));
			
			app.Password.registry = new app.ObjectRegistry(app.Password, 'Password'); // reset registry
			
			expect(Object.keys(app.Password.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			
			expect(testPassword.className()).toBe('Password'); // test
			
			try {
				
				testPassword = new app.Password(testPassword.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('Wrong class')).toBeGreaterThan(-1);
			}
			
			expect(Object.keys(app.Password.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
			
			expect(testPassword.className()).toBe('Password'); // we should not have overridden original object
		});
		
		
		it('rejects attempt to recreate itself from storage if JSON does not have a valid ID', function() {
			
			testPassword.writeObject(); // write out to local storage
			
			app.Password.registry = new app.ObjectRegistry(app.Password, 'Password'); // reset registry
			
			expect(Object.keys(app.Password.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id()));
			
			
			delete obj._id; // ID is undefined
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id(), JSON.stringify(obj));
			
			try {
				
				testPassword = new app.Password(testPassword.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID not defined');
			}
			
			
			obj._id = 'not an integer'; // ID is not an integer
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id(), JSON.stringify(obj));
			
			try {
				
				testPassword = new app.Password(testPassword.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be an integer');
			}
			
			
			obj._id = -1 // ID is negative
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id(), JSON.stringify(obj));
			
			try {
				
				testPassword = new app.Password(testPassword.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be greater than or equal to zero');
			}
			
			
			obj._id = testPassword.id() + 1; // ID mismatch
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPassword.className() + '.' + testPassword.id(), JSON.stringify(obj));
			
			try {
				
				testPassword = new app.Password(testPassword.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('ID mismatch')).toBe(0);
			}
			
			expect(Object.keys(app.Password.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
		});
		
		
		it('can re-establish object references when de-serializing from JSON', function(){
			
			// Required by ISerializable but nothing to do for now
			
			expect(testPassword.onDeserialized()).toBe(true);
		});
		
		
		afterEach(function() {
			
			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
		
		afterAll(function() {
			
			testPassword = null;
		});
		
	});
	
});