'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public abstract class View implements IInterfaceable IObservable IObserver
*********************************************************************************************/

/** @classdesc Abstract base class for the 'V' part of our MVC framework.
*
* Presents information from the data model in the UI. Handles all UI related work.
*
* Provides a number of default HTML (form) element factory, and form validation, methods.
*
* NOTE: Views must only notify observers as a direct result of user actions in the UI. Otherwise the MVC objects will likely enter an infinite update loop.
*
* @implements IInterface
*
* @implements IObservable
*
* @implements IObserver
*
* @constructor
*
* @return {View} Not supposed to be instantiated, except when extended by subclasses.
*
* @author Ulrik H. Gade, February 2016
*
* @todo refactor out separate reference modelId; redundant when we have direct reference to model
*/

app.View = function(Function_modelClass, str_elementId, str_heading) {
	
	/*----------------------------------------------------------------------------------------
	* Factory methods providing inheritable accessors for private class members (through dependency injection)
	*---------------------------------------------------------------------------------------*/
	
	/* Polymorphic factory method for creating inheritable accessors to private properties (values).
	*
	* param {Object} property The property to create an accessor for
	*
	* param {Object} type The primitive type required by the property. Optional, provided if type checking is required.
	*
	* param {Function} type Class (by function reference) required by the property. Optional, provided if type checking is required.
	*
	* param {String} className The name of the class required by the accessor, if any. Otherwise not required.
	*
	* return {Function} Accessor method for property. Both sets and gets, always returning the current value.
	*
	* throws {IllegalArgumentError} If one or more parameters are not of the type expected by the signature
	*
	* throws {ReferenceError} If no parameters are provided
	*/

	function Accessor(obj_prop, obj_type, str_className) {

		function Accessor_(obj_prop) { // basic unified accessor without type checking
			
			return function(obj_val) {

				if (obj_val) {obj_prop = obj_val;}

				return obj_prop; // objects from subclass have their own copy of the private var, and can access it
			;}
		}
		
		function Accessor__(obj_prop, obj_strnumboolsym) { // unified accessor with type checking for primitive types

			// check that type is primitive (bool, int, str, boo, symbol, undefined, null)

		;}

		
		function Accessor___(obj_prop, Function_type, str_className) {  // unified accessor with type checking for complex types (i.e. classes)

			// check that type is function, and class name provided
		;}

		
		// Parse params to invoke the polyphormic responce

		if (arguments.length === 1) {

			return Accessor_(obj_prop);
		}

		if (arguments.length === 2) {

			return Accessor__(obj_prop, obj_type);
		}

		else if (arguments.length === 3) {

			 return Accessor___(obj_prop, Function_type, str_className);
		}

		else {

			// throw error
		}

		
	};

	
	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/

	var _className, _heading, _model, _modelClass, _observers = [], _parentList = [app.IInterfaceable, app.IObservable, app.IObserver, app.View], _$renderContext;


	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields (dependency injection provides access for subclasses)
	*---------------------------------------------------------------------------------------*/

	this.classNameAccessor = new Accessor(_className);

	this.headingAccessor = new Accessor(_heading);

	this.modelAccessor = new Accessor(_model);

	this.modelClassAccessor = new Accessor(_modelClass);

	this.observersAccessor = new Accessor(_observers);

	this.parentListAccessor = new Accessor(_parentList);

	this.$renderContextAccessor = new Accessor(_$renderContext);


	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// No way of keeping these private if we want to access them in subclasses, so breaking encapsulation

	this.className = 'View'; // name of this view class

	this.heading = str_heading; // content of the view's main heading

	this.model = null; // the model currently displayed by the view, or null

	this.modelClass = Function_modelClass; // the class of data model supported by this view (by function reference)
	
	this.modelId = null; // id of the model object currently presented in the view, or null if none
	
	this.observers = []; // Array of IObservers receiving updates from this view

	this.parentList = [app.IInterfaceable, app.IObservable, app.IObserver, app.View]; // list of interfaces implemented by this class (by function reference)

	this.$renderContext = $('#' + str_elementId); // the HTML element the view will render itself into when updated (set in realizing classes)
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/
	
	this.$renderContext.addClass('view'); // set shared view class on main HTML element
}

