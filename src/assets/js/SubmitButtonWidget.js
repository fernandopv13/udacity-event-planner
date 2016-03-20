'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class SubmitButtonWidget extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates submit buttons. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {SubmitButtonWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.SubmitButtonWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'SubmitButtonWidget';

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.SubmitButtonWidget.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

		module.SubmitButtonWidget.prototype.constructor = module.SubmitButtonWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.SubmitButtonWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating a submit buttion based on specs provided in JSON object.
		*
		* @param {Object} JSON object literal containing specs of element to be created. Se comments in code for an example.
		*
		* @return {SubmitButtonWidget} The requested button
		*
		* @throws {ReferenceError} If no options are specified
		*/

		module.SubmitButtonWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all currently supported features:

			{
				id: 'submit-button'

				label: 'Done',

				icon: 'send'
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;;

			var buttonElement = createElement({ // submit button
				
				element: 'a',
				
				attributes: {id: options.id, role: 'button', tabindex: 0},
				
				classList: ['waves-effect', 'waves-light', 'btn'],

				innerHTML: options.label
			});
			
			
			buttonElement.appendChild(createElement({ // 'send' icon
				
				element: 'i',
				
				classList: ['material-icons', 'right'],
				
				innerHTML: options.icon || 'send'
			}));
			
			
			return buttonElement;
		};

		
		/* Initializes element (required by UIWidget) */

		module.SubmitButtonWidget.prototype.init = function() {};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.SubmitButtonWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.SubmitButtonWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.SubmitButtonWidget._instance === 'undefined'

				|| module.SubmitButtonWidget._instance === null

				|| module.SubmitButtonWidget._instance.constructor !== module.SubmitButtonWidget) {

					module.SubmitButtonWidget._instance = new module.SubmitButtonWidget();
				}

				return module.SubmitButtonWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);