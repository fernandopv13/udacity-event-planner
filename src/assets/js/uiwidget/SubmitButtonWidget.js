'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class SubmitButtonWidget extends ButtonWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates Materialize-styled submit button. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends ButtonWidget
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
			
			module.ButtonWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ButtonWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.SubmitButtonWidget.prototype = Object.create(module.ButtonWidget.prototype); // Set up inheritance

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
		* @param {Object} JSON object literal containing specs of element to be created. See comments in code for an example.
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

				icon: 'send',

				action: function() {}
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;

			var buttonElement = createElement({ // submit button
				
				element: 'a',
				
				attributes: {id: options.id, role: 'button', tabindex: 0},
				
				classList: ['waves-effect', 'waves-light', 'btn'],

				dataset: {widgetclass: 'SubmitButtonWidget'},

				innerHTML: options.label
			});
			
			
			buttonElement.appendChild(createElement({ // 'send' icon
				
				element: 'i',
				
				classList: ['material-icons', 'right'],
				
				innerHTML: options.icon || 'send'
			}));
			
			if (options.action && typeof options.action === 'function') {
			
				$(buttonElement).on('mousedown', options.action);
			}
			
			return buttonElement;
		};

		
		/* Initializes widget after it has been rendeed to the DOM.
		*
		* Attaches generic click (mousedown) event handler. Expects View to support submit() instance method.
		*
		* @param {View} v The calling View where the widget resided
		*
		* @param {String} id The element's id
		*
		* @param {Object} options JSON object holding the options for the element (if any)
		*
		* @return {void}
		*
		* @throws {ReferenceError} If View does not have a 'submit' property
		*
		* @throws {IllegalArgumentError} If 'submit' property of View is not a function
		*/

		module.SubmitButtonWidget.prototype.init = function(View_v, str_id, obj_options) {

			// Attach generic event handler

			var fn = View_v.submit;

			if (typeof fn !== 'undefined') {

				if (typeof fn === 'function') {

					$('#' + str_id).on('mousedown', fn.bind(View_v));
				}

				else {

					throw new IllegalArgumentError('submit must be a function')
				}
			}

			else {

				throw new ReferenceError('View must support "submit()"" instance method');
			}

			
			// Call generic initializer in parent class

			module.ButtonWidget.prototype.init(View_v, str_id, obj_options);
		};


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