'use strict'; // Not in functions to make it easier to remove by build process

var app = app || {}; // create a simple namespace for the app


/**********************************************************************************************
* public class Event implements IInterfaceable, IModelable, ISerializable
**********************************************************************************************/

/** @classdesc Holds information about an event.
*
* @constructor
*
* @implements IInterfaceable
*
* @implements IModelable
*
* @implements ISerializable
*
* @param {String} name The name of the event
*
* @param {String} type The type of event (e.g. birthday, bachelor's party, religious holiday etc.)
*
* @param {Date} start The date and time when the event starts
*
* @param {Date} end The date and time when the event ends
*
* @param {String} location The location where the event is held
*
* @param {String} description A brief description of the event
*
* @param {IHost} host The host of the event
*
* @param {int} capacity The capacity (in number of persons) of the event. Default is zero.
*
* @return {Event} An Event instance
*
* @author Ulrik H. Gade, January 2016
*/

app.Event = function(str_name, str_type, date_start, date_end, str_location, str_description, ihost_host, int_capacity) {
	
	
	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// Any strong typing is enforced by the accessor methods.
	
	var	_className = 'Event', // (String) Name of this class
	
	_id, // (int) Unique event ID obtained from Event object registry
	
	_name,
	
	_type,
	
	_start,
	
	_end,
	
	_capacity = 50, // set a reasonable non-zero default
	
	_guests = [], // (Person array) A collection of guests invited to, or participating in, the event
	
	_location,
	
	_description,
	
	_host,

	_implements = [app.IInterfaceable, app.IModelable, app.IObservable, app.IObserver, app.ISerializable];  // list of interfaces implemented by this class (by function reference)
		

	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation any way in order to expose list to default IObservable methods
	
	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets or sets capacity
	*
	* @param {int} capacity The capacity of the event (optional, supply if setting)
	*
	* @return {int} The capacity of the event
	*
	* @throws {RangeError} If capacity is set lower than zero
	*/
	
	this.capacity = function (int_capacity) {
		
		if (arguments.length !== 0) {
			
			if (int_capacity !== null) { // i.e. undefined when serialized, ignore
			
				if (parseInt(int_capacity) === int_capacity) { // integer required
				
					if (parseInt(int_capacity) >= 0) { // must not be negative
				
						_capacity = parseInt(int_capacity);
					}
					
					else {
						
						throw new RangeError('Capacity cannot be negative');
					}
				}
				
				else {
					
					throw new TypeError('Capacity must be an integer');
				}
			}
		}
		
		return _capacity;
	};


	/** Gets name of object's class. Class name is read-only.
	*
	* (Method realization required by ISerializable.)
	*
	* @return {String} name The name of the object's class
	*	
	* @throws {Error} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	this.className = function () {
		
		if(arguments.length === 0) { return _className;}
		
		else {
			
			throw new Error('Illegal parameter: className is read-only');
		}
	};
	
	
	/** Gets or sets description
	*
	* @param {String} description A short description of the event (optional, supply if setting)
	*
	* @return {String} A short description of the event
	*/
	
	this.description = function (str_description) {
		
		if (arguments.length !== 0) {
			
			_description = str_description;
		}
		
		return _description;
	};


	/** Gets or sets the end date
	*
	* @description Takes a single parameter when setting: either a Date object or a valid date string.
	*
	* @param {Date} end The date and time when the event ends (Date representation)
	*
	* @param {String} end The date and time when the event ends (String representation)
	*
	* @param {null} end In order to clear the event's end date
	*
	* @return {Date} The date and time when the event ends, or null
	*
	* @throws {IllegalArgumentError} If end is not a date, or end is before start
	*/
	
	this.end = function(date_end) {
		
		if (arguments.length !== 0) {
			
			if (date_end === null || date_end === '') { // reset event

				_end = null;
			}
				
			else if (date_end.constructor === Date || !isNaN(Date.parse(date_end))) { // date as Date or string (mostly used to parse in from JSON)
				
				date_end = date_end.constructor === Date ? date_end : new Date(date_end);

				if (date_end >= _start) { // false if _start is undefined

					_end = date_end;
				}

				else {

					throw new IllegalArgumentError('End must be after start');
				}
			}

			else {
				
				throw new IllegalArgumentError('End must be Date or null');
			}
		}
		
		return _end;
	};

	
	/** Gets copy of the guest list for the event. Guest list cannot be manipulated directly: use add() or remove() methods.
	*
	* return {Array} A Person array
	*/
	
	this.guests = function(arr_guests) { // only for use by readObject() when re-instantiating object
		
		if (arguments.length > 0) {
		
			for (var i = 0, len = arr_guests.length; i < len; i ++) { // verify param
				
				if (arr_guests[i]._className !== 'Person' || typeof arr_guests[i]._id === 'undefined') {
					
					throw new IllegalArgumentError('Guest list must be able to resolve into Person array');
				}
			}
			
			_guests = arr_guests; // param verified, so set attribute
		}
		
		return _guests;
	};
	
	
	/** Gets or sets the host
	*
	* @param {IHost} host The person or organization hosting the event
	*
	* @return {IHost} The person or organization hosting the event
	*/
	
	this.host = function(Ihost_host) {
		
		if (arguments.length !== 0) {
			
			if (typeof Ihost_host.hostName === 'function') { // verify that we have an instance of a class that implements iHost
				
				_host = Ihost_host;
			}
			
			else if (['Person', 'Organization'].indexOf(Ihost_host._className) > -1 && typeof Ihost_host._id !== 'undefined') { // setting unresolved object reference when called from readObject()
			//else if (Ihost_host.isInstanceOf && Ihost_host.isInstanceOf(app.IHost) && typeof Ihost_host._id !== 'undefined') { // setting unresolved object reference when called from readObject()
			
				_host = Ihost_host;
			}
			
			else {
				
				throw new TypeError('Host must implement IHost')
			}
		}
		
		return _host;
	};
	
	
	/** Gets unique event ID. ID can only be set from within the object itself.
	*
	* (Method realization required by ISerializable.)
	*
	* @return {int} An integer, if called with no parameters
	*	
	* @throws {Error} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	this.id = function () {
		
		if(arguments.length === 0) { return _id;}
		
		else {
			
			throw new Error('Illegal parameter: id is read-only');
		}
	};


	/** Gets or sets default location for the event. Location may be a string with the position's name, or a Position object
	*
	* @param {String} location The default location (as a string with the location's name)
	*
	* @param {Position} location The default location (as a geolocation API Position object)
	*
	* @return {Object} The location
	*
	* @throws {IllegalArgumentError} If attempting to set location that is neither a string nor an Position
	*/
	
	this.location = function (obj_location) {
	
		if (arguments.length > 0) {

			if (typeof obj_location === 'string' || obj_location.coords) {
			
				_location = obj_location;
			}

			else {
			
				throw new IllegalArgumentError('Location must be a string or a Position')
			}
		}
		
		return _location;
	};


	/** Gets or sets location
	*
	* @param {String} location The location of the event (optional, supply if setting)
	*
	* @return {String} The location of the event
	*/
	
	/*
	this.location = function (str_location) {
		
		if (arguments.length !== 0) {
			
			_location = str_location;
		}
		
		return _location;
	};
	*/

	
	/** Gets or sets name
	*
	* @param {String} name The name of the event (optional, supply if setting)
	*
	* @return {String} The name of the event
	*/
	
	this.name = function (str_name) {
		
		if (arguments.length !== 0) {
			
			_name = str_name;
		}
		
		return _name;
	}
	

	/** Gets or sets the start date
	*
	* @description Takes a single parameter when setting: either a Date object or a valid date string.
	*
	* @param {Date} start The date and time when the event starts, or null (Date representation)
	*
	* @param {String} start The date and time when the event starts, or the empty string (String representation)
	*
	* @return {Date} The date and time when the event starts, or null
	*/
	
	this.start = function(date_start) {
		
		if (arguments.length !== 0) {
			
			if (date_start === null || date_start === '') {

				_start = null;
			}
				
			else if (date_start.constructor === Date || !isNaN(Date.parse(date_start))) { // date as Date or string (mostly used to parse in from JSONdefault)
				
				date_start = date_start.constructor === Date ? date_start : new Date(date_start);

				if (!_end || date_start <= _end) {

					_start = date_start;
				}

				else {

					throw new IllegalArgumentError('Start must be before end');
				}
			}
			
			else {
				
				throw new IllegalArgumentError('Start must be Date or null');
			}
		}
		
		return _start;
	};
	
	
	/** Gets or sets event type
	*
	* @param {String} type The type of event (e.g. birthday, bachelor's party, religious holiday etc.) (optional, supply if setting)
	*
	* @return {String} The type of event (e.g. birthday, bachelor's party, religious holiday etc.)
	*/
	
	this.type = function (str_type) {
		
		if (arguments.length !== 0) {
			
			_type = str_type;
		}
		
		return _type;
	};
	
	
	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	// None so far
		
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	/** Adds a person to the event's guest list
	*
	* @return {Person} The person just added. Otherwise throws error.
	 */

	this.addGuest = function (obj_guest) {
		
		if (obj_guest.constructor === app.Person) { // only a Person can be a guest
			
			if(_guests.length < _capacity - 1) { // we cannot add guests beyond capacity
			
				_guests.push(obj_guest);
			}
			
			else {
				
				throw new RangeError('Cannot add guests beyond capacity');
			}
		}
		
		else {
			
			throw new TypeError('Guest must be Person');
		}
		
		return obj_guest;
	};


	/** Checks if a person is on the event's guest list
	*
	* @return {Boolean} True if the person is on the guest list, else false
	*/

	this.isGuest = function (obj_person) {
		
		var ret = false;
		
		if (obj_person.constructor === app.Person) {
			
			_guests.forEach(function(guest) {
				
				if (guest.id() === obj_person.id()) {ret = true;} // can't 'break' out of forEach
			});
		}
		
		else {
			
			throw new TypeError('Guest must be Person');
		}
		
		return ret;
	};

	
	/** Returns true if class implements the interface passed in (by function reference)
	*
	* (See IInterfaceable for further documentation.)
	*/
	
	this.isInstanceOf = function (func_interface) {
		
		return _implements.indexOf(func_interface) > -1;
	};


	/** Re-establishes references to complex members after they have been deserialized
	*
	* (Method realization required by ISerializable.)
	*/

	this.onDeserialized = function() { // Replace IDs with references to objects of that ID
		
		for (var i = 0, len = _guests.length; i < len; i++) { // Guest list
			
			// Add property if likely to be temporary literal left by readObject();
			
			if (_guests[i].constructor !== app.Person && _guests[i]._className === 'Person') {
			
				_guests[i] = app.Person.registry.getObjectById(_guests[i]._id);
			}
		}
		
		/*
		_guests.forEach(function(guest) { // this generated random errors, so going old school
		
			console.log(guest);
			
			_guests[guest] = app.Person.registry.getObjectById(guest);
		});
		*/
		
		
		// Add property if it exist and is likely to be temporary literal left by readObject();
		
		if (_host && _host.constructor !== app[_host._className] && ['Person', 'Organization'].indexOf(_host._className) > -1) {
		
			_host = app[_host._className].registry.getObjectById(_host._id);
		}
		
		return true;
	};


	/** Removes a person from the event's guest list
	*
	* @return {Array} An array with the person that was removed, an empty array if the person was not found on the guest list
	*/

	this.removeGuest = function (obj_person) {
		
		var ret;
		
		if (obj_person.constructor === app.Person) {
			
			for (var i = 0, len = _guests.length; i < len; i++) {
			
				if (_guests[i].id() === obj_person.id()) {
					
					ret = _guests.splice(i, 1);
					
					break;
				}
			}
		}
		
		else {
			
			throw new TypeError('Guest must be Person');
		}
		
		return ret;
	};


	/** Converts event to JSON object
	*
	* (Method realization required by ISerializable.)
	*
	* @return {Object} JSON object representation of event (used to override default behaviour of JSON.stringify())
	*/
		
	this.toJSON = function () { // we need private access so no prototype inheritance here
		
		return {
			
			_className: 'Event',
			
			_id: _id,
			
			_start: _start,
			
			_end: _end,
			
			_name: _name,
			
			_type: _type,
			
			_location: _location,
			
			_description: _description, // may need to remove line breaks
			
			_host: _host ? {_className: _host.className(), _id: _host.id()} : undefined, // if host is undefined, pass in undefined
			
			_capacity: _capacity,
			
			_guests: (function() { // store array of guest reference objects
				
				var ret = [];
				
				_guests.forEach(function(guest) {
					
					ret.push({_className: 'Person', _id: guest.id()});
				});
				
				return ret;
			})()
		};
	};


	/** Updates IObserver when notified of change by observable (controller). Autosaves to local storage if available.
	*
	* (See IObserver for further documentation.)
	*
	* @param {Event} event Object holding the data to update with
	*
	* @return {Boolean} true if copy was successful, else error or false
	*
	* @throws {IllegalArgumentError} If object provided is not an instance of Event
	*
	* @throws {IllegalArgumentError} If id provided does not match that of the object being updated
	*/

	this.update = function(Event_event, int_objId) {

		if (Event_event.constructor !== app.Event) { // wrong class

			throw new IllegalArgumentError('Object must be instance of Event');
		}

		else if (this.id() !== int_objId) { // id mismatch

			throw new IllegalArgumentError('Objects IDs don\'t match');
		}

		else {

			// Update using accessors (for validation)

			this.name(Event_event.name());

			this.type(Event_event.type());

			this.start(Event_event.start() ? Event_event.start() : null);

			this.end(Event_event.end() ? Event_event.end() : null);

			if (Event_event.location()) {this.location(Event_event.location());}

			this.description(Event_event.description());

			this.capacity(Event_event.capacity());

			this.host(Event_event.host());

			
			// Do some housekeeping (calls IModelable default)

			this.onUpdate(Event_event);

			
			return true;
		}

		return false; // this should never happen, keeping just in case
	}
	
		
	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// Single param that is integer => deserialize from local storage

	if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
		
		// Reset original ID (expected by readObject())
	
		_id = arguments[0];
		
		// Read in JSON from local storage
		
		void this.readObject();
	}
	
	
	// Normal instantiation
	
	else {
		
		// Set unique ID
		
		_id = this.constructor.registry.getNextId();
		
		
		// Call accessors for any supplied params (accessors provide simple validation and error handling)
		
		if (str_name) {this.name(str_name)}
		
		if (str_type) {this.type(str_type)}
		
		if (date_start) {this.start(date_start)}
		
		if (date_end) {this.end(date_end)}
		
		if (int_capacity >= 0) {this.capacity(int_capacity)}

		if (str_location) {this.location(str_location)}

		if (str_description) {this.description(str_description)}

		if (ihost_host) {this.host(ihost_host)}
	}

	this.constructor.registry.add(this); // Will only happend if param passing passes w/o error
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Provides non-mutable, unique event IDs */

app.Event.registry = new app.ObjectRegistry(app.Event, 'Event');


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IInterfaceable, app.Event);

void app.IInterfaceable.mixInto(app.IModelable, app.Event);

void app.IInterfaceable.mixInto(app.IObservable, app.Event);

void app.IInterfaceable.mixInto(app.IObserver, app.Event);

void app.IInterfaceable.mixInto(app.ISerializable, app.Event);

app.Event.registry.clear(); // remove objects created by mixInto()