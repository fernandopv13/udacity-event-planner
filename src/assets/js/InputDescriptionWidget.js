'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class InputDescriptionWidget extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates descriptions for input fields. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {InputDescriptionWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.InputDescriptionWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'InputDescriptionWidget';

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.InputDescriptionWidget.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

		module.InputDescriptionWidget.prototype.constructor = module.InputDescriptionWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.InputDescriptionWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating descriptions for form fields
		
		* @param {Object} JSON object literal containing specs element to be created. See comments in code for an example.
		*
		* @return {HTMLDivElement} The requested element
		*
		* @throws {ReferenceError} If no options are specified
		*
		* @throws {IllegalArgumentError} If datasource is not a String
		*/

		module.InputDescriptionWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				datasource: 'Test field description',

				divider: false
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			if (obj_options !== null && typeof obj_options.datasource !== 'string') {

				throw new IllegalArgumentError('Data source must be a String, or null');
			}
			
			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;

			
			var innerDiv = createElement( // inner div for description
				{
					element: 'div',			
					
					classList: ['col', 's12']
				});

			innerDiv.appendChild(createElement( // description
			{	
				element: 'p',

				classList: ['form-label', 'input-field-description'],

				innerHTML: options.datasource

			}));

			if (options.divider) { // defaults to no divider

				innerDiv.appendChild(createElement({ // divider

					element: 'div',

					classList: ['divider']
				}));
			}

			return innerDiv;
		};
		
		
		/** Initializes description field (required by UIWidget) */

		module.InputDescriptionWidget.prototype.init = function(HTMLInputElement_e) {};

		
		/** Event handler for interactive validation of password confirmation field.
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.InputDescriptionWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.InputDescriptionWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.InputDescriptionWidget._instance === 'undefined'

				|| module.InputDescriptionWidget._instance === null

				|| module.InputDescriptionWidget._instance.constructor !== module.InputDescriptionWidget) {

					module.InputDescriptionWidget._instance = new module.InputDescriptionWidget();
				}

				return module.InputDescriptionWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);