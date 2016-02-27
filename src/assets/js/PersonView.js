'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PersonView extends FormView
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual persons. Renders person in UI, and captures UI events on person.
*
* @constructor
*
* @extends FormView
*
* @param (String) elementId Id of the HTML DOM element the view is bound to
*
* @param (String) heading Content for the list heading
*
* @author Ulrik H. Gade, February 2016
*/

app.PersonView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.className = 'PersonView';

	this.ssuper = app.FormView;

	
	/** Initialize instance members inherited from parent class*/
	
	app.FormView.call(this, app.Person, str_elementId, str_heading);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/
		
	this.parentList().push(app.PersonView);
};

/*----------------------------------------------------------------------------------------
* Inherit from FormView
*---------------------------------------------------------------------------------------*/	

app.PersonView.prototype = Object.create(app.FormView.prototype); // Set up inheritance

app.PersonView.prototype.constructor = app.PersonView; //Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** Cancels entries in, and navigation to, person form
*/

/*
app.PersonView.prototype.cancel = function() {

	this.onUnLoad();

	app.FormView.prototype.cancel.call( // true if model is one that we just created anew, and now want to discard

		this, // make sure 'this' points in the right direction

		this.model() // model is defined

		&& !app.controller.selectedEvent().isGuest(this.model)  // model is not know by event
	);
}
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
			
			containerDiv.appendChild(this.createHeading('s12', this.heading()));

			
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

			this.$renderContext().empty();

			this.$renderContext().append(formElement);


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

				this.cancel(event);

			}.bind(this));


			$('#guest-form-submit').click(function(event) {

				this.submit(event);

			}.bind(this));


			/*
			$('#nav-delete-icon').click(function(event) {

				console.log('delete person');
			});
			*/
	}

	else { // present default message

		this.$renderContext().empty();

		this.$renderContext().append(this.createElement(
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

app.PersonView.prototype.submit = function(event) {

	// First display any and all validation errors in the UI

	this.validateName(event, 'guest-name', 'Please enter name', true);

	void this.validateEmail(event, 'guest-email', 'Please enter email', true);


	// Then do it again to obtain validation status

	// (Chain stops at first false, so no use for UI)
	
	if (this.validateName(event, 'guest-name', 'Please enter name', true)

	&& this.validateEmail(event, 'guest-email', 'Please enter email', true)){ // Submit results if all validations pass

		// Nofity observers by passing them a new Person with the data from the form

		//this.notifyObservers(

		this.ssuper().prototype.submit.call(

			this,
			
			new app.Person(

				$('#guest-name').val(),

				new app.Organization($('#guest-employer').val()), //hack

				$('#guest-jobtitle').val(),

				new app.Email($('#guest-email').val()),

				$('#guest-birthday').val() ? new Date($('#guest-birthday').val()) : null
			)//,

			//parseInt($('#guest-id').val())
		);
		
		
		//this.onUnLoad();


		return true;
	}

	return false;
}


/** Updates guest presentation when notified by controller of change */

/*
app.PersonView.prototype.update = function(Model) {
	
	if (Model === null || Model.constructor === app.Person) {

		this.model(Model);

		this.render(Model);
	}

	// else do nothing
};
*/


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