/*----------------------------------------------------------------------------------------
Factories for 'inherited' instance methods using dependency injection.
Approach provides access to private variables in subclass
*---------------------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IInterfaceable, app.View);

void app.IInterfaceable.mixInto(app.IObservable, app.View);

void app.IInterfaceable.mixInto(app.IObserver, app.View);


/*----------------------------------------------------------------------------------------
* Public instance methods (abstract)
*---------------------------------------------------------------------------------------*/

/** Determine whether update notification broadcast by IObservable applies to this view.
*
* If the view is active, the type and id of the broadcast data model should match that currently being presented.
*
* If the view is inactive, only the type of the model needs to match.
*
* @param {IModelable} obj Reference to the data model object to be rendered in the UI, or null (to reset the view).
*
* @return {Boolean} True if this view should respond to the notification, otherwise false-
*
* @throws {AbstractMethodError} If attempting to invoke directly on abstract class
*/

app.View.prototype.doUpdate = function(IModelable) {
	
	throw new AbstractMethodError('Method signature "doUpdate()" must be realized in implementing classes');
};


/** Updates views when notified of changes to the data model.
*
* Required by IObservable. Dummy implementation to 'cheat' unit test framework. Realize in derived classes.
*
* @throws {AbstractMethodError} If attempting to invoke directly on abstract class
*/

app.View.prototype.update = function(IModelable) {
	
	throw new AbstractMethodError('Method signature "update()" must be realized in implementing classes');
};

/*----------------------------------------------------------------------------------------
* Public instance methods (implemented, on prototype)
*---------------------------------------------------------------------------------------*/

/** Factory method for creating floating main action button for views.
*
* Currently supports only buttons with a single action (Matrialize allows several actions per button).
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createFloatingActionButton = function (str_buttonId, str_icon, str_color, str_label) {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',

		//attributes: {style: 'bottom: 45px; right: 24px;'},
		
		classList: ['fixed-action-btn']
	});
	

	var anchorElement =  this.createElement( // inner div
	{
		element: 'a',

		attributes: {id: str_buttonId, title: str_label},
		
		classList: ['btn-floating', 'btn-large', str_color]
	});

	outerDiv.appendChild(anchorElement);


	anchorElement.appendChild(this.createElement(
	{
		element: 'i',

		classList: ['large', 'material-icons'],

		innerHTML: str_icon
	}));

	return outerDiv;
}


/** Factory method for creating date picker fields for forms
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createDateField = function (str_width, str_dateId, str_label, bool_required, Date_date) {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',
		
		classList: ['row']
	});


	var innerDiv =  this.createElement( // inner div
	{
		element: 'div',			
		
		classList: ['input-field', 'col', str_width]
	});
	
	outerDiv.appendChild(innerDiv);


	var attributes = 
	{
		type: 'text',
		
		id: str_dateId,
		
		value: Date_date ? Date_date.toLocaleDateString() : '',
		
		readonly: true
	}

	if (bool_required) {attributes.required = true;}

	innerDiv.appendChild(this.createElement( // input
	{
		element: 'input',			
		
		attributes: attributes,
		
		classList: ['validate', 'datepicker', 'picker__input']
	}));
	
	
	var labelElement = this.createElement( // label
	{	
		element: 'label',			
		
		attributes: {for: str_dateId},
		
		classList: Date_date ? ['form-label', 'active'] : ['form-label'],
		
		dataset: {error: 'Please enter date'},
		
		innerHTML: str_label
	});

	
	if (bool_required) {

		labelElement.appendChild(this.createElement( // required field indicator
		{
			element: 'span',

			classList: ['required-indicator'],

			innerHTML: '*'
		}));
	}

	innerDiv.appendChild(labelElement);

	
	innerDiv.appendChild(this.createElement( // custom error div
	{	
		element: 'div',			
		
		attributes: {id: str_dateId + '-error'},
		
		classList: ['custom-validate']
	}));
	
	
	return outerDiv;
}


/** Factory method for creating HTML element based on specs provided in JSON object.
*
* Relied on by other factory methods for consistent, basic element creation.
*
* (So, if some aspect of element creation fails, only this method will need to change.)
*
* @param {Object} JSON object literal containing specs of element to be created. Se comments in code for an example.
*
* @return {HTMLElement} HTML element
*/

