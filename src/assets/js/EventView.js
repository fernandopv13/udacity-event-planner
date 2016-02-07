'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventView Implements IViewable IObserver
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual events. Renders event in UI, and captures UI events on event.
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*
* @todo Set end date to start date when initially selecting start date, supressing end datepicker
*
* @todo Add unit testing of rendering in browser
*
* @todo Verify geolocation and remove mock
*/

app.EventView = function() {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _event, // (Event) The event in the data model this EventView is observing
	
	_implements = [app.IViewable, app.IObserver]; // list of interfaces implemented by this class (by function reference);

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets and sets the event */

	this.event = function(Event_event) {

		if(Event_event) {

			if (Event_event.constructor === app.Event) {

				_event = Event_event;
			}

			else {

				throw new IllegalArgumentError('Event must be instance of Event');
			}
		}

		return _event;
	}
	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	// none so far

	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// none so far
	
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
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
	

	/** Respond to tap/click on event in events list */
	
	app.EventView.prototype.onclick = function(int_eventId) {
		
		app.controller.onEventSelected(int_eventId);
	};
	

	/** Render event to form */
	
	this.render = function() {
		
		var formElement, containerDiv, innerDiv, outerDiv, labelElement, buttonElement, iconElement;

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
		

		// Add event name field

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
					
					id: 'event-name',
					
					value: _event.name() ? _event.name() : '',
					
					required: true
				},
				
				classList: ['validate']
			}));
			
			
			labelElement = this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-name', required: true},
				
				classList: ['active', 'form-label'],
				
				dataset: {error: 'Please enter event name'},
				
				innerHTML: 'Event Name'
			});
			
			labelElement.appendChild(this.createElement( // required field indicator
			{
				element: 'span',

				classList: ['required-indicator'],

				innerHTML: '*'
			}));
			
			innerDiv.appendChild(labelElement);


			outerDiv =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
			
			outerDiv.appendChild(innerDiv);
			
			containerDiv.appendChild(outerDiv);
			
		
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
					
					value: _event.location() ? _event.location() : '',
					
					list: 'suggested-locations'
				}
			}));
			
			
			innerDiv.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-location'},
				
				classList: ['form-label'],
				
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
			
			
			// Date

				innerDiv =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's6']
				});
				
				
				innerDiv.appendChild(this.createElement( // input
				{
					element: 'input',			
					
					attributes:
					{
						type: 'text',
						
						id: 'event-start-date',
						
						value: _event.start() ? _event.start().toLocaleDateString() : '',
						
						readonly: true,
						
						required: true
					},
					
					classList: ['datepicker', 'picker__input']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-start-date'},
					
					classList: ['form-label'],
					
					dataset: {error: 'Please enter start date'},
					
					innerHTML: 'Start Date'
				});

				
				labelElement.appendChild(this.createElement( // required field indicator
				{
					element: 'span',

					classList: ['required-indicator'],

					innerHTML: '*'
				}));
				
				innerDiv.appendChild(labelElement);
				
				
				innerDiv.appendChild(this.createElement( // custom error div
				{	
					element: 'div',			
					
					attributes: {id: 'event-start-date-error'},
					
					classList: ['custom-validate']
				}));
				
				outerDiv.appendChild(innerDiv);
				
				
			// Time

				innerDiv =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's6']
				});
				
				
				innerDiv.appendChild(this.createElement( // input
				{
					element: 'input',			
					
					attributes:
					{
						type: 'text',
						
						id: 'event-start-time',
						
						value: _event.start() ? _event.start().toLocaleTimeString() : '',
						
						readonly: true
					},
					
					classList: ['timepicker', 'picker__input']
				}));
								
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-start-time'},
					
					classList: ['form-label'],
					
					dataset: {error: 'Please enter start time'},
					
					innerHTML: 'Start Time'
				}));
				
				
				innerDiv.appendChild(this.createElement( // custom error div
				{	
					element: 'div',			
					
					attributes: {id: 'event-start-time-error'},
					
					classList:['custom-validate']
				}));
				
				
				outerDiv.appendChild(innerDiv);
				
				
				containerDiv.appendChild(outerDiv); // Add to container


		// Add end date and time field

			outerDiv =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
				
				// Date

				innerDiv =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's6']
				});
				
				
				innerDiv.appendChild(this.createElement( // input
				{
					element: 'input',			
					
					attributes:
					{
						type: 'text',
						
						id: 'event-end-date',
						
						value: _event.end() ? _event.end().toLocaleDateString() : '',
						
						readonly: true
					},
					
					classList: ['datepicker', 'picker__input']
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-end-date'},
					
					classList: ['form-label'],
					
					dataset: {error: 'Please enter end date'},
					
					innerHTML: 'End Date'
				}));
				
				
				innerDiv.appendChild(this.createElement( // custom error div
				{	
					element: 'div',			
					
					attributes: {id: 'event-end-date-error'},
					
					classList: ['custom-validate']
				}));
				
				
				outerDiv.appendChild(innerDiv);


			// Time
				
				innerDiv =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field','col', 's6']
				});
				
				
				innerDiv.appendChild(this.createElement( // input
				{
					element: 'input',			
					
					attributes:
					{
						type: 'text',
						
						id: 'event-end-time',
						
						value: _event.end() ? _event.end().toLocaleTimeString() : '',
						
						readonly: true
					},
					
					classList: ['timepicker', 'picker__input']
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-end-time'},
					
					classList: ['form-label'],
					
					dataset: {error: 'Please enter end time'},
					
					innerHTML: 'End Time'
				}));
				
				
				innerDiv.appendChild(this.createElement( // custom error div
				{	
					element: 'div',			
					
					attributes: {id: 'event-end-time-error'},
					
					classList: ['custom-validate']
				}));
				
				
				outerDiv.appendChild(innerDiv);


				containerDiv.appendChild(outerDiv);


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
					
					value: _event.type() ? _event.type() : '',
					
					list: 'event-types'
				}
			}));
			
			
			innerDiv.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-type'},
				
				classList: ['active','form-label'],
				
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
					type: 'number',
					
					id: 'event-capacity',
					
					min: 0,
					
					step: 1,
					
					value: _event.capacity() ? _event.capacity() : '',
					
					required: true
				},
				
				classList: ['validate']
			}));
			
			labelElement = this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-capacity'},
				
				classList: ['form-label'],
				
				dataset: {error: 'Please enter capacity'},
				
				innerHTML: 'Capacity'
			});
			
			labelElement.appendChild(this.createElement( // required field indicator
			{
				element: 'span',

				classList: ['required-indicator'],

				innerHTML: '*'
			}));
			
			innerDiv.appendChild(labelElement);

			
			outerDiv =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
						
			outerDiv.appendChild(innerDiv);
			
			containerDiv.appendChild(outerDiv);


		// Add host field

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
					
					id: 'event-host',
					
					value: _event.host() ? _event.host().name() : '',
				},
				
				classList: ['validate']
			}));
			
			
			innerDiv.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-host'},
				
				classList: ['form-label'],
				
				dataset: {error: 'Please enter host'},
				
				innerHTML: 'Host'
			}));
			
			
			outerDiv =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
						
			
			outerDiv.appendChild(innerDiv);
			
			containerDiv.appendChild(outerDiv);

		// Add description field

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
					type: 'textarea',
					
					id: 'event-description',
					
					value: _event.description() ? _event.description() : '',
					
					length: 120,
					
					maxlength: 120
				},
				
				classList: ['materialize-textarea']
			}));
			
			
			innerDiv.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes:	{for: 'event-description'},
				
				classList: ['form-label'],
				
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

			outerDiv =  this.createElement( // outer div
			{
				element: 'div',			
				
				classList: ['row']
			});
			
			outerDiv.appendChild(this.createElement({
			
				element: 'p',
				
				classList: ['required-indicator'],
					
				innerHTML: '* indicates a required field'
			}));
			
			
			containerDiv.appendChild(outerDiv);

		
		// Add submit and cancel buttons

			outerDiv =  this.createElement( // outer div
			{
				element: 'div',			
				
				classList: ['row', 'form-submit']
			});
			
			
			outerDiv.appendChild(this.createElement({ // cancel button
				
				element: 'a',
				
				attributes: {id: 'event-form-cancel'},
				
				classList: ['waves-effect', 'waves-teal', 'btn-flat']
			}));
			
			
			buttonElement =  this.createElement({ // submit button
				
				element: 'a',
				
				attributes: {id: 'event-form-submit'},
				
				classList: ['waves-effect', 'waves-light', 'btn']
			});
			
			
			buttonElement.appendChild(this.createElement({ // 'send' icon
				
				element: 'i',
				
				classList: ['material-icons', 'right'],
				
				innerHTML: 'send'
			}));
			
			
			outerDiv.appendChild(buttonElement);

			containerDiv.appendChild(outerDiv);


		return formElement;
	};


	/** Update event presentation when model has changed */
	
	app.EventView.prototype.update = function() {
		
		this.render();
	};
	
	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// None so far
	
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Renders collection of events in account to list in UI
*
* Static method because no single instance has knowledge of the full collection.
*
* @param {Account} Account The currently selected Account
 */

