'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventView extends FormView
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual events. Renders event in UI, and captures UI events on event.
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
*
* @todo Set end date to start date when initially selecting start date, supressing end datepicker
*
* @todo Add unit testing of rendering in browser
*
* @todo Verify geolocation and remove mock
*/

app.EventView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	/** Initializes instance members inherited from parent class*/
	
	app.FormView.call(this, app.Event, str_elementId, str_heading);
	

	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	


	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.className = 'EventView';
};


/*----------------------------------------------------------------------------------------
* Inherit from FormView
*---------------------------------------------------------------------------------------*/	

app.EventView.prototype = Object.create(app.FormView.prototype); // Set up inheritance

app.EventView.prototype.constructor = app.EventView; //Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/


/** Cancels entries in, and navigation to, event form
*/

app.EventView.prototype.cancel = function() {

	// Discard temporary object if we were about to add a new event

	var event = app.Event.registry.getObjectById(this.modelId);

	if (!app.controller.selectedAccount().isInAccount(event)) {

		app.Event.registry.removeObject(event); // remove from Event registry

		event = undefined; // dereference object to expose it to garbage collection
	}

	// Return to previous view

	window.history.back();

	// for now, simply discard any entries made by user to an existing guest
}


/** (Re)renders event to form in UI
*
* @param {Event} The event from which to present data in the form
*
* @return void
*
* @todo Get character counter to work on description field
 */