app.View.prototype.createElement = function(obj_specs) {

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


/** Factory method for creating email fields for forms
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createEmailField = function (str_width, str_EmailId, str_label, bool_required, Email_email) {

	var email = Email_email;

	
	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',
		
		classList: ['row']
	});

	

	var innerDiv =  this.createElement( // inner div
	{
		element: 'div',			
		
		classList: ['input-field', 'col', str_width]
	});

	outerDiv.appendChild(innerDiv);
	

	var attributes = 
	{
		type: 'email',
		
		id: str_EmailId,
		
		value: email && email.address() ? email.address() : ''
	}

	if (bool_required) {attributes.required = true;}

	innerDiv.appendChild(this.createElement( // input
	{
		element: 'input',			
		
		attributes: attributes,
		
		classList: ['validate']
	}));
	
	
	var labelElement = this.createElement( // label
	{	
		element: 'label',			
		
		attributes: {for: str_EmailId},
		
		classList: email && email.address() ? ['form-label', 'active'] : ['form-label'],
		
		dataset: {error: 'Must be like "address@server.domain"'},
		
		innerHTML: str_label
	});

	
	if (bool_required) {

		labelElement.appendChild(this.createElement( // required field indicator
		{
			element: 'span',

			classList: ['required-indicator'],

			innerHTML: '*'
		}));
	}

	innerDiv.appendChild(labelElement);

	
	return outerDiv;
}


/** Factory method for creating field descriptions for forms
*
* @param {String} description Description of the field
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createFieldDescription = function (str_description, bool_divider) {

	var innerDiv =  this.createElement( // inner div for description
		{
			element: 'div',			
			
			classList: ['col', 's12']
		});

	innerDiv.appendChild(this.createElement( // description
	{	
		element: 'p',

		classList: ['form-label', 'input-field-description'],

		innerHTML: str_description

	}));

	if (bool_divider) { // defaults to no divider

		innerDiv.appendChild(this.createElement({ // divider

			element: 'div',

			classList: ['divider']
		}));
	}

	return innerDiv;
}


/** Factory method for creating the main heading in forms
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createHeading = function (str_width, str_heading) {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',			
		
		classList: ['row']
	});

	var innerDiv =  this.createElement( // inner div
	{
		element: 'div',			
		
		classList: ['col', str_width]
	});

	innerDiv.appendChild(this.createElement({

		element: 'h4',

		innerHTML: str_heading

	}));

	outerDiv.appendChild(innerDiv);
	
	return outerDiv;
}


/** Factory method for creating number fields for forms
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createNumberField = function (str_width, str_fieldId, str_label, bool_required, int_value, int_min, int_max, int_step, str_errorMsg) {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',
		
		classList: ['row']
	});


	var innerDiv =  this.createElement( // inner div
	{
		element: 'div',			
		
		classList: ['input-field', 'col', str_width]
	});
	
	outerDiv.appendChild(innerDiv);


	var attributes = {type: 'number', id: str_fieldId, value: int_value}

	if (!isNaN(parseInt(int_min))) {attributes.min = int_min;}

	if (!isNaN(parseInt(int_max))) {attributes.max = int_max;}

	if (!isNaN(parseInt(int_step))) {attributes.step = int_step;}

	if (bool_required) {attributes.required = true;}

	innerDiv.appendChild(this.createElement( // input
	{
		element: 'input',			
		
		attributes: attributes,
		
		classList: ['validate']
	}));
	
	
	var labelElement = this.createElement( // label
	{	
		element: 'label',			
		
		attributes: {for: str_fieldId},
		
		classList: int_value ? ['form-label', 'active'] : ['form-label'],
		
		dataset: {error: str_errorMsg},
		
		innerHTML: str_label
	});

	
	if (bool_required) {

		labelElement.appendChild(this.createElement( // required field indicator
		{
			element: 'span',

			classList: ['required-indicator'],

			innerHTML: '*'
		}));
	}

	innerDiv.appendChild(labelElement);


	return outerDiv;
}


/** Factory method for creating password entry fields for forms.
*
* Includes markup for interactively updated password hints.
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createPasswordField = function (str_width, str_passwordId, str_hintsPrefix, Account_account) {

	var account = Account_account, outerDiv, innerDiv, labelElement, pElement;

	outerDiv =  this.createElement( // outer div
	{
		element: 'div',
		
		classList: ['row']
	});
				
	
	innerDiv =  this.createElement( // inner div
	{
		element: 'div',			
		
		classList: ['input-field', 'col', str_width]
	});
	
	outerDiv.appendChild(innerDiv);


	innerDiv.appendChild(this.createElement( // input
	{
		element: 'input',			
		
		attributes:
		{
			type: 'text',
			
			id: str_passwordId,
			
			value: account && account.password() && account.password().password() ? account.password().password() : '',

			required: 'true'
		},
		
		classList: ['validate']
	}));
	
	
	labelElement = this.createElement( // label
	{	
		element: 'label',			
		
		attributes: {for: str_passwordId},
		
		classList: account && account.password() && account.password().password() ? ['form-label', 'active'] : ['form-label'],
		
		dataset: {error: 'Please enter a valid password', success: 'Password is valid'},
		
		innerHTML: 'Password'
	});
	
	labelElement.appendChild(this.createElement( // required field indicator
	{
		element: 'span',

		classList: ['required-indicator'],

		innerHTML: '*'
	}));

	innerDiv.appendChild(labelElement);

	
	innerDiv =  this.createElement( // inner div (for validation hits)
	{
		element: 'div',

		attributes: {id: str_hintsPrefix},
		
		classList: ['col', str_width]
	});

	outerDiv.appendChild(innerDiv);


	pElement = this.createElement(
	{
		element: 'p',

		attributes: {id: str_hintsPrefix + '-charcount'},

		classList: ['password-validation-hint'],

		innerHTML: 'Must be at least 8 characters long'
	});

	pElement.appendChild(this.createElement(
	{
		element: 'i',

		classList: ['material-icons', 'left'],

		innerHTML: 'error'
	}));

	innerDiv.appendChild(pElement);

	
	pElement = this.createElement(
	{
		element: 'p',

		attributes: {id: str_hintsPrefix + '-uppercase'},

		classList: ['password-validation-hint'],

		innerHTML: 'Must contain Upper Case characters'
	});

	pElement.appendChild(this.createElement(
	{
		element: 'i',

		classList: ['material-icons', 'left'],

		innerHTML: 'error'
	}));

	innerDiv.appendChild(pElement);


	pElement = this.createElement(
	{
		element: 'p',

		attributes: {id: str_hintsPrefix + '-lowercase'},

		classList: ['password-validation-hint'],

		innerHTML: 'Must contain lower case characters'
	});

	pElement.appendChild(this.createElement(
	{
		element: 'i',

		classList: ['material-icons', 'left'],

		innerHTML: 'error'
	}));

	innerDiv.appendChild(pElement);
	

	pElement = this.createElement(
	{
		element: 'p',

		attributes: {id: str_hintsPrefix + '-number'},

		classList: ['password-validation-hint'],

		innerHTML: 'Must contain numbers'
	});

	pElement.appendChild(this.createElement(
	{
		element: 'i',

		classList: ['material-icons', 'left'],

		innerHTML: 'error'
	}));

	innerDiv.appendChild(pElement);


	pElement = this.createElement(
	{
		element: 'p',

		attributes: {id: str_hintsPrefix + '-punctuation'},

		classList: ['password-validation-hint'],

		innerHTML: 'Must contain one or more of !@#$%^&'
	});

	pElement.appendChild(this.createElement(
	{
		element: 'i',

		classList: ['material-icons', 'left'],

		innerHTML: 'error'
	}));

	innerDiv.appendChild(pElement);


	pElement = this.createElement(
	{
		element: 'p',

		attributes: {id: str_hintsPrefix + '-illegal'},

		classList: ['password-validation-hint'],

		innerHTML: 'Must not contain illegal characters'
	});

	pElement.appendChild(this.createElement(
	{
		element: 'i',

		classList: ['material-icons', 'left'],

		innerHTML: 'error'
	}));

	innerDiv.appendChild(pElement);
	
	
	return outerDiv;
};


/** Factory method for creating password confirmation fields for forms
*
* @return {HTMLDivElement} DIV element
*/


app.View.prototype.createPasswordConfirmationField = function (str_width, str_confirmationId) {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',

		attributes: {id: str_confirmationId + '-parent'},
		
		classList: ['row']
	});
				
	
	var innerDiv =  this.createElement( // inner div
	{
		element: 'div',			
		
		classList: ['input-field', 'col', str_width]
	});

	outerDiv.appendChild(innerDiv);
	

	innerDiv.appendChild(this.createElement( // input
	{
		element: 'input',			
		
		attributes:
		{
			type: 'text',
			
			id: str_confirmationId,
			
			value: '',

			required: 'true'
		},
		
		classList: ['validate']
	}));
	
	
	var labelElement = this.createElement( // label
	{	
		element: 'label',			
		
		attributes: {for: str_confirmationId},
		
		classList: ['form-label'],
		
		dataset: {error: 'Please confirm password', succes: 'Matches password'},
		
		innerHTML: 'Confirm Password'
	});
	
	labelElement.appendChild(this.createElement( // required field indicator
	{
		element: 'span',

		classList: ['required-indicator'],

		innerHTML: '*'
	}));

	innerDiv.appendChild(labelElement);

	
	return outerDiv;
};


