'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class Account implements IObservable ISerializable
******************************************************************************/

var app = app || {};


/** @classdesc Holds information about a account.
*
* @constructor
*
* @implements ISerializable
*
* @param {Email} email the email identifying the account
*
* @param {String} password A secure apssword for the account
*
* @return {Account} An account instance

* @throws Same errors as email and password accessors if passing in invalid data.
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

	_accountHolder; // (Person) The person holding the account

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets or sets account holder
	*
	* @param {Person} accountholder The person holding the account (optional, supply if setting)
	*
	* @return {Person} TThe person holding the account
	*
	* @throws {TypeError} If attempting to set account holder not of class Person
	*/
	
	this.accountHolder = function (obj_person) {
		
		if (arguments.length !== 0) { // normal setter
			
			if (obj_person.constructor === app.Person) {
				
				_accountHolder = obj_person;
			}
			
			else if (obj_person._className === 'Person' && typeof obj_person._id !== 'undefined') { // setting unresolved object reference when called from readObject()
				
				_accountHolder = obj_person;
			}
			
			else {
				
				throw new TypeError('Account holder must be a Person')
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
	* @throws {Error} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	this.className = function () {
		
		if(arguments.length === 0) { return _className;}
		
		else {
			
			throw new Error('Illegal parameter: className is read-only');
		}
	};
	
	
	/** Gets unique account ID. ID can only be set from within the object itself.
	*
	* (Method realization required by ISerializable)
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
			
			if (obj_email.constructor === app.Email) {
				
				_email = obj_email;
			}
			
			else if (obj_email._className === 'Email' && typeof obj_email._id !== 'undefined') { // setting unresolved object reference when called from readObject()
				
				_email = obj_email;
			}
			
			else {
				
				throw new IllegalArgumentError('Wrong type: Email must be an instance of the Email class')
			}
		}
		
		return _email;
	}
	
	
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
			
			if (obj_password !== null) { // Deserialization may create call with null, ignore
				
				//if (!/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/.test(str_password)) {
					
				if (obj_password.constructor === app.Password) {

					_password = obj_password;
				}

				else if (obj_password._className === 'Password' && typeof obj_password._id !== 'undefined') { // setting unresolved object reference when called from readObject()
				
				_password = obj_password;
			}
				
				else {
					
					throw new IllegalArgumentError('Password must be instance of class Password');
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
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation any way in order to expose list to default IObservable methods
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
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
	
	
	/** Converts person to JSON object
	*
	* (Method realization required by ISerializable.)
	*
	* @return {Object} JSON object representation of person (used to override default behaviour of JSON.stringify())
	*/
	
	this.toJSON = function() { // we need private access so no prototype inheritance here
		
		return {
			
			_className: 'Account',
			
			_id: _id,
			
			_email: _email ? {_className: _email.className(), _id: _email.id()} : undefined,
			
			_password: _password ? {_className: _password.className(), _id: _password.id()} : undefined,

			_accountHolder: _accountHolder ? {_className: _accountHolder.className(), _id: _accountHolder.id()} : undefined
		};
	};
	
	
	
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

/** Provides registry and unique object ID services to this class  */

app.Account.registry = new app.ObjectRegistry(app.Account, 'Account');


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObservable, app.Account);

void app.InterfaceHelper.mixInto(app.ISerializable, app.Account);

app.Account.registry.clear(); // remove objects created by mixInto()