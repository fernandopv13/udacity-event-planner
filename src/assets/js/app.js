'use strict';

/*
* The app object provides a basic namespace for the application
* and app.init() gets things going when the page has fully loaded.
* 
*
* Please see individual source files, and provided UML diagrams,
* for further comments.

/******************************************************************************
* public module app
******************************************************************************/

/** @description Creates a module for the app using the immediately invoked anonymous function pattern. In OO terms, basically a singleton of an anonymous class with no meaningful static members.
*
* @constructor
*
* @return {Object} Top-level singleton (module) providing a simple, encapsulated namespace, as well as module-level functionality, for the app.
*
* @author Ulrik H. Gade, March 2016
*
*/

var app = (function(self) {
	
	var _device = new app.Device(),

	_prefs = { // list of prefs, private so we can control access
		
		defaultEventCapacity: 50,

		isLocalStorageAllowed: false,	
	
		localStoragePrefix: 'dk.ulrikgade.udacity.srwebdev.meetup-app.'
	},

	_ready = false, // set true at end of app initialization

	_registry = []; // top level collection of collections of data model objects managed by the app
	
	
	
	
	self.controller = new self.Controller();

	self.prefs = { // public accessors for preferences, using unified accessor pattern
		
		/** Gets or sets default event capacity */

		defaultEventCapacity: function(int_capacity) {

			if (arguments.length === 1) {

				if (int_capacity === parseInt(int_capacity)) {

					if (int_capacity > -1) {

						_prefs.defaultEventCapacity = int_capacity;
					}
					else {
						throw new RangeError('Capacity cannot be negative');
					}
				}
				else {
					throw new IllegalArgumentError('Capacity must be an integer');
				}
			}

			return _prefs.defaultEventCapacity;
		},


		/** Gets or sets permission to store data locally */
		
		isLocalStorageAllowed: function(bool_isAllowed) {
			
			// Router to account, mostly to avoid refactoring of ISerializable

			if (arguments.length > 0) {

				app.controller.selectedAccount().localStorageAllowed(bool_isAllowed);
			}

			return  app.controller.selectedAccount() ? app.controller.selectedAccount().localStorageAllowed() : false;

			/*if (typeof bool_isAllowed !== 'undefined') { // param present
				
				if (typeof bool_isAllowed === 'boolean') { // parem is boolean, so set
				
					_prefs.isLocalStorageAllowed = bool_isAllowed;
				}
				
				else {
					
					throw new TypeError('Wrong type: Expected Boolean');
				}
			}
			
			return _prefs.isLocalStorageAllowed;

			*/
		},
		
		
		/** Gets prefix to be used in keys for local storage of app data (read-only) */
		
		localStoragePrefix: function() {
			
			if (arguments.length === 0) {
			
				return _prefs.localStoragePrefix;
			}
			
			else {
				
				throw new IllegalAccessError('Illegal parameter: Local storage prefix is read-only');
			}
		}
	}
		
	self.ready = function() {return _ready;}; // public getter for app's ready state

	self.registry = { // allows serialization/deserialization of all the app's data in one fell swoop
		
		//ObjectRegistry class needs named class reference, so cannot be used with this anonymous module
		
		add: function(obj) { _registry.push(obj);}, // later type check to only accept ObjectRegistry's
		
		
		clear: function() {
			
			_registry.forEach(function(reg) {reg.clear();});
		},
		
		getObjectList: function() {return _registry},
		
		writeObject: function() { // write app data (in class registries) out to local storage
			
			if (!window.localStorage) {throw new ReferenceError('localStorage not available');}
	
			if (!app.prefs.isLocalStorageAllowed()) {throw new IllegalAccessError('Use of local storage not allowed by user');}
	
			localStorage.clear(); // clear out any crud
			
			for (var i = 0, len = _registry.length; i < len; i++) {_registry[i].writeObject()}
		},
		
		
		readObject: function() { // read app data (in class registries) in from local storage
			
			// Re-instantiate all objects of every class, and their registries
			
			for (var i = 0, len = localStorage.length, key, className, obj_json, objectClassName; i < len; i++) {
				
				key = localStorage.key(i).split('.'); className = key[key.length - 2];
				
				if (className === 'ObjectRegistry') { // read in object registries
					
					obj_json = JSON.parse(localStorage.getItem(localStorage.key(i)));
				
					objectClassName = obj_json._objectClassName;
					
					app[objectClassName].registry = new app.ObjectRegistry(obj_json._id); // registry
					
					app[objectClassName].registry.readObjects(); // registry contents
				}
				
				// else throw new TypeError('...');
			}
		},
		
		
		onDeserialized: function() { // re-establish references between objects after they have been read in
		
			//_registry.forEach(function(reg, self) {console.log(reg.objectClassName());reg.onDeserialized()});
			
			//for (var i = 0, len = _registry.length; i < len; i++) {_registry[i].onDeserialized();}
			
			
			// loops don't work (registries' onDeserialized() don't see the objects), so going manual
			
			self.Account.registry.onDeserialized();
	
			self.Email.registry.onDeserialized();
			
			self.Event.registry.onDeserialized();
			
			self.Organization.registry.onDeserialized();
			
			self.Person.registry.onDeserialized();
		}
	}
	
	self.device = function() {return _device;};
	
	self.init = function() {
		
		// Hide progress indicator

		$('#preloader').hide('fast');

		$('#preloader').addClass('hidden');

		$('#preloader').attr('aria-hidden', true); // later, investigate if this could do more of the work of hiding

		
		// Set up registries to track created objects

		self.registry.add(self.Account.registry);
	
		self.registry.add(self.Email.registry);
		
		self.registry.add(self.Event.registry);
		
		self.registry.add(self.Organization.registry);
		
		self.registry.add(self.Password.registry);

		self.registry.add(self.Person.registry);

		//self.registry.readObject();

		//self.registry.onDeserialized();

		self.controller.init();

		_ready = true;
	};

	return self;
	
})(app || {});