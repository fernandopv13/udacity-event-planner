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
* (Interfaces implemented as mixins, using static method in IInterface.)
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
*/


app.View = function(Function_modelClass, str_elementId, str_heading) {
	
	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/

		var _className = (this.className ? this.className : 'View'), // name of this view class (override if provided by subclass constructor)

		_heading = str_heading, // content of the view's main heading

		_model = null, // the model currently displayed by the view, or null

		_modelClass = Function_modelClass, // the class of data model supported by this view (by function reference)
		
		_observers = [], // Array of IObservers receiving updates from this view, required in order to implement IObservable

		_parentList = [app.IInterfaceable, app.IObservable, app.IObserver, app.View], // list of interfaces implemented by this class (by function reference)

		_$renderContext = $('#' + str_elementId), // the HTML element the view will render itself into when updated (set in realizing classes)
		
		_super = (this.ssuper ? this.ssuper : Object); // reference to immediate parent class (by function) if provided by subclass, otherwise Object
		
		
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields (dependency injection enables access for subclasses)
	*---------------------------------------------------------------------------------------*/

		this.className = new app.Accessor(_className, true); // replace temporary literal with read-only accessor

		this.heading = new app.Accessor(_heading, false, 'string');

		this.model = new app.Accessor(_model, false, app.Model, 'Model');

		this.modelClass = new app.Accessor(_modelClass, true);

		this.observers = new app.Accessor(_observers, true);

		this.parentList = new app.Accessor(_parentList, true);

		this.$renderContext = new app.Accessor(_$renderContext, false);
		
		this.ssuper = new app.Accessor(_super, true); // 'super' may be a reserved word, so slight name change

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/
	
		_$renderContext.addClass('view'); // set shared view class on main HTML element
}


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

	void app.IInterfaceable.mixInto(app.IInterfaceable, app.View);

	void app.IInterfaceable.mixInto(app.IObservable, app.View);

	void app.IInterfaceable.mixInto(app.IObserver, app.View);


/*----------------------------------------------------------------------------------------
* Public class (static) fields
*---------------------------------------------------------------------------------------*/

	app.View.UIAction = {

		SIGNIN: 0,

		CANCEL: 1,

		CREATE: 2,

		DELETE: 3,

		NAVIGATE: 4,

		SELECT: 5,

		SUBMIT: 6
	}


