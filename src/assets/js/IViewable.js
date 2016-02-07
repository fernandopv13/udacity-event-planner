'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IViewable
*********************************************************************************************/

/** @classdesc Presents information in the UI.
*
* @constructor
*
* @return Nothing. An interface cannot be instantiated
*
* @throws {InstantiationError} If attempting to instantiate interface
*
* @throws {AbstractMethodError} If attempting to invoke (abstract) method signature
*
* @author Ulrik H. Gade, January 2016
*
* @todo: Figure out how to get jsDoc to show (all) the method signature(s)
*/

app.IViewable = function() {
	
	/*----------------------------------------------------------------------------------------
	* Method signatures
	*---------------------------------------------------------------------------------------*/
	
	/** (Re)render on demand
	*
	* @return {void}
	*/

	app.IViewable.prototype.render = function() {
		
		throw new AbstractMethodError(app.IViewable.prototype.render.errorMessage);
	};
	
	this.constructor.prototype.render.errorMessage = 'Method signature "render()" must be realized in derived classes';
	
	
	/*----------------------------------------------------------------------------------------
	* Block instantiation
	*---------------------------------------------------------------------------------------*/
	
	this.constructor.constructorErrorMessage = 'Interface IViewable cannot be instantiated. Realize in implementing classes.';
	
	throw new InstantiationError(this.constructor.constructorErrorMessage);
}

/*----------------------------------------------------------------------------------------
* Default methods (must be defined outside main function/class body)
*---------------------------------------------------------------------------------------*/

/** Creates HTML element based on specs provided in JSON object
*
* @param {Object} JSON object literal containing specs of element to be created. Se comments in code for an example.
*
* @return {HTMLElement} HTML element
*/

app.IViewable.prototype.default_createElement = function(obj_specs) {

	/* Sample specification object using all currently supported features:

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
		
		innerHTML: 'Hello world'
	}
	*/

	var element = document.createElement(obj_specs.element), prop;
				
	if (obj_specs.attributes) {
	
		for (prop in obj_specs.attributes) {
			
			if (obj_specs.attributes[prop]) {
			
				element.setAttribute(prop, obj_specs.attributes[prop]);
			}
		}
	}
	
	if (obj_specs.classList) {
		
		obj_specs.classList.forEach(function(str_class) {
			
			element.classList.add(str_class);
		});
	}
	
	if (obj_specs.dataset) {
	
		for (prop in obj_specs.dataset) {
			
			element.dataset[prop] = obj_specs.dataset[prop];
		}
	}
	
	if (obj_specs.innerHTML) {
		
		element.innerHTML = obj_specs.innerHTML;
	}

	return element;
};