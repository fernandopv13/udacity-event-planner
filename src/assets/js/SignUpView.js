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
	* @author Ulrik H. Gade, March 2016
	*/

	module.SignUpView = function(str_elementId, str_heading) {

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

	/** Clears input fields page */

	module.SignUpView.prototype.clear = function() {

		$('#sign-up-email, #sign-in-password').val('');

		$('#sign-up-password-hints').hide('fast');
	}


	/** Makes sure password hints are hidden by default */

	module.SignUpView.prototype.onLoad = function() {

		$('#sign-up-password-hints').hide('fast');
	}


	/** Signs into the demo account */

	module.SignUpView.prototype.openDemo = function(nEvent) {

		var account = new module.Account();

		account.email(new module.Email('demo@demo.demo'));

		account.password(new module.Password('DEMO5%demo'));
		
		// Dispatch submission using function in parent class

		this.ssuper().prototype.submit.call(this, account, module.View.UIAction.SIGNIN);
	}


	/** Renders sign in page.
	*
	* @return void
	*/

	module.SignUpView.prototype.render = function() {

		var widgetFactory = app.UIWidgetFactory.instance();
			
		this.$renderContext().empty();

		// Add logo

			var containerDiv =  this.createElement( // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			this.$renderContext().append(containerDiv);

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
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
			}));


		// Add heading and teaser
			
			containerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			this.$renderContext().append(containerDiv);

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'h4',

				attributes: {role: 'heading'},

				innerHTML: this.heading()
			}));

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
					element: 'p',

					innerHTML: 'Please fill in the blanks and we\'ll get you going like 1-2-3.'
			}));

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
					element: 'p',

					innerHTML: '(Don\'t sweat the details, you can always change them later.)'
			}));


		// Setup up form and container div

			var formElement = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // form
			{
				element: 'form',			
				
				attributes: {autocomplete: 'off', id: 'sign-up-form'},//, novalidate: false},
				
				classList: ['col', 's12']
			});

			this.$renderContext().append(formElement);


			containerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
			{
				element: 'div',			
				
				classList: ['row']
			});
			
			formElement.appendChild(containerDiv);
		

		// Add email field

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'EmailInputWidget',
			{
				width: 's12',

				id: 'sign-up-email',

				label: 'Email',

				required: true,

				datasource: null,

				errormessage: 'Please enter email'
			}));


		// Add password field

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'PasswordInputWidget',
			{
				width: 's12',

				id: 'sign-up-password',

				label: 'Password',

				datasource: null,

				hintsprefix: 'sign-up-password-hints'
			}));

		
		// Add password confirmation field

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'PasswordConfirmationInputWidget',
			{
				width: 's12',

				id: 'sign-up-password-confirmation',

				label: 'Confirm Password'
			}));


		// Add optional extras instruction

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'p',

				classList: ['center-align'],

				innerHTML: 'Some optional extras:'
				
			}));

		
		// Add account holder name field

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'TextInputWidget',
			{
				width: 's12',

				id: 'sign-up-name',

				label: 'Your Name',

				required: false,

				datasource: null
			}));


		// Add birthday field

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'DateInputWidget',
			{
				width: 's12',

				id: 'sign-up-birthday',

				label: 'Your Birthday',

				required: false
			}))


		// Add job title field

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'TextInputWidget',
			{
				width:'s12',

				id: 'sign-up-jobtitle',

				label: 'Your Job Title',

				datasource: null,

				required: false
			}));


		// Add sign-up button

			containerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			
			formElement.appendChild(containerDiv);

			
			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // button
			{
				element: 'a',
				
				attributes: {id: 'sign-up-submit', role: 'button', tabindex: 0},
				
				classList: ['waves-effect', 'waves-light', 'btn'],

				innerHTML: 'Sign Up'
			}));

		
		// Add demo sign-in link (disabled/hidden)

			containerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align', 'hidden'] // Udacity reviewer didn't like this idea, so hiding it
			});

			formElement.appendChild(containerDiv);

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'p',

				classList: ['center-align'],

				innerHTML: 'or'
				
			}));

			
			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // link
			{
				element: 'a',
				
				attributes: {id: 'sign-up-open-demo', role: 'button', tabindex:0},
				
				innerHTML: 'See our (still very) cool demo!'
			}));
		
		

		// Initialize and (re)assign evnet handlers to form elements

			$('#sign-up-email').attr('autofocus', true);


			$('#sign-up-email, #sign-up-password, #sign-up-password-confirmation').on('input', function(nEvent) { // interactively validate email, password etc

				if (nEvent.currentTarget.value.length > 3) { // allow people to get started before showing error message (we need at least 3 chars anyway)

					//this.validateEmail(nEvent.currentTarget);

					Materialize.updateTextFields(nEvent.currentTarget); // implicitly calls custom validator
				}

			}.bind(this));

			
			$('#sign-up-password').focus(function(nEvent) { // update and show password hints

				this.validatePassword(nEvent.currentTarget, 'sign-up-password-hints');

				$('#sign-up-password-hints').show('slow');

				$('#sign-up-password-hints').removeClass('hidden');

				$('#sign-up-password-hints').attr('aria-hidden', false); // doesn't seem to have any effect on screen reader

			}.bind(this));


			/*
			$('#sign-up-password').on('input', function(nEvent) { // validate password

				//$(nEvent.currentTarget).data('dirty', true); // enable confirmation when leaving pw field, b/c it changed

				//Materialize.updateTextFields(nEvent.currentTarget); // implicitly calls custom validator

			}.bind(this));
			*/

			
			$('#sign-up-password').blur(function(nEvent) { // hide password hints, show confirmation (global handler takes care of the rest)

				$('#sign-up-password-hints').hide('slow');

				$('#sign-up-password-hints').attr('aria-hidden', true);

				if ($(nEvent.currentTarget).val().length > 0 // pw is not empty

					&& $(nEvent.currentTarget).val() !== $(nEvent.currentTarget).data('value') // pw is 'dirty'

					&&  $(nEvent.currentTarget).checkValidity()) { // pw is valid

						$('#sign-up-password-confirmation-parent').removeClass('hidden');

						$('#sign-up-password-confirmation-parent').show('slow');
				}
			});


			this.initDateTimePicker();


			$('#sign-up-open-demo').mousedown(function(nEvent) { // submit (blur hides click event so using mousedown)

				this.openDemo(nEvent);

			}.bind(this));


			$('#sign-up-submit').click(function(nEvent) {

				this.submit(nEvent);

			}.bind(this));


		// call parent to perform common post-render task(s)

			this.ssuper().prototype.update.call(this);
	};


	module.SignUpView.prototype.submit = function(nEvent) {

		if (this.validateForm($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

			// Create a temporary, new account with the data from the form

			var account = new module.Account();

			account.email(new module.Email($('#sign-up-email').val()));

			account.password(new module.Password($('#sign-up-password').val()));

			var accountHolder = new module.Person( // trying to keep it simple; don't scare users away before they have signed up!

				$('#sign-up-name').val(),

				null,

				$('#sign-up-jobtitle').val(),

				null,

				new Date($('#sign-up-birthday').val())
			)

			void account.accountHolder(accountHolder);

			
			// Dispatch submission using function in parent class

			this.ssuper().prototype.submit.call(this, account, module.View.UIAction.CREATE);

			return true;
		}

		return false;
	}


	module.SignUpView.prototype.update = function() {

		this.render();
	}
	
})(app);