'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public abstract class View implements IInterfaceable IObservable IObserver
*********************************************************************************************/

/** @classdesc Abstract base class for the 'V' part of our MVC framework.
*
* Presents information from the data model in the UI. Handles all work directly related to the UI.
*
* Provides a number of default HTML (form) element factory, and validation, methods.
*
* NOTE: Views must only notify observers as a direct result of user actions in the UI.
*
* Otherwise the MVC objects will likely enter an infinite update loop.
*
* (Interfaces are implemented as mixins, using static method in IInterface.)
*
* @implements IInterface
*
* @implements IObservable
*
* @implements IObserver
*
* @constructor
*
* @param {Function} modelClass The class (by function refeence) of the type of Model the View is designed to work with, or null
*
* @param {String} elementId Id of the HTML element this View will render itself into.
*
* @param {String} heading The content (text) of the View's heading
*
* @return {View} Not supposed to be instantiated, except when extended by subclasses. But subclasses need to be able to call constructor when setting up inheritance.
*
* @author Ulrik H. Gade, March 2016
*
* @todo Break up into many more smaller chunks. Find a nice design pattern that supports this.
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

		/** Gets name of the View's class (read-only).
		*
		* @return {String} className The name of the View's class
		*
		* @throws {IllegalArgumentError} If trying to set the className.
		*/

		this.className = new app.Accessor(_className, true); // replace temporary literal with read-only accessor

		
		/** Gets or sets the View's heading
		*
		* @param {String} heading The content (text) of the heading
		*
		* @return {String} heading The content (text) of the heading
		*
		* @throws {IllegalArgumentError} If trying to set a heading that is not a string
		*/
		
		this.heading = new app.Accessor(_heading, false, 'string');

		
		/** Gets or sets the Model currently associated with (being displayed in) the View
		*
		* @param {Model} model The Model
		*
		* @return {Model} model The Model
		*
		* @throws {IllegalArgumentError} If trying to set a model that is not an instance of Model
		*/

		this.model = new app.Accessor(_model, false, app.Model, 'Model');

		
		/** Gets the class (by function reference) of the type of Model the View is designed to work with, or null
		*
		* @return {String} modelClass The type (class) of Model required
		*
		* @throws {IllegalArgumentError} If trying to set the modelClass
		*/

		this.modelClass = new app.Accessor(_modelClass, true);

		
		/** Gets the collection of IObservers currently registered with the View
		*
		* @return {Array} observers An array of IObservers
		*
		* @throws {IllegalArgumentError} If trying to set the observers array
		*/

		this.observers = new app.Accessor(_observers, true);

		
		/** Gets a collection of classes or 'interfaces' (by function reference) the object extends or implements. Includes the class of the object itself.
		*
		* @return {Array} parentList An array of functions
		*
		* @throws {IllegalArgumentError} If trying to set the parentList array
		*/

		this.parentList = new app.Accessor(_parentList, true);

		
		/** Gets or sets the render context (i.e. the HTML element the View will render itself into)
		*
		* @param {String} elementId Id of the HTML element this View will render itself into.
		*
		* @return {String} elementId The id of the render context
		*
		* @throws {IllegalArgumentError} If trying to set a render context that is not a string
		*/
		
		this.$renderContext = new app.Accessor(_$renderContext, false);
		
		
		/** Gets a reference to the object's parent (by function reference) in the class inheritance hierarchy (the topmost class is Object)
		*
		* @return {Function} ssuper The parent class
		*
		* @throws {IllegalArgumentError} If trying to set the ssuper attribute
		*
		* @todo Not fully functional; only works one level up from the lowest level in the tree
		*/

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

		// for now, simply discard any entries made by user to an existing view
	}


	/** Factory method for creating date picker fields for forms
	*
	* Uses a slightly customized version of Eonasdan's bootstrap-datetimepicker:
	* https://github.com/Eonasdan/bootstrap-datetimepicker
	* http://eonasdan.github.io/bootstrap-datetimepicker/
	*
	* Design goals:
	* 1. Present a pleasant, coherent visual experience to sighted users using modern technology
	* 2. Provide rich interaction for those who are physically and technically able, and want, to use it
	* 3. On lap/desktops, allow people to type in using the keyboard if they prefer that efficiency
	* 4. Support users relying on assistive technologies (e.g. screen readers)
	* 5. Provide a graceful, functional fallback for all other cases
	*
	* Assumptions (after investigation):
	* 1. The native datetime picker widgets on mobile (tested on Android and iOS), have excellent visual/interaction design, and acceptable accessibility; so only use custom widget when native support is unavailable
	* 2. Even when supported, the datetime-local widgets on (Windows) lap/desktops are a bad design fit for the app's reliance on Materialize.css and/or have unsatisfying visual/interaction design; so always override with custom widget
	* 3. Keyboard entry is a primary input method on lap/desktops, on mobile (touch) alternatives are preferable
	* 4. It is acceptable to not provide a fully accessible version of the custom date picker widget, as long as people using assistive tech can enter directly into the input field unhindered and undisturbed by the widget
	*
	* @return {HTMLDivElement} DIV element
	*/

	app.View.prototype.createDateField = function (str_width, str_dateId, str_label, bool_required, Date_d, str_errorMsg, str_customValidator) {

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
			type: 'datetime-local',
			
			id: str_dateId,
			
			value: Date_d ? Date_d.toISOString().replace('Z', '') : '',

			//readonly: true,

			'aria-labelledby': str_dateId + '-label',

			role: 'textbox'
		}

		if (bool_required) {attributes.required = true; attributes['aria-required'] = true;}

		
		var classList = ['datetimepicker-input'];

		if(bool_required) {classList.push('validate');}

		var dataset = {value: Date_d ? Date_d.toISOString().replace('Z', '') : ''};

		if (str_customValidator) {dataset.customValidator = str_customValidator;}

		innerDiv.appendChild(this.createElement( // input
		{
			element: 'input',			
			
			attributes: attributes,
			
			classList: classList, //['datetimepicker-input'],//, 'validate'], //, 'datepicker', 'picker__input'] // the 'validate' class seems to cause strange behaviour, so dropping it

			dataset: dataset
		}));


		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_dateId, id: str_dateId + '-label'},
			
			classList: Date_d ? ['form-label', 'active'] : ['form-label'],
			
			dataset: {error: str_errorMsg ? str_errorMsg : 'Please use format mm/dd/yyyy hh:mm'},
			
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

		
		/*
		innerDiv.appendChild(this.createElement( // custom error div
		{	
			element: 'div',			
			
			attributes: {id: str_dateId + '-error'},
			
			classList: ['custom-validate']
		}));
		*/
		
		
		return outerDiv;
	}

	/* old code using picker.js
	app.View.prototype.createDateField = function (str_width, str_dateId, str_label, bool_required, Date_d) {

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


		innerDiv.appendChild(this.createElement( // hidden input
		{
			element: 'input',			
			
			attributes:

			{
				id: str_dateId + '-hidden',

				'aria-hidden': true,

				hidden: true,

				value: Date_d ? Date_d.getTime() - 1000 * (3600 * Date_d.getHours() + 60 * Date_d.getMinutes() + Date_d.getSeconds()) : '' // ms since epoch at midnight on start of date
			}
		}));


		var attributes = 
		{
			type: 'text',
			
			id: str_dateId,
			
			value: Date_d ? Date_d.toLocaleDateString() : '',
			
			readonly: true,

			'aria-labelledby': str_dateId + '-label',

			role: 'textbox'
		}

		if (bool_required) {attributes.required = true; attributes['aria-required'] = true;}

		innerDiv.appendChild(this.createElement( // visible input
		{
			element: 'input',			
			
			attributes: attributes,
			
			classList: ['validate', 'datepicker', 'picker__input']
		}));
		
		
		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_dateId, id: str_dateId + '-label'},
			
			classList: Date_d ? ['form-label', 'active'] : ['form-label'],
			
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
	}*/


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

	app.View.prototype.createEmailField = function (str_width, str_EmailId, str_label, bool_required, Email_email, str_customValidator) {

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

			'aria-labelledby': str_EmailId + '-label',

			role: 'textbox'
		}

		if (bool_required) {attributes.required = true; attributes['aria-required'] = true;}

		innerDiv.appendChild(this.createElement( // input
		{
			element: 'input',			
			
			attributes: attributes,

			dataset: str_customValidator ? {customValidator: str_customValidator} : {},
			
			classList: ['validate']
		}));
		
		
		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_EmailId, id: str_EmailId + '-label'},
			
			classList: email && email.address() ? ['form-label', 'active'] : ['form-label'],
			
			dataset: {error: 'Please enter email in format address@server.domain'},
			
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

			attributes: {'aria-labelledby': str_buttonId, role: 'button'},

			classList: ['large', 'material-icons'],

			innerHTML: str_icon
		}));

		return outerDiv;
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

			'aria-labelledby': str_fieldId + '-label',

			role: 'textbox'
		}

		if (!isNaN(parseInt(int_min))) {attributes.min = int_min;}

		if (!isNaN(parseInt(int_max))) {attributes.max = int_max;}

		if (!isNaN(parseInt(int_step))) {attributes.step = int_step;}

		if (bool_required) {attributes.required = true; attributes['aria-required'] = true;}

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

	app.View.prototype.createPasswordField = function (str_width, str_passwordId, str_hintsPrefix, Account_account, str_customValidator) {

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

				'aria-required': true,

				'aria-labelledby': str_passwordId + '-label',

				role: 'textbox'
			},

			dataset: str_customValidator ? {customValidator: str_customValidator} : {},

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

			attributes: {id: str_hintsPrefix, 'aria-hidden': true},
			
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

				'aria-required': true,

				'aria-labelledby': str_confirmationId + '-label',

				role: 'textbox'
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
			
			attributes: {id: str_buttonIdPrefix + '-cancel', role: 'button', tabindex: 0},
			
			classList: ['waves-effect', 'waves-teal', 'btn-flat'],

			innerHTML: 'Cancel'
		}));
		
		
		var buttonElement =  this.createElement({ // submit button
			
			element: 'a',
			
			attributes: {id: str_buttonIdPrefix + '-submit', role: 'button', tabindex: 0},
			
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

					'aria-labelledby': str_switchId + '-label',

					role: 'checkbox'
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

	app.View.prototype.createTextField = function (str_width, str_fieldId, str_label, bool_required, value, str_datalistId, str_customValidator) {

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

			'aria-labelledby': str_fieldId + '-label',

			role: 'textbox'
		}

		if (bool_required) {attributes.required = true; attributes['aria-required'] = true;}

		if (str_datalistId) {attributes.list = str_datalistId;}

		var classList = [];

		if (bool_required) {classList.push('validate');}

		innerDiv.appendChild(this.createElement( // input
		{
			element: 'input',			
			
			attributes: attributes,
			
			classList: classList,

			dataset: str_customValidator ? {customValidator: str_customValidator} : ''
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
	/*DEPRECATED
	app.View.prototype.createTimeField = function (str_width, str_timeId, str_label, bool_required, Date_d) {

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

		
		innerDiv.appendChild(this.createElement( // hidden input
		{
			element: 'input',			
			
			attributes:
			{
				id: str_timeId + '-hidden',

				'aria-hidden': true,

				hidden: true,

				value: Date_d ? 60 * Date_d.getHours() + Date_d.getMinutes() : '' // timepicker.js works with number of minutes
			}
		}));


		var attributes = 
		{
			type: 'text',
			
			id: str_timeId,
			
			value: Date_d ?

				Date_d.toLocaleTimeString()

				: '',
			
			readonly: true,

			'aria-labelledby': str_timeId + '-label',

			role: 'textbox'
		}

		if (bool_required) {attributes.required = true; attributes['aria-required'] = true;}

		innerDiv.appendChild(this.createElement( // visible input
		{
			element: 'input',			
			
			attributes: attributes,
			
			classList: ['timepicker', 'picker__input']
		}));
		
		
		var labelElement = this.createElement( // label
		{	
			element: 'label',			
			
			attributes: {for: str_timeId, id: str_timeId + '-label'},
			
			classList: Date_d ? ['form-label', 'active'] : ['form-label'],
			
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
	*/


	/* Displays or hides field error messages during interactive form validation
	*
	*/
	//DEPRECATED
	app.View.prototype.displayValidation = function(nEvent, str_fieldId, str_errorMsg, bool_valid) {

		var $field = $('#' + str_fieldId), $label = $('#' + str_fieldId + '-label');

		/*
		if (!bool_valid) { // not valid, display validation error

			try { // tried feature detection using Modernizr.formvalidation, but it produces a false negative on iOS, so just catching any errors generated

				// Leftovers from previous (unsuccesfull) attempts:

				//$field[0].setCustomValidity(str_errorMsg); // set input's validity state to 'error/invalid'

				//nEvent.target.labels[0].dataset.error = str_errorMsg; // try a different way for Chrome

				// $field.next('label').data('error', str_errorMsg); // other browsers

				
				//$field[0].setCustomValidity(str_errorMsg); // anything other than the empty string indicates a validation error

				//$label.data('error', str_errorMsg); // try to set a custom error message (fallback is default provided at field creation)

				//$field.attr('aria-invalid', true); // mkae sure to expose the new validity state to assistive technologies

				//window.validate_field($field); // leverage Materialize's built-in method for displaying/hiding field validation messages

				
				//$field.removeClass('valid'); // simulate Materialize's validate_field method

				//$field.addClass('invalid');

				//$label.addClass('active');
			}

			catch(e) {

				console.log(e.name);
			}
		}
		else { // valid

			try {

				//$field[0].setCustomValidity(str_errorMsg); // set input's validity state to 'error/invalid'

				//nEvent.target.labels[0].dataset.error = str_errorMsg; // try a different way for Chrome

				// $field.next('label').data('error', str_errorMsg); // other browsers

				

				//$field[0].setCustomValidity(''); // anything other than the empty string indicates a validation error

				// no need to reset error message content

				//$field.attr('aria-invalid', false); // make sure to expose the new validity state to assistive technologies

				//window.validate_field($field); // leverage Materialize's built-in method for displaying/hiding field validation messages

				
				//$field.removeClass('invalid'); // simulate Materialize's validate_field method

				//$field.addClass('valid');
			}

			catch(e) {

				console.log(e);
			}
		}
		*/
	};


	/** Gets (parses) value of datetime picker using datetime-local input field
	*
	* @param {String} id Id of the input field
	*
	* @return {Date} date A valid Date object, or a moment if supported by the browser, or null
	*/

	app.View.prototype.getDateTimePickerValue = function(Element_e) {

		var data = $(Element_e).data(), date = null;

		if (typeof data !== 'undefined' && typeof data.DateTimePicker !== 'undefined') { // we can access the DateTimePicker js object

			//console.log('using moment with custom widget value');

			if (typeof moment !== 'undefined') { // moment is available

				if (data.DateTimePicker.date() && data.DateTimePicker.date().isValid()) { // we have a valid moment instance

					date = data.DateTimePicker.date() // get that moment
				}
			}
		}

		else { // parse the input's value manually

			//console.log('parsing manually');

			date = $(Element_e).val();

			if (typeof moment !== 'undefined') { // use moment if available (probably won't work on mobile)

				date = moment(

					date,

					[ // try a number of expected formats, in order of likelyhood for en-us locale

						'YYYY-MM-DDTHH:mm', // ISO 8601

						'MM/DD/YYYY HH:mm A', // 12h, numbers only, US/North American date/month order

						'DD. MMM YYYY hh:mm A', // 12h/24h, month name, date/month order as used natively by iOS and x-OS Chrome

						'ddd MMM DD YYYY HH:mm:ss Z' // UTC format (e.g. 'Fri Mar 11 2016 00:45:50 GMT+0100 (Romance Standard Time)')
					],

					true
				);

				date = date.isValid() ? date: null;
			}
		}

		if (date === null) { // try to brute force parsing if moment - and all else - fails

			//console.log('brute forcing with Date');

			date = Date.parse($(Element_e).val());

			date = !isNaN(date) ? new Date(date): null;
		}

		return date;
	}


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

		this.$renderContext().attr('aria-hidden', true);
	}


	/** Initializes any and all datetime pickers on the pages using datetime-local inputs */

	app.View.prototype.initDateTimePicker = function() {

		if (app.device().isMobile() && !Modernizr.inputtypes['datetime-local'] && typeof moment !== 'undefined' // prefer native datetime picker on mobile, if available

			|| !app.device().isMobile()) { // use custom widget (always prefer on lap/desktop)

			
			// Set bootstrap-datetimepicker widget options

			$('input[type="datetime-local"]').datetimepicker({

				//debug: true,

				focusOnShow: true, // give textbox focus when showing picker

				ignoreReadonly: true,

				locale: moment.locale('en'),

				showClear: true
			});

			
			// Enable direct (keyboard) editing in input box

			$('input[type="datetime-local"]').each(function(ix, item) { // not sure if all of these need to be set on every instance

				if ($(item).data().DateTimePicker) { // DateTimePicker is defined, so we can ...

					$(item).data().DateTimePicker.enable();  // enable editing in input field

					$(item).data().DateTimePicker.options({keyBinds: null});  // remove all keyboard event handlers from picker

					// later, maybe revisit if it would be useful to retain a subset of key events on the picker itself
				}
			});

			
			// Suppress native datetimepicker (by changing input type to 'text')

			$('input[type="datetime-local"]').attr('type','text');


			// Make sure any existing value(s) is/are presented, and nicely formatted
		
			var val;

			$('.datetimepicker-input').each(function(ix, item) { // iterate through any and all datetime-pickers

				val = $(item).val() || $(item).data().value;

				if (val !== null) { // there is a date entry

					if (typeof moment !== 'undefined') { // moment is available

						if (moment(val).isValid()) { // entry is a valid date/moment

							val = moment(val);

							val.add(-val.toDate().getTimezoneOffset(), 'minutes'); // compensate for UTC and DST offset

							$(item).val(val.format('MM/DD/YYYY h:mm A')); // insert reformatted date into UI
						}
					}

					else { // no moment, so cobble 12h string together from individual date components

						val = new Date(val);

						val.setMinutes(val.getTimezoneOffset()) // compensate for UTC and DST offset

						$(item).val(

							val.getMonth()
							
							+ '/' + val.getDate()

							+ '/' + val.getFullYear()

							+ ' ' + (val.getHours() < 12 ? val.getHours() : val.getHours() - 12)

							+ ':' + val.getMinutes()

							+ ' ' + (val.getHours() < 13 ? 'AM': 'PM')
						);
					}
				}
			}.bind(this));


			// attach event handler(s)

			$('.datetimepicker-input').on('dp.change', function(nEvent) {

				Materialize.updateTextFields(nEvent.currentTarget);
			});
		}

		else { // Use native widget

			// Make sure any existing value(s) is/are presented, and nicely formatted

			// This ought to be redundant since we already set the value at creation,
			// but mobiles are very finicky about this, so keeping what works for now.

			$('.datetimepicker-input').each(function(ix, item) { // iterate through any and all datetime-pickers

				val = $(item).val() || $(item).data().value;

				if (val !== '') { // there is a date entry

					// native datetime-locals require an ISO 8601 string with no trailing 'Z'
					// we also want to trim the seconds, or else some browsers will display them, some not

					val = new Date(val);

					$(item).val(val.toISOString().split('T')[0] + 'T' + val.getHours() + ':' + val.getMinutes());

					// This currently fails in Firefox on Android: it formats the date using a comma separator, indicates
					// that as a validation error and then blocks clearing this with setCustomValidity().
					// Modernizr' formvalidation test aren't a reliable predicter of what works (produces both false
					// positives and negatives), so can't use that. Oh well,...
				}
			});
		}
	};


	/** Helper for interactive validation of date fields
	*
	* @param {String} date A string may/not represent a valid date
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	/*DEPRECATED: Use getDateTimePickerValue() instead
	app.View.prototype.isDateValid = function(str_date, bool_strict) {

		if (typeof moment !== 'undefined') { // use moment if available (preferred for increased reliability)

			var m = moment(

				str_date,

				[ // try a number of expected formats, in order of likelyhood for en-us locale

					'YYYY-MM-DDTHH:mm', // ISO 8601

					'MM/DD/YYYY HH:mm A', // 12h, numbers only, US/North American date/month order

					'DD MMM YYYY hh:mm A', // 12h/24h, month name, date/month order as used natively by iOS and x-OS Chrome

					'ddd MMM DD YYYY HH:mm:ss Z' // UTC format (e.g. 'Fri Mar 11 2016 00:45:50 GMT+0100 (Romance Standard Time)')
				],

				bool_strict ? true : false //default to lax parsing, no need to be picky about delimiters
			)

			return m.isValid();
		}

		else { // resort to Date, b/c in this app a mistake is not a big deal, but unreasonable strictness is

			return !isNaN(Date.parse(str_date));
		}
	}
	*/


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
	
	
	/** Abstract method. Executes default shared behaviour for when a View has rendered itself.
	*
	* @return {void}
	*
	* @throws {AbstractMethodError} If trying to invoke (abstract method)
	*/

	app.View.prototype.onRender = function() {

		throw new AbstractMethodError('onRender() must be implem by subclasses');
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

				attributes: {id: 'nav-dropdown', role: 'menu'},

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

				listElement = this.createElement({element: 'li', attributes: {role: 'menuitem'}});

				listElement.appendChild(anchorElement);

				ULElement.appendChild(listElement);

			}, this);


		// Main nav

			var navContainer =  this.createElement(
			{
				element: 'nav',

				attributes: {role:'navigation'}
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

				attributes: {id: 'nav-side', role: 'menu'},

				classList: ['side-nav']
			});

			menuItems.forEach(function(item) {

				listElement = this.createElement({element: 'li'});

				anchorElement = this.createElement(
				{
					element: 'a',

					attributes: {href: item.href, role:'menuitem'},

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

			/* UNCOMMENT AFTER DEBUGGING
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

			*/


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

		this.$renderContext().attr('aria-hidden', false); // later, investigate if this could do more of the work of showing
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

	app.View.prototype.validateCapacity = function(nEvent, str_capacityId) {
		
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


	/** Event handler for interactive validation of simple date field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	app.View.prototype.validateDate = function(Element_e) {//nEvent, str_dateId) {

		var self = app.View.prototype;

		if (Element_e.validity && Element_e.validity.valueMissing

		|| ($(Element_e).attr('required') && $(Element_e).val() === '')) { //alert('// required but empty');

			return false;

			//console.log('value value missing: ' + str_dateId);

			//this.displayValidation(event, str_dateId, 'Please enter date', false);
		}

		else if (self.getDateTimePickerValue(Element_e) === null) { //alert('// invalid entry');

			return false;

			//console.log('not valid: ' + str_dateId);

			//this.displayValidation(event, str_dateId, 'Please enter date as mm/dd/yyyy hh:mm', false);
		}

		else { //alert('// valid entry');

			//console.log('valid: ' + str_dateId);

			//this.displayValidation(event, str_dateId, 'Please enter date', true);

			return true;
		}

		return false;
	};


	/** Event handler for interactive validation of email field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	app.View.prototype.validateEmail = function(Element_e) {

		/* Tried the HTML5 email validity constraint but found it too lax
		*
		* (it does not require a period or much else after the @), so rolling my own.
		*
		* See unit test for Email class using com_github_dominicsayers_isemail.tests for details.
		*/

		var testMail = new app.Email($(Element_e).val()),

		isRequired = typeof $(Element_e).attr('required') !== 'undefined';

		if ($(Element_e).val() !== '') { // always validate email if it exists

			return testMail.isValid();
		}

		else if (!isRequired) { // empty is OK if not required
		
			return true;
		}

		else { // no entry, but required

			return false;
		}
	};


	/** Validates a form element using the HTML5 constraint validation API.
	*
	* Executes any and all custom form field validators before performing evaluation.
	*
	* @param {HTMLFormElement} form A DOM reference to the form to be evaluated
	*
	* @return {Boolean} true if all elements are valid after performing custom field validations, otherwise false
	*/

	app.View.prototype.validateForm = function(Element_form) {

		// Run custom validator on every relevant form element, if defined

		var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea, input[type="datetime-local"]';

		$(Element_form).find(input_selector).each(function(ix, element) {

			if ($(element).data && typeof $(element).data('customValidator') !== 'undefined') { // field has custom validator attribute

				var fn = $(element).data('customValidator').split('.').reduce(function(obj, ix) {return obj[ix]}, window); // resolve dot string into js reference (w/o resorting to eval()!)

				if (element.setCustomValidity && typeof fn === 'function') { // custom validator is a function

					// This seems broken in Chrome for Android (CyanogenMod), and neither H5F nor webshim can makeit work

					element.setCustomValidity(fn(element) ? '' : false); // run custom validator and set custom validity based on result
				}
			}
		});

		return $(Element_form)[0].checkValidity();
	};



	/** Event handler for interactive validation of required input fields.
	*
	* Fall-back for browsers that don't support the HTML5 constraint validation API.
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	/*DEPRECATED
	app.View.prototype.validateRequiredField = function(Element_e) {

		//var isValid = !Element_e.validity.valueMissing;

		//$('#' + str_nameId + '-label').data('error', 'custom error message'); //debug, remove in production

		//this.displayValidation(nEvent, str_nameId, str_errorMsg, valid);

		return (typeof $(Element_e).attr('required') !== 'undefined') ? $(Element_e).val().length > 0 : true;
	}
	*/

	/** Event handler for interactive validation of password field.
	*
	* Includes support for dynamically updated password hints
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	app.View.prototype.validatePassword = function(nEvent, str_passwordId, str_hintsPrefix) {

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

			nEvent,

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

	app.View.prototype.validatePasswordConfirmation = function(nEvent, str_passwordId, str_confirmationId) {

		// Skips validation if password isn't 'dirty' (i.e. changed since the view loaded)

		var valid = $('#' + str_confirmationId).val() === $('#' + str_passwordId).val() || !this.isPasswordDirty;

		this.displayValidation(

			nEvent,

			str_confirmationId,

			'Must be the same as password',

			valid
		);

		return valid;
	};