'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public abstract class Model implements IObserable, IObserver, ISerializable
*********************************************************************************************/

/** @classdesc Abstract base class for the 'M' part of our MVC framework. Holds information about data in the app.
*
* Enables loosely coupled messaging among main MVC collaborators.
*
* (Interfaces implemented as mixins, using static method in IInterface.)
*
* @implements IInterface
*
* @implements IObservable
*
* @implements IObserver
*
* @constructor
*
* @return {Model} Not supposed to be instantiated, except when extended by subclasses.
*
* @author Ulrik H. Gade, February 2016
*/

app.Model = function() {
	
	/*----------------------------------------------------------------------------------------
	* Factory methods providing inheritable accessors for private class members (through dependency injection)
	*---------------------------------------------------------------------------------------*/
	
	/* Polymorphic factory method for creating inheritable accessors to private properties (values).
	*
	* param {Object} property The property to create an accessor for
	*
	* param {String} type The primitive type required by the property (by the string typeof would return). Optional, provided if type checking is required.
	*
	* param {Function} type Class (by function reference) required by the property. Optional, provided if type checking is required.
	*
	* param {String} className The name of the class required by the accessor, if any. Otherwise not required.
	*
	* return {Function} Accessor method for property. Both sets and gets, always returning the current value.
	*
	* throws {IllegalArgumentError} If one or more parameters are not of the type expected by the signature
	*
	* throws {ReferenceError} If no parameters are provided
	*/

	function Accessor(obj_prop, bool_readOnly, obj_type, str_className) {

		// Copy params into local function closure

		var acc_type = obj_type, acc_className = str_className;

		
		// Define polymorphic inner functions

		function Accessor_(obj_prop) { // basic unified accessor without type checking
			
			return function(obj_val) {

				if (obj_val !== undefined) {

					obj_prop = obj_val;
				}

				return obj_prop; // objects from subclass get their own copy of the private property, and can access it
			}
		}
		
		function Accessor__(obj_prop, str_primitive) { // unified accessor with type checking for primitive types

			if (['boolean', 'number', 'string', 'symbol', 'undefined'].indexOf(str_primitive) > -1) {

				return function(obj_val) {

					if (obj_val !== undefined) {

						if(['boolean', 'number', 'string', 'symbol', 'undefined'].indexOf(typeof obj_val) > -1) {

							obj_prop = obj_val;
						}

						else {

							throw new IllegalArgumentError('Expected JavaScript primitive');
						}
					}

					return obj_prop;
				}
			}

			else {

				throw new IllegalArgumentError('Type must be a JavaScript primitive');
			}
		}

		
		function Accessor___(obj_prop, Function_type, str_className) {  // unified accessor with type checking for complex types (i.e. classes)

			if (typeof Function_type === 'function') {

				if (typeof str_className === 'string') {

					return function(obj_val) {

						if (obj_val !== undefined) {

							if (obj_val.constructor === acc_type || obj_val.isInstanceOf(acc_type)) {

								obj_prop = obj_val;
							}

							else {

								throw new IllegalArgumentError('Expected ' + acc_className);
							}
						}

						return obj_prop;
					}
				}

				else {

					throw new IllegalArgumentError('className must be a String');
				}
			}

			else {

				throw new IllegalArgumentError('Type must be a Class (by function reference)');
			}
		}

		
		// Parse params to invoke the polyphormic responce

			if (bool_readOnly) { // simple getter; does not need elaborate type checking and error messaging

				return function() {

					if (arguments.length > 0) {

						throw new IllegalArgumentError('Property is read-only');
					}

					return obj_prop;
				}
			}

			else if (arguments.length === 2) {

				return new Accessor_(obj_prop);
			}

			else if (arguments.length === 3) {

				return new Accessor__(obj_prop, obj_type);
			}

			else if (arguments.length === 4) {

				 return new Accessor___(obj_prop, obj_type, str_className);
			}

			else {

				throw new ReferenceError('At least two arguments required by Accessor constructor');
			}
	}

	
	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/

	var _className = (this.className ? this.className : 'Model'), // name of this view class (override if provided by subclass constructor)

	_id = (this.id >= 0 ? this.id: undefined), // (int) Unique object ID obtained from object class' registry

	_observers = [], // Array of IObservers receiving updates from this view, required in order to implement IObservable

	_parentList = [app.IInterfaceable, app.IObservable, app.IObserver, app.Model], // list of interfaces implemented by this class (by function reference)
	
	_super = (this.ssuper ? this.ssuper : Object); // reference to immediate parent class (by function) if provided by subclass, otherwise Object 

	
	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields (dependency injection enables access for subclasses)
	*---------------------------------------------------------------------------------------*/

	this.className = new Accessor(_className, true); // replace temporary literal with read-only accessor

	this.id = new Accessor(_id, true);

	this.observers = new Accessor(_observers, true);

	this.parentList = new Accessor(_parentList, true);
	
	this.ssuper = new Accessor(_super, true); // 'super' may be a reserved word, so slight name change
	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	// none so far
}


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IInterfaceable, app.Model);

void app.IInterfaceable.mixInto(app.IObservable, app.Model);

void app.IInterfaceable.mixInto(app.IObserver, app.Model);

void app.IInterfaceable.mixInto(app.ISerializable, app.Model);


/*----------------------------------------------------------------------------------------
* Abstract public instance methods
*---------------------------------------------------------------------------------------*/

/** Update data model in reponse to UI event
*
* @param {Model} obj Temporary object holding the updated information. Is of same class as Modelable itself.
*
* @param {int} id ID of the object to be updated
*
* @return {void}
*
* @throws {AbstractMethodError} If attempting to invoke directly on interface (abstract method signature)
*/


/*----------------------------------------------------------------------------------------
* Public instance methods (implemented, on prototype)
*---------------------------------------------------------------------------------------*/


/** Returns true if class is or extends the class, or implements the interface, passed in (by function reference)
*
* (See IInterfaceable for further documentation.)
*/

app.Model.prototype.isInstanceOf = function (func_interface) {
	
	return this.parentList().indexOf(func_interface) > -1;
};


/** Does housekeeping common to all Models after updating themselves, 
*
* i.e. autosaves (if enabled), notifies observers, registers with controller, and destroys temporary data object.
*/

app.Model.prototype.update = function(Model_obj) {

	// Remove references to tmp object (to mark for garbage collection, preventing memory leak)

	this.constructor.registry.remove(Model_obj);

	Model_obj = undefined;
	

	// Write new state to local storage, if available

	var account = app.controller.selectedAccount();

	if (account.localStorageAllowed() && window.localStorage) {

		this.writeObject();

		//console.log(JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + this.className() + '.' + this.id())));
	}


	// Register controller as observer of object (auto-skips if already registered)

	this.registerObserver(app.controller);


	// Notify observers (i.e. controller)

	this.notifyObservers(this);
}