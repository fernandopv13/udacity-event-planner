'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PersonView Implements IObservable IObserver IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual persons. Renders person in UI, and captures UI events on person.
*
* @constructor
*
* @implements IObservable IObserver IViewable
*
* @author Ulrik H. Gade, February 2016
*
* @todo 
*/

app.PersonView = function(Person_person) {

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
	
	/** Cancels entries in, and navigation to, person form
	*
	* @todo Everything(!)
	*/

	app.PersonView.prototype.cancel = function() {

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
	* @param {Person} The Person passing data in the form onto the observers
	*
	* @return void
	 */

	/*
	app.PersonView.prototype.notifyObservers = function(IModelable_person, int_objId) {

		this.observers.forEach(function(observer) {

			observer.update(IModelable_person, int_objId);
		});
	};
	*/

	/** (Re)renders person to form in UI
	*
	* @param {Person} The person from which to present data in the form
	*
	* @return void
	*
	* @todo Get character counter to work on description field
	 */
	
	app.PersonView.prototype.render = function(Person_person) {

		var person = Person_person, formElement, containerDiv, innerDiv, outerDiv, labelElement, buttonElement, iconElement;

		if (person !== null) {
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
			

			// Add hidden person id field

			containerDiv.appendChild(this.createElement({

				element: 'input',

				attributes: {id: 'person-id', type: 'hidden', value: Person_person.id()}
			}))

			// Add person name field

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
						
						id: 'person-name',
						
						value: person.name() ? person.name() : '',
						
						required: true
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'person-name', required: true},
					
					classList: person.name() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter person name'},
					
					innerHTML: 'Person Name'
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
						
						id: 'person-location',
						
						value: person.location() ? person.location() : '',
						
						list: 'suggested-locations'
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'person-location'},
					
					classList: person.location() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter person location'},
					
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
							
							id: 'person-start-date',
							
							value: person.start() ? person.start().toLocaleDateString() : '',
							
							readonly: true,
							
							required: true
						},
						
						classList: ['validate', 'datepicker', 'picker__input']
					}));
					
					
					labelElement = this.createElement( // label
					{	
						element: 'label',			
						
						attributes: {for: 'person-start-date'},
						
						classList: person.start() ? ['form-label', 'active'] : ['form-label'],
						
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
						
						attributes: {id: 'person-start-date-error'},
						
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
							
							id: 'person-start-time',
							
							value: person.start() ? person.start().toLocaleTimeString() : '',
							
							readonly: true
						},
						
						classList: ['timepicker', 'picker__input']
					}));
									
					
					innerDiv.appendChild(this.createElement( // label
					{	
						element: 'label',			
						
						attributes: {for: 'person-start-time'},
						
						classList: person.start() ? ['form-label', 'active'] : ['form-label'],
						
						dataset: {error: 'Please enter start time'},
						
						innerHTML: 'Start Time'
					}));
					
					
					innerDiv.appendChild(this.createElement( // custom error div
					{	
						element: 'div',			
						
						attributes: {id: 'person-start-time-error'},
						
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
							
							id: 'person-end-date',
							
							value: person.end() ? person.end().toLocaleDateString() : '',
							
							readonly: true
						},
						
						classList: ['datepicker', 'picker__input']
					}));
					
					
					innerDiv.appendChild(this.createElement( // label
					{	
						element: 'label',			
						
						attributes: {for: 'person-end-date'},
						
						classList: person.end() ? ['form-label', 'active'] : ['form-label'],
						
						dataset: {error: 'Please enter end date'},
						
						innerHTML: 'End Date'
					}));
					
					
					innerDiv.appendChild(this.createElement( // custom error div
					{	
						element: 'div',			
						
						attributes: {id: 'person-end-date-error'},
						
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
							
							id: 'person-end-time',
							
							value: person.end() ? person.end().toLocaleTimeString() : '',
							
							readonly: true
						},
						
						classList: ['timepicker', 'picker__input']
					}));
					
					
					innerDiv.appendChild(this.createElement( // label
					{	
						element: 'label',			
						
						attributes: {for: 'person-end-time'},
						
						classList: person.end() ? ['form-label', 'active'] : ['form-label'],
						
						dataset: {error: 'Please enter end time'},
						
						innerHTML: 'End Time'
					}));
					
					
					innerDiv.appendChild(this.createElement( // custom error div
					{	
						element: 'div',			
						
						attributes: {id: 'person-end-time-error'},
						
						classList: ['custom-validate']
					}));
					
					
					outerDiv.appendChild(innerDiv);


					containerDiv.appendChild(outerDiv);


			// Add person type field

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
						
						id: 'person-type',
						
						value: person.type() ? person.type() : '',
						
						list: 'person-types'
					}
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'person-type'},
					
					classList: person.type() ? ['form-label', 'active'] : ['form-label'],
					
					dataset: {error: 'Please enter person type'},
					
					innerHTML: 'Person Type'
				}));
				
				
				innerDiv.appendChild(this.createElement( // data list
				{	
					element: 'datalist',			
					
					attributes: {id: 'person-types'}
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
						
						id: 'person-capacity',
						
						min: 0,
						
						step: 1,
						
						value: person.capacity() ? person.capacity() : '',
						
						required: true
					},
					
					classList: ['validate']
				}));
				
				
				labelElement = this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'person-capacity'},
					
					classList: typeof person.capacity() === 'number' ? ['form-label', 'active'] : ['form-label'],
					
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
						
						id: 'person-host',
						
						value: person.host() && person.host().name()? person.host().name() : '',
					},
					
					classList: ['validate']
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'person-host'},
					
					classList: person.host() && person.host().name() ? ['form-label', 'active'] : ['form-label'],
					
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
						id: 'person-description',
						
						value: person.description() ? person.description() : '',
						
						length: 120,
						
						maxlength: 120
					},
					
					classList: ['materialize-textarea']
				}));
				
				
				innerDiv.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes:	{for: 'person-description'},
					
					classList: person.description() ? ['form-label', 'active'] : ['form-label'],
					
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
					
					attributes: {id: 'person-form-cancel'},
					
					classList: ['waves-effect', 'waves-teal', 'btn-flat'],

					innerHTML: 'Cancel'
				}));
				
				
				buttonElement =  this.createElement({ // submit button
					
					element: 'a',
					
					attributes: {id: 'person-form-submit'},
					
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

				var $formDiv = $('#person-form');

				$formDiv.empty();

				$formDiv.append(formElement);


			// (Re)assign person handlers to form elements

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

				
				$('#person-location').focus(this.suggestLocations);

				
				$('#person-name').keyup(this.validateName);

				$('#person-capacity').keyup(this.validateCapacity);

				$('#person-form-submit').click(function() {this.submit();}.bind(this));
		}

		else { // present default message

			var $formDiv = $('#person-form');

			$formDiv.empty();

			$formDiv.append(this.createElement(
			{

				element: 'p',

				innerHTML: 'No person selected. Please select or create an person in order to edit details.'
			}));
		}
	};


	/** Submits person form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*
	* @todo Fix host hack
	*/

	app.PersonView.prototype.submit = function() {

		// Person handler binds to this, so reference works here
		
		if (this.validateName() && // Submit results if all validations pass

			this.validateDateRange() &&

			this.validateTimeRange() &&

			this.validateCapacity()) { 

			// Nofity observers by passing them a new Person with the data from the form

			this.notifyObservers(
				
				parseInt($('#person-id').val()),

				new app.Person(

					$('#person-name').val(),

					$('#person-type').val(),

					function() { // start date

						var start_date = $('#person-start-date').val();

						var start_time = $('#person-start-time').val();

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

						var end_date = $('#person-end-date').val();

						var end_time = $('#person-end-time').val();

						if (end_date !== '') {

							end_date = new Date(end_date);

							if (end_time !== '') {

								end_date.setHours(end_time.split(':')[0], end_time.split(':')[1]);
							}

							return end_date;
						}

						return undefined;
					}(),

					$('#person-location').val(),

					$('#person-description').val(),

					function() { // host (hack)

						new app.Organization($('#person-host').val())
					}(),

					parseInt($('#person-capacity').val())
				)
			);
			
			return true;
		}

		return false;
	}


	/** Suggests venues for person based on device's location (if available)
	*
	* @return {void} Directly updates location datalist in the DOM
	*
	* @todo Add address info to venue display
	*/

	app.PersonView.prototype.suggestLocations = function() {

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


	/** Updates person presentation when notified by controller of change */
	
	app.PersonView.prototype.update = function(IModelable_person) {
		
		this.render(IModelable_person);
	};
	

	/* Person handler for interactive validation of capacity field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/

	app.PersonView.prototype.validateCapacity = function(person) {
		
		var $capacity = $('#person-capacity');

		if ($capacity.val() === '') { // empty

			if (person && person.target.labels) { // Chrome (does not update display if setting with jQuery)

				person.target.labels[0].dataset.error = 'Please enter capacity';

			}

			else { // Other browsers (updated value may not display, falls back on value in HTML)

				$capacity.next('label').data('error', 'Please enter capacity');
			}
			
			$capacity.addClass('invalid');

			return false;
		}


		// no need to test for non-numbers, not programmatically available from input

		
		else if ($capacity.val() < 0) { // negative number

			if (person && person.target.labels) { // Chrome (does not update display if setting with jQuery)

				person.target.labels[0].dataset.error = 'Capacity cannot be negative';
			}

			else { // Other browsers (updates value but not display, falls back on value in HTML)

				$capacity.next('label').data('error', 'Capacity cannot be negative');
			}
			
			$capacity.addClass('invalid');

			return false;
		}
		
		else { // valid

			$capacity.removeClass('invalid');

			if (person && person.target.labels) { // Chrome (does not update display if setting with jQuery)

				person.target.labels[0].dataset.error = 'Please enter capacity'; // can't get jQuery.data() to work
			}

			else { // Other browsers (updates value but not display, falls back on value in HTML)

				$capacity.next('label').data('error', 'Please enter capacity');
			}
		}

		return true;
	}


	/** Person handler for interactive validation of start and end date fields
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	
	app.PersonView.prototype.validateDateRange = function() {

		if (this.close) {this.close()} // close picker if called from dialog; setting closeOnClear true does not work (bug)

		
		// Set up references to DOM

			var $start = $('#person-start-date'),

			start_date = new Date($start.val()),

			$start_err = $('#person-start-date-error'),

			$end = $('#person-end-date'),

			end_date = new Date($end.val()),

			$end_err = $('#person-end-date-error');

		
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

			 // 'this' refers to date picker here, not personview, so invoke method using full path
			
			app.PersonView.prototype.validateTimeRange();

		return true;
	}


	/* Person handler for interactive validation of person name field
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	*/
	
	app.PersonView.prototype.validateName = function(person) {

		var $name = $('#person-name');

		if ($name.val() === '') { // empty
		
			if (person && person.target.labels) { // Chrome (does not update display if setting with jQuery)

				person.target.labels[0].dataset.error = 'Please enter person name';
			}

			else { // Other browsers (updated value may not display, falls back on value in HTML)

				$name.next('label').data('error', 'Please enter person name');
			}

			$name.addClass('invalid');

			return false;
		}

		else {

			$name.removeClass('invalid');
		}

		return true;
	}


	/** Person handler for interactive validation of start and end time fields
	*
	* @return {Boolean} true if validation is succesful, otherwise false
	 */

	app.PersonView.prototype.validateTimeRange = function() {

		if (this.close) {this.close()} // close picker (if called from dialog); setting closeOnClear true does not work (bug)


		// Set up references to DOM

		var start_date = new Date($('#person-start-date').val()),

		end_date = new Date($('#person-end-date').val()),

		start_time = $('#person-start-time').val(),

		$end_time = $('#person-end-time'),

		end_time = $end_time.val(),

		$end_time_err = $('#person-end-time-error');

		
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
		
	// none so far
	
};


/*----------------------------------------------------------------------------------------
* Public static methods
*---------------------------------------------------------------------------------------*/

// none so far

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObservable, app.PersonView);

void app.InterfaceHelper.mixInto(app.IObserver, app.PersonView);

void app.InterfaceHelper.mixInto(app.IViewable, app.PersonView);