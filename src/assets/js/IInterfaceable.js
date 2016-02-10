'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IInterfaceable
*********************************************************************************************/

/** @classdesc Base interface for our Java-like interface mechanism. Guarantees behaviours
* that all classes using using the mechanism must support, and provides utility methods.
*
* @constructor
*
* @return Nothing. An interface cannot be instantiated
*
* @throws {InstantiationError} If attempting to instantiate interface
*
* @author Ulrik H. Gade, February 2016
*/

app.IInterfaceable = function() {
	
	/*----------------------------------------------------------------------------------------
	* Method signatures
	*---------------------------------------------------------------------------------------*/
	
	/** Determines if realizing class implements the interface passed in (by function reference).
	*
	* @param {Function} interface The interface we wish to determine whether the class implements
	*
	* @return {Boolean} instanceof True if class implements interface, otherwise false (when invoked in realizing class)
	*
	* @throws {AbstractMethodError} If attempting to invoke directly on interface itself.
	*/

	app.IInterfaceable.prototype.isInstanceOf = function(IInterfaceable) {
		
		throw new AbstractMethodError('Method signature "isInstanceOf()" must be realized in implementing classes');
	};

	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	throw new InstantiationError('Interface IInterfaceable cannot be instantiated. Realize in implementing classes.');
}

/*----------------------------------------------------------------------------------------
* Default methods (must be defined outside main function/class body)
*---------------------------------------------------------------------------------------*/

// none so far


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Mixes default methods from an interface into a class, unless already overridden by the class or its other ancestors
*
* @param {Function} interface The interface (by function reference) from which to copy default methods. Default methods must have the 'default_' prefix.
*
* @param {Function} class The class (by function reference) into which to mix the default methods
*
* @param {Object} instance An instance of the class. Optional: only needed if class cannot be safely instantiated w/o any params.
*
* @return {Boolean} true if successfull, otherwise throws error
*
* @throws {InvalidArgumentError} If not passing in interface and class as function references
*
* @todo Refactor interface parameter to array to simplify syntax in calling classes
*/

app.IInterfaceable.mixInto = function(Func_interface, Func_class, obj_classInstance) { // beginning caps in functions to please jshint
	
	var obj_instance = obj_classInstance ? obj_classInstance : new Func_class(); // pass in instance if cannot be instantiated without params
	
	if (typeof Func_interface !== 'function' || typeof Func_class !== 'function'){
		
		throw new InvalidArgumentError('Interface and class must be functions');
	}
	
	for (var prop in Func_interface.prototype) {
		
		var prop_popped = prop.substr(8); // remove prefix
		
		if (typeof Func_interface.prototype[prop] === 'function') { // we have a function
			
			if (prop.substr(0,8).toLowerCase() === 'default_') { // it's a default method
				
				if (!obj_instance[prop_popped]) { // method not overridden by class or its ancestors
					
					Func_class.prototype[prop_popped] = Func_interface.prototype[prop]; // mix in method, removing prefix
				}
				
				//else: ignore (do not mix in default method if it has been overriden by implementing class)
			}
		}
	}
	
	return true;
};