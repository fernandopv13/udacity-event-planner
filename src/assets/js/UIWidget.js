'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class UIWidget extends Product
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Abstract base class for the abstract factory method pattern used to create and manage UIwidgets.
	*
	* Classes are intended to be used as singletons so as not to duplicate the DOM for each HTML element created.
	*
	* Instance methods therefore cannot rely on their 'this' context but must be supplied the HTML element that needs processing.
	*
	* Something similar might be achieved using e.g. static methods, but that would make it impossible to
	*
	* take advantage of inheritance. Hence this 'hierarchy of singletons' approach.
	*
	* @abstract
	*
	* @constructor
	*
	* @extends Product
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {UIWidget} Not supposed to be instantiated, except when setting up inheritance in subclasses (concrete products)
	*/

	module.UIWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'UIWidget';

			
			// Initialize instance members inherited from parent class
			
			module.Product.call(this);


		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
			//var _instance = this.instance || null; // reference to the instance used when using class as singleton


		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields (dependency injection enables access for subclasses)
		*---------------------------------------------------------------------------------------*/

			/** Gets singleton instance of class (read-only). Creates instance if none exists.
			*
			* @return {Factory} instance Singleton instance of the UIWidget
			*
			* @throws {IllegalArgumentError} If trying to set the instance.
			*/

			/*
			this.instance = (function(obj_prop) { // mimic Accessor class, but deal with singleton creation

				return function() {

					if (arguments.length === 0) {

						if (obj_prop === null) { // no instance, so create one

							obj_prop = new this.constructor();
						}
					}

					else {

						throw new IllegalArgumentError('"instance" is read-only')
					}

					return obj_prop; // objects from subclass get their own copy of the private property, and can access it
				};

			}(_instance));
			*/
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from Product
	*---------------------------------------------------------------------------------------*/	
	
	module.UIWidget.prototype = Object.create(module.Product.prototype); // Set up inheritance

	module.UIWidget.prototype.constructor = module.UIWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Initializes UIWidget upon rendering it into the HTML DOM
	*
	* @abstract
	*
	* @return {void}
	*
	* @throws {AbstractMethodError} If invoked directly on the abstract base class (subclasses must provide their own implementation)
	*/

	module.UIWidget.prototype.init = function() {
		
		throw new AbstractMethodError('init() must be realized in subclasses');
	};

})(app);