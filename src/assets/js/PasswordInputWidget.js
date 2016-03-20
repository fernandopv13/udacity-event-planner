'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PasswordInputWidget extends InputWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates, initializes and validates HTML password input fields. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends InputWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {PasswordInputWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.PasswordInputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'PasswordInputWidget';

			
			// Initialize instance members inherited from parent class
			
			module.InputWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.PasswordInputWidget.prototype = Object.create(module.InputWidget.prototype); // Set up inheritance

		module.PasswordInputWidget.prototype.constructor = module.PasswordInputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.PasswordInputWidget);


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

		module.PasswordInputWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				width: 's12',

				id: 'test-password',

				label: 'Test Password',

				required: true,

				datasource: new app.Password();

				errormessage: 'Please enter number',

				hintsprefix: 'test-password-hints'
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			if (obj_options !== null && obj_options.datasource.constructor !== app.Password) {

				throw new IllegalArgumentError('Data source must be an instance of Password, or null');
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


			innerDiv.appendChild(createElement( // input
			{
				element: 'input',			
				
				attributes:
				{
					type: 'text', // deliberately not hiding password, as per Luke W's advice for mobile
					
					id: options.id,
					
					value: options.datasource && options.datasource.password() ? options.datasource.password() : '',

					required: 'true',

					'aria-required': true,

					'aria-labelledby': options.id + '-label',

					role: 'textbox'
				},

				dataset:
				{
					customValidator: 'PasswordInputWidget',

					value: options.datasource && options.datasource.password() ? options.datasource.password() : ''
				},

				classList: ['validate']
			}));

					
			var labelElement = createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: options.id, id: options.id + '-label'},
				
				classList: options.datasource && options.datasource.password() ? ['form-label', 'active'] : ['form-label'],
				
				dataset: {error: options.errormessage ? options.errormessage : 'Please enter a valid password', success: 'Password is valid'},
				
				innerHTML: 'Password'
			});
			
			labelElement.appendChild(createElement( // required field indicator
			{
				element: 'span',

				classList: ['required-indicator'],

				innerHTML: '*'
			}));

			innerDiv.appendChild(labelElement);

			
			innerDiv = createElement( // inner div (for validation hits)
			{
				element: 'div',

				attributes: {id: options.hintsprefix, 'aria-hidden': true},
				
				classList: ['col', options.width, 'hidden']
			});

			outerDiv.appendChild(innerDiv);


			var pElement = createElement(
			{
				element: 'p',

				attributes: {id: options.hintsprefix + '-charcount'},

				classList: ['password-validation-hint'],

				innerHTML: 'Must be at least 8 characters long'
			});

			pElement.appendChild(createElement(
			{
				element: 'i',

				classList: ['material-icons', 'left'],

				innerHTML: 'error'
			}));

			innerDiv.appendChild(pElement);

			
			pElement = createElement(
			{
				element: 'p',

				attributes: {id: options.hintsprefix + '-uppercase'},

				classList: ['password-validation-hint'],

				innerHTML: 'Must contain Upper Case characters'
			});

			pElement.appendChild(createElement(
			{
				element: 'i',

				classList: ['material-icons', 'left'],

				innerHTML: 'error'
			}));

			innerDiv.appendChild(pElement);


			pElement = createElement(
			{
				element: 'p',

				attributes: {id: options.hintsprefix + '-lowercase'},

				classList: ['password-validation-hint'],

				innerHTML: 'Must contain lower case characters'
			});

			pElement.appendChild(createElement(
			{
				element: 'i',

				classList: ['material-icons', 'left'],

				innerHTML: 'error'
			}));

			innerDiv.appendChild(pElement);
			

			pElement = createElement(
			{
				element: 'p',

				attributes: {id: options.hintsprefix + '-number'},

				classList: ['password-validation-hint'],

				innerHTML: 'Must contain numbers'
			});

			pElement.appendChild(createElement(
			{
				element: 'i',

				classList: ['material-icons', 'left'],

				innerHTML: 'error'
			}));

			innerDiv.appendChild(pElement);


			pElement = createElement(
			{
				element: 'p',

				attributes: {id: options.hintsprefix + '-punctuation'},

				classList: ['password-validation-hint'],

				innerHTML: 'Must contain one or more of !@#$%^&'
			});

			pElement.appendChild(createElement(
			{
				element: 'i',

				classList: ['material-icons', 'left'],

				innerHTML: 'error'
			}));

			innerDiv.appendChild(pElement);


			pElement = createElement(
			{
				element: 'p',

				attributes: {id: options.hintsprefix + '-illegal'},

				classList: ['password-validation-hint'],

				innerHTML: 'Must not contain illegal characters'
			});

			pElement.appendChild(createElement(
			{
				element: 'i',

				classList: ['material-icons', 'left'],

				innerHTML: 'error'
			}));

			innerDiv.appendChild(pElement);

			return outerDiv;
		};

		
		/** Initializes password field (required by UIWidget) */

		module.PasswordInputWidget.prototype.init = function(HTMLInputElement_e) {};

		
		/** Event handler for interactive validation of password field.
		*
		* Includes support for dynamically updated password hints.
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.PasswordInputWidget.prototype.validate = function(HTMLInputElement_e) {

			/* Relying solely on HTML5 constraint validation here would require me to write a compound regex
			*
			* meeting all the requirements of the individial static validation functions in the Password class.
			*
			* This is too much of a headache both to create and maintain. So relying directly on Password class instead.
			*/

			var password = $(HTMLInputElement_e).val(), ret = true, tmp;

			// Validate password and manage display of password hints

			var tests = 
			{
				charcount: module.Password.hasValidCharacterCount,

				uppercase: module.Password.hasValidUpperCaseCount,

				lowercase: module.Password.hasValidLowerCaseCount,

				number: module.Password.hasValidNumberCount,

				punctuation: module.Password.hasValidPunctuationCount,

				illegal: module.Password.hasIllegalCharacters
			}

			for (var prop in tests) { // iterate through tests

				tmp = tests[prop](password); // run test

				if (prop === 'illegal') { // this reverses the logic, and has a non-Boolean return, so deal with it separately

					ret = ret && tmp === null; // add up results

					$('#' + HTMLInputElement_e.id + '-hints-' + prop).find('i').html(tmp ? 'error' : 'done'); // display icon
				}

				else { // the rest are all the same

					ret = ret && tmp; // add up results

					$('#' + HTMLInputElement_e.id + '-hints-' + prop).find('i').html(tmp ? 'done' : 'error'); // display icon
				}
			}

			return ret;
		};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.PasswordInputWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.PasswordInputWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.PasswordInputWidget._instance === 'undefined'

				|| module.PasswordInputWidget._instance === null

				|| module.PasswordInputWidget._instance.constructor !== module.PasswordInputWidget) {

					module.PasswordInputWidget._instance = new module.PasswordInputWidget();
				}

				return module.PasswordInputWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);