/** Factory method for creating required field explanations for forms
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createRequiredFieldExplanation = function () {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',			
		
		classList: ['row']
	});
	
	outerDiv.appendChild(this.createElement({
	
		element: 'p',
		
		classList: ['required-indicator'],
			
		innerHTML: '* indicates a required field'
	}));
				
	
	return outerDiv;
}


/** Factory method for creating submit and cancel buttons for forms
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createSubmitCancelButtons = function(str_buttonIdPrefix) {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',			
		
		classList: ['row', 'form-submit']
	});
	
	
	outerDiv.appendChild(this.createElement({ // cancel button
		
		element: 'a',
		
		attributes: {id: str_buttonIdPrefix + '-cancel'},
		
		classList: ['waves-effect', 'waves-teal', 'btn-flat'],

		innerHTML: 'Cancel'
	}));
	
	
	var buttonElement =  this.createElement({ // submit button
		
		element: 'a',
		
		attributes: {id: str_buttonIdPrefix + '-submit'},
		
		classList: ['waves-effect', 'waves-light', 'btn'],

		innerHTML: 'Done'
	});
	
	
	buttonElement.appendChild(this.createElement({ // 'send' icon
		
		element: 'i',
		
		classList: ['material-icons', 'right'],
		
		innerHTML: 'send'
	}));
	
	
	outerDiv.appendChild(buttonElement);


	return outerDiv
}


/** Factory method for creating switch (checkbox) fields for forms
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createSwitchField = function (str_width, str_switchId, str_label, bool_checked, str_on, str_off) {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',

		classList: ['row']
	});

	
	var innerDiv =  this.createElement( // inner div for main switch label
	{
		element: 'div',			
		
		classList: ['col', str_width]
	});

	outerDiv.appendChild(innerDiv);


	innerDiv.appendChild(this.createElement( // main switch label
	{	
		element: 'span',

		classList: ['form-label', 'input-switch-label'],

		innerHTML: str_label

	}));

	
	innerDiv =  this.createElement( // inner div for switch widget
	{
		element: 'div',			
		
		classList: ['switch-container', 'col', 's' + (12 - parseInt(str_width.slice(1)))]
	});

	outerDiv.appendChild(innerDiv);
	
	
	var switchElement = this.createElement( // switch div
	{
		element: 'div',
		
		classList: ['switch']
	});

	innerDiv.appendChild(switchElement);
	
	
	var spanElement = this.createElement({ // div holding switch widget itself

		element: 'span',

		classList: ['input-switch-widget']
	});

	switchElement.appendChild(spanElement);


	var labelElement = this.createElement( // label
	{	
		element: 'label',			
		
		attributes: {for: str_switchId},
		
		classList: ['form-label', 'active']
	});
	
	
	labelElement.appendChild(this.createElement( // 'not selected' minor label
	{	
		element: 'span',

		classList: ['form-label', 'input-switch-off-label'],

		innerHTML: str_off ? str_off : 'No'

	}));

	
	labelElement.appendChild(this.createElement( // input
	{	
		element: 'input',			
		
		attributes: (function(){

			var attr = {id: str_switchId, type: 'checkbox'};

			if (bool_checked) {attr.checked = true;}

			return attr;
		})()
	}));

	
	labelElement.appendChild(this.createElement( // span
	{	
		element: 'span',
		
		classList: ['lever']
	}));

	
	labelElement.appendChild(this.createElement( // 'selected' minor label
	{	
		element: 'span',

		classList: ['form-label', 'input-switch-on-label'],

		innerHTML: str_on ? str_on : 'Yes'

	}));

	spanElement.appendChild(labelElement);

	return outerDiv;
};


/** Factory method for creating text input fields for forms
*
* @return {HTMLDivElement} DIV element
*
* @todo Add ability to also handle elements with datalists (e.g. event location)
*/

