'use strict';

var app = app || {}; // create a simple namespace for the module

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/*********************************************************************************************
	* public Interface IObserver
	*********************************************************************************************/

	/** @classdesc The Observer part of the 'Observer' pattern. Observers may register with observables, to be notified when observable changes state.
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
	* @todo: Figure out how to get jsDoc to show (all) the method signature(s)
	*/

	module.IObserver = function() {
		
		/*----------------------------------------------------------------------------------------
		* Method signatures
		*---------------------------------------------------------------------------------------*/
		
		/** Updates object when notified of change by observable (controller). Autosaves to local storage if available.
		*
		* @abstract
		*
		* @param {Object} obj Temporary object holding the data to update this object with
		*
		* @return {Boolean} true if copy was successful, else error or false
		*
		* @throws {IllegalArgumentError} If provided data object is not an instance of the target object's class
		*
		* @throws {IllegalArgumentError} If provided data object has different id to that of target object
		*
		* @throws {IllegalArgumentError} If something else goes wrong when setting the data
		*/

		module.IObserver.prototype.update = function() {
			
			throw new AbstractMethodError('Method signature "update()" must be realized in derived classes');
		};
		
		
		/*----------------------------------------------------------------------------------------
		* Block instantiation
		*---------------------------------------------------------------------------------------*/
		
		throw new InstantiationError('Interface IObserver cannot be instantiated. Realize in implementing classes.');
	}

})(app);