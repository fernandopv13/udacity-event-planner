'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IViewable extends IObserable, IObserver
*********************************************************************************************/

/** @classdesc Presents information from the data model in the UI. Handles all UI related work.
*
* Extension of IObservable and IObserver implemented as mixins in realizing classes, using interfaceHelper.js.
*
* IViewables must only notify observers as a direct result of user actions in the UI. Otherwise the MVC objects will likely enter an infinite update loop.
*
* @extends IObservable
*
* @extends IObserver
*
* @constructor
*
* @return Nothing. An interface cannot be instantiated
*
* @throws {InstantiationError} If attempting to instantiate interface
*
* @author Ulrik H. Gade, February 2016
*
* @todo: Figure out how to get jsDoc to show (all) the method signature(s)
*/

app.IViewable = function() {
	
	/*----------------------------------------------------------------------------------------
	* Method signatures
	*---------------------------------------------------------------------------------------*/
	
	/** Update (i.e. render) UI on demand.
	*
	* @param {IModelable} obj Reference to the data model object to be rendered in the UI.
	*
	* @return {void}
	*
	* @throws {AbstractMethodError} If attempting to invoke (abstract method signature)
	*/

	app.IViewable.prototype.update = function(IModelable) {
		
		throw new AbstractMethodError(app.IViewable.prototype.update.errorMessage);
	};
	
	this.constructor.prototype.update.errorMessage = 'Method signature "update()" must be realized in implementing classes';
	
	
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
		
		innerHTML: 'Hello world'

		listeners:
		{
			click: function() {},

			blur: function() {}
		}
	*/

	var element = document.createElement(obj_specs.element), prop;
				
	if (obj_specs.attributes) {
	
		for (prop in obj_specs.attributes) {
			
			element.setAttribute(prop, obj_specs.attributes[prop]);
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

	if (obj_specs.listeners) {
	
		for (prop in obj_specs.listeners) {
			
			element.addEventListener(prop, obj_specs.listeners[prop]);
		}
	}

	return element;
};


/** Tests if object implements IViewable
*
* Default method for IViewables that only need to be able to report that they are indeed IViewables.
*
* Override in realizing classes if more advanced behaviour is required.
*
* @param {Function} interface The interface we wish to determine if this object implements
*
* @return {Boolean} true if object implements interface, otherwise false
*/

app.IViewable.prototype.default_isInstanceOf = function (Function_interface) {
	
	return Function_interface === app.IViewable;
};