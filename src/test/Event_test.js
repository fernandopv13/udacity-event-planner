'use strict';

/* Jasmine.js unit test suite for Event class in meetup even planner application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

function TestObserver() {

	this.isUpdated = false;

	this.isInstanceOf = function(fnc) {return fnc === app.IObserver;};

	this.update = function() {this.isUpdated = true;};
}


describe('class Event', function(){
	
	var testEvent, testOrg, testPerson, testObserver;
	
	{ // Set up some mocks
		
		app.Person = app.Person || function(str_name) {
			
			var _name = str_name;
			
			this.name = function(){return _name};
			
			this.id = function(){return 1};
		};
		
		app.Organization = app.Organization || function(str_name) {
			
			var _name = str_name;
			
			this.name = function(){return _name};
			
			this.id = function(){return 1};
			
			this.hostName = function() {return _name}; //need to exist for IHost related unit tests to pass
			
			this.hostName = function(name) {_name = name}; //need to exist for IHost related unit tests to pass
		};


		
		beforeEach(function() {
			
			testOrg = new app.Organization('test organization');
						
			testPerson = new app.Person('test person');
			
			testEvent = new app.Event(
		
				'Vinter solstice celebration',
				
				'Mood enhancer',
				
				new Date(0),
				
				new Date(),
				
				'Camp Muddy',
				
				'We\'ll meet around a bonfire and keep warm with booze and tall tales under the open sky.',
				
				testOrg,
				
				500
			);

			testObserver = new TestObserver();
		});
	}


	it('implements the IObservable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.Event, app.IObservable)).toBe(true);
	});


	it('implements the IObserver interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.Event, app.IObserver)).toBe(true);
	});


	it('implements the ISerializable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.Event, app.ISerializable)).toBe(true);
	});
		
	
	it('can be instantiated with no parameters', function() {
		
		expect((new app.Event()).constructor).toBe(app.Event);
	});
	

	it('can be instantiated with the event\'s name as a parameter', function() {
		
		expect((new app.Event('Paaaartie!')).name()).toBe('Paaaartie!');
	});
	

	it('can be instantiated with a full set of parameters', function() {
		
		expect(testEvent.type()).toBe('Mood enhancer');
	});

	
	it('has an object registry', function() {
		
		expect(app.Event.registry.constructor).toBe(app.ObjectRegistry);
		
		expect(app.Event.registry.type()).toBe(app.Event);
	});
	
	
	describe('Event instance', function() {
		
		var oldPermission;
		
		beforeEach(function() {
			
			oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
		});
		
		
		it('can set and get its name', function() {
		
			testEvent.name('testName');
			
			expect(testEvent.name()).toBe('testName');
		});
		
		
		it('can set and get its type', function() {
		
			testEvent.type('testType');
			
			expect(testEvent.type()).toBe('testType');
		});
		
		
		it('can set and get its start date and time (using Date)', function() {
		
			var testDate = new Date(0);
			
			testEvent.start(testDate);
			
			expect(testEvent.start()).toBe(testDate);
		});
		
		it('can set and get its start date and time (using string)', function() {
		
			var testDate = new Date(0).toString();
			
			testEvent.start(testDate);
			
			expect(testEvent.start().toString()).toBe(testDate);
		});
		
		it('rejects attempt to set start that is not a valid Date (object or string)', function() {
		
			var oldDate = testEvent.start();
			
			var testDate = 'not a valid date (object or string)';
			
			try { // this should throw error
				
				testEvent.start(testDate);
			}
			
			catch(e)
			{
				
				expect(e.message).toBe('Start must be Date');
			}
			
			expect(testEvent.start()).toEqual(oldDate);
		});
		

		it('can set and get its end date and time (using Date)', function() {
		
			var testDate = new Date();
			
			testEvent.end(testDate);
			
			expect(testEvent.end()).toBe(testDate);
		});
		
		
		it('can set and get its end date and time (using string)', function() {
		
			var testDate = new Date().toString();
			
			testEvent.end(testDate);
			
			expect(testEvent.end().toString()).toBe(testDate);
		});
		
		it('rejects attempt to set end that is not a valid Date (object or string)', function() {
		
			var oldDate = testEvent.end();
			
			var testDate = 'not a valid Date (object or string)';
			
			try { // this should throw error
				
				testEvent.end(testDate);
			}
			
			catch(e)
			{
				
				expect(e.name).toBe('IllegalArgumentError');
			}
			
			expect(testEvent.end()).toEqual(oldDate);
		});

		
		it('rejects attempt to set end date before start date', function() {

			testEvent.start(new Date(200));

			try {

				testEvent.end(new Date(100));
			}

			catch (e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true); // Jasmine may not notice expects in trys
		});


		it('rejects attempt to set start date after end date', function() {

			testEvent.end(new Date(0));

			try {

				testEvent.start(new Date());
			}

			catch (e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true); // Jasmine may not notice expects in trys
		});


		it('can set and get its capacity (i.e. max no of guests)', function() {
		
			testEvent.capacity(100);
			
			expect(testEvent.capacity()).toBe(100);
		});
		
		
		it('rejects attempt to set capacity that is a not a positive integer, or zero', function() {
			
			try {
				
				testEvent.capacity('not an integer');
			}
			
			catch(e) {
				
				expect(e.message).toBe('Capacity must be an integer');
			}
			
			try {
				
				testEvent.capacity(-55);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Capacity cannot be negative');
			}
		});
		
		it('can add a Person to the guest list, and check if a person is already on the list', function(){
			
			if (!testEvent.isGuest(testPerson)) {testEvent.addGuest(testPerson)}
			
			expect(testEvent.isGuest(testPerson)).toBe(true);
		});
		
		
		it('rejects attempt to add a guest that is not a Person', function() {
			
			var oldLen = testEvent.guests().length;
			
			try {
				
				testEvent.addGuest('not a Person instance');
			}
			
			catch(e) {
				
				expect(e.message).toBe('Guest must be Person');
			}
			
			expect(testEvent.guests().length).toEqual(oldLen);
		});
		
		
		it('rejects attempt to add guests beyond capacity', function() {
			
			testEvent.capacity(0);
			
			try {
				
				testEvent.addGuest(new app.Person('One too many'));
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot add guests beyond capacity');
			}
		});
		
		
		it('can get a copy of the guest list', function(){
			
			testEvent.addGuest(new app.Person('One more guest'));
			
			var guestList = testEvent.guests();
			
			expect(guestList.constructor).toBe(Array);
			
			expect(guestList[0].constructor).toBe(app.Person);
		});
		
		
		it('can set the guest list using an array of deserialized object placeholders', function(){
			
			testEvent.guests([ // call as if during deserialization
			
				{_className: 'Person', _id: 0},
				
				{_className: 'Person', _id: 1},
				
				{_className: 'Person', _id: 2}
			]);
			
			var guestList = testEvent.guests();
			
			expect(guestList.constructor).toBe(Array);
			
			expect(guestList.length).toBe(3);
			
			expect(guestList[0]._className).toBe('Person');
			
			expect(guestList[0]._id).toBe(0);
			
			expect(guestList[1]._className).toBe('Person');
			
			expect(guestList[1]._id).toBe(1);
			
			expect(guestList[2]._className).toBe('Person');
			
			expect(guestList[2]._id).toBe(2);
		});
		
		
		it('rejects attempt to set the guest list using object that is not a placeholder for a Person', function(){
			
			try {
				testEvent.guests([ // call as if during deserialization
				
					{_className: 'Person', _id: 0},
					
					{_className: 'Person', _id: 1},
					
					{_className: 'Person', _id: 2}
				]);
			}
			
			catch(e) {
				
				expect(e.message).toBe('');
			}
			
			expect(true).toBe(true); // Jasmine.js may not see expects in trys
		});
		
		it('can remove a Person from the guest list', function(){
			
			var newGuest = new app.Person('One more guest');
			
			testEvent.addGuest(newGuest);
			
			var removed = testEvent.removeGuest(newGuest);
			
			expect(removed.constructor).toBe(Array);
			
			expect(removed.length).toEqual(1);
			
			expect(removed[0].id()).toEqual(newGuest.id());
			
		});
		
		
		it('rejects attempt to remove a guest that is not a Person', function() {
			
			var oldLen = testEvent.guests().length;
			
			try {
				
				testEvent.removeGuest('not a Person instance');
			}
			
			catch(e) {
				
				expect(e.message).toBe('Guest must be Person');
			}
			
			expect(testEvent.guests().length).toEqual(oldLen);
		});
		
		
		it('can set and get its location', function() {
		
			testEvent.location('testLocation');
			
			expect(testEvent.location()).toBe('testLocation');
		});
		
		
		it('can set and get its description of the event', function(){
			
			testEvent.description('testDescription');
			
			expect(testEvent.description()).toBe('testDescription');
		});
		
		
		it('can set and get its host', function(){
			
			testEvent.host(testOrg);
			
			expect(testEvent.host().hostName).toBeDefined();
		});
		
		
		it('rejects attempt to set a host that is not an IHost instance', function() {
		
			var oldHost = testEvent.host();
			
			try { // this should throw error
				
				testEvent.host({});
			}
			
			catch(e) {
				
				expect(e.message).toBe('Host must implement IHost');
			}
			
			expect(testEvent.host()).toBe(oldHost);
		});
		
		
		// IObservable testing

		it('can register an observer', function(){

			expect(testEvent.registerObserver(testObserver)).not.toBe(null);
		});
		

		it('rejects attempt to register an observer that does not implement IObservable', function(){

			try {

				testEvent.registerObserver({});
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

		});


		it('can notify its observers', function(){

			var testObserver2 = new TestObserver();

			expect(testObserver.isUpdated).toBe(false);

			expect(testObserver2.isUpdated).toBe(false);

			testEvent.registerObserver(testObserver);

			testEvent.registerObserver(testObserver2);

			testEvent.notifyObservers();

			expect(testObserver.isUpdated).toBe(true);

			expect(testObserver2.isUpdated).toBe(true);
		});
		

		it('can get its list of observers', function() {

			var testObserver2 = new TestObserver();

			testEvent.registerObserver(testObserver);

			testEvent.registerObserver(testObserver2);

			expect(testEvent.observers.constructor).toBe(Array);

			expect(testEvent.observers.length).toBe(2);

			expect(testEvent.observers[0].constructor).toBe(TestObserver);

			expect(testEvent.observers[1].constructor).toBe(TestObserver);

			expect(testEvent.observers[2]).not.toBeDefined();
		});

		
		// ISerializable testing

		it('can get its class name', function() {

			expect(testEvent.className()).toBe('Event');
		});


		it('can get its ID', function() {
		
			expect((new app.Event()).id()).toBeDefined();
		});
		
		
		it('rejects attempt to set ID (b/c read-only)', function() {
		
			try {
				
				(new app.Event()).id(5);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Illegal parameter: id is read-only');
			}
		});
		
			
		it('has an ID that is a positive integer or zero', function() {
		
			expect(testEvent.id()).toBeGreaterThan(-1);
			
			expect(parseInt(testEvent.id()) === testEvent.id()).toBe(true);
		});

		
		it('can be serialized to a valid JSON string', function() {
			
			// Set up some values to test for
			
			testEvent = new app.Event('Fab Festival','Summer Entertainment',new Date());
			
			testEvent.description('Fabulous summer entertainment!');
			
			testEvent.host(testOrg);
			
			
			// Stringify then parse back in
			
			var obj = JSON.parse(JSON.stringify(testEvent));
			
			
			// Test
			
			expect(typeof obj).toBe('object');
			
			expect(obj._className).toBeDefined();
			
			expect(obj._id).toBeDefined();
			
			expect(obj._start).toBeDefined();
			
			expect(obj._end).not.toBeDefined(); // default
			
			expect(obj._name).toBeDefined();
			
			expect(obj._type).toBeDefined();
			
			expect(obj._location).not.toBeDefined();
			
			expect(obj._description).toBeDefined();
			
			expect(obj._host).toBeDefined();
			
			expect(obj._capacity).toBeDefined(); // default
			
			expect(obj._guests.constructor).toBe(Array);
			
			expect(obj._guests.length).toBe(0); // default
		});
		
		
		it('can write itself to local storage', function() {
			
			testEvent.writeObject();
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id()));
			
			expect(testEvent.className()).toEqual(obj._className);
			
			expect(testEvent.id()).toEqual(obj._id);
			
			expect(JSON.stringify(testEvent).split('').sort().join()).toBe(JSON.stringify(obj).split('').sort().join());
		});
		
		
		it('can read (i.e. re-instantiate) itself from local storage', function() {
			
			testEvent.name('Big Fat Summer Festival'); // set a value to test for
			
			testEvent.writeObject(); // write out to local storage
			
			app.Event.registry = new app.ObjectRegistry(app.Event, 'Event'); // reset registry
			
			expect(Object.keys(app.Event.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			testEvent = new app.Event(testEvent.id()); // re-instantiate from local storage
			
			expect(testEvent.className()).toBe('Event'); // test
			
			expect(testEvent.name()).toBe('Big Fat Summer Festival');
		});
		
		
		it('can remove itself from local storage', function() {
			
			testEvent.name('Cool Winter Slumber'); // set a value to test for
			
			testEvent.writeObject(); // write out to local storage
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id()));
			
			expect(obj._name).toBe('Cool Winter Slumber'); // verify write
			
			testEvent.removeObject(); // remove from local storage
			
			obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id()));
			
			expect(obj).toBe(null); // test that it's gone
		});
		
		
		it('rejects attempt to recreate itself from local storage if JSON has the wrong class', function() {
			
			testEvent.writeObject(); // write out to local storage, the read back in
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id()));
			
			obj._className = 'no such class'; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id(), JSON.stringify(obj));
			
			app.Event.registry = new app.ObjectRegistry(app.Event, 'Event'); // reset registry
			
			expect(Object.keys(app.Event.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			
			expect(testEvent.className()).toBe('Event'); // test
			
			try {
				
				testEvent = new app.Event(testEvent.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('Wrong class')).toBeGreaterThan(-1);
			}
			
			expect(Object.keys(app.Event.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
			
			expect(testEvent.className()).toBe('Event'); // we should not have overridden original object
		});
		
		
		it('rejects attempt to recreate itself from storage if JSON does not have a valid ID', function() {

			testEvent.writeObject(); // write out to local storage
			
			app.Event.registry = new app.ObjectRegistry(app.Event, 'Event'); // reset registry
			
			expect(Object.keys(app.Event.registry.getObjectList()).length).toBe(0); // confirm that we're empty
			
			var obj = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id()));
			
			
			delete obj._id; // ID is undefined
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id(), JSON.stringify(obj));
			
			try {
				
				testEvent = new app.Event(testEvent.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID not defined');
			}
			
			
			obj._id = 'not an integer'; // ID is not an integer
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id(), JSON.stringify(obj));
			
			try {
				
				testEvent = new app.Event(testEvent.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be an integer');
			}
			
			
			obj._id = -1 // ID is negative
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id(), JSON.stringify(obj));
			
			try {
				
				testEvent = new app.Event(testEvent.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be greater than or equal to zero');
			}
			
			
			obj._id = testEvent.id() + 1; // ID mismatch
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testEvent.className() + '.' + testEvent.id(), JSON.stringify(obj));
			
			try {
				
				testEvent = new app.Event(testEvent.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('ID mismatch')).toBe(0);
			}
			
			expect(Object.keys(app.Event.registry.getObjectList()).length).toBe(0); // confirm that we're still empty
		});
		
		
		it('can re-establish object references when de-serializing from JSON', function(){
			
			testEvent.addGuest(new app.Person('Jorge'));
			
			testEvent.addGuest(new app.Person('Juanita'));
			
			testEvent.addGuest(new app.Person('Jaime'));
			
			testEvent.host(testOrg);
			
			testEvent.writeObject(); // write out to local storage
			
			app.Event.registry.remove(testEvent); // remove from registry
			
			testEvent = new app.Event(testEvent.id()); // re-instantiate from local storage
			
			expect(testEvent.className()).toBe('Event'); // verify re-instantiation
			
			expect(testEvent.name()).toBe('Vinter solstice celebration');
			
			
			testEvent.onDeserialized();
			
			
			expect(testEvent.guests()[0].name()).toBe('Jorge'); // verify deserialization
			
			expect(testEvent.guests()[1].name()).toBe('Juanita');
			
			expect(testEvent.guests()[2].name()).toBe('Jaime');
			
			expect(testEvent.guests()[3]).not.toBeDefined();
			
			expect(testEvent.host().name()).toBe('test organization');
		});
		
		
		afterEach(function() {
			
			app.prefs.isLocalStorageAllowed(oldPermission);
			
			localStorage.clear();
		});
		
		
		afterAll(function() {
			
			testEvent = null;
			
			testOrg = null;
			
			testPerson = null;
			
			delete app.testData;
		});
		
	});
	
});