'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public Interface IViewable extends IObserable, IObserver
*********************************************************************************************/

/** @classdesc Main interface for the 'V' part of our MVC framework.
*
* Presents information from the data model in the UI. Handles all UI related work.
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

/** Utility for creating HTML element based on specs provided in JSON object
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



/** Utility for creating field descriptions when generating form elements
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


/** Utility for creating password entry field for forms
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
		
		dataset: {error: 'Please enter password'},
		
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
	
	
	return outerDiv;
};


/** Utility for creating password confirmation field for forms
*
* @return {HTMLDivElement} DIV element
*/

app.IViewable.prototype.default_createPasswordConfirmationField = function (str_width, str_confirmationId) {

	var outerDiv, innerDiv, labelElement;

	
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
			
			id: str_confirmationId,
			
			value: '',

			required: 'true'
		},
		
		classList: ['validate']
	}));
	
	
	labelElement = this.createElement( // label
	{	
		element: 'label',			
		
		attributes: {for: str_confirmationId},
		
		classList: ['form-label'],
		
		dataset: {error: 'Please confirm password'},
		
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


/** Tests if object implements IViewable
*
* Default method for IViewables that only need to be able to report that they are indeed IViewables.
*
* Override in realizing classes if more advanced behaviour is required.
*
* @param {Function} interface The interface we wish to determine if this object implements
*
* @return {Boolean} true if object implements interface, otherwise false
*
* @todo Refactor to method signature
*/

app.IViewable.prototype.default_isInstanceOf = function (Function_interface) {
	
	return Function_interface === app.IViewable;
};


/* Event handler for interactive validation of password field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.IViewable.prototype.default_validatePassword = function(event, str_passwordId, str_hintsPrefix) {

	//if (arguments.length < 3) {return false}; // initial focus fires invalid call, ignore
	

	var $password = $('#' + str_passwordId), password = $password.val(), ret, tmp;


	// Validate password and manage display of password hints

	var invalidIcon = 'error', validIcon = 'done'

	tmp = app.Password.hasValidCharacterCount(password);

	ret = tmp;

	if (tmp) {$('#' + str_hintsPrefix + '-charcount').find('i').html(validIcon);}

	else {$('#' + str_hintsPrefix + '-charcount').find('i').html(invalidIcon);}

			
	tmp = app.Password.hasValidUpperCaseCount(password);

	ret = ret && tmp;

	if (tmp) {$('#' + str_hintsPrefix + '-uppercase').find('i').html(validIcon);}

	else {$('#' + str_hintsPrefix + '-uppercase').find('i').html(invalidIcon);}


	tmp = app.Password.hasValidLowerCaseCount(password);

	ret = ret && tmp;

	if (tmp) {$('#' + str_hintsPrefix + '-lowercase').find('i').html(validIcon);}

	else {$('#' + str_hintsPrefix + '-lowercase').find('i').html(invalidIcon);}

	
	tmp = app.Password.hasValidNumberCount(password);

	ret = ret && tmp;

	if (tmp) {$('#' + str_hintsPrefix + '-number').find('i').html(validIcon);}

	else {$('#' + str_hintsPrefix + '-number').find('i').html(invalidIcon);}


	tmp = app.Password.hasValidPunctuationCount(password);

	ret = ret && tmp;

	if (tmp) {$('#' + str_hintsPrefix + '-punctuation').find('i').html(validIcon);}

	else {$('#' + str_hintsPrefix + '-punctuation').find('i').html(invalidIcon);}


	// Manage display of validation message

	var msg = 'Invalid password';

	if (!ret) { // not valid, display validation error

		if (event && event.target && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = msg;

		}

		else { // Other browsers (updated value may not display, falls back on value in HTML)

			$password.next('label').data('error', msg);
		}
		
		$password.addClass('invalid');
	}

	else { // valid

		$password.removeClass('invalid');

		if (event && event.target && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = msg; // can't get jQuery.data() to work
		}

		else { // Other browsers (updates value but not display, falls back on value in HTML)

			$password.next('label').data('error', msg);
		}
	}

	return ret;
};


/* Event handler for interactive validation of password confirmation field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.IViewable.prototype.default_validatePasswordConfirmation = function(event, str_passwordId, str_confirmationId) {

	var $confirmation = $('#' + str_confirmationId),

	confirmation = $confirmation.val(),

	password = $('#' + str_passwordId).val(),

	msg = 'Must be the same as password';


	// Manage display of validation message

	if (confirmation !== password) { // not valid, display validation error

		if (event && event.target && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = msg;

		}

		else { // Other browsers (updated value may not display, falls back on value in HTML)

			$confirmation.next('label').data('error', msg);
		}
		
		$confirmation.addClass('invalid');
	}

	else { // valid

		$confirmation.removeClass('invalid');

		if (event && event.target && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = msg; // can't get jQuery.data() to work
		}

		else { // Other browsers (updates value but not display, falls back on value in HTML)

			$confirmation.next('label').data('error', msg);
		}

		return true;
	}

	return false;
};