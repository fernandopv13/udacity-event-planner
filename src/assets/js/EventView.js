'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventView Implements IViewable IObserver
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual events. Renders event in UI, and captures UI events on event.
*
* @constructor
*
* @author Ulrik H. Gade, January 2016
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
	

	/** Render event */
	
	this.render = function() {
		
		// this is where we render the form
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

	
	else if (event && event.target.validity.rangeUnderflow) { // negative number

		if (event.target.labels) { // Chrome (does not update display if setting with jQuery)

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

	this.close(); // close picker; setting closeOnClear true does not work (bug)

	
	// Set up references to DOM

		var $start = $('#event-start-date'),

		start = $start.val(),

		start_date = new Date(start),

		$start_err = $('#event-start-date-error'),

		$start_time = $('#event-start-time'),

		start_time = $start_time.val(),

		$start_time_err = $('#event-start-time-error'),

		$end = $('#event-end-date'),

		end = $end.val(),

		end_date = new Date(end),

		$end_err = $('#event-end-date-error'),

		$end_time = $('#event-end-time'),

		end_time = $end_time.val(),

		$end_time_err = $('#event-end-time-error');


	function reset () { // reset error states, needed b/c secondary branches in ifs

		$start_err.css('display', 'none');

		$start.removeClass('invalid');

		$end_err.css('display', 'none');

		$end.removeClass('invalid');

		$end_time_err.css('display', 'none');

		$end_time.removeClass('invalid');
	}

	console.log(start_date === 'Invalid Date');

	if (start === '') { // start not selected

		$start_err.html('Please select start date');

		$start_err.css('display', 'block');

		$start.addClass('invalid');

		return false;
	}

	/* focus causes end datepicker to open, no time to resolve, skip for now
	else if (end === '') { // start selected, but not end

		$end.val(start); // set end date to start date

		$end.addClass('active');

		$end.trigger('focus');
	}
	*/
	
	else if (start !== '' && end !== '' && end_date < start_date) { // end date is before start

		// Materialize's validation message won't display, so rolling my own

		$end_err.html('End date cannot be before start date');

		$end_err.css('display', 'block');

		$end.addClass('invalid');

		return false;
	}

	else if (end_date.valueOf() === start_date.valueOf() && end_time !== '' && start_time !== '') { // end and start time exist, and event stops and starts the same day

		//set hours and minutes on start and end dates

		end_date.setHours(end_time.split(':')[0], end_time.split(':')[1]);

		start_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);

		if (end_date < start_date) { // end (time) is before start (time)

			$end_time_err.html('End time cannot be before start time');

			$end_time_err.css('display', 'block');

			$end_time.addClass('invalid');

			return false;
		}

		else {

			reset();
		}
	}

	else {

		reset();
	}

	return true;
}


/** Event handler for interactive validation of end date field */
/*
app.EventView.validateEndDate = function() {

	//this.close(); // close picker; setting closeOnClear true does not work (bug)

	var $start = $('#event-start-date'),

	start = $start.val(),

	$end = $('#event-end-date'),

	end = $end.val(),

	$err = $('#event-end-date-error');
	
	
	if (!isNaN(Date.parse(start))) { // end date exists

		if (new Date(end) < new Date(start)) { // end is before start

			// Materialize's validation message won't display, so rolling my own

			$err.html('End date cannot be before start date');

			$err.css('display', 'block');

			$end.addClass('invalid');

			return false;
		}

		else { // reset

			$err.css('display', 'none');

			$end.removeClass('invalid');
		}

	}

	else { // reset

		$err.css('display', 'none');

		$end.removeClass('invalid');
	}

	return true;
}
*/
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


/** Event handler for interactive validation of start date field */
/*
app.EventView.validateStartDate = function() {

	//this.close(); // close picker; setting closeOnClear true does not work (bug)

	var $start = $('#event-start-date'),

	start = $start.val(),

	end = $('#event-end-date').val(),

	$err = $('#event-start-date-error');
	
	
	if (!isNaN(Date.parse(end))) { // end date exists

		if (new Date(start) > new Date(end)) { // start is after end

			// Materialize's validation message won't display, so rolling my own

			$err.html('Start date cannot be after end date');

			$err.css('display', 'block');

			$start.addClass('invalid');

			return false;
		}

		else { // reset

			$err.css('display', 'none');

			$start.removeClass('invalid');
		}

	}

	else if (start === '') { // empty

			$err.html('Please enter start date');

			$err.css('display', 'block');

			$start.addClass('invalid');

			return false;
	}

	else { // reset

		$err.css('display', 'none');

		$start.removeClass('invalid');
	}

	return true;
}
*/

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObserver, app.EventView);

void app.InterfaceHelper.mixInto(app.IViewable, app.EventView);