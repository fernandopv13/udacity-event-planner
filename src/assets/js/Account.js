'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class Account implements IInterfaceable, IModelable, ISerializable
**********************************************************************************************/

var app = app || {};


/** @classdesc Holds information about a account.
*
* @constructor
*
* @implements IInterfaceable
*
* @implements IModelable
*
* @implements ISerializable
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
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var	_className = 'Account', // (String) Name of this class
	
	_id,  // (int) Unique account ID obtained from Account object registry

	_email,
	
	_password,

	_accountHolder,

	_events = {},

	_localStorageAllowed = false,

	_geoLocationAllowed = false,

	_defaultCapacity = 50,

	_defaultLocation,

	_implements = [app.IInterfaceable, app.IModelable, app.IObservable, app.IObserver, app.ISerializable];  // list of interfaces implemented by this class (by function reference)

	
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
	
	
	/** Gets name of object's class. Class name is read-only.
	*
	* (Method realization required by ISerializable.)
	*
	* @return {String} name The name of the object's class
	*	
	* @throws {IllegalArgumentError} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	this.className = function () {
		
		if(arguments.length === 0) { return _className;}
		
		else {
			
			throw new IllegalArgumentError('className is read-only');
		}
	};


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
			
				console.log(Boolean_permission);

				_geoLocationAllowed = Boolean_permission;
			}

			else {
			
				throw new IllegalArgumentError('Permission must be a Boolean')
			}
		}
		
		return _geoLocationAllowed;
	};


	/** Gets unique account ID. ID can only be set from within the object itself.
	*
	* (Method realization required by ISerializable)
	*
	* @return {int} An integer, if called with no parameters
	*	
	* @throws {IllegalArgumentError} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	this.id = function () {
		
		if(arguments.length === 0) { return _id;}
		
		else {
			
			throw new IllegalArgumentError('ID is read-only');
		}
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
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	// None so far
	

	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation anyway in order to expose list to default IObservable methods
	
	
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
	
	this.addEvent = function (obj_event) {
	
		if (obj_event.constructor === app.Event) {
			
			_events[obj_event.id()] = obj_event;
		}
					
		else {
			
			throw new IllegalArgumentError('Event must be an Event')
		}
	
		return obj_event;
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


	/** Returns true if class implements the interface passed in (by function reference)
	*
	* (See IInterfaceable for further documentation.)
	*/
	
	this.isInstanceOf = function (func_interface) {
		
		return _implements.indexOf(func_interface) > -1;
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
			
			_id: _id,
			
			_email: _email ? {_className: _email.className(), _id: _email.id()} : undefined,
			
			_password: _password ? {_className: _password.className(), _id: _password.id()} : undefined,

			_accountHolder: _accountHolder ? {_className: _accountHolder.className(), _id: _accountHolder.id()} : undefined,

			_defaultCapacity: _defaultCapacity,

			_defaultLocation: _defaultLocation,

			_geoLocationAllowed: _geoLocationAllowed,

			_localStorageAllowed: _localStorageAllowed
		};
	};
	
		
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

		if (Account_account.constructor !== app.Account) { // wrong class

			throw new IllegalArgumentError('Object must be instance of Account');
		}

		else if (this.id() !== int_objId) { // id mismatch

			throw new IllegalArgumentError('Objects IDs don\'t match');
		}

		else {

			// Update using accessors (for validation)

			this.email(Account_account.email());

			this.password(Account_account.password());

			this.accountHolder(Account_account.accountHolder() ? Account_account.accountHolder() : null);

			this.defaultCapacity(Account_account.defaultCapacity());

			this.defaultLocation(Account_account.defaultLocation());

			this.geoLocationAllowed(Account_account.geoLocationAllowed());

			this.localStorageAllowed(Account_account.localStorageAllowed());
			
			
			// Write new state to local storage, if available

			if (this.localStorageAllowed() && window.localStorage) {

				this.writeObject();
			}

			
			// Notify observers (i.e. controller)

			this.notifyObservers(this);

			
			// Remove references to tmp object (to mark for garbage collection, preventing memory leak)

			app.Account.registry.remove(Account_account);

			Account_account = undefined;

			
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
		
		if (Email_email) {this.email(Email_email);}
		
		if (Password_password) {this.password(Password_password);}

		if (Person_accountHolder) {this.accountHolder(Person_accountHolder);}
	}

	
	//Add to registry
	
	this.constructor.registry.add(this); // Will only happend if initialization passes w/o error
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Provides registry and unique object ID services to this class.
*
* See ObjectRegistry class for further documentation.
*/

app.Account.registry = new app.ObjectRegistry(app.Account, 'Account');


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IInterfaceable, app.Account);

void app.IInterfaceable.mixInto(app.IModelable, app.Account);

void app.IInterfaceable.mixInto(app.IObservable, app.Account);

void app.IInterfaceable.mixInto(app.IObserver, app.Account);

void app.IInterfaceable.mixInto(app.ISerializable, app.Account);

app.Account.registry.clear(); // remove objects created by mixInto()