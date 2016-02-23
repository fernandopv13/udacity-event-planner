'use strict'; // Not in functions to make it easier to remove by build process

var app = app || {}; // create a simple namespace for the app


/**********************************************************************************************
* public class Email extends Model
**********************************************************************************************/

/** @classdesc Describes an email address.
*
* @constructor
*
* @extends Model
**
* @return {Email} An email
*
* @param {String} address A string containing the email address. If present, creates new Object from scratch.
*
* @param {Object} address A JSON object containing the data for an email retrieved from storage. If present, de-serializes email with original ID.
*
* @throws Same errors as address accessor if passing in invalid data.
*
* @author Ulrik H. Gade, January 2016
*/

app.Email = function(str_address) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

	this.className = 'Email';

	this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
		
	this.ssuper = app.Model;

	
	/** Initialize instance members inherited from parent class*/
	
	app.Model.call(this);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.Email);
	

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// Any strong typing is enforced by the setter methods.
		
	//var	_className = 'Email', // (String) Name of this class
	
	//_id, // (int) Unique email ID obtained from Email object registry
	
	var _address, // (String) A string containing the email address.
	
	_isValid = null; // (Boolean) true if email's validity, true or false, has been set (i.e. verified) manually. A null value indicates that the address has not been verified.
	
	//_implements = [app.IInterfaceable, app.Model, app.IObservable, app.IObserver, app.ISerializable];  // list of interfaces implemented by this class (by function reference)


	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	//this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation any way in order to expose list to default IObservable methods
	
	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/
	
	/** Gets or sets email address
	*
	* @param {String} address The email address (optional, supply if setting)
	*
	* @param {null} null If resetting the email address
	*
	* @return {String} The email address
	*/
	
	this.address = function (str_address) {
		
		if (arguments.length !== 0) {
			
			_address = str_address;
			
			_isValid = null; // reset validation
		}
		
		return _address;


	}


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
		
		if(arguments.length === 0) { return _className;}
		
		else {
			
			throw new Error('Illegal parameter: className is read-only');
		}
	};
	*/
	
	
	/** Gets unique email ID. ID can only be set from within the object itself.
	*
	* (Method realization required by ISerializable.)
	*
	* @return {int} An integer, if called with no parameters
	*	
	* @throws {Error} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	/*
	this.id = function () {
		
		if(arguments.length === 0) { return _id;}
		
		else {
			
			throw new Error('Illegal parameter: id is read-only');
		}
	};
	*/
	
	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	// None so far
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	
	/** Tests if email address is likely to be standards compliant.
	*
	* NOTE: Fully standards compliant email validation is seriously involved, and still won't guarantee that the address works without trying to send an actual email to it.
	* Therefore the approach taken here is to keep it simple on the client, and that we would rather risk accepting a potentially invalid email than reject a valid one because of a false validation negative, barring a few very exotic exceptions.
	*
	* @param {Boolean} isValid If present, sets the internal value to the parameter and thereafter overrides the validation logic. If null, resets the manual override.
	*
	* @return {Boolean} true if likely to be valid, or manually set to true, otherwise false
	*
	*@todo Evalute validation approach taken here against that provided by the HTML5 email input type in the browser.
	*/
	
	this.isValid = function (bool_isValid) {
		
		if (arguments.length > 0) { // invoked with parameter, so override manually
		
			if (bool_isValid === null) { // reset manual override
				
				_isValid = bool_isValid;
				
				return _isValid;
			}
			
			else if (bool_isValid.constructor === Boolean) { // parameter is valid
				
				_isValid = bool_isValid;
				
				return _isValid;
			}
			
			else {
				
				throw new TypeError('Parameter must be Boolean or null');
			}
			
		}
		
		else { // invoked w/o parameter
		
			if (_isValid !== null) { // manual override has been applied
				
				return _isValid;
			}
			
			else { // estimate validity based on simple regex
				
				return (/\S+@\S+\.\S+/).test(this.address()); // i.e. address has an '@', an arbitrary string before and after the @, and at least one period after the @
			}
		}
		
	};
	
	
	/** Reports whether email address has been manually confirmed as either valid or invalid
	*
	* @return {Boolean} true if address validity has been manually confirmed, otherwise false
	*/
	
	this.isConfirmed = function(){
		
		return _isValid !== null ? true : false;
	};
	

	/** Returns true if class implements the interface passed in (by function reference)
	*
	* (See IInterfaceable for further documentation.)
	*/
	
	/*this.isInstanceOf = function (func_interface) {
		
		return _implements.indexOf(func_interface) > -1;
	};*/


	
	/** Re-establishes references to complex members after they have been deserialized
	*
	* (Method realization required by ISerializable.)
	*/
	
	this.onDeserialized = function() { // Replace IDs with references to objects of that ID
		
		// required by ISerializable interface, but nothing to do here for now
		
		return true;
	}
	

	/** Updates email when notified of change by observable (controller). Autosaves to local storage if available.
	*
	* (See IObserver for further documentation.)
	*
	* @param {Email} email Object holding the data to update this email with
	*
	* @return {Boolean} true if copy was successful, else error or false
	*
	* @todo Not implemented
	*/

	//app.Email.prototype.update = function(Email_email, int_objId) {}

	
	/** Converts email to JSON object
	*
	* (Method realization required by ISerializable.)
	*
	* @return {Object} JSON object representation of email (used to override default behaviour of JSON.stringify())
	*/
	
	this.toJSON = function () { // we need private access so no prototype inheritance here
		
		return {
			
			_className: this.className(),
			
			_id: this.id(),
			
			_address: _address,
			
			_isValid: _isValid
		};
	};
	
	
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
		
		if (str_address) {this.address(str_address)} // Set address
	}
	
	this.constructor.registry.add(this); // Will only happend if param passing passes w/o error
};


/*----------------------------------------------------------------------------------------
* Inherit from Model
*---------------------------------------------------------------------------------------*/	

app.Email.prototype = Object.create(app.Model.prototype); // Set up inheritance

app.Email.prototype.constructor = app.Email; // Reset constructor property


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Provides non-mutable, unique email IDs */

app.Email.registry = new app.ObjectRegistry(app.Email, 'Email');