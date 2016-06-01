'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class SignUpView extends FormView
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter
	
	/** @classdesc View class for displaying app's sign-up page.
	*
	* Fits into the MVC framework as a "Create Account" page
	*
	* @constructor
	*
	* @extends View
	*
	* @author Ulrik H. Gade, May 2016
	*/

	module.SignUpView = function(str_elementId, str_heading) {

		//SignUpView

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'SignUpView';

		this.ssuper = module.FormView;

		
		// Initialize instance members inherited from parent class
		
		module.FormView.call(this, null, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.SignUpView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from FormView
	*---------------------------------------------------------------------------------------*/	

	module.SignUpView.prototype = Object.create(module.FormView.prototype); // Set up inheritance

	module.SignUpView.prototype.constructor = module.SignUpView; //Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Clears input fields in View
	*
	* @return {void}
	*/

	module.SignUpView.prototype.clear = function() {

		$('#sign-up-email, #sign-in-password').val('');

		$('#sign-up-password-hints').hide('fast');
	}


	/** Renders sign in page.
	*
	* @return void
	*/

	module.SignUpView.prototype.render = function() {

		var container; // shorthand reference to inherited temporary container element

		
		// Add container

			container = this.containerElement(this.createWidget( // container

				'HTMLElement',

				{
					element: 'div',			
					
					classList: ['row']
				}
			));

			var innerDiv = this.createWidget(

				'HTMLElement', // inner div

				{
					element: 'div',			
					
					classList: ['row', 'center-align']
				}
			);

			container.appendChild(innerDiv);

		// Add logo

			innerDiv.appendChild(this.createWidget(

				'HTMLElement', // logo

				{
					element: 'img',

					attributes:
					{
						src: 'assets/img/logo.png',

						width: '117px',

						height: '100px',

						alt: 'Logo',

						style: 'margin-top:20px;'
					}
				}
			));


		// Add heading and teaser
			
			innerDiv.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'h4',

					attributes: {role: 'heading'},

					innerHTML: this.heading()
				}
			));

			innerDiv.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'p',

					innerHTML: 'Please fill in the blanks and we\'ll get you going like 1-2-3.'
				}
			));

			innerDiv.appendChild(this.createWidget(

				'HTMLElement',

				{
						element: 'p',

						innerHTML: '(Don\'t sweat the details, you can always change them later.)'
				}
			));


		// Setup up form

			var formElement = this.createWidget(

				'FormWidget',

				{
					id: 'sign-up-form',

					autocomplete: 'off',

					novalidate: true
				}
			);

			container.appendChild(formElement);

		
		// Add email field

			formElement.appendChild(this.createWidget(

				'EmailInputWidget',

				{
					width: 's12',

					id: 'sign-up-email',

					label: 'Email',

					required: true,

					datasource: null
				}
			));


		// Add password field

			formElement.appendChild(this.createWidget(

				'PasswordInputWidget',

				{
					width: 's12',

					id: 'sign-up-password',

					label: 'Password',

					datasource: null
				}
			));

		
		// Add password confirmation field

			formElement.appendChild(this.createWidget(

				'PasswordConfirmationInputWidget',

				{
					width: 's12',

					id: 'sign-up-password-confirmation',

					label: 'Confirm Password',

					required: true
				}
			));


		// Add optional extras instruction

			formElement.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'p',

					classList: ['center-align'],

					innerHTML: 'Some optional extras:'
					
				}
			));

		
		// Add account holder name field

			formElement.appendChild(this.createWidget(

				'TextInputWidget',

				{
					width: 's12',

					id: 'sign-up-name',

					label: 'Your Name',

					required: false,

					datasource: null
				}
			));


		// Add birthday field

			formElement.appendChild(this.createWidget(

				'DateInputWidget',

				{
					width: 's12',

					id: 'sign-up-birthday',

					label: 'Your Birthday',

					required: false,

					dateonly: true
				}
			));


		// Add location field

			formElement.appendChild(this.createWidget(

				'TextInputWidget',

				{
					width:'s12',

					id: 'sign-up-location',

					label: 'Your Location',

					datasource: null,

					required: false
				}
			));

		// Add job title field

			/*
			formElement.appendChild(this.createWidget(

				'TextInputWidget',

				{
					width:'s12',

					id: 'sign-up-jobtitle',

					label: 'Your Job Title',

					datasource: null,

					required: false
				}
			));
			*/
			

		// Add sign-up button

			innerDiv = this.createWidget(

				'HTMLElement',

				{
					element: 'div',			
					
					classList: ['row', 'center-align']
				}
			);

			formElement.appendChild(innerDiv);

			
			innerDiv.appendChild(this.createWidget(

				'HTMLElement', // button

				{
					element: 'a',
					
					attributes: {id: 'sign-up-submit', role: 'button', tabindex: 0},
					
					classList: ['waves-effect', 'waves-light', 'btn'],

					innerHTML: 'Sign Up'
				}
			));

			this.elementOptions['sign-up-submit'] =
			{
				listeners:
				{
					mousedown: app.SignUpView.prototype.submit.bind(this)
				}
			}


		// Add demo sign-in link (disabled/hidden)

			innerDiv = this.createWidget(

				'HTMLElement', // div

				{
					element: 'div',			
					
					classList: ['row', 'center-align', 'hidden'] // Udacity reviewer didn't like this idea, so hiding it
				}
			);

			formElement.appendChild(innerDiv);

			innerDiv.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'p',

					classList: ['center-align'],

					innerHTML: 'or'
					
				}
			));

			
			innerDiv.appendChild(this.createWidget(

			'HTMLElement', // link

				{
					element: 'a',
					
					attributes: {id: 'sign-up-open-demo', role: 'button', tabindex:0},
					
					innerHTML: 'See our (still very) cool demo!'
				}
			));

			this.elementOptions['sign-up-open-demo'] =
			{
				listeners:
				{
					//mousedown: this.openDemo.bind(this)

					mousedown: function(nEvent) {

						var account = new module.Account();

						account.email(new module.Email('demo@demo.demo'));

						account.password(new module.Password('DEMO5%demo'));
						
						// Dispatch submission using function in parent class

						this.ssuper().prototype.submit.call(this, account, module.View.UIAction.SIGNIN);
					
					}.bind(this)
				}
			}
		
		
		// Render to DOM

			this.ssuper().prototype.render.call(this);


		// Do post-render initialization

			this.init(); // call init up parent class chain
			
			
			$('#sign-up-email').attr('autofocus', true); // set focus on email


			$('#sign-up-password').blur(function(nEvent) { // hide password hints, show confirmation (global handler takes care of the rest)

				if ($(nEvent.currentTarget).val().length > 0 // pw is not empty

					&& $(nEvent.currentTarget).val() !== $(nEvent.currentTarget).data('value') // pw is 'dirty'

					&&  $(nEvent.currentTarget)[0].checkValidity()) { // pw is valid

						$('#sign-up-password-confirmation-parent').removeClass('hidden');

						$('#sign-up-password-confirmation-parent').show('slow');
				}
			});
	};


	/** Submits sign in credentials and opens acccount, if credentials check out*/

	module.SignUpView.prototype.submit = function(nEvent) {

		if (app.FormWidget.instance().validate($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

			// Create a temporary, new account with the data from the form

			var account = new module.Account();

			void account.email(new module.Email($('#sign-up-email').val()));

			void account.password(new module.Password($('#sign-up-password').val()));

			void account.defaultLocation($('#sign-up-location').val());

			void account.accountHolder(new module.Person( // trying to keep it simple; don't scare users away before they have signed up!

				$('#sign-up-name').val(),

				null,

				null, //$('#sign-up-jobtitle').val(),

				null,

				//new Date($('#sign-up-birthday').val() || null)

				module.DateInputWidget.instance().value($('#sign-up-birthday'))
			));


			// Dispatch submission using function in parent class

			this.ssuper().prototype.submit.call(this, account, module.View.UIAction.CREATE);

			return true;
		}

		//else

		Materialize.toast(module.prefs.defaultValidationError(), module.prefs.defaultToastDelay());

		return false;
	}

})(app);