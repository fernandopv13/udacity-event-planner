'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class SignUpView extends FormView
**********************************************************************************************/

var app = app || {};


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

app.SignUpView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.className = 'SignUpView';

	this.ssuper = app.FormView;

	
	// Initialize instance members inherited from parent class
	
	app.FormView.call(this, null, str_elementId, str_heading);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.SignUpView);
};

/*----------------------------------------------------------------------------------------
* Inherit from FormView
*---------------------------------------------------------------------------------------*/	

app.SignUpView.prototype = Object.create(app.FormView.prototype); // Set up inheritance

app.SignUpView.prototype.constructor = app.SignUpView; //Reset constructor property



/*----------------------------------------------------------------------------------------
* Public instance methods (beyond accessors)
*---------------------------------------------------------------------------------------*/

/** Clears input fields page */

app.SignUpView.prototype.clear = function() {

	$('#sign-up-email, #sign-in-password').val('');

	$('#sign-up-password-hints').hide('fast');
}


/** Makes sure password hints are hidden by default */

app.SignUpView.prototype.onLoad = function() {

	$('#sign-up-password-hints').hide('fast');
}


/** Signs into the demo account */

app.SignUpView.prototype.openDemo = function(nEvent) {

	var account = new app.Account();

	account.email(new app.Email('demo@demo.demo'));

	account.password(new app.Password('DEMO5%demo'));
	
	// Dispatch submission using function in parent class

	this.ssuper().prototype.submit.call(this, account, app.View.UIAction.SIGNIN);
}


/** Renders sign in page.
*
* @return void
*/

app.SignUpView.prototype.render = function() {

	var containerDiv, formElement, buttonElement, linkElement;
		
	this.$renderContext().empty();

	// Add logo

		containerDiv =  this.createElement( // div
		{
			element: 'div',			
			
			classList: ['row', 'center-align']
		});

		this.$renderContext().append(containerDiv);

		containerDiv.appendChild(this.createElement(
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
		
		containerDiv =  this.createElement( // div
		{
			element: 'div',			
			
			classList: ['row', 'center-align']
		});

		this.$renderContext().append(containerDiv);

		containerDiv.appendChild(this.createElement({

			element: 'h4',

			attributes: {role: 'heading'},

			innerHTML: this.heading()
		}));

		containerDiv.appendChild(this.createElement(
			{
				element: 'p',

				innerHTML: 'Please fill in the blanks and we\'ll get you going like 1-2-3.'
		}));

		containerDiv.appendChild(this.createElement(
		{
				element: 'p',

				innerHTML: '(Don\'t sweat the details, you can always change them later.)'
		}));


	// Setup up form and container div

		formElement =  this.createElement( // form
		{
			element: 'form',			
			
			attributes: {autocomplete: 'off', id: 'sign-up-form'},//, novalidate: false},
			
			classList: ['col', 's12']
		});

		this.$renderContext().append(formElement);


		containerDiv =  this.createElement( // div
		{
			element: 'div',			
			
			classList: ['row']
		});
		
		formElement.appendChild(containerDiv);
	

	// Add email field

		containerDiv.appendChild(this.createEmailField(

			's12',

			'sign-up-email',

			'Email',

			true,

			'',

			'app.View.prototype.validateEmail'
		));


	// Add password field

		containerDiv.appendChild(this.createPasswordField(

			's12',

			'sign-up-password',

			'sign-up-password-hints',

			'',

			'app.View.prototype.validatePassword'
		));

	
	// Add password confirmation field

		containerDiv.appendChild(this.createPasswordConfirmationField(

			's12',

			'sign-up-password-confirmation',

			'app.View.prototype.validatePasswordConfirmation'
		));


	// Add optional extras instruction

		containerDiv.appendChild(this.createElement(
		{
			element: 'p',

			classList: ['center-align'],

			innerHTML: 'Some optional extras:'
			
		}));

	
	// Add account holder name field

		containerDiv.appendChild(this.createTextField(

			's12',

			'sign-up-name',

			'Your Name',

			false,

			''
		));


	// Add birthday field

			containerDiv.appendChild(this.createDateField(

				's12',

				'sign-up-birthday',

				'Your Birthday',

				false,

				'',
				
				'',

				'app.View.prototype.validateDate'
			))


	// Add job title field

		containerDiv.appendChild(this.createTextField(

			's12',

			'sign-up-jobtitle',

			'Your Job Title',

			false,

			''
		));


	// Add sign-up button

		containerDiv =  this.createElement( // div
		{
			element: 'div',			
			
			classList: ['row', 'center-align']
		});

		
		formElement.appendChild(containerDiv);

		
		containerDiv.appendChild(this.createElement({ // button
			
			element: 'a',
			
			attributes: {id: 'sign-up-submit', role: 'button', tabindex: 0},
			
			classList: ['waves-effect', 'waves-light', 'btn'],

			innerHTML: 'Sign Up'
		}));

	
	// Add demo sign-in link (disabled/hidden)

		containerDiv =  this.createElement( // div
		{
			element: 'div',			
			
			classList: ['row', 'center-align', 'hidden'] // Udacity reviewer didn't like this idea, so hiding it
		});

		formElement.appendChild(containerDiv);

		containerDiv.appendChild(this.createElement(
		{
			element: 'p',

			classList: ['center-align'],

			innerHTML: 'or'
			
		}));

		
		containerDiv.appendChild(this.createElement({ // link
			
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


app.SignUpView.prototype.submit = function(nEvent) {

	if (this.validateForm($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

		// Create a temporary, new account with the data from the form

		var account = new app.Account();

		account.email(new app.Email($('#sign-up-email').val()));

		account.password(new app.Password($('#sign-up-password').val()));

		var accountHolder = new app.Person( // trying to keep it simple; don't scare users away before they have signed up!

			$('#sign-up-name').val(),

			null,

			$('#sign-up-jobtitle').val(),

			null,

			new Date($('#sign-up-birthday').val())
		)

		void account.accountHolder(accountHolder);

		
		// Dispatch submission using function in parent class

		this.ssuper().prototype.submit.call(this, account, app.View.UIAction.CREATE);

		return true;
	}

	return false;
}


app.SignUpView.prototype.update = function() {

	this.render();
}