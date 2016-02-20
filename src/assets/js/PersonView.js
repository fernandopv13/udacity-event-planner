'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PersonView Implements IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual persons. Renders person in UI, and captures UI events on person.
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

app.PersonView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _implements = [app.IObservable, app.IObserver, app.IViewable], // list of interfaces implemented by this class (by function reference);

	$_renderContext = $('#' + str_elementId),

	_heading = str_heading, // content of the view heading

	_modelId; // id of the model object currently presented in the view

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	// none so far
	

	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
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

	this.cancel = function() {

		// Discard temporary object if we were about to add a new event

		var person = app.Person.registry.getObjectById(this.modelId());

		if (!app.controller.selectedEvent().isGuest(person)) {

			app.Person.registry.removeObject(person); // remove from Person registry

			person = undefined; // dereference object to expose it to garbage collection
		}

		// Return to previous view

		window.history.back();

		// for now, simply discard any entries made by user to an existing guest
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
	

	/** (Re)renders person to form in UI
	*
	* @param {Person} The person from which to present data in the form
	*
	* @return void
	*
	* @todo Get character counter to work on description field
	 */
	
	this.render = function(Person_person) {

		var person = Person_person, formElement, containerDiv, innerDiv, outerDiv, labelElement, buttonElement, iconElement, $formDiv;

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
			

			// Add heading
				
				containerDiv.appendChild(this.createHeading('s12', _heading));

				
			// Add hidden person id field

				containerDiv.appendChild(this.createElement({

					element: 'input',

					attributes: {id: 'guest-id', type: 'hidden', value: Person_person.id()}
				}));

			
			// Add guest name field

				containerDiv.appendChild(this.createTextField(

					's12',

					'guest-name',

					'Guest Name',

					true,

					person.name()
				));
			
			
			// Add email field

				containerDiv.appendChild(this.createEmailField(

					's12',

					'guest-email',

					'Email',

					true,

					person.email()
				));

			
			// Add job title field

				containerDiv.appendChild(this.createTextField(

					's12',

					'guest-jobtitle',

					'Job Title',

					false,

					person.jobTitle()
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
						
						id: 'guest-employer',
						
						value: person.employer() && person.employer().name() ? person.employer().name() : '',
						
						list: 'suggested-employers'
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'guest-employer'},
					
					classList: person.employer() && person.employer().name() ? ['form-label', 'active'] : ['form-label'],
					
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

				containerDiv.appendChild(this.createDateField(

					's12',

					'guest-birthday',

					'Birthday',

					false,

					person.birthday()
				));
				
			
			// Add requirement indicator (asterisk) explanation

				containerDiv.appendChild(this.createRequiredFieldExplanation());

							
			// Add submit and cancel buttons

				containerDiv.appendChild(this.createSubmitCancelButtons('guest-form'))
				
			
			// Update DOM

				$_renderContext.empty();

				$_renderContext.append(formElement);


			// (Re)assign event handlers to form elements

				$('#guest-birthday.datepicker').pickadate({
					
					//closeOnSelect: true, // bug: ineffective
					
					closeOnClear: true,
					
					onSet: function() {this.close()},
					
					selectMonths: true, // Creates a dropdown to control month
					
					selectYears: 15 // Creates a dropdown of 15 years to control year
				});

				
				//$('#guest-location').focus(this.suggestLocations);

				
				$('#guest-name').keyup(function(event) {

					this.validateName(event, 'guest-name', 'Please enter name', true);

				}.bind(this));
				

				$('#guest-email').keyup(function(event) {

					this.validateEmail(event, 'guest-email', 'Please enter email', true);

				}.bind(this));


				$('#guest-form-cancel').click(function(event) {

					this.cancel();

				}.bind(this));


				$('#guest-form-submit').click(function(event) {

					if (this.submit(event)) { // submit succesfull

						window.history.back(); // return to previous view
					}

					else {

						console.log('guest form submission failed')
					}

				}.bind(this));
		}

		else { // present default message

			$_renderContext.empty();

			$_renderContext.append(this.createElement(
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

	this.submit = function(event) {

		// First display any and all validation errors in the UI

		this.validateName(event, 'guest-name', 'Please enter name', true);

		void this.validateEmail(event, 'guest-email', 'Please enter email', true);


		// Then do it again to obtain validation status

		// (Chain stops at first false, so no use for UI)
		
		if (this.validateName(event, 'guest-name', 'Please enter name', true)

		&& this.validateEmail(event, 'guest-email', 'Please enter email', true)){ // Submit results if all validations pass

			// Nofity observers by passing them a new Person with the data from the form

			this.notifyObservers(
				
				new app.Person(

					$('#guest-name').val(),

					new app.Organization($('#guest-employer').val()), //hack

					$('#guest-jobtitle').val(),

					new app.Email($('#guest-email').val()),

					$('#guest-birthday').val() ? new Date($('#guest-birthday').val()) : null
				),

				parseInt($('#guest-id').val())
			);
			
			return true;
		}

		return false;
	}


	/** Updates guest presentation when notified by controller of change */
	
	this.update = function(IModelable_person) {
		
		if (IModelable_person === null || IModelable_person.constructor === app.Person) {

			this.render(IModelable_person);

			_modelId = IModelable_person.id();
		}

		// else do nothing
	};
	

	/* Event handler for interactive validation of person name field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	
	this.validateName = function(person) {

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

void app.IInterfaceable.mixInto(app.IObservable, app.PersonView);

void app.IInterfaceable.mixInto(app.IObserver, app.PersonView);

void app.IInterfaceable.mixInto(app.IViewable, app.PersonView);