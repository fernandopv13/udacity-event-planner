'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class InterfaceHelper
******************************************************************************/

var app = app || {};


/** @classdesc Utility to enable interface-like behaviour in JavaScript.
*
* Must be deployed together with the interface and its implementer(s)/realizer(s).
*
* Assumes that any checking of compliance with interface is handled in unit testing.
*
* @constructor
*
* @author Ulrik H. Gade, January 2016
*/

app.InterfaceHelper = function() {}; // for now, we only need the static method(s)


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Mixes default methods from an interface into a class, unless already overridden by the class or its other ancestors
*
* @param {Function} interface The interface (by function reference) from which to copy default methods. Default methods have the 'default_' prefix.
*
* @param {Function} class The class (by function reference) into which to mix the default methods
*
* @param {Object} instance An instance of the class. Optional: only needed if class cannot be instantiated w/o any params.
*
* @return {Boolean} true if successfull (otherwise throws error)
*
* @throws {TypeError} If not passing in interface and class as function references
*
*/

app.InterfaceHelper.mixInto = function(Func_interface, Func_class, obj_classInstance) { // beginning caps in functions to please jshint
	
	var obj_instance = obj_classInstance ? obj_classInstance : new Func_class(); // pass in instance if cannot be instantiated without params
	
	if (typeof Func_interface !== 'function' || typeof Func_class !== 'function'){
		
		throw new TypeError('Interface and class must be functions');
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