app.EventView.prototype.render = function(Event_event) {

	var event = Event_event, formElement, containerDiv, innerDiv, outerDiv, labelElement, buttonElement, iconElement, $formDiv;

	
	if (event !== null) {
		
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
			
			containerDiv.appendChild(this.createHeading('s12', this.heading));
			

		// Add hidden event id field

			containerDiv.appendChild(this.createElement({

				element: 'input',

				attributes: {id: 'event-id', type: 'hidden', value: Event_event.id()}
			}))

		
		// Add event name field

			containerDiv.appendChild(this.createTextField(

				's12',

				'event-name',

				'Event Name',

				true,

				event.name() ? event.name() : ''
			));
		
		
		// Add location field

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
					
					id: 'event-location',
					
					value: event.location() ? event.location() : '',
					
					list: 'suggested-locations'
				}
			}));
			
			
			innerDiv.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-location'},
				
				classList: event.location() ? ['form-label', 'active'] : ['form-label'],
				
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


		// Add start date and time field

			outerDiv =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});

			containerDiv.appendChild(outerDiv); // Add to container
			
		
			outerDiv.appendChild(this.createDateField( // Date

				's6',

				'event-start-date',

				'Start Date',

				true,

				event.start()

			).children[0]); 
				
			
			outerDiv.appendChild(this.createTimeField( // Time

				's6',

				'event-start-time',

				'Start Time',

				true,

				event.start()

			).children[0]); // extract date itself from row wrapper


		// Add end date and time field

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

				event.end()

			).children[0]); // extract date itself from row wrapper
				
				
			outerDiv.appendChild(this.createTimeField( // Time

				's6',

				'event-end-time',

				'End Time',

				true,

				event.end()

			).children[0]);


		// Add event type field

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
					
					value: event.type() ? event.type() : '',
					
					list: 'event-types'
				}
			}));
			
			
			innerDiv.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-type'},
				
				classList: event.type() ? ['form-label', 'active'] : ['form-label'],
				
				dataset: {error: 'Please enter event type'},
				
				innerHTML: 'Event Type'
			}));
			
			
			innerDiv.appendChild(this.createElement( // data list
			{	
				element: 'datalist',			
				
				attributes: {id: 'event-types'}
			}));
			
			
			outerDiv =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
						
			
			outerDiv.appendChild(innerDiv);
			
			containerDiv.appendChild(outerDiv);


		// Add capacity field

			containerDiv.appendChild(this.createNumberField(

				's12',

				'event-capacity',

				'Capacity',

				true,

				event.capacity() ? event.capacity() : 0,

				0,

				null,

				1,

				'Please enter capacity (0 or greater)'
			));


		// Add guest list button

			containerDiv.appendChild(function() {

				var outerDiv =  this.createElement( // outer div
				{
					element: 'div',
					
					classList: ['row']
				});


				outerDiv.appendChild(this.createElement( // button
				{
					element: 'a',

					attributes: {id: 'event-edit-guests-button'},
					
					classList: ['waves-effect', 'waves-teal', 'btn-flat'],

					innerHTML: 'Edit guests'
				}));

				return outerDiv;

			}.bind(this)());


		// Add host field

			containerDiv.appendChild(this.createTextField(

				's12',

				'event-host',

				'Host',

				false,

				event.host() && event.host().hostName() ? event.host().hostName() : ''
			));
			
		
		// Add description field

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
					
					maxlength: 120
				},
				
				classList: ['materialize-textarea'],

				innerHTML: event.description()
			}));
			
			
			innerDiv.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes:	{for: 'event-description'},
				
				classList: event.description() ? ['form-label', 'active'] : ['form-label'],
				
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


		// Add requirement indicator (asterisk) explanation

			containerDiv.appendChild(this.createRequiredFieldExplanation());

		
		// Add submit and cancel buttons

			containerDiv.appendChild(this.createSubmitCancelButtons('event-form'))
			
		
		// Update DOM

			this.$renderContext.empty();

			this.$renderContext.append(formElement);


		// (Re)assign event handlers to form elements

			$('textarea#description').characterCounter();

			
			$('#event-start-date.datepicker, #event-end-date.datepicker').pickadate({
				
				//closeOnSelect: true, // bug: ineffective
				
				closeOnClear: true,
				
				onSet: this.validateDateRange,
				
				selectMonths: true, // Creates a dropdown to control month
				
				selectYears: 15 // Creates a dropdown of 15 years to control year
			});

			
			$('.timepicker').pickatime({
				
				//closeOnSelect: true, // bug: ineffective
				
				closeOnClear: true,
				
				format: 'H:i',
				
				onSet: this.validateTimeRange
			});

			
			$('#event-location').focus(this.suggestLocations);

			
			$('#event-name').keyup(function(event) { // capacity

				this.validateName(event, 'event-name', 'Please enter name', true);
	
			}.bind(this));

			
			$('#event-capacity').keyup(function(event) { // capacity

				this.validateCapacity(event, 'event-capacity');
	
			}.bind(this));

			
			$('#event-edit-guests-button').click(function(event) { // edit guest list button

				this.notifyObservers(this, event); // dispatch event handling to controller
	
			}.bind(this));

			
			$('#event-form-cancel').click(function(event) {

				window.history.back(); // return to previous view

				// for now, simply discard any entries made by user

			}.bind(this));


			$('#event-form-submit').click(function(event) {

				if (this.submit(event)) { // submit succesfull

					window.history.back(); // return to previous view
				}

				else {

					console.log('event form submission failed')
				}

			}.bind(this));
	}

	else { // present default message

		this.$_renderContext.empty();

		this.$_renderContext.append(this.createElement(
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

app.EventView.prototype.submit = function(event) {

	// First display any and all validation errors at once

	void this.validateName(event, 'event-name', 'Please enter name', true);

	void this.validateDateRange()

	void this.validateTimeRange()

	void this.validateCapacity(event, 'event-capacity')

	// Then do it again to obtain validation status

	// (Chain stops at first false, so no use for UI)
	
	if (this.validateName(event, 'event-name', 'Please enter name', true) // Submit results if all validations pass

		&& this.validateDateRange()

		&& this.validateTimeRange()

		&& this.validateCapacity(event, 'event-capacity')) { 

		// Notify observers by passing them a new Event with the data from the form

		this.notifyObservers(
			
			new app.Event(

				$('#event-name').val(),

				$('#event-type').val(),

				(function() { // start date

					var start_date = $('#event-start-date').val();

					var start_time = $('#event-start-time').val();

					if (start_date !== '') {

						start_date = new Date(start_date);

						if (start_time !== '') {

							start_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);
						}

						return start_date;
					}

					return null;
				})(),

				(function() { // end date

					var end_date = $('#event-end-date').val();

					var end_time = $('#event-end-time').val();

					if (end_date !== '') {

						end_date = new Date(end_date);

						if (end_time !== '') {

							end_date.setHours(end_time.split(':')[0], end_time.split(':')[1]);
						}

						return end_date;
					}

					return null;
				})(),

				$('#event-location').val(),

				$('#event-description').val(),

				new app.Organization($('#event-host').val()), //hack
				
				parseInt($('#event-capacity').val())
			),

			parseInt($('#event-id').val())
		);

		this.clear(); // set form ready to receive updates again

		return true;
	}

	return false;
}


/** Suggests venues for event based on device's location (if available)
*
* @return {void} Directly updates location datalist in the DOM
*
* @todo Add address info to venue display
*/

app.EventView.prototype.suggestLocations = function() {

	var account = app.controller.selectedAccount(),

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

			// mock geolocation result for the time being

			position = {

				coords:
				{

					latitude: 55.6666281,

					longitude: 12.556294
				},

				timestamp: new Date().valueOf()
			}
		}
	}

	if (position) {// position is defined

		new app.FourSquareSearch().execute(function(venues) { // get venues

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


/** Updates event presentation when notified by controller of change */

app.EventView.prototype.update = function(IModelable) {
	
	if (IModelable === null || IModelable.constructor === app.Event) {

		this.modelId = IModelable.id(); // lock form for updates from model

		this.render(IModelable);

		
	}

	// else do nothing
};


/** Event handler for interactive validation of start and end date fields
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.EventView.prototype.validateDateRange = function() {

	if (this.close) {this.close()} // close picker if called from dialog; setting closeOnClear true does not work (bug)

	var ret;
	
	// Set up references to DOM

		var $start = $('#event-start-date'),

		start_date = new Date($start.val()),

		$start_err = $('#event-start-date-error'),

		$end = $('#event-end-date'),

		end_date = new Date($end.val()),

		$end_err = $('#event-end-date-error');

	
	// Validate

		if ($start.val() === '') { // start not selected

			$start_err.html('Please enter start date');

			$start_err.css('display', 'block');

			$start.addClass('invalid');

			ret = false;
		}

	/* focus causes end datepicker to open, no time to resolve, skip for now
	else if (end === 'Invalid date') { // start selected, but not end

		$end.val(start); // set end date to start date

		$end.addClass('active');

		$end.trigger('focus');
	}
	*/
	
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

		app.controller.currentView().validateStartTime();

		app.controller.currentView().validateEndTime();

		//this.validateTimeRange();

	return ret;
}


/** Validates end time field
*
* @return {Boolean} true if validation is succesful, otherwise false
*/

app.EventView.prototype.validateEndTime = function() {

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


/** Validates start time field
*
* @return {Boolean} true if validation is succesful, otherwise false
 */

app.EventView.prototype.validateStartTime = function() {

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


/** Event handler for interactive validation of start and end time fields
*
* @return {Boolean} true if validation is succesful, otherwise false
 */

app.EventView.prototype.validateTimeRange = function() {

	if (this.close) {this.close()} // close picker (if called from dialog); setting closeOnClear true does not work (bug)
	
	var self = app.controller.currentView(); // reset this reference from picker to view


	var start_date = new Date($('#event-start-date').val()),

	end_date = new Date($('#event-end-date').val()),

	$start_time = $('#event-start-time'),

	start_time = $start_time.val(),

	$start_time_err = $('#event-start-time-error'),

	$end_time = $('#event-end-time'),

	end_time = $end_time.val(),

	$end_time_err = $('#event-end-time-error');

	

	if (self.validateStartTime()) { // start time entered

		if (self.validateEndTime()) { // end date and time entered

			if (end_date.valueOf() === start_date.valueOf()) { // start and end dates match
				
				// Set hours and minutes on start and end dates before comparison

				end_date.setHours(end_time.split(':')[0], end_time.split(':')[1]);

				start_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);

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


/*----------------------------------------------------------------------------------------
* Public static methods
*---------------------------------------------------------------------------------------*/

// none so far