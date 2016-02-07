'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PersonView Implements IObservable IObserver IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual persons. Renders person in UI, and captures UI events on person.
*
* @constructor
*
* @implements IObservable IObserver IViewable
*
* @author Ulrik H. Gade, February 2016
*
* @todo 
*/

app.PersonView = function(Person_person) {

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
	
	/** Cancels entries in, and navigation to, person form
	*
	* @todo Everything(!)
	*/

	app.PersonView.prototype.cancel = function() {

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
	app.PersonView.prototype.notifyObservers = function(IModelable_person, int_objId) {

		this.observers.forEach(function(observer) {

			observer.update(IModelable_person, int_objId);
		});
	};
	*/

	/** (Re)renders person to form in UI
	*
	* @param {Person} The person from which to present data in the form
	*
	* @return void
	*
	* @todo Get character counter to work on description field
	 */
	
	app.PersonView.prototype.render = function(Person_person) {

		var person = Person_person, formElement, containerDiv, innerDiv, outerDiv, labelElement, buttonElement, iconElement;

		if (person !== null) {
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
			

			// Add hidden person id field

			containerDiv.appendChild(this.createElement({

				element: 'input',

				attributes: {id: 'guest-id', type: 'hidden', value: Person_person.id()}
			}));

			// Add guest name field

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
						
						id: 'guest-name',
						
						value: person.name() ? person.name() : '',
						
						required: true
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'guest-name'},
					
					classList: person.name() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter guest name'},
					
					innerHTML: 'Guest Name'
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
						
						id: 'guest-email',
						
						value: person.email() && person.email().address() ? person.email().address() : '',

						required: 'true'
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'guest-email'},
					
					classList: person.email() && person.email().address() ? ['form-label', 'active'] : ['form-label'],
					
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


			// Add job title field

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
						
						id: 'person-jobtitle',
						
						value: person.jobTitle() ? person.jobTitle() : ''
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'person-jobtitle'},
					
					classList: person.jobTitle() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter job title'},
					
					innerHTML: 'Job Title'
				}));
				
				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				
				outerDiv.appendChild(innerDiv);
				
				containerDiv.appendChild(outerDiv);


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
						
						id: 'guest-employer',
						
						value: person.employer() ? person.employer().name() : '',
						
						list: 'suggested-employers'
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'guest-employer'},
					
					classList: person.employer().name() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter employer'},
					
					innerHTML: 'Employer'
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
				
				
				innerDiv.appendChild(this.createElement( // input
				{
					element: 'input',			
					
					attributes:
					{
						type: 'text',
						
						id: 'guest-birthday',
						
						value: person.birthday() ? person.birthday().toLocaleDateString() : '',
						
						readonly: true
					},
					
					classList: ['validate', 'datepicker', 'picker__input']
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'guest-birthday'},
					
					classList: person.birthday() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter birthday'},
					
					innerHTML: 'Birthday'
				}));

				
				innerDiv.appendChild(this.createElement( // custom error div
				{	
					element: 'div',			
					
					attributes: {id: 'guest-birthday-error'},
					
					classList: ['custom-validate']
				}));
				
				
				outerDiv.appendChild(innerDiv);
			
				containerDiv.appendChild(outerDiv); // Add to container


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
					
					attributes: {id: 'guest-form-cancel'},
					
					classList: ['waves-effect', 'waves-teal', 'btn-flat'],

					innerHTML: 'Cancel'
				}));
				
				
				buttonElement =  this.createElement({ // submit button
					
					element: 'a',
					
					attributes: {id: 'guest-form-submit'},
					
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

				var $formDiv = $('#guest-form');

				$formDiv.empty();

				$formDiv.append(formElement);

				console.log(formElement);


			// (Re)assign event handlers to form elements

				$('.datepicker').pickadate({
					//closeOnSelect: true, // bug: ineffective
					closeOnClear: true,
					onSet: function() {this.close()},
					selectMonths: true, // Creates a dropdown to control month
					selectYears: 15 // Creates a dropdown of 15 years to control year
				});

				
				//$('#guest-location').focus(this.suggestLocations);

				
				$('#guest-name').keyup(this.validateName);

				$('#guest-form-submit').click(function() {this.submit();}.bind(this));
		}

		else { // present default message

			var $formDiv = $('#guest-form');

			$formDiv.empty();

			$formDiv.append(this.createElement(
			{

				element: 'p',

				innerHTML: 'No guest selected. Please select or create a guest in order to edit details.'
			}));
		}
	};


	/** Submits person form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*
	* @todo Fix host hack
	*/

	app.PersonView.prototype.submit = function() {

		// Person handler binds to this, so reference works here
		
		if (this.validateName()) { // Submit results if all validations pass

			// Nofity observers by passing them a new Person with the data from the form

			this.notifyObservers(
				
				parseInt($('#guest-id').val()),

				new app.Person(

					$('#guest-name').val(),

					new app.Organization($('#guest-employer').val()), //hack

					$('#guest-jobTitle').val(),

					new app.Email($('#guest-email').val()),

					new Date($('#guest-birthday').val())
				)
			);
			
			return true;
		}

		return false;
	}


	/** Updates guest presentation when notified by controller of change */
	
	app.PersonView.prototype.update = function(IModelable_person) {
		
		this.render(IModelable_person);
	};
	

	/* Event handler for interactive validation of person name field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	
	app.PersonView.prototype.validateName = function(person) {

		var $name = $('#guest-name');

		if ($name.val() === '') { // empty
		
			if (person && person.target.labels) { // Chrome (does not update display if setting with jQuery)

				person.target.labels[0].dataset.error = 'Please enter guest name';
			}

			else { // Other browsers (updated value may not display, falls back on value in HTML)

				$name.next('label').data('error', 'Please enter guest name');
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

void app.InterfaceHelper.mixInto(app.IObservable, app.PersonView);

void app.InterfaceHelper.mixInto(app.IObserver, app.PersonView);

void app.InterfaceHelper.mixInto(app.IViewable, app.PersonView);