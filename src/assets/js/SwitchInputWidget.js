'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class SwitchInputWidget extends InputWidget
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
	* @return {SwitchInputWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.SwitchInputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'SwitchInputWidget';

			
			// Initialize instance members inherited from parent class
			
			module.InputWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.SwitchInputWidget.prototype = Object.create(module.InputWidget.prototype); // Set up inheritance

		module.SwitchInputWidget.prototype.constructor = module.SwitchInputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.SwitchInputWidget);


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

		module.SwitchInputWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				width: 's7',

				id: 'switch-test',

				label: 'Test Switch',

				datasource: true,

				errormessage: 'Please confirm password',

				yes: 'Yes',

				no: 'no',

				validator: 'Class.prototype.validationMethod' // method used for custom validation (optional, defaults none)
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			if (typeof obj_options.datasource !== 'undefined' && obj_options.datasource !== null && typeof obj_options.datasource !== 'boolean') {

				throw new IllegalArgumentError('Data source must be a Boolean, or null');
			}
			
			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;


			var outerDiv = createElement( // outer div
			{
				element: 'div',

				classList: ['row']
			});

			
			var innerDiv = createElement( // inner div for main switch label
			{
				element: 'div',			
				
				classList: ['col', options.width]
			});

			outerDiv.appendChild(innerDiv);


			innerDiv.appendChild(createElement( // main switch label
			{	
				element: 'span',

				attributes: {id: options.id + '-label'},

				classList: ['form-label', 'input-switch-label'],

				innerHTML: options.label

			}));

			
			innerDiv = createElement( // inner div for switch widget
			{
				element: 'div',			
				
				classList: ['switch-container', 'col', 's' + (12 - parseInt(options.width.slice(1)))]
			});

			outerDiv.appendChild(innerDiv);
			
			
			var switchElement = createElement( // switch div
			{
				element: 'div',
				
				classList: ['switch']
			});

			innerDiv.appendChild(switchElement);
			
			
			var spanElement = createElement({ // div holding switch widget itself

				element: 'span',

				classList: ['input-switch-widget']
			});

			switchElement.appendChild(spanElement);


			var labelElement = createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: options.id},
				
				classList: ['form-label', 'active']
			});
			
			
			labelElement.appendChild(createElement( // 'not selected' minor label
			{	
				element: 'span',

				classList: ['form-label', 'input-switch-off-label'],

				innerHTML: options.off ? options.off : 'No'

			}));

			
			labelElement.appendChild(createElement( // input
			{	
				element: 'input',			
				
				attributes: (function(){

					var attr =
					{
						id: options.id,

						type: 'checkbox',

						'aria-labelledby': options.id + '-label',

						role: 'checkbox'
					};

					if (options.datasource) {attr.checked = true;}

					return attr;
				})(),

				dataset:
				{
					customValidator: options.validator ? options.validator : '',

					widgetclass: 'SwitchInputWidget'
				}
			}));

			
			labelElement.appendChild(createElement( // span
			{	
				element: 'span',
				
				classList: ['lever']
			}));

			
			labelElement.appendChild(createElement( // 'selected' minor label
			{	
				element: 'span',

				classList: ['form-label', 'input-switch-on-label'],

				innerHTML: options.on ? options.on : 'Yes'

			}));

			spanElement.appendChild(labelElement);

			return outerDiv;
		};

		
		/*DEPRECATED: Handled by InputWidget
		Initializes password field (required by UIWidget) */

		//module.SwitchInputWidget.prototype.init = function(HTMLInputElement_e) {};

		
		/** Event handler for interactive validation of switch (checkbox) field.
		*
		* Dummy method (required by InputWidget parent class), always returns true.
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.SwitchInputWidget.prototype.validate = function(HTMLInputElement_e) {

			return true;
		};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.SwitchInputWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.SwitchInputWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.SwitchInputWidget._instance === 'undefined'

				|| module.SwitchInputWidget._instance === null

				|| module.SwitchInputWidget._instance.constructor !== module.SwitchInputWidget) {

					module.SwitchInputWidget._instance = new module.SwitchInputWidget();
				}

				return module.SwitchInputWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);