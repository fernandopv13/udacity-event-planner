'use strict';

var app = app || {}; // create a simple namespace for the app


/***********************************************************
* public Interface IHost
***********************************************************/

/** @classdesc Represents a host for an event. Hosts can be any class implementing the interface, e.g. a Person or an Organization.
*
* @constructor
*
* @return Nothing. An interface cannot be instantiated.
*
* @author Ulrik H. Gade, January 2016
*
* @throws {InstantiationError} If attempting to instantiate.
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
	* @return Nothing. A(n abstract) method signature cannot be invoked.
	*
	* @throws {AbstractMethodError} If attempting to invoke (abstract) method signature
	**/
	
	app.IHost.prototype.hostName = function () {
		
		throw new AbstractMethodError(this.hostName.errorMessage);
	}
	
	this.hostName.errorMessage = 'Method signature "hostName()" must be implemented in derived classes';
	

	/** Tests whether object is an instance of a provided interface (by function reference).
	*
	* Simulates similar functionality in Java, with the aim of achieving loose coupling between collaborating objects
	*
	* (i.e. allows collaborators to only know about the interface, not the class(es) realizing it).
	*
	* @param {Function} interface Reference to the interface we wish to know if this object is an instance of
	*
	* @return Nothing. A(n abstract) method signature cannot be invoked.
	*
	* @throws {AbstractMethodError} If attempting to invoke (abstract) method signature
	**/
	
	app.IHost.prototype.isInstanceOf = function () {
		
		throw new AbstractMethodError(this.isInstanceOf.errorMessage);
	}
	
	this.isInstanceOf.errorMessage = 'Method signature "isInstanceOf()" must be implemented in derived classes';
	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	app.IHost.constructorErrorMessage = 'Interface IHost cannot be instantiated. Realize in derived classes.';
	
	throw new InstantiationError(app.IHost.constructorErrorMessage);
}