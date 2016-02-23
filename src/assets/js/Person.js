'use strict';

var app = app || {}; // create a simple namespace for the app


/**********************************************************************************************
* public class Perosn extends Model
**********************************************************************************************/

/** @classdesc Describes a person who may host and/or participate in an event.
*
* @constructor
*
* @implements IHost
*
* @extends Model
*
* @param {String} name The full name of the person
*
* @param {Organization} employer The person's employer
*
* @param {String} jobTitle The person's job title
*
* @param {Email} email The person's email
*
* @param {Date} birthday The person's birthday
*
* @return {Person} A Person instance
*
* @author Ulrik H. Gade, December 2015/January 2016
*
* @throws Same errors as parameter accessors if passing in invalid data.
*/

app.Person = function(str_name, Organization_employer, str_jobTitle, Email_email, Date_birthday, str_imgUrl) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

	this.className = 'Person';

	this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
		
	this.ssuper = app.Model;

	
	/** Initialize instance members inherited from parent class*/
	
	app.Model.call(this);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.Person);

	this.parentList().push(app.IHost);
	

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// Any strong typing is enforced by the setter methods.
		
	//var	_className = 'Person', // (String) Name of this class

	//_id, // (int) Unique person ID obtaining from Person object registry
	
	var _name,
	
	_employer,
	
	_jobTitle,
	
	_email,

	_birthday,

	_imgUrl; // URL to avatar image for person
	
	//_implements = [app.IHost, app.IInterfaceable, app.Model, app.IObservable, app.IObserver, app.ISerializable]; // list of interfaces implemented by this class (by function reference)
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	//this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation any way in order to expose list to default IObservable methods
	
	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets or sets the person's birthday
	*
	* @description Takes a single parameter when setting: either a Date object or a valid date string.
	*
	* @param {Date} start The date of the person's birth (Date representation)
	*
	* @param {String} start The date of the person's birth (String representation)
	*
	* @return {Date} The date and time when the person was born
	*/
	
	this.birthday = function(date_birthday) {
		
		if (arguments.length !== 0) {
			
			if (date_birthday !== null) {
				
				if (date_birthday.constructor === Date) { // date as Date; default form
					
					_birthday = date_birthday;
				}
				
				else if (!isNaN(Date.parse(date_birthday))) { // date as string; mostly used to parse in from JSON
					
					_birthday = new Date(date_birthday);
				}
				
				else {
					
					throw new TypeError('Birthday must be Date');
				}
			} // silently ignore null
		}
		
		return _birthday;
	};


	/** Gets name of object's class. Class name is read-only.
	*
	* (Method realization required by ISerializable.)
	*
	* @return {String} name The name of the object's class
	*	
	* @throws {Error} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	/*
	this.className = function () {
		
		if (arguments.length === 0) { return _className;}
		
		else {
			
			throw new Error('Illegal parameter: className is read-only');
		}
	};
	*/
		
	
	/** Gets or sets email
	*
	* @param {Email} email The person's current email (optional, supply if setting)
	*
	* @return {Email} The person's current email
	*
	* @throws {TypeError} If attempting to set email not of class Email
	*/
	
	this.email = function (Email_email) {
		
		if (arguments.length !== 0) {
			
			if (Email_email === null || Email_email === '') { // reset email

				_email = null;
			}

			else if (Email_email.constructor === app.Email) { // normal setter
				
				_email = Email_email;
			}
			
			else if (Email_email._className === 'Email' && typeof Email_email._id !== 'undefined') { // setting unresolved object reference when called from readObject()
				
				_email = Email_email;
			}
						
			else {
				
				throw new TypeError('Wrong type: Email must be an instance of the Email class')
			}
		}
		
		return _email;
	}
	
	
	/** Gets or sets employer
	*
	* @param {Organization} employer The person's current employer (optional, supply if setting)
	*
	* @return {Organization} The person's current employer
	*
	* @throws {TypeError} If attempting to set employer not of class Employer
	*/
	
	this.employer = function (Organization_employer) {
		
		if (arguments.length !== 0) {
			
			if (Organization_employer === null || Organization_employer === '') { // reset employer

				_employer = null;
			}

			else if (Organization_employer.constructor === app.Organization) { // normal setter
				
				_employer = Organization_employer;
			}
			
			else if (Organization_employer._className === 'Organization' && typeof Organization_employer._id !== 'undefined') { // setting unresolved object reference when called from readObject()
				
				_employer = Organization_employer;
			}
			
			else {
				
				throw new TypeError('Employer must be Organization')
			}
		}
		
		return _employer;
	}
	
	
	/** Gets or sets host name (implementing IHOST)
	*
	* @param {String} name The person's full name (optional, supply if setting)
	*
	* @return {String} The person's full name
	*/
	
	this.hostName = function (str_hostName) {
		
		if (arguments.length !== 0) {
			
			_name = str_hostName;
		}
		
		return _name;
	}
	

	/** Gets unique person ID. ID can only be set from within the object itself.
	*
	* (Method realization required by ISerializable.)
	*
	* @return {int} An integer, if called with no parameters
	*	
	* @throws {Error} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	/*
	this.id = function () {
		
		if (arguments.length === 0) { return _id;}
		
		else {
			
			throw new Error('Illegal parameter: id is read-only');
		}
	};
	*/
	
	
	/** Gets or sets URL to portrait image (avatar)
	*
	* @param {String} imageUrl The URL to the image file
	*
	* @return {String} The URL to the image file
	*/
	
	this.imgUrl = function (str_imgUrl) {
		
		if (arguments.length !== 0) {
			
			_imgUrl = str_imgUrl;
		}
		
		return _imgUrl;
	}


	/** Gets or sets job title
	*
	* @param {String} jobTitle The person's job title (optional, supply if setting)
	*
	* @return {String} The person's job title
	*/
	
	this.jobTitle = function (str_jobTitle) {
		
		if (arguments.length !== 0) {
			
			_jobTitle = str_jobTitle;
		}
		
		return _jobTitle;
	}


	/** Gets or sets name
	*
	* @param {String} name The person's full name (optional, supply if setting)
	*
	* @return {String} The person's full name
	*/
	
	this.name = function (str_name) {
		
		if (arguments.length !== 0) {
			
			_name = str_name;
		}
		
		return _name;
	}
	

	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond simple accessors)
	*---------------------------------------------------------------------------------------*/


	/** Returns true if class implements the interface passed in (by function reference)
	*
	* (See IInterfaceable for further documentation.)
	*/
	
	/*
	this.isInstanceOf = function (func_interface) {
		
		return _implements.indexOf(func_interface) > -1;
	};*/



	/** Re-establishes references to complex members after they have been deserialized
	*
	* (Method realization required by ISerializable.)
	*/
	
	this.onDeserialized = function() { // Replace IDs with references to objects of that ID
		
		// Verify that properties exist and are likely to be temporary literals left by readObject();
		
		if (_email && _email.constructor !== app.Email && _email._className === 'Email') {
			
			_email = app.Email.registry.getObjectById(_email._id)
		}
		
		if (_employer && _employer.constructor !== app.Organization && _employer._className === 'Organization') {
			
			_employer = app.Organization.registry.getObjectById(_employer._id);
		}
		
		return true;
	}
	
	
	/** Converts person to JSON object
	*
	* (Method realization required by ISerializable.)
	*
	* @return {Object} JSON object representation of person (used to override default behaviour of JSON.stringify())
	*/
	
	this.toJSON = function () { // we need private access so no prototype inheritance here
		
		return {
			
			_className: this.className(),
			
			_id: this.id(),
			
			_name: _name,

			_imgUrl: _imgUrl,
			
			_employer: _employer ? {_className: _employer.className(), _id: _employer.id()} : undefined,
			
			_jobTitle: _jobTitle,

			_email: _email ? {_className: _email.className(), _id: _email.id()} : undefined,
			
			_birthday: _birthday
		};
	};
	
	
	/** Updates person when notified of change by observable (controller). Autosaves to local storage if available.
	*
	* (See IObserver for further documentation.)
	*
	* @param {Person} person Object holding the data to update this person with
	*
	* @return {Boolean} true if copy was successful, else error or false
	*
	* @todo Not implemented
	*/

	this.update = function(Person_person, int_objId) {

		if (Person_person.constructor !== app.Person) { // wrong class

			throw new IllegalArgumentError('Object must be instance of Person');
		}

		else if (this.id() !== int_objId) { // id mismatch

			throw new IllegalArgumentError('Objects IDs don\'t match');
		}

		else {

			// Update using accessors for validation

			this.name(Person_person.name());

			this.employer(Person_person.employer() ? Person_person.employer() : null);

			this.jobTitle(Person_person.jobTitle());

			this.email(Person_person.email() ? Person_person.email() : null);

			this.birthday(Person_person.birthday() ? Person_person.birthday() : null);

			
			// Do some housekeeping (calls method in parent class)

			this.ssuper().prototype.update.call(this, Person_person);
			

			return true;
		}

		return false;
	}


	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
	
	// Single param that is integer => deserialize from local storage

	if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
		
		// Reset original ID (expected by readObject())
	
		//_id = arguments[0];
		
		
		// Read in JSON from local storage
		
		void this.readObject();
	}
	
	
	// Normal instantiation

	else {
	
		// Set unique ID
		
		//_id = this.constructor.registry.getNextId();
		
		
		// Call accessors for any supplied params (accessors provide simple validation and error handling)
		
		if (str_name) {this.name(str_name);}
				
		if (Organization_employer) {this.employer(Organization_employer);}
		
		if (str_jobTitle) {this.jobTitle(str_jobTitle);}
		
		if (Email_email) {this.email(Email_email);}

		if (Date_birthday) {this.birthday(Date_birthday);}
	}
	
	this.constructor.registry.add(this); // Will only happend if param passing passes w/o error
};


/*----------------------------------------------------------------------------------------
* Inherit from Model
*---------------------------------------------------------------------------------------*/	

app.Person.prototype = Object.create(app.Model.prototype); // Set up inheritance

app.Person.prototype.constructor = app.Person; // Reset constructor property


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Provides registry and unique object ID services to this class (must be available before mixin in interfaces)  */

app.Person.registry = new app.ObjectRegistry(app.Person, 'Person');


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IHost, app.Person);

app.Person.registry.clear(); // remove objects created by mixInto()


