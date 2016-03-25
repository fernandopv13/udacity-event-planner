'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class HTMLElement extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates, initializes and validates HTML elements. Utility for other UIWidget classes. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {HTMLElement} Not supposed to be instantiated, except when creating singleton
	*/

	module.HTMLElement = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'HTMLElement';

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.HTMLElement.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

		module.HTMLElement.prototype.constructor = module.HTMLElement // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.HTMLElement);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating HTML element based on specs provided in JSON object.
		*
		* Relied on by other factory methods for consistent, basic element creation.
		*
		* (So, if some aspect of element creation fails, only this method will need to change.)
		*
		* @param {Object} JSON object literal containing specs of element to be created. Se comments in code for an example.
		*
		* @return {HTMLElement} The requested element
		*
		* @throws {ReferenceError} If no options are specified
		*/

		module.HTMLElement.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all currently supported features:

			{
				element: 'input', // the type of element required

				attributes: // an arbitrary collection of name-value pairs
				{
					type: 'text',

					id: 'demo-element',

					required: true
				},

				classList: // an arbitrary list of strings
				[
					'row',

					'col',

					's12'
				],

				dataset: // an arbitrary collection of name-value pairs
				{
					success: 'You made it!',

					error: 'Please try again'
				},
				
				innerHTML: 'Hello world',

				listeners:
				{
					click: function() {},
			
					blur: function() {}
				}

				// Cannot pass in anonymous functions as event handlers using this approach, but named functions
				// will work. Use 'elementOptions' approach for anonymous functions.
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			var options = obj_options;

			var element = document.createElement(options.element), prop;
						
			if (options.attributes) {
			
				for (prop in options.attributes) {
					
					element.setAttribute(prop, options.attributes[prop]);
				}
			}
			
			if (options.classList) {
				
				options.classList.forEach(function(str_class) {
					
					element.classList.add(str_class);
				});
			}
			
			if (options.dataset) {
			
				for (prop in options.dataset) {
					
					element.dataset[prop] = options.dataset[prop];
				}
			}
			
			if (options.innerHTML) {
				
				element.innerHTML = options.innerHTML;
			}


			if (options.listeners) {
			
				for (prop in options.listeners) {
					
					element.addEventListener(prop, options.listeners[prop]);
				}
			}

			return element;
		};

		
		/* Initializes element once rendered to the DOM (required by UIWidget)
		*
		* @param {String} id id of the element to initialize
		*
		* @param {Object} options JSON object with the options to use for initialization (see source for supported format)
		*
		* @return {void}
		*
		* @throws {IllegalArgumentError} If a parameter does not resolve to an expected value or type
		*/

		module.HTMLElement.prototype.init = function(View_v, str_elementId, obj_elementOptions) {

			/* Example of currently supported JSON format for elementOptions:
			{
				listeners: 
				{
					mousedown: // handler may also be reference to named function

						function(nEvent) { // submit (blur hides click event so using mousedown)

							this.submit(nEvent);

						}.bind(this)
				}
			}
			*/
			
			if (obj_elementOptions.listeners) { // attach event listeners

				var listeners = obj_elementOptions.listeners;

				for (var event in listeners) {

					if (typeof listeners[event] === 'function') {

						$('#' + str_elementId).on(event, listeners[event].bind(View_v));
					}

					else {

						throw new IllegalArgumentError('Expected function');
					}
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

		module.HTMLElement._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.HTMLElement.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.HTMLElement._instance === 'undefined'

				|| module.HTMLElement._instance === null

				|| module.HTMLElement._instance.constructor !== module.HTMLElement) {

					module.HTMLElement._instance = new module.HTMLElement();
				}

				return module.HTMLElement._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);