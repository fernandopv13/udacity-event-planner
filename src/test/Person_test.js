'use strict';

/* Jasmine.js unit test suite for Person class in meetup even planner application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class Person', function(){
	
	// Set up some mocks
	
	app.Email = app.Email || function Email(str_address){
		
		this.id = function(){return 1};
		
		var _address = str_address;
		
		this.address = function() {return _address};
		
		this.setAddress = function(str_address) {_address = str_address};
	};
	
	
	app.Organization = app.Organization || function(str_name) {
			
		this.id = function(){return 1};
		
		var _name = str_name;
		
		this.name = function(){return _name};
		
		this.getHostName = function() {return _name}; //need to exist for IHost related unit tests to pass
		
		this.setHostName = function(name) {_name = name}; //need to exist for IHost related unit tests to pass
	};
		
	var testOrg = new app.Organization();
	
	var testMail = new app.Email('name@server.domain');
	
	// Start testing
	
	it('can be instantiated with no parameters', function() {
		
		expect((new app.Person()).constructor).toBe(app.Person);
	});
	
	
	it('can be instantiated with a full set of valid parameters', function() {
		
		expect((new app.Person('testPerson', testOrg, 'big boss', testMail, new Date())).constructor).toBe(app.Person);
	});
	
	
	it('rejects attempt to create with email that is not an Email', function() {
		
		try {
			
			this.success = new app.Person('testPerson', testOrg, 'big boss', 'not a valid email');
		}
		
		catch(e) {
			
			expect(e.message).toBe('Wrong type: Email must be an instance of the Email class');
		}
		
		expect(this.success).not.toBeDefined();
	});
	
	
	it('rejects attempt to create with employer that is not an Organization', function() {
		
		try {
			
			this.success = new app.Person('testPerson', 'not a valid organization', 'big boss', testMail);
		}
		
		catch(e) {
			
			expect(e.message).toBe('Employer must be Organization');
		}
		
		expect(this.success).not.toBeDefined();
	});
	
		
	it('has an object registry', function() {
		
		expect(app.Person.registry.constructor).toBe(app.ObjectRegistry);
		
		expect(app.Person.registry.type()).toBe(app.Person);
	});
	
	
	describe('instance', function() {
	
		var testPerson, oldPermission;
		
		beforeEach(function() {
			
			testPerson = new app.Person();

			testPerson.imgUrl('test URL');
			
			oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
		});
		
		
		it('inherits from Model', function() {

			// IInterfaceable

			expect(typeof testPerson.isInstanceOf).toBe('function');

			//Model

			expect(testPerson.isInstanceOf(app.Model)).toBe(true);

			expect(typeof testPerson.className).toBe('function');

			expect(typeof testPerson.id).toBe('function');

			expect(typeof testPerson.observers).toBe('function');

			expect(typeof testPerson.ssuper).toBe('function');

			//IObservable

			expect(typeof testPerson.notifyObservers).toBe('function');

			expect(typeof testPerson.registerObserver).toBe('function');

			expect(typeof testPerson.removeObserver).toBe('function');

			//IObserver

			expect(typeof testPerson.update).toBe('function');
		});


		it('can set and get its name', function() {
		
			testPerson.name('testName');
			
			expect(testPerson.name()).toBe('testName');
		});


		it('can set and get its image URL', function() {
		
			testPerson.imgUrl('test URL');
			
			expect(testPerson.imgUrl()).toBe('test URL');
		});
		
		
		it('can set and get its employer', function() {
			
			var testOrg = new app.Organization();
			
			testPerson.employer(testOrg);
			
			expect(testPerson.employer().id()).toBe(testOrg.id());
		});
		
		
		it('rejects attempt to set an employer that is not an Organization', function() {
			
			var oldEmp = testPerson.employer();
			
			try { // this should throw an error
				
				testPerson.employer('not an Organization instance');
			}
			
			catch(e) {
				
				expect(e.message).toBe('Employer must be Organization');
			}
			
			expect(testPerson.employer()).toBe(oldEmp);
		});
		
		
		it('can set and get its job title', function() {
		
			testPerson.jobTitle('test title');
			
			expect(testPerson.jobTitle()).toBe('test title');
		});
		
		
		it('can set and get its email', function() { // later test with proper Email class
			
			testPerson.email(testMail);
			
			expect(testPerson.email().address()).toBe('name@server.domain');
		});
		
		
		it('rejects attempt to set an email that is not an Email class', function() {
			
			var oldMail = testPerson.email();
			
			try { // this should throw an error
				
				testPerson.email('name@server.domain');
			}
			
			catch(e) {
				
				expect(e.message).toBe('Wrong type: Email must be an instance of the Email class');
			}
			
			expect(testPerson.email()).toBe(oldMail);
		});


		it('can set and get its birthday (using Date)', function() {
		
			var testDate = new Date();
			
			testPerson.birthday(testDate);
			
			expect(testPerson.birthday()).toBe(testDate);
		});
		
		
		it('can set and get its birthday (using string)', function() {
		
			var testDate = new Date().toString();
			
			testPerson.birthday(testDate);
			
			expect(testPerson.birthday().toString()).toBe(testDate);
		});


		it('rejects attempt to set birthday that is not a valid Date (object or string)', function() {
		
			var oldDate = testPerson.birthday();
			
			var testDate = 'not a valid Date (object or string)';
			
			try { // this should throw error
				
				testPerson.birthday(testDate);
			}
			
			catch(e)
			{
				
				expect(e.message).toBe('Birthday must be Date');
			}
			
			expect(testPerson.birthday()).toEqual(oldDate);
		});

		
		// IHost testing

		it('can set and get its IHost hostName', function() {
			
			testPerson.hostName('testHostName');
			
			expect(testPerson.hostName()).toBe('testHostName');
		});
		
		
		// ISerializable testing

		it('can get its class name', function() {

			expect(testPerson.className()).toBe('Person');
		});


		it('can get its ID', function() {
		
			expect(testPerson.id()).toBeDefined();
		});
		
		
		it('rejects attempt to set ID (b/c read-only)', function() {
		
			try {
				
				testPerson.id(5);
			}
			
			catch(e) {
				
				expect(e.name).toBe('IllegalArgumentError');
			}
		});
		
		
		it('has an ID that is a positive integer or zero', function() {
		
			expect(testPerson.id()).toBeGreaterThan(-1);
			
			expect(parseInt(testPerson.id()) === testPerson.id()).toBe(true);
		});
		
		
		it('can be serialized to a valid JSON string', function() {
			
			testPerson.name('what\'s in a name?');

			testPerson.birthday(new Date());
			
			var obj = JSON.parse(JSON.stringify(testPerson));

			expect(typeof obj).toBe('object');
			
			expect(obj._className).toBeDefined();
			
			expect(obj._id).toBeDefined();
			
			expect(obj._name).toBeDefined();
			
			expect(obj._employer).not.toBeDefined();
			
			expect(obj._jobTitle).not.toBeDefined();
			
			expect(obj._email).not.toBeDefined();

			expect(obj._birthday).toBeDefined();
		});
		
		
		it('can write itself to local storage', function() {
			
			testPerson.writeObject();
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id()));
			
			expect(testPerson.className()).toEqual(obj._className);
			
			expect(testPerson.id()).toEqual(obj._id);
			
			expect(JSON.stringify(testPerson).split('').sort().join()).toBe(JSON.stringify(obj).split('').sort().join());
		});
		
		
		it('can read (i.e. re-instantiate) itself from local storage', function() {
			
			testPerson.name('Claudia'); // set a couple of values to test for
			
			testPerson.birthday(new Date());

			testPerson.writeObject(); // write out to local storage
			
			app.Person.registry = new app.ObjectRegistry(app.Person, 'Person'); // reset registry
			
			expect(Object.keys(app.Person.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			testPerson = new app.Person(testPerson.id()); // re-instantiate from local storage
			
			expect(testPerson.className()).toBe('Person'); // test
			
			expect(testPerson.name()).toBe('Claudia');

			expect(testPerson.imgUrl()).toBe('test URL');

			expect(testPerson.birthday()).toBeDefined()
		});
		
		
		it('can remove itself from local storage', function() {
			
			testPerson.name('Tina'); // set a value to test for
			
			testPerson.writeObject(); // write out to local storage
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id()));
			
			expect(obj._name).toBe('Tina'); // verify write
			
			testPerson.removeObject(); // remove from local storage
			
			obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id()));
			
			expect(obj).toBe(null); // test that it's gone
		});
		
		
		it('rejects attempt to recreate itself from local storage if JSON has the wrong class', function() {
			
			testPerson.writeObject(); // write out to local storage, the read back in
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id()));
			
			obj._className = 'no such class'; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id(), JSON.stringify(obj));
			
			app.Person.registry = new app.ObjectRegistry(app.Person, 'Person'); // reset registry
			
			expect(Object.keys(app.Person.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			
			expect(testPerson.className()).toBe('Person'); // test
			
			try {
				
				testPerson = new app.Person(testPerson.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('Wrong class')).toBeGreaterThan(-1);
			}
			
			expect(Object.keys(app.Person.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
			
			expect(testPerson.className()).toBe('Person'); // we should not have overridden original object
		});
		
		
		it('rejects attempt to recreate itself from storage if JSON does not have a valid ID', function() {

			testPerson.writeObject(); // write out to local storage
			
			app.Person.registry = new app.ObjectRegistry(app.Person, 'Person'); // reset registry
			
			expect(Object.keys(app.Person.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id()));
			
			
			delete obj._id; // ID is undefined
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id(), JSON.stringify(obj));
			
			try {
				
				testPerson = new app.Person(testPerson.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID not defined');
			}
			
			
			obj._id = 'not an integer'; // ID is not an integer
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id(), JSON.stringify(obj));
			
			try {
				
				testPerson = new app.Person(testPerson.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be an integer');
			}
			
			
			obj._id = -1 // ID is negative
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id(), JSON.stringify(obj));
			
			try {
				
				testPerson = new app.Person(testPerson.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be greater than or equal to zero');
			}
			
			
			obj._id = testPerson.id() + 1; // ID mismatch
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testPerson.className() + '.' + testPerson.id(), JSON.stringify(obj));
			
			try {
				
				testPerson = new app.Person(testPerson.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('ID mismatch')).toBe(0);
			}
			
			expect(Object.keys(app.Person.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
		});
		
		
		it('can re-establish object references when de-serializing from JSON', function(){
			
			testPerson.name('Big boss tester'); // set some values to test for

			testPerson.email(new app.Email('nosuchuser@undef.anywhere'));
			
			var email_id = testPerson.email().id();
			
			testPerson.employer(new app.Organization('ACME Corp'));
			
			var employer_id = testPerson.employer().id();
			
			testPerson.writeObject(); // write out to local storage
			
			app.Person.registry.remove(testPerson); // remove from registry
			
			testPerson = new app.Person(testPerson.id()); // re-instantiate from local storage
			
			expect(testPerson.className()).toBe('Person'); // verify re-instantiation
			
			expect(testPerson.name()).toBe('Big boss tester');

			expect(testPerson.imgUrl()).toBe('test URL');
			
			expect(testPerson.email()._id).toBe(email_id);
			
			expect(testPerson.employer()._id).toBe(employer_id);
			
			
			testPerson.onDeserialized();
			
			
			expect(testPerson.email().address()).toBe('nosuchuser@undef.anywhere');
			
			expect(testPerson.employer().name()).toBe('ACME Corp');
		});
		
		
		afterEach(function() {
			
			app.prefs.isLocalStorageAllowed(oldPermission);
			
			localStorage.clear();
		});
		
		
		afterAll(function() {
			
			testPerson = undefined;
		});
		
	});
});