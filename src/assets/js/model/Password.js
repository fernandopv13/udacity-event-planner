'use strict'; // Not in functions to make it easier to remove by build process

var app = app || {}; // create a simple namespace for the app

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/**********************************************************************************************
	* public class Password extends Model
	**********************************************************************************************/

	/** @classdesc Describes a password.
	*
	* See polymorphic, inner helper 'constructors' for supported signatures.
	*
	* @constructor
	*
	* @extends Model
	*
	* @return {Password} A password
	*
	* @throws Same errors as password accessor if passing in invalid data.
	*
	* @author Ulrik H. Gade, January 2016
	*
	* @todo Move as many non-accessor methods as possible from the object itself to the function prototype.
	*/

	module.Password = function(str_password) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

		this.className = 'Password';

		this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
			
		this.ssuper = module.Model;

		
		/** Initialize instance members inherited from parent class*/
		
		module.Model.call(this);
		

		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
		// Any strong typing is enforced by the setter methods.
			
		var _password; // (String) A string containing the password address.

		
		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields
		*---------------------------------------------------------------------------------------*/

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
							
						if (module.Password.hasValidCharacterCount(str_password)) {

							if(module.Password.hasValidUpperCaseCount(str_password)) {

								if (module.Password.hasValidLowerCaseCount(str_password)) {

									if (module.Password.hasValidNumberCount(str_password)) {

										if (module.Password.hasValidPunctuationCount(str_password)) {

											if (!module.Password.hasIllegalCharacters(str_password)) {

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
		* Other initialization (parameter parsing/constructor 'polymorphism')
		*---------------------------------------------------------------------------------------*/
		
			// Define inner functions that handle 'polymorphic' constructor response to parameter parsing

			/** Constructor signature 1: Single param that is an integer => deserialize from local storage
			*
			* @param {int} id Id of the object to be re-instantiated from local storage. Overrides normal, incremental id assignment from ObjectRegistry.
			*
			* @return {Password} Returns a Password, by way of the main constructor. This function itself has no return value.
			*/

			function Password_(int_id) {

				void this.readObject();
			}


			/** Constructor signature 2: One or more non-integer params provided => normal initialization.
			*
			* Individual params can be skipped, but only in strict reverse order.
			*
			* If present, a parameter is assigned using its accessor (for validation).
			*
			* @param {String} password A string containing the password. If present, creates new Object from scratch.
			*
			* @return {Password} Returns a Password, by way of the main constructor. This function itself has no return value.
			*/

			function Password__(str_password) {

				// Call accessors for any supplied params (accessors provide simple validation and error handling)
				
				if (str_password) {this.password(str_password)} // Set password
			}

			
			// Parameter parsing to invoke polymorphic constructor response

			// Single param that is integer => deserialize from local storage

			if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
				
				// Read in JSON from local storage
				
				Password_.call(this, arguments[0]);

				//void this.readObject();
			}
			
			
			// Normal instantiation

			else {
				
				// Call accessors for any supplied params (accessors provide simple validation and error handling)
				
				Password__.call(this, str_password);

				//if (str_password) {this.password(str_password)} // Set password
			}
			
			this.constructor.registry.add(this); // Will only happend if param parsing passes w/o error
		};


	/*----------------------------------------------------------------------------------------
	* Inherit from Model
	*---------------------------------------------------------------------------------------*/	

		module.Password.prototype = Object.create(module.Model.prototype); // Set up inheritance

		module.Password.prototype.constructor = module.Password; // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance members (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Updates Password instance when notified of change by observable (controller). Autosaves to local storage if available.
		*
		* (See IObserver for further documentation.)
		*
		* @param {Password} Password Object holding the data to update from
		*
		* @return {Boolean} true if update was successful, else error or false
		*
		* @throws {IllegalArgumentError} If object provided is not an instance of Password
		*
		* @throws {IllegalArgumentError} If id provided does not match that of the object being updated
		*
		* @throws {IllegalArgumentError} If any of the data provided by the source does not fit the validation criteria of the target, as managed by accessors.
		*/

		module.Password.prototype.update = function(Password_p, int_id) {

			if (this.ssuper().prototype.update.call(this, Password_p, int_id)) { // check whether to respond to this notification

				// Update using accessors (for validation)
			
				this.password(Password_p.password());
			
				
				// Do some housekeeping (calls method in parent class, i.e. Model)

				this.ssuper().prototype.onUpdate.call(this, Password_p);

				
				return true;
			}

			return false; // this should never happen, keeping just in case
		}


	/*----------------------------------------------------------------------------------------
	* Public class (static) fields
	*---------------------------------------------------------------------------------------*/

		/** Provides non-mutable, unique password IDs */

		module.Password.registry = new module.ObjectRegistry(module.Password, 'Password');



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

		module.Password.hasValidCharacterCount = function(str_password) {return str_password.length > 7};


		/** Determines if a string contains the number of uppercase characters required from a valid password.
		*
		* @param {String} password The Password
		*
		* @return {Boolean} True if the string passes the test.
		*/

		module.Password.hasValidUpperCaseCount = function(str_password) {return (/[A-Z]/g).test(str_password)};


		/** Determines if a string contains the number of lowercase characters required from a valid password.
		*
		* @param {String} password The Password
		*
		* @return {Boolean} True if the string passes the test.
		*/

		module.Password.hasValidLowerCaseCount = function(str_password) {return (/[a-z]/g).test(str_password)};


		/** Determines if a string contains the number of numerical characters required from a valid password.
		*
		* @param {String} password The Password
		*
		* @return {Boolean} True if the string passes the test.
		*/

		module.Password.hasValidNumberCount = function(str_password) {return (/[0-9]/g).test(str_password)};


		/** Determines if a string contains the number of non-alphanum characters required from a valid password.
		*
		* @param {String} password The Password
		*
		* @return {Boolean} True if the string passes the test.
		*/

		module.Password.hasValidPunctuationCount = function(str_password) {return (/[\!\@\#\$\%\^\&\*]/g).test(str_password)};


		/** Determines if a string contains characters that are not allowed in a valid password.
		*
		* @param {String} password The Password
		*
		* @return {Array} Array with any illegal characters found, or null.
		*/

		module.Password.hasIllegalCharacters = function(str_password) {return str_password.match(/[^A-z0-9\!\@\#\$\%\^\&\*]/g)};

})(app);