app.EventView.renderList = function(Account_account) {
	
	function renderListItem(Event_event) {

		var listElmnt = document.createElement('li');
		
		listElmnt.classList.add('collection-item');
		
		listElmnt.id = 'event-list-id-' + Event_event.id();
		
		
		var divElmnt = document.createElement('div');
		
		divElmnt.innerHTML = (Event_event.name() ? Event_event.name() : 'Unnamed event') + ' (' + Event_event.guests().length + ')';
		
		divElmnt.onclick = function(e) {app.controller.onEventSelected(Event_event.id());};
		
		
		var anchorElmnt = document.createElement('a');
		
		anchorElmnt.classList.add('secondary-content');

		anchorElmnt.href = '#!';
		
		
		var iconElement = document.createElement('i');
		
		iconElement.classList.add('material-icons');
		
		iconElement.innerHTML = 'chevron_right';

		
		listElmnt.appendChild(divElmnt);
		
		divElmnt.appendChild(anchorElmnt);
		
		anchorElmnt.appendChild(iconElement);
		
		
		return listElmnt;
	}

	
	var ULElmnt = document.createElement('ul'); // generate list
	
	ULElmnt.classList.add('collection');

	ULElmnt.classList.add('with-header');


	var headerElmnt = document.createElement('h4'); // generate header

	headerElmnt.classList.add('collection-header');

	headerElmnt.innerHTML = 'My Events';

	ULElmnt.appendChild(headerElmnt);

	
	var events = Account_account.events() // generate list items
	
	for (var prop in events) {

		ULElmnt.appendChild(renderListItem(events[prop]));
	}

	
	var $list = $('#event-list'); // update DOM

	$list.empty();

	$list.append(ULElmnt);
};


