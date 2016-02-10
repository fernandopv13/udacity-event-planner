'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IModelable extends IObserable, IObserver, ISerializable
*********************************************************************************************/

/** @classdesc Main interface for the 'M' part of our MVC framework. Holds information about data in the app.
*
* For now, just an empty placeholder enabling loosely coupled messaging among MVC collaborators.
*
* Extension of parent interfaces implemented as mixins in realizing classes, using static method in IInterface.
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
	
	// none so far
	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	this.constructor.constructorErrorMessage = 'Interface IModelable cannot be instantiated. Realize in implementing classes.';
	
	throw new InstantiationError(this.constructor.constructorErrorMessage);
}

/*----------------------------------------------------------------------------------------
* Default methods (must be defined outside main function/class body)
*---------------------------------------------------------------------------------------*/

// none so far