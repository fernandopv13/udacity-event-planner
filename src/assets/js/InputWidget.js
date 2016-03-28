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

	/** Initializes UIWidget upon rendering it into the HTML DOM.
	*
	* Currently does nothing but comply with requirement in UIWidget on behalf of widgets that do not
	*
	* need initialization after rendering to the DOM.
	*
	* @param {View} v The View the input belongs to
	*
	* @param {String} id Id of the element to be initialized
	*
	* @param {Object} options JSON object with the options to use for initialization (see source for supported formats) 
	*
	* @return {void}
	*/

	module.InputWidget.prototype.init = function(View_v, str_id, obj_options) {
		
		// do nothing
	};


	/** Performs custom validation of input field beyond what can be acheived using the
	*
	* HTML5 constraint validation API. Validation is specific to the type of input, so each
	*
	* subclass of InputWidget must have its own implementation.
	*
	* @abstract
	*
	* @param {HTMLInputELement} The input to be validated.
	*
	* @return {Boolean} true if validation is succesful, otherwise false.
	*/

	module.InputWidget.prototype.validate = function(HTMLInputElement) {

		throw new AbstractMethodError('validate() must be realized by subclasses');
	};

})(app);