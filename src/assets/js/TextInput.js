'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class TextInput extends InputWidget
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
	* @return {TextInput} Not supposed to be instantiated, except when creating singleton
	*/

	module.TextInput = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'TextInput';

			
			// Initialize instance members inherited from parent class
			
			module.InputWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.TextInput.prototype = Object.create(module.InputWidget.prototype); // Set up inheritance

		module.TextInput.prototype.constructor = module.TextInput // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.TextInput);


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

		module.TextInput.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				width: 's12',

				id: 'text-test',

				label: 'Test Text',

				required: true,

				datasource: 'Some text', // String

				datalist: 'text-test-list', // id of datalist (optional)

				validator: 'TextInput' // class used for custom validation (optional)
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			if (obj_options !== null && typeof obj_options.datasource !== 'string') {

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

				dataset: options.validator ? {customValidator: options.validator} : ''
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

			
			return outerDiv;
			
		};
		
		
		/** Initializes password field (required by UIWidget) */

		module.TextInput.prototype.init = function(HTMLInputElement_e) {};

		
		/** Event handler for interactive validation of password confirmation field.
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.TextInput.prototype.validate = function(HTMLInputElement_e) {

			// Skips validation if password isn't 'dirty' (i.e. changed since the view loaded)

			var pw_org = $('#' + HTMLInputElement_e.id.replace('-confirmation', '')).data('value'), // original pw

			pw = $('#' + HTMLInputElement_e.id.replace('-confirmation', '')).val(), // current password entry

			pw2 = $(HTMLInputElement_e).val(); // confirmation

			var ret = pw === pw2;

			//console.log(ret);

			ret = ret || pw === pw_org;

			//console.log(ret);

			return ret; // // pw and confirmation match, or pw hasn't changed
		};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.TextInput._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.TextInput.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.TextInput._instance === 'undefined'

				|| module.TextInput._instance === null

				|| module.TextInput._instance.constructor !== module.TextInput) {

					module.TextInput._instance = new module.TextInput();
				}

				return module.TextInput._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);