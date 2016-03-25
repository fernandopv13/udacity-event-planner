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

		var widgetFactory = app.UIWidgetFactory.instance();
			
		if (Account_a) {
			
			// Setup up form and container div

				var formElement = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // form
				{
					element: 'form',			
					
					attributes: {autocomplete: 'off', id: 'account-settings-form', novalidate: false},
					
					classList: ['col', 's12']
				});


				var containerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
				{
					element: 'div',			
					
					classList: ['row']
				});
				

				formElement.appendChild(containerDiv);
			

			// Add heading
				
				containerDiv.appendChild(this.createHeading('s12', this.heading()));


			// Add hidden account id field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
				{
					element: 'input',

					attributes: {id: 'account-settings-id', type: 'hidden', value: Account_a.id()}
				}));

			
			// Add email field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'EmailInputWidget',
				{
					width: 's12',

					id: 'account-settings-email',

					label: 'Email',

					required: true,

					datasource: Account_a.email()
				}));


			// Add password field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'PasswordInputWidget',
				{
					width: 's12',

					id: 'account-settings-password',

					label: 'Password',

					hintsprefix: 'account-settings-password-hints',

					datasource: Account_a.password() || null
				}));


			// Add password confirmation field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'PasswordConfirmationInputWidget',
				{
					width: 's12',

					id: 'account-settings-password-confirmation'
				}));

				
			// Add default event capacity field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'NumberInputWidget',
				{
					width: 's12',

					id: 'account-settings-capacity',

					label: 'Default Event Capacity',

					required: true,

					datasource: Account_a.defaultCapacity() ? Account_a.defaultCapacity() : 0,

					min: 0,

					step: 1,

					errormessage: 'Please enter capacity (0 or greater)'
				}));
				

			// Add default location field

				var innerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's12']
				});
				
				innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', //input
				{
					element: 'input',			
					
					attributes:
					{
						type: 'text',
						
						id: 'account-settings-location',
						
						value: Account_a.defaultLocation() ? Account_a.defaultLocation(): '',

						role: 'textbox'
					}
				}));
				
				
				innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-settings-location'},
					
					classList: ['active'], //Account_a.defaultLocation() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter default location'},
					
					innerHTML: 'Default Location'
				}));
				
				
				var outerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				
				outerDiv.appendChild(innerDiv);

				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'InputDescriptionWidget',
				{
					datasource: 'Entering a default location (e.g. a city and/or street name) helps the app suggest relevant venues when you plan a new event.',

					divider: false
				}));

				containerDiv.appendChild(outerDiv);


			// Add local storage permission field

				outerDiv = widgetFactory.createProduct.call(widgetFactory, 'SwitchInputWidget',
				{
					width: 's7',

					id: 'account-settings-localstorage',

					label: 'Allow local storage',

					datasource: Account_a.localStorageAllowed()
				});

				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'InputDescriptionWidget',
				{
					datasource: 'Allowing local storage will enable you to work with your events on this device even when you do not have an internet connection.',

					divider: false
				}));

				containerDiv.appendChild(outerDiv);

			
			// Add geolocation permission field

				outerDiv = widgetFactory.createProduct.call(widgetFactory, 'SwitchInputWidget',
				{
					width: 's7',

					id: 'account-settings-geolocation',

					label: 'Allow local geolocation',

					datasource: Account_a.geoLocationAllowed()
				});
				
				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'InputDescriptionWidget',
				{
					datasource: 'Allowing geolocation will enable to the app to suggest event venues and other useful information based on the location of this device.',

					divider: false
				}));

				containerDiv.appendChild(outerDiv);

			
			// Add requirement indicator (asterisk) explanation

				outerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // outer div
				{
					element: 'div',			
					
					classList: ['row']
				});
				
				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
				{
					element: 'p',
					
					classList: ['required-indicator'],
						
					innerHTML: '* indicates a required field'
				}));

				containerDiv.appendChild(outerDiv);

							
			// Add submit and cancel buttons

				outerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // outer div
				{
					element: 'div',			
					
					classList: ['row', 'form-submit']
				});
				
				
				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'CancelButtonWidget',  // cancel button
				{					
					id: 'account-settings-cancel',

					label: 'Cancel'
				}));

				this.elementOptions['account-settings-cancel'] =
				{
					init: module.CancelButtonWidget.prototype.init
				}
				

				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'SubmitButtonWidget',  // submit button
				{					
					id: 'account-settings-submit',

					label: 'Done',

					icon: 'send'
				}));

				this.elementOptions['account-settings-submit'] =
				{
					init: module.SubmitButtonWidget.prototype.init
				}

				containerDiv.appendChild(outerDiv);

				
			// Update DOM

				this.$renderContext().empty();

				this.$renderContext().append(formElement);


			// Initialize and (re)assign evnet handlers to form elements

				/*
				$('#account-settings-email, #account-settings-password, #account-settings-password-confirmation').on('input', function(nEvent) { // interactively validate email, password etc

				if (nEvent.currentTarget.value.length > 3) { // allow people to get started before showing error message (we need at least 3 chars anyway)

					Materialize.updateTextFields(nEvent.currentTarget); // implicitly calls custom validator
				}

				}.bind(this));
				*/
				
				
				$('#account-settings-password').focus(function(nEvent) { // update and show password hints

					app.PasswordInputWidget.instance().validate(nEvent.currentTarget, '#account-settings-password-hints');

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
				$('#account-settings-cancel').click(function(nEvent) { // cancel (blur hides click event so using mousedown)

					this.cancel(nEvent);
					
				}.bind(this));


				$('#account-settings-submit').mousedown(function(nEvent) { // submit (blur hides click event so using mousedown)

					this.submit(nEvent);
					
				}.bind(this));
				*/
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