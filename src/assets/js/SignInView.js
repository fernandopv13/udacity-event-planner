'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class SignInView extends FormView
**********************************************************************************************/

var app = app || {};


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

app.SignInView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.className = 'SignInView';

	this.ssuper = app.FormView;

	
	// Initialize instance members inherited from parent class
	
	app.FormView.call(this, null, str_elementId, str_heading);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.SignInView);
};

/*----------------------------------------------------------------------------------------
* Inherit from FormView
*---------------------------------------------------------------------------------------*/	

app.SignInView.prototype = Object.create(app.FormView.prototype); // Set up inheritance

app.SignInView.prototype.constructor = app.SignInView; //Reset constructor property



/*----------------------------------------------------------------------------------------
* Public instance methods (beyond accessors)
*---------------------------------------------------------------------------------------*/

/** Clears input fields on sign-in page */

app.SignInView.prototype.clear = function() {

	$('#sign-in-email, #sign-in-password').val('');

	$('#sign-in-password-hints').hide('fast');
}


/** Makes sure password hints are hidden by default */

app.SignInView.prototype.onLoad = function() {

	$('#sign-in-password-hints').hide('fast');
}



/** Renders sign in page.
*
* @return void
*/

app.SignInView.prototype.render = function() {

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


	// Add heading
		
		containerDiv =  this.createElement( // div
		{
			element: 'div',			
			
			classList: ['row', 'center-align']
		});

		this.$renderContext().append(containerDiv);

		containerDiv.appendChild(this.createElement({

			element: 'h4',

			innerHTML: this.heading()
		}));

	
	// Setup up form and container div

		formElement =  this.createElement( // form
		{
			element: 'form',			
			
			attributes: {autocomplete: 'off', id: 'sign-in-form'},//, novalidate: false},
			
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

			'sign-in-email',

			'Email',

			true,

			'',

			'app.View.prototype.validateEmail'
		));


	// Add password field

		containerDiv.appendChild(this.createPasswordField(

			's12',

			'sign-in-password',

			'sign-in-password-hints',

			'',

			'app.View.prototype.validatePassword'
		));

		//console.log(containerDiv);

	// Add sign-in button

		containerDiv =  this.createElement( // div
		{
			element: 'div',			
			
			classList: ['row', 'center-align']
		});

		//this.$renderContext().append(containerDiv);

		formElement.appendChild(containerDiv);

		
		containerDiv.appendChild(this.createElement({ // button
			
			element: 'a',
			
			attributes: {id: 'sign-in-submit', role: 'button', tabindex: 0},
			
			classList: ['waves-effect', 'waves-light', 'btn'],

			innerHTML: 'Sign In'
		}));

	
	// Add demo sign-in link

		containerDiv =  this.createElement( // div
		{
			element: 'div',			
			
			classList: ['row', 'center-align']
		});

		//this.$renderContext().append(containerDiv);
		formElement.appendChild(containerDiv);

		containerDiv.appendChild(this.createElement(
		{
			element: 'p',

			classList: ['center-align'],

			innerHTML: 'or'
			
		}));

		
		containerDiv.appendChild(this.createElement({ // link
			
			element: 'a',
			
			attributes: {id: 'sign-in-demo-submit', role: 'button', tabindex:0},
			
			innerHTML: 'See our cool demo'
		}));
	
	

	// Initialize and (re)assign evnet handlers to form elements

		$('#sign-in-email').attr('autofocus', true);


		/*DEPRECATED
		$('#sign-in-email').keyup(function(nEvent) { // validate email

			this.validateEmail(nEvent.currentTarget);

		}.bind(this));
		*/
		
		$('#sign-in-password').focus(function(nEvent) { // update and show password hints

			this.validatePassword(nEvent.currentTarget, 'sign-in-password-hints');

			$('#sign-in-password-hints').show('slow');

			$('#sign-in-password-hints').removeClass('hidden');

			$('#sign-in-password-hints').attr('aria-hidden', false); // doesn't seem to have any effect on screen reader

		}.bind(this));


		$('#sign-in-password').keyup(function(nEvent) { // validate password

			this.validatePassword(nEvent.currentTarget, 'sign-in-password-hints');

		}.bind(this));

		
		$('#sign-in-password').blur(function(nEvent) { // hide password hints

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


app.SignInView.prototype.submit = function(nEvent) {

	if (this.validateForm($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

		// Create a temporary, new account with the data from the form

		var account = new app.Account();

		account.email(new app.Email($('#sign-in-email').val()));

		account.password(new app.Password($('#sign-in-password').val()));
		
		// Dispatch submission using function in parent class

		console.log('calling super');

		this.ssuper().prototype.submit.call(this, account, app.View.UIAction.SIGNIN);

		return true;
	}

	return false;
}


app.SignInView.prototype.update = function() {

	this.render();
}