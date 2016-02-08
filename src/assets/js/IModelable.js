'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IModelable extends IObserable, IObserver
*********************************************************************************************/

/** @classdesc Holds information about data in the app.
*
* Extension of IObservable and IObserver implemented as mixins in realizing classes, using interfaceHelper.js.
*
* @extends IObservable
*
* @extends IObserver
*
* @constructor
*
* @return Nothing. An interface cannot be instantiated
*
* @throws {InstantiationError} If attempting to instantiate interface
*
* @author Ulrik H. Gade, February 2016
*
* @todo: Figure out how to get jsDoc to show (all) the method signature(s)
*/

app.IModelable = function() {
	
	/*----------------------------------------------------------------------------------------
	* Method signatures
	*---------------------------------------------------------------------------------------*/
	
	/** Update data held by object
	*
	* @param {IModelable} obj Reference to temporary object whose data the object is to be updated with.
	*
	* @return {void}
	*
	* @throws {AbstractMethodError} If attempting to invoke (abstract method signature)
	*/

	app.IModelable.prototype.update = function(IModelable) {
		
		throw new AbstractMethodError(app.IModelable.prototype.update.errorMessage);
	};
	
	this.constructor.prototype.update.errorMessage = 'Method signature "update()" must be realized in implementing classes';
	
	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	this.constructor.constructorErrorMessage = 'Interface IModelable cannot be instantiated. Realize in implementing classes.';
	
	throw new InstantiationError(this.constructor.constructorErrorMessage);
}

/*----------------------------------------------------------------------------------------
* Default methods (must be defined outside main function/class body)
*---------------------------------------------------------------------------------------*/

/** Tests if object implements IModelable
*
* Default method for IModelables that only need to be able to report that they are indeed IModelables.
*
* Override in realizing classes if more advanced behaviour is required.
*
* @param {Function} interface The interface we wish to determine if this object implements
*
* @return {Boolean} true if object implements interface, otherwise false
*/

app.IModelable.prototype.default_isInstanceOf = function (Function_interface) {
	
	return Function_interface === app.IModelable;
};