/*----------------------------------------------------------------------------------------
* Public static methods
*---------------------------------------------------------------------------------------*/

app.EventView.suggestLocations = function() {

	var account = app.controller.selectedAccount(),

	position = account.defaultLocation(); // set default


	// Get device's current location if available and allowed

	if (account.geolocationAllowed()) { // user has granted permission to use geolocation

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

					optionElmnt.value = venue.name;

					$listElmnt.append(optionElmnt);

				});
			}

		}, position);	
	}
	
	// else don't provide suggestions
}

/* Event handler for interactive validation of capacity field */

app.EventView.validateCapacity = function(event) {
	
	var $capacity = $('#event-capacity');

	if ($capacity.val() === '') { // empty

		if (event && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = 'Please enter capacity';

		}

		else { // Other browsers (updated value may not display, falls back on value in HTML)

			$capacity.next('label').data('error', 'Please enter capacity');
		}
		
		$capacity.addClass('invalid');

		return false;
	}


	// no need to test for non-numbers, not programmatically available from input

	
	else if ($capacity.val() < 0) { // negative number

		if (event && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = 'Capacity cannot be negative';
		}

		else { // Other browsers (updates value but not display, falls back on value in HTML)

			$capacity.next('label').data('error', 'Capacity cannot be negative');
		}
		
		$capacity.addClass('invalid');

		return false;
	}
	
	else { // valid

		$capacity.removeClass('invalid');

		if (event && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = 'Please enter capacity'; // can't get jQuery.data() to work
		}

		else { // Other browsers (updates value but not display, falls back on value in HTML)

			$capacity.next('label').data('error', 'Please enter capacity');
		}
	}

	return true;
}


