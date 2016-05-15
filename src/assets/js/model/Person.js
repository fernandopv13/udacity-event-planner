'use strict';

var app = app || {}; // create a simple namespace for the app


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/**********************************************************************************************
	* public class Person extends Model
	**********************************************************************************************/

	/** @classdesc Describes a person who may host and/or participate in an event.
	*
	* See polymorphic, inner helper 'constructors' for supported signatures.
	*
	* @constructor
	*
	* @implements IHost
	*
	* @extends Model
	*
	* @return {Person} A Person instance
	*
	* @author Ulrik H. Gade, May 2016
	*
	* @throws Same errors as parameter accessors if passing in invalid data.
	*
	* @todo Move as many non-accessor methods as possible from the object itself to the function prototype.
	*/

	module.Person = function(str_name, Organization_employer, str_jobTitle, Email_email, Date_birthday, str_imgUrl) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

		this.className = 'Person';

		this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
			
		this.ssuper = module.Model;

		
		/** Initialize instance members inherited from parent class*/
		
		module.Model.call(this);
		

		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
		// Any strong typing is enforced by the setter methods.
			
		var _name,
		
		_employer,
		
		_jobTitle,
		
		_email,

		_birthday,

		_imgUrl; // URL to avatar image for person
		
		
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

				else if (Email_email.constructor === module.Email) { // normal setter
					
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

				else if (Organization_employer.constructor === module.Organization) { // normal setter
					
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

		/** Re-establishes references to complex members after they have been deserialized
		*
		* (Method realization required by ISerializable.)
		*/
		
		this.onDeserialized = function() { // Replace IDs with references to objects of that ID
			
			// Verify that properties exist and are likely to be temporary literals left by readObject();
			
			if (_email && _email.constructor !== module.Email && _email._className === 'Email') {
				
				_email = module.Email.registry.getObjectById(_email._id)
			}
			
			if (_employer && _employer.constructor !== module.Organization && _employer._className === 'Organization') {
				
				_employer = module.Organization.registry.getObjectById(_employer._id);
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
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization (parameter parsing/constructor polymorphism)
		*---------------------------------------------------------------------------------------*/
		
		// Make sure isInstanceOf() will return true IHost

		this.parentList().push(module.IHost);
		

		// Define inner functions that handle polymorphic constructor response to parameter parsing

		/** Constructor signature 1: Single param that is an integer => deserialize from local storage
		*
		* @param {int} id Id of the object to be re-instantiated from local storage. Overrides normal, incremental id assignment from ObjectRegistry.
		*
		* @return {Person} Returns a Person, by way of the main constructor. This function itself has no return value.
		*/

		function Person_(int_id) {

			void this.readObject();
		}


		/** Constructor signature 2: One or more non-integer params provided => normal initialization.
		*
		* Individual params can be skipped, but only in strict reverse order.
		*
		* If present, a parameter is assigned using its accessor (for validation).
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
		* @param {String} imgUrl URL to image of person to be used in lists etc. (optional)
		*
		* @return {Person} Returns a Person, by way of the main constructor. This function itself has no return value.
		*/

		function Person__(str_name, Organization_employer, str_jobTitle, Email_email, Date_birthday, str_imgUrl) {

			// Call accessors for any supplied params (accessors provide simple validation and error handling)
			
			if (str_name) {this.name(str_name);}
					
			if (Organization_employer) {this.employer(Organization_employer);}
			
			if (str_jobTitle) {this.jobTitle(str_jobTitle);}
			
			if (Email_email) {this.email(Email_email);}

			if (Date_birthday) {this.birthday(Date_birthday);}

			if (str_imgUrl) {this.imgUrl(str_imgUrl);}
		}

		
		// Parameter parsing to invoke polymorphic constructor response

		// Single param that is integer => deserialize from local storage

		if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
			
			// Read in JSON from local storage
			
			Person_.call(this, arguments[0]);

			//void this.readObject();
		}
		
		
		// Normal instantiation

		else {
		
			Person__.call(this, str_name, Organization_employer, str_jobTitle, Email_email, Date_birthday, str_imgUrl);
		}
		
		this.constructor.registry.add(this); // Will only happend if param passing passes w/o error
	};


	/*----------------------------------------------------------------------------------------
	* Inherit from Model
	*---------------------------------------------------------------------------------------*/	

	module.Person.prototype = Object.create(module.Model.prototype); // Set up inheritance

	module.Person.prototype.constructor = module.Person; // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/	

		/** Updates Person instance when notified of change by observable (controller). Autosaves to local storage if available.
		*
		* (See IObserver for further documentation.)
		*
		* @param {Person} p Object holding the data to update from
		*
		* @param {int} id Id of the person intended to receive the update
		*
		* @return {Boolean} true if copy was successful, else error or false
		*/

		module.Person.prototype.update = function(Person_p, int_id) {

			if (this.ssuper().prototype.update.call(this, Person_p, int_id)) { // check whether to respond to this notification

				// Update using accessors for validation

				this.name(Person_p.name());

				this.employer(Person_p.employer() ? Person_p.employer() : null);

				this.jobTitle(Person_p.jobTitle());

				this.email(Person_p.email() ? Person_p.email() : null);

				this.birthday(Person_p.birthday() ? Person_p.birthday() : null);

				
				// Do some housekeeping (calls method in parent class)

				this.ssuper().prototype.onUpdate.call(this, Person_p);
				

				return true;
			}

			return false;
		}


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/

	/** Provides registry and unique object ID services to this class (must be available before mixin in interfaces)  */

	module.Person.registry = new module.ObjectRegistry(module.Person, 'Person');


	/*----------------------------------------------------------------------------------------
	Mix in default methods from implemented interfaces, unless overridden by class or ancestor
	*---------------------------------------------------------------------------------------*/

	void module.IInterfaceable.mixInto(module.IHost, module.Person);

	module.Person.registry.clear(); // remove objects created by mixInto()

})(app);