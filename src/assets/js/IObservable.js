'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IObservable
*********************************************************************************************/

/** @classdesc Observables may be observed by Observers. When Observables change state, they notify their Observers to update.
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

app.IObservable = function() {
	
	/*----------------------------------------------------------------------------------------
	* Method signatures
	*---------------------------------------------------------------------------------------*/
	
	// None so far
	
	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	this.constructor.constructorErrorMessage = 'Interface IObservable cannot be instantiated. Realize in implementing classes.';
	
	throw new InstantiationError(this.constructor.constructorErrorMessage);
}


/*----------------------------------------------------------------------------------------
* Default methods (must be defined outside main function/class body)
*---------------------------------------------------------------------------------------*/

/** Notifies observers that object state has been changed
*
* @return {Array} Array of IObservers
*/

app.IObservable.prototype.default_notifyObservers = function() {

	this.observers.forEach(function(observer) {

			observer.update(this);
		
		}.bind(this));
};


/** Registers observer
*
* (Method realization required by IObservable.)
*
* @param {IObserver} Object implementing IObserver interface
*
* @return {Boolean} true if succesfull
*
* @throws {IllegalArgumentError} If observer is not an instance of IObserver
*/

app.IObservable.prototype.default_registerObserver = function(IObserver_observer) {

		if (IObserver_observer.isInstanceOf && IObserver_observer.isInstanceOf(app.IObserver)) {

			this.observers.push(IObserver_observer);
		}

		else {

			throw new IllegalArgumentError('Observer must implement IObserver');
		}

		return true;
	};