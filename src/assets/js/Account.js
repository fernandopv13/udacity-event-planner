'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class Account extends Model
**********************************************************************************************/

var app = app || {};


/** @classdesc Holds information about a account.
*
* @constructor
*
* @extends Model
*
* @param {Email} email Email identifying the account
*
* @param {String} password A secure password for the account
*
* @param {Person} accountHolder The person holding the account
*
* @return {Account} An account instance

* @throws Same errors as accessors for attribute values passed in, if invalid.
*
* @author Ulrik H. Gade, January 2016
*
*/

app.Account = function(Email_email, Password_password, Person_accountHolder) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

	this.className = 'Account';

	this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
		
	this.ssuper = app.Model;

	
	/** Initialize instance members inherited from parent class*/
	
	app.Model.call(this);
	
	
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
	
	this.accountHolder = function (obj_person) {
		
		if (arguments.length !== 0) { // normal setter
			
			if (obj_person === null || obj_person ==='') { // reset account holder

				_accountHolder = null;
			}

			else if (obj_person.constructor === app.Person) { // normal setter
				
				_accountHolder = obj_person;
			}
			
			else if (obj_person._className === 'Person' && typeof obj_person._id !== 'undefined') { // setting unresolved object reference when called from readObject()
				
				_accountHolder = obj_person;
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
	
		if (arguments.length > 0) {

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

			else if (obj_email.constructor === app.Email) { // normal setter
				
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
					
				if (obj_password.constructor === app.Password) { // normal setter

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
	
	this.addEvent = function (Event_event) {
	
		var event = Event_event;

		if (event.constructor === app.Event) {
			
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
	
	this.events = function () {
	
		if (arguments.length !== 0) {
			
			throw new IllegalArgumentError('Events collection is read-only')
		}

		return _events;
	};


	/** Checks if an even belongs to the account
	*
	* @return {Boolean} True if the event is belongs to the account, otherwise false
	*/

	this.isInAccount = function (Event_event) {
		
		var event = Event_event;
		
		if (event.constructor === app.Event) {
			
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
		
		if (_email && _email.constructor !== app.Email && _email._className === 'Email') {
		
			_email = app.Email.registry.getObjectById(_email._id);
		}

		if (_password && _password.constructor !== app.Password && _password._className === 'Password') {
		
			_password = app.Password.registry.getObjectById(_password._id);
		}

		if (_accountHolder && _accountHolder.constructor !== app.Person && _accountHolder._className === 'Person') {
		
			_accountHolder = app.Person.registry.getObjectById(_accountHolder._id);
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
	
		if (obj_event.constructor === app.Event) {

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

			_localStorageAllowed: _localStorageAllowed
		};
	};
	
		
	/*----------------------------------------------------------------------------------------
	* Other initialization (parameter parsing/constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
	
	this.parentList().push(app.Account);
	
	
	// Single param that is integer => deserialize from local storage

	if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
		
		// Read in JSON from local storage
		
		void this.readObject();
	}
	

	// Normal instantiation

	else {
			
		// Call accessors for any supplied params (accessors provide simple validation and error handling)
		
		if (Email_email) {this.email(Email_email);}
		
		if (Password_password) {this.password(Password_password);}

		if (Person_accountHolder) {this.accountHolder(Person_accountHolder);}
	}

	
	//Add to registry
	
	this.constructor.registry.add(this); // Will only happend if initialization passes w/o error
};


/*----------------------------------------------------------------------------------------
* Inherit from Model
*---------------------------------------------------------------------------------------*/	

app.Account.prototype = Object.create(app.Model.prototype); // Set up inheritance

app.Account.prototype.constructor = app.Account; // Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance members (on prototype)
*---------------------------------------------------------------------------------------*/

/** Updates IObserver when notified of change by observable (controller). Autosaves to local storage if available.
*
* (See IObserver for further documentation.)
*
* @param {Account} account Object holding the data to update with
*
* @return {Boolean} true if copy was successful, else error or false
*
* @throws {IllegalArgumentError} If object provided is not an instance of Account
*
* @throws {IllegalArgumentError} If id provided does not match that of the object being updated
*/

app.Account.prototype.update = function(Account_account, int_objId) {

	var source = Account_account;

	if (source.constructor !== app.Account) { // wrong class

		throw new IllegalArgumentError('Object must be instance of Account');
	}

	else if (this.id() !== int_objId) { // id mismatch

		throw new IllegalArgumentError('Objects IDs don\'t match');
	}

	else {

		// Update using accessors (for validation)

		this.email(source.email());

		this.password(source.password());

		if (source.accountHolder()) {this.accountHolder(source.accountHolder());}

		this.defaultCapacity(source.defaultCapacity());

		this.defaultLocation(source.defaultLocation());

		this.geoLocationAllowed(source.geoLocationAllowed());

		this.localStorageAllowed(source.localStorageAllowed());
	
		
		// Do some housekeeping (calls method in parent class)

		this.ssuper().prototype.update.call(this, Account_account);

		
		return true;
	}

	return false; // this should never happen, keeping just in case
}

/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Provides registry and unique object ID services to this class.
*
* See ObjectRegistry class for further documentation.
*/

app.Account.registry = new app.ObjectRegistry(app.Account, 'Account');