'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class CancelButtonWidget extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates cancel buttons. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {CancelButtonWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.CancelButtonWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'CancelButtonWidget';

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.CancelButtonWidget.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

		module.CancelButtonWidget.prototype.constructor = module.CancelButtonWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.CancelButtonWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating a submit buttion based on specs provided in JSON object.
		*
		* @param {Object} JSON object literal containing specs of element to be created. Se comments in code for an example.
		*
		* @return {CancelButtonWidget} The requested button
		*
		* @throws {ReferenceError} If no options are specified
		*/

		module.CancelButtonWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all currently supported features:

			{
				id: 'cancel-button'

				label: 'Cancel',
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;

			var buttonElement = createElement({ // cancel button
				
				element: 'a',
				
				attributes: {id: options.id, role: 'button', tabindex: 0},
				
				classList: ['waves-effect', 'waves-teal', 'btn-flat'],

				innerHTML: options.label
			});
			
			
			return buttonElement;
		};

		
		/* Initializes element (required by UIWidget) */

		module.CancelButtonWidget.prototype.init = function() {};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.CancelButtonWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.CancelButtonWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.CancelButtonWidget._instance === 'undefined'

				|| module.CancelButtonWidget._instance === null

				|| module.CancelButtonWidget._instance.constructor !== module.CancelButtonWidget) {

					module.CancelButtonWidget._instance = new module.CancelButtonWidget();
				}

				return module.CancelButtonWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);