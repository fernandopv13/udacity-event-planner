'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class NumberInputWidget extends InputWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates, initializes and validates Materialize-styled HTML number input fields. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends InputWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {NumberInputWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.NumberInputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'NumberInputWidget';

			
			// Initialize instance members inherited from parent class
			
			module.InputWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.NumberInputWidget.prototype = Object.create(module.InputWidget.prototype); // Set up inheritance

		module.NumberInputWidget.prototype.constructor = module.NumberInputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.NumberInputWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating number fields for forms
		
		* @param {Object} JSON object literal containing specs of input to be created. See comments in code for an example.
		*
		* @return {HTMLDivElement} The requested element
		*
		* @throws {ReferenceError} If no options are specified
		*
		* @throws {IllegalArgumentError} If datasource is not a number
		*
		* @todo Add support for non-HTML5 compliant browsers
		*/

		module.NumberInputWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				width: 's12',

				id: 'test-number',

				label: 'Test Number',

				required: true,

				datasource: 23, // anything that typeof will evaluate as 'number'

				errormessage: 'Please enter number',

				min: 0, // integer

				max: 50, // integer

				step: 1, // integer

				validator: 'Class.prototype.validationMethod' // method used for custom validation (optional, defaults to NumberInputWidget.prototype.validate)
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			if (typeof obj_options.datasource !== 'undefined' && obj_options.datasource !== null && typeof obj_options.datasource !== 'number') {

				throw new IllegalArgumentError('Data source must be a number, or null');
			}

			var options = obj_options;

			var createElement = module.HTMLElement.instance().createProduct;


			var outerDiv =  createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});


			var innerDiv =  createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', options.width]
			});
			
			outerDiv.appendChild(innerDiv);


			var attributes =
			{
				id: options.id,

				type: 'number',

				value: options.datasource,

				'aria-labelledby': options.id + '-label',

				role: 'textbox'
			}

			if (!isNaN(parseInt(options.min))) {attributes.min = options.min;}

			if (!isNaN(parseInt(options.max))) {attributes.max = options.max;}

			if (!isNaN(parseInt(options.step))) {attributes.step = options.step;}

			if (options.required) {attributes.required = true; attributes['aria-required'] = true;}

			if (options.autofocus) {attributes.autofocus = true;}

			innerDiv.appendChild(createElement( // input
			{
				element: 'input',			
				
				attributes: attributes,
				
				classList: ['validate'],

				dataset:
				{
					customValidator: options.validator ? options.validator : 'NumberInputWidget.prototype.validate',

					widgetclass: 'NumberInputWidget'
				}
			}));
			
			
			var labelElement = createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: options.id, id: options.id + '-label'},
				
				classList: options.datasource >= 0 ? ['form-label', 'active'] : ['form-label'],
				
				dataset: {error: options.errormessage},
				
				innerHTML: options.label
			});

			
			if (options.required) {

				labelElement.appendChild(createElement( // required field indicator
				{
					element: 'span',

					classList: ['required-indicator'],

					innerHTML: '*'
				}));
			}

			innerDiv.appendChild(labelElement);


			return outerDiv;
		};

		
		/** Event handler for interactive validation of number field
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.NumberInputWidget.prototype.validate = function(HTMLInputElement_e) {

			if (Modernizr && Modernizr.formvalidation) { // form validation API supported

				return $(HTMLInputElement_e)[0].checkValidity(); // no need for custom validation, HTML5 validation suffices
			}

			else { // check manually

				var val = $(HTMLInputElement_e).val(),

				min = $(HTMLInputElement_e).attr('min'),

				max = $(HTMLInputElement_e).attr('max'),

				step = $(HTMLInputElement_e).attr('step'),

				required = $(HTMLInputElement_e).attr('required');

				if (typeof val !== 'undefined') { // a value has been entered

					val = parseFloat(val);

					if (typeof min !== 'undefined' && val < parseFloat(min)) { // too low

						return false;
					}

					else if (typeof max !== 'undefined' && val > parseFloat(max)) { // too high

						return false;
					}

					else if (typeof step !== 'undefined' && typeof min !== 'undefined') { // out of step

						return (val - parseFloat(min)) % parseFloat(step) === 0;
					}

					else {

						return true;
					}
				}

				else { // no entry, test if required

					return typeof required === 'undefined'; // true if not required, and vice versa
				}
			}
		};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.NumberInputWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.NumberInputWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.NumberInputWidget._instance === 'undefined'

				|| module.NumberInputWidget._instance === null

				|| module.NumberInputWidget._instance.constructor !== module.NumberInputWidget) {

					module.NumberInputWidget._instance = new module.NumberInputWidget();
				}

				return module.NumberInputWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);