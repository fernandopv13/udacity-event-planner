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
		
			// Set temporary literals for use by parent class constructor (unless already defined in calling class)

			this.type = this.type || 'InputWidget';

			this.ssuper = module.InputWidget; // All derived classes has InputWidget as super, so set here

			
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

	/** Initializes InputWidget upon rendering it into the HTML DOM.
	*
	* Currently does nothing but pass call up the inheritance chain to UIWidget.
	*
	* (ssuper only works on level up from the 'lowest' derived class, so must pass manually.)
	*
	*/

	module.InputWidget.prototype.init = function(View_v, str_id, obj_options) {
		
		//console.log(arguments); // debug

		module.UIWidget.prototype.init(View_v, str_id, obj_options);
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