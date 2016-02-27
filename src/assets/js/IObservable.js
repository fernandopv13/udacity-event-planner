'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IObservable
*********************************************************************************************/

/** @classdesc Observables may be observed by Observers. When Observables change state, they notify their Observers to update. Expects implementing classes to define public 'observers' array.
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
* @todo: Refactor to expect accessor method for private observers collection,
* rather than directly accessing a public observers attribute.
*/

app.IObservable = function() {
	
	/*----------------------------------------------------------------------------------------
	* Abstract method signatures
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

/** Notifies observers of some change to Observable
*
* @param Method is agnostic about invoking signature: It simply passes on whichever parameters it receives.
*
* @return void
*/

app.IObservable.prototype.default_notifyObservers = function() {

	var args = arguments;

	//var observers = typeof this.observers === 'function' ? this.observers() : this.observers;

	this.observers().forEach(function(observer) {

		observer.update(args);

		
		/*
		Object_obj = Object_obj ? Object_obj : this;

		if (arguments.length > 1) { // id present

			observer.update(Object_obj, int_objId);
		}

		else {

			observer.update(Object_obj);
		}
		*/

		
		
	});//.bind(this));
};


/** Registers observer
*
* @param {IObserver} Object implementing IObserver interface
*
* @return {Boolean} The removed object if succesfull, otherwise null
*
* @throws {IllegalArgumentError} If observer is not an instance of IObserver
*/

app.IObservable.prototype.default_registerObserver = function(IObserver_observer) {

	//var observers = typeof this.observers === 'function' ? this.observers() : this.observers;

	if (IObserver_observer.isInstanceOf && IObserver_observer.isInstanceOf(app.IObserver)) {

		if (this.observers().indexOf(IObserver_observer) < 0) { // skip duplicates

			this.observers().push(IObserver_observer);
		}

		else {

			return null; // duplicate, not added
		}
	}

	else {

		throw new IllegalArgumentError('Observer must implement IObserver');
	}

	return IObserver_observer; // add succesful
};


/* Removes observer
*
* @param {IObserver} observer Object implementing IObserver interface
*
* @return {IObserver} The removed object if succesfull, otherwise null
*
* @throws {IllegalArgumentError} If observer is not an instance of IObserver
*
* @todo: Recursively remove duplicates, avoiding infinite loop
*/

app.IObservable.prototype.default_removeObserver = function(IObserver_observer) {

	//var observers = typeof this.observers === 'function' ? this.observers() : this.observers;

	if (IObserver_observer.isInstanceOf && IObserver_observer.isInstanceOf(app.IObserver)) {

		var ix = this.observers().indexOf(IObserver_observer);

		if (ix === -1) { // not found, return null

			return null;
		}
		
		if (this.observers().length > 1) {this.observers().splice(ix, 1);} else {this.observers.pop()};

		/*
		while (ix > -1 && this.observers.length > 1) { // remove duplicates, avoiding infinite loop

			this.observers = this.observers.splice(ix, 1);

			ix = this.observers.indexOf(IObserver_observer);
		}
		*/
	}

	else {

		throw new IllegalArgumentError('Observer must implement IObserver');
	}

	return IObserver_observer; // remove succesfull
};