'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IViewable
*********************************************************************************************/

/** @classdesc Presents information in the UI.
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

app.IViewable = function() {
	
	/*----------------------------------------------------------------------------------------
	* Method signatures
	*---------------------------------------------------------------------------------------*/
	
	/** (Re)render on demand
	*
	* @return {void}
	*/

	app.IViewable.prototype.render = function() {
		
		throw new AbstractMethodError(app.IViewable.prototype.render.errorMessage);
	};
	
	this.constructor.prototype.render.errorMessage = 'Method signature "render()" must be realized in derived classes';
	
	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	this.constructor.constructorErrorMessage = 'Interface IViewable cannot be instantiated. Realize in implementing classes.';
	
	throw new InstantiationError(this.constructor.constructorErrorMessage);
}