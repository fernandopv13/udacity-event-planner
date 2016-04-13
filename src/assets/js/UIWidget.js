'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class UIWidget extends Product
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Abstract base class for the abstract factory method pattern used to create and manage UIwidgets.
	*
	* Classes are intended to be used as singletons so as not to duplicate the DOM for each HTML element created.
	*
	* Instance methods therefore cannot rely on their 'this' context but must be supplied the HTML element that needs processing.
	*
	* Something similar might be achieved using e.g. static methods, but that would make it impossible to
	*
	* take advantage of inheritance. Hence this 'hierarchy of singletons' approach.
	*
	* @abstract
	*
	* @constructor
	*
	* @extends Product
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {UIWidget} Not supposed to be instantiated, except when setting up inheritance in subclasses (concrete products)
	*/

	module.UIWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'UIWidget';

			this.ssuper = this.ssuper ? this.ssuper : module.Product;

			
			// Initialize instance members inherited from parent class
			
			module.Product.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from Product
	*---------------------------------------------------------------------------------------*/	
	
	module.UIWidget.prototype = Object.create(module.Product.prototype); // Set up inheritance

	module.UIWidget.prototype.constructor = module.UIWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating UIWidgets in Views
		*
		* @abstract
		*
		* @param {Object} JSON object literal containing specs of widget to be created. Details may vary in concrete classes.
		*
		* @return {HTMLElement} An HTML element containing the DOM structure needed to render the widget in the browser.
		*
		* @throws {ReferenceError} If no options are specified
		*
		*/

		module.UIWidget.prototype.createProduct = function() {
		
			throw new AbstractMethodError('createProduct() must be realized in subclasses');
		};


		/** Does generic initialization of UIWidget upon rendering it into the HTML DOM.
		*
		* Currently mostly attaches event listeners defined for the widget in the calling View's render() method.
		*
		* Creating a clear separation of concerns between createProduct() and init() helps reduce the complexity of either method.
		*
		* If overriding init in derived classes, be sure to also call this method from the overriding method (inits are complementary, not mutually exclusive).
		*
		* This slightly convoluted, two-step approach is necessitated by the fact that UIWidgets have no separate existence outside their representation in the HTML DOM, so cannot be encapsulated as neatly/fully as might theoretically be ideal.
		*
		* It is also necessary in order to support using anonymous functions as event handlers,
		*
		* given that references to such handlers cannot be embedded in the DOM element when calling a UIWidget's createProduct() method.
		*
		* @param {View} v The View the input belongs to
		*
		* @param {String} id Id of the element to be initialized
		*
		* @param {Object} options JSON object with the options to use for initialization (see source in concrete classes for supported formats) 
		*
		* @return {void}
		*
		* @throws {AbstractMethodError} If invoked directly on the abstract base class (subclasses must provide their own implementation)
		*/

		module.UIWidget.prototype.init = function(View_v, str_id, obj_options) {
			
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
			
			//console.log(arguments); // debug

			if (obj_options.listeners) { // attach event listeners

				var listeners = obj_options.listeners;

				for (var event in listeners) {

					if (typeof listeners[event] === 'function') {

						$('#' + str_id).on(event, listeners[event]);
					}

					else {

						throw new IllegalArgumentError('Expected function');
					}
				}
			}
		};

})(app);