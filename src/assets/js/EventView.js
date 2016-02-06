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

	// none so far

	
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
		
		var formElmt, containerElmnt, rowElmnt, rwElment, datalistElmnt, optionElmnt, elmnt;

		function createRow(arr_classList) { // row div factory

			var rowElmnt = document.createElement('div');

			arr_classList.forEach(function(str_class) {rowElmnt.classList.add(str_class);});

			return rowElmnt;
		}


		function createInput(str_type, str_id, arr_classList, Boolean_required, str_list, Boolean_readonly) { // input factory

			var inputElmnt = document.createElement('input');

			inputElmnt.type = str_type;

			inputElmnt.id = str_id;

			arr_classList.forEach(function(str_class) {inputElmnt.classList.add(str_class);});

			if (Boolean_required) {inputElmnt.required = Boolean_required};

			if (str_list) {inputElmnt.list = str_list};

			if (Boolean_readonly) {inputElmnt.readonly = Boolean_readonly;}

			return inputElmnt;
		}


		function createLabel(str_label, str_for, arr_classList, str_error, Boolean_required) { // label factory

			function createRequiredIndicator() { // label asterisk factory

				var spanElmnt = document.createElement('span');

				spanElmnt.classList.add('required-indicator');

				spanElmnt.innerHTML = '*';

				return spanElmnt;
			}

			var labelElmnt = document.createElement('label');

			labelElmnt.innerHTML = str_label;

			labelElmnt.for = str_for;

			arr_classList.forEach(function(str_class) {labelElmnt.classList.add(str_class);});

			if (str_error) {labelElmnt.dataset.error = str_error;}

			if (Boolean_required) {labelElmnt.appendChild(createRequiredIndicator());}

			return labelElmnt;
		}

		function createCustomError(str_id) {

			var customErrElmnt = document.createElement('div');

			customErrElmnt.id = str_id;

			customErrElmnt.classList.add('custom-validate');

			return customErrElmnt;
		}
		
		
		// Setup up form and container div

			formElmt = document.createElement('form');

			formElmt.classList.add('col');

			formElmt.classList.add('s12');

			formElmt.novalidate = true; // not sure if this is read-only

			containerElmnt = document.createElement('div');

			containerElmnt.classList.add('row');

			formElmt.appendChild(containerElmnt);
		

		// Add event name field

			rowElmnt = createRow(['input-field', 'col', 's12']);

			rowElmnt.appendChild(createInput('text', 'event-name', ['validate']));

			rowElmnt.appendChild(createLabel('Event Name', 'event-name', ['active'], 'Please enter event name', true);

			containerElmnt.appendChild(rowElmnt);


		// Add location field

			rowElmnt = createRow(['input-field', 'col', 's12']);

			rowElmnt.appendChild(createInput('text', 'event-location', [] , false, 'suggested-locations'));

			rowElmnt.appendChild(createLabel('Location', 'event-location', [], 'Please enter event name', false);

			datalistElmnt = document.createElement('datalist');

			datalistElmnt.id = 'suggested-locations';

			rowElmnt.appendChild(datalistElmnt);

			containerElmnt.appendChild(createRow(['row']).appendChild(rowElmnt));


		// Add start date and time field

			// Date

				rowElmnt = createRow(['input-field', 'col', 's6']);

				rowElmnt.appendChild(createInput('text', 'event-start-date', ['datepicker', 'picker__input'] , true, '', true));

				rowElmnt.appendChild(createLabel('Start Date', 'event-start-date', [], 'Please enter start date', true);

				rowElmnt.appendChild(createCustomError('event-start-date-error'));

			// Time

				rwElmnt = createRow(['input-field', 'col', 's6']);

				rwElmnt.appendChild(createInput('text', 'event-start-time', ['timepicker', 'picker__input'] , false, '', true));

				rwElmnt.appendChild(createLabel('Start Time', 'event-start-time', [], 'Please enter start time', false);

				rwElmnt.appendChild(createCustomError('event-start-time-error'));
				
				

			// Add to container

				elmnt = createRow(['row']);

				elmnt.appendChild(rowElmnt);

				elmnt.appendChild(rwElmnt);

				containerElmnt.appendChild(elmnt);


		// Add end date and time field

			// Date

				rowElmnt = createRow(['input-field', 'col', 's6']);

				rowElmnt.appendChild(createInput('text', 'event-end-date', ['datepicker', 'picker__input'] , false, '', true));

				rowElmnt.appendChild(createLabel('End Date', 'event-end-date', [], 'End date cannot be before start date', false);

				rowElmnt.appendChild(createCustomError('event-end-date-error'));

			// Time

				rwElmnt = createRow(['input-field', 'col', 's6']);

				rwElmnt.appendChild(createInput('text', 'event-end-time', ['timepicker', 'picker__input'] , false, '', true));

				rwElmnt.appendChild(createLabel('End Time', 'event-end-time', [], 'Please enter end time', false);

				rwElmnt.appendChild(createCustomError('event-end-time-error'));
				
				

			// Add to container

				elmnt = createRow(['row']);

				elmnt.appendChild(rowElmnt);

				elmnt.appendChild(rwElmnt);

				containerElmnt.appendChild(elmnt);

	};


	/** Update event presentation when model has changed */
	
	app.EventView.prototype.update = function() {
		
		this.render();
	};
	
	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// If neeeded, we can simulate polymorphism here by testing named parameters in the
	// constructor's signature and/or by analysing the 'arguments' array-like collection of
	// parameters, and branching all or parts of the constructor logic accordingly.
	//
	//Probably most useful if kept relatively simple. Else maybe better to create new class.
	
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
		
		
		var iconElmnt = document.createElement('i');
		
		iconElmnt.classList.add('material-icons');
		
		iconElmnt.innerHTML = 'chevron_right';

		
		listElmnt.appendChild(divElmnt);
		
		divElmnt.appendChild(anchorElmnt);
		
		anchorElmnt.appendChild(iconElmnt);
		
		
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

	if (this.close) {this.close()}; // close picker if called from dialog; setting closeOnClear true does not work (bug)

	
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

	if (this.close) {this.close()}; // close picker (if called from dialog); setting closeOnClear true does not work (bug)


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