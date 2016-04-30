'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class TextInputWidget extends InputWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates, initializes and validates HTML password confirmation input fields. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends InputWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {TextInputWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.TextInputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'TextInputWidget';

			
			// Initialize instance members inherited from parent class
			
			module.InputWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.TextInputWidget.prototype = Object.create(module.InputWidget.prototype); // Set up inheritance

		module.TextInputWidget.prototype.constructor = module.TextInputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.TextInputWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating password fields for forms
		
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

		module.TextInputWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				width: 's12',

				id: 'text-test',

				label: 'Test Text',

				required: true,

				datasource: 'Some text', // String

				datalist: 'text-test-list', // id of datalist (optional)

				validator: 'Class.prototype.validationMethod' // method used for custom validation (optional, defaults to DateInputWidget.prototype.validate)
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			if (typeof obj_options.datasource !== 'undefined' && obj_options.datasource !== null && typeof obj_options.datasource !== 'string') {

				throw new IllegalArgumentError('Data source must be a String, or null');
			}
			
			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;


			var outerDiv = createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});

			

			var innerDiv = createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', options.width]
			});

			outerDiv.appendChild(innerDiv);
			

			var attributes = 
			{
				type: 'text',
				
				id: options.id,
				
				value: options.datasource ? options.datasource : '',

				'aria-labelledby': options.id + '-label',

				role: 'textbox'
			}

			if (options.required) {attributes.required = true; attributes['aria-required'] = true;}

			if (options.datalist) {attributes.list = options.datalist;}

			var classList = [];

			if (options.required) {classList.push('validate');}

			innerDiv.appendChild(createElement( // input
			{
				element: 'input',			
				
				attributes: attributes,
				
				classList: classList,

				dataset:
				{
					customValidator: options.validator ? options.validator : (Modernizr && Modernizr.formvalidation ? '' : 'TextInputWidget.prototype.validate'),

					widgetclass: 'TextInputWidget'
				}
			}));
			
			
			var labelElement = createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: options.id, id: options.id + '-label'},
				
				classList: options.datasource ? ['form-label', 'active'] : ['form-label'],
				
				dataset: {error: 'Please enter ' + options.label.toLowerCase()},
				
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

			if (options.datalist) { // datalist element

				innerDiv.appendChild(createElement(
				{
					element: 'datalist',			
					
					attributes: {id: options.datalist}
				}));
			}

			
			return outerDiv;			
		};
		
		
		/*DEPRECATED: Handled by InputWidget

		Initializes password field (required by UIWidget) */

		//module.TextInputWidget.prototype.init = function(HTMLInputElement_e) {};

		
		/** Event handler for interactive validation of text input field.
		*
		* Fallback for browsers that don't support the HTML5 form validation API. 
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.TextInputWidget.prototype.validate = function(HTMLInputElement_e) {

			var value = $(HTMLInputElement_e).val(),

			isRequired = typeof $(HTMLInputElement_e).attr('required') !== 'undefined';

			if (!isRequired || value !== '') { // true unless empty required field

				//console.log(true);

				return true;
			}
			
			//console.log(false);

			return false; // default to false
		};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.TextInputWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.TextInputWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.TextInputWidget._instance === 'undefined'

				|| module.TextInputWidget._instance === null

				|| module.TextInputWidget._instance.constructor !== module.TextInputWidget) {

					module.TextInputWidget._instance = new module.TextInputWidget();
				}

				return module.TextInputWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);