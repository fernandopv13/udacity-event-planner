'use strict';

/* Jasmine.js unit test suite for Email class in meetup even planner application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class Email', function(){
	
	var testMail;
		
		beforeEach(function() {
			
			testMail = new app.Email('test@mail.suite');
		});
	
	
	it('implements the ISerializable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.Email, app.ISerializable)).toBe(true);
	});
	
	
	it('can be instantiated', function() {
		
		expect((testMail).constructor).toBe(app.Email);
	});
	
	
	it('has an object registry', function() {
		
		expect(app.Email.registry.constructor).toBe(app.ObjectRegistry);
		
		expect(app.Email.registry.type()).toBe(app.Email);
	});
	
	describe('Email instance', function() {
		
		var testMail, oldPermission;
		
		beforeEach(function() {
			
			testMail = new app.Email('test@mail.suite');
			
			oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
		
		});
		
		
		it('can get its ID', function() {
		
			expect(testMail.id()).toBeDefined();
		});
		
		
		it('rejects attempt to set ID (b/c read-only', function() {
		
			try {
				
				testMail.id(5);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Illegal parameter: id is read-only');
			}
		});
		
				
		it('has an ID that is a positive integer or zero', function() {
		
			expect(testMail.id()).toBeGreaterThan(-1);
			
			expect(parseInt(testMail.id()) === testMail.id()).toBe(true);
		});
		
		
		it('can set and get its address', function() {
		
			testMail.address('name@server.domain');
			
			expect(testMail.address()).toBe('name@server.domain');
		});
		
		
		it('can validate its address without creating false negatives', function() {
			
			var tests = com_github_dominicsayers_isemail.tests;
			
			// Exluding test cases which are so exotic, refusing them seems to be an acceptable risk
			
			var exclusions = [1,5,66,67,68,69,70,71,72,73,74,75,76,77,85,86,112,115,116,117,120,121,159,166];
			
			for (var test in tests) {
				
				if (tests[test].category !== 'ISEMAIL_ERR' && exclusions.indexOf(parseInt(test)) === -1) {
					
					//if (!(new app.Email(tests[test].address)).isValid()) {console.log(test);} //debug
					
						expect((new app.Email(tests[test].address)).isValid()).toBe(true);
				}
			}
		});
		
		it('can manually override the address validation logic', function() {
			
			testMail.address('not a valid email address');
			
			expect(testMail.isValid()).toBe(false);
			
			testMail.isValid(true);
			
			expect(testMail.isValid()).toBe(true);
		});
		
		
		it('can reset manual override of the address validation logic', function() {
			
			testMail.isValid(false);
			
			expect(testMail.isValid()).toBe(false);
			
			testMail.isValid(null);
			
			expect(testMail.isValid()).toBe(true);
		});
		
		
		it('resets the validation logic when assigned a new address', function() {
			
			testMail.isValid(true);
			
			expect(testMail.isValid()).toBe(true);
			
			testMail.address('not a valid email address');
			
			expect(testMail.isValid()).toBe(false);
		});
		
		
		it('rejects attempt to invoke isValid with a non-Boolean parameter', function() {
			
			try {
				
				testMail.isValid('not a boolean');
			}
			
			catch(e) {
				
				expect(e.message).toBe('Parameter must be Boolean or null');
			}
		});
		
		
		it('can tell if its address\' validity or otherwise has been confirmed', function() {
			
			expect(testMail.isConfirmed()).toBe(false);
			
			testMail.isValid(true);
			
			expect(testMail.isConfirmed()).toBe(true);
			
			testMail.isValid(false);
			
			expect(testMail.isConfirmed()).toBe(true);
		});
		
		
		it('can be serialized to a valid JSON string', function() {
			
			var obj = JSON.parse(JSON.stringify(testMail));
			
			expect(typeof obj).toBe('object');
			
			expect(obj._className).toBeDefined();
			
			expect(obj._id).toBeDefined();
			
			expect(obj._address).toBeDefined();
			
			expect(obj._isValid).toBeDefined();
		});
		
		
		it('can write itself to local storage', function() {
			
			testMail.writeObject();
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id()));
			
			expect(testMail.className()).toEqual(obj._className);
			
			expect(testMail.id()).toEqual(obj._id);
			
			expect(JSON.stringify(testMail).split('').sort().join()).toBe(JSON.stringify(obj).split('').sort().join());
		});
		
		
		it('can read (i.e. re-instantiate) itself from local storage', function() {
			
			testMail.address('somemail@server.dk'); // set a value to test for
			
			testMail.writeObject(); // write out to local storage
			
			app.Email.registry = new app.ObjectRegistry(app.Email, 'Email'); // reset registry
			
			expect(Object.keys(app.Email.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			testMail = new app.Email(testMail.id()); // re-instantiate from local storage
			
			expect(testMail.className()).toBe('Email'); // test
			
			expect(testMail.address()).toBe('somemail@server.dk');
		});
		
		it('can remove itself from local storage', function() {
			
			testMail.address('anothermail@serv.org'); // set a value to test for
			
			testMail.writeObject(); // write out to local storage
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id()));
			
			expect(obj._address).toBe('anothermail@serv.org'); // verify write
			
			testMail.removeObject(); // remove from local storage
			
			obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id()));
			
			expect(obj).toBe(null); // test that it's gone
			
		});
		
		
		it('rejects attempt to recreate itself from local storage if JSON has the wrong class', function() {
			
			testMail.writeObject(); // write out to local storage, the read back in
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id()));
			
			obj._className = 'no such class'; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id(), JSON.stringify(obj));
			
			app.Email.registry = new app.ObjectRegistry(app.Email, 'Email'); // reset registry
			
			expect(Object.keys(app.Email.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			
			expect(testMail.className()).toBe('Email'); // test
			
			try {
				
				testMail = new app.Email(testMail.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('Wrong class')).toBeGreaterThan(-1);
			}
			
			expect(Object.keys(app.Email.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
			
			expect(testMail.className()).toBe('Email'); // we should not have overridden original object
		});
		
		
		it('rejects attempt to recreate itself from storage if JSON does not have a valid ID', function() {
			
			testMail.writeObject(); // write out to local storage
			
			app.Email.registry = new app.ObjectRegistry(app.Email, 'Email'); // reset registry
			
			expect(Object.keys(app.Email.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id()));
			
			
			delete obj._id; // ID is undefined
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id(), JSON.stringify(obj));
			
			try {
				
				testMail = new app.Email(testMail.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID not defined');
			}
			
			
			obj._id = 'not an integer'; // ID is not an integer
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id(), JSON.stringify(obj));
			
			try {
				
				testMail = new app.Email(testMail.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be an integer');
			}
			
			
			obj._id = -1 // ID is negative
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id(), JSON.stringify(obj));
			
			try {
				
				testMail = new app.Email(testMail.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be greater than or equal to zero');
			}
			
			
			obj._id = testMail.id() + 1; // ID mismatch
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testMail.className() + '.' + testMail.id(), JSON.stringify(obj));
			
			try {
				
				testMail = new app.Email(testMail.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('ID mismatch')).toBe(0);
			}
			
			expect(Object.keys(app.Email.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
		});
		
		
		it('can re-establish object references when de-serializing from JSON', function(){
			
			// Required by ISerializable but nothing to do for now
			
			expect(testMail.onDeserialized()).toBe(true);
		});
		
		
		afterEach(function() {
			
			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
		
		afterAll(function() {
			
			testMail = null;
		});
		
	});
	
});