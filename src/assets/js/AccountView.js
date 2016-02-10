'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class AccountView Implements IViewable
**********************************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual accounts. Renders account in UI, and captures UI events on account.
*
* @constructor
*
* @implements IViewable
*
* @author Ulrik H. Gade, February 2016
*/

app.AccountView = function(Account_account) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _implements = [app.IObservable, app.IObserver, app.IViewable]; // list of interfaces implemented by this class (by function reference);

	
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

	app.AccountView.prototype.cancel = function() {

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
	app.AccountView.prototype.notifyObservers = function(IModelable_account, int_objId) {

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
	
	app.AccountView.prototype.render = function(Account_account) {

		var account = Account_account,

		accountHolder = account.accountHolder(),

		formElement, containerDiv, innerDiv, outerDiv, labelElement, buttonElement, iconElement, spanElement, switchElement, $formDiv;

		
		if (account !== null) {
			
			// Setup up form and container div

				formElement =  this.createElement( // form
				{
					element: 'form',			
					
					attributes: {novalidate: true},
					
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

					innerHTML: 'Account Settings'

				}));

				outerDiv.appendChild(innerDiv);


			// Add hidden account id field

			containerDiv.appendChild(this.createElement({

				element: 'input',

				attributes: {id: 'account-id', type: 'hidden', value: account.id()}
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
						
						id: 'account-email',
						
						value: account.email() && account.email().address() ? account.email().address() : '',

						required: 'true'
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-email'},
					
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
						
						id: 'account-password',
						
						value: account.password() && account.password().password() ? account.password().password() : '',

						required: 'true'
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-password'},
					
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

				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				
				outerDiv.appendChild(innerDiv);
				
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
						
						id: 'account-password-confirmation',
						
						value: account.password() && account.password().password() ? account.password().password() : '',

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


			// Add account holder field

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
						
						id: 'account-holder',
						
						value: account.accountHolder() && account.accountHolder().name() ? account.accountHolder().name() : ''
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-holder'},
					
					classList: account.accountHolder() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter account holder'},
					
					innerHTML: 'Account Holder'
				}));
				
				
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
						
						id: 'account-capacity',
						
						min: 0,
						
						step: 1,
						
						value: account.defaultEventCapacity() >= 0 ? account.defaultEventCapacity() : '',
						
						required: true
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-capacity'},
					
					classList: account.defaultEventCapacity() >= 0 ? ['form-label', 'active'] : ['form-label'],
					
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
				
				containerDiv.appendChild(outerDiv);


			// Add default location field

				/*
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
						
						id: 'account-location',
						
						value: account.location() ? account.location : ''
					},
					
					classList: ['validate']
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-location'},
					
					classList: account.location() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter default location'},
					
					innerHTML: 'Default location'
				}));
				

				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
			
				outerDiv.appendChild(innerDiv);
			
				containerDiv.appendChild(outerDiv); // add to container
				*/


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
					
					attributes: {for: 'account-localstorage'},
					
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
					
					attributes: {id: 'account-localstorage', type: 'checkbox'}
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


				innerDiv =  this.createElement( // inner div for description of switch
				{
					element: 'div',			
					
					classList: ['col', 's12']
				});

				outerDiv.appendChild(innerDiv);


				innerDiv.appendChild(this.createElement( // description
				{	
					element: 'p',

					classList: ['form-label', 'input-switch-description'],

					innerHTML: 'Allow local storage if you want to be able to work with your events on this device when you\'re offline.'

				}));

				innerDiv.appendChild(this.createElement({ // divider

					element: 'div',

					classList: ['divider']
				}));


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
					
					attributes: {for: 'account-geolocation'},
					
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
					
					attributes: {id: 'account-geolocation', type: 'checkbox'}
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

				
				innerDiv =  this.createElement( // inner div for description of switch
				{
					element: 'div',			
					
					classList: ['col', 's12']
				});

				outerDiv.appendChild(innerDiv);


				innerDiv.appendChild(this.createElement( // description
				{	
					element: 'p',

					classList: ['form-label', 'input-switch-description'],

					innerHTML: 'Allow geolocation if you want to the app to suggest event venues and other useful information based on the location of this device.'

				}));

				innerDiv.appendChild(this.createElement({ // divider

					element: 'div',

					classList: ['divider']
				}));


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
					
					attributes: {id: 'account-form-cancel'},
					
					classList: ['waves-effect', 'waves-teal', 'btn-flat'],

					innerHTML: 'Cancel'
				}));
				
				
				buttonElement =  this.createElement({ // submit button
					
					element: 'a',
					
					attributes: {id: 'account-form-submit'},
					
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

				$formDiv = $('#account-form');

				$formDiv.empty();

				$formDiv.append(formElement);


			// (Re)assign account handlers to form elements

				//$('#account-location').focus(this.suggestLocations);
				
				$('#account-name').keyup(this.validateName);

				$('#account-form-submit').click(function() {this.submit();}.bind(this));
		}

		else { // present default message

			$formDiv = $('#account-form');

			$formDiv.empty();

			$formDiv.append(this.createElement(
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

	app.AccountView.prototype.submit = function() {

		// Account handler binds to this, so reference works here
		
		if (this.validateName()) { // Submit results if all validations pass

			// Nofity observers by passing them a new Account with the data from the form

			this.notifyObservers(
				
				new app.Account(

					$('#account-name').val(),

					new app.Organization($('#account-employer').val()), //hack

					$('#account-jobTitle').val(),

					new app.Email($('#account-email').val()),

					new Date($('#account-birthday').val())
				),

				parseInt($('#account-id').val())
			);
			
			return true;
		}

		return false;
	}


	/** Updates account presentation when notified by controller of change */
	
	app.AccountView.prototype.update = function(IModelable_account) {
		
		this.render(IModelable_account);
	};
	

	/* Event handler for interactive validation of account name field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	
	app.AccountView.prototype.validateName = function(account) {

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

void app.IInterfaceable.mixInto(app.IObservable, app.AccountView);

void app.IInterfaceable.mixInto(app.IObserver, app.AccountView);

void app.IInterfaceable.mixInto(app.IViewable, app.AccountView);