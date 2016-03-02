'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class SignInView extends View
**********************************************************************************************/

var app = app || {};

/** @classdesc View for displaying app's sign in page.
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

	this.ssuper = app.View;

	
	/** Initialize instance members inherited from parent class*/
	
	app.View.call(this, null, str_elementId, str_heading);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.SignInView);
};

/*----------------------------------------------------------------------------------------
* Inherit from View
*---------------------------------------------------------------------------------------*/	

app.SignInView.prototype = Object.create(app.View.prototype); // Set up inheritance

app.SignInView.prototype.constructor = app.SignInView; //Reset constructor property



/*----------------------------------------------------------------------------------------
* Public instance methods (beyond accessors)
*---------------------------------------------------------------------------------------*/

/** Renders front page.
*
* Front page is pure navigation. It is not bound to any model, nor to the controller
*
* @return void
*/

app.SignInView.prototype.render = function() {

	var containerDiv, formElement, buttonElement, linkElement;
		
	this.$renderContext().empty();

	// Setup up form and container div

		formElement =  this.createElement( // form
		{
			element: 'form',			
			
			attributes: {id: 'sign-in-form', novalidate: false},
			
			classList: ['col', 's12']
		});

		this.$renderContext().append(formElement);


		containerDiv =  this.createElement( // div
		{
			element: 'div',			
			
			classList: ['row']
		});
		
		formElement.appendChild(containerDiv);
	

	// Add heading
		
		containerDiv.appendChild(this.createHeading('s12', this.heading()));


	// Add email field

		containerDiv.appendChild(this.createEmailField(

			's12',

			'sign-in-email',

			'Email',

			true,

			''
		));


	// Add password field

		containerDiv.appendChild(this.createPasswordField(

			's12',

			'sign-in-password',

			'sign-in-password-hints',

			''
		));

	
	// Add sign-in button

		containerDiv.appendChild(this.createElement({ // button
			
			element: 'a',
			
			attributes: {id: 'sign-in-submit'},
			
			classList: ['waves-effect', 'waves-light', 'btn', 'right'],

			innerHTML: 'Sign In'
		}));
	
	
	// (Re)assign evnet handlers to form elements

		$('#sign-in-submit').click(function(event) { // go to sign-up view

			//

		}.bind(this));
};

app.SignInView.prototype.update = function() {

	this.render();
}