'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class Accessor
******************************************************************************/

var app = app || {};

/** @classdesc Polymorphic method factory for creating inheritable accessors to private properties of calling class
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
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*/

app.Accessor = function(obj_prop, bool_readOnly, obj_type, str_className) {

	// Copy params into local function closure

	var acc_type = obj_type, acc_className = str_className;

	/*----------------------------------------------------------------------------------------
	* Private instance methods
	*---------------------------------------------------------------------------------------*/
	
	// Inner functions that do the actual 'polymorphic' work

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

			console.log(Function_type);

			throw new IllegalArgumentError('Type must be a Class (by function reference)');
		}
	}

	
	/*----------------------------------------------------------------------------------------
	* Other object initialization (using parameter parsing/constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	if (bool_readOnly) { // simple getter; does not need elaborate type checking or error messaging

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
};