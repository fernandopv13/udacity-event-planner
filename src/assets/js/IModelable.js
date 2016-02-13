'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IModelable extends IObserable, IObserver, ISerializable
*********************************************************************************************/

/** @classdesc Main interface for the 'M' part of our MVC framework. Holds information about data in the app.
*
* Enables loosely coupled messaging among main MVC collaborators.
*
* Secondary helper objects in the data model (e.g. Email, Password) are exempt from implementing this interface.
*
* (Extension of parent interfaces implemented as mixins in realizing classes, using static method in IInterface.)
*
* @extends IObservable
*
* @extends IObserver
*
* @extends ISerializable
*
* @constructor
*
* @return Nothing. An interface cannot be instantiated
*
* @throws {InstantiationError} If attempting to instantiate interface
*
* @author Ulrik H. Gade, February 2016
*/

app.IModelable = function() {
	
	/*----------------------------------------------------------------------------------------
	* Method signatures
	*---------------------------------------------------------------------------------------*/
	
	/** Update data model in reponse to UI event
	*
	* @param {IModelable} obj Temporary object holding the updated information. Is of same class as Modelable itself.
	*
	* @param {int} id ID of the object to be updated
	*
	* @return {void}
	*
	* @throws {AbstractMethodError} If attempting to invoke directly on interface (abstract method signature)
	*/

	app.IModelable.prototype.update = function(IModelable) {
		
		throw new AbstractMethodError(app.IModelable.prototype.update.errorMessage);
	};
	
	app.IModelable.prototype.update.errorMessage = 'Method signature "update()" must be realized in implementing classes';
	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	app.IModelable.constructorErrorMessage = 'Interface IModelable cannot be instantiated. Realize in implementing classes.';
	
	throw new InstantiationError(app.IModelable.constructorErrorMessage);
}

/*----------------------------------------------------------------------------------------
* Default methods (must be defined outside main function/class body)
*---------------------------------------------------------------------------------------*/

// none so far