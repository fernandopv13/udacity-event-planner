'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class FormWidget extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates and validates HTML forms. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {FormWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.FormWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'FormWidget';

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.FormWidget.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

		module.FormWidget.prototype.constructor = module.FormWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.FormWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating a form based on specs provided in JSON object.
		*
		* @param {Object} JSON object literal containing specs of form to be created. Se comments in code for an example.
		*
		* @return {FormWidget} The requested button
		*
		* @throws {ReferenceError} If no options are specified
		*/

		module.FormWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all currently supported features:

			{
				id: 'test-form',

				autocomplete: false,

				novalidate: false
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;

			var formElement = createElement(
			{
				element: 'form',			
				
				attributes:
				{
					id: options.id,

					autocomplete: options.autocomplete,

					novalidate: options.novalidate
				},
				
				classList: ['col', 's12'],

				dataset: {widgetclass: 'FormWidget'}
			});


			/*
			var containerDiv = createElement(
			{
				element: 'div',			
				
				classList: ['row']
			});
			
			formElement.appendChild(containerDiv);
			*/


			return formElement;
		};

		
		/* Initializes form (required by UIWidget) */

		//module.FormWidget.prototype.init = function() {};


		/** Event handler for interactive validation of entire form.
		*
		* Runs custom validator, if defined, on every relevant form element.
		*
		* Fall-back for browsers that don't support the HTML5 constraint validation API.
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.FormWidget.prototype.validate = function(HTMLFormElement_f) {

			// Run custom validator on every relevant form element, if defined

			var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea, input[type="datetime-local"]';

			$(HTMLFormElement_f).find(input_selector).each(function(ix, element) {

				if ($(element).data && typeof $(element).data('customValidator') !== 'undefined') { // field has custom validator attribute

					var fn = $(element).data('customValidator').split('.').reduce(function(obj, ix) {return obj[ix]}, module); // resolve dot string into js reference (w/o resorting to eval()!)

					//var clss = module[$(element).data('customValidator')], fn = typeof clss !== 'undefined' ? clss.prototype.validate : null;

					if (element.setCustomValidity && typeof fn === 'function') { // custom validator is a function

						// This seems broken in Chrome for Android (CyanogenMod), and neither H5F nor webshim can make it work

						element.setCustomValidity(fn(element) ? '' : false); // run custom validator and set custom validity based on result

						//console.log(element.id + ': ' + element.checkValidity() + ', ' + fn(element)); // debug
					}
				}
			});

			// update display of error messages

			Materialize.updateTextFields(); // implictly calls custom validators

			return $(HTMLFormElement_f)[0].checkValidity();
		}


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.FormWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.FormWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.FormWidget._instance === 'undefined'

				|| module.FormWidget._instance === null

				|| module.FormWidget._instance.constructor !== module.FormWidget) {

					module.FormWidget._instance = new module.FormWidget();
				}

				return module.FormWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);