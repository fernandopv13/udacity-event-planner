'use strict';

var app = app || {}; // create a simple namespace for the app

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/***********************************************************
	* public class ObjectRegistry implements ISerializable
	***********************************************************/

	/** @classdesc Keeps track of the objects created of a class, to help avoid duplication when serializing objects for local or remote storage. Can only hold objects of a single class, or its ancestors.
	*
	* @implements ISerializable
	*
	* @constructor
	*
	* @param {Function} classReference The type of object tracked by the registry (by function reference)
	*
	* @param {String} className The type of object tracked by the registry (by simple class name)
	*
	* @return {ObjectRegistry} A utility for other classes, providing unique, zero indexed object IDs while the app is runnning
	*
	* @author Ulrik H. Gade, May 2016
	*
	* @todo Reassess whether registry should accept instances of ancestors to primary target class
	*/

	module.ObjectRegistry = function(func_objectConstructor, str_objectClassName) {
		
		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
		// Any strong typing is enforced by the setter methods.
			
		var _className = 'ObjectRegistry',
		
		_id = module.ObjectRegistry.count++, // (int) Unique person ID obtaining from ObjectRegistry object registry
		
		_objectList = {}, // (Object) A collection of the objects the registry keeps track of
		
		_objectCount = 0, // (int) The number of objects add to the collection (does not decrement when removing items)
		
		_objectConstructor, // (Function) The type of object tracked by the registry (by reference).
		
		_objectClassName; // (String) The type of object tracked by the registry (by name).
		
			
		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields
		*---------------------------------------------------------------------------------------*/
		
			/** Gets name of object's class. Class name is read-only.
			*
			* (Method realization required by ISerializable.)
			*
			* @return {String} name The name of the object's class
			*	
			* @throws {Error} If called with one or more parameters (so mistake is easily detectable)
			*/
			
			this.className = function () {
				
				if(arguments.length === 0) { return _className;}
				
				else {
					
					throw new IllegalArgumentError('Illegal parameter: className is read-only');
				}
			};
			
			
			/** Gets unique object ID. ID can only be set from within the object itself.
			*
			* (Method realization required by ISerializable.)
			*
			* @return {int} An integer, if called with no parameters
			*	
			* @throws {Error} If called with one or more parameters (so mistake is easily detectable)
			*/
			
			this.id = function () {
				
				if(arguments.length === 0) { return _id;}
				
				else {
					
					throw new IllegalArgumentError('Illegal parameter: id is read-only');
				}
			};
			
			
			/** Gets class name the objects held in this registry. Object class name is read-only.
			*
			* @return {String} name The class name of the objects held in this registry
			*	
			* @throws {Error} If called with one or more parameters (so mistake is easily detectable)
			*/
			
			this.objectClassName = function () {
				
				if(arguments.length === 0) { return _objectClassName;}
				
				else {
					
					throw new IllegalArgumentError('Illegal parameter: objectClassName is read-only');
				}
			};
			
			
			/** Clears contents of registry */
			
			this.clear = function() {
				
				//for (var prop in _objectList) {delete _objectList[prop];}
				
				_objectList = {};
				
				_objectCount = 0;
			}
			
			
			/** Gets next unique object ID
			*
			* @return {int} The next free object ID. IDs are incremented at each successful call to the add() method. They may evolve to bear no relation to the actual number of objects existing at any one time.
			*/
			
			this.getNextId = function() {return _objectCount++;};
			

			/** Gets a reference to an object in the registry by its ID
			*
			* @param {int} id The ID of the object to get.
			*
			* @return {Object} A reference to the object with the ID, or null if not in registry
			*/
			
			this.getObjectById = function(id) {
			
				if (_objectList[id]) {

					return _objectList[id];
				}

				else {

					return null;
				}
			}
			
			
			/** Gets a reference to an object in the registry by the value of an attribute
			*
			* @param {String} name The attribute name by which to get the object. Expected to be accessor method if attribute is private.
			*
			* @param {Object} val The value of the attribute by which to get the object. Can by any legal JS type.
			*
			* @return {Object} A reference to the object with the ID, or null if not in registry.
			*/
			
			this.getObjectByAttribute = function(str_name, obj_val) {
			
				var obj, val;
				
				for (var id in _objectList) {
					
					obj = _objectList[id];
					
					for (var prop in obj) {
						
						if (prop === str_name) {
							
							val = typeof obj[prop] === 'function' ? obj[prop]() : obj[prop];
							
							if (val === obj_val) {
								
								return obj;
							}
						}
					}
				}
				
				return null;
			}
			

			/** Gets list of objects in the registry */
			
			this.getObjectList = function() {return _objectList};
			
			
			/** Gets the type (class) of objects required by the registry (by function reference) */
			
			this.type = function() {return _objectConstructor;};
			
			
		/*----------------------------------------------------------------------------------------
		* Public instance methods (beyond accessors)
		*---------------------------------------------------------------------------------------*/
		
			/** Adds an object to the registry
			*
			* @param {Object} obj An instance of the class the registry was created to hold
			*
			* @return {Boolean} true if object is added successfully, otherwise undefined
			*
			* @throws {RangeError}  If object does not provide an id() method that returns a non-negative integer
			*
			* @throws {TypeError} If object is of the wrong class for this registry
			*
			* @throws {Error}  If object is a duplicate of an existing object in the registry (as per id)
			*/

			this.add = function(obj) {
				
				//if (obj.constructor === _objectConstructor) {

				if (obj instanceof _objectConstructor) {
					
					if (obj.id && typeof obj.id === 'function' && obj.id() === parseInt(obj.id()) && obj.id() > -1) {
				
						if (!_objectList[obj.id()]) {
							
							_objectList[obj.id()] = obj
							
							_objectCount = _objectCount <= obj.id() ? obj.id() + 1 : _objectCount;
						}
						
						else {
							
							throw new IllegalArgumentError('Object with same id is already in registry');
						}
					}
					
					else {
						
						throw new RangeError('Object must support a id() method that returns a non-negative integer');
					}
				}
				
				else {
					
					throw new TypeError('Wrong type for this registry: Expected ' + _objectClassName);
				}
				
				return true;
			}
			
			
			/** Re-establishes references to complex members after they have been deserialized.
			*
			* (Method realization required by ISerializable.)
			*/
			
			this.onDeserialized = function() {
				
				for (var prop in _objectList) {
					
					_objectList[prop].onDeserialized();
				}
				
				return true;
			}
			
				
			/** Reads (deserializes) registry object itself from local storage */
			
			this.readObject = function() {
				
				// Reset registry contents
				
				this.clear();
				
				
				// Call default method
				
				var obj_json = module.ISerializable.prototype.default_readObject.call(this,['_objectList','_objectCount', '_objectConstructor','_objectClassName']);
				
				
				// Set attributes that require custom treatment
				
				_objectClassName = obj_json._objectClassName;
				
				_objectConstructor = app[_objectClassName];
				
				_objectList = obj_json._objectList;
				
				
				// Tried re-instantiating the objects inside the registry constructor, too,
				// but it doesn't work in testing (probably too early to do it during instantiation)
				
				return obj_json;
			}
			
			
			/** Reads (deserializes) registry contents from local storage.
			*
			* Clears and recreates object list from scratch to make sure every Model in storage is retrieved,
			*
			* whether or not the entire registry has been written out in one go. This should make storage
			*
			* robust against users leaving the app in ways that don't trigger a complete save
			*
			* (Models save themselves continously when changes are submitted).
			*
			* (Doing this during registry instantiation would be neat, but it doesn't work.)
			*/
			
			this.readObjects = function() {
				
				// Retrieve and re-instantiate registry contents (by calling constructor with the id).
				// Constructor automatically adds new instance to the registry.
			
				var objList = _objectList; // get a reference to the collection of object placeholders
				
				this.clear(); // clear out _objectList (else add() will refuse to add the actual objects b/c they have the same ids)
				
				/*
				for (var prop in objList) { // call constructor with id to make it re-instantiate the object from storage
					
					void new app[objList[prop]._className](objList[prop]._id);
				}
				*/

				for (var i = 0, len = localStorage.length, key, className, id, obj_json; i < len; i++) { // iterate over stored items
					
					key = localStorage.key(i).split('.'); className = key[key.length - 2]; // parse class name

					if (className === _objectClassName) { // read in item if it is the correct type for this registry

						id = JSON.parse(localStorage.getItem(localStorage.key(i)))._id; // get id

						void new app[_objectClassName](id); // create new object
					}
				}
			};
			
			
			/** Removes an object from the registry (by id)
			*
			* @return {Object} obj The object that was removed, or null if the object was not found in the registry
			*/
			
			this.remove = function(obj) {
				
				if (obj.constructor === _objectConstructor) {
				
					if (obj.id && typeof obj.id === 'function' && obj.id() === parseInt(obj.id()) && obj.id() > -1) {
						
						var id = obj.id();
						
						if (typeof _objectList[id] !== 'undefined') {
							
							var ret = _objectList[id];
							
							delete _objectList[id]; // remove object from list

							// _objectCount does not decrement, as id assignment relies on it always holding the next id
							
							return ret;
						}
					}
					
					else {
						
						throw new RangeError('Object must support a id() method that returns a non-negative integer');
					}
				}
				
				else {
					
					throw new TypeError('Wrong type for this registry');
				}
				
				return null;
			}
			
			
			/** Converts registry contents to JSON objects
			*
			* (Method realization required by ISerializable.)
			*
			* @return {Object} JSON object representation of registry and its object list (used to override default behaviour of JSON.stringify())
			*/
			
			this.toJSON = function () { // we need private access so no prototype inheritance here
				
				// For now, all we need is to return the object list as JSON.
				// There's no need to serialize the registry itself; it can easily
				// be recreated from scratch when desiralizing the actual objects
				// (just make sure to set the object counter to above the largest id)
				
				var list = {};
				
				for (var prop in _objectList) { // generate a list of JSON object placeholders
					
					list[prop] = {_className: _objectList[prop].className(), _id: _objectList[prop].id()};
				}
				
				return {
					
					_className: 'ObjectRegistry',
					
					_id: _id ,
					
					_objectClassName: _objectClassName,
					
					_objectCount: _objectCount,

					_objectList: list
				};
			};
			
			
			/** Writes (serializes) registry and its contents to local storage */
			
			this.writeObject = function() {
				
				// Store registry object itself, calling default method as if own method
				
				module.ISerializable.prototype.default_writeObject.call(this);
				
				
				// Store registry contents
				
				for (var prop in _objectList) {
					
					_objectList[prop].writeObject();
				}
				
				return true;
			}
			
		/*----------------------------------------------------------------------------------------
		* * Parameter parsing (constructor 'polymorphism')
		*---------------------------------------------------------------------------------------*/

			// Single param that is integer => deserialize from local storage

			if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
				
				// Reset original ID (expected by readObject())
			
				_id = arguments[0];
				
				
				// Read in JSON from local storage
				
				var obj_json = this.readObject(['_objectList','_objectCount', '_objectConstructor','_objectClassName']);
			}
			
			
			// Normal instantiation
			
			else if (arguments.length > 1)  {
				
				if (typeof func_objectConstructor === 'function') { // constructor is a function reference
					
					if(app[str_objectClassName] && app[str_objectClassName] === func_objectConstructor) { // class name and function match
				
						_objectConstructor = func_objectConstructor;
						 
						_objectClassName = str_objectClassName;
					}
					
					else {
						
						throw new ReferenceError('Class name does not match constructor');
					}
				}
			
				else {
					
					throw new ClassNotFoundError('Constructor must be a function reference');
				}
			}
			
			// Zero args is special case needed when mixing in interface methods, so simply ignored here
		}


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/

		module.ObjectRegistry.count = 0;

	/*----------------------------------------------------------------------------------------
	Mix in default methods from implemented interfaces, unless overridden by class or ancestor
	*---------------------------------------------------------------------------------------*/

		void module.IInterfaceable.mixInto(module.ISerializable, module.ObjectRegistry);

})(app);