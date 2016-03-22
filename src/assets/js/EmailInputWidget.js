'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EmailInputWidget extends InputWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates, initializes and validates HTML email input fields. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends InputWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {EmailInputWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.EmailInputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'EmailInputWidget';

			
			// Initialize instance members inherited from parent class
			
			module.InputWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.EmailInputWidget.prototype = Object.create(module.InputWidget.prototype); // Set up inheritance

		module.EmailInputWidget.prototype.constructor = module.EmailInputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.EmailInputWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating email fields for forms
		
		* @param {Object} JSON object literal containing specs of date input to be created. Se comments in code for an example.
		*
		* @return {HTMLDivElement} The requested element
		*
		* @throws {ReferenceError} If no options are specified
		*
		* @throws {IllegalArgumentError} If datasource is not an instance of Email
		*/

		module.EmailInputWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				width: 's12',

				id: 'test-email',

				label: 'Test Email',

				required: true,

				datasource: new app.Email('test@server.domain'),

				errormessage: 'Please enter email',

				validator: 'Class.prototype.validationMethod' // method used for custom validation (optional, defaults to DateInputWidget.prototype.validate)
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			if (typeof obj_options.datasource !== 'undefined' && obj_options.datasource !== null && obj_options.datasource.constructor !== module.Email) {

				throw new IllegalArgumentError('Data source must be instance of Email, or null');
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
				type: 'email',
				
				id: options.id,
				
				value: options.datasource && options.datasource.address() ? options.datasource.address() : '',

				'aria-labelledby': options.id + '-label',

				role: 'textbox'
			}

			if (options.required) {attributes.required = true; attributes['aria-required'] = true;}

			innerDiv.appendChild(createElement( // input
			{
				element: 'input',			
				
				attributes: attributes,

				dataset: {customValidator: options.validator ? options.validator : 'EmailInputWidget.prototype.validate'},
				
				classList: ['validate']
			}));
			
			
			var labelElement = createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: options.id, id: options.id + '-label'},
				
				classList: options.datasource && options.datasource.address() ? ['form-label', 'active'] : ['form-label'],
				
				dataset: {error: 'Please enter email in format address@server.domain', success: 'Email is valid'},
				
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

		
		/** Initializes email field (required by UIWidget) */

		module.EmailInputWidget.prototype.init = function(HTMLInputElement_e) {};

		
		/** Event handler for interactive validation of email field
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.EmailInputWidget.prototype.validate = function(HTMLInputElement_e) {

			/* Tried the HTML5 email validity constraint but found it too lax
			*
			* (it does not require a period or much else after the @), so rolling my own.
			*
			* See unit test for Email class using com_github_dominicsayers_isemail.tests for details.
			*/

			var testMail = new module.Email($(HTMLInputElement_e).val()),

			isRequired = typeof $(HTMLInputElement_e).attr('required') !== 'undefined';

			if ($(HTMLInputElement_e).val() !== '') { // always validate email if it exists

				return testMail.isValid();
			}

			else if (!isRequired) { // empty is OK if not required
			
				return true;
			}

			else { // no entry, but required

				return false;
			}
		};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.EmailInputWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.EmailInputWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.EmailInputWidget._instance === 'undefined'

				|| module.EmailInputWidget._instance === null

				|| module.EmailInputWidget._instance.constructor !== module.EmailInputWidget) {

					module.EmailInputWidget._instance = new module.EmailInputWidget();
				}

				return module.EmailInputWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);