'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class AccountProfileView extends FormView
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for account profile. Renders profile in UI, and captures UI events on profile.
*
* @constructor
*
* @extends FormView
*
* @param (String) elementId Id of the HTML DOM element the view is bound to
*
* @param (String) heading Content for the list heading
*
* @author Ulrik H. Gade, March 2016
*/

app.AccountProfileView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.className = 'AccountProfileView';

	this.ssuper = app.FormView;

	
	// Initialize instance members inherited from parent class
	
	app.FormView.call(this, app.Person, str_elementId, str_heading);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/
		
	this.parentList().push(app.AccountProfileView);
};

/*----------------------------------------------------------------------------------------
* Inherit from FormView
*---------------------------------------------------------------------------------------*/	

app.AccountProfileView.prototype = Object.create(app.FormView.prototype); // Set up inheritance

app.AccountProfileView.prototype.constructor = app.AccountProfileView; //Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** (Re)renders person to form in UI
*
* @param {Account} The account from whose profile to present data in the form
*
* @return void
 */

app.AccountProfileView.prototype.render = function(Person_p) {

	var formElement, containerDiv, innerDiv, outerDiv, labelElement, buttonElement, iconElement, $formDiv;

	if (Person_p) { // account holder exists
		
		var person = Person_p;

		// Setup up form and container div

			formElement =  this.createElement(
			{
				element: 'form',			
				
				attributes: {novalidate: true},
				
				classList: ['col', 's12']
			});


			containerDiv =  this.createElement(
			{
				element: 'div',			
				
				classList: ['row']
			});
			

			formElement.appendChild(containerDiv);
		
		// Add heading
			
			containerDiv.appendChild(this.createHeading('s12', this.heading()));

			
		// Add hidden person id field

			containerDiv.appendChild(this.createElement({

				element: 'input',

				attributes: {id: 'account-holder-id', type: 'hidden', value: Person_p.id()}
			}));

		
		// Add account holder name field

			containerDiv.appendChild(this.createTextField(

				's12',

				'account-holder-name',

				'Your Name',

				true,

				Person_p.name() ? Person_p.name() : ''
			));
			
		
		// Add email field

			outerDiv =  this.createEmailField(

				's12',

				'account-holder-email',

				'Your Email',

				false,

				Person_p.email()
			);


			outerDiv.appendChild(this.createFieldDescription(

				'The app uses this email to contact you, and when presenting you to participants in your events. If left blank, the app will use the email address that you use to sign in (see "Account Settings").'
			));

			containerDiv.appendChild(outerDiv);


		// Add job title field

			containerDiv.appendChild(this.createTextField(

				's12',

				'account-holder-jobtitle',

				'Your Job Title',

				false,

				Person_p.jobTitle()
			));

						
		// Add employer field

			innerDiv =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', 's12']
			});
			
			
			innerDiv.appendChild(this.createElement( // input
			{
				element: 'input',			
				
				attributes:
				{
					type: 'text',
					
					id: 'account-holder-employer',
					
					value: Person_p.employer() && Person_p.employer().name() ? Person_p.employer().name() : '',
					
					list: 'suggested-employers'
				}
			}));
			
			
			innerDiv.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'account-holder-employer'},
				
				classList: Person_p.employer() && Person_p.employer().name() ? ['form-label', 'active'] : ['form-label'],
				
				dataset: {error: 'Please enter your employer'},
				
				innerHTML: 'Your Employer'
			}));
			
			
			innerDiv.appendChild(this.createElement( // data list
			{	
				element: 'datalist',			
				
				attributes: {id: 'suggested-employers'}
			}));
			
			
			outerDiv =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
						
			outerDiv.appendChild(innerDiv);
			
			containerDiv.appendChild(outerDiv);			

		
		// Add birthday field

			containerDiv.appendChild(this.createDateField(

				's12',

				'account-holder-birthday',

				'Your Birthday',

				false,

				Person_p.birthday()
			));

		
		// Add requirement indicator (asterisk) explanation

			containerDiv.appendChild(this.createRequiredFieldExplanation());

						
		// Add submit and cancel buttons

			containerDiv.appendChild(this.createSubmitCancelButtons('account-holder-form'));

						
		// Update DOM

			this.$renderContext().empty();

			this.$renderContext().append(formElement);
		

		// (Re)assign event handlers to form elements

			$('#account-holder-birthday.datepicker').pickadate({
				
				//closeOnSelect: true, // bug: ineffective
				
				closeOnClear: true,
				
				onSet: function() {this.close()},
				
				selectMonths: true, // Creates a dropdown to control month
				
				selectYears: 15 // Creates a dropdown of 15 years to control year
			});
			
			
			//$('#account-holder-location').focus(this.suggestLocations);

			
			$('#account-holder-name').keyup(function(event) {

				this.validateName(event, 'account-holder-name', 'Please enter your name', true);

			}.bind(this));


			$('#account-holder-email').keyup(function(event) {

				this.validateEmail(event, 'account-holder-email', false);

			}.bind(this));

			
			$('#account-holder-form-cancel').click(function(event) {

				this.cancel(event);

			}.bind(this));


			$('#account-holder-form-submit').mousedown(function(event) { // submit (blur hides click event so using mousedown)

				this.submit(event);

			}.bind(this));
	}

	else { // present default message

		this.$renderContext().empty();

		this.$renderContext().append(this.createElement(
		{
			element: 'p',

			innerHTML: 'No profile selected. Please select or create a profile in order to edit details.'
		}));
	}
};


/** Submits person form to controller if it passes all validations
*
* @return {Boolean} true if validation and is succesful, otherwise false
*
* @todo Fix employer hack same is in EventView
*/

app.AccountProfileView.prototype.submit = function(nEvent) {

	// First display any and all validation errors at once

	void this.validateName(event, 'account-holder-name', 'Please enter your name', true);

	void this.validateEmail(event, 'account-holder-email', false);

	// Then do it again to obtain validation status

	// (Chain stops at first false, so no use for UI)
	
	if (this.validateName(event, 'account-holder-name', 'Please enter your name', true)

		&& this.validateEmail(event, 'account-holder-email', false)) { // Submit results if all validations pass

		// Nofity observers by passing them a new Person with the data from the form

		var person = new app.Person($('#account-holder-name').val());

		person.jobTitle($('#account-holder-jobtitle').val());

		person.email($('#account-holder-email').val() !== '' ? new app.Email($('#account-holder-email').val()) : null);
		
		person.employer($('#account-holder-employer').val() !== '' ? new app.Organization($('#account-holder-employer').val()) : null); //hack

		person.birthday($('#account-holder-birthday').val() !== '' ? new Date($('#account-holder-birthday').val()) : null);
		
		//this.notifyObservers(person, parseInt($('#account-holder-id').val()));

		this.ssuper().prototype.submit.call(

			this,
			
			person);
		
		return true;
	}

	return false;
};