app.View.prototype.createTextField = function (str_width, str_fieldId, str_label, bool_required, value) {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',
		
		classList: ['row']
	});

	

	var innerDiv =  this.createElement( // inner div
	{
		element: 'div',			
		
		classList: ['input-field', 'col', str_width]
	});

	outerDiv.appendChild(innerDiv);
	

	var attributes = 
	{
		type: 'text',
		
		id: str_fieldId,
		
		value: value ? value : ''
	}

	if (bool_required) {attributes.required = true;}

	innerDiv.appendChild(this.createElement( // input
	{
		element: 'input',			
		
		attributes: attributes,
		
		classList: ['validate']
	}));
	
	
	var labelElement = this.createElement( // label
	{	
		element: 'label',			
		
		attributes: {for: str_fieldId},
		
		classList: value ? ['form-label', 'active'] : ['form-label'],
		
		dataset: {error: 'Please enter ' + str_label.toLowerCase()},
		
		innerHTML: str_label
	});

	
	if (bool_required) {

		labelElement.appendChild(this.createElement( // required field indicator
		{
			element: 'span',

			classList: ['required-indicator'],

			innerHTML: '*'
		}));
	}

	innerDiv.appendChild(labelElement);

	
	return outerDiv;
}


/** Factory method for creating time picker fields for forms
*
* @return {HTMLDivElement} DIV element
*/

