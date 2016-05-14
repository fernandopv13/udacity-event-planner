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
*
* @todo Rewrite as proper class (e.g. "Main"), then instantiate as singleton
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

		_registry = [];  // top level collection of collections of data model objects managed by the app

	
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
				
				// Route request to active account, if available, else use app level pref

				if (arguments.length > 0) {

					if (typeof bool_isAllowed === 'boolean') { // param is boolean, so set
					
						var tmp = app.controller.selectedAccount() ? app.controller.selectedAccount().localStorageAllowed(bool_isAllowed) : _prefs.isLocalStorageAllowed = bool_isAllowed;
					}
					
					else {
						
						throw new IllegalArgumentError('Expected Boolean');
					}	
				}

				return  app.controller.selectedAccount() ? app.controller.selectedAccount().localStorageAllowed() : _prefs.isLocalStorageAllowed;
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
				
				_registry.forEach(function(reg) {reg.clear();}); // clear invididual class registries

				_registry = []; // clear app registry
			},
			
			getObjectList: function() {return _registry},

			onDeserialized: function() { // re-establish references between objects after they have been read in
			
				//_registry.forEach(function(reg, self) {console.log(reg.objectClassName());reg.onDeserialized()});
				
				//for (var i = 0, len = _registry.length; i < len; i++) {_registry[i].onDeserialized();}
				
				
				// loops don't work (registries' onDeserialized() don't see the objects), so going manual
				
				/* DEPRECATED: Remove after verifying current code on iOS
				self.Account.registry.onDeserialized();
		
				self.Email.registry.onDeserialized();
				
				self.Event.registry.onDeserialized();
				
				self.Organization.registry.onDeserialized();
				
				self.Password.registry.onDeserialized();

				self.Person.registry.onDeserialized();
				*/

				['Account', 'Email', 'Event', 'Organization', 'Password', 'Person'].forEach(function(klass) {

					self[klass].registry.onDeserialized();
				});
			},

			readObject: function() { // read app data (in class registries) in from local storage
				
				// Re-instantiate all objects of every class

				var backup = this.toJSON(); // store a backup of existing data in case reading from local storage fails

				try { // read in data from local storage

					this.clear(); // clear app and Model registries
					
					for (var i = 0, len = localStorage.length, key, className, obj_json, objectClassName; i < len; i++) { // iterate over stored items
						
						key = localStorage.key(i).split('.'); className = key[key.length - 2]; // parse class name
						
						if (className === 'ObjectRegistry') { // read in item if it is an object registry
							
							obj_json = JSON.parse(localStorage.getItem(localStorage.key(i))); // parse to JSON
						
							objectClassName = obj_json._objectClassName; // get name of Model class

							app[objectClassName].registry = new app.ObjectRegistry(obj_json._id); // call constructor with single integer param to deserialize registry itself from local storage
							
							app[objectClassName].registry.readObjects(); // deserialize registry contents from local storage

							//_registry.push(app[objectClassName].registry); // add to app registry
						}

						// else: silently ignore non-registry items in local storage
					}

					// Re-establish app registry

					['Account', 'Email', 'Event', 'Organization', 'Password', 'Person'].forEach(function(klass) {

						_registry.push(self[klass].registry);
					});

					/* DEPRECATED: Remove after verifying current code on iOS
					_registry.push(self.Account.registry);

					_registry.push(self.Email.registry);

					_registry.push(self.Event.registry);

					_registry.push(self.Organization.registry);

					_registry.push(self.Password.registry);

					_registry.push(self.Person.registry);
					*/
				}

				catch(e) { // reading failed, re-establish data from backup

					console.log(e);

					this.clear(); // clear all registries to avoid duplication

					for (var prop in backup) { // iterative over every Model in backup

						var json = backup[prop],

						className = json._className;

						if (className !== 'ObjectRegistry') { // skip object registries (already exist)

							var obj = new self[className](); // create new Model object

							for (var ix in json) { // copy data from backup into new object

								var attr = ix.slice(1); // trim leading underscore

								if (attr !== 'className' // skip attribute unless function other than className and id accessors

									&& attr !== 'id'

									&& typeof obj[attr] === 'function'

									&& typeof json[ix] !== 'undefined') {

									void obj[attr](json[ix]);
								}
							}
						}
					}

					this.onDeserialized(); // re-establish object references
				}

				backup = null; // free up JSON object for garbage collection
			},

			toJSON: function() { // convert app data to JSON object using same format as that written to local storage (except not stringified)

				var obj_json = {};

				['Account', 'Email', 'Event', 'Organization', 'Password', 'Person'].forEach(function(klass) {

					var registry = self[klass].registry, objectList = registry.getObjectList();

					obj_json[_prefs.localStoragePrefix  + 'ObjectRegistry.' + self[klass].registry.id()] = registry.toJSON();

					for (var prop in objectList) {

						obj_json[_prefs.localStoragePrefix + klass + '.' + objectList[prop].id()] = objectList[prop].toJSON();
					}
				});

				return obj_json;
			},
			
			writeObject: function() { // write app data (in class registries) out to local storage
				
				if (!window.localStorage) {throw new ReferenceError('localStorage not available');}
		
				if (!app.prefs.isLocalStorageAllowed()) {throw new IllegalAccessError('Use of local storage not allowed by user');}
		
				localStorage.clear(); // clear out any crud
				
				for (var i = 0, len = _registry.length; i < len; i++) {_registry[i].writeObject()}
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

				_prefs.isLocalStorageAllowed = true; // temporarily override default so we can read in app (account) data

				self.registry.readObject();

				self.registry.onDeserialized();

				_prefs.isLocalStorageAllowed = false; // reset default
			}

			else {

				Materialize.toast('Could not load account data. Please make sure you have enabled cookies and are not browsing in private mode', module.prefs.defaultToastDelay() + 1000);
			}

			// register Model registries

		self.controller.init();
	};

	return self;
	
})(app || {});