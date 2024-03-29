'use strict';

var app = app || {}; // create a simple namespace for the app

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/***********************************************************
	* public Interface ISerializable
	***********************************************************/

	/** @classdesc Represents an interface for classes that can be serialized for local or remote storage.
	*
	* Provides default methods that do most of the heavy lifting of object serialization and deserialization.
	*
	* Inspired by, but not a direct copy of, the similar Java API.
	*
	* @interface
	*
	* @return Nothing. An interface cannot be instantiated.
	*
	* @throws {InstantiationError} If attempting to instantiate interface
	*
	* @throws {AbstractMethodError} If attempting to invoke (abstract) method signature
	*
	* @author Ulrik H. Gade, January 2016
	*
	* @todo Get rid of the discrete error messages and just throw an error with that message (requires updating unit tests as well).
	*/

	module.ISerializable = function() {
		
		/*----------------------------------------------------------------------------------------
		* Method signatures
		*---------------------------------------------------------------------------------------*/
		
		/** Gets name of object's class.
		*
		* Inherited methods do not have access to private members, so can't provide default.
		*
		* @abstract
		*
		* @return {String} name Object's class name as string. Must evaluate to valide function as property of app.
		*/
		
		module.ISerializable.prototype.className = function() {
			
			throw new AbstractMethodError(module.ISerializable.prototype.className.errorMessage);
		}
		
		module.ISerializable.prototype.className.errorMessage = 'Method signature "className()" must be realized in derived classes';
		
		
		/** Gets object's unique id.
		*
		* Inherited methods do not have access to private members, so can't provide default method.
		*
		* @abstract
		*
		* @return {int} ID Object's unique ID (by class)
		*/
		
		module.ISerializable.prototype.id = function() {
			
			throw new AbstractMethodError(module.ISerializable.prototype.id.errorMessage);
		}
		
		module.ISerializable.prototype.id.errorMessage = 'Method signature "id()" must be realized in derived classes';
		

		/** Converts object to JSON object
		*
		* @abstract
		*
		* @return {Object} JSON object representation of person (used to override default behaviour of JSON.stringify())
		*/
		
		module.ISerializable.prototype.toJSON = function() {
			
			throw new AbstractMethodError(module.ISerializable.prototype.toJSON.errorMessage);
		}
		
		module.ISerializable.prototype.toJSON.errorMessage = 'Method signature "toJSON()" must be realized in derived classes';
		
		
		/** Re-establishes references to complex members after they have been deserialized
		*
		* @abstract
		*/
		
		module.ISerializable.prototype.onDeserialized = function() {
			
			throw new AbstractMethodError(module.ISerializable.prototype.onDeserialized.errorMessage);
		}
		
		module.ISerializable.prototype.onDeserialized.errorMessage = 'Method signature "onDeserialized()" must be realized in derived classes';
			
		
		/*----------------------------------------------------------------------------------------
		* Block instantiation
		*---------------------------------------------------------------------------------------*/
			
		module.ISerializable.constructorErrorMessage = 'Interface ISerializable cannot be instantiated. Realize in derived classes.';
		
		throw new InstantiationError(module.ISerializable.constructorErrorMessage);
	}



	/*----------------------------------------------------------------------------------------
	* Default methods (must be defined outside main function/class body)
	*---------------------------------------------------------------------------------------*/

	/** Desirializes object from JSON in local storage. Expected to be called from within constructor of class implementing ISerializable when invoked with a single, integer parameter. Does most of the work of re-instantiation, loosely in the style of the similarly named Java Serialize API method.
	*
	* Automatically parses primitive private attributes in JSON that have unified standard accessors. Re-referencing of more complex objects has to wait until this process has completed for all serializable classes in the app, making the objects available in memory.
	*
	* Assumptions made: Private attribute names are prefixed with a single underscore (e.g. '_privateAttr'). Standard accessors have the same name as the attribute they set, except for removing any leading underscore (e.g. 'privateAttr()'). They can both set and get the value of the attribute (hence 'unified'), and manage basic validation and error handling.
	*
	* @param {Array} exclusions An optional array of the (string) names of properties this method should ignore, leaving the calling class itself to handle their instantiation.
	*
	* @return {Object} JSON representation of object if successful, otherwise throws error.
	*
	* @throws {ReferenceError} If local storage is not available on this device (and the polyfill has also failed)
	*
	* @throws {IllegalAccessError} If user has not given the app permission to use local storage
	*
	* @throws {ReferenceError} If no item matching the object (by id) is found in local storage
	*
	* @throws {TypeError} If JSON object has the wrong class.
	*
	* @throws {ReferenceError} If JSON does not have an id
	*
	* @throws {TypeError} If id in JSON is not an integer
	*
	* @throws {RangeError} If id in JSON is negative
	*
	* @throws {ReferenceError} If id in JSON does not match object's id
	*
	* @todo Minimize the need for the exclusions array in the calling classes
	*
	* @todo Add handling of public, as well as private, attributes
	*/

	module.ISerializable.prototype.default_readObject = function(arr_exclusions) {

		// Check if localStorage is available
		
		if (!window.localStorage) {throw new ReferenceError('localStorage not available');}
		
		if (!module.prefs.isLocalStorageAllowed()) {throw new IllegalAccessError('Use of local storage not allowed by user');}
		
		
		// Read in JSON from local storage
		
		var obj_json = (function readJSON() {// Inner function merely for stylistic purposes during coding

			try { // not sure exactly what failure here looks like ...
				
				obj_json = JSON.parse(localStorage.getItem(module.prefs.localStoragePrefix() + this.className() + '.' + this.id()));
			}
			
			catch(e) { // ...so, for now, just bubble up the native error
				
				throw e;
			}
			
			return obj_json;
			
		}.bind(this))();
			
		
		// Verify JSON
		
		(function verifyJSON() { // Inner function merely for stylistic purposes during coding
			
			// Check that read was succesful
			
			if (obj_json === null) { // localStorage.getItem() returns null if no object found
				
				throw new ReferenceError('Object not found in local storage');
			}
			
			
			// Verify that JSON object is instance of the correct class

			if (obj_json._className !== this.className()) {throw new TypeError('Wrong class "' + obj_json._className + '": Expected ' + this.className());}

			
			// Verify that JSON object has a valid id

			if (typeof obj_json._id === 'undefined') { // id does not exist
				
				throw new ReferenceError('Cannot re-instantiate object: ID not defined');
			}
				
			else if (parseInt(obj_json._id) !== obj_json._id) { // id is not an integer
					
				throw new TypeError('Cannot re-instantiate object: ID must be an integer');
			}
			
			else if (obj_json._id < 0) { // id is negative
				
				throw new RangeError('Cannot re-instantiate object: ID must be greater than or equal to zero');
			}
			
			else if (obj_json._id !== this.id()) { // id is different from that passed in by caller
				
				throw new ReferenceError('ID mismatch: ' + this.id() + ' does not equal ' + obj_json._id);
			}
			
		}.bind(this))();
		

		// Parse JSON properties into new object instance (assumes JSON has been verified)
		
		(function parseJSON(obj_json, arr_exclusions) { // Inner function merely for stylistic purposes during coding
		
			var exclusions = arr_exclusions || []; exclusions.push('_className');  exclusions.push('_id');
			
			//console.log(obj_json);

			for (var prop in obj_json) {
				
				if (exclusions.indexOf(prop) === -1) { // skip props in exclusions list
				
					// call accessor (assumed have same name as property, except popping leading underscore)
					
					//console.log(prop);

					this[prop.slice(1)](obj_json[prop]);
				}
				
				// else: in exclusion list, leave for custom logic to sort out
			}
			
			return true;
			
		}.bind(this))(obj_json, arr_exclusions);
		
		
		// Return JSON
		
		return obj_json; // caller may need to do custom post-processing of excluded properties, so return data
	}


	/** Removes object from local storage
	*
	* @return {Boolean} true if succesful, otherwise throws error
	*
	* @throws {ReferenceError} If local storage is not available on this device (and the polyfill has also failed)
	*
	* @throws {IllegalAccessError} If user has not given the app permission to use local storage
	*/

	module.ISerializable.prototype.default_removeObject = function() {

		if (!window.localStorage) {throw new ReferenceError('localStorage not available');}
		
		if (!module.prefs.isLocalStorageAllowed()) {throw new IllegalAccessError('Use of local storage not allowed by user');}
		
		
		try { // not sure what might fail here...
			
			localStorage.removeItem(module.prefs.localStoragePrefix() + this.className() + '.' + this.id());
		}
		
		catch(e) { // ...so, for now, just bubble up the native error
			
			throw e;
		}
		
		return true
	}


	/** Writes object to local storage
	*
	* @return {Boolean} true if successful, otherwise throws error
	*
	* @throws {ReferenceError} If local storage is not available on this device (and the polyfill has also failed)
	*
	* @throws {IllegalAccessError} If user has not given the app permission to use local storage
	*
	* @throws {TypeError} If caller does not provide a valid class name, or if object contains a circular reference.
	*
	* @throws {RangeError} If object contains circular reference to itself.
	*/

	module.ISerializable.prototype.default_writeObject = function() {

		if (!window.localStorage) {throw new ReferenceError('localStorage not available');}
		
		if (!module.prefs.isLocalStorageAllowed()) {throw new IllegalAccessError('Use of local storage not allowed by user');}
		
		if (![this.className()] || typeof app[this.className()] !== 'function') {throw new TypeError('Invalid class: ' + this.className());}
		
		if (typeof this.id() === 'undefined' || this.id() !== parseInt(this.id()) || this.id() < 0) {throw new RangeError('Invalid ID: ' + this.id());}
		
		try { // several things may fail here...
			
			localStorage.setItem(module.prefs.localStoragePrefix() + this.className() + '.' + this.id(), JSON.stringify(this));
		}
		
		catch(e) { // not crazy about this interface communicating directly in the UI, but will have to do for now
			
			Materialize.toast('There was a problem saving your event. Are you in private/incognito mode? Try non-private browsing instead.', 5000);
		}
		
		return true;
	}

})(app);