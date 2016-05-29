'use strict'; // Not in functions to make it easier to remove by build process

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/**********************************************************************************************
	* public class Account extends Model
	**********************************************************************************************/

	/** @classdesc Represents a user account in the app.
	*
	* See polymorphic, inner helper 'constructors' for supported signatures.
	*
	* @constructor
	*
	* @extends Model
	*
	* @return {Account} An account instance

	* @throws Same errors as accessors for attribute values passed in, if invalid.
	*
	* @author Ulrik H. Gade, May 2016
	*
	* @todo Move as many non-accessor methods as possible from the object itself to the function prototype.
	*/

	module.Account = function(Email_e, Password_p, Person_accountHolder) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

		this.className = 'Account';

		this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
			
		this.ssuper = module.Model;

		
		/** Initialize instance members inherited from parent class */
		
		module.Model.call(this);
		
		
		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
		var _email,
		
		_password,

		_accountHolder,

		_events = {},

		_localStorageAllowed = false,

		_geoLocationAllowed = false,

		_defaultCapacity = 50,

		_defaultLocation;

		
		
		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields
		*---------------------------------------------------------------------------------------*/

			/** Gets or sets account holder
			*
			* @param {Person} accountholder The person holding the account (optional, supply if setting)
			*
			* @param {null} accountHolder In order to reset the account holder
			*
			* @return {Person} The person holding the account
			*
			* @throws {IllegalArgumentError} If attempting to set account holder not of class Person
			*/
			
			this.accountHolder = function (Person_p) {
				
				if (arguments.length !== 0) { // normal setter
					
					if (Person_p === null || Person_p ==='') { // reset account holder

						_accountHolder = null;
					}

					else if (Person_p.constructor === module.Person) { // normal setter
						
						_accountHolder = Person_p;
					}
					
					else if (Person_p._className === 'Person' && typeof Person_p._id !== 'undefined') { // setting unresolved object reference when called from readObject()
						
						_accountHolder = Person_p;
					}
					
					else {
						
						throw new IllegalArgumentError('Account holder must be a Person or null')
					}
				}
				
				return _accountHolder;
			}
			
			
			/** Gets or sets default event capacity for the account
			*
			* @param {int} capacity The default capacity
			*
			* @return {int} The default capacity
			*
			* @throws {IllegalArgumentError} If attempting to set capacity that is not a positive integer
			*/
			
			this.defaultCapacity = function (int_capacity) {
			
				if (arguments.length > 0) {

					if (typeof int_capacity === 'number' && parseInt(int_capacity) === int_capacity && int_capacity >= 0) {
					
						_defaultCapacity = int_capacity;
					}

					else {
					
						throw new IllegalArgumentError('Capacity must be a non-negative integer')
					}
				}
				
				return _defaultCapacity;
			};


			/** Gets or sets default location for the account. Location may be a string with the position's name, or a Position object
			*
			* @param {String} location The default location (as a string with the location's name)
			*
			* @param {Position} location The default location (as a geolocation API Position object)
			*
			* @return {Object} The default location
			*
			* @throws {IllegalArgumentError} If attempting to set location that is neither a string nor an Position
			*/
			
			this.defaultLocation = function (obj_location) {
			
				if (typeof obj_location !== 'undefined' && obj_location !== null) {

					if (typeof obj_location === 'string' || obj_location.coords) {
					
						_defaultLocation = obj_location;
					}

					else {
					
						throw new IllegalArgumentError('Location must be a string or a Position')
					}
				}
				
				return _defaultLocation;
			};

				
			/** Gets or sets email
			*
			* @param {Email} email The email for the account. (optional, supply if setting)
			*
			* @return {Email} The email for the account.
			*
			* @throws {TypeError} If attempting to set email not of class Email
			*/
			
			this.email = function (obj_email) {
				
				if (arguments.length !== 0) { // normal setter
					
					if (obj_email === null || obj_email === '') { // reset email

						_email = obj_email;
					}

					else if (obj_email.constructor === module.Email) { // normal setter
						
						_email = obj_email;
					}
					
					else if (obj_email._className === 'Email' && typeof obj_email._id !== 'undefined') { // setting unresolved object reference when called from readObject()
						
						_email = obj_email;
					}
					
					else {
						
						throw new IllegalArgumentError('Email must be an instance of the Email class, or null')
					}
				}
				
				return _email;
			}

			
			/** Gets or sets geolocation access permission for the account
			*
			* @param {Boolean} Permission The permission
			*
			* @return {Boolean} The permission
			*
			* @throws {IllegalArgumentError} If attempting to set permission with other than a Boolean
			*/
			
			this.geoLocationAllowed = function (Boolean_permission) {
			
				if (arguments.length > 0) {

					if (Boolean_permission.constructor === Boolean) {
					
						_geoLocationAllowed = Boolean_permission;
					}

					else {
					
						throw new IllegalArgumentError('Permission must be a Boolean')
					}
				}
				
				return _geoLocationAllowed;
			};


			/** Gets or sets local storage access permission for the account
			*
			* @param {Boolean} Permission The permission
			*
			* @return {Boolean} The permission
			*
			* @throws {IllegalArgumentError} If attempting to set permission with other than a Boolean
			*/
			
			this.localStorageAllowed = function (Boolean_permission) {
			
				if (arguments.length > 0) {

					if (Boolean_permission.constructor === Boolean) {
					
						_localStorageAllowed = Boolean_permission;
					}

					else {
					
						throw new IllegalArgumentError('Permission must be a Boolean')
					}
				}
				
				return _localStorageAllowed;
			};
			
			
			/** Gets or sets password
			*
			* @param {Password} password The account's password
			*
			* @return {Password} The account's password.
			*
			* @throws {IllegalArgumentError} If attempting to set insecure password
			*/
			
			this.password = function (obj_password) {
				
				if (arguments.length !== 0) {
					
					if (obj_password === null || obj_password === '') { // reset password

						_password = obj_password;
					}

					else if (obj_password !== null) { // Deserialization may create call with null, ignore
						
						//if (!/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/.test(str_password)) {
							
						if (obj_password.constructor === module.Password) { // normal setter

							_password = obj_password;
						}

						else if (obj_password._className === 'Password' && typeof obj_password._id !== 'undefined') { // setting unresolved object reference when called from readObject()
						
						_password = obj_password;
					}
						
						else {
							
							throw new IllegalArgumentError('Password must be instance of class Password, or null');
						}
					}

					//else: fail silently on null
				}
				
				return _password;
			};
			
			
		/*----------------------------------------------------------------------------------------
		* Public instance methods (beyond accessors)
		*---------------------------------------------------------------------------------------*/
		
			/** Adds event to account
			*
			* @param {Event} Event The event
			*
			* @return {Event} The event just added
			*
			* @throws {IllegalArgumentError} If attempting to set event not of class Event
			*/
			
			this.addEvent = function (Event_e) {
			
				var event = Event_e;

				if (event.constructor === module.Event) {
					
					_events[event.id()] = event;
				}
							
				else {
					
					throw new IllegalArgumentError('Event must be an Event')
				}
			
				return event;
			};


			/** Returns collection of events registered with the account
			
			* @return {Event} Collection of events 
			*
			* @throws {IllegalArgumentError} If attempting to set events (collection is read-only)
			*/
			
			this.events = function (obj_events) { // setting only for use by readObject() when re-instantiating object
			
				if (arguments.length > 0) {
					
					for (var prop in obj_events) { // verify param
						
						if (obj_events[prop]._className !== 'Event' || typeof obj_events[prop]._id === 'undefined') {
							
							throw new IllegalArgumentError('Event list must be able to resolve into Event object map');
						}
					}
					
					_events = obj_events; // param verified, so set attribute
				}

				return _events;
			};


			/** Checks if an even belongs to the account
			*
			* @return {Boolean} True if the event is belongs to the account, otherwise false
			*/

			this.isInAccount = function (Event_e) {
				
				var event = Event_e;
				
				if (event.constructor === module.Event) {
					
					for (var prop in _events) {
						
						if (prop === event.id()) {

							return true;
						}
					}
				}
				
				else {
					
					throw new TypeError('Event must be instance of Event');
				}
				
				return false;
			};


			/** Re-establishes references to complex members after they have been deserialized.
			*
			* (Method realization required by ISerializable.)
			*
			* @return {Boolean} true if successful
			*
			* @todo Return false or throw error if not successful, or void
			*/
			
			this.onDeserialized = function() { // Replace IDs with references to objects of that ID
				
				// Verify that properties exist and are likely to be temporary literals left by readObject() before assigning references
				
				if (_email && _email.constructor !== module.Email && _email._className === 'Email') {
				
					_email = module.Email.registry.getObjectById(_email._id);
				}

				if (_password && _password.constructor !== module.Password && _password._className === 'Password') {
				
					_password = module.Password.registry.getObjectById(_password._id);
				}

				if (_accountHolder && _accountHolder.constructor !== module.Person && _accountHolder._className === 'Person') {
				
					_accountHolder = module.Person.registry.getObjectById(_accountHolder._id);
				}

				for (var prop in _events) { // Re-reference event list
					
					if (_events[prop].constructor !== module.Event && _events[prop]._className === 'Event') {
					
						_events[prop] = module.Event.registry.getObjectById(_events[prop]._id);
					}
				}

				return true;
			}
				

			/** Removes event from account
			*
			* @param {Event} Event The event
			*
			* @return {Event} The event just removed
			*
			* @throws {IllegalArgumentError} If attempting to set event not of class Event
			*/
			
			this.removeEvent = function (obj_event) {
			
				if (obj_event.constructor === module.Event) {

					if (_events[obj_event.id()]) {
					
						delete _events[obj_event.id()];
					}

					else {

						throw new ReferenceError('Event not found in account');
					}
				}
							
				else {
					
					throw new IllegalArgumentError('Event must be an Event')
				}
			
				return obj_event;
			};


			/** Converts Account state to JSON object
			*
			* (Method realization required by ISerializable.)
			*
			* @return {Object} JSON object representation of account (used to override default behaviour of JSON.stringify())
			*/


			this.toJSON = function() { // we need private access so no prototype inheritance here
				
				return {
					
					_className: 'Account',
					
					_id: this.id(),
					
					_email: _email ? {_className: _email.className(), _id: _email.id()} : undefined,
					
					_password: _password ? {_className: _password.className(), _id: _password.id()} : undefined,

					_accountHolder: _accountHolder ? {_className: _accountHolder.className(), _id: _accountHolder.id()} : undefined,

					_defaultCapacity: _defaultCapacity,

					_defaultLocation: _defaultLocation,

					_geoLocationAllowed: _geoLocationAllowed,

					_localStorageAllowed: _localStorageAllowed,

					_events: (function() {
						
						var events = [];

						for (var event in _events) {

							events.push(
							{
								_className: _events[event].className(),

								_id: _events[event].id()
							});
						}

						return events;

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
			* @return {Account} Returns an Account, by way of the main constructor. This function itself has no return value.
			*/

			function Account_(int_id) {

				void this.readObject();
			}


			/** Constructor signature 2: One or more non-integer params provided => normal initialization.
			*
			* Individual params can be skipped, but only in strict reverse order.
			*
			* If present, a parameter is assigned using its accessor (for validation).
			*
			* @param {Email} email Email identifying the account
			*
			* @param {String} password A secure password for the account
			*
			* @param {Person} accountHolder The person holding the account
			*
			* @return {Account} Returns an Account, by way of the main constructor. This function itself has no return value.
			*/

			function Account__(Email_e, Password_p, Person_accountHolder) {

				// Call accessors for any supplied params (accessors provide simple validation and error handling)
				
				if (Email_e) {this.email(Email_e);}
				
				if (Password_p) {this.password(Password_p);}

				if (Person_accountHolder) {this.accountHolder(Person_accountHolder);}
			}



			// Single param that is integer => deserialize from local storage

			if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
				
				// Read in JSON from local storage
				
				Account_.call(this, arguments[0]);

				//void this.readObject();
			}
			

			// Normal instantiation

			else {
					
				// Call accessors for any supplied params (accessors provide simple validation and error handling)
				
				Account__.call(this, Email_e, Password_p, Person_accountHolder);
			}

			
			//Add to registry
			
			this.constructor.registry.add(this); // Will only happend if initialization passes w/o error
	};


	/*----------------------------------------------------------------------------------------
	* Inherit from Model
	*---------------------------------------------------------------------------------------*/	

		module.Account.prototype = Object.create(module.Model.prototype); // Set up inheritance

		module.Account.prototype.constructor = module.Account; // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance members (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Does clean up associated with deletion of Account.
		*
		* Deletes itself and every object it is uniquely composed of, including event guests.
		*
		* @return {void}
		*/

		module.Account.prototype.delete = function () {

			if(this.email()) {this.email().delete();}

			void this.email(null); // probably not necessary

			if (this.password()) {this.password().delete();}

			void this.password(null);

			if (this.accountHolder()) {this.accountHolder().delete();}

			void this.accountHolder(null);

			for (var prop in this.events()) {

				this.events()[prop].guests().forEach(function(guest) {guest.delete();}); // event.delete() does not delete guests

				// later, deal with IHosts (beware destroying before removing from guest list)

				this.events()[prop].delete();

				this.events()[prop] = null;
			}

			this.ssuper().prototype.delete.call(this);
		};


		/** Updates Account instance when notified of change by observable (controller). Autosaves to local storage if available.
		*
		* (See IObserver for further documentation.)
		*
		* @param {Account} account Object holding the data to update from
		*
		* @param {int} id Id of the account intended to receive the update
		*
		* @return {Boolean} true if copy was successful, else error or false
		*
		* @throws {IllegalArgumentError} If object provided is not an instance of Account
		*
		* @throws {IllegalArgumentError} If id provided does not match that of the object being updated
		*
		* @throws {IllegalArgumentError} If any of the data provided by the source does not fit the validation criteria of the target, as managed by accessors.
		*/

		module.Account.prototype.update = function(Account_a, int_id) {

			if (this.ssuper().prototype.update.call(this, Account_a, int_id)) { // check whether to respond to this notification

				// Update using accessors (for validation)

				if (Account_a.email()) {void this.email(Account_a.email());}

				if (Account_a.password()) {void this.password(Account_a.password());}

				if (Account_a.accountHolder()) {void this.accountHolder(Account_a.accountHolder());}

				void this.defaultCapacity(Account_a.defaultCapacity());

				void this.defaultLocation(Account_a.defaultLocation());

				void this.geoLocationAllowed(Account_a.geoLocationAllowed());

				void this.localStorageAllowed(Account_a.localStorageAllowed());
			

				// Do some housekeeping (calls method in parent class, i.e. Model)

				this.ssuper().prototype.onUpdate.call(this, Account_a);
				
				return true;
			}

			return false; // this should never happen, keeping just in case
		}


		/** Writes Account to local storage, if available.
		*
		* Overrides method inherited from ISerializable to ensure any changes to the Account's email
		*
		* and password, as well as the Account itself, are always up to date in storage.
		*
		* @return {void}
		*
		* @throws Same errors as ISerializable writeObject() (relies on this for error checking)
		*/

		module.Account.prototype.writeObject = function() {

			module.ISerializable.prototype.default_writeObject.call(this); // do normal save of Account itself

			if (this.email()) {this.email().writeObject();} // save email

			if (this.password()) {this.password().writeObject();} // save password
		};

	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/

		/** Provides registry and unique object ID services to this class.
		*
		* See ObjectRegistry class for further documentation.
		*/

		module.Account.registry = new module.ObjectRegistry(module.Account, 'Account');

		
		/** Checks if account matching provided email exists
		*
		* @param {Email} email An email Model against whose address to check for an existing account
		*
		* @return {Account} The account matching the email, or null if no match
		*
		* @throws {IllegalArgumentError} If passing in param that is not an Email, or none
		*/

		module.Account.exists = function(Email_e) {

			var accounts = module.Account.registry.getObjectList(), account = null;

			if (arguments.length === 1 && Email_e.constructor === module.Email) {

				for (var ix in accounts) { // try to find a matching account

					if (accounts[ix].email() && accounts[ix].email().address() === Email_e.address()) { // emails match

						account = accounts[ix];

						break; // .. match found, so exit loop
					}
				}
			}

			else {

				throw new IllegalArgumentError('Expected Email');
			}

			return account;
		};
})(app)