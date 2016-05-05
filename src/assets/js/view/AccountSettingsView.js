'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class AccountSettingsView extends FormView
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

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

	module.AccountSettingsView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'AccountSettingsView';

		this.ssuper = module.FormView;

		
		// Initialize instance members inherited from parent class
		
		module.FormView.call(this, module.Account, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.AccountSettingsView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from FormView
	*---------------------------------------------------------------------------------------*/	

	module.AccountSettingsView.prototype = Object.create(module.FormView.prototype); // Set up inheritance

	module.AccountSettingsView.prototype.constructor = module.AccountSettingsView; //Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods
	*---------------------------------------------------------------------------------------*/

	/** Renders account to form in UI
	*
	* @param {Account} The account from which to present data in the form
	*
	* @return void
	 */

	module.AccountSettingsView.prototype.render = function(Account_a) {

		var container; // shorthand reference to inherited temporary container element

		
		if (Account_a) {
			
			// Setup container div

				container = this.containerElement(this.createWidget(

					'HTMLElement',

					{
						element: 'div',			
						
						classList: ['row']
					}
				));

			
			// Add heading
				
				container.appendChild(this.createWidget(

					'HTMLElement',

					{
						element: 'h4',

						attributes: {role: 'heading'},

						innerHTML: this.heading()
					}
				));


			// Add form

				var formElement = this.createWidget(

					'FormWidget',

					{
						id: 'account-settings-form',

						autocomplete: 'off',

						novalidate: false
					}
				);

				container.appendChild(formElement);


			// Add hidden account id field

				formElement.appendChild(this.createWidget(

					'HTMLElement',

					{
						element: 'input',

						attributes: {id: 'account-settings-id', type: 'hidden', value: Account_a.id()}
					}
				));

			
			// Add email field

				formElement.appendChild(this.createWidget(

					'EmailInputWidget',

					{
						width: 's12',

						id: 'account-settings-email',

						label: 'Email',

						required: true,

						datasource: Account_a.email()
					}
				));

				
			// Add password field

				formElement.appendChild(this.createWidget(

					'PasswordInputWidget',

					{
						width: 's12',

						id: 'account-settings-password',

						label: 'Password',

						hintsprefix: 'account-settings-password-hints',

						datasource: Account_a.password() || null
					}
				));

				
			// Add password confirmation field

				formElement.appendChild(this.createWidget(

					'PasswordConfirmationInputWidget',

					{
						width: 's12',

						id: 'account-settings-password-confirmation'
					}
				));

								
			// Add default event capacity field

				formElement.appendChild(this.createWidget(

					'NumberInputWidget',
				
					{
						width: 's12',

						id: 'account-settings-capacity',

						label: 'Default Event Capacity',

						required: false,

						datasource: Account_a.defaultCapacity() ? Account_a.defaultCapacity() : 0,

						min: 0,

						step: 1,

						errormessage: 'Please enter capacity (0 or greater)'
					}
				));

				
			// Add default location field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',

					{
						id: 'account-settings-location',
						
						width: 's12',

						label: 'Default Location',

						required: false,

						datasource: Account_a.defaultLocation() ? Account_a.defaultLocation(): ''//,

						//datalist: 'suggested-locations'
					}
				));

				/*
				formElement.appendChild(this.createWidget(

					'InputDescriptionWidget',

					{
						datasource: 'Entering a default location (e.g. a city and/or street name) helps the app suggest relevant venues when you plan a new event.',

						divider: false
					}
				));
				*/


			// Add local storage permission field

				var outerDiv = this.createWidget(

					'SwitchInputWidget',

					{
						width: 's7',

						id: 'account-settings-localstorage',

						label: 'Allow local storage',

						datasource: Account_a.localStorageAllowed()
					}
				);

				
				outerDiv.appendChild(this.createWidget(

					'InputDescriptionWidget',

					{
						datasource: 'Allowing local storage will enable you to work with your events on this device even when you do not have an internet connection.',

						divider: false
					}
				));

				formElement.appendChild(outerDiv);

			
			// Add geolocation permission field

				outerDiv = this.createWidget(

					'SwitchInputWidget',

					{
						width: 's7',

						id: 'account-settings-geolocation',

						label: 'Allow geolocation',

						datasource: Account_a.geoLocationAllowed()
					}
				);

				
				outerDiv.appendChild(this.createWidget(

					'InputDescriptionWidget',
					{
						datasource: 'Allowing geolocation will enable to the app to suggest event venues and other useful information based on the location of this device.',

						divider: false
					}
				));

				formElement.appendChild(outerDiv);

			
			// Add requirement indicator (asterisk) explanation

				outerDiv = this.createWidget(

					'HTMLElement', // outer div
					{
						element: 'div',			
						
						classList: ['row']
					}
				);
				
				outerDiv.appendChild(this.createWidget(

					'HTMLElement',

					{
						element: 'p',
						
						classList: ['required-indicator'],
							
						innerHTML: '* indicates a required field'
					}
				));

				formElement.appendChild(outerDiv);

							
			// Add submit and cancel buttons

				outerDiv = this.createWidget(

					'HTMLElement', // outer div

					{
						element: 'div',			
						
						classList: ['row', 'form-submit']
					}
				);
				
				
				outerDiv.appendChild(this.createWidget(

					'CancelButtonWidget',  // cancel button

					{					
						id: 'account-settings-cancel',

						label: 'Cancel'
					}
				));

				
				outerDiv.appendChild(this.createWidget(

					'SubmitButtonWidget',  // submit button

					{					
						id: 'account-settings-submit',

						label: 'Done',

						icon: 'send'
					}
				));

				formElement.appendChild(outerDiv);
		}

		else { // present default message

			container.appendChild(this.createElement(
			{
				element: 'p',

				innerHTML: 'No account selected. Please select or create a account in order to edit details.'
			}));
		}

		
		// Render to DOM

			this.ssuper().prototype.render.call(this);

		
		// Do post-render initialization

			this.init();

		
			$('#account-settings-password').blur(function(nEvent) { // hide password hints, show confirmation (global handler takes care of the rest)

				if ($(nEvent.currentTarget).val().length > 0 // pw is not empty

					&& $(nEvent.currentTarget).val() !== $(nEvent.currentTarget).data('value') // pw is 'dirty'

					&&  $(nEvent.currentTarget)[0].checkValidity()) { // pw is valid

						$('#account-settings-password-confirmation-parent').removeClass('hidden');

						$('#account-settings-password-confirmation-parent').show('slow');
				}
			});
	};


	/** Submits account form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*
	* @todo Fix host hack
	*/

	module.AccountSettingsView.prototype.submit = function(nEvent) {

		if (app.FormWidget.instance().validate($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

			// Create a temporary, new account with the data from the form

			var account = new module.Account();

			account.email(new module.Email($('#account-settings-email').val()));

			account.password(new module.Password($('#account-settings-password').val()));

			// leaving source.accountHolder undefined causes Account update() to skip it, leaving the original intact

			account.defaultCapacity(parseInt($('#account-settings-capacity').val()));

			account.defaultLocation($('#account-settings-location').val());

			account.geoLocationAllowed($('#account-settings-geolocation').prop('checked'));

			account.localStorageAllowed($('#account-settings-localstorage').prop('checked'));
			
			this.ssuper().prototype.submit.call(

				this,
				
				account
			);
			
			return true;
		}

		return false;
	};

})(app);