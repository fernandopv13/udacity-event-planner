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
		
		var formElmt, containerElmnt, rowElmnt, rwElmnt, datalistElmnt, optionElmnt, iconElmnt, elmnt, inputElmnt;

		/*
		function createElement(obj_specs) {
			
			var element = document.createElement(obj_specs.element);
						
			if (obj_specs.attributes) {
			
				for (var prop in obj_specs.attributes) {
					
					if (obj_specs.attributes[prop]) {
					
						element.setAttribute(prop, obj_specs.attributes[prop]);
					}
				}
			}
			
			if (obj_specs.classList) {
				
				obj_specs.classList.forEach(function(str_class) {
					
					element.classList.add(str_class);
				});
			}
			
			if (obj_specs.dataset) {
			
				for (var prop in obj_specs.dataset) {
					
					element.dataset[prop] = obj_specs.dataset[prop];
				}
			}
			
			if (obj_specs.innerHTML) {
				
				element.innerHTML = obj_specs.innerHTML;
			}
			
			if (obj_specs.element === 'label' && obj_specs.attributes && obj_specs.attributes.required) {
				
				var spanElmnt = document.createElement('span');
				
				spanElmnt.classList.add('required-indicator');
				
				spanElmnt.innerHTML = '*';
				
				element.appendChild(spanElmnt);
			}
			
			return element;
		}
		*/
		
		/*
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

			if (str_list) {inputElmnt.setAttribute('list', str_list);}

			if (Boolean_readonly) {inputElmnt.setAttribute('readonly', Boolean_readonly);}

			return inputElmnt;
		}

		function createRequiredIndicator() { // label asterisk factory

					var spanElmnt = document.createElement('span');

					spanElmnt.classList.add('required-indicator');

					spanElmnt.innerHTML = '*';

					return spanElmnt;
		}

		function createLabel(str_label, str_for, arr_classList, str_error, Boolean_required) { // label factory

			var labelElmnt = document.createElement('label');

			labelElmnt.innerHTML = str_label;

			labelElmnt.setAttribute('for', str_for);

			arr_classList.forEach(function(str_class) {labelElmnt.classList.add(str_class);});

			if (str_error) {labelElmnt.dataset.error = str_error;}

			if (Boolean_required) {labelElmnt.appendChild(createRequiredIndicator());}

			return labelElmnt;
		}

		function createCustomError(str_id) { // custom error div factory

			var customErrElmnt = document.createElement('div');

			customErrElmnt.id = str_id;

			customErrElmnt.classList.add('custom-validate');

			return customErrElmnt;
		}
		*/
		
		// Setup up form and container div

			formElmt =  this.createElement(
			{
				element: 'form',			
				
				attributes: {novalidate: true},
				
				classList: ['col', 's12']
			});
			
			//formElmt = document.createElement('form');

			//formElmt.classList.add('col');

			//formElmt.classList.add('s12');

			//formElmt.novalidate = true; // not sure if this is read-only

			containerElmnt =  this.createElement(
			{
				element: 'div',			
				
				classList: ['row']
			});
			
			
			//containerElmnt = document.createElement('div');

			//containerElmnt.classList.add('row');

			formElmt.appendChild(containerElmnt);
		

		// Add event name field

			rowElmnt =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', 's12']
			});
			
			
			rowElmnt.appendChild(this.createElement( // input
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
			
			
			rowElmnt.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-name', required: true},
				
				classList: ['active', 'form-label'],
				
				dataset: {error: 'Please enter event name'},
				
				innerHTML: 'Event Name'
			}));
			
			
			elmnt =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
			
						
			elmnt.appendChild(rowElmnt);
			
			containerElmnt.appendChild(elmnt);
			
			//rowElmnt = createRow(['input-field', 'col', 's12']);

			//elmnt = createInput('text', 'event-name', ['validate'], true);			
			
			//if (_event.name()) {elmnt.setAttribute('value', _event.name())};

			//rowElmnt.appendChild(createLabel('Event Name', 'event-name', ['form-label', 'active'], 'Please enter event name', true));

			//elmnt = create(['row']);
			
			
		
		// Add location field

			rowElmnt =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', 's12']
			});
			
			
			rowElmnt.appendChild(this.createElement( // input
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
			
			
			rowElmnt.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-location'},
				
				classList: ['form-label'],
				
				dataset: {error: 'Please enter event location'},
				
				innerHTML: 'Location'
			}));
			
			
			rowElmnt.appendChild(this.createElement( // data list
			{	
				element: 'datalist',			
				
				attributes: {id: 'suggested-locations'}
			}));
			
			
			elmnt =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
						
			elmnt.appendChild(rowElmnt);
			
			containerElmnt.appendChild(elmnt);
			
			//rowElmnt = createRow(['input-field', 'col', 's12']);

			//elmnt = createInput('text', 'event-location', [] , false, 'suggested-locations');

			//if (_event.location()) {elmnt.setAttribute('value', _event.location())}; rowElmnt.appendChild(elmnt);

			//rowElmnt.appendChild(createLabel('Location', 'event-location', ['form-label'], 'Please enter event location', false));

			//datalistElmnt = document.createElement('datalist');

			//datalistElmnt.id = 'suggested-locations';

			//rowElmnt.appendChild(datalistElmnt);

			//elmnt = createRow(['row']);
			


		// Add start date and time field

			elmnt =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
			
			
			// Date

				rowElmnt =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's6']
				});
				
				
				rowElmnt.appendChild(this.createElement( // input
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
				
				
				rowElmnt.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-start-date'},
					
					classList: ['form-label'],
					
					dataset: {error: 'Please enter start date'},
					
					innerHTML: 'Start Date'
				}));
				
				
				rowElmnt.appendChild(this.createElement( // custom error div
				{	
					element: 'div',			
					
					attributes: {id: 'event-start-date-error'},
					
					classList: ['custom-validate']
				}));
				
				elmnt.appendChild(rowElmnt);
				
				//rowElmnt = createRow(['input-field', 'col', 's6']);

				//elmnt =createInput('text', 'event-start-date', ['datepicker', 'picker__input'] , true, '', true);

				//if (_event.start()) {elmnt.setAttribute('value', _event.start().toLocaleDateString());}

				//rowElmnt.appendChild(elmnt);

				//rowElmnt.appendChild(createLabel('Start Date', 'event-start-date', ['form-label'], 'Please enter start date', true));

				//rowElmnt.appendChild(createCustomError('event-start-date-error'));
				
				
			// Time

				rowElmnt =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's6']
				});
				
				
				rowElmnt.appendChild(this.createElement( // input
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
								
				
				rowElmnt.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-start-time'},
					
					classList: ['form-label'],
					
					dataset: {error: 'Please enter start time'},
					
					innerHTML: 'Start Time'
				}));
				
				
				rowElmnt.appendChild(this.createElement( // custom error div
				{	
					element: 'div',			
					
					attributes: {id: 'event-start-time-error'},
					
					classList:['custom-validate']
				}));
				
				
				elmnt.appendChild(rowElmnt);
				
				//rwElmnt = createRow(['input-field', 'col', 's6']);

				//elmnt = createInput('text', 'event-start-time', ['timepicker', 'picker__input'] , false, '', true);

				//if (_event.start()) {elmnt.setAttribute('value', _event.start().toLocaleTimeString());}

				//rwElmnt.appendChild(elmnt);

				//rwElmnt.appendChild(createLabel('Start Time', 'event-start-time', ['form-label'], 'Please enter start time', false));

				//rwElmnt.appendChild(createCustomError('event-start-time-error'));
				
				
			// Add to container

				//elmnt = createRow(['row']);

				//elmnt.appendChild(rowElmnt);

				//elmnt.appendChild(rwElmnt);

				containerElmnt.appendChild(elmnt);


		// Add end date and time field

			elmnt =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
				
				// Date

				rowElmnt =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field', 'col', 's6']
				});
				
				
				rowElmnt.appendChild(this.createElement( // input
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
				
				
				rowElmnt.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-end-date'},
					
					classList: ['form-label'],
					
					dataset: {error: 'Please enter end date'},
					
					innerHTML: 'End Date'
				}));
				
				
				rowElmnt.appendChild(this.createElement( // custom error div
				{	
					element: 'div',			
					
					attributes: {id: 'event-end-date-error'},
					
					classList: ['custom-validate']
				}));
				
				
				elmnt.appendChild(rowElmnt);
				/*
				rowElmnt = createRow(['input-field', 'col', 's6']);

				elmnt = createInput('text', 'event-end-date', ['datepicker', 'picker__input'] , false, '', true);

				if (_event.end()) {elmnt.setAttribute('value', _event.end().toLocaleDateString());}

				rowElmnt.appendChild(elmnt);

				rowElmnt.appendChild(createLabel('End Date', 'event-end-date', ['form-label'], 'End date cannot be before start date', false));

				rowElmnt.appendChild(createCustomError('event-end-date-error'));
				*/

			// Time
				
				rowElmnt =  this.createElement( // inner div
				{
					element: 'div',			
					
					classList: ['input-field','col', 's6']
				});
				
				
				rowElmnt.appendChild(this.createElement( // input
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
				
				
				rowElmnt.appendChild(this.createElement( // label
				{	
					element: 'label',			
					
					attributes: {for: 'event-end-time'},
					
					classList: ['form-label'],
					
					dataset: {error: 'Please enter end time'},
					
					innerHTML: 'End Time'
				}));
				
				
				rowElmnt.appendChild(this.createElement( // custom error div
				{	
					element: 'div',			
					
					attributes: {id: 'event-end-time-error'},
					
					classList: ['custom-validate']
				}));
				
				
				elmnt.appendChild(rowElmnt);
				/*
				rwElmnt = createRow(['input-field', 'col', 's6']);

				elmnt = createInput('text', 'event-end-time', ['timepicker', 'picker__input'] , false, '', true);

				if (_event.end()) {elmnt.setAttribute('value', _event.end().toLocaleTimeString());}

				rwElmnt.appendChild(elmnt);

				rwElmnt.appendChild(createLabel('End Time', 'event-end-time', ['form-label'], 'Please enter end time', false));

				rwElmnt.appendChild(createCustomError('event-end-time-error'));
				*/
				

			// Add to container

				////elmnt = createRow(['row']);

				//elmnt.appendChild(rowElmnt);

				//elmnt.appendChild(rwElmnt);

				containerElmnt.appendChild(elmnt);


		// Add event type field

			rowElmnt =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', 's12']
			});
			
			rowElmnt.appendChild(this.createElement( //input
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
			
			
			rowElmnt.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-type'},
				
				classList: ['active','form-label'],
				
				dataset: {error: 'Please enter event type'},
				
				innerHTML: 'Event Type'
			}));
			
			
			rowElmnt.appendChild(this.createElement( // data list
			{	
				element: 'datalist',			
				
				attributes: {id: 'event-types'}
			}));
			
			
			elmnt =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
						
			
			elmnt.appendChild(rowElmnt);
			
			//containerElmnt.appendChild(elmnt);
			
			//rowElmnt = createRow(['input-field', 'col', 's12']);

			//elmnt = createInput('text', 'event-type', [], false, 'event-types');

			//if(_event.type()) {elment.setAttribute('value', _event.type());}; rowElmnt.appendChild(elmnt);

			//rowElmnt.appendChild(createLabel('Event Type', 'event-type', ['form-label'], 'Please enter event type', false));

			//datalistElmnt = document.createElement('datalist');

			//datalistElmnt.id = 'event-types';

			/*['Anniversary', 'Birthday', 'Family reunion', 'Party', 'Religious festival', 'Wedding'].forEach(function(eventType) {

				optionElmnt = document.createElement('option');

				optionElmnt.value = eventType;

				datalistElmnt.appendChild(optionElmnt);
			});

			rowElmnt.appendChild(datalistElmnt);
			*/

			//elmnt = createRow(['row']); elmnt.appendChild(rowElmnt);
			
			containerElmnt.appendChild(elmnt);


		// Add capacity field

			rowElmnt =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', 's12']
			});
			
			
			rowElmnt.appendChild(this.createElement( // input
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
			
			
			rowElmnt.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-capacity'},
				
				classList: ['form-label'],
				
				dataset: {error: 'Please enter capacity'},
				
				innerHTML: 'Capacity'
			}));
			
			
			elmnt =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
						
			elmnt.appendChild(rowElmnt);
			
			containerElmnt.appendChild(elmnt);
			
			/*
			rowElmnt = createRow(['input-field', 'col', 's12']);

			elmnt = createInput('number', 'event-capacity', ['validate'], true);

			elmnt.min = 0; elmnt.step = 1;

			if (_event.capacity() > -1) {elmnt.setAttribute('value', _event.capacity());};

			rowElmnt.appendChild(elmnt);

			rowElmnt.appendChild(createLabel('Event Capacity', 'event-capacity', ['form-label', 'active'], 'Please enter capacity (zero or more)', true));

			elmnt = createRow(['row']); elmnt.appendChild(rowElmnt); containerElmnt.appendChild(elmnt);
			*/

		// Add host field

			rowElmnt =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', 's12']
			});
			
			
			rowElmnt.appendChild(this.createElement( // input
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
			
			
			rowElmnt.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: 'event-host'},
				
				classList: ['form-label'],
				
				dataset: {error: 'Please enter host'},
				
				innerHTML: 'Host'
			}));
			
			
			elmnt =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
						
			
			elmnt.appendChild(rowElmnt);
			
			containerElmnt.appendChild(elmnt);
			
			/*
			rowElmnt = createRow(['input-field', 'col', 's12']);

			elmnt = createInput('text', 'event-host', ['validate'], false);

			if(_event.host().name()) {elmnt.setAttribute('value', _event.host().name());}

			rowElmnt.appendChild(elmnt);

			rowElmnt.appendChild(createLabel('Event Host', 'event-host', ['form-label'], 'Please enter host', false));

			elmnt = createRow(['row']); elmnt.appendChild(rowElmnt); containerElmnt.appendChild(elmnt);
			*/


		// Add description field

			rowElmnt =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', 's12']
			});
			
			
			rowElmnt.appendChild(this.createElement( // input
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
			
			
			rowElmnt.appendChild(this.createElement( // label
			{	
				element: 'label',			
				
				attributes:	{for: 'event-description'},
				
				classList: ['form-label'],
				
				dataset: {error: 'Please enter description'},
				
				innerHTML: 'Description'
			}));
			
			
			elmnt =  this.createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});
			
						
			elmnt.appendChild(rowElmnt);
			
			containerElmnt.appendChild(elmnt);
			
			/*
			rowElmnt = createRow(['input-field', 'col', 's12']);

			elmnt = createInput('textarea', 'event-description', ['materialize-textarea'], false);

			elmnt.setAttribute('length', 120); elmnt.setAttribute('maxlength', 120);

			if (_event.description()) {elmnt.setAttribute('value', _event.description())}

			rowElmnt.appendChild(elmnt);

			rowElmnt.appendChild(createLabel('Event Description', 'event-description', ['form-label'], 'Please enter description', false));

			elmnt = createRow(['row']); elmnt.appendChild(rowElmnt); containerElmnt.appendChild(elmnt);
			*/


		// Add requirement indicator (asterisk) explanation

			rowElmnt =  this.createElement( // outer div
			{
				element: 'div',			
				
				classList: ['row']
			});
			
			//rowElmnt = createRow(['row']);

			rowElmnt.appendChild(this.createElement({
			
				element: 'p',
				
				classList: ['required-indicator'],
					
				innerHTML: '* indicates a required field'
			}));
			
			
			containerElmnt.appendChild(rowElmnt);

		
		// Add submit and cancel buttons

			rowElmnt =  this.createElement( // outer div
			{
				element: 'div',			
				
				classList: ['row', 'form-submit']
			});
			
			
			rowElmnt.appendChild(this.createElement({ // cancel button
				
				element: 'a',
				
				attributes: {id: 'event-form-cancel'},
				
				classList: ['waves-effect', 'waves-teal', 'btn-flat']
			}));
			
			
			elmnt =  this.createElement({ // submit button
				
				element: 'a',
				
				attributes: {id: 'event-form-submit'},
				
				classList: ['waves-effect', 'waves-light', 'btn']
			});
			
			
			elmnt.appendChild(this.createElement({
				
				element: 'i',
				
				classList: ['material-icons', 'right'],
				
				innerHTML: 'send'
			}));
			
			
			rowElmnt.appendChild(elmnt);
			
			/*rowElmnt = createRow(['row', 'form-submit']);

			elmnt = document.createElement('a'); // cancel button

			elmnt.id = 'event-form-cancel';

			elmnt.classList.add('waves-effect');

			elmnt.classList.add('waves-teal');

			elmnt.classList.add('btn-flat');

			rowElmnt.appendChild(elmnt);

			elmnt = document.createElement('a'); // submit button

			elmnt.id = 'event-form-submit';

			elmnt.classList.add('waves-effect');

			elmnt.classList.add('waves-light');

			elmnt.classList.add('btn');

			iconElmnt = document.createElement('i');

			iconElmnt.classList.add('material-icons');

			iconElmnt.classList.add('right');

			iconElmnt.innerHTML = 'send';

			elmnt.appendChild(iconElmnt);

			rowElmnt.appendChild(elmnt);
			*/

			containerElmnt.appendChild(rowElmnt);


		return formElmt;

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