/** Event handler for interactive validation of start and end date fields */

app.EventView.validateDateRange = function() {

	if (this.close) {this.close()} // close picker if called from dialog; setting closeOnClear true does not work (bug)

	
	// Set up references to DOM

	var $start = $('#event-start-date'),

	start_date = new Date($start.val()),

	$start_err = $('#event-start-date-error'),

	$end = $('#event-end-date'),

	end_date = new Date($end.val()),

	$end_err = $('#event-end-date-error');

	
	// Validate

	if ($start.val() === '') { // start not selected

		$start_err.html('Please select start date');

		$start_err.css('display', 'block');

		$start.addClass('invalid');

		return false;
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

		$end_err.html('End date cannot be before start date');

		$end_err.css('display', 'block');

		$end.addClass('invalid');

		return false;
	}

	else {

		$start_err.css('display', 'none');

		$start.removeClass('invalid');

		$end_err.css('display', 'none');

		$end.removeClass('invalid');
	}

	app.EventView.validateTimeRange();	

	return true;
}

/* Event handler for interactive validation of event name field */

app.EventView.validateName = function(event) {

	var $name = $('#event-name');

	if ($name.val() === '') { // empty
	
		if (event && event.target.labels) { // Chrome (does not update display if setting with jQuery)

			event.target.labels[0].dataset.error = 'Please enter event name';
		}

		else { // Other browsers (updated value may not display, falls back on value in HTML)

			$name.next('label').data('error', 'Please enter event name');
		}

		$name.addClass('invalid');

		return false;
	}

	else {

		$name.removeClass('invalid');
	}

	return true;
}


/** Event handler for interactive validation of end time field*/

app.EventView.validateTimeRange = function() {

	if (this.close) {this.close()} // close picker (if called from dialog); setting closeOnClear true does not work (bug)


	// Set up references to DOM

	var start_date = new Date($('#event-start-date').val()),

	end_date = new Date($('#event-end-date').val()),

	start_time = $('#event-start-time').val(),

	$end_time = $('#event-end-time'),

	end_time = $end_time.val(),

	$end_time_err = $('#event-end-time-error');

	
	if (end_time !== '' && 	start_time !== '' && // end and start time selected
		!isNaN(end_date.valueOf()) && // end date selected
		 end_date.valueOf() === start_date.valueOf()) {  //end date same as start date
		
		// Set hours and minutes on start and end dates before comparison

		end_date.setHours(end_time.split(':')[0], end_time.split(':')[1]);

		start_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);

		console.log(end_date < start_date);
		
		if (end_date < start_date) { // end (time) is before start (time)

			$end_time_err.html('End time cannot be before start time');

			$end_time_err.css('display', 'block');

			$end_time.addClass('invalid');

			return false;
		}

		else {

			$end_time_err.css('display', 'none');

			$end_time.removeClass('invalid');
		}
	}

	else {

		$end_time_err.css('display', 'none');

		$end_time.removeClass('invalid');
	}
}


app.EventView.submit = function() {

	var valid = app.EventView.validateName() +

				app.EventView.validateDateRange() +

				app.EventView.validateTimeRange() + 

				app.EventView.validateCapacity();

	if (valid) {

		// call controller
	}
}

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObserver, app.EventView);

void app.InterfaceHelper.mixInto(app.IViewable, app.EventView);