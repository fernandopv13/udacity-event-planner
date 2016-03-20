'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class UIWidgetFactory
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Generic factory for creating generic UI widgets.
	*
	* @constructor
	*
	* @extends Factory
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {UIWidgetFactory} Not supposed to be instantiated, except when setting up inheritance in subclasses
	*/

	module.UIWidgetFactory = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.productName = this.productName || 'UIWidget';

			this.productType = this.productType || module.UIWidget;

			
			// Initialize instance members inherited from parent class
			
			module.Factory.call(this);
	};

		
	/*----------------------------------------------------------------------------------------
	* Inherit from Factory
	*---------------------------------------------------------------------------------------*/	
	
	module.UIWidgetFactory.prototype = Object.create(module.Factory.prototype); // Set up inheritance

	module.UIWidgetFactory.prototype.constructor = module.UIWidgetFactory // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/
	
	/** Creates an input field of the specified type, or null
	*
	* @param {String} type The type of input field to be created
	*
	* @param {Object} options An object containing the options to use when creating the field. See comments in code for individual widgets for details.
	*
	* @return {HTMLElement}
	*
	* @throws {ReferenceError} If specified type is not known to this factory
	*/

	/* Sample options objects indicating the default requirements:
	
		// InputWidget (date)
		{ 
			width: 's12', // (String) the width of the field, in columns on the layout grid

			id: 'test', // (String) the id of the HTML element the field will be rendered to

			label: 'Test date', // (String) the field's label

			required: true, // (Boolean) Whether making an entry into the field is required/mandatory

			datasource: new Date(), // (Object) An appropriate data source for the field

			errormessage: 'Please enter date' // (String) An error message to be shown if the fields fails to validate
		}
	*/

	module.UIWidgetFactory.prototype.createProduct = function(str_type, obj_options) {

		if (this.products()[str_type]) { // requested type is registered with this factory

			return this.products()[str_type].instance().createProduct(obj_options); // call widget's own factory method
		}

		else {

			throw new ReferenceError(str_type + ' not found in product list');
		}
	};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
	/* Reference to instance of class when used as singleton.
	* 
	* Treat as if private, though not possible to enforce in JS. Use static instance() method to access.
	*/

	module.UIWidgetFactory._instance = null;


	/** Gets an instance of the class for use as singleton (read-only) */

	module.UIWidgetFactory.instance = function() {
		
		if (arguments.length === 0) {

			if (typeof module.UIWidgetFactory._instance === 'undefined'

			|| module.UIWidgetFactory._instance === null

			|| module.UIWidgetFactory._instance.constructor !== module.UIWidgetFactory) {

				module.UIWidgetFactory._instance = new module.UIWidgetFactory();
			}

			return module.UIWidgetFactory._instance;
		}

		else {

			throw new IllegalArgumentError('property is read-only');
		}
	};

})(app);