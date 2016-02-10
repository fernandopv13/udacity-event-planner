'use strict';

/* Jasmine.js unit test suite for ObjectRegistry class in meetup even planner application
*
*  The purpose of the class is to perform compiler-like checking of the implementation of an interface during unit
testing, without adding to the production code.
*/

var app = app || {};


describe('class ObjectRegistry', function(){
	
	it('implements the ISerializable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.ObjectRegistry, app.ISerializable)).toBe(true);
	});
	

	it('can be instantiated', function() {
		
		app.String = String; // workaround for param validation in constructor; expects property of app
		
		expect((new app.ObjectRegistry(String, 'String')).constructor).toBe(app.ObjectRegistry);
	});
	
	
	describe('ObjectRegistry instance', function() {
		
		// Set up some mocks
		
		app.TestType = function(str_attr) {
		
			this._id = app.TestType.cnt++;
				
			this.attr = str_attr;
			
			this.className = function() {return 'TestType';};
			
			this.id = function() {return this._id};
			
			this.onDeserialized = function() {

				deSerializedCounter++;
			};

			this.toJSON = function() {
				
				return {
					
					_className: 'TestType',
					
					_id: this._id,
					
					attr: this.attr
				}
			}
			
			this.writeObject = app.ISerializable.prototype.default_writeObject;
			
			app.TestType.registry.add(this);
		};

		app.TestType.registry = new app.ObjectRegistry(app.TestType, 'TestType');
		
		var testRegistry = app.TestType.registry;

		var deSerializedCounter;
		
		
		beforeEach(function() {
		
			app.TestType.registry.clear();// = new app.ObjectRegistry(app.TestType, 'TestType');
		
			app.TestType.cnt = 0;

			deSerializedCounter = 0;
		});
		
		
		it('can add return the class name of the objects it holds', function() {
			
			expect(testRegistry.objectClassName()).toBe('TestType');
		});
				
		
		it('can add an object to the registry', function() {
			
			for (var i = 0; i < 25; i++) {
				
				void new app.TestType();
				
				expect(testRegistry.getObjectList()[i]._id).toBe(i);
			}
		});
		
		
		it('rejects attempt to add an object already in the registry', function() {
			
			// First attempt, should succeed
			
			expect(Object.keys(testRegistry.getObjectList()).length).toEqual(0);
			
			var dupl = new app.TestType();
			
			expect(Object.keys(testRegistry.getObjectList()).length).toEqual(1);
			
			
			// Second attempt, should throw error
			
			try {
				
				testRegistry.add(dupl);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object with same id is already in registry');
			}
			
			expect(testRegistry.getObjectList()[1]).not.toBeDefined(0);
		});
		
		
		it('rejects attempt to add an object of the wrong type', function() {
			
			expect(Object.keys(testRegistry.getObjectList()).length).toEqual(0);
			
			try {
				
				testRegistry.add(''); // we're expecting an app.TestType
			}
			
			catch(e) {
				
				expect(e.message).toBe('Wrong type for this registry: Expected TestType');
			}
			
			expect(Object.keys(testRegistry.getObjectList()).length).toEqual(0);
		});
		
		
		it('rejects attempt to add an object without an id() method returning a non-zero integer', function() {
			
			var testObj = new app.TestType();
			
		
			testObj._id = 'not an integer';
			
			try {
				
				this.success = testRegistry.add(testObj);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object must support a id() method that returns a non-negative integer');
			}
			
			
			testObj._id = -1;
			
			try {
				
				this.success = testRegistry.add(testObj);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object must support a id() method that returns a non-negative integer');
			}
			
			
			delete testObj.id;
			
			try {
				
				this.success = testRegistry.add(testObj);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object must support a id() method that returns a non-negative integer');
			}
			
			expect(this.success).not.toBeDefined();
		});
		
		
		it('starts generating IDs at zero', function() {
		
			expect(testRegistry.getNextId()).toBe(0);
		});
		
		
		it('subsequently generates integer IDs that increment by 1', function() {
			
			var nextId;
			
			for (var i = 0; i < 101; i++) {
			
				nextId = testRegistry.getNextId();
				
				expect(nextId).toBe(i);
				
				expect(parseInt(nextId) === nextId).toBe(true);
				
				void new app.TestType();
			}
		});
		
		
		it('can get an object from the registry by ID', function(){
			
			void new app.TestType();
			
			var testObj = new app.TestType();
			
			void new app.TestType();
			
			expect(testRegistry.getObjectById(testObj.id())).toBe(testObj); // id found
			
			expect(testRegistry.getObjectById(10000)).not.toBeDefined(); // no match
		});
		
		
		it('can get an object from the registry by property value', function(){
			
			void new app.TestType('first');
			
			var testObj = new app.TestType('second');
			
			void new app.TestType('third');
			
			expect(testRegistry.getObjectByAttribute('attr', 'second')).toBe(testObj); // public attributes
			
			expect(testRegistry.getObjectByAttribute('attr', 'second')).toBe(testObj); // private attributes (expects prop to be getter method)
			
			expect(testRegistry.getObjectByAttribute('attr', 'no such object')).toBe(null); // no match
		});
		
			
		it('can remove an object from the registry', function(){
			
			void new app.TestType();
			
			var testObj = new app.TestType();
			
			void new app.TestType();
			
			
			expect(testRegistry.getObjectById(0)).toBeDefined();
			
			expect(testRegistry.getObjectById(1)).toBeDefined();
			
			expect(testRegistry.getObjectById(2)).toBeDefined();
			
			expect(testRegistry.remove(testObj).id()).toBe(1);
			
			expect(testRegistry.getObjectById(1)).not.toBeDefined();
		});
		
		
		it('rejects attempt to remove an object of the wrong type', function() {
			
			try {
				
				this.success = testRegistry.remove({});
			}
			
			catch(e) {
				
				expect(e.message).toBe('Wrong type for this registry');
			}
			
			expect(this.success).not.toBeDefined();
		});
		
		
		it('rejects attempt to remove an object without a getInt() method returning a non-zero integer', function() {
			
			var testObj = new app.TestType();
		
			
			testObj._id = 'not an integer';
			
			try {
				
				this.success = testRegistry.remove(testObj);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object must support a id() method that returns a non-negative integer');
			}
			
			
			testObj._id = -1;
			
			try {
				
				this.success = testRegistry.remove(testObj);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object must support a id() method that returns a non-negative integer');
			}
			
			
			delete testObj.id;
			
			try {
				
				this.success = testRegistry.remove(testObj);
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object must support a id() method that returns a non-negative integer');
			}
			
			expect(this.success).not.toBeDefined();
		});
		
		
		it('ignores attempts to remove an object that isn\'t in the registry', function() {
			
			expect(testRegistry.getObjectById(0)).not.toBeDefined();
			
			
			void new app.TestType();
			
			void new app.TestType();
			
			void new app.TestType();
			
			
			expect(testRegistry.getObjectList(2)).toBeDefined();
			
			testRegistry.remove(new app.TestType());
			
			expect(testRegistry.getObjectList(0)).toBeDefined();
			
			expect(testRegistry.getObjectList(1)).toBeDefined();
			
			expect(testRegistry.getObjectList(2)).toBeDefined();
		});
		
		
		it('can return a list of objects in the registry', function() {
			
			expect(testRegistry.getObjectById(0)).not.toBeDefined();
			
			
			void new app.TestType();
			
			void new app.TestType();
			
			void new app.TestType();
						
			
			expect(testRegistry.getObjectList()[2]).toBeDefined();
			
			expect(testRegistry.getObjectList()[3]).not.toBeDefined();
		});
			
			
		it('can return the type of objects required (by function, i.e. class, reference)', function() {
			
			expect(testRegistry.type()).toBe(app.TestType);
		});
		
		
		// ISerializable testing

		it('can get its class name', function() {
			
			expect(testRegistry.className()).toBe('ObjectRegistry');
		});
		
		
		it('can get its id', function() {
			
			expect(parseInt(testRegistry.id())).toEqual(testRegistry.id());

			expect(parseInt(testRegistry.id())).toBeGreaterThan(-1);
		});


		it('can serialize its data to a valid JSON string', function() {
			
			void new app.TestType();
			
			void new app.TestType();
			
			void new app.TestType();
			
			
			var obj_json = JSON.parse(JSON.stringify(testRegistry)); // if this doesn's throw an error, we're basically fine
			
			
			expect(typeof obj_json).toBe('object');
			
			expect(obj_json._className).toBe('ObjectRegistry');
			
			expect(obj_json._id).toBeDefined();
			
			expect(obj_json._objectClassName).toBe('TestType');
			
			expect(obj_json._objectList[0]).toBeDefined();
			
			expect(obj_json._objectList[0]._className).toBe('TestType');
			
			expect(obj_json._objectList[0]._id).toBe(0);
			
			expect(obj_json._objectList[1]).toBeDefined();
			
			expect(obj_json._objectList[1]._className).toBe('TestType');
			
			expect(obj_json._objectList[1]._id).toBe(1);
			
			expect(obj_json._objectList[2]).toBeDefined();
			
			expect(obj_json._objectList[2]._className).toBe('TestType');
			
			expect(obj_json._objectList[2]._id).toBe(2);
		});
		
		
		it('can write itself to local storage', function() {
			
			var oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
			
			
			void new app.TestType();
			
			void new app.TestType();
			
			void new app.TestType();
			
			
			testRegistry.writeObject();
					
			var obj_json = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id()));
			
			
			expect(obj_json._className).toBe('ObjectRegistry');
			
			expect(obj_json._id).toBe(testRegistry.id());
			
			expect(obj_json._objectClassName).toBe('TestType');
			
			expect(obj_json._objectList).toBeDefined();
			
			expect(obj_json._objectList[0]._id).toBe(0);
			
			expect(obj_json._objectList[1]._id).toBe(1);
			
			expect(obj_json._objectList[2]._id).toBe(2);
			
			expect(obj_json._objectList[3]).not.toBeDefined();
			
			
			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
		
		it('can read (i.e. re-instantiate) itself from local storage', function() {
			
			var oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
			
			
			void new app.TestType();
			
			void new app.TestType();
			
			void new app.TestType();
			
			
			testRegistry.writeObject(); // write registry to local storage
			
			var regId = testRegistry.id(); // get the id
			
			app.TestType.cnt = 0; // simulate behaviour of real classes that would set id to param when reading in from storage
			
			app.TestType.registry = new app.ObjectRegistry(regId); //re-instantiate registry itself from storage
			
			testRegistry = app.TestType.registry; // make sure we have a good reference
			
			testRegistry.readObjects(); // re-instantiate registry contens from storage, overwriting temporarty placeholders
			
			
			expect(testRegistry.id()).toBe(regId); // test
			
			expect(testRegistry.className()).toBe('ObjectRegistry');
			
			expect(testRegistry.type()).toBe(app.TestType);
			
			expect(testRegistry.getObjectList()[0].className()).toBe('TestType');
			
			expect(testRegistry.getObjectList()[0].id()).toBe(0);
			
			expect(testRegistry.getObjectList()[1].className()).toBe('TestType');
			
			expect(testRegistry.getObjectList()[1].id()).toBe(1);
			
			expect(testRegistry.getObjectList()[2].className()).toBe('TestType');
			
			expect(testRegistry.getObjectList()[2].id()).toBe(2);
			
			expect(testRegistry.getObjectList()[3]).not.toBeDefined();
			
			
			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
		
		it('can remove itself from local storage', function() {
			
			var oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
			
			
			void new app.TestType();
			
			void new app.TestType();
			
			void new app.TestType();
			
			
			// Write and verify
			
			testRegistry.writeObject();
					
			var obj_json = testRegistry.readObject(['_objectList','_objectCount', '_objectConstructor','_objectClassName']);
			
			expect(obj_json._className).toBe('ObjectRegistry');
			
			expect(obj_json._id).toBe(testRegistry.id());
			
			
			// Remove and verify
			
			expect(testRegistry.removeObject()).toBe(true);
			
			try {
			
				testRegistry.readObject();
			}
			
			catch(e) {
				
				expect(e.message).toBe('Object not found in local storage');
			}
			
			
			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
		
		it('rejects attempt to recreate itself from local storage if JSON has the wrong class', function() {
			
			var oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
			
			
			testRegistry.writeObject(); // write out to local storage, the read back in
			
			var obj_json = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id()));
			
			obj_json._className = 'no such class'; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id(), JSON.stringify(obj_json));
			
			
			try {
				
				testRegistry = new app.ObjectRegistry(testRegistry.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('Wrong class')).toBeGreaterThan(-1);
			}
			
			expect(testRegistry.className()).toBe('ObjectRegistry'); // we should not have overridden original object
			
			
			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
		
		it('rejects attempt to recreate itself from storage if JSON does not have a valid ID', function() {

			var oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
			
			
			testRegistry.writeObject(); // write out to local storage, the read back in
			
			
			// ID not defined
			
			var obj_json = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id()));
			
			delete obj_json._id; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id(), JSON.stringify(obj_json));
			
			try {
				
				testRegistry = new app.ObjectRegistry(testRegistry.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID not defined');
			}
			
			
			// ID not an integer
			
			obj_json = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id()));
			
			obj_json._id = 'not an integer'; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id(), JSON.stringify(obj_json));
			
			try {
				
				testRegistry = new app.ObjectRegistry(testRegistry.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be an integer');
			}
			
			
			// ID negative
			
			obj_json = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id()));
			
			obj_json._id = -1; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id(), JSON.stringify(obj_json));
			
			try {
				
				testRegistry = new app.ObjectRegistry(testRegistry.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message).toBe('Cannot re-instantiate object: ID must be greater than or equal to zero');
			}
			
			
			expect(testRegistry.className()).toBe('ObjectRegistry'); // we should not have overridden original object
			
			
			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
		
		it('rejects attempt to recreate itself from storage if JSON ID does not match original ID', function() {

			var oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
			
			
			testRegistry.writeObject(); // write out to local storage, the read back in
			
			
			var obj_json = JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id()));
			
			obj_json._id = testRegistry.id() + 1; // deliberately mess up local storage
			
			localStorage.setItem(app.prefs.localStoragePrefix() + testRegistry.className() + '.' + testRegistry.id(), JSON.stringify(obj_json));
			
			try {
				
				testRegistry = new app.ObjectRegistry(testRegistry.id()); // re-instantiate from local storage
			}
			
			catch(e) {
				
				expect(e.message.indexOf('ID mismatch')).toBeGreaterThan(-1);
			}
			
			
			expect(testRegistry.className()).toBe('ObjectRegistry'); // we should not have overridden original object
			
			
			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
				
		it('can re-establish object references when de-serializing from JSON', function(){
			
			var oldPermission = app.prefs.isLocalStorageAllowed();
			
			app.prefs.isLocalStorageAllowed(true);
			
			void new app.TestType();
			
			void new app.TestType();
			
			void new app.TestType();

			expect(deSerializedCounter).toBe(0);

			testRegistry.onDeserialized();

			expect(deSerializedCounter).toBe(3);
			

			app.prefs.isLocalStorageAllowed(oldPermission);
		});
		
		
		afterEach(function(){
			
			localStorage.clear();
		});
		
		
		afterAll(function() {
			
			testRegistry = null;
			
			delete app.TestType;
		});
		
	});
});