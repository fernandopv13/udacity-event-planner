'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class SignInView extends FormView
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for displaying app's sign-in page.
	*
	* Deviates slightly from the main mold of the MVC framework, as it isn't to tightly bound to a Model.
	*
	* @constructor
	*
	* @extends View
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.SignInView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'SignInView';

		this.ssuper = module.FormView;

		
		// Initialize instance members inherited from parent class
		
		module.FormView.call(this, null, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.SignInView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from FormView
	*---------------------------------------------------------------------------------------*/	

	module.SignInView.prototype = Object.create(module.FormView.prototype); // Set up inheritance

	module.SignInView.prototype.constructor = module.SignInView; //Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Clears input fields on sign-in page */

	module.SignInView.prototype.clear = function() {

		$('#sign-in-email, #sign-in-password').val('');

		$('#sign-in-password-hints').hide('fast');
	}


	/** Makes sure password hints are hidden by default */

	module.SignInView.prototype.onLoad = function() {

		$('#sign-in-password-hints').hide('fast');
	}



	/** Renders sign in page.
	*
	* @return void
	*/

	module.SignInView.prototype.render = function() {

		var widgetFactory = app.UIWidgetFactory.instance();
			
		this.$renderContext().empty();

		// Add logo

			var containerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
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

				classList: ['center-align'],

				innerHTML: 'You\'re back. Awesome!'
				
			}));

		
		// Setup up form and container div

			var formElement = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // form
			{
				element: 'form',			
				
				attributes: {autocomplete: 'off', id: 'sign-in-form'},//, novalidate: false},
				
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

				id: 'sign-in-email',

				label: 'Email',

				required: true,

				datasource: null
			}));


		// Add password field

			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'PasswordInputWidget',
			{
				width: 's12',

				id: 'sign-in-password',

				label: 'Confirm Password',

				hintsprefix: 'sign-in-password-hints'
			}));


		// Add sign-in button

			containerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			
			formElement.appendChild(containerDiv);

			
			containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',  // button
			{
				element: 'a',
				
				attributes: {id: 'sign-in-submit', role: 'button', tabindex: 0},
				
				classList: ['waves-effect', 'waves-light', 'btn'],

				innerHTML: 'Sign In'
			}));

		
		// Add demo sign-in link

			containerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align', 'hidden'] // // Udacity reviewer didn't like this idea, so hiding it
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
				
				attributes: {id: 'sign-in-demo-submit', role: 'button', tabindex:0},
				
				innerHTML: 'See our cool demo'
			}));
		
		

		// Initialize and (re)assign evnet handlers to form elements

			$('#sign-in-email').attr('autofocus', true);


			$('#sign-in-email').on('input', function(nEvent) { // validate password

				if (nEvent.currentTarget.value.length > 3) {

					Materialize.updateTextFields(nEvent.currentTarget); // implicitly calls custom validator
				}

			}.bind(this));

			
			$('#sign-in-password').focus(function(nEvent) { // update and show password hints

				//Materialize.updateTextFields(nEvent.currentTarget); // implicitly calls custom validation, so no need for explicit call

				$('#sign-in-password-hints').show('slow');

				$('#sign-in-password-hints').removeClass('hidden');

				$('#sign-in-password-hints').attr('aria-hidden', false); // doesn't seem to have any effect on screen reader

			}.bind(this));


			/*
			$('#sign-in-password').on('input', function(nEvent) { // validate password

				Materialize.updateTextFields(nEvent.currentTarget); // implicitly calls custom validation, so no need for explicit call

			}.bind(this));
			*/

			
			$('#sign-in-password').blur(function(nEvent) { // hide password hints (global handler takes care of the rest)

				$('#sign-in-password-hints').hide('slow');

				$('#sign-in-password-hints').attr('aria-hidden', true);
			});


			$('#sign-in-demo-submit').mousedown(function(nEvent) { // submit (blur hides click event so using mousedown)

				$('#sign-in-email').val('demo@demo.demo');

				$('#sign-in-password').val('DEMO5%demo');

				this.submit(nEvent);

			}.bind(this));


			$('#sign-in-submit').click(function(nEvent) {

				this.submit(event);

			}.bind(this));


		// call parent to perform common post-render task(s)

			this.ssuper().prototype.update.call(this);
	};


	module.SignInView.prototype.submit = function(nEvent) {

		if (app.FormWidget.instance().validate($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

			// Create a temporary, new account with the data from the form

			var account = new module.Account();

			account.email(new module.Email($('#sign-in-email').val()));

			account.password(new module.Password($('#sign-in-password').val()));
			
			// Dispatch submission using function in parent class

			this.ssuper().prototype.submit.call(this, account, module.View.UIAction.SIGNIN);

			return true;
		}

		return false;
	}


	module.SignInView.prototype.update = function() {

		this.render();
	}

})(app);