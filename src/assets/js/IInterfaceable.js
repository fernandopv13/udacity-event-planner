'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IInterfaceable extends IObserable, IObserver
*********************************************************************************************/

/** @classdesc Guarantees behaviours that all classes using our custom, Java-like interface
*mechanism must support. 
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
	
	/** Returns true if realizing class implements the interface passed in (by function reference).
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