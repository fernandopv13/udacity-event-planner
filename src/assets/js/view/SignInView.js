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

	module.View.children.push(module.SignInView); // Add to list of derived classes



	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Clears input fields on sign-in view
	*
	* @return {void}
	*/

	module.SignInView.prototype.clear = function() {

		$('#sign-in-email, #sign-in-password').val('');

		$('#sign-in-password-hints').hide('fast');
	}

	
	/** Renders sign in page.
	*
	* @return {void}
	*/

	module.SignInView.prototype.render = function() {

		var container; // shorthand reference to inherited temporary container element

				
		// Set up container div
			
			container = this.containerElement(this.createWidget(

				'HTMLElement', // div

				{
					element: 'div',			
					
					classList: ['row']
				}
			));

			
		// Add logo

			var innerDiv = this.createWidget(

				'HTMLElement', // div

				{
					element: 'div',			
					
					classList: ['row', 'center-align']
				}
			);

			container.appendChild(innerDiv);

			innerDiv.appendChild(this.createWidget(

				'HTMLElement',

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

					classList: ['center-align'],

					innerHTML: 'You\'re back. Awesome!'
					
				}
			));

		
		// Setup form

			var formElement = this.createWidget(

				'FormWidget',

				{
					id: 'sign-in-form',

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

					id: 'sign-in-email',

					label: 'Email',

					required: true,

					datasource: null
				}
			));

			//this.elementOptions['sign-in-email'] = {};  // make sure initializer gets called on widget


		// Add password field

			formElement.appendChild(this.createWidget(

				'PasswordInputWidget',

				{
					width: 's12',

					id: 'sign-in-password',

					label: 'Confirm Password',

					hintsprefix: 'sign-in-password-hints'
				}
			));

			//this.elementOptions['sign-in-password'] = {};  // make sure initializer gets called on widget

		
		// Add sign-in button

			innerDiv = this.createWidget(

				'HTMLElement', // div

				{
					element: 'div',			
					
					classList: ['row', 'center-align']
				}
			);
	
			formElement.appendChild(innerDiv);
			
			
			innerDiv.appendChild(this.createWidget(

					'SubmitButtonWidget',  // submit button

					{					
						id: 'sign-in-submit',

						label: 'Done'
					}
				));

		
		// Add (hidden) demo sign-in link

			innerDiv = this.createWidget( // div

				'HTMLElement',

				{
					element: 'div',			
					
					classList: ['row', 'center-align'],//, 'hidden'] // // Udacity reviewer didn't like this idea, so hiding it
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

			innerDiv.appendChild(this.createWidget( // link

				'HTMLElement',

				{
					element: 'a',
					
					attributes: {id: 'sign-in-demo-submit', role: 'button', tabindex:0},
					
					innerHTML: 'See our cool demo'
				}));

			this.elementOptions['sign-in-demo-submit'] =
			{
				listeners: 
				{
					mousedown: 

						function(nEvent) { // blur hides click event so using mousedown

							$('#sign-in-email').val('demo@demo.demo');

							$('#sign-in-password').val('demo5%DEMO');

							this.submit(nEvent);

						}.bind(this)
				}
			};


		// Render to DOM

			this.ssuper().prototype.render.call(this);
		
		
		// Do post-render initialization

			this.init(); // call init up parent class chain

			$('#sign-in-email').attr('autofocus', true); // set focus on email field
	};


	/** Submits sign in credentials */

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

		//else

		Materialize.toast(module.prefs.defaultValidationError(), module.prefs.defaultToastDelay());

		return false;
	}

})(app);