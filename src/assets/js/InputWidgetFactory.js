'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class InputWidgetFactory extends Factory
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Concrete factory for creating form widgets.
	*
	* @constructor
	*
	* @extends Factory
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {InputWidgetFactory} Not supposed to be instantiated, except when setting up inheritance in subclasses
	*/

	module.InputWidgetFactory = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.productName = 'InputWidget';

			this.productType = module.InputWidget;

			
			// Initialize instance members inherited from parent class
			
			module.Factory.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidgetFactory
	*---------------------------------------------------------------------------------------*/	
	
	module.InputWidgetFactory.prototype = Object.create(module.Factory.prototype); // Set up inheritance

	module.InputWidgetFactory.prototype.constructor = module.InputWidgetFactory // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/
	
	/** Creates an input field of the specified type, or null
	*
	* @param {String} type The type of input field to be created
	*
	*@param {Object} options An object containing the options to use when creating the field
	*
	@return {HTMLElement}
	*/

	/* Sample options object indicating the default requirements:

	{
		width: 's12', // (String) the width of the field, in columns on the layout grid

		id: 'test', // (String) the id of the HTML element the field will be rendered to

		label: 'Test date', // (String) the field's label

		required: true, // (Boolean) Whether making an entry into the field is required/mandatory

		datasource: new Date(), // (Object) An appropriate data source for the field

		errormessage: 'Please enter date' // (String) An error message to be shown if the fields fails to validate
	}

	*/

	module.InputWidgetFactory.prototype.createProduct = function(str_type, obj_options) {

		if (this.products()[str_type]) { // requested type is registered with this factory

			return this.products()[str_type].instance().createProduct(obj_options); // call widget's own factory method
		}

		else {

			throw new ReferenceError(str_type + ' not found in product list. Note: Type is not case-sensitive');
		}
	};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
	/* Reference to instance of class when used as singleton.
	* 
	* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
	*/

	module.InputWidgetFactory._instance = null;


	/** Gets an instance of the class for use as singleton (read-only) */

	module.InputWidgetFactory.instance = function() {
		
		if (arguments.length === 0) {

			if (typeof module.InputWidgetFactory._instance === 'undefined'

			|| module.InputWidgetFactory._instance === null

			|| module.InputWidgetFactory._instance.constructor !== module.InputWidgetFactory) {

				module.InputWidgetFactory._instance = new module.InputWidgetFactory();
			}

			return module.InputWidgetFactory._instance;
		}

		else {

			throw new IllegalArgumentError('property is read-only');
		}
	};

})(app);