/*----------------------------------------------------------------------------------------
* Public instance methods (implemented, on prototype)
*---------------------------------------------------------------------------------------*/

	/** Handles cancellation by user of navigation to current view  */

	app.View.prototype.cancel = function() {

		window.history.back(); // return to previous view

		this.notifyObservers(this, this.model(), app.View.UIAction.CANCEL);

		// for now, simply discard any entries made by user to an existing guest
	}


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

			//attributes: {}//role: 'button'}, //'aria-labelledby': str_buttonId},

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
			
			value: Date_date ? Date_date.toLocaleDateString('en-US') : '',
			
			readonly: true,

			//'aria-labelledby': str_dateId + '-label',

			//role: 'text'
		}

		if (bool_required) {attributes.required = true;}// attributes['aria-required'] = true;}

		innerDiv.appendChild(this.createElement( // input
		{
			element: 'input',			
			
			attributes: attributes,
			
			classList: ['validate', 'datepicker', 'picker__input']
		}));
		
		
		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_dateId, id: str_dateId + '-label'},
			
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
			
			value: email && email.address() ? email.address() : '',

			//'aria-labelledby': str_EmailId + '-label',

			//role: 'text'
		}

		if (bool_required) {attributes.required = true;}// attributes['aria-required'] = true;}

		innerDiv.appendChild(this.createElement( // input
		{
			element: 'input',			
			
			attributes: attributes,
			
			classList: ['validate']
		}));
		
		
		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_EmailId, id: str_EmailId + '-label'},
			
			classList: email && email.address() ? ['form-label', 'active'] : ['form-label'],
			
			dataset: {error: 'Please use format "address@server.domain"'},
			
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


		var attributes =
		{
			id: str_fieldId,

			type: 'number',

			value: int_value,

			//'aria-labelledby': str_fieldId + '-label',

			//role: 'text'
		}

		if (!isNaN(parseInt(int_min))) {attributes.min = int_min;}

		if (!isNaN(parseInt(int_max))) {attributes.max = int_max;}

		if (!isNaN(parseInt(int_step))) {attributes.step = int_step;}

		if (bool_required) {attributes.required = true;}// attributes['aria-required'] = true;}

		innerDiv.appendChild(this.createElement( // input
		{
			element: 'input',			
			
			attributes: attributes,
			
			classList: ['validate']
		}));
		
		
		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_fieldId, id: str_fieldId + '-label'},
			
			classList: int_value >= 0 ? ['form-label', 'active'] : ['form-label'],
			
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

				required: 'true',

				//'aria-required': true,

				//'aria-labelledby': str_passwordId + '-label',

				//role: 'text'
			},
			
			classList: ['validate']
		}));
		
		
		labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_passwordId, id: str_passwordId + '-label'},
			
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

			attributes: {id: str_hintsPrefix},//, 'aria-hidden': true},
			
			classList: ['col', str_width, 'hidden']
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
			
			classList: ['row', 'hidden']
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

				required: 'true',

				//'aria-required': true,

				//'aria-labelledby': str_confirmationId + '-label',

				//role: 'text'
			},
			
			classList: ['validate']
		}));
		
		
		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_confirmationId, id: str_confirmationId + '-label'},
			
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
			
			attributes: {id: str_buttonIdPrefix + '-cancel'},//, role: 'button', tabindex: 0},
			
			classList: ['waves-effect', 'waves-teal', 'btn-flat'],

			innerHTML: 'Cancel'
		}));
		
		
		var buttonElement =  this.createElement({ // submit button
			
			element: 'a',
			
			attributes: {id: str_buttonIdPrefix + '-submit'},//, role: 'button', tabindex: 0},
			
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

			attributes: {id: str_switchId + '-label'},

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

				var attr =
				{
					id: str_switchId,

					type: 'checkbox',

					//'aria-labelledby': str_switchId + '-label',

					//role: 'checkbox'
				};

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
			
			value: value ? value : '',

			//'aria-labelledby': str_fieldId + '-label',

			//role: 'text'
		}

		if (bool_required) {attributes.required = true;}// attributes['aria-required'] = true;}

		innerDiv.appendChild(this.createElement( // input
		{
			element: 'input',			
			
			attributes: attributes,
			
			classList: ['validate']
		}));
		
		
		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_fieldId, id: str_fieldId + '-label'},
			
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
			
			value: Date_date ?

				Date_date.toLocaleTimeString().split(' ')[0].split(':')[0] // hours

				+ ':'

				+ Date_date.toLocaleTimeString().split(' ')[0].split(':')[1] // minutes

				+ ' '

				+ Date_date.toLocaleTimeString().split(' ')[1] // am/pm

				: '',
			
			readonly: true,

			//'aria-labelledby': str_timeId + '-label',

			//role: 'text'
		}

		if (bool_required) {attributes.required = true;}// attributes['aria-required'] = true;}

		innerDiv.appendChild(this.createElement( // input
		{
			element: 'input',			
			
			attributes: attributes,
			
			classList: ['timepicker', 'picker__input']
		}));
		
		
		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_timeId, id: str_timeId + '-label'},
			
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

			//$field.attr('aria-invalid', true);
		}

		else { // valid

			$field.removeClass('invalid');

			//$field.attr('aria-invalid', false);

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
	*
	* @return {void}
	*
	* @todo investigate if changing 'aria-hidden' could do more of the work of hiding. (Checked jQuery source: hide() does not seem to change aria-hidden attribute.)
	*/

	app.View.prototype.hide = function(obj_options) {

		this.$renderContext().hide(obj_options ? obj_options : 'fast');

		this.$renderContext().addClass('hidden');

		//this.$renderContext().attr('aria-hidden', true);
	}


	/** Returns true if class is or extends the class, or implements the interface, passed in (by function reference)
	*
	* (See IInterfaceable for further documentation.)
	*/

	app.View.prototype.isInstanceOf = function (func_interface) {
		
		return this.parentList().indexOf(func_interface) > -1;
	};


	app.View.prototype.onLoad = function(nEvent) {

		return; // dummy method to make sure it's always available
	};
	
	
	/** Executes default shared behaviour for when a View has rendered itself */

	app.View.prototype.onRender = function() {

		return; // so far, better handled by subclasses, so no action
	}
	

	app.View.prototype.onUnLoad = function(nEvent) {

		return; // dummy method to make sure it's always available
	};



	/** Utility for dynamically rendering main navigation directly to the DOM
	*
	* (so we can hide it until we need it).
	*
	* @return {HTMLDivElement} DIV element
	*
	* @todo Make navigation (more) accessible e.g. to screen readers
	*/

	app.View.prototype.renderNavigation = function(str_logotype) {

		var menuItems = 
		[
			{
				text: 'Account Settings',

				href: '#!Settings',

				icon: 'settings'
			},

			{
				text: 'Account Profile',

				href: '#!Profile',

				icon: 'account_circle'
			},

			{
				text: 'About',

				href: '#!About',

				icon: 'info'
			},

			{
				text: 'Sign Out',

				href: '#!Sign Out',

				icon: 'power_settings_new'
			}
		]

		// Main container

			// Using 

			var containerDiv = this.createElement(
			{
				element: 'div',

				classList: ['navbar-fixed']
			});

		
		// 'More' dropdown

			// Trying to follow the example here for acccesibility of the dropdown:
			// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/How_to_build_custom_form_widgets#The_role_attribute

			var ULElement = this.createElement(
			{
				element: 'ul',

				attributes: {id: 'nav-dropdown'},//, role: 'menu'},

				classList: ['dropdown-content']
			});

			containerDiv.appendChild(ULElement);

			var listElement, anchorElement;

			menuItems.forEach(function(item) { //dropdown menu items

				anchorElement = this.createElement(
				{
					element: 'a',

					attributes: {href: item.href, title: item.text},

					innerHTML: item.text
				});

				listElement = this.createElement({element: 'li'});//, attributes: {role: 'menuitem'}});

				listElement.appendChild(anchorElement);

				ULElement.appendChild(listElement);

			}, this);


		// Main nav

			var navContainer =  this.createElement(
			{
				element: 'nav',

				attributes: {}//role:'navigation'}
			}); 

			containerDiv.appendChild(navContainer);

			var divElement = this.createElement( // top nav
			{
				element: 'div',

				classList: ['nav-wrapper']
			});

			navContainer.appendChild(divElement);

			divElement.appendChild(this.createElement(
			{
				element: 'a',

				attributes: {href: '#!'},

				classList: ['brand-logo'],

				innerHTML: str_logotype
			}));

			var iconElement = this.createElement( // 'hamburger' menu (icon)
			{
				element: 'i',

				classList: ['material-icons'],

				innerHTML: 'menu'
			});

			anchorElement = this.createElement(
			{
				element: 'a',

				attributes: {href: '#'},

				classList: ['button-collapse'],

				dataset: {activates: 'nav-side'}
			});

			anchorElement.appendChild(iconElement);

			divElement.appendChild(anchorElement);


			ULElement = this.createElement( // 'more' menu (desktop)
			{
				element: 'ul',

				classList: ['right', 'hide-on-med-and-down']
			});

			listElement = this.createElement({element: 'li'});

			iconElement = this.createElement(
			{
				element: 'i',

				classList: ['material-icons', 'left'],

				innerHTML: 'more_vert'
			});

			anchorElement = this.createElement(
			{
				element: 'a',

				attributes: {href: '#!', id: 'nav-dropdown-button'},

				classList: ['dropdown-button'],

				dataset: {activates: 'nav-dropdown'}
			});

			anchorElement.appendChild(iconElement);

			listElement.appendChild(anchorElement);

			ULElement.appendChild(listElement);

			divElement.appendChild(ULElement);


			ULElement = this.createElement( // delete icon
			{
				element: 'ul',

				classList: ['right', 'hidden']
			});

			iconElement = this.createElement(
			{
				element: 'i',

				classList: ['material-icons', 'left', 'modal-trigger'],

				innerHTML: 'delete'
			});

			listElement = this.createElement(
			{
				element: 'li',

				attributes: {id: 'nav-delete-icon'}
			});

			listElement.appendChild(iconElement);

			ULElement.appendChild(listElement);

			divElement.appendChild(ULElement);

 		
 		// Side nav ('drawer')
			
			ULElement = this.createElement(
			{
				element: 'ul',

				attributes: {id: 'nav-side'},//, role: 'menu'},

				classList: ['side-nav']
			});

			menuItems.forEach(function(item) {

				listElement = this.createElement({element: 'li'});

				anchorElement = this.createElement(
				{
					element: 'a',

					attributes: {href: item.href},//, role:'menuitem'},

					innerHTML: item.text
				});

				if (item.icon) {

					anchorElement.appendChild(this.createElement(
					{
						element: 'i',

						classList: ['material-icons', 'left'],

						innerHTML: item.icon
					}));
				}

				listElement.appendChild(anchorElement);

				ULElement.appendChild(listElement);

			}, this);

			divElement.appendChild(ULElement);


		// Render to DOM

			$('body').prepend(containerDiv);

		
		// Initialize

			$('.dropdown-button').dropdown( // Materialize dropdown needs this call when created dynamically
			{
				inDuration: 300,
				
				outDuration: 225,
				
				constrain_width: false, // Does not change width of dropdown to that of the activator
				
				hover: true, // Activate on hover
				
				gutter: 0, // Spacing from edge
				
				belowOrigin: false, // Displays dropdown below the button
				
				alignment: 'left' // Displays dropdown with edge aligned to the left of button
			});


			$('#nav-delete-icon').hide();

		
		// Add event handlers

			$('.button-collapse').sideNav(); // 'hamburger' menu

			
			$('#nav-dropdown, #nav-side').click(function(event) { // navigation selection

				$('.button-collapse').sideNav('hide');

				app.controller.onNavSelection(event);					
			});

		
		return containerDiv;
	}



	/** Utility for showing view in the UI on demand.
	*
	* Uses jQuery.show().
	*
	* @param Same as jQuery.show()
	*
	* @return {void}
	*
	* @todo investigate if changing 'aria-hidden' could do more of the work of showing. (Checked jQuery source: show() does not seem to change aria-hidden attribute.)
	*/

	app.View.prototype.show = function(obj_options) {

		this.$renderContext().show(obj_options ? obj_options : 'slow');

		this.$renderContext().removeClass('hidden');

		//this.$renderContext().attr('aria-hidden', false); // later, investigate if this could do more of the work of showing
	}


	/** Updates views when notified of changes to the data model.
	*
	* Views accept update notifications providing a single Model parameter.
	*
	* Required by IObservable. Default implementation to be used and/or overridden as needed by subclasses.
	*
	* @param {Model} m Model holding the information to be presented. Model class must match View's modelClass property. Otherwise View will ignore notification.
	*
	* @throws {AbstractMethodError} If attempting to invoke directly on abstract class
	*/

	app.View.prototype.update = function(Model_m) {
		
		if (Model_m && Model_m.isInstanceOf && Model_m.isInstanceOf(app.Model) && Model_m.constructor === this.modelClass()) { // correct Model subtype

			if (arguments.length === 1) { // correct method signature

				this.model(Model_m);

				this.render(Model_m);
			}
		}
	};


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

			this.displayValidation(event, str_emailId, 'Please enter in format "address@server.domain"', valid);
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