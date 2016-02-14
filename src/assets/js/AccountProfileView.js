'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class AccountProfileView Implements IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for account profile. Renders profile in UI, and captures UI events on profile.
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

app.AccountProfileView = function(str_elementId, str_heading) {

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
	
	/** Cancels entries in, and navigation to, person form
	*
	* @todo Everything(!)
	*/

	app.AccountProfileView.prototype.cancel = function() {

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
	* @param {Person} The Person passing data in the form onto the observers
	*
	* @return void
	 */

	/*
	app.AccountProfileView.prototype.notifyObservers = function(IModelable_person, int_objId) {

		this.observers.forEach(function(observer) {

			observer.update(IModelable_person, int_objId);
		});
	};
	*/

	/** (Re)renders person to form in UI
	*
	* @param {Account} The account from whose profile to present data in the form
	*
	* @return void
	 */
	
	app.AccountProfileView.prototype.render = function(IModelable_Account) {

		var person = IModelable_Account.accountHolder(), formElement, containerDiv, innerDiv, outerDiv, labelElement, buttonElement, iconElement, $formDiv;

		if (person && person !== null) { // account holder exists
			
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
				
				containerDiv.appendChild(this.createHeading('s12', _heading));

				/*
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
				*/


			// Add hidden person id field

				containerDiv.appendChild(this.createElement({

					element: 'input',

					attributes: {id: 'account-holder-id', type: 'hidden', value: person.id()}
				}));

			
			// Add account holder name field

				containerDiv.appendChild(this.createTextField(

					's12',

					'account-holder-name',

					'Your Name',

					true,

					person.name() ? person.name() : ''
				));
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
						
						id: 'account-holder-name',
						
						value: person.name() ? person.name() : '',
						
						required: true
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-holder-name'},
					
					classList: person.name() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter your name'},
					
					innerHTML: 'Your Name'
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

				*/
				
			
			// Add email field

				outerDiv =  this.createEmailField(

					's12',

					'account-holder-email',

					'Email',

					false,

					person.email()
				);


				outerDiv.appendChild(this.createFieldDescription(

					'The app uses this email to contact you, and when presenting you to participants in your events. If left blank, the app will use the email address that you use to sign in (see "Account Settings").'
				));

				containerDiv.appendChild(outerDiv);


			// Add job title field

				containerDiv.appendChild(this.createTextField(

					's12',

					'account-holder-jobtitle',

					'Job Title',

					false,

					person.jobTitle()
				));

				/*
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
						
						id: 'account-holder-jobtitle',
						
						value: person.jobTitle() ? person.jobTitle() : ''
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-holder-jobtitle'},
					
					classList: person.jobTitle() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter your job title'},
					
					innerHTML: 'Your Job Title'
				}));
				
				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				
				outerDiv.appendChild(innerDiv);
				
				containerDiv.appendChild(outerDiv);
				*/

			
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
						
						value: person.employer() && person.employer().name() ? person.employer().name() : '',
						
						list: 'suggested-employers'
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-holder-employer'},
					
					classList: person.employer() && person.employer().name() ? ['form-label', 'active'] : ['form-label'],
					
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

					person.birthday()
				));

			
			// Add requirement indicator (asterisk) explanation

				containerDiv.appendChild(this.createRequiredFieldExplanation());

				/*
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
				*/

			
			// Add submit and cancel buttons

				containerDiv.appendChild(this.createSubmitCancelButtons('account-holder-form'));

				/*outerDiv =  this.createElement( // outer div
				{
					element: 'div',			
					
					classList: ['row', 'form-submit']
				});
				
				
				outerDiv.appendChild(this.createElement({ // cancel button
					
					element: 'a',
					
					attributes: {id: 'account-holder-form-cancel'},
					
					classList: ['waves-effect', 'waves-teal', 'btn-flat'],

					innerHTML: 'Cancel'
				}));
				
				
				buttonElement =  this.createElement({ // submit button
					
					element: 'a',
					
					attributes: {id: 'account-holder-form-submit'},
					
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
				*/
			
			// Update DOM

				$_renderContext.empty();

				$_renderContext.append(formElement);
			

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

				
				$('#account-holder-form-submit').click(function() {this.submit();}.bind(this));
		}

		else { // present default message

			$_renderContext.empty();

			$_renderContext.append(
			{
				element: 'p',

				innerHTML: 'No profile selected. Please select or create a profile in order to edit details.'
			});
		}
	};


	/** Submits person form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*
	* @todo Fix host hack
	*/

	app.AccountProfileView.prototype.submit = function(event) {

		// Person handler binds to this, so reference works here
		
		if (this.validateName(event, 'account-holder-name', 'Please enter your name', true)) { // Submit results if all validations pass

			// Nofity observers by passing them a new Person with the data from the form

			var person = new app.Person($('#account-holder-name').val());

			person.jobTitle($('#account-holder-jobtitle').val());

			person.email($('#account-holder-email').val() !== '' ? new app.Email($('#account-holder-email').val()) : null);
			
			person.employer($('#account-holder-employer').val() !== '' ? new app.Organization($('#account-holder-employer').val()) : null); //hack

			person.birthday($('#account-holder-birthday').val() !== '' ? new Date($('#account-holder-birthday').val()) : null);
			
			this.notifyObservers(person, parseInt($('#account-holder-id').val()));
			
			return true;
		}

		return false;
	}


	/** Updates account holder presentation when notified by controller of change */
	
	app.AccountProfileView.prototype.update = function(IModelable_Account) {
		
		this.render(IModelable_Account);
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

void app.IInterfaceable.mixInto(app.IObservable, app.AccountProfileView);

void app.IInterfaceable.mixInto(app.IObserver, app.AccountProfileView);

void app.IInterfaceable.mixInto(app.IViewable, app.AccountProfileView);