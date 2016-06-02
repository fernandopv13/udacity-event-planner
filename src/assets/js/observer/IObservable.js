'use strict';

var app = app || {}; // create a simple namespace for the module

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/*********************************************************************************************
	* public Interface IObservable
	*********************************************************************************************/

	/** @classdesc The Obserable part of the 'Observer' pattern. Observables may be observed by Observers. When Observables change state, they notify their Observers to update. Expects implementing classes to define public 'observers' accessor method.
	*
	* @interface
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
	* @param Method is agnostic about invoking signature: It simply passes on whichever parameters it receives, in the order received.
	*
	* @return void
	*
	* @todo Find more generic way of supporting different number of params
	*/

	module.IObservable.prototype.default_notifyObservers = function() {

		var args = arguments;

		//console.log(this);

		//console.log(args); // debug

		switch (args.length) { // can't figure out a more generic approach, so basic manual branching will have to do for now

			case 0:

				this.observers().forEach(function(observer) {

					observer.update();
				});
				
				break;

			case 1:

				this.observers().forEach(function(observer) {

					observer.update(args[0]);
				});
				
				break;

			case 2:

				this.observers().forEach(function(observer) {

					observer.update(args[0], args[1]);
				});

				break;

			case 3:

				this.observers().forEach(function(observer) {

					observer.update(args[0], args[1], args[2]);
				});
				
				break;

			case 4:

				this.observers().forEach(function(observer) {

					observer.update(args[0], args[1], args[2], args[3]);
				});
				
				break;

			case 5:

				this.observers().forEach(function(observer) {

					observer.update(args[0], args[1], args[2], args[3], args[4]);
				});
				
				break;

			default:

				//console.log('falling back on default'); // debug

				this.observers().forEach(function(observer) {

					observer.update(args);

				});
		}

		//console.log('exiting IObservable'); // debug
	};


	/** Registers IObservable as mutual observer. Used e.g. when creating new MVC collaborators.
	*
	* @param {IObservable} object The IObservable to register as mutual observer
	*
	* @return {Iobservable} object The IObservable passed in, now mutually registered
	*
	* @throws {IllegalArgumentError} If supplied with parameter that is not an instance of IObservable
	*/

	module.IObservable.prototype.default_registerMutualObserver = function(IObservable_o) {

		if (IObservable_o && IObservable_o.isInstanceOf && IObservable_o.isInstanceOf(module.IObservable)) {

			this.registerObserver(IObservable_o);

			IObservable_o.registerObserver(this);
		}

		else {

			throw new IllegalArgumentError('Expected IObservable');
		}

		return IObservable_o;
	}

	/** Registers observer
	*
	* @param {IObserver} Object implementing IObserver interface
	*
	* @return {Boolean} The removed object if succesfull, otherwise null
	*
	* @throws {IllegalArgumentError} If observer is not an instance of IObserver
	*/

	module.IObservable.prototype.default_registerObserver = function(IObserver_o) {

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

		if (IObserver_o.isInstanceOf && IObserver_o.isInstanceOf(module.IObserver)) {

			var ix = this.observers().indexOf(IObserver_o);

			if (ix === -1) { // not found, return null

				return null;
			}

			if (this.observers().length > 1) {this.observers().splice(ix, 1);} else {this.observers().pop();}
		}

		else {

			throw new IllegalArgumentError('Observer must implement IObserver');
		}

		return IObserver_o; // remove succesfull
	};


	/** Removes mutual observer
	*
	* @param {IObservable} object The IObservable to remove as mutual observer
	*
	* @return {Iobservable} object The IObservable passed in, now removed as mutual observer
	*
	* @throws {IllegalArgumentError} If supplied with parameter that is not an instance of IObservable
	*/

	module.IObservable.prototype.default_removeMutualObserver = function(IObservable_o) {

		if (IObservable_o && IObservable_o.isInstanceOf && IObservable_o.isInstanceOf(module.IObservable)) {

			this.removeObserver(IObservable_o);

			IObservable_o.removeObserver(this);
		}

		else {

			throw new IllegalArgumentError('Expected IObservable');
		}

		return IObservable_o;
	}

})(app);