'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventView extends FormView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for individual events. Renders event in UI, and captures UI events on event.
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
	*
	* @todo Simplify date entry: set end date to start date when initially selecting start date, supressing end datepicker, or do not require entry of end date and time unless the user wants to 
	*
	* @todo Hide most of the non-required details behind a 'Details' widget (i.e. use 'progressive disclosure')
	*
	* @todo Add unit testing of rendering and interaction in browser
	*
	* @todo Verify that geolocation works as expected when available in a mobile device with GPS
	*
	* @todo Get description character counter to work without breaking rendering on Android and iOS
	*/

	module.EventView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'EventView';

		this.ssuper = module.FormView;
		
		// Initialize instance members inherited from parent class
		
		module.FormView.call(this, module.Event, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.EventView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from FormView
	*---------------------------------------------------------------------------------------*/

	module.EventView.prototype = Object.create(module.FormView.prototype); // Set up inheritance

	module.EventView.prototype.constructor = module.EventView; // Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/


	/** Enables navigation to the event's guest list from the event form */

	module.EventView.prototype.navigateToGuestList = function(nEvent) {

		this.notifyObservers(new module.GuestListView(), this.model(), module.View.UIAction.NAVIGATE);
	};


	/** (Re)renders event to form in UI
	*
	* @param {Event} e The event from which to present data in the form
	*
	* @return void
	*
	* @todo Get character counter to work on description field
	 */

	module.EventView.prototype.render = function(Event_e) {

		var widgetFactory = app.UIWidgetFactory.instance();
		
		if (Event_e !== null) {
			
			// Setup up form and container div

				var formElement = widgetFactory.createProduct.call(widgetFactory, 'FormWidget',
				{
					id: 'event-form',

					autocomplete: 'off',

					novalidate: true
				});

				var containerDiv = formElement.firstChild;

				/*
				var formElement =  this.createElement(
				{
					element: 'form',			
					
					attributes: {id: 'event-form', autocomplete: 'off'},//, novalidate: true},
					
					classList: ['col', 's12']
				});


				var containerDiv =  this.createElement(
				{
					element: 'div',			
					
					classList: ['row']
				});
				

				formElement.appendChild(containerDiv);
				*/

			// Add heading
				
				containerDiv.appendChild(this.createHeading('s12', this.heading()));
				

			// Add hidden event id field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
				{
					element: 'input',

					attributes: {id: 'event-id', type: 'hidden', value: Event_e.id()}
				}));

				/*
				containerDiv.appendChild(this.createElement({

					element: 'input',

					attributes: {id: 'event-id', type: 'hidden', value: Event_e.id()}
				}))
				*/

			
			// Add event name field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'TextInputWidget',
				{
					width: 's12',

					id: 'event-name',

					label: 'Event Name',

					required: true,

					datasource: Event_e.name() ? Event_e.name() : ''
				}));

				/*
				containerDiv.appendChild(this.createTextField(

					's12',

					'event-name',

					'Event Name',

					true,

					Event_e.name() ? Event_e.name() : ''//,

					//'',

					//'module.View.prototype.validateName'
				));
				*/
			
			
			// Add location field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory,'TextInputWidget',
				{
					id: 'event-location',
					
					width: 's12',

					label: 'Location',

					required: false,

					datasource: Event_e.location() ? Event_e.location() : '',

					datalist: 'suggested-locations'
				}));

				/*
				var innerDiv =  this.createElement( // inner div
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
						
						id: 'event-location',
						
						value: Event_e.location() ? Event_e.location() : '',
						
						list: 'suggested-locations',

						'aria-labelledby': 'event-location-label',

						role: 'textbox'
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-location', id: 'event-location-label'},
					
					classList: Event_e.location() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter event location'},
					
					innerHTML: 'Location'
				}));
				
				
				innerDiv.appendChild(this.createElement( // data list
				{	
					element: 'datalist',			
					
					attributes: {id: 'suggested-locations'}
				}));
				
				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				outerDiv.appendChild(innerDiv);
				
				containerDiv.appendChild(outerDiv);	

				*/	
			

			// Add start date and end date fields

				var outerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
				{
					element: 'div',
					
					classList: ['row']
				});

				containerDiv.appendChild(outerDiv); // Add to container


				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory,'DateInputWidget',
				{
					id: 'event-start-date',

					width: 's6',

					label: 'Starts',

					required: true,

					datasource: Event_e.start()

					//errormessage: '...'

				}).children[0]); // extract from wrapper

				
				var endDate = widgetFactory.createProduct.call(widgetFactory,'DateInputWidget',
				{
					id: 'event-end-date',

					width: 's6',

					label: 'Ends',

					required: true,

					datasource: Event_e.end()

					//errormessage: '...'

				}).children[0]; // extract from wrapper

				endDate.children[0].classList.add('validate'); // 'validate' normally only comes with required field, so add seperately here

				outerDiv.appendChild(endDate);

				/*
				var outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});

				containerDiv.appendChild(outerDiv); // Add to container
				
			
				outerDiv.appendChild(this.createDateField( // Start date

					's6',

					'event-start-date',

					'Starts',

					true,

					Event_e.start(),

					'',

					'module.EventView.prototype.validateStartDate'

				).children[0]); 
					
				
				var endDate = this.createDateField( // End date

					's6',

					'event-end-date',

					'Ends',

					false, // we do not require an end date but, if present, validate it against the start date

					Event_e.end(),

					'Please use format mm/dd/yyyy hh:mm, and make sure end is after start',

					'module.EventView.prototype.validateEndDate'

				).children[0];

				endDate.children[0].classList.add('validate'); // 'validate' normally only comes with required field, so add seperately here

				outerDiv.appendChild(endDate);
				*/

				/*DEPRECATED
				outerDiv.appendChild(this.createTimeField( // Time

					's6',

					'event-start-time',

					'Start Time',

					true,

					Event_e.start()

				).children[0]); // extract date itself from row wrapper
				*/


			// Add end date and time field (DEPRECATED)

				/*
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});

				containerDiv.appendChild(outerDiv);
					
				
				outerDiv.appendChild(this.createDateField( // Date

					's6',

					'event-end-date',

					'End Date',

					true,

					Event_e.end()

				).children[0]); // extract date itself from row wrapper
					
					
				outerDiv.appendChild(this.createTimeField( // Time

					's6',

					'event-end-time',

					'End Time',

					true,

					Event_e.end()

				).children[0]);
				*/


			// Add event type field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory,'TextInputWidget',
				{
					id: 'event-type',

					width: 's12',

					label: 'Event Type',

					required: false,

					datasource: Event_e.type() || '',

					datalist: 'suggested-event-types'
				}));

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
						
						id: 'event-type',
						
						value: Event_e.type() ? Event_e.type() : '',
						
						list: 'suggested-event-types',

						'aria-labelledby': 'event-type-label',

						role: 'textbox'
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-type', id: 'event-type-label'},
					
					classList: Event_e.type() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter event type'},
					
					innerHTML: 'Event Type'
				}));
				
				
				innerDiv.appendChild(this.createElement( // data list
				{	
					element: 'datalist',			
					
					attributes: {id: 'suggested-event-types'}
				}));
				
				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
							
				
				outerDiv.appendChild(innerDiv);
				
				containerDiv.appendChild(outerDiv);

				*/

			
			// Add capacity field and edit guest list button

				outerDiv = widgetFactory.createProduct.call(widgetFactory, 'NumberInputWidget',
				{
					id: 'event-capacity',

					width: 's6',

					label: 'Capacity',

					required: false,

					datasource: Event_e.capacity() ? Event_e.capacity() : 0,

					min: 0,

					step: 1,

					errormessage: 'Please enter capacity (0 or greater)'
				});

				containerDiv.appendChild(outerDiv);
				

				var innerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // inner div
				{
					element: 'div',

					classList: ['col', 's6']
				});


				innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // button
				{
					element: 'a',

					attributes: {id: 'event-edit-guests-button', role: 'button', tabindex: 0},
					
					classList: ['waves-effect', 'waves-teal', 'btn-flat'],

					innerHTML: 'Edit guests'
				}));

				outerDiv.appendChild(innerDiv);

				/*
				outerDiv = this.createNumberField(
				
					's6',

					'event-capacity',

					'Capacity',

					false,

					Event_e.capacity() ? Event_e.capacity() : 0,

					0,

					null,

					1,

					'Please enter capacity (0 or greater)'
				);

				containerDiv.appendChild(outerDiv);

					
				innerDiv =  this.createElement( // inner div
				{
					element: 'div',

					classList: ['col', 's6']
				});


				innerDiv.appendChild(this.createElement( // button
				{
					element: 'a',

					attributes: {id: 'event-edit-guests-button', role: 'button', tabindex: 0},
					
					classList: ['waves-effect', 'waves-teal', 'btn-flat'],

					innerHTML: 'Edit guests'
				}));

				outerDiv.appendChild(innerDiv);
			*/
			

			// Add host field

				containerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'TextInputWidget',
				{
					id: 'event-host',

					width: 's12',

					label: 'Host',

					required: false,

					datasource: Event_e.host() && Event_e.host().hostName() ? Event_e.host().hostName() : '',

					datalist: 'suggested-hosts'
				}));

				/*
				containerDiv.appendChild(this.createTextField( // main input

					's12',

					'event-host',

					'Host',

					false,

					Event_e.host() && Event_e.host().hostName() ? Event_e.host().hostName() : '',

					'suggested-hosts'
				));


				innerDiv.appendChild(this.createElement( // data list
				{	
					element: 'datalist',			
					
					attributes: {id: 'suggested-hosts'}
				}));

				*/
				
				innerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // IHost type selector
				{
					element: 'div',

					classList: ['radioset-container','input-field', 'col', 's12']
				});

				containerDiv.appendChild(innerDiv);

				
				var fieldsetElement = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // fieldset
				{
					element: 'fieldset',

					attributes:
					{
						id: 'event-host-type'
					},
					
					classList: ['materialize-textarea'],

					innerHTML: Event_e.description()
				});

				innerDiv.appendChild(fieldsetElement);

				
				fieldsetElement.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // legend
				{
					element: 'legend',

					innerHTML: 'Host type'
				}));
				
				/*
				innerDiv =  this.createElement( // IHost type selector
				{
					element: 'div',

					//attributes: {style: 'padding-left:0px;padding-right:0px;margin:0px;'},		
					
					classList: ['radioset-container','input-field', 'col', 's12']
				});
				
				containerDiv.appendChild(innerDiv);

				
				var fieldsetElement = this.createElement( // fieldset
				{
					element: 'fieldset',
					
					attributes:
					{
						id: 'event-host-type'
					},
					
					classList: ['materialize-textarea'],

					innerHTML: Event_e.description()
				});

				innerDiv.appendChild(fieldsetElement);

				fieldsetElement.appendChild(this.createElement( // legend
				{
					element: 'legend',

					innerHTML: 'Host type'
				}));
				*/

				var attributes = 
				{
					id: 'event-host-type-organization',

					name: 'event-host-type',

					type: 'radio',

					value: 'organization',

					'aria-labelledby': 'event-host-type-organization-label'
				}

				if ((!Event_e.host() || !Event_e.host().isInstanceOf(module.Person))) {attributes.checked = true;} // default to org

				fieldsetElement.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // org radio
				{
					element: 'input',

					attributes: attributes
				}));

				fieldsetElement.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // org label
				{
					element: 'label',

					attributes:
					{
						id: 'event-host-type-organization-label',

						for: 'event-host-type-organization'
					},

					innerHTML: 'Organization'
				}));

				/*
				fieldsetElement.appendChild(this.createElement( // org radio
				{
					element: 'input',

					attributes: attributes
				}));

				fieldsetElement.appendChild(this.createElement( // org label
				{
					element: 'label',

					attributes:
					{
						id: 'event-host-type-organization-label',

						for: 'event-host-type-organization'
					},

					innerHTML: 'Organization'
				}));
				*/
				
				attributes = 
				{
					id: 'event-host-type-person',

					name: 'event-host-type',

					type: 'radio',

					value: 'person',

					'aria-labelledby': 'event-host-type-person-label'
				}

				if ((Event_e.host() && Event_e.host().isInstanceOf(module.Person))) {attributes.checked = true;}

				fieldsetElement.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // person radio
				{
					element: 'input',

					attributes: attributes
				}));

				fieldsetElement.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // person label
				{
					element: 'label',

					attributes:
					{
						id: 'event-host-type-person-label',

						for: 'event-host-type-person'
					},

					innerHTML: 'Person'
				}));

				/*
				fieldsetElement.appendChild(this.createElement( // person radio
				{
					element: 'input',

					attributes: attributes
				}));

				fieldsetElement.appendChild(this.createElement( // person label
				{
					element: 'label',

					attributes:
					{
						id: 'event-host-type-person-label',

						for: 'event-host-type-person'
					},

					innerHTML: 'Person'
				}));
				*/

			
			// Add description field
				
				innerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's12']
				});
				

				innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // input
				{
					element: 'textarea',			
					
					attributes:
					{
						id: 'event-description',
						
						length: 120,
						
						maxlength: 120,

						'aria-labelledby': 'event-description-label',

						role: 'textbox',

						'aria-multiline': true
					},
					
					classList: ['materialize-textarea'],

					innerHTML: Event_e.description()
				}));
				
				
				innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // label
				{	
					element: 'label',			
					
					attributes:	{for: 'event-description', id: 'event-description-label'},
					
					classList: Event_e.description() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter description'},
					
					innerHTML: 'Description'
				}));
				
				
				outerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
				
							
				outerDiv.appendChild(innerDiv);
				
				containerDiv.appendChild(outerDiv);
				/*
				innerDiv =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's12']
				});
				

				innerDiv.appendChild(this.createElement( // input
				{
					element: 'textarea',			
					
					attributes:
					{
						id: 'event-description',
						
						length: 120,
						
						maxlength: 120,

						'aria-labelledby': 'event-description-label',

						role: 'textbox',

						'aria-multiline': true
					},
					
					classList: ['materialize-textarea'],

					innerHTML: Event_e.description()
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes:	{for: 'event-description', id: 'event-description-label'},
					
					classList: Event_e.description() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter description'},
					
					innerHTML: 'Description'
				}));
				
				
				outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});
				
							
				outerDiv.appendChild(innerDiv);
				
				containerDiv.appendChild(outerDiv);
				*/


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

				//containerDiv.appendChild(this.createRequiredFieldExplanation());

					
			// Add submit and cancel buttons

				outerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // outer div
				{
					element: 'div',			
					
					classList: ['row', 'form-submit']
				});
				
				
				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'CancelButtonWidget',  // cancel button
				{					
					id: 'event-form-cancel',

					label: 'Cancel'
				}));
				

				outerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'SubmitButtonWidget',  // submit button
				{					
					id: 'event-form-submit',

					label: 'Done',

					icon: 'send'
				}));

				containerDiv.appendChild(outerDiv);
				
				
				//containerDiv.appendChild(this.createSubmitCancelButtons('event-form'))
			
			// Update DOM

				this.$renderContext().empty();

				this.$renderContext().append(formElement);

			// Initialize post-render

				//H5F.setup(document.getElementById("event-form")); // hook up H5F polyfill to form; setCustomValidity support seems erratic

				
				$('#event-name').attr('autofocus', true); // set initial focus on name
				
				
				/*DEPRECATED
				$('#event-name').blur(function(event) { // validate name

					// this gets called after Matrialize's global blur() handler on the document has finished managing the 'active' CSS class

					this.validateName(event, 'event-name', 'Please enter name', true);
		
				}.bind(this));
				*/


				$('#event-location').focus(this.suggestLocations); // suggest locations

				
				this.initDateTimePicker(); // generic initialization of bootstrap-datetime pickers

				
				// Attach event handlers (dp.change doesn't 'take' if iterating, so going manual)

				// Note: short of manual polling, there seems to be very little support for 'changey' input events on mobile.
				// But focus and blur seem to work, and to be compatible with the native picker widgets, so working with them.

				/*

				$('#event-start-date').on('dp.change', function(nEvent) { // change event from custom widget (if any)

					//console.log('dp.change on start date')

					//$('#event-start-date').blur(); // trigger response from global handler

					//void this.validateStartDate(nEvent.currentTarget);

					Materialize.updateTextFields(nEvent.currentTarget);

				}.bind(this));
				*/

				/*DEPRECATED
				$('#event-start-date').blur(function(nEvent) { // blur event on input

					if ($('#event-start-date').val() !== '') {

						$('#event-start-date').addClass('active');
					}

					else {

						$('#event-start-date').removeClass('active');
					}

					this.validateStartDate(nEvent);

				}.bind(this));

				*/

				/*
				$('#event-end-date').on('dp.change', function(nEvent) { // change event from custom widget (if any)

					//console.log('dp.change on end date')

					//$('#event-end-date').blur(); // trigger response from global handler

					//void this.validateEndDate(nEvent.currentTarget);

					Materialize.updateTextFields(nEvent.currentTarget);

				}.bind(this));
				*/
							
				
				/*DEPRECATED
				$('#event-end-date').blur(function(nEvent) { // blur event on input

					if ($('#event-end-date').val() !== '') {

						$('#event-end-date').addClass('active');
					}

					else {

						$('#event-start-date').removeClass('active');
					}

					this.validateEndDate(nEvent);

				}.bind(this));
				*/
				
				
				/* Old (Materialize) pickers (hanging on to the code until the project has passed the Udacity review) */
				
					/*
					$('#event-start-date.datepicker').pickadate({ // Initalize start date picker
						
						//closeOnSelect: true, // bug: ineffective
						
						closeOnClear: true,
						
						format: 'mm/dd/yyyy',

						onSet: function(nEvent) {

							if (typeof nEvent.select === 'number') { // date selected

								$('#event-start-date-hidden').val(nEvent.select); // set unformatted number representation of date to hidden field

								this.close(); // 'this' refers to the picker widget here...

								module.EventView.prototype.validateDateRange(); // so call validation without reference to it
							}

							//else: month or year selected, stay open

						}, // binding to the EventView here would make it impossible to close the widget from within the handler (I tried, and failed)
						
						selectMonths: true, // Creates a dropdown to control month
						
						selectYears: 15 // Creates a dropdown of 15 years to control year // init date pickers
					});
					*/

					
					/*
					$('#event-end-date.datepicker').pickadate({ // Initalize end date picker
						
						//closeOnSelect: true, // bug: ineffective
						
						closeOnClear: true,
						
						format: 'mm/dd/yyyy',

						onSet: function(nEvent) {

							if (typeof nEvent.select === 'number') { // date selected

								$('#event-end-date-hidden').val(nEvent.select); // set unformatted number representation of date to hidden field

								this.close(); // 'this' refers to the picker widget here...

								module.EventView.prototype.validateDateRange(); // so call validation without reference to it
							}

							//else: month or year selected, stay open

						}, // binding to the EventView here would make it impossible to close the widget from within the handler (I tried, and failed)
						
						selectMonths: true, // Creates a dropdown to control month
						
						selectYears: 15 // Creates a dropdown of 15 years to control year // init date pickers
					});
					*/

					/*
					$('#event-start-time.timepicker').pickatime({ // init start time picker
						
						//closeOnSelect: true, // bug: ineffective
						
						closeOnClear: true,
						
						format: 'h:i A',
						
						//onSet: this.validateTimeRange

						onSet: function(nEvent) {

							if (typeof nEvent.select === 'number') { // date selected

								$('#event-start-time-hidden').val(nEvent.select); // set minutes since midnight to hidden start time field

								this.close(); // 'this' refers to the picker widget here...

								module.EventView.prototype.validateTimeRange(); // so call validation without reference to it
							}

							//else: month or year selected, stay open

						}
					});
					*/

					/*
					$('#event-end-time.timepicker').pickatime({ // init end time picker
						
						//closeOnSelect: true, // bug: ineffective
						
						closeOnClear: true,
						
						format: 'h:i A',
						
						//onSet: this.validateTimeRange

						onSet: function(nEvent) {

							if (typeof nEvent.select === 'number') { // date selected

								$('#event-end-time-hidden').val(nEvent.select); // set minutes since midnight to hidden end time field

								this.close(); // 'this' refers to the picker widget here...

								module.EventView.prototype.validateTimeRange(); // so call validation without reference to it
							}

							//else: month or year selected, stay open

						}
					});
					*/
				

				/*
				$('#event-capacity').keyup(function(nEvent) { // validate capacity

					this.validateCapacity(event, 'event-capacity');
		
				}.bind(this));
				*/


				$('#event-type').focus(this.suggestedEventTypes); // suggest event types

				
				$('#event-edit-guests-button').click(function(nEvent) { // edit guest list button

					this.navigateToGuestList(nEvent);
		
				}.bind(this));


				$('#event-host').focus(this.suggestHosts); // suggest hosts

				
				$('#event-host-type-organization, #event-host-type-person').click(function(nEvent) { // reset host if host type changed

					$('#event-host').val('');
				});

				// This causes rendering to fail on Android and iOS, so disabled for now:
				//$('textarea#description').characterCounter(); // count characters in description

				
				$('#event-form-cancel').click(function(nEvent) { // cancel edits

					this.cancel(nEvent);

				}.bind(this));


				$('#event-form-submit').mousedown(function(nEvent) { // submit (blur hides click event so using mousedown)

					this.submit(nEvent);

				}.bind(this));
		}

		else { // present default message

			this.$renderContext().empty();

			this.$renderContext().append(this.createElement(
			{
				element: 'p',

				innerHTML: 'No event selected. Please select or create an event in order to edit details.'
			}));
		}
	};


	/** Submits event form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*
	* @todo Fix host hack
	*/

	module.EventView.prototype.submit = function(nEvent) {
		
		if (this.validateForm($(nEvent.currentTarget).closest('form'))) { // Submit form if all validations pass

			this.ssuper().prototype.submit.call(

				this,
				
				new module.Event(

					$('#event-name').val(),

					$('#event-type').val(),

					(function() {

						var date = this.getDateTimePickerValue($('#event-start-date'));

						return moment && moment.isMoment(date) ? date.toDate() : date; // Event.js only accepts native Date objects

					}.bind(this))(),

					/*
					(function() { // start date

						var start_date = parseInt($('#event-start-date-hidden').val());

						var start_time = parseInt($('#event-start-time-hidden').val());

						if (!isNaN(start_date)) {

							start_time = !isNaN(start_time) ? 1000 * 60 * start_time : 0;

							start_date = new Date(start_date + start_time);

							return start_date;
						}

						return null;
					})(),
					*/

					(function() {

						var date = this.getDateTimePickerValue($('#event-end-date'));

						return moment && moment.isMoment(date) ? date.toDate() : date; // Event.js only accepts native Date objects

					}.bind(this))(),

					/*
					(function() { // end date

						var end_date = parseInt($('#event-end-date-hidden').val());

						var end_time = parseInt($('#event-end-time-hidden').val());

						if (!isNaN(end_date)) {

							end_time = !isNaN(end_time) ? 1000 * 60 * end_time : 0;

							end_date = new Date(end_date + end_time);

							return end_date;
						}

						return null;
					})(),
					*/

					$('#event-location').val(),

					$('#event-description').val(),

					(function() { // host

						// get type (by function reference) of host

						var Type = $('input:radio[name ="event-host-type"]:checked').val().toLowerCase() === 'person' ? module.Person : module.Organization;

						// look user entry up on type's registry (simple name matching will suffice for now)

						var host = Type.registry.getObjectByAttribute('hostName', $('#event-host').val());

						if (host === null) { // no existing match, so create new IHost

							host = new Type(); // jsHint insists on cap in first letter of constructor names, hence the aberration

							host.hostName($('#event-host').val());
						}

						return host;
					})(),

					//new module.Organization($('#event-host').val()), //hack
					
					parseInt($('#event-capacity').val())
				),

				module.View.UIAction.SUBMIT
			);

			return true;
		}

		// else

		Materialize.updateTextFields(); // make sure validation errors are shown

		return false;
	}


	/** Suggest event types based on a hard-coded list
	*
	* Datalists not supported by Safari at the time of this writing, but fails silently with no adverse effects.
	*/

	module.EventView.prototype.suggestedEventTypes = function() {

		var $listElement = $('#suggested-event-types'), optionElement;

		$listElement.empty();

		var types =
		[
			'Birthday party',

			'Bachelor\'s party',

			'Business meeting',

			'Conference talk',

			'Family gathering',

			'Job interview',

			'Religious festival',

			'Romantic dinner',

			'Wedding'
		]

		for (var ix in types) {
			
			optionElement = document.createElement('option');

			optionElement.value = types[ix];

			optionElement.innerHTML = types[ix];

			$listElement.append(optionElement);
		}
	};


	/** Suggest hosts based on hosts of previous events in the account.
	* 
	* Suggest either Organizations or Persons, depending on the users choice of host type.
	*
	* Not supported by Safari at the time of this writing, but fails silently with no adverse effects.
	*/

	module.EventView.prototype.suggestHosts = function() {

		var $listElement = $('#suggested-hosts'), optionElement;

		$listElement.empty();

		var type = $('input:radio[name ="event-host-type"]:checked').val().toLowerCase() === 'person' ? module.Person : module.Organization;
		
		var hosts = type.registry.getObjectList();

		for (var ix in hosts) {

			
			optionElement = document.createElement('option');

			optionElement.value = hosts[ix].hostName();

			optionElement.innerHTML = hosts[ix].hostName();

			$listElement.append(optionElement);
		}
	};



	/** Suggests venues for event based on device's location (if available).
	*
	* Not supported by Safari at the time of this writing, but fails silently with no adverse effects.
	*
	* @return {void} Directly updates location datalist in the DOM
	*
	* @todo Add address info to venue display
	*/

	module.EventView.prototype.suggestLocations = function() {

		var account = module.controller.selectedAccount(),

		position = account.defaultLocation(); // set default


		// Get device's current location if available and allowed

		if (account.geoLocationAllowed()) { // user has granted permission to use geolocation

			if(navigator.geolocation) { // device provides access to geolocation

				navigator.geolocation.getCurrentPosition(

					function(pos) { // success

						position = pos; // override default
					},

					function(error) { // error

						console.log(error);
					}
				)

				// geolocation seems to require access via https

				// don't currently have access to a secure server, so,

				// mocked geolocation result during development

				// this works, but isn't helpful for people in different locations

				/*
				position = {

					coords:
					{

						latitude: 55.6666281,

						longitude: 12.556294
					},

					timestamp: new Date().valueOf()
				}*/
			}
		}

		//console.log(position);

		if (position) {// position is defined

			new module.FourSquareSearch($(window).width() > 1024 || $(window).height() > 1024 ? 20 : 50).execute(function(venues) { // get venues (max on mobile, fewer in desktop)

				if (venues !== null) { // search succeeded

					var $listElmnt = $('#suggested-locations'), optionElmnt;

					$listElmnt.empty();

					venues.forEach(function(venue) { // build suggest list

						optionElmnt = document.createElement('option');

						optionElmnt.value = venue.name + (venue.location.address ? ' (' + venue.location.address + ')' : '');

						$listElmnt.append(optionElmnt);
					});
				}

			}, position);	
		}
		
		// else don't provide suggestions
	}


	/** Event handler for interactive validation of end date field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	module.EventView.prototype.validateEndDate = function(Element_e) {

		var self = module.EventView.prototype, // context of call is window, so set 'this' reference to View hierarchy manually

		endDate = self.getDateTimePickerValue(Element_e),

		startDate = self.getDateTimePickerValue($('#event-start-date')[0]),

		ret = false; // if all else fails, return false

		$(Element_e).siblings('label').data('error',  // pre-emptively (re)set error message to default

			$(Element_e).siblings('label').data('error_default'));
		
		if ($(Element_e).val() !== '') { // an entry has been made in end date

			if (self.validateDate(Element_e)) { // end date is a valid date
				
				if (startDate !== null) { // a valid start date has been entered

					ret =  (endDate.valueOf() >= startDate.valueOf()); // end date must be on or after start date
				}

				else { // an end date has been entered, but no start date (that's OK)

					ret = true;
				}
			}

			else { // invalid end date

				ret =  false;
			}
		}

		else { // end field is empty (OK unless required)

			ret = $(Element_e).attr('required') ? false : true;
		}

		Element_e.setCustomValidity(ret ? '' : false); // set up for global handler, anything other than the empty string is taken as indicating an error

		return ret;

		/*
		if ($('#event-end-date').val() !== '') { // entry has been made in end date

			if (this.validateDate(nEvent, 'event-end-date')) { // end date is a valid date

				if (this.isDateValid($('#event-start-date').val())) { // valid start date has been entered

					if (this.getDateTimePickerValue('event-end-date').valueOf() >= this.getDateTimePickerValue('event-start-date').valueOf()) { // end date is after or on start date

						return true;
					}

					else { // end is before start

						this.displayValidation(nEvent, 'event-end-date', 'End must be after start', false);

						return false;
					}
				}

				else { // no start date, so end is good by default

					return true;
				}

			}
		}
		
		return false; // in all other cases, return false
		*/

	}.bind(this);


	/** Event handler for interactive validation of start and end date fields
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	module.EventView.prototype.validateStartDate = function(Element_e) {

		var self = module.EventView.prototype, // context of call is window, so set 'this' reference to View hierarchy manually

		ret = false; // if all else fails, return false

		if (self.validateDate(Element_e)) { // start date is a valid date

			self.validateEndDate(Element_e); // re-check that end, if entered, is still after start

			ret = true;
		}

		Element_e.setCustomValidity(ret ? '' : false); // set up for global handler, anything other than the empty string is taken as indicating an error

		return ret;
	};


	//DEPRECATED
	/** Event handler for interactive validation of start and end date fields
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	/*
	module.EventView.prototype.validateDateRange = function() {

		//if (this.close) {this.close()} // close picker if called from dialog; setting closeOnClear true does not work (bug)

		var ret;
		
		// Set up references to DOM

			var $start = $('#event-start-date-hidden'),

			start_date = new Date(parseInt($start.val())),

			$start_err = $('#event-start-date-error'),

			$end = $('#event-end-date-hidden'),

			end_date = new Date(parseInt($end.val())),

			$end_err = $('#event-end-date-error');

		
		// Validate

			if ($start.val() === '') { // start not selected

				$start_err.html('Please enter start date');

				$start_err.css('display', 'block');

				$start.addClass('invalid');

				ret = false;
			}

		// focus causes end datepicker to open, no time to resolve, skip for now
		//else if (end === 'Invalid date') { // start selected, but not end

		//	$end.val(start); // set end date to start date

		//	$end.addClass('active');

		//	$end.trigger('focus');
		//}
		
		
		else if (end_date < start_date) { // end date is before start

			// Materialize's validation message won't display, so rolling my own

			$end_err.html('Please enter end date on or after start date');

			$end_err.css('display', 'block');

			$end.addClass('invalid');

			ret = false;
		}

		else {

			$start_err.css('display', 'none');

			$start.removeClass('invalid');

			$end_err.css('display', 'none');

			$end.removeClass('invalid');

			ret = true;
		}

		// Cascade validation to start/end times

			// 'this' refers to date picker here, not eventview, so invoke method using full path

			module.controller.currentView().validateStartTime();

			module.controller.currentView().validateEndTime();

			//this.validateTimeRange();

		return ret;
	}
	*/

	//DEPRECATED
	/** Validates end time field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	/*
	module.EventView.prototype.validateEndTime = function() {

		var $end_time = $('#event-end-time'),

		$end_time_err = $('#event-end-time-error');


		if ($('#event-end-date').val() !== '' && $end_time.val() === '') {

			$end_time_err.html('Please enter end time');

			$end_time_err.css('display', 'block');

			$end_time.addClass('invalid');
		}

		else {

			$end_time_err.css('display', 'none');

			$end_time.removeClass('invalid');

			return true;
		}

		return false;
	};
	*/

	//DEPRECATED
	/** Validates start time field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	 */
	/*
	module.EventView.prototype.validateStartTime = function() {

		// Set up references to DOM

		var $start_time = $('#event-start-time'),

		$start_time_err = $('#event-start-time-error');

		if ($start_time.val() === '') {

			$start_time_err.html('Please enter start time');

			$start_time_err.css('display', 'block');

			$start_time.addClass('invalid');
		}

		else {

			$start_time_err.css('display', 'none');

			$start_time.removeClass('invalid');

			return true;
		}

		return false;
	};
	*/

	//DEPRECATED
	/** Event handler for interactive validation of start and end time fields
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	 */
	 /*

	module.EventView.prototype.validateTimeRange = function() {

		if (this.close) {this.close()} // close picker (if called from dialog); setting closeOnClear true does not work (bug)
		
		var self = module.controller.currentView(); // reset 'this' reference from picker to view

		var start_date = parseInt($('#event-start-date-hidden').val()), //new Date($('#event-start-date').val()),

		end_date = parseInt($('#event-end-date-hidden').val()), // new Date($('#event-end-date').val()),

		$start_time = $('#event-start-time-hidden'), // $('#event-start-time-'),

		start_time = 1000 * 60 * parseInt($start_time.val()), // $start_time.val(),

		$start_time_err = $('#event-start-time-error'),

		$end_time = $('#event-end-time-hidden'), // $('#event-end-time'),

		end_time = 1000 * 60 * parseInt($end_time.val()),

		$end_time_err = $('#event-end-time-error');

		if (self.validateStartTime()) { // start time entered

			if (self.validateEndTime()) { // end date and time entered

				//if (end_date.valueOf() === start_date.valueOf()) { // start and end dates match
				
				if (end_date === start_date) { // start and end dates match

					start_date = new Date(start_date + start_time);

					end_date = new Date(end_date + end_time);

					// Set hours and minutes on start and end dates before comparison

					// Assumes time string of format 'hh:mm', with optional seconds and/or am/pm indicator

					//end_date.setHours(end_time.split(':')[0], parseInt(end_time.split(':')[1])); // parseInt gets rid of any am/pm

					//start_date.setHours(start_time.split(':')[0], parseInt(start_time.split(':')[1]));

					if (end_date < start_date) { // end (time) is before start (time)

						$end_time_err.html('Please enter end time after start time');

						$end_time_err.css('display', 'block');

						$end_time.addClass('invalid');

						return false;
					}
				}
			}

			else { // end time missing

				$end_time_err.html('Please enter end time');

				$end_time_err.css('display', 'block');

				$end_time.addClass('invalid');

				return false;
			}
		}

		else { // start time missing

			$start_time_err.html('Please enter start time');

			$start_time_err.css('display', 'block');

			$start_time.addClass('invalid');

			void self.validateEndTime();

			return false;
		}

		$start_time_err.css('display', 'none');

		$start_time.removeClass('invalid');

		$end_time_err.css('display', 'none');

		$end_time.removeClass('invalid');

		return true;
	}
	*/

	/*
	function stdTimeZoneOffset() {

		self = new Date();

		//var jan = new Date((self).getFullYear(), 0, 1);

		//var jul = new Date(self.getFullYear(), 6, 1);

		return Math.max(new Date((self).getFullYear(), 0, 1).getTimezoneOffset(), new Date(self.getFullYear(), 6, 1).getTimezoneOffset());
	}
	*/

})(app);