'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class AccountSettingsView extends FormView
**********************************************************************************************/

var app = app || {};

/** @classdesc View class for account settings. Renders account in UI, and captures UI events on account.
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

app.AccountSettingsView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.className = 'AccountSettingsView';

	this.ssuper = app.FormView;

	
	// Initialize instance members inherited from parent class
	
	app.FormView.call(this, app.Account, str_elementId, str_heading);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.AccountSettingsView);
};

/*----------------------------------------------------------------------------------------
* Inherit from FormView
*---------------------------------------------------------------------------------------*/	

app.AccountSettingsView.prototype = Object.create(app.FormView.prototype); // Set up inheritance

app.AccountSettingsView.prototype.constructor = app.AccountSettingsView; //Reset constructor property



/*----------------------------------------------------------------------------------------
* Public instance methods
*---------------------------------------------------------------------------------------*/

/** Renders account to form in UI
*
* @param {Account} The account from which to present data in the form
*
* @return void
 */

app.AccountSettingsView.prototype.render = function(Account_account) {

	var account = Account_account, accountHolder, formElement, containerDiv, innerDiv, outerDiv, labelElement, pElement, buttonElement, iconElement, spanElement, switchElement, $formDiv;
		
	if (account) {
		
		// Setup up form and container div

			formElement =  this.createElement( // form
			{
				element: 'form',			
				
				attributes: {autocomplete: 'off', id: 'account-settings-form', novalidate: false},
				
				classList: ['col', 's12']
			});


			containerDiv =  this.createElement( // div
			{
				element: 'div',			
				
				classList: ['row']
			});
			

			formElement.appendChild(containerDiv);
		

		// Add heading
			
			containerDiv.appendChild(this.createHeading('s12', this.heading()));


		// Add hidden account id field

			containerDiv.appendChild(this.createElement({

				element: 'input',

				attributes: {id: 'account-settings-id', type: 'hidden', value: account.id()}
			}));

		
		// Add email field

			containerDiv.appendChild(this.createEmailField(

				's12',

				'account-settings-email',

				'Email',

				true,

				account.email(),

				'app.View.prototype.validateEmail'
			));


		// Add password field

			containerDiv.appendChild(this.createPasswordField(

				's12',

				'account-settings-password',

				'account-settings-password-hints',

				Account_account,

				'app.View.prototype.validatePassword'
			));


		// Add password confirmation field

			containerDiv.appendChild(this.createPasswordConfirmationField(

				's12',

				'account-settings-password-confirmation',

				'app.View.prototype.validatePasswordConfirmation'
			));

			
		// Add default event capacity field

			containerDiv.appendChild(this.createNumberField(

				's12',

				'account-settings-capacity',

				'Default Event Capacity',

				true,

				account.defaultCapacity() ? account.defaultCapacity() : 0,

				0,

				null,

				1,

				'Please enter capacity (0 or greater)'
			));
			

		// Add default location field

			innerDiv =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', 's12']
			});
			
			innerDiv.appendChild(this.createElement( //input
			{
				element: 'input',			
				
				attributes:
				{
					type: 'text',
					
					id: 'account-settings-location',
					
					value: account.defaultLocation() ? account.defaultLocation(): '',

					role: 'textbox'
				}
			}));
			
			
			innerDiv.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'account-settings-location'},
				
				classList: ['active'], //account.defaultLocation() ? ['form-label', 'active'] : ['form-label'],
				
				dataset: {error: 'Please enter default location'},
				
				innerHTML: 'Default Location'
			}));
			
			
			outerDiv =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
						
			
			outerDiv.appendChild(innerDiv);

			outerDiv.appendChild(this.createFieldDescription('Entering a default location (e.g. a city and/or street name) helps the app suggest relevant venues when you plan a new event.'));
			
			containerDiv.appendChild(outerDiv);


		// Add local storage permission field

			outerDiv = this.createSwitchField(

				's7',

				'account-settings-localstorage',

				'Allow local storage',

				account.localStorageAllowed()
			);

			outerDiv.appendChild(this.createFieldDescription('Allowing local storage will enable you to work with your events on this device even when you do not have an internet connection.'));

			containerDiv.appendChild(outerDiv);

		
		// Add geolocation permission field

			outerDiv = this.createSwitchField(

				's7',

				'account-settings-geolocation',

				'Allow local geolocation',

				account.geoLocationAllowed()
			);

			outerDiv.appendChild(this.createFieldDescription('Allowing geolocation will enable to the app to suggest event venues and other useful information based on the location of this device.'));

			containerDiv.appendChild(outerDiv);

		
		// Add requirement indicator (asterisk) explanation

			containerDiv.appendChild(this.createRequiredFieldExplanation());

		
		// Add submit and cancel buttons

			containerDiv.appendChild(this.createSubmitCancelButtons('account-settings'));

		
		// Update DOM

			this.$renderContext().empty();

			this.$renderContext().append(formElement);


		// Initialize and (re)assign evnet handlers to form elements

			$('#account-settings-email, #account-settings-password, #account-settings-password-confirmation').on('input', function(nEvent) { // interactively validate email, password etc

			if (nEvent.currentTarget.value.length > 3) { // allow people to get started before showing error message (we need at least 3 chars anyway)

				//this.validateEmail(nEvent.currentTarget);

				Materialize.updateTextFields(nEvent.currentTarget); // implicitly calls custom validator
			}

			}.bind(this));
			
			
			$('#account-settings-password').focus(function(nEvent) { // update and show password hints

				this.validatePassword(nEvent.currentTarget, '#account-settings-password-hints');

				$('#account-settings-password-hints').show('slow');

				$('#account-settings-password-hints').removeClass('hidden');

				$('#account-settings-password-hints').attr('aria-hidden', false); // doesn't seem to have any effect on screen reader

			}.bind(this));


			$('#account-settings-password').blur(function(nEvent) { // hide password hints, show confirmation (global handler takes care of the rest)

				$('#account-settings-password-hints').hide('slow');

				$('#account-settings-password-hints').attr('aria-hidden', true);

				if ($(nEvent.currentTarget).val().length > 0 // pw is not empty

					&& $(nEvent.currentTarget).val() !== $(nEvent.currentTarget).data('value') // pw is 'dirty'

					&&  $(nEvent.currentTarget).checkValidity()) { // pw is valid

						$('#account-settings-password-confirmation-parent').removeClass('hidden');

						$('#account-settings-password-confirmation-parent').show('slow');
				}
			});


			/*
			$('#account-settings-password').focus(function(event) { // update and show password hints

				this.validatePassword(event, 'account-settings-password', 'account-settings-password-hints');

				$('#account-settings-password-hints').show('slow');

			}.bind(this));



			$('#account-settings-password').on('input', function(event) { // validate password

				this.validatePassword(event, 'account-settings-password', 'account-settings-password-hints');

			}.bind(this));

			
			$('#account-settings-password').blur(function(event) { // hide password hints

				$('#account-settings-password-hints').hide('slow');
			});

			*/
			

			/*
			$('#account-settings-password').change(function(event) { // show password confirmation, if password changed

				this.isPasswordDirty = true; // enable confirmation

				$('#account-settings-password-confirmation-parent').show('slow');

			}.bind(this));


			$('#account-settings-password-confirmation').on('input', function(event) { // validate password confirmation

				this.validatePasswordConfirmation(event, 'account-settings-password', 'account-settings-password-confirmation');
	
			}.bind(this));
			*/


			/*DEPRECATED: Constraint vlidation API should suffice
			$('#account-settings-capacity').on('input', function(nEvent) { // validate default capacity

				this.validateCapacity(event, 'account-settings-capacity');
	
			}.bind(this));
			*/


			$('#account-settings-cancel').click(function(nEvent) {

				this.cancel(nEvent);
				
			}.bind(this));


			$('#account-settings-submit').mousedown(function(nEvent) { // submit (blur hides click event so using mousedown)

				this.submit(nEvent);

			}.bind(this));
	}

	else { // present default message

		this.$renderContext().empty();

		this.$renderContext().append(this.createElement(
		{
			element: 'p',

			innerHTML: 'No account selected. Please select or create a account in order to edit details.'
		}));
	}
};


/** Submits account form to controller if it passes all validations
*
* @return {Boolean} true if validation and is succesful, otherwise false
*
* @todo Fix host hack
*/

app.AccountSettingsView.prototype.submit = function(nEvent) {

	if (this.validateForm($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

		// Create a temporary, new account with the data from the form

		var account = new app.Account();

		account.email(new app.Email($('#account-settings-email').val()));

		account.password(new app.Password($('#account-settings-password').val()));

		// leaving source.accountHolder undefined causes Account update() to skip it, leaving the original intact

		account.defaultCapacity(parseInt($('#account-settings-capacity').val()));

		account.defaultLocation($('#account-settings-location').val());

		account.geoLocationAllowed($('#account-settings-geolocation').prop('checked'));

		account.localStorageAllowed($('#account-settings-localstorage').prop('checked'));

		
		//this.notifyObservers(account, parseInt($('#account-settings-id').val()));

		this.ssuper().prototype.submit.call(

			this,
			
			account
		);
		
		return true;
	}

	return false;
};