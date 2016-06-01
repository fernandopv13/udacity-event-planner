'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PersonView extends FormView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for individual Persons. Renders person in UI, and captures UI events on person.
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

	module.PersonView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'PersonView';

		this.ssuper = module.FormView;

		
		// Initialize instance members inherited from parent class
		
		module.FormView.call(this, module.Person, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/
			
		this.parentList().push(module.PersonView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from FormView
	*---------------------------------------------------------------------------------------*/	

	module.PersonView.prototype = Object.create(module.FormView.prototype); // Set up inheritance

	module.PersonView.prototype.constructor = module.PersonView; //Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** (Re)renders person to form in UI
	*
	* @param {Person} The person from which to present data in the form
	*
	* @return void
	 */

	module.PersonView.prototype.render = function(Person_p) {

		var container; // shorthand reference to inherited temporary container element

		
		if (Person_p !== null) {
			
			// Setup container

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
						id: 'guest-form',

						autocomplete: 'off',

						novalidate: true
					}
				);

				container.appendChild(formElement);

				
			// Add hidden person id field

				formElement.appendChild(this.createWidget(

					'HTMLElement',

					{

						element: 'input',

						attributes: {id: 'guest-id', type: 'hidden', value: Person_p.id()}
					}
				));

			
			// Add guest name field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',

					{
						width: 's12',

						id: 'guest-name',

						label: 'Guest Name',

						required: true,

						datasource: Person_p.name() || null
					}
				));

			
			// Add email field

				formElement.appendChild(this.createWidget(

					'EmailInputWidget',

					{
						width: 's12',

						id: 'guest-email',

						label: 'Email',

						required: true,

						datasource: Person_p.email() || null
					}
				));

			
			// Add job title field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',

					{
						width: 's12',

						id: 'guest-jobtitle',

						label: 'Job Title',

						required: false,

						datasource: Person_p.jobTitle() || null
					}
				));


			// Add employer field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',

					{
						id: 'guest-employer',
						
						width: 's12',

						label: 'Employer',

						required: false,

						datasource: Person_p.employer() && Person_p.employer().name() ? Person_p.employer().name() : '',

						datalist: 'suggested-employers'
					}
				));

				this.elementOptions['guest-employer'] = 
				{
					listeners: {

						focus: this.suggestEmployers // suggest employers
					}
				};


			// Add birthday field

				formElement.appendChild(this.createWidget(

					'DateInputWidget',

					{
						width: 's12',

						id: 'guest-birthday',

						label: 'Birthday',

						required: false,

						datasource: Person_p.birthday() || null,

						dateonly: true
					}
				));

			
			// Add requirement indicator (asterisk) explanation

				var outerDiv = this.createWidget('HTMLElement', // outer div
				{
					element: 'div',			
					
					classList: ['row']
				});
				
				outerDiv.appendChild(this.createWidget('HTMLElement',
				{
					element: 'p',
					
					classList: ['required-indicator'],
						
					innerHTML: '* indicates a required field'
				}));

				formElement.appendChild(outerDiv);

							
			// Add submit and cancel buttons

				outerDiv = this.createWidget('HTMLElement', // outer div
				{
					element: 'div',			
					
					classList: ['row', 'form-submit']
				});
				
				
				outerDiv.appendChild(this.createWidget('CancelButtonWidget',  // cancel button
				{					
					id: 'guest-form-cancel',

					label: 'Cancel'
				}));


				outerDiv.appendChild(this.createWidget('SubmitButtonWidget',  // submit button
				{					
					id: 'guest-form-submit',

					label: 'Done',

					icon: 'send'
				}));


				formElement.appendChild(outerDiv);
		}

		else { // present default message

			container.appendChild(this.createWidget('HTMLElement',
			{
				element: 'p',

				innerHTML: 'No guest selected. Please select or create a guest in order to edit details.'
			}));
		}


		// Render to DOM and initialize

			this.ssuper().prototype.render.call(this);
		

		// Do post-render initialization

			this.init();

			$('#guest-name').attr('autofocus', true);
	};


	/** Submits person form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*/

	module.PersonView.prototype.submit = function(nEvent) {

		if (app.FormWidget.instance().validate($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

			// Notify observers by passing them a new Person with the data from the form

			this.ssuper().prototype.submit.call(

				this,
				
				new module.Person(

					$('#guest-name').val(),

					(function() { // employer parameter

						// use existing Organization if there is a match, else create a new one

						// may accumulate some unintentional duplicates over time, with no way of removing them, but ok for now

						var employer = $('#guest-employer').val();

						if (employer && employer !== '') { // employer name entered

							var tmp = module.Organization.registry.getObjectByAttribute('name', employer);

							if (tmp) { // name matches existing Organization, so use that

								return tmp;
							}

							else { // no match, so create new Organization

								return new module.Organization(employer);
							}
						}

						// otherwise returns 'undefined'
					})(),

					//new module.Organization($('#guest-employer').val()), //hack

					$('#guest-jobtitle').val(),

					new module.Email($('#guest-email').val()),

					//$('#guest-birthday').val() ? new Date($('#guest-birthday').val()) : null

					module.DateInputWidget.instance().value($('#guest-birthday'))
				)
			);
			
			return true;
		}

		//else

		Materialize.toast(module.prefs.defaultValidationError(), module.prefs.defaultToastDelay());

		return false;
	};


	/** Suggest employer names based on employers of guests participating in the account's events */

	module.PersonView.prototype.suggestEmployers = function(event) {

		// Get list of employers in account

		var employers = [], events = module.controller.selectedAccount().events();

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

		
		$listElmnt = $('#suggested-employers');

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

	module.PersonView.prototype.validateName = function(person) {

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
	
})(app);