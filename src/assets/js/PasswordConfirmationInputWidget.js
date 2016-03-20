'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PasswordConfirmationInputWidget extends InputWidget
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
	* @return {PasswordConfirmationInputWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.PasswordConfirmationInputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'PasswordConfirmationInputWidget';

			
			// Initialize instance members inherited from parent class
			
			module.InputWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.PasswordConfirmationInputWidget.prototype = Object.create(module.InputWidget.prototype); // Set up inheritance

		module.PasswordConfirmationInputWidget.prototype.constructor = module.PasswordConfirmationInputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.InputWidgetFactory.instance().registerProduct(module.PasswordConfirmationInputWidget);


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

		module.PasswordConfirmationInputWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				width: 's12',

				id: 'test-password-confirmation',

				label: 'Test Password Confirmation',

				required: true,

				errormessage: 'Please confirm password'
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;

			
			var outerDiv = createElement( // outer div
			{
				element: 'div',

				attributes: {id: options.id + '-parent'},
				
				classList: ['row', 'hidden']
			});
						
			
			var innerDiv = createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', options.width]
			});

			outerDiv.appendChild(innerDiv);
			

			innerDiv.appendChild(createElement( // input
			{
				element: 'input',			
				
				attributes:
				{
					type: 'text',
					
					id: options.id,
					
					value: '',

					required: options.required ? true : false,

					'aria-required': true,

					'aria-labelledby': options.id + '-label',

					role: 'textbox',

					tabindex: 0
				},

				dataset: {customValidator: 'PasswordConfirmationInputWidget'},
				
				classList: ['validate']
			}));
			
			
			var labelElement = createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: options.id, id: options.id + '-label'},
				
				classList: ['form-label'],
				
				dataset: {error: options.errormessage ? options.errormessage : 'Please confirm password', success: 'Password confirmed'},
				
				innerHTML: 'Confirm Password'
			});
			
			labelElement.appendChild(createElement( // required field indicator
			{
				element: 'span',

				classList: ['required-indicator'],

				innerHTML: '*'
			}));

			innerDiv.appendChild(labelElement);

			
			return outerDiv;
		};

		
		/** Initializes password field (required by UIWidget) */

		module.PasswordConfirmationInputWidget.prototype.init = function(HTMLInputElement_e) {};

		
		/** Event handler for interactive validation of password confirmation field.
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.PasswordConfirmationInputWidget.prototype.validate = function(HTMLInputElement_e) {

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

		module.PasswordConfirmationInputWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.PasswordConfirmationInputWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.PasswordConfirmationInputWidget._instance === 'undefined'

				|| module.PasswordConfirmationInputWidget._instance === null

				|| module.PasswordConfirmationInputWidget._instance.constructor !== module.PasswordConfirmationInputWidget) {

					module.PasswordConfirmationInputWidget._instance = new module.PasswordConfirmationInputWidget();
				}

				return module.PasswordConfirmationInputWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);