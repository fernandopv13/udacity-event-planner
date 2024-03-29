'use strict'; // Not in functions to make it easier to remove by build process

var app = app || {}; // create a simple namespace for the app

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/**********************************************************************************************
	* public class Event extends Model
	**********************************************************************************************/

	/** @classdesc Represents an event in the app.
	*
	* See polymorphic, inner helper 'constructors' for supported signatures.
	*
	* @constructor
	*
	* @extends Model
	*
	* @return {Event} An Event instance
	*
	* @author Ulrik H. Gade, May 2016
	*
	* @todo Move as many non-accessor methods as possible from the object itself to the function prototype.
	*/

	module.Event = function(str_name, str_type, date_start, date_end, str_location, str_description, ihost_host, int_capacity) {
		
		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals to be used as defaults by, and replaced with accessors, by parent class constructor.

			this.className = 'Event';

			this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
				
			this.ssuper = module.Model;

			
			/** Initialize instance members inherited from parent class*/
			
			module.Model.call(this);
		

		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
			// Any strong typing is enforced by the accessor methods.
			
			var _name,
			
			_type,
			
			_start,
			
			_end,
			
			_capacity,
			
			_guests = [], // (Person array) A collection of guests invited to, or participating in, the event
			
			_location,
			
			_description,
			
			_host;


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
			* @param {Object} end The date and time when the event ends (Date or String representation), or null

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
			* @return {Array} A Person array
			*/
			
			this.guests = function(arr_guests) { // setting only for use by readObject() when re-instantiating object
				
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
			* @param {IHost} host The person or organization hosting the event, or null
			*
			* @return {IHost} The person or organization hosting the event
			*/
			
			this.host = function(IHost_h) {
				
				if (arguments.length !== 0) {
					
					if (IHost_h === null || typeof IHost_h.hostName === 'function') { // verify that we have an instance of a class that implements iHost
						
						_host = IHost_h;
					}
					
					else if (['Person', 'Organization'].indexOf(IHost_h._className) > -1 && typeof IHost_h._id !== 'undefined') { // setting unresolved object reference when called from readObject()
					
						_host = IHost_h;
					}
					
					else {
						
						throw new TypeError('Host must implement IHost')
					}
				}
				
				return _host;
			};
			
			
			/** Gets or sets default location for the event. Location may be a string with the position's name, or a Position object
			*
			* @param {Object} location The default location (as a string with the location's name, or a geolocation API Position object)
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
			* @param {Object} start The date and time when the event starts, or null (Date or String representation), or null

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
		* Public instance methods (beyond accessors)
		*---------------------------------------------------------------------------------------*/
		
			/** Adds a person to the event's guest list
			*
			* @return {Person} The person just added. Otherwise throws error.
			*/

			this.addGuest = function (Person_g) {
				
				if (Person_g.constructor === module.Person) { // only a Person can be a guest
					
					if(_guests.length < _capacity - 1) { // we cannot add guests beyond capacity
					
						_guests.push(Person_g);
					}
					
					else {
						
						throw new RangeError('Cannot add guests beyond capacity');
					}
				}
				
				else {
					
					throw new TypeError('Guest must be Person');
				}
				
				return Person_g;
			};


			/** Checks if a person is on the event's guest list
			*
			* @return {Boolean} True if the person is on the guest list, else false
			*/

			this.isGuest = function (obj_person) {
				
				var ret = false;
				
				if (obj_person.constructor === module.Person) {
					
					_guests.forEach(function(guest) {
						
						if (guest.id() === obj_person.id()) {ret = true;} // can't 'break' out of forEach
					});
				}
				
				else {
					
					throw new TypeError('Guest must be Person');
				}
				
				return ret;
			};

			
			/** Re-establishes references to complex members after they have been deserialized
			*
			* (Method realization required by ISerializable.)
			*/

			this.onDeserialized = function() { // Replace IDs with references to objects of that ID
				
				for (var i = 0, len = _guests.length; i < len; i++) { // Guest list
					
					// Add property if likely to be temporary literal left by readObject();
					
					if (_guests[i].constructor !== module.Person && _guests[i]._className === 'Person') {
					
						_guests[i] = module.Person.registry.getObjectById(_guests[i]._id);
					}
				}
				
				/*
				_guests.forEach(function(guest) { // this generated random errors, so going old school
				
					console.log(guest);
					
					_guests[guest] = module.Person.registry.getObjectById(guest);
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
				
				if (obj_person.constructor === module.Person) {
					
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


			/** Converts event to JSON object.
			*
			* (Method realization required by ISerializable.)
			*
			* @return {Object} JSON object representation of event (used to override default behaviour of JSON.stringify())
			*/
				
			this.toJSON = function () { // we need private access so no prototype inheritance here
				
				return {
					
					_className: this.className(),
					
					_id: this.id(),
					
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

				
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/
			
			// Define inner functions that handle polymorphic constructor response to parameter parsing

			/** Constructor signature 1: Single param that is an integer => deserialize from local storage
			*
			* @param {int} id Id of the object to be re-instantiated from local storage. Overrides normal, incremental id assignment from ObjectRegistry.
			*
			* @return {Event} Returns an Event, by way of the main constructor. This function itself has no return value.
			*/

			function Event_(int_id) {

				void this.readObject();
			}


			/** Constructor signature 2: One or more non-integer params provided => normal initialization.
			*
			* Individual params can be skipped, but only in strict reverse order.
			*
			* If present, a parameter is assigned using its accessor (for validation).
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
			* @return {Event} Returns an Event, by way of the main constructor. This function itself has no return value.
			*/

			function Event__(str_name, str_type, date_start, date_end, str_location, str_description, ihost_host, int_capacity) {

				// Call accessors for any supplied params (accessors provide simple validation and error handling)
				
				if (str_name) {this.name(str_name)}
				
				if (str_type) {this.type(str_type)}
				
				if (date_start) {this.start(date_start)}
				
				if (date_end) {this.end(date_end)}
				
				if (str_location) {this.location(str_location)}

				if (str_description) {this.description(str_description)}

				if (ihost_host) {this.host(ihost_host)}

				if (int_capacity >= 0) {this.capacity(int_capacity)}
			}

			
			// Parameter parsing to invoke polymorphic constructor response

			// Single param that is integer => deserialize from local storage

			if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
				
				// Read in JSON from local storage
				
				Event_.call(this, arguments[0]);
			}
			
			
			// Normal instantiation
			
			else {
				
				// Call accessors for any supplied params (accessors provide simple validation and error handling)
				
				Event__.call(this, str_name, str_type, date_start, date_end, str_location, str_description, ihost_host, int_capacity)
			}

			this.constructor.registry.add(this); // Will only happend if param passing passes w/o error
		};

	/*----------------------------------------------------------------------------------------
	* Inherit from Model
	*---------------------------------------------------------------------------------------*/	

		module.Event.prototype = Object.create(module.Model.prototype); // Set up inheritance

		module.Event.prototype.constructor = module.Event; // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Creates a shallow clone of the Event,
		*
		* i.e. complex object attributes are not cloned but copied by reference (e.g. host).
		*
		* Used when entering a transactional editing flow, i.e. editing the guest list for an event
		*
		* but wishing to retain the option the discard such edits.
		*
		* See UML sequence diagram for a detailed analysis of the messaging flow in a transaction.
		*
		* @return {Event} A clone of the Event
		*/

		module.Event.prototype.clone = function() {

			var clone = new module.Event // create and initalize clone with basic attributes
			(
				this.name(),

				this.type(),

				this.start(),

				this.end(),

				this.location(),

				this.description(),

				this.host(), // copied by refererence, not cloned

				this.capacity()
			);

			this.guests().forEach(function(guest){ // copy references to guests

				clone.addGuest(guest);

			}, this);

			return clone;
		};


		/** Updates Event instance when notified of change by observable (controller). Autosaves to local storage if available.
		*
		* (See IObserver for further documentation.)
		*
		* @param {Event} event Object holding the data to update from
		*
		* @param {int} id Id of the event intended to receive the update
		*
		* @return {Boolean} true if update was successful, otherwise error or false
		*
		* @throws {IllegalArgumentError} If object provided is not an instance of Event
		*
		* @throws {IllegalArgumentError} If id provided does not match that of the object being updated
		*
		* @throws {IllegalArgumentError} If any of the data provided by the source does not fit the validation criteria of the target, as managed by accessors.
		*/

		module.Event.prototype.update = function(Event_e, int_id) {

			if (this.ssuper().prototype.update.call(this, Event_e, int_id)) { // check whether to respond to this notification

				// Update using accessors (for validation)

				void this.name(Event_e.name());

				void this.type(Event_e.type());

				if (Event_e.start() && Event_e.end()) {this.start(null);this.end(null);} // don't compare to existing data if supplied valid replacements

				void this.start(Event_e.start() ? Event_e.start() : null);

				void this.end(Event_e.end() ? Event_e.end() : null);

				if (Event_e.location()) {void this.location(Event_e.location());}

				void this.description(Event_e.description());

				void this.capacity(Event_e.capacity());

				void this.host(Event_e.host());

				while (this.guests().length > 0) {void this.guests().shift();} // empty guest list

				Event_e.guests().forEach(function(guest) {void this.addGuest(guest);}, this); // update guest list
				
				// Do some housekeeping common to all Model updates

				this.ssuper().prototype.onUpdate.call(this, Event_e);

				return true;
			}

			return false; // this should never happen, keeping just in case
		}


		/** Writes event to local storage, if available.
		*
		* Overrides method inherited from ISerializable to ensure info about the event collection
		*
		* in the containing Account, as well as about the event itself, is always up to date in storage.
		*
		* @return {void}
		*
		* @throws Same errors as ISerializable writeObject() (relies on this for error checking)
		*/

		module.Event.prototype.writeObject = function() {

			module.ISerializable.prototype.default_writeObject.call(this); // do normal save of event itself

			module.Account.registry.writeObject(); // save containing account (by way of registry to keep Model unaware of Controller)
		};

	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/

		/** Provides non-mutable, unique event IDs */

		module.Event.registry = new module.ObjectRegistry(module.Event, 'Event');

})(app);