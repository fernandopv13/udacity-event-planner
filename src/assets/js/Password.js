'use strict'; // Not in functions to make it easier to remove by build process

var app = app || {}; // create a simple namespace for the app


/**********************************************************************************************
* public class Password extends Model
**********************************************************************************************/

/** @classdesc Describes a password.
*
* @constructor
*
* @extends Model
*
* @return {Password} A password
*
* @param {String} password A string containing the password. If present, creates new Object from scratch.
*
* @param {int} id An ID for a password retrieved from storage. If present, de-serializes password with original ID.
*
* @throws Same errors as password accessor if passing in invalid data.
*
* @author Ulrik H. Gade, January 2016
*/

app.Password = function(str_password) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

	this.className = 'Password';

	this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
		
	this.ssuper = app.Model;

	
	/** Initialize instance members inherited from parent class*/
	
	app.Model.call(this);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.Password);
	
	
	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// Any strong typing is enforced by the setter methods.
		
	//var _id, // (int) Unique password ID obtained from Password object registry
	
	var _password; // (String) A string containing the password address.

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets unique password ID. ID can only be set from within the object itself.
	*
	* (Method realization required by ISerializable.)
	*
	* @return {int} An integer, if called with no parameters
	*	
	* @throws {IllegalArgumentError} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	/*
	this.id = function () {
		
		if(arguments.length === 0) { return _id;}
		
		else {
			
			throw new IllegalArgumentError('id is read-only');
		}
	};
	*/
	
	
	/** Gets or sets password
	*
	* @param {String} password The password
	*
	* @return {String} The password
	*
	* @throws {IllegalArgumentError} If attempting to set insecure password
	*/

	this.password = function (str_password) {
		
		if (arguments.length !== 0) {
			
			if (str_password !== null) { // Deserialization may create call with null, ignore
				
				//if (!/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/.test(str_password)) {
					
				if (app.Password.hasValidCharacterCount(str_password)) {

					if(app.Password.hasValidUpperCaseCount(str_password)) {

						if (app.Password.hasValidLowerCaseCount(str_password)) {

							if (app.Password.hasValidNumberCount(str_password)) {

								if (app.Password.hasValidPunctuationCount(str_password)) {

									if (!app.Password.hasIllegalCharacters(str_password)) {

										_password = str_password;
									}
									else {
										throw new IllegalArgumentError('Password contains illegal characters');
									}
								}
								else {
									throw new IllegalArgumentError('Password must contain punctuation (i.e. one or more of !@#$%^&*)');
								}
							}
							else {
								throw new IllegalArgumentError('Password must contain numbers');
							}
						}
						else {
							throw new IllegalArgumentError('Password must contain lowercase characters');
						}
					}
					else {
						throw new IllegalArgumentError('Password must contain uppercase characters');
					}
				}
				else {
					throw new IllegalArgumentError('Password must be at least 8 characters long');
				}
			}

			// else: fail silently on null
		}
		
		return _password;
	}
	

	/** Re-establishes references to complex members after they have been deserialized
	*
	* (Method realization required by ISerializable.)
	*/
	
	this.onDeserialized = function() { // Replace IDs with references to objects of that ID
		
		// required by ISerializable interface, but nothing to do here for now
		
		return true;
	}
	
	/** Updates password when notified of change by observable (controller). Autosaves to local storage if available.
	*
	* (See IObserver for further documentation.)
	*
	* @param {Password} password Object holding the data to update this event with
	*
	* @return {Boolean} true if copy was successful, else error or false
	*
	* @todo Not implemented
	*/

	//app.Password.prototype.update = function(Password_password, int_objId) {}

	
	/** Converts password to JSON object
	*
	* (Method realization required by ISerializable.)
	*
	* @return {Object} JSON object representation of password (used to override default behaviour of JSON.stringify())
	*/
	
	this.toJSON = function () { // we need private access so no prototype inheritance here
		
		return { //this may be unnecessary, try relying on standard JSON.stringify()
			
			_className: 'Password',
			
			_id: this.id(),
			
			_password: _password
		};
	};
	
	
	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
	
	// Single param that is integer => deserialize from local storage

	if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
		
		// Read in JSON from local storage
		
		void this.readObject();
	}
	
	
	// Normal instantiation

	else {
		
		// Call accessors for any supplied params (accessors provide simple validation and error handling)
		
		if (str_password) {this.password(str_password)} // Set password
	}
	
	this.constructor.registry.add(this); // Will only happend if param parsing passes w/o error
};


/*----------------------------------------------------------------------------------------
* Inherit from Model
*---------------------------------------------------------------------------------------*/	

app.Password.prototype = Object.create(app.Model.prototype); // Set up inheritance

app.Password.prototype.constructor = app.Password; // Reset constructor property



/*----------------------------------------------------------------------------------------
* Public class (static) fields
*---------------------------------------------------------------------------------------*/

/** Provides non-mutable, unique password IDs */

app.Password.registry = new app.ObjectRegistry(app.Password, 'Password');



/*----------------------------------------------------------------------------------------
* Public class (static) methods
*---------------------------------------------------------------------------------------*/

// Helper functions used for password validation in the accessor.
// Also needed when doing interactive validation in the UI.
// Using regexes provided in Udacity Web forms course.


/** Determines if a string contains the total number of characters required from a valid password.
*
* @param {String} password The Password
*
* @return {Boolean} True if the string passes the test.
*/

app.Password.hasValidCharacterCount = function(str_password) {return str_password.length > 7};


/** Determines if a string contains the number of uppercase characters required from a valid password.
*
* @param {String} password The Password
*
* @return {Boolean} True if the string passes the test.
*/

app.Password.hasValidUpperCaseCount = function(str_password) {return (/[A-Z]/g).test(str_password)};


/** Determines if a string contains the number of lowercase characters required from a valid password.
*
* @param {String} password The Password
*
* @return {Boolean} True if the string passes the test.
*/

app.Password.hasValidLowerCaseCount = function(str_password) {return (/[a-z]/g).test(str_password)};


/** Determines if a string contains the number of numerical characters required from a valid password.
*
* @param {String} password The Password
*
* @return {Boolean} True if the string passes the test.
*/

app.Password.hasValidNumberCount = function(str_password) {return (/[0-9]/g).test(str_password)};


/** Determines if a string contains the number of non-alphanum characters required from a valid password.
*
* @param {String} password The Password
*
* @return {Boolean} True if the string passes the test.
*/

app.Password.hasValidPunctuationCount = function(str_password) {return (/[\!\@\#\$\%\^\&\*]/g).test(str_password)};


/** Determines if a string contains characters that are not allowed in a valid password.
*
* @param {String} password The Password
*
* @return {Array} Array with any illegal characters found, or null.
*/

app.Password.hasIllegalCharacters = function(str_password) {return str_password.match(/[^A-z0-9\!\@\#\$\%\^\&\*]/g)};



