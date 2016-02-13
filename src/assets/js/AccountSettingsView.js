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

	_heading = str_heading;


	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	// none so far
	

	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	// none so far


	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	

	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	/** Cancels entries in, and navigation to, account form
	*
	* @todo Everything(!)
	*/

	app.AccountSettingsView.prototype.cancel = function() {

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
	

	/** Notifies observers that form has been updated (i.e. submitted).
	*
	* Overrides default method in IObservable.
	*
	* @param {Account} The Account passing data in the form onto the observers
	*
	* @return void
	 */

	/*
	app.AccountSettingsView.prototype.notifyObservers = function(IModelable_account, int_objId) {

		this.observers.forEach(function(observer) {

			observer.update(IModelable_account, int_objId);
		});
	};
	*/

	/** Renders account to form in UI
	*
	* @param {Account} The account from which to present data in the form
	*
	* @return void
	*
	* @todo Get character counter to work on description field
	 */
	
	app.AccountSettingsView.prototype.render = function(Account_account) {

		var account = Account_account,

		accountHolder, formElement, containerDiv, innerDiv, outerDiv, labelElement, pElement, buttonElement, iconElement, spanElement, switchElement, $formDiv;

		
		
		if (account) {
			
			// Setup up form and container div

				formElement =  this.createElement( // form
				{
					element: 'form',			
					
					attributes: {id: 'account-settings-form', novalidate: true},
					
					classList: ['col', 's12']
				});


				containerDiv =  this.createElement( // div
				{
					element: 'div',			
					
					classList: ['row']
				});
				

				formElement.appendChild(containerDiv);
			

			// Add heading
				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',			
					
					classList: ['row']
				});

				containerDiv.appendChild(outerDiv);

				innerDiv =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['col', 's12']
				});

				innerDiv.appendChild(this.createElement({

					element: 'h4',

					innerHTML: _heading

				}));

				outerDiv.appendChild(innerDiv);


			// Add hidden account id field

				containerDiv.appendChild(this.createElement({

					element: 'input',

					attributes: {id: 'account-settings-id', type: 'hidden', value: account.id()}
				}));

			
			// Add email field

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
						type: 'email',
						
						id: 'account-settings-email',
						
						value: account.email() && account.email().address() ? account.email().address() : '',

						required: 'true'
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-settings-email'},
					
					classList: account.email() && account.email().address() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter email'},
					
					innerHTML: 'Email'
				});
				
				labelElement.appendChild(this.createElement( // required field indicator
				{
					element: 'span',

					classList: ['required-indicator'],

					innerHTML: '*'
				}));

				innerDiv.appendChild(labelElement);

				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				
				outerDiv.appendChild(innerDiv);
				
				containerDiv.appendChild(outerDiv);


			// Add password field

				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				
				innerDiv =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's12']
				});
				
				outerDiv.appendChild(innerDiv);


				innerDiv.appendChild(this.createElement( // input
				{
					element: 'input',			
					
					attributes:
					{
						type: 'text',
						
						id: 'account-settings-password',
						
						value: account.password() && account.password().password() ? account.password().password() : '',

						required: 'true'
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-settings-password'},
					
					classList: account.password() && account.password().password() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter password'},
					
					innerHTML: 'Password'
				});
				
				labelElement.appendChild(this.createElement( // required field indicator
				{
					element: 'span',

					classList: ['required-indicator'],

					innerHTML: '*'
				}));

				innerDiv.appendChild(labelElement);

				
				innerDiv =  this.createElement( // inner div (for validation hits)
				{
					element: 'div',

					attributes: {id: 'account-settings-password-hints'},
					
					classList: ['col', 's12', 'hide']
				});

				outerDiv.appendChild(innerDiv);


				pElement = this.createElement(
				{
					element: 'p',

					attributes: {id: 'password-validation-hint-charcount'},

					classList: ['password-validation-hint'],

					innerHTML: 'Must be at least 8 characters long'
				});

				pElement.appendChild(this.createElement(
				{
					element: 'i',

					classList: ['material-icons', 'left'],

					innerHTML: 'error'
				}));

				innerDiv.appendChild(pElement);

				
				pElement = this.createElement(
				{
					element: 'p',

					attributes: {id: 'password-validation-hint-uppercase'},

					classList: ['password-validation-hint'],

					innerHTML: 'Must contain Upper Case characters'
				});

				pElement.appendChild(this.createElement(
				{
					element: 'i',

					classList: ['material-icons', 'left'],

					innerHTML: 'error'
				}));

				innerDiv.appendChild(pElement);


				pElement = this.createElement(
				{
					element: 'p',

					attributes: {id: 'password-validation-hint-lowercase'},

					classList: ['password-validation-hint'],

					innerHTML: 'Must contain lower case characters'
				});

				pElement.appendChild(this.createElement(
				{
					element: 'i',

					classList: ['material-icons', 'left'],

					innerHTML: 'error'
				}));

				innerDiv.appendChild(pElement);
				

				pElement = this.createElement(
				{
					element: 'p',

					attributes: {id: 'password-validation-hint-number'},

					classList: ['password-validation-hint'],

					innerHTML: 'Must contain numbers'
				});

				pElement.appendChild(this.createElement(
				{
					element: 'i',

					classList: ['material-icons', 'left'],

					innerHTML: 'error'
				}));

				innerDiv.appendChild(pElement);


				pElement = this.createElement(
				{
					element: 'p',

					attributes: {id: 'password-validation-hint-punctuation'},

					classList: ['password-validation-hint'],

					innerHTML: 'Must contain one ore more of !@#$%^&'
				});

				pElement.appendChild(this.createElement(
				{
					element: 'i',

					classList: ['material-icons', 'left'],

					innerHTML: 'error'
				}));

				innerDiv.appendChild(pElement);
				
				
				containerDiv.appendChild(outerDiv);


			// Add password confirmation field

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
						
						id: 'account-settings-password-confirmation',
						
						value: '',//account.password() && account.password().password() ? account.password().password() : '',

						required: 'true'
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-password-confirmation'},
					
					classList: account.password() && account.password().password() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please confirm password'},
					
					innerHTML: 'Confirm Password'
				});
				
				labelElement.appendChild(this.createElement( // required field indicator
				{
					element: 'span',

					classList: ['required-indicator'],

					innerHTML: '*'
				}));

				innerDiv.appendChild(labelElement);

				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				
				outerDiv.appendChild(innerDiv);
				
				containerDiv.appendChild(outerDiv);


			// Add default event capacity field

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
						type: 'number',
						
						id: 'account-settings-capacity',
						
						min: 0,
						
						step: 1,
						
						value: account.defaultCapacity() >= 0 ? account.defaultCapacity() : '',
						
						required: true
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-settings-capacity'},
					
					classList: account.defaultCapacity() >= 0 ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter default event capacity'},
					
					innerHTML: 'Default event capacity'
				});
				
				labelElement.appendChild(this.createElement( // required field indicator
				{
					element: 'span',

					classList: ['required-indicator'],

					innerHTML: '*'
				}));
				
				innerDiv.appendChild(labelElement);

				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				outerDiv.appendChild(innerDiv);

				
				outerDiv.appendChild(this.createFieldDescription('The default event capacity is the maximum number of participants you will usually want to set for an event. You can change this any time you want.', true));
				
				
				containerDiv.appendChild(outerDiv);


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

				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});

				
				innerDiv =  this.createElement( // inner div for main switch label
				{
					element: 'div',			
					
					classList: ['col', 's7']
				});

				outerDiv.appendChild(innerDiv);


				innerDiv.appendChild(this.createElement( // main switch label
				{	
					element: 'span',

					classList: ['form-label', 'input-switch-label'],

					innerHTML: 'Allow local storage'

				}));

				
				innerDiv =  this.createElement( // inner div for switch widget
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's5']
				});

				outerDiv.appendChild(innerDiv);
				
				
				switchElement = this.createElement( // switch div
				{
					element: 'div',
					
					classList: ['switch']
				});

				innerDiv.appendChild(switchElement);
				
				
				spanElement = this.createElement({ // div holding switch widget itself

					element: 'span',

					classList: ['input-switch-widget']
				});

				switchElement.appendChild(spanElement);


				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-settings-localstorage'},
					
					classList: ['form-label', 'active']
				});
				
				
				labelElement.appendChild(this.createElement( // 'not selected' minor label
				{	
					element: 'span',

					classList: ['form-label', 'input-switch-off-label'],

					innerHTML: 'No'

				}));

				
				labelElement.appendChild(this.createElement( // input
				{	
					element: 'input',			
					
					attributes: (function(){

						var attr = {id: 'account-settings-localstorage', type: 'checkbox'};

						if (account.localStorageAllowed()) {attr.checked = true;}

						return attr;
					})()
				}));

				
				labelElement.appendChild(this.createElement( // span
				{	
					element: 'span',
					
					classList: ['lever']
				}));

				
				labelElement.appendChild(this.createElement( // 'selected' minor label
				{	
					element: 'span',

					classList: ['form-label', 'input-switch-on-label'],

					innerHTML: 'Yes'

				}));

				spanElement.appendChild(labelElement);


				outerDiv.appendChild(this.createFieldDescription('Allowing local storage will enable you to work with your events on this device even when you do not have an internet connection'));

				
				containerDiv.appendChild(outerDiv);			

			
			// Add geolocation permission field

				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});

				
				innerDiv =  this.createElement( // inner div for main switch label
				{
					element: 'div',			
					
					classList: ['col', 's7']
				});

				outerDiv.appendChild(innerDiv);


				innerDiv.appendChild(this.createElement( // main switch label
				{	
					element: 'span',

					classList: ['form-label', 'input-switch-label'],

					innerHTML: 'Allow geolocation'

				}));

				
				innerDiv =  this.createElement( // inner div for switch widget
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's5']
				});

				outerDiv.appendChild(innerDiv);
				
				
				switchElement = this.createElement( // switch div
				{
					element: 'div',
					
					classList: ['switch']
				});

				innerDiv.appendChild(switchElement);
				
				
				spanElement = this.createElement({ // div holding switch widget itself

					element: 'span',

					classList: ['input-switch-widget']
				});

				switchElement.appendChild(spanElement);


				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-settings-geolocation'},
					
					classList: ['form-label', 'active']
				});
				
				
				labelElement.appendChild(this.createElement( // 'not selected' minor label
				{	
					element: 'span',

					classList: ['form-label', 'input-switch-off-label'],

					innerHTML: 'No'

				}));

				
				labelElement.appendChild(this.createElement( // input
				{	
					element: 'input',			
					
					attributes: (function(){

						var attr = {id: 'account-settings-geolocation', type: 'checkbox'};

						if (account.geoLocationAllowed()) {attr.checked = true;}

						return attr;
					})()
				}));

				
				labelElement.appendChild(this.createElement( // span
				{	
					element: 'span',
					
					classList: ['lever']
				}));

				
				labelElement.appendChild(this.createElement( // 'selected' minor label
				{	
					element: 'span',

					classList: ['form-label', 'input-switch-on-label'],

					innerHTML: 'Yes'

				}));

				spanElement.appendChild(labelElement);

		
				outerDiv.appendChild(this.createFieldDescription('Allowing geolocation will enable to the app to suggest event venues and other useful information based on the location of this device'));

				
				containerDiv.appendChild(outerDiv);

			
			// Add requirement indicator (asterisk) explanation

				outerDiv =  this.createElement( // outer div
				{
					element: 'div',			
					
					classList: ['row']
				});
				
				outerDiv.appendChild(this.createElement({
				
					element: 'p',
					
					classList: ['required-indicator'],
						
					innerHTML: '* indicates a required field'
				}));
				
				
				containerDiv.appendChild(outerDiv);

			
			// Add submit and cancel buttons

				outerDiv =  this.createElement( // outer div
				{
					element: 'div',			
					
					classList: ['row', 'form-submit']
				});
				
				
				outerDiv.appendChild(this.createElement({ // cancel button
					
					element: 'a',
					
					attributes: {id: 'account-settings-cancel'},
					
					classList: ['waves-effect', 'waves-teal', 'btn-flat'],

					innerHTML: 'Cancel'
				}));
				
				
				buttonElement =  this.createElement({ // submit button
					
					element: 'a',
					
					attributes: {id: 'account-settings-submit'},
					
					classList: ['waves-effect', 'waves-light', 'btn'],

					innerHTML: 'Done'
				});
				
				
				buttonElement.appendChild(this.createElement({ // 'send' icon
					
					element: 'i',
					
					classList: ['material-icons', 'right'],
					
					innerHTML: 'send'
				}));
				
				
				outerDiv.appendChild(buttonElement);

				containerDiv.appendChild(outerDiv);

			
			// Update DOM

				$_renderContext.empty();

				$_renderContext.append(formElement);


			// (Re)assign account handlers to form elements

				//$('#account-location').focus(this.suggestLocations);
				
				$('#account-settings-name').keyup(this.validateName);

				$('#account-settings-password').keyup(this.validatePassword);

				$('#account-settings-password').focus(function() {

					this.validatePassword($('#account-settings-password').val());

					$('#account-settings-password-hints').removeClass('hide');

				}.bind(this));

				$('#account-settings-password').blur(function() {$('#account-settings-password-hints').addClass('hide');});

				
				

				$('#account-settings-submit').click(function() {this.submit();}.bind(this));
		}

		else { // present default message

			$_renderContext.empty();

			$_renderContext.append(
			{
				element: 'p',

				innerHTML: 'No account selected. Please select or create a account in order to edit details.'
			});
		}
	};


	/** Submits account form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*
	* @todo Fix host hack
	*/

	app.AccountSettingsView.prototype.submit = function() {

		// Account handler binds to this, so reference works here
		
		if (true) { // Submit results if all validations pass

			// Create a temporary, new account with the data from the form

			var account = new app.Account()

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
	
	app.AccountSettingsView.prototype.update = function(IModelable_account) {
		
		this.render(IModelable_account);
	};
	

	/* Event handler for interactive validation of account name field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	
	app.AccountSettingsView.prototype.validateName = function() {

		var $name = $('#account-name');

		if ($name.val() === '') { // empty
		
			if (account && account.target.labels) { // Chrome (does not update display if setting with jQuery)

				account.target.labels[0].dataset.error = 'Please enter account name';
			}

			else { // Other browsers (updated value may not display, falls back on value in HTML)

				$name.next('label').data('error', 'Please enter account name');
			}

			$name.addClass('invalid');

			return false;
		}

		else {

			$name.removeClass('invalid');
		}

		return true;
	}


	/* Event handler for interactive validation of account name field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	
	app.AccountSettingsView.prototype.validatePassword = function() {

		var password = $('#account-settings-password').val(), ret, tmp;

		var invalidIcon = 'error', validIcon = 'done'

		
		tmp = app.Password.hasValidCharacterCount(password);

		ret = tmp;

		if (tmp) {$('#password-validation-hint-charcount').find('i').html(validIcon);}

		else {$('#password-validation-hint-charcount').find('i').html(invalidIcon);}

				
		tmp = app.Password.hasValidUpperCaseCount(password);

		ret = ret && tmp;

		if (tmp) {$('#password-validation-hint-uppercase').find('i').html(validIcon);}

		else {$('#password-validation-hint-uppercase').find('i').html(invalidIcon);}


		tmp = app.Password.hasValidLowerCaseCount(password);

		ret = ret && tmp;

		if (tmp) {$('#password-validation-hint-lowercase').find('i').html(validIcon);}

		else {$('#password-validation-hint-lowercase').find('i').html(invalidIcon);}

		
		tmp = app.Password.hasValidNumberCount(password);

		ret = ret && tmp;

		if (tmp) {$('#password-validation-hint-number').find('i').html(validIcon);}

		else {$('#password-validation-hint-number').find('i').html(invalidIcon);}


		tmp = app.Password.hasValidPunctuationCount(password);

		ret = ret && tmp;

		if (tmp) {$('#password-validation-hint-punctuation').find('i').html();}

		else {$('#password-validation-hint-punctuation').find('i').html(invalidIcon);}


		return ret;
	};


	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// none so far
	
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