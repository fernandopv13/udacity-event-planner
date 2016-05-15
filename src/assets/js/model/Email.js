'use strict'; // Not in functions to make it easier to remove by build process

var app = app || {}; // create a simple namespace for the app

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/**********************************************************************************************
	* public class Email extends Model
	**********************************************************************************************/

	/** @classdesc Describes an email address.
	*
	* See polymorphic, inner helper 'constructors' for supported signatures.
	*
	* @constructor
	*
	* @extends Model
	**
	* @return {Email} An email
	*
	* @throws Same errors as address accessor if passing in invalid data.
	*
	* @author Ulrik H. Gade, May 2016
	*
	* @todo Move as many non-accessor methods as possible from the object itself to the function prototype.
	*/

	module.Email = function(str_address) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

		this.className = 'Email';

		this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
			
		this.ssuper = module.Model;

		
		/** Initialize instance members inherited from parent class*/
		
		module.Model.call(this);
		

		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
		// Any strong typing is enforced by the setter methods.
			
		var _address, // (String) A string containing the email address.
		
		_isValid = null; // (Boolean) true if email's validity, true or false, has been set (i.e. verified) manually. A null value indicates that the address has not been verified.
		
		
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
			

			/** Re-establishes references to complex members after they have been deserialized
			*
			* (Method realization required by ISerializable.)
			*/
			
			this.onDeserialized = function() { // Replace IDs with references to objects of that ID
				
				// required by ISerializable interface, but nothing to do here for now
				
				return true;
			}
			

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
		* Other initialization
		*---------------------------------------------------------------------------------------*/
		
			// Define inner functions that handle polymorphic constructor response to parameter parsing

			/** Constructor signature 1: Single param that is an integer => deserialize from local storage
			*
			* @param {int} id Id of the object to be re-instantiated from local storage. Overrides normal, incremental id assignment from ObjectRegistry.
			*
			* @return {Email} Returns an Email, by way of the main constructor. This function itself has no return value.
			*/

			function Email_(int_id) {

				void this.readObject();
			}


			/** Constructor signature 2: One or more non-integer params provided => normal initialization.
			*
			* Individual params can be skipped, but only in strict reverse order.
			*
			* If present, a parameter is assigned using its accessor (for validation).
			*
			* @param {String} address A string containing the email address. If present, creates new Object from scratch.
			*
			* @return {Email} Returns an Email, by way of the main constructor. This function itself has no return value.
			*/

			function Email__(str_address) {

				// Call accessors for any supplied params (accessors provide simple validation and error handling)
				
				if (str_address) {this.address(str_address)} // Set address
			}


			// Parameter parsing to invoke 'polymorphic' constructor response

			// Single param that is integer => deserialize from local storage

			if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
				
				// Read in JSON from local storage
				
				Email_.call(this, arguments[0]);

				//void this.readObject();
			}
			
			
			// Normal instantiation

			else {
				
				// Call accessors for any supplied params (accessors provide simple validation and error handling)
				
				//if (str_address) {this.address(str_address)} // Set address

				Email__.call(this, str_address);
			}
			
			this.constructor.registry.add(this); // Will only happend if param passing passes w/o error
	};


	/*----------------------------------------------------------------------------------------
	* Inherit from Model
	*---------------------------------------------------------------------------------------*/	

		module.Email.prototype = Object.create(module.Model.prototype); // Set up inheritance

		module.Email.prototype.constructor = module.Email; // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance members (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Updates Email when notified of change by observable (controller). Autosaves to local storage if available.
		*
		* (See IObserver for further documentation.)
		*
		* @param {Email} email Object holding the data to update from
		*
		* @return {Boolean} true if copy was successful, else error or false
		*
		* @throws {IllegalArgumentError} If object provided is not an instance of Email
		*
		* @throws {IllegalArgumentError} If id provided does not match that of the object being updated
		*
		* @throws {IllegalArgumentError} If any of the data provided by the source does not fit the validation criteria of the target, as managed by accessors.
		*/

		module.Email.prototype.update = function(Email_e, int_id) {

			if (this.ssuper().prototype.update.call(this, Email_e, int_id)) { // check whether to respond to this notification

				// Update using accessors (for validation)

				this.address(Email_e.address());
			
				
				// Do some housekeeping (calls method in parent class, i.e. Model)

				this.ssuper().prototype.onUpdate.call(this, Email_e);

				
				return true;
			}

			return false; // this should never happen, keeping just in case
		}

	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/

		/** Provides non-mutable, unique email IDs */

		module.Email.registry = new module.ObjectRegistry(module.Email, 'Email');

})(app);