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

	module.EventView.prototype.editGuests = function(nEvent) {

		if (app.FormWidget.instance().validate(this.form())) {

			this.notifyObservers(new module.GuestListView(), this.model(), module.View.UIAction.SUBVIEW);
		}

		else {

			Materialize.toast('Some info seems to be missing. Please try again.', app.prefs.defaultToastDelay());
		}
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

		//console.log('entering EventView render()'); // debug

		var container; // shorthand reference to inherited temporary container element
		
		
		if (Event_e !== null) {
			
			// Set up container div
			
				container = this.containerElement(this.createWidget(

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
						id: 'event-form',

						autocomplete: 'off',

						novalidate: true
					}
				);

				container.appendChild(formElement);

			
			// Add hidden event id field

				formElement.appendChild(this.createWidget(

					'HTMLElement',

					{
						element: 'input',

						attributes: {id: 'event-id', type: 'hidden', value: Event_e.id()}
					}
				));

			
			// Add event name field

				formElement.appendChild(this.createWidget('TextInputWidget',
				{
					width: 's12',

					id: 'event-name',

					label: 'Event Name',

					required: true,

					datasource: Event_e.name() ? Event_e.name() : ''
				}));
				
							
			// Add location field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',

					{
						id: 'event-location',
						
						width: 's12',

						label: 'Location',

						required: false,

						datasource: Event_e.location() ? Event_e.location() : ''//,

						//datalist: 'suggested-locations'
					}
				));

				this.elementOptions['event-location'] = 
				{
					listeners: {

						focus: this.suggestLocations // suggest locations
					}
				}

				
			// Add start date and end date fields

				var outerDiv = this.createWidget(

					'HTMLElement',

					{
						element: 'div',
						
						classList: ['row']
					}
				);

				formElement.appendChild(outerDiv); // Add to container


				outerDiv.appendChild(this.createWidget(

					'DateInputWidget',

					{
						id: 'event-start-date',

						width: 's6',

						label: 'Starts',

						required: true,

						datasource: Event_e.start(),

						//errormessage: '...',

						validator: 'EventView.prototype.validateStartDate'

					}

				).children[0]); // extract from wrapper

								
				var endDate = this.createWidget(

					'DateInputWidget',

					{
						id: 'event-end-date',

						width: 's6',

						label: 'Ends',

						required: false,

						datasource: Event_e.end(),

						validator: 'EventView.prototype.validateEndDate',

						errormessage: 'Please enter end after start in format dd/mm/yyyy hh:mm'

					}
				).children[0]; // extract from wrapper
				
				endDate.children[0].classList.add('validate'); // 'validate' normally only comes with required field, so add seperately here

				outerDiv.appendChild(endDate);

				
			// Add event type field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',
					{
						id: 'event-type',

						width: 's12',

						label: 'Event Type',

						required: false,

						datasource: Event_e.type() || ''//,

						//datalist: 'suggested-event-types'
					}
				));

				this.elementOptions['event-type'] = 
				{
					listeners: {

						focus: this.suggestEventTypes // suggest event types
					}
				}
							
			
			// Add capacity field and edit guest list button

				outerDiv = this.createWidget(

					'NumberInputWidget',

					{
						id: 'event-capacity',

						width: 's6',

						label: 'Capacity',

						required: false,

						datasource: Event_e.capacity() ? Event_e.capacity() : 0,

						min: 0,

						step: 1,

						errormessage: 'Please enter capacity (0 or greater)'
					}
				);

				formElement.appendChild(outerDiv);

				
				var innerDiv = this.createWidget(

					'HTMLElement', // inner div

					{
						element: 'div',

						classList: ['col', 's6']
					}
				);


				innerDiv.appendChild(this.createWidget(

					'HTMLElement', // button

					{
						element: 'a',

						attributes: {id: 'event-edit-guests-button', role: 'button', tabindex: 0},
						
						classList: ['waves-effect', 'waves-teal', 'btn-flat'],

						innerHTML: 'Edit guests'
					}
				));

				this.elementOptions['event-edit-guests-button'] = 
				{
					listeners: {

						mousedown: 

							function(nEvent) { // navigate to guest list

								this.editGuests(nEvent);

							}.bind(this)
					}
				};

				outerDiv.appendChild(innerDiv);

				
			// Add host field

				formElement.appendChild(this.createWidget(

					'TextInputWidget',

					{
						id: 'event-host',

						width: 's12',

						label: 'Host',

						required: false,

						datasource: Event_e.host() && Event_e.host().hostName() ? Event_e.host().hostName() : ''//,

						//datalist: 'suggested-hosts'
					}
				));

				this.elementOptions['event-host'] = 
				{
					listeners: {

						focus: this.suggestHosts // suggest hosts
					}
				};

				
				innerDiv = this.createWidget(

					'HTMLElement', // IHost type selector
					{
						element: 'div',

						classList: ['radioset-container','input-field', 'col', 's12']
					}
				);

				formElement.appendChild(innerDiv);

				
				var fieldsetElement = this.createWidget(

					'HTMLElement', // fieldset

					{
						element: 'fieldset',

						attributes:
						{
							id: 'event-host-type'
						},
						
						classList: ['materialize-textarea'],

						innerHTML: Event_e.description()
					}
				);

				innerDiv.appendChild(fieldsetElement);

				
				fieldsetElement.appendChild(this.createWidget(

					'HTMLElement', // legend

					{
						element: 'legend',

						innerHTML: 'Host type'
					}
				));
				
				
				var attributes = 
				{
					id: 'event-host-type-organization',

					name: 'event-host-type',

					type: 'radio',

					value: 'organization',

					'aria-labelledby': 'event-host-type-organization-label'
				}

				if ((!Event_e.host() || !Event_e.host().isInstanceOf(module.Person))) {attributes.checked = true;} // default to org

				fieldsetElement.appendChild(this.createWidget(

					'HTMLElement', // org radio

					{
						element: 'input',

						attributes: attributes
					}
				));

				this.elementOptions['event-host-type-organization'] = 
				{
					listeners: {

						click: 

							function(nEvent) { // reset host if host type changed

								$('#event-host').val('');
							}
					}
				};

				fieldsetElement.appendChild(this.createWidget(

					'HTMLElement', // org label

					{
						element: 'label',

						attributes:
						{
							id: 'event-host-type-organization-label',

							for: 'event-host-type-organization'
						},

						innerHTML: 'Organization'
					}
				));

								
				attributes = 
				{
					id: 'event-host-type-person',

					name: 'event-host-type',

					type: 'radio',

					value: 'person',

					'aria-labelledby': 'event-host-type-person-label'
				}

				if ((Event_e.host() && Event_e.host().isInstanceOf(module.Person))) {attributes.checked = true;}

				fieldsetElement.appendChild(this.createWidget(

					'HTMLElement', // person radio

					{
						element: 'input',

						attributes: attributes
					}
				));


				this.elementOptions['event-host-type-person'] = 
				{
					listeners: {

						click: 

							function(nEvent) { // reset host if host type changed

								$('#event-host').val('');
							}
					}
				};

				fieldsetElement.appendChild(this.createWidget(

					'HTMLElement', // person label

					{
						element: 'label',

						attributes:
						{
							id: 'event-host-type-person-label',

							for: 'event-host-type-person'
						},

						innerHTML: 'Person'
					}
				));

				
			// Add description field
				
				innerDiv = this.createWidget(

					'HTMLElement', // inner div

					{
						element: 'div',			
						
						classList: ['input-field', 'col', 's12']
					}
				);
				
				
				innerDiv.appendChild(this.createWidget(

					'HTMLElement', // input

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
					}
				));
				
				
				innerDiv.appendChild(this.createWidget(

					'HTMLElement', // label

					{	
						element: 'label',			
						
						attributes:	{for: 'event-description', id: 'event-description-label'},
						
						classList: Event_e.description() ? ['form-label', 'active'] : ['form-label'],
						
						dataset: {error: 'Please enter description'},
						
						innerHTML: 'Description'
					}
				));
				
				
				outerDiv = this.createWidget(

					'HTMLElement', // outer div

					{
						element: 'div',
						
						classList: ['row']
					}
				);
				
							
				outerDiv.appendChild(innerDiv);
				
				formElement.appendChild(outerDiv);
				

			// Add requirement indicator (asterisk) explanation

				outerDiv = this.createWidget('HTMLElement', // outer div
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
						id: 'event-form-cancel',

						label: 'Cancel'
					}
				));
				
				outerDiv.appendChild(this.createWidget(

					'SubmitButtonWidget',  // submit button

					{					
						id: 'event-form-submit',

						label: 'Done',

						icon: 'send'
					}
				));

				formElement.appendChild(outerDiv);

			
		$('#event-name').attr('autofocus', true); // set initial focus on name
		}

		else { // present default message

			container = this.containerElement(this.createWidget(

				'HTMLElement',

				{
					element: 'p',

					innerHTML: 'No event selected. Please select or create an event in order to edit details.'
				}
			));
		}

		// Render to DOM

			//console.log('generated element, calling FormView render()'); //debug

			this.ssuper().prototype.render.call(this);

			//console.log('back from FormView, initializing EventView');

		
		// Do post-render initialization

			this.init(); // call init up parent class chain

		//console.log('done initializing, exiting EventView render()'); // debug
	};


	/** Submits event form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*
	* @todo Fix host hack
	*/

	module.EventView.prototype.submit = function(nEvent) {
		
		var val = this.val(); // get Model to submit

		if (val !== null) { // Submit form if all validations pass

			this.ssuper().prototype.submit.call(this, val);

			return true;
		}

		// else

		Materialize.updateTextFields(); // make sure validation errors are shown

		return false;
	};


	/** Suggest event types based on a hard-coded list
	*
	* Datalists not supported by Safari at the time of this writing, but fails silently with no adverse effects.
	*/

	module.EventView.prototype.suggestEventTypes = function(nEvent) {

		var input = nEvent.currentTarget;//, $listElement = $('#suggested-event-types'), optionElement;

		//console.log($input.attr('id'));

		//$listElement.empty();

		/*
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
		];
		*/

		if ($(input).parent().find('datalist').length === 0 && $(input).parent().find('ul').length === 0) { // only generate list once

			module.TextInputWidget.instance().addAutocomplete(input,
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
			]);
		}


		/*
		for (var ix in types) {
			
			optionElement = document.createElement('option');

			optionElement.value = types[ix];

			optionElement.innerHTML = types[ix];

			$listElement.append(optionElement);
		}
		*/
	};



	/** Suggest hosts based on hosts of previous events in the account.
	* 
	* Suggest either Organizations or Persons, depending on the users choice of host type.
	*
	* Not supported on iOS at the time of this writing, but fails silently with no adverse effects.
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
	* Not supported on iOS at the time of this writing, but fails silently with no adverse effects.
	*
	* @return {void} Directly updates location datalist in the DOM
	*/

	module.EventView.prototype.suggestLocations = function() {

		if (app.device().isiOS()) {return;} // prevent iOS user from being asked to accept location access

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

				// Geolocation seems to require access via https.
				// Don't currently have access to a secure server,
				// so mocked geolocation result here during development.
				// This works, but isn't helpful for people in other
				// locations than mine, so disabling it in production.

				/*
				position = {

					coords:
					{

						latitude: 55.6666281,

						longitude: 12.556294
					},

					timestamp: new Date().valueOf()
				}
				*/
			}
		}

		if (position) {// position is defined

			//new module.FourSquareSearch($(window).width() > 1024 || $(window).height() > 1024 ? 20 : 50).execute(function(venues) { // get venues (max on mobile, fewer in desktop)

			module.prefs.locationSearchProvider().execute(function(venues) { // get venues (max on mobile, fewer in desktop)

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
	};


	/** Gets new Event representing current values entered in form
	*
	* @return {Event} Event with the form data, or null if form doesn't validate
	*
	* @throws {IllegalArgumentError} If trying to set val (property is read-only)
	*/

	module.EventView.prototype.val = function() {
		
		if (arguments.length > 0) {

			throw new IllegalArgumentError('val is read-only');
		}

		if (!app.FormWidget.instance().validate(this.form())) {

			return null;
		}

		else {

			var ret = new module.Event(

				$('#event-name').val(),

				$('#event-type').val(),

				(function() {

					var date = module.DateInputWidget.instance().value($('#event-start-date'));

					return moment && moment.isMoment(date) ? date.toDate() : date; // Event.js only accepts native Date objects

				}.bind(this))(),

				(function() {

					var date = module.DateInputWidget.instance().value($('#event-end-date'));

					return moment && moment.isMoment(date) ? date.toDate() : date; // Event.js only accepts native Date objects

				}.bind(this))(),

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

				parseInt($('#event-capacity').val())
			);

			this.model().guests().forEach(function(guest) { // copy guest list

				void ret.addGuest(guest);
			});

			return ret;
		}
	};


	/** Event handler for interactive validation of end date field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	module.EventView.prototype.validateEndDate = function(Element_e) {

		//console.log('validating end date');

		var dateWidget = module.DateInputWidget.instance(),

		endDate = dateWidget.value(Element_e),

		startDate = dateWidget.value($('#event-start-date')[0]),

		ret = false; // return false by default

		$(Element_e).siblings('label').data('error',  // pre-emptively (re)set error message to default

			$(Element_e).siblings('label').data('error_default'));
		
		if ($(Element_e).val() !== '') { // an entry has been made in end date

			if (dateWidget.validate(Element_e)) { // end date is a valid date
				
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

		//console.log('// end date validates to ' + ret);

		return ret;

	}.bind(this);


	/** Event handler for interactive validation of start and end date fields
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	module.EventView.prototype.validateStartDate = function(Element_e) {

		//console.log('validating start date');

		var ret = false; // return false by default

		if (app.DateInputWidget.instance().validate(Element_e)) { // start date is a valid date

			Materialize.updateTextFields($('#event-end-date')[0]); // re-check that end, if entered, is still after start, else present error msg

			ret = true;
		}

		Element_e.setCustomValidity(ret ? '' : false); // set up for global handler, anything other than the empty string is taken as indicating an error
		
		return ret;
	};

})(app);