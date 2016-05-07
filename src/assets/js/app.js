'use strict';

/*
* The app object provides a basic namespace for the application
* and app.init() gets things going when the page has fully loaded.
* 
*
* Please see individual source files, and provided UML diagrams,
* for further details.

/******************************************************************************
* public module app
******************************************************************************/

/** @description Creates a module for the app using the immediately invoked anonymous function pattern. In OO terms, basically a singleton of an anonymous class with no meaningful static members.
*
* @constructor
*
* @return {Object} Top-level singleton (module) providing a simple, encapsulated namespace, as well as module-level functionality, for the app.
*
* @author Ulrik H. Gade, May 2016
*
* @todo Be more consistent about either using public attributes, or private attributes and public accessors
*/

var app = (function(self) {
	
	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/

	var _device = new app.Device(),

	_prefs = { // list of prefs, private so we can control access
		
		defaultEventCapacity: 50,

		defaultToastDelay: 4000, // in ms

		isLocalStorageAllowed: false,	
	
		localStoragePrefix: 'dk.ulrikgade.udacity.srwebdev.meetup-app.',

		locationSearchProvider: new app.FourSquareSearch($(window).width() > 1024 || $(window).height() > 1024 ? 20 : 50) // get max venues on mobile, fewer on desktop (b/c poor scrolling)
	},

	_ready = false, // set true at end of app initialization

	_registry = []; // top level collection of collections of data model objects managed by the app
	
	
	/*----------------------------------------------------------------------------------------
	* Accessors
	*---------------------------------------------------------------------------------------*/

	/** Gets instance of Device utility class collecting data about device, browser and OS in one place */

	self.device = function() {return _device;};

	
	/** Gets the app's ready state (experimental) */

	self.ready = function() {return _ready;}; // public getter for app's ready state

	
	/*----------------------------------------------------------------------------------------
	* public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/

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


		/** Gets default delay (in ms) before hiding 'toast' messages */

		defaultToastDelay: function() {

				return _prefs.defaultToastDelay;
			},

		
		/** Gets or sets permission to store data locally */
		
		isLocalStorageAllowed: function(bool_isAllowed) {
			
			// Router to account, mostly to avoid refactoring of ISerializable

			if (arguments.length > 0) {

				void app.controller.selectedAccount().localStorageAllowed(bool_isAllowed);
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
		},

		
		/** Gets location search provider.
		*
		* Serves as a first step toward decoupling classes using the search provider from the exact provider used,
		*
		* though the full implementation of a LocationSearchProvider interface is currently left for later.
		*/

		locationSearchProvider: function() {

			return _prefs.locationSearchProvider;
		}
	}
		
	
	self.registry = { // allows serialization/deserialization of all the app's data in one fell swoop
		
		//ObjectRegistry class needs named class reference, so cannot be used with anonymous app module
		
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
			
			for (var i = 0, len = localStorage.length, key, className, obj_json, objectClassName; i < len; i++) { // iterate over stored items
				
				key = localStorage.key(i).split('.'); className = key[key.length - 2]; // parse class name
				
				if (className === 'ObjectRegistry') { // read in item if it is an object registry
					
					obj_json = JSON.parse(localStorage.getItem(localStorage.key(i))); // parse to JSON
				
					objectClassName = obj_json._objectClassName; // get name of Model class
					
					app[objectClassName].registry = new app.ObjectRegistry(obj_json._id); // call constructor with single integer param to deserialize registry itself from local storage
					
					app[objectClassName].registry.readObjects(); // deserialize registry contents from local storage
				}
				
				// else: silently ignore non-registry items in local storage
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
			
			self.Password.registry.onDeserialized();

			self.Person.registry.onDeserialized();
		}
	}
	
	/*----------------------------------------------------------------------------------------
	* Other public instance methods
	*---------------------------------------------------------------------------------------*/

	/** Initializes the app on page load, then hands over run time control to the Controller */

	self.init = function() {
		
		if (self.controller.observers().length > 0) { //DEPRECATED: ignore repeated firing of window.onload caused by e.g. navigating between views

			return;
		}

		// Hide progress indicator

		$('#preloader').hide('fast');

		$('#preloader').addClass('hidden');

		$('#preloader').attr('aria-hidden', true); // later, investigate if this could do more of the work of hiding

		
		// Load account data from local storage, if available

			if (window.localStorage) {

				self.registry.readObject();

				self.registry.onDeserialized();
			}

			else {

				Materialize.toast('Could not load account data. Please make sure you have enabled cookies and are not browsing in private mode', module.prefs.defaultToastDelay() + 1000);
			}

		// Set up registries to track created objects (readOject recreates registries so do this last)

			self.registry.add(self.Account.registry);
		
			self.registry.add(self.Email.registry);
			
			self.registry.add(self.Event.registry);
			
			self.registry.add(self.Organization.registry);
			
			self.registry.add(self.Password.registry);

			self.registry.add(self.Person.registry);

				
		self.controller.init();
	};

	return self;
	
})(app || {});