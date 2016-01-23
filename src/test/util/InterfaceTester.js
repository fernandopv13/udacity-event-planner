'use strict'; // Not in functions to make it easier to remove by build process

/*********************************************************************************************
* public class InterfaceTester
*********************************************************************************************/

var app = app || {}; // Create a simple namespace for the app


/** @classdesc Utility class implementing a very simple version of a check for whether a class (function) implements an interface, defined as another class (function) which defines method signatures but throws errors if instantiated, or if methods are invoked. Intended to be included as resource in unit test suite, not to be deployed to production. Accepts static, instance methods, and default methods (prefixed with 'default_').
*
* @constructor
*
* @return {Object} An empty object. For the moment, we're only interested in static members, not instances.
*
* @author Ulrik H. Gade, January 2016
*/

app.InterfaceTester = function() {}; 


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/**
* Checks if one class (function) complies with the interface defined by
* the non-inherited methods of another 'class' (function),
* in both cases using pseudo-classical class notation.
*
* @param {Function} implementer The function that 'claims' to implement the interface
*
* @param {Function} interface The function that defines the interface.
*
* @return {Boolean} true if the implementer implements all the own methods of the interface
*/

app.InterfaceTester.isImplementationOf = function (func_implementer, func_interface) {
	
	
	// Inner function to reuse the control loop
	
	function _doCheck(target, source) {
		
		var testObj =  typeof source === 'function' ? target : new target(); // verify statics against class, others against instance
	
		for (var prop in source) { // Run through the methods defined by the interface
		
			if (typeof source[prop] === 'function' && source.hasOwnProperty(prop)) {
			
				if (prop.substr(0,8).toLowerCase() !== 'default_') { // No requirement to implement default methods
					
					if (!testObj[prop] || typeof testObj[prop] !== 'function') { // False if member either does not exist, or is not a function
						
						throw new Error('Interface method ' + prop + ' not implemented'); // We only need one negative to determine the result
					}
				}
			}
		}
		
		return true;
	}
	
	// Verify implementation using _doCheck helper
	
	return 	_doCheck(func_implementer, func_interface.prototype) && // instance methods defined on prototype
			
			_doCheck(func_implementer, func_interface);  // static methods
};