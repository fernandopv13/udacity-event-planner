'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventView Implements IObservable IObserver IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual events. Renders event in UI, and captures UI events on event.
*
* @constructor
*
* @implements IObservable IObserver IViewable
*
* @author Ulrik H. Gade, February 2016
*
* @todo Set end date to start date when initially selecting start date, supressing end datepicker
*
* @todo Add unit testing of rendering in browser
*
* @todo Verify geolocation and remove mock
*/

app.EventView = function(Event_event) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _implements = [app.IObservable, app.IObserver, app.IViewable]; // list of interfaces implemented by this class (by function reference);

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	// none so far
	

	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	// none so far


	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	

	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	/** Cancels entries in, and navigation to, event form
	*
	* @todo Everything(!)
	*/

	app.EventView.prototype.cancel = function() {

		// do something!
	}


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
	

	/** Notifies observers that form has been updated (i.e. submitted).
	*
	* Overrides default method in IObservable.
	*
	* @param {Event} The Event passing data in the form onto the observers
	*
	* @return void
	 */

	app.EventView.prototype.notifyObservers = function(IModelable_event, int_objId) {

		this.observers.forEach(function(observer) {

			observer.update(IModelable_event, int_objId);
		});
	};


	/** (Re)renders event to form in UI
	*
	* @param {Event} The event from which to present data in the form
	*
	* @return void
	*
	* @todo Get character counter to work on description field
	 */
	
	app.EventView.prototype.render = function(Event_event) {

		var event = Event_event, formElement, containerDiv, innerDiv, outerDiv, labelElement, buttonElement, iconElement;

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
			

			// Add hidden event id field

			containerDiv.appendChild(this.createElement({

				element: 'input',

				attributes: {id: 'event-id', type: 'hidden', value: Event_event.id()}
			}))

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
						
						value: event.name() ? event.name() : '',
						
						required: true
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-name', required: true},
					
					classList: event.name() ? ['form-label', 'active'] : ['form-label'],
					
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
							
							value: event.start() ? event.start().toLocaleDateString() : '',
							
							readonly: true,
							
							required: true
						},
						
						classList: ['validate', 'datepicker', 'picker__input']
					}));
					
					
					labelElement = this.createElement( // label
					{	
						element: 'label',			
						
						attributes: {for: 'event-start-date'},
						
						classList: event.start() ? ['form-label', 'active'] : ['form-label'],
						
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
							
							value: event.start() ? event.start().toLocaleTimeString() : '',
							
							readonly: true
						},
						
						classList: ['timepicker', 'picker__input']
					}));
									
					
					innerDiv.appendChild(this.createElement( // label
					{	
						element: 'label',			
						
						attributes: {for: 'event-start-time'},
						
						classList: event.start() ? ['form-label', 'active'] : ['form-label'],
						
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
							
							value: event.end() ? event.end().toLocaleDateString() : '',
							
							readonly: true
						},
						
						classList: ['datepicker', 'picker__input']
					}));
					
					
					innerDiv.appendChild(this.createElement( // label
					{	
						element: 'label',			
						
						attributes: {for: 'event-end-date'},
						
						classList: event.end() ? ['form-label', 'active'] : ['form-label'],
						
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
							
							value: event.end() ? event.end().toLocaleTimeString() : '',
							
							readonly: true
						},
						
						classList: ['timepicker', 'picker__input']
					}));
					
					
					innerDiv.appendChild(this.createElement( // label
					{	
						element: 'label',			
						
						attributes: {for: 'event-end-time'},
						
						classList: event.end() ? ['form-label', 'active'] : ['form-label'],
						
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
						
						value: event.capacity() ? event.capacity() : '',
						
						required: true
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-capacity'},
					
					classList: typeof event.capacity() === 'number' ? ['form-label', 'active'] : ['form-label'],
					
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
						
						value: event.host() && event.host().name()? event.host().name() : '',
					},
					
					classList: ['validate']
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-host'},
					
					classList: event.host() && event.host().name() ? ['form-label', 'active'] : ['form-label'],
					
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
					element: 'textarea',			
					
					attributes:
					{
						id: 'event-description',
						
						value: event.description() ? event.description() : '',
						
						length: 120,
						
						maxlength: 120
					},
					
					classList: ['materialize-textarea']
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
					
					classList: ['waves-effect', 'waves-teal', 'btn-flat'],

					innerHTML: 'Cancel'
				}));
				
				
				buttonElement =  this.createElement({ // submit button
					
					element: 'a',
					
					attributes: {id: 'event-form-submit'},
					
					classList: ['waves-effect', 'waves-light', 'btn'],

					innerHTML: 'Done'
				});
				
				
				buttonElement.appendChild(this.createElement({ // 'send' icon
					
					element: 'i',
					
					classList: ['material-icons', 'right'],
					
					innerHTML: 'send'
				}));
				
				
				outerDiv.appendChild(buttonElement);

				containerDiv.appendChild(outerDiv);

			
			// Update DOM

				var $formDiv = $('#event-form');

				$formDiv.empty();

				$formDiv.append(formElement);


			// (Re)assign event handlers to form elements

				$('textarea#description').characterCounter();

				$('.datepicker').pickadate({
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

				
				$('#event-name').keyup(this.validateName);

				$('#event-capacity').keyup(this.validateCapacity);

				$('#event-form-submit').click(function() {this.submit();}.bind(this));
		}

		else { // present default message

			var $formDiv = $('#event-form');

			$formDiv.empty();

			$formDiv.append(this.createElement(
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

	app.EventView.prototype.submit = function() {

		// Event handler binds to this, so reference works here
		
		if (this.validateName() && // Submit results if all validations pass

			this.validateDateRange() &&

			this.validateTimeRange() &&

			this.validateCapacity()) { 

			// Nofity observers by passing them a new Event with the data from the form

			this.notifyObservers(
				
				new app.Event(

					$('#event-name').val(),

					$('#event-type').val(),

					function() { // start date

						var start_date = $('#event-start-date').val();

						var start_time = $('#event-start-time').val();

						if (start_date !== '') {

							start_date = new Date(start_date);

							if (start_time !== '') {

								start_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);
							}

							return start_date;
						}

						return undefined;
					}(),

					function() { // end date

						var end_date = $('#event-end-date').val();

						var end_time = $('#event-end-time').val();

						if (end_date !== '') {

							end_date = new Date(end_date);

							if (end_time !== '') {

								end_date.setHours(end_time.split(':')[0], end_time.split(':')[1]);
							}

							return end_date;
						}

						return undefined;
					}(),

					$('#event-location').val(),

					$('#event-description').val(),

					function() { // host (hack)

						new app.Organization($('#event-host').val())
					}(),

					parseInt($('#event-capacity').val())
				),
				
				parseInt($('#event-id').val())
			);
			
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


	/** Updates event presentation when notified by controller of change */
	
	app.EventView.prototype.update = function(IModelable_event) {
		
		this.render(IModelable_event);
	};
	

	/* Event handler for interactive validation of capacity field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	app.EventView.prototype.validateCapacity = function(event) {
		
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


	/** Event handler for interactive validation of start and end date fields
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	
	app.EventView.prototype.validateDateRange = function() {

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

		// Cascade validation to start/end times

			 // 'this' refers to date picker here, not eventview, so invoke method using full path
			
			app.EventView.prototype.validateTimeRange();

		return true;
	}


	/* Event handler for interactive validation of event name field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	
	app.EventView.prototype.validateName = function(event) {

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


	/** Event handler for interactive validation of start and end time fields
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	 */

	app.EventView.prototype.validateTimeRange = function() {

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

		return true;
	}


	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// None so far
	
};


/*----------------------------------------------------------------------------------------
* Public static methods
*---------------------------------------------------------------------------------------*/

// none so far

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObservable, app.EventView);

void app.InterfaceHelper.mixInto(app.IObserver, app.EventView);

void app.InterfaceHelper.mixInto(app.IViewable, app.EventView);