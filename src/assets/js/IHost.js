'use strict';

var app = app || {}; // create a simple namespace for the app


/***********************************************************
* public Interface IHost
***********************************************************/

/** @classdesc Represents a host for an event. Hosts can be any class implementing the interface, e.g. a Person or an Organization.
*
* @constructor
*
* @return {Error} An interface cannot be instantiated
*
* @author Ulrik H. Gade, January 2016
*
* @todo: Figure out how to get jsDoc to show (all) the method signature(s)
*
*/

app.IHost = function() {
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (signatures)
	*---------------------------------------------------------------------------------------*/
		
	/** Sets or gets name of host (method signature)
	*
	* @param {String} name Name of host (optional, supply when setting)
	*
	* @return Nothing. An interface cannot be instantiated
	*
	* @throws {InstantiationError} If attempting to instantiate interface
	*
	* @throws {AbstractMethodError} If attempting to invoke (abstract) method signature
	**/
	
	this.constructor.prototype.hostName = function () {
		
		throw new AbstractMethodError(app.IHost.prototype.hostName.errorMessage);
	}
	
	this.constructor.prototype.hostName.errorMessage = 'Method signature "hostName()" must be implemented in derived classes';
	
	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	this.constructor.constructorErrorMessage = 'Interface IHost cannot be instantiated. Realize in derived classes.';
	
	throw new InstantiationError(this.constructor.constructorErrorMessage);
}