'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class InputWidget extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Abstract base class for the abstract factory method pattern used to create and manage UIwidgets.
	*
	* Represents widgets in a form that take data input from users.
	*
	* @abstract
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {InputWidget} Not supposed to be instantiated, except when setting up inheritance in subclasses (concrete products)
	*/

	module.InputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'InputWidget';

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
	module.InputWidget.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

	module.InputWidget.prototype.constructor = module.InputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** 
	* @abstract
	*
	*/

	module.InputWidget.prototype.validate = function(HTMLInputElement) {

		throw new AbstractMethodError('validate() must be realized by subclasses');
	};

})(app);