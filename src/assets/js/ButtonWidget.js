'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class ButtonWidget extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Abstract base class for the abstract factory method pattern used to create and manage button widgets.
	*
	* Represents widgets in a form that take data input from users.
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {ButtonWidget} Not supposed to be instantiated, except when setting up inheritance in subclasses (concrete products)
	*/

	module.ButtonWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'ButtonWidget';

			this.ssuper = module.ButtonWidget; // All derived classes has ButtonWidget as super, so set here

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
	module.ButtonWidget.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

	module.ButtonWidget.prototype.constructor = module.ButtonWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Initializes ButtonWidget upon rendering it into the HTML DOM.
	*
	* Currently does nothing but pass call up the inheritance chain to UIWidget.
	*
	* (ssuper only works on level up from the 'lowest' derived class, so must pass manually.)
	*
	*/

	module.ButtonWidget.prototype.init = function(View_v, str_id, obj_options) {
		
		module.UIWidget.prototype.init(View_v, str_id, obj_options);
	};


	module.ButtonWidget.prototype.onClick = function(HTMLInputElement) {

		throw new AbstractMethodError('onClick() must be realized by subclasses');
	};

})(app);