'use strict';

/* Jasmine.js unit test suite for Organization class in meetup even planner application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class Organization', function(){
	
	it('implements the IHost interface', function() { //uses InterfaceTester.js
			
			expect(app.IInterfaceable.isImplementationOf(app.Organization, app.IHost)).toBe(true);
	});


	it('can be instantiated with no parameters', function() {
		
		expect((new app.Organization()).constructor).toBe(app.Organization);
	});
	
	
	it('can be instantiated with the organization\'s name as a parameter', function() {
		
		expect((new app.Organization('ACME')).name()).toBe('ACME');
	});
	
		
	it('has an object registry', function() {
		
		expect(app.Organization.registry.constructor).toBe(app.ObjectRegistry);
		
		expect(app.Organization.registry.type()).toBe(app.Organization);
	});
	
	
	describe('Organization instance', function() {
		
		var testOrg, oldPermission;
		
		beforeEach(function() {
			
			testOrg = new app.Organization();
			
			oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
		});
		
		
		it('inherits from Model', function() {

			// IInterfaceable

			expect(testOrg.isInstanceOf(app.IInterfaceable)).toBe(true);

			expect(typeof testOrg.isInstanceOf).toBe('function');

			//Model

			expect(testOrg.isInstanceOf(app.Model)).toBe(true);

			expect(testOrg.isInstanceOf(app.Organization)).toBe(true);

			expect(typeof testOrg.className).toBe('function');

			expect(typeof testOrg.id).toBe('function');

			expect(typeof testOrg.observers).toBe('function');

			expect(typeof testOrg.ssuper).toBe('function');

			//IObservable

			expect(testOrg.isInstanceOf(app.IObservable)).toBe(true);

			expect(typeof testOrg.notifyObservers).toBe('function');

			expect(typeof testOrg.registerObserver).toBe('function');

			expect(typeof testOrg.removeObserver).toBe('function');

			//IObserver

			expect(testOrg.isInstanceOf(app.IObserver)).toBe(true);

			expect(typeof testOrg.update).toBe('function');

			// ISerializable

			expect(testOrg.isInstanceOf(app.ISerializable)).toBe(true);

			expect(typeof testOrg.writeObject).toBe('function');

			expect(typeof testOrg.readObject).toBe('function');

			expect(typeof testOrg.removeObject).toBe('function');
		});


		it('can set and get its name', function() {
		
			testOrg.name('testName');
			
			expect(testOrg.name()).toBe('testName');
		});
		
		
		// IHost testing

		it('can tell if it is an instance of IHost', function() {

			expect(testOrg.isInstanceOf(app.IHost)).toBe(true);

			expect(testOrg.isInstanceOf(Error)).toBe(false);
		});


		it('can set and get its IHost hostName', function() { //uses Interface.js
			
			testOrg.hostName('testHostName');
			
			expect(testOrg.hostName()).toBe('testHostName');
		});
		

		// ISerializable testing

		it('can get its class name', function() {

			expect(testOrg.className()).toBe('Organization');
		});
		

		it('can get its ID', function() {
		
			expect(testOrg.id()).toBeDefined();
		});
		
		
		it('rejects attempt to set ID (b/c read-only)', function() {
		
			try {
				
				testOrg.id(5);
			}
			
			catch(e) {
				
				expect(e.name).toBe('IllegalArgumentError');
			}
		});
		
				
		it('has an ID that is a positive integer or zero', function() {
		
			expect(testOrg.id()).toBeGreaterThan(-1);
			
			expect(parseInt(testOrg.id()) === testOrg.id()).toBe(true);
		});
		
		
		it('can serialize its data to a valid JSON string', function() {
			
			var obj = JSON.parse(JSON.stringify(testOrg));
			
			expect(typeof obj).toBe('object');
			
			expect(obj._className).toBeDefined();
			
			expect(obj._id).toBeDefined();
			
			expect(obj._name).not.toBeDefined();
		});
		
			
		it('can write itself to local storage', function() {
			
			testOrg.writeObject();
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id()));
			
			expect(testOrg.className()).toEqual(obj._className);
			
			expect(testOrg.id()).toEqual(obj._id);
			
			expect(JSON.stringify(testOrg).split('').sort().join()).toBe(JSON.stringify(obj).split('').sort().join());
		});
		
		
		it('can read (i.e. re-instantiate) itself from local storage', function() {
			
			testOrg.name('ACME Corp'); // set a value to test for
			
			testOrg.writeObject(); // write out to local storage
			
			app.Organization.registry = new app.ObjectRegistry(app.Organization, 'Organization'); // reset registry
			
			expect(Object.keys(app.Organization.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			testOrg = new app.Organization(testOrg.id()); // re-instantiate from local storage
			
			expect(testOrg.className()).toBe('Organization'); // test
			
			expect(testOrg.name()).toBe('ACME Corp');
		});
		
		
		it('can remove itself from local storage', function() {
			
			testOrg.name('Ben\s Bakery'); // set a value to test for
			
			testOrg.writeObject(); // write out to local storage
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id()));
			
			expect(obj._name).toBe('Ben\s Bakery'); // verify write
			
			testOrg.removeObject(); // remove from local storage
			
			obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id()));
			
			expect(obj).toBe(null); // test that it's gone
		});
		
		
		it('rejects attempt to recreate itself from local storage if JSON has the wrong class', function() {
			
			testOrg.writeObject(); // write out to local storage, the read back in
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id()));
			
			obj._className = 'no such class'; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id(), JSON.stringify(obj));
			
			app.Organization.registry = new app.ObjectRegistry(app.Organization, 'Organization'); // reset registry
			
			expect(Object.keys(app.Organization.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			
			expect(testOrg.className()).toBe('Organization'); // test
			
			try {
				
				testOrg = new app.Organization(testOrg.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('Wrong class')).toBeGreaterThan(-1);
			}
			
			expect(Object.keys(app.Organization.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
			
			expect(testOrg.className()).toBe('Organization'); // we should not have overridden original object
		});
		
		
		it('rejects attempt to recreate itself from storage if JSON does not have a valid ID', function() {

			testOrg.writeObject(); // write out to local storage
			
			app.Organization.registry = new app.ObjectRegistry(app.Organization, 'Organization'); // reset registry
			
			expect(Object.keys(app.Organization.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id()));
			
			
			delete obj._id; // ID is undefined
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id(), JSON.stringify(obj));
			
			try {
				
				testOrg = new app.Organization(testOrg.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID not defined');
			}
			
			
			obj._id = 'not an integer'; // ID is not an integer
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id(), JSON.stringify(obj));
			
			try {
				
				testOrg = new app.Organization(testOrg.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be an integer');
			}
			
			
			obj._id = -1 // ID is negative
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id(), JSON.stringify(obj));
			
			try {
				
				testOrg = new app.Organization(testOrg.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be greater than or equal to zero');
			}
			
			
			obj._id = testOrg.id() + 1; // ID mismatch
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testOrg.className() + '.' + testOrg.id(), JSON.stringify(obj));
			
			try {
				
				testOrg = new app.Organization(testOrg.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('ID mismatch')).toBe(0);
			}
			
			expect(Object.keys(app.Organization.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
		});
		
		
		it('can re-establish object references when de-serializing from JSON', function(){
			
			// Required by ISerializable but nothing to do for now
			
			expect(true).toBe(true);
		});
		
		
		it('can delete itself', function() {

			expect(typeof testOrg.delete).toBe('function');

			var id = testOrg.id();

			expect(app.Organization.registry.getObjectById(id)).not.toBe(null);

			testOrg.delete();

			expect(app.Organization.registry.getObjectById(id)).toBe(null);				
		});


		it('can update itself when notified of change by Observable', function() {

			var id = testOrg.id();
			
			testOrg.name('ACME');

			// Create temporary object to copy from

			var tmpOrg = new app.Organization('Coop');

			
			// Verify that object contents are different

				expect(testOrg.id()).toEqual(id);

				expect(testOrg.id()).not.toEqual(tmpOrg.id());

				expect(testOrg.name()).not.toEqual(tmpOrg.name());

				
			// Copy data from temporary object

			testOrg.update (tmpOrg, id);


			// Verify copy

			expect(testOrg.name()).toEqual(tmpOrg.name());

			
			// Verify that temporary object has been removed from registry

			expect(app.Organization.registry.getObjectById(tmpOrg.id())).toBe(null);
		});


		afterEach(function(){
			
			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
		
		afterAll(function() {
			
			testOrg = null;
		});
		
	});
	
});