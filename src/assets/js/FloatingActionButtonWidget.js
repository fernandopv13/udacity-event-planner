'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class FloatingActionButtonWidget extends ButtonWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates floating action buttons. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends ButtonWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {FloatingActionButtonWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.FloatingActionButtonWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'FloatingActionButtonWidget';

			
			// Initialize instance members inherited from parent class
			
			module.ButtonWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ButtonWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.FloatingActionButtonWidget.prototype = Object.create(module.ButtonWidget.prototype); // Set up inheritance

		module.FloatingActionButtonWidget.prototype.constructor = module.FloatingActionButtonWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.FloatingActionButtonWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating a submit buttion based on specs provided in JSON object.
		*
		* @param {Object} JSON object literal containing specs of element to be created. Se comments in code for an example.
		*
		* @return {FloatingActionButtonWidget} The requested button
		*
		* @throws {ReferenceError} If no options are specified
		*/

		module.FloatingActionButtonWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all currently supported features:

			{
				id: 'action-button'

				label: 'Cancel',

				color: 'red',

				icon: 'add'
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;

			
			var outerDiv = createElement( // outer div
			{
				element: 'div',

				classList: ['fixed-action-btn']
			});
			

			var anchorElement = createElement( // inner div
			{
				element: 'a',

				attributes: {id: options.id, title: options.label},
				
				classList: ['btn-floating', 'btn-large', options.color]
			});

			outerDiv.appendChild(anchorElement);


			anchorElement.appendChild(createElement(
			{
				element: 'i',

				attributes: {'aria-labelledby': options.id, role: 'button'},

				classList: ['large', 'material-icons'],

				dataset: {widgetclass: 'FloatingActionButtonWidget'},

				innerHTML: options.icon
			}));

			return outerDiv;
		};

		
		/* Initializes element (required by ButtonWidget) */

		//module.FloatingActionButtonWidget.prototype.init = function() {};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.FloatingActionButtonWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.FloatingActionButtonWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.FloatingActionButtonWidget._instance === 'undefined'

				|| module.FloatingActionButtonWidget._instance === null

				|| module.FloatingActionButtonWidget._instance.constructor !== module.FloatingActionButtonWidget) {

					module.FloatingActionButtonWidget._instance = new module.FloatingActionButtonWidget();
				}

				return module.FloatingActionButtonWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);