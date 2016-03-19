'use strict';

var app = app || {}; // create a simple namespace for the module

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/*********************************************************************************************
	* public Interface IObservable
	*********************************************************************************************/

	/** @classdesc The Obserable part of the 'Observer' pattern. Observables may be observed by Observers. When Observables change state, they notify their Observers to update. Expects implementing classes to define public 'observers' accessor method.
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

	module.IObservable = function() {
		
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

	module.IObservable.prototype.default_notifyObservers = function() {

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

	module.IObservable.prototype.default_registerObserver = function(IObserver_o) {

		//var observers = typeof this.observers === 'function' ? this.observers() : this.observers;

		if (IObserver_o.isInstanceOf && IObserver_o.isInstanceOf(module.IObserver)) {

			if (this.observers().indexOf(IObserver_o) < 0) { // skip duplicates

				this.observers().push(IObserver_o);
			}

			else {

				return null; // duplicate, not added
			}
		}

		else {

			throw new IllegalArgumentError('Observer must implement IObserver');
		}

		return IObserver_o; // add succesful
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

	module.IObservable.prototype.default_removeObserver = function(IObserver_o) {

		//var observers = typeof this.observers === 'function' ? this.observers() : this.observers;

		if (IObserver_o.isInstanceOf && IObserver_o.isInstanceOf(module.IObserver)) {

			var ix = this.observers().indexOf(IObserver_o);

			if (ix === -1) { // not found, return null

				return null;
			}
			
			if (this.observers().length > 1) {this.observers().splice(ix, 1);} else {this.observers.pop();}

			/*
			while (ix > -1 && this.observers.length > 1) { // remove duplicates, avoiding infinite loop

				this.observers = this.observers.splice(ix, 1);

				ix = this.observers.indexOf(IObserver_o);
			}
			*/
		}

		else {

			throw new IllegalArgumentError('Observer must implement IObserver');
		}

		return IObserver_o; // remove succesfull
	};

})(app);