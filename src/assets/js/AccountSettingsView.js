'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class AccountSettingsView Implements IViewable
**********************************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual accounts. Renders account in UI, and captures UI events on account.
*
* @constructor
*
* @implements IViewable
*
* @param (String) elementId Id of the HTML DOM element the view is bound to
*
* @param (String) heading Content for the list heading
*
* @author Ulrik H. Gade, February 2016
*/

app.AccountSettingsView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _implements = [app.IObservable, app.IObserver, app.IViewable], // list of interfaces implemented by this class (by function reference);

	$_renderContext = $('#' + str_elementId),

	_heading = str_heading, // content of the view heading

	_modelId; // id of the model object currently presented in the view


	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	
	

	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Get ID of model object currently being presented by the view
	*
	* @return {int}
	*/

	this.modelId = function() {

		return _modelId;
	}


	/** Gets HTML element this view will render to */

	this.renderContext = function() {

		if (arguments.length > 0) {

			throw new IllegalArgumentError('Render context is readonly');
		}

		return $_renderContext;
	}
	

	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	// none so far


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	/** Cancels entries in, and navigation to, account form
	*
	* @todo Everything(!)
	*/

	this.cancel = function() {

		// do something!
	}


	/** Returns true if class implements the interface passed in (by function reference)
	*
	* (Method realization required by ISerializable.)
	*
	* @param {Function} interface The interface we wish to determine if this class implements
	*
	* @return {Boolean} instanceof True if class implements interface, otherwise false
	*	
	*/
	
	this.isInstanceOf = function (func_interface) {
		
		return _implements.indexOf(func_interface) > -1;
	};
	

	/** Renders account to form in UI
	*
	* @param {Account} The account from which to present data in the form
	*
	* @return void
	*
	* @todo Get character counter to work on description field
	 */
	
	this.render = function(Account_account) {

		var account = Account_account,

		accountHolder, formElement, containerDiv, innerDiv, outerDiv, labelElement, pElement, buttonElement, iconElement, spanElement, switchElement, $formDiv;

		
		
		if (account) {
			
			// Setup up form and container div

				formElement =  this.createElement( // form
				{
					element: 'form',			
					
					attributes: {id: 'account-settings-form', novalidate: false},
					
					classList: ['col', 's12']
				});


				containerDiv =  this.createElement( // div
				{
					element: 'div',			
					
					classList: ['row']
				});
				

				formElement.appendChild(containerDiv);
			

			// Add heading
				
				containerDiv.appendChild(this.createHeading('s12', _heading));


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

					account.email()
				));


			// Add password field

				containerDiv.appendChild(this.createPasswordField(

					's12',

					'account-settings-password',

					 'account-settings-password-hints',

					 Account_account
				));


			// Add password confirmation field

				containerDiv.appendChild(this.createPasswordConfirmationField(

					's12',

					'account-settings-password-confirmation'
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
						
						value: account.defaultLocation() ? account.defaultLocation(): ''
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

				$_renderContext.empty();

				$_renderContext.append(formElement);


			// (Re)assign account handlers to form elements

				$('#account-settings-email').keyup(function(event) { // validate email

					this.validateEmail(event, 'account-settings-email', true);

				}.bind(this));
				
				
				$('#account-settings-password').focus(function(event) { // update and show password hints

					this.validatePassword(event, 'account-settings-password', 'account-settings-password-hints');

					$('#account-settings-password-hints').show('slow');

				}.bind(this));


				$('#account-settings-password').keyup(function(event) { // validate password

					this.validatePassword(event, 'account-settings-password', 'account-settings-password-hints');

				}.bind(this));

				
				$('#account-settings-password').blur(function(event) { // hide password hints

					$('#account-settings-password-hints').hide('slow');
				});
				

				$('#account-settings-password').change(function(event) { // show password confirmation, if password changed

					this.isPasswordDirty = true; // enable confirmation

					$('#account-settings-password-confirmation-parent').show('slow');

				}.bind(this));


				$('#account-settings-password-confirmation').keyup(function(event) { // validate password confirmation

					this.validatePasswordConfirmation(event, 'account-settings-password', 'account-settings-password-confirmation');
		
				}.bind(this));


				$('#account-settings-capacity').keyup(function(event) { // validate default capacity

					this.validateCapacity(event, 'account-settings-capacity');
		
				}.bind(this));


				$('#account-settings-cancel').click(function(event) {

					window.history.back(); // return to previous view

					// for now, simply discard any entries made by user

				}.bind(this));


				$('#account-settings-submit').click(function(event) {

					console.log('submit');

					if (this.submit(event)) { // submit succesfull

						window.history.back(); // return to previous view
					}

					else {

						console.log('account settings form submission failed')
					}

				}.bind(this));
		}

		else { // present default message

			$_renderContext.empty();

			$_renderContext.append(this.createElement(
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

	this.submit = function(event) {

		// First display any and all validation errors at once

		void this.validateEmail(event, 'account-settings-email', true);

		void this.validatePassword(event, 'account-settings-password', 'account-settings-password-hints');

		void this.validatePasswordConfirmation(event, 'account-settings-password', 'account-settings-password-confirmation');

		void this.validateCapacity(event, 'account-settings-capacity');

		// Then do it again to obtain validation status

		// (Chain stops at first false, so no use for UI)

		var valid =

			this.validateEmail(event, 'account-settings-email', true)

			&& this.validatePassword(event, 'account-settings-password', 'account-settings-password-hints')

			&& this.validatePasswordConfirmation(event, 'account-settings-password', 'account-settings-password-confirmation')

			&& this.validateCapacity(event, 'account-settings-capacity');
		
		
		if (valid) { // Submit results if all validations pass

			// Create a temporary, new account with the data from the form

			var account = new app.Account();

			account.email(new app.Email($('#account-settings-email').val()));

			account.password(new app.Password($('#account-settings-password').val()));

			// leaving source.accountHolder undefined causes Account update() to skip it, leaving the original intact

			account.defaultCapacity(parseInt($('#account-settings-capacity').val()));

			account.defaultLocation($('#account-settings-location').val());

			account.geoLocationAllowed($('#account-settings-geolocation').prop('checked'));

			account.localStorageAllowed($('#account-settings-localstorage').prop('checked'));

			
			// Notify observers by passing them a reference to the temporary account,
			// and the id of the account to be updated

			this.notifyObservers(account, parseInt($('#account-settings-id').val()));
			
			return true;
		}

		return false;
	}


	/** Updates account presentation when notified by controller of change */
	
	this.update = function(IModelable_account) {
		
		if (IModelable_account.constructor === app.Account) {

			this.render(IModelable_account);

			_modelId = IModelable_account.id();
		}

		// else do nothing
	};
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/
		
	$_renderContext.addClass('iviewable'); // set shared view class on main HTML element
};


/*----------------------------------------------------------------------------------------
* Public static methods
*---------------------------------------------------------------------------------------*/

// none so far

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IObservable, app.AccountSettingsView);

void app.IInterfaceable.mixInto(app.IObserver, app.AccountSettingsView);

void app.IInterfaceable.mixInto(app.IViewable, app.AccountSettingsView);