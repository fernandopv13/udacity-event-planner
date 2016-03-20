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

		var widgetFactory = app.UIWidgetFactory.instance();

		if (Person_p !== null) {
			
			// Setup up form and container div

				var formElement =  widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
				{
					element: 'form',			
					
					attributes: {autocomplete: 'off', novalidate: true},
					
					classList: ['col', 's12']
				});


				var containerDiv =  widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
				{
					element: 'div',			
					
					classList: ['row']
				});
				

				formElement.appendChild(containerDiv);
			

			// Add heading
				
				containerDiv.appendChild(this.createHeading('s12', this.heading()));

				
			// Add hidden person id field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',{

					element: 'input',

					attributes: {id: 'guest-id', type: 'hidden', value: Person_p.id()}
				}));

			
			// Add guest name field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'TextInputWidget',
				{
					width: 's12',

					id: 'guest-name',

					label: 'Guest Name',

					required: true,

					datasource: Person_p.name() || null
				}));
			
			
			// Add email field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'EmailInputWidget',
				{
					width: 's12',

					id: 'guest-email',

					label: 'Email',

					required: true,

					datasource: Person_p.email() || null
				}));

			
			// Add job title field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'TextInputWidget',
				{
					width: 's12',

					id: 'guest-jobtitle',

					label: 'Job Title',

					required: false,

					datasource: Person_p.jobTitle() || null
				}));
				

			// Add employer field

				var innerDiv =  widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's12']
				});
				
				
				innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // input
				{
					element: 'input',			
					
					attributes:
					{
						type: 'text',
						
						id: 'guest-employer',
						
						value: Person_p.employer() && Person_p.employer().name() ? Person_p.employer().name() : '',
						
						list: 'suggested-employers',

						'aria-labelledby': 'guest-employer-label',

						role: 'text'
					}
				}));
				
				
				innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // label
				{	
					element: 'label',			
					
					attributes: {for: 'guest-employer', id: 'guest-employer-label'},
					
					classList: Person_p.employer() && Person_p.employer().name() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter employer'},
					
					innerHTML: 'Employer'
				}));
				
				
				innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // data list
				{	
					element: 'datalist',			
					
					attributes: {id: 'suggested-employers'}
				}));
				
				
				var outerDiv =  widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				outerDiv.appendChild(innerDiv);
				
				containerDiv.appendChild(outerDiv);			


			// Add birthday field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'DateInputWidget',
				{
					width: 's12',

					id: 'guest-birthday',

					label: 'Birthday',

					required: false,

					datasource: Person_p.birthday() || null
				}));
				
			
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

				//containerDiv.appendChild(this.createRequiredFieldExplanation());

							
			// Add submit and cancel buttons

				outerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // outer div
				{
					element: 'div',			
					
					classList: ['row', 'form-submit']
				});
				
				
				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'CancelButtonWidget',  // cancel button
				{					
					id: 'guest-form-cancel',

					label: 'Cancel'
				}));
				

				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'SubmitButtonWidget',  // submit button
				{					
					id: 'guest-form-submit',

					label: 'Done',

					icon: 'send'
				}));

				containerDiv.appendChild(outerDiv);

				//containerDiv.appendChild(this.createSubmitCancelButtons('guest-form'))
				
			
			// Update DOM

				this.$renderContext().empty();

				this.$renderContext().append(formElement);


			// Initialize and (re)assign event handlers to form elements

				$('#guest-name').attr('autofocus', true)

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


				$('#guest-form-submit').mousedown(function(event) { // submit (blur hides click event so using mousedown)

					this.submit(event);

				}.bind(this));
		}

		else { // present default message

			this.$renderContext().empty();

			this.$renderContext().append(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'p',

				innerHTML: 'No guest selected. Please select or create a guest in order to edit details.'
			}));
		}
	};


	/** Submits person form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*/

	module.PersonView.prototype.submit = function(event) {

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

					$('#guest-birthday').val() ? new Date($('#guest-birthday').val()) : null
				)
			);
			
			return true;
		}

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