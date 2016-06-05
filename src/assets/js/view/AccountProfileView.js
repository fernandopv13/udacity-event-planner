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
	* @param {String} elementId Id of the HTML DOM element the view is bound to
	*
	* @param {String} heading Content for the list heading
	*
	* @author Ulrik H. Gade, May 2016
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

	module.View.children.push(module.AccountProfileView); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** (Re)renders person to form in UI
	*
	* @param {Person} p The account holder of the selected account
	*
	* @return void
	*
	* @todo Add suggestions to employer field
	*/

	module.AccountProfileView.prototype.render = function(Person_p) {

		// Set up container div
			
		var container = this.containerElement(this.createWidget( // shorthand reference to inherited temporary container element

			'HTMLElement', // div

			{
				element: 'div',			
				
				classList: ['row']
			}
		));
		
		if (Person_p) { // account holder exists
		
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

			
			// Add hidden person id field

				formElement.appendChild(this.createWidget(

					'HTMLElement',

					{
						element: 'input',

						attributes: {id: 'account-profile-id', type: 'hidden', value: Person_p.id()}
					}
				));

			
			// Add account holder name field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',

					{
						width: 's12',

						id: 'account-profile-name',

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

						id: 'account-profile-email',

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

				formElement.appendChild(outerDiv);


			// Add job title field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',
					{
						width: 's12',

						id: 'account-profile-jobtitle',

						label: 'Your Job Title',

						requierd: false,

						datasource: Person_p.jobTitle() || null
					}
				));

							
			// Add employer field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',

					{
						id: 'account-profile-employer',

						width: 's12',

						label: 'Your Employer',

						required: false,

						datasource:  Person_p.employer() && Person_p.employer().name() ? Person_p.employer().name() : '',

						datalist: 'suggested-employers'
					}
				));

			
			// Add birthday field

				formElement.appendChild(this.createWidget(

					'DateInputWidget',

					{
						width: 's12',

						id: 'account-profile-birthday',

						label: 'Your Birthday',

						required: false,

						datasource: Person_p.birthday() || null,

						dateonly: true
					}
				));

			
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

				formElement.appendChild(outerDiv);

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
						id: 'account-profile-cancel',

						label: 'Cancel'
					}
				));
				
								
				outerDiv.appendChild(this.createWidget(

					'SubmitButtonWidget',  // submit button

					{					
						id: 'account-profile-submit',

						label: 'Done',

						icon: 'send'
					}
				));

				formElement.appendChild(outerDiv);
		}

		else { // present default message

			container.appendChild(this.createWidget('HTMLElement',
			{
				element: 'p',

				innerHTML: 'No profile selected. Please select or create a profile in order to edit details.'
			}));
		}

			
		// Render to DOM and initialize

			this.ssuper().prototype.render.call(this);

		// Do post-render initialization

			this.init();
	};


	/** Submits account profile form to controller if it passes all validations
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*
	* @todo Fix employer hack same is in EventView
	*/

	module.AccountProfileView.prototype.submit = function(nEvent) {

		if (app.FormWidget.instance().validate($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

			// Nofity observers by passing them a new Person with the data from the form

			var person = new module.Person($('#account-profile-name').val());

			void person.jobTitle($('#account-profile-jobtitle').val());

			void person.email($('#account-profile-email').val() !== '' ? new module.Email($('#account-profile-email').val()) : null);
			
			void person.employer($('#account-profile-employer').val() !== '' ? new module.Organization($('#account-profile-employer').val()) : null); //hack

			//person.birthday($('#account-profile-birthday').val() !== '' ? new Date($('#account-profile-birthday').val()) : null);

			void person.birthday(module.DateInputWidget.instance().value($('#account-profile-birthday')))
			
			this.ssuper().prototype.submit.call(this, person);
			
			return true;
		}

		//else

		Materialize.toast(module.prefs.defaultValidationError(), module.prefs.defaultToastDelay());
		
		return false;
	};

})(app);