app.View.prototype.createTimeField = function (str_width, str_timeId, str_label, bool_required, Date_date) {

	var outerDiv =  this.createElement( // outer div
	{
		element: 'div',
		
		classList: ['row']
	});


	var innerDiv =  this.createElement( // inner div
	{
		element: 'div',			
		
		classList: ['input-field', 'col', str_width]
	});
	
	outerDiv.appendChild(innerDiv);

	var attributes = 
	{
		type: 'text',
		
		id: str_timeId,
		
		value: Date_date ? Date_date.toLocaleTimeString() : '',
		
		readonly: true
	}

	if (bool_required) {attributes.required = true;}

	innerDiv.appendChild(this.createElement( // input
	{
		element: 'input',			
		
		attributes: attributes,
		
		classList: ['timepicker', 'picker__input']
	}));
	
	
	var labelElement = this.createElement( // label
	{	
		element: 'label',			
		
		attributes: {for: str_timeId},
		
		classList: Date_date ? ['form-label', 'active'] : ['form-label'],
		
		dataset: {error: 'Please enter time'},
		
		innerHTML: str_label
	});
	

	if (bool_required) {

		labelElement.appendChild(this.createElement( // required field indicator
		{
			element: 'span',

			classList: ['required-indicator'],

			innerHTML: '*'
		}));
	}

	innerDiv.appendChild(labelElement);
	
	innerDiv.appendChild(this.createElement( // custom error div
	{	
		element: 'div',			
		
		attributes: {id: str_timeId + '-error'},
		
		classList: ['custom-validate']
	}));

	
	return outerDiv;
}


/* Utility for displaying and hiding field error messages during interactive form validation
*
*/

app.View.prototype.displayValidation = function(event, str_fieldId, str_errorMsg, bool_valid) {

	var $field = $('#' + str_fieldId);

	if (!bool_valid) { // not valid, display validation error

		if (event && event.target && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = str_errorMsg;

		}

		else { // Other browsers (updated value may not display, falls back on value in HTML)

			$field.next('label').data('error', str_errorMsg);
		}
		
		$field.addClass('invalid');
	}

	else { // valid

		$field.removeClass('invalid');

		if (event && event.target && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = str_errorMsg; // can't get jQuery.data() to work
		}

		else { // Other browsers (updates value but not display, falls back on value in HTML)

			$field.next('label').data('error', str_errorMsg);
		}
	}
};


/** Utility for hiding view in the UI on demand.
*
* Uses jQuery.hide().
*
* @param Same as jQuery.hide()
*/

app.View.prototype.hide = function(obj_options) {

	this.$renderContext.hide(obj_options ? obj_options : 'fast');
}


/** Returns true if class implements the interface passed in (by function reference)
*
* (See IInterfaceable for further documentation.)
*/

app.View.prototype.isInstanceOf = function (func_interface) {
	
	return this.parentList.indexOf(func_interface) > -1;
};


/** Utility for showing view in the UI on demand.
*
* Uses jQuery.show().
*
* @param Same as jQuery.show()
*/

