'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IViewable extends IObserable, IObserver
*********************************************************************************************/

/** @classdesc Main interface for the 'V' part of our MVC framework.
*
* Presents information from the data model in the UI. Handles all UI related work.
*
* Provides a number of default HTML (form) element factory, and form validation, methods.
*
* Extension of IObservable and IObserver implemented as mixins in realizing classes, using static method in IInterfaceable.
*
* IViewables must only notify observers as a direct result of user actions in the UI. Otherwise the MVC objects will likely enter an infinite update loop.
*
* @extends IObservable
*
* @extends IObserver
*
* @constructor
*
* @return Nothing. An interface cannot be instantiated.
*
* @throws {InstantiationError} If attempting to instantiate interface
*
* @author Ulrik H. Gade, February 2016
*/

app.IViewable = function() {
	
	/*----------------------------------------------------------------------------------------
	* Method signatures
	*---------------------------------------------------------------------------------------*/
	
	/** Update (i.e. render) UI on demand if passed an IModelable of the type this view observes. Otherwise ignores call.
	*
	* Overrides inherited IObserver method to limit acceptable parameter type to IModelable.
	*
	* @param {IModelable} obj Reference to the data model object to be rendered in the UI, or null (to reset the view).
	*
	* @return {void}
	*
	* @throws {AbstractMethodError} If attempting to invoke directly on interface
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

/** Factory method for creating date picker fields for forms
*
* @return {HTMLDivElement} DIV element
*/

app.IViewable.prototype.default_createDateField = function (str_width, str_dateId, str_label, bool_required, Date_date) {

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


/** Factory method for creating email fields for forms
*
* @return {HTMLDivElement} DIV element
*/

app.IViewable.prototype.default_createEmailField = function (str_width, str_EmailId, str_label, bool_required, Email_email) {

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
		
		dataset: {error: 'Please enter email in "address@server.domain" format'},
		
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

app.IViewable.prototype.default_createFieldDescription = function (str_description, bool_divider) {

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

app.IViewable.prototype.default_createHeading = function (str_width, str_heading) {

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

app.IViewable.prototype.default_createNumberField = function (str_width, str_fieldId, str_label, bool_required, int_value, int_min, int_max, int_step, str_errorMsg) {

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

app.IViewable.prototype.default_createPasswordField = function (str_width, str_passwordId, str_hintsPrefix, Account_account) {

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


app.IViewable.prototype.default_createPasswordConfirmationField = function (str_width, str_confirmationId) {

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

app.IViewable.prototype.default_createRequiredFieldExplanation = function () {

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

app.IViewable.prototype.default_createSubmitCancelButtons = function(str_buttonIdPrefix) {

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

app.IViewable.prototype.default_createSwitchField = function (str_width, str_switchId, str_label, bool_checked, str_on, str_off) {

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
		
		classList: ['input-field', 'col', 's' + (12 - parseInt(str_width.slice(1)))]
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

app.IViewable.prototype.default_createTextField = function (str_width, str_fieldId, str_label, bool_required, value) {

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

app.IViewable.prototype.default_createTimeField = function (str_width, str_timeId, str_label, bool_required, Date_date) {

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

app.IViewable.prototype.default_displayValidation = function(event, str_fieldId, str_errorMsg, bool_valid) {

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


/* Utility for hiding view in the UI on demand.
*
* Uses jQuery.show().
*
* @param Same as jQuery.hide()
*/

app.IViewable.prototype.default_hide = function(obj_options) {

	this.renderContext().hide(obj_options ? obj_options : 'fast');
}


/* Utility for showing view in the UI on demand.
*
* Uses jQuery.show().
*
* @param Same as jQuery.show()
*/

app.IViewable.prototype.default_show = function(obj_options) {

	this.renderContext().show(obj_options ? obj_options : 'slow');
}


/* Event handler for interactive validation of event capacity field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.IViewable.prototype.default_validateCapacity = function(event, str_capacityId) {
	
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


/* Event handler for interactive validation of email field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.IViewable.prototype.default_validateEmail = function(event, str_emailId, bool_required) {

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


/* Event handler for interactive validation of person name field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.IViewable.prototype.default_validateName = function(event, str_nameId, str_errorMsg, bool_required) {

	// Using HTML5 constraint validation to please my Udacity reviewers

	var valid = !$('#' + str_nameId)[0].validity.valueMissing;

	this.displayValidation(event, str_nameId, str_errorMsg, valid);

	return valid;
}


/* Event handler for interactive validation of password field.
*
* Includes support for dynamically updated password hints
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.IViewable.prototype.default_validatePassword = function(event, str_passwordId, str_hintsPrefix) {

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


/* Event handler for interactive validation of password confirmation field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.IViewable.prototype.default_validatePasswordConfirmation = function(event, str_passwordId, str_confirmationId) {

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