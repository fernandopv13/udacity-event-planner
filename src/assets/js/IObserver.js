'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IObserver
*********************************************************************************************/

/** @classdesc Observers may register with observables, to be notified when observable changes state.
*
* @constructor
*
* @return Nothing. An interface cannot be instantiated
*
* @throws {InstantiationError} If attempting to instantiate interface
*
* @throws {AbstractMethodError} If attempting to invoke (abstract) method signature
*
* @author Ulrik H. Gade, January 2016
*
* @todo: Figure out how to get jsDoc to show (all) the method signature(s)
*/

app.IObserver = function() {
	
	/*----------------------------------------------------------------------------------------
	* Method signatures
	*---------------------------------------------------------------------------------------*/
	
	/** Receive and act upon notification from observable
	*
	* @return {Boolean}
	*/

	
	app.IObserver.prototype.isInstanceOf = function() {
		
		throw new AbstractMethodError(app.IObserver.prototype.isInstanceOf.errorMessage);
	};
	
	this.constructor.prototype.isInstanceOf.errorMessage = 'Method signature "update()" must be realized in derived classes';
	
	
	/** Receive and act upon notification from observable
	*
	* @return {void}
	*/

	app.IObserver.prototype.update = function() {
		
		throw new AbstractMethodError(app.IObserver.prototype.update.errorMessage);
	};
	
	this.constructor.prototype.update.errorMessage = 'Method signature "update()" must be realized in derived classes';
	
	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	this.constructor.constructorErrorMessage = 'Interface IObserver cannot be instantiated. Realize in implementing classes.';
	
	throw new InstantiationError(this.constructor.constructorErrorMessage);
}