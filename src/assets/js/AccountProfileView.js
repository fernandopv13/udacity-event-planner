'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class AccountProfileView extends FormView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for account profile. Renders profile in UI, and captures UI events on profile.
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

	module.AccountProfileView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'AccountProfileView';

		this.ssuper = module.FormView;

		
		// Initialize instance members inherited from parent class
		
		module.FormView.call(this, module.Person, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/
			
		this.parentList().push(module.AccountProfileView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from FormView
	*---------------------------------------------------------------------------------------*/	

	module.AccountProfileView.prototype = Object.create(module.FormView.prototype); // Set up inheritance

	module.AccountProfileView.prototype.constructor = module.AccountProfileView; //Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** (Re)renders person to form in UI
	*
	* @param {Account} The account from whose profile to present data in the form
	*
	* @return void
	*
	* @todo Add suggestions to employer field
	*/

	module.AccountProfileView.prototype.render = function(Person_p) {

		var widgetFactory = app.UIWidgetFactory.instance(); // shortcut reference to widgetFactory

		this.elementOptions = {}; // temporary object holding JSON data used for initializing elements post-render
		
		
		if (Person_p) { // account holder exists
			
			// Set up container div
			
				var container = this.containerElement(this.createWidget(

					'HTMLElement', // div

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
						id: 'account-profile-form',

						autocomplete: 'off',

						novalidate: true
					}
				);

				container.appendChild(formElement);

			
			// Add heading
				
				//container.appendChild(this.createHeading('s12', this.heading()));

				
			// Add hidden person id field

				container.appendChild(this.createWidget(

					'HTMLElement',

					{
						element: 'input',

						attributes: {id: 'account-holder-id', type: 'hidden', value: Person_p.id()}
					}
				));

			
			// Add account holder name field

				container.appendChild(this.createWidget(

					'TextInputWidget',

					{
						width: 's12',

						id: 'account-holder-name',

						label: 'Your Name',

						required: true,

						datasource: Person_p.name() || ''
					}
				));
				
			
			// Add email field

				var outerDiv = this.createWidget(

					'EmailInputWidget',
					{
						width: 's12',

						id: 'account-holder-email',

						label: 'Your Email',

						required: false,

						datasource: Person_p.email() || null
					}
				);


				outerDiv.appendChild(this.createWidget(

					'InputDescriptionWidget',

					{
						datasource: 'The app uses this email to contact you, and when presenting you to participants in your events. If left blank, the app will use the email address that you use to sign in (see "Account Settings").',

						divider: false
					}
				));

				container.appendChild(outerDiv);


			// Add job title field

				container.appendChild(this.createWidget(

					'TextInputWidget',
					{
						width: 's12',

						id: 'account-holder-jobtitle',

						label: 'Your Job Title',

						requierd: false,

						datasource: Person_p.jobTitle() || null
					}
				));

							
			// Add employer field

				container.appendChild(this.createWidget(

					'TextInputWidget',

					{
						id: 'account-holder-employer',

						width: 's12',

						label: 'Your Employer',

						required: false,

						datasource:  Person_p.employer() && Person_p.employer().name() ? Person_p.employer().name() : '',

						datalist: 'suggested-employers'
					}
				));

				/*
				this.elementOptions['account-holder-employer'] = 
				{
					listeners: {

						focus: this.suggestedEventTypes // suggest event types
					}
				}*/


				/*
				var innerDiv =  this.createWidget('HTMLElement', // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's12']
				});
				
				
				innerDiv.appendChild(this.createWidget('HTMLElement', // input
				{
					element: 'input',			
					
					attributes:
					{
						type: 'text',
						
						id: 'account-holder-employer',
						
						value: Person_p.employer() && Person_p.employer().name() ? Person_p.employer().name() : '',
						
						list: 'suggested-employers'
					}
				}));
				
				
				innerDiv.appendChild(this.createWidget('HTMLElement', // label
				{	
					element: 'label',			
					
					attributes: {for: 'account-holder-employer'},
					
					classList: Person_p.employer() && Person_p.employer().name() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter your employer'},
					
					innerHTML: 'Your Employer'
				}));
				
				
				innerDiv.appendChild(this.createWidget('HTMLElement', // data list
				{	
					element: 'datalist',			
					
					attributes: {id: 'suggested-employers'}
				}));
				
				
				outerDiv =  this.createWidget('HTMLElement', // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				outerDiv.appendChild(innerDiv);
				
				container.appendChild(outerDiv);	
				*/		

			
			// Add birthday field

				container.appendChild(this.createWidget(

					'DateInputWidget',

					{
						width: 's12',

						id: 'account-holder-birthday',

						label: 'Your Birthday',

						required: false,

						datasource: Person_p.birthday() || null
					}
				));

				this.elementOptions['account-holder-birthday'] = 
				{
					init: module.DateInputWidget.prototype.init
				}

			
			// Add requirement indicator (asterisk) explanation

				outerDiv = this.createWidget(

				'HTMLElement', // outer div

				{
					element: 'div',			
					
					classList: ['row']
				});
				
				outerDiv.appendChild(this.createWidget(

					'HTMLElement',

					{
						element: 'p',
						
						classList: ['required-indicator'],
							
						innerHTML: '* indicates a required field'
					}
				));

				container.appendChild(outerDiv);

				//container.appendChild(this.createRequiredFieldExplanation());

							
			// Add submit and cancel buttons

				outerDiv = this.createWidget(

					'HTMLElement', // outer div

					{
						element: 'div',			
						
						classList: ['row', 'form-submit']
					}
				);
				
				
				outerDiv.appendChild(this.createWidget(

					'CancelButtonWidget',  // cancel button

					{					
						id: 'account-holder-cancel',

						label: 'Cancel'
					}
				));
				
				this.elementOptions['account-holder-cancel'] =
				{
					init: module.CancelButtonWidget.prototype.init
				}

				
				outerDiv.appendChild(this.createWidget(

					'SubmitButtonWidget',  // submit button

					{					
						id: 'account-holder-submit',

						label: 'Done',

						icon: 'send'
					}
				));

				this.elementOptions['account-holder-submit'] =
				{
					init: module.SubmitButtonWidget.prototype.init
				}

				container.appendChild(outerDiv);

				//container.appendChild(this.createSubmitCancelButtons('account-holder-form'));

			// Render to DOM and initialize

				this.ssuper().prototype.render.call(this);


			/*
			// Update DOM

				this.$renderContext().empty();

				this.$renderContext().append(formElement);

			// Initialize post-render

				this.init();
			*/

			// (Re)assign event handlers to form elements

				/*
				$('#account-holder-birthday.datepicker').pickadate({
					
					//closeOnSelect: true, // bug: ineffective
					
					closeOnClear: true,
					
					onSet: function() {this.close()},
					
					selectMonths: true, // Creates a dropdown to control month
					
					selectYears: 15 // Creates a dropdown of 15 years to control year
				});
				*/
				
				
				/*
				$('#account-holder-name').keyup(function(event) {

					this.validateName(event, 'account-holder-name', 'Please enter your name', true);

				}.bind(this));


				$('#account-holder-email').keyup(function(event) {

					this.validateEmail(event, 'account-holder-email', false);

				}.bind(this));
				*/

				
				/*
				$('#account-holder-cancel').click(function(event) { // cancel (blur hides click event so using mousedown)

					console.log('cancel');

					this.cancel(event);

				}.bind(this));


				$('#account-holder-submit').mousedown(function(nEvent) { // submit (blur hides click event so using mousedown)

					console.log('submit');

					this.submit(nEvent);

				}.bind(this));

				*/
		}

		else { // present default message

			this.$renderContext().empty();

			this.$renderContext().append(this.createWidget('HTMLElement',
			{
				element: 'p',

				innerHTML: 'No profile selected. Please select or create a profile in order to edit details.'
			}));
		}
	};


	/** Submits person form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*
	* @todo Fix employer hack same is in EventView
	*/

	module.AccountProfileView.prototype.submit = function(nEvent) {

		if (app.FormWidget.instance().validate($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

			// Nofity observers by passing them a new Person with the data from the form

			var person = new module.Person($('#account-holder-name').val());

			person.jobTitle($('#account-holder-jobtitle').val());

			person.email($('#account-holder-email').val() !== '' ? new module.Email($('#account-holder-email').val()) : null);
			
			person.employer($('#account-holder-employer').val() !== '' ? new module.Organization($('#account-holder-employer').val()) : null); //hack

			person.birthday($('#account-holder-birthday').val() !== '' ? new Date($('#account-holder-birthday').val()) : null);
			
			//this.notifyObservers(person, parseInt($('#account-holder-id').val()));

			this.ssuper().prototype.submit.call(

				this,
				
				person);
			
			return true;
		}

		return false;
	};

})(app);