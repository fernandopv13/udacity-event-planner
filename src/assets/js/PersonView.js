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
				
				attributes: {autocomplete: 'off', novalidate: true},
				
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


			$('#guest-employer').focus(this.suggestEmployers);


			$('#guest-form-cancel').click(function(event) {

				this.cancel(event);

			}.bind(this));


			$('#guest-form-submit').click(function(event) {

				this.submit(event);

			}.bind(this));
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

		// Notify observers by passing them a new Person with the data from the form

		this.ssuper().prototype.submit.call(

			this,
			
			new app.Person(

				$('#guest-name').val(),

				(function() { // employer parameter

					// use existing Organization if there is a match, else create a new one

					// may accumulate some unintentional duplicates over time, with no way of removing them, but ok for now

					var employer = $('#guest-employer').val();

					if (employer && employer !== '') { // employer name entered

						var tmp = app.Organization.registry.getObjectByAttribute('name', employer);

						if (tmp) { // name matches existing Organization, so use that

							return tmp;
						}

						else { // no match, so create new Organization

							return new app.Organization(employer);
						}
					}

					// otherwise returns 'undefined'
				})(),

				//new app.Organization($('#guest-employer').val()), //hack

				$('#guest-jobtitle').val(),

				new app.Email($('#guest-email').val()),

				$('#guest-birthday').val() ? new Date($('#guest-birthday').val()) : null
			)
		);
		
		return true;
	}

	return false;
};


/** Suggest employer names based on employers of guests participating in the account's events */

app.PersonView.prototype.suggestEmployers = function(event) {

	// Get list of employers in account

	var employers = [], events = app.controller.selectedAccount().events();

	var $listElmnt = $('#suggested-locations'), optionElmnt;

	for (var ev in events) { // for every event in account

		events[ev].guests().forEach(function(guest) { // for every guest (person) in event

			if (guest.employer()) { // employer is defined

				if (employers.indexOf(guest.employer()) === -1) { // employer is not already in list

					employers.push(guest.employer());
				}
			}
		});
	}

	// Generate suggestion datalist for employer field

	employers.sort(function(a,b) { // sort alfabetically

		return a.name() === b.name() ? 0 : (a.name() < b.name() ? -1 : 1);
	});

	
	var $listElmnt = $('#suggested-employers'), optionElmnt;

	$listElmnt.empty();

	employers.forEach(function(employer) {

		optionElmnt = document.createElement('option');

		optionElmnt.value = employer.name();

		//console.log(employer.name());

		$listElmnt.append(optionElmnt);

	}.bind(this));
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
};