app.View.prototype.show = function(obj_options) {

	this.$renderContext.show(obj_options ? obj_options : 'slow');
}


/** Event handler for interactive validation of event capacity field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.View.prototype.validateCapacity = function(event, str_capacityId) {
	
	// Using HTML5 constraint validation to please my Udacity reviewers

	var validity = $('#' + str_capacityId)[0].validity;

	
	if (validity.valueMissing) { // empty

		this.displayValidation(event, str_capacityId, 'Please enter capacity', false);
	}

	// no need to test for non-numbers, not programmatically available from DOM anyway
	
	else if (validity.rangeUnderflow) { // negative number

		this.displayValidation(event, str_capacityId, 'Capacity cannot be negative', false);
	}
	
	else { // valid

		this.displayValidation(event, str_capacityId, 'Please enter capacity', true);

		return true;
	}

	return false;
};


/** Event handler for interactive validation of email field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.View.prototype.validateEmail = function(event, str_emailId, bool_required) {

	/* Tried the HTML5 email validity constraint but found it too lax
	*
	* (it does not require a period or much else after the @), so rolling my own.
	*
	* See unit test for Email class using com_github_dominicsayers_isemail.tests for details.
	*/

	var $email = $('#' + str_emailId),

	email = $email.val(),

	testMail = new app.Email(email),

	valid = testMail.isValid();


	if (email !== '') { // always validate email if it exists

		this.displayValidation(event, str_emailId, 'Must be same format as "address@server.domain"', valid);
	}

	else if (bool_required) { // no entry, require if required(!)

		this.displayValidation(event, str_emailId, 'Please enter email', false);

		return valid || !bool_required; // empty is OK if not required
	}
	
	return valid;
};


/** Event handler for interactive validation of person name field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.View.prototype.validateName = function(event, str_nameId, str_errorMsg, bool_required) {

	// Using HTML5 constraint validation to please my Udacity reviewers

	var valid = !$('#' + str_nameId)[0].validity.valueMissing;

	this.displayValidation(event, str_nameId, str_errorMsg, valid);

	return valid;
}


/** Event handler for interactive validation of password field.
*
* Includes support for dynamically updated password hints
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.View.prototype.validatePassword = function(event, str_passwordId, str_hintsPrefix) {

	/* Relying solely on HTML5 constraint validation here would require me to write a compound regex
	*
	* meeting all the requirements of the individial static validation functions in the Password class.
	*
	* This is too much of a headache both to create and maintain. So relying directly on Password instead.
	*/

	var password = $('#' + str_passwordId).val(), ret = true, tmp;


	// Validate password and manage display of password hints

	var tests = 
	{
		charcount: app.Password.hasValidCharacterCount,

		uppercase: app.Password.hasValidUpperCaseCount,

		lowercase: app.Password.hasValidLowerCaseCount,

		number: app.Password.hasValidNumberCount,

		punctuation: app.Password.hasValidPunctuationCount,

		illegal: app.Password.hasIllegalCharacters
	}

	for (var prop in tests) { // iterate through tests

		tmp = tests[prop](password); // run test

		if (prop === 'illegal') { // this reverses the logic, and has a non-Boolean return, so deal separately

			ret = ret && tmp === null; // add up results

			$('#' + str_hintsPrefix + '-' + prop).find('i').html(tmp ? 'error' : 'done'); // display icon
		}

		else { // the rest are all the same

			ret = ret && tmp; // add up results

			$('#' + str_hintsPrefix + '-' + prop).find('i').html(tmp ? 'done' : 'error'); // display icon
		}
	}

	
	// Display validation message (or not)

	this.displayValidation(

		event,

		str_passwordId,

		tmp !== null ? 'This character is not allowed: ' + tmp[0] : (password !== '' ? 'Invalid password' : 'Please enter password'),

		ret
	);


	return ret;
};


/** Event handler for interactive validation of password confirmation field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.View.prototype.validatePasswordConfirmation = function(event, str_passwordId, str_confirmationId) {

	// Skips validation if password isn't 'dirty' (i.e. changed since the view loaded)

	var valid = $('#' + str_confirmationId).val() === $('#' + str_passwordId).val() || !this.isPasswordDirty;

	this.displayValidation(

		event,

		str_confirmationId,

		'Must be the same as password',

		valid
	);

	return valid;
};