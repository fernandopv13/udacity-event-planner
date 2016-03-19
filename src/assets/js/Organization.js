'use strict';

var app = app || {}; // create a simple namespace for the app

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/**********************************************************************************************
	* public class Organization implements IHost, extends Model
	**********************************************************************************************/

	/** @classdesc Describes an organization that may host an event.
	*
	* See 'polymorphic', inner helper 'constructors' for supported signatures.
	*
	* @constructor
	*
	* @implements IHost
	*
	* @extends Model
	*
	* @return {Organization} An organization
	*
	* @author Ulrik H. Gade, January 2016
	*/

	module.Organization = function(str_name) {
		
		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

		this.className = 'Organization';

		this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
			
		this.ssuper = module.Model;

		
		/** Initialize instance members inherited from parent class*/
		
		module.Model.call(this);
		

		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
		// Any strong typing is enforced by the setter methods.
			
		var _name;

		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields
		*---------------------------------------------------------------------------------------*/

		/** Gets or sets name
		*
		* @param {String} name The organization's name (optional, supply if setting)
		*
		* @return {String} The organization's name
		*/
		
		this.name = function (str_name) {
			
			if (arguments.length !== 0) {
				
				_name = str_name;
			}
			
			return _name;
		}
		

		/*----------------------------------------------------------------------------------------
		* Public instance methods (beyond accessors)
		*---------------------------------------------------------------------------------------*/
		
		/** Gets or sets host name
		*
		* (Method realization required by IHost.)
		*
		* @param {String} name organization's name (optional, supply if setting)
		*
		* @return {String} The organization's name
		*/
		
		this.hostName = function (str_hostName) {
			
			if (arguments.length !== 0) {
				
				_name = str_hostName;
			}
			
			return _name;
		}
		

		/** Re-establishes references to complex members after they have been deserialized
		*
		* (Method realization required by ISerializable.)
		*/
		
		this.onDeserialized = function() { // Replace IDs with references to objects of that ID
			
			// required by ISerializable interface, but nothing to do here for now
			
			return true;
		}
		
			
		/** Converts Organization to JSON object
		*
		* (Method realization required by ISerializable.)
		*
		* @return {Object} JSON object representation of organization (used to override default behaviour of JSON.stringify())
		*/
			
		this.toJSON = function () { // we need private access so no prototype inheritance here
			
			//return '[1,2,3,]'; // debug
			
			return {
				
				_className: this.className(),
				
				_id: this.id(),
				
				_name: _name
			};
		};
		
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization (Parameter parsing/constructor 'polymorphism')
		*---------------------------------------------------------------------------------------*/
		
		// Make sure isInstanceOf() will return true for IHost

		this.parentList().push(module.IHost);
		

		// Define inner functions that handle 'polymorphic' constructor response to parameter parsing

		/** Constructor signature 1: Single param that is an integer => deserialize from local storage
		*
		* @param {int} id Id of the object to be re-instantiated from local storage. Overrides normal, incremental id assignment from ObjectRegistry.
		*
		* @return {Event} Returns an Event, by way of the main constructor. This function itself has no return value.
		*/

		function Organization_(int_id) {

			void this.readObject();
		}


		/** Constructor signature 2: One or more non-integer params provided => normal initialization.
		*
		* Individual params can be skipped, but only in strict reverse order.
		*
		* If present, a parameter is assigned using its accessor (for validation).
		*
		* @param {String} name The organization's name
		*
		* @return {Event} Returns an Event, by way of the main constructor. This function itself has no return value.
		*/

		function Organization__(str_name) {

			// Call accessors for any supplied params (accessors provide simple validation and error handling)
			
			if (str_name) {this.name(str_name)}
		}

		
		// Parameter parsing to invoke 'polymorphic' constructor response

		// Single param that is integer => deserialize from local storage

		if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
			
			// Read in JSON from local storage
			
			Organization_.call(this, arguments[0]);

			//void this.readObject();
		}
		
		
		// Normal instantiation

		else {
			
			// Call accessors for any supplied params (accessors provide simple validation and error handling)
			
			Organization__.call(this, str_name);

			//if (str_name) {this.name(str_name)}
		}
		
		this.constructor.registry.add(this); // Will only happend if param passing passes w/o error
	};


	/*----------------------------------------------------------------------------------------
	* Inherit from Model
	*---------------------------------------------------------------------------------------*/	

	module.Organization.prototype = Object.create(module.Model.prototype); // Set up inheritance

	module.Organization.prototype.constructor = module.Organization; // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance members (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Updates Organization instance when notified of change by observable (controller). Autosaves to local storage if available.
	*
	* (See IObserver for further documentation.)
	*
	* @param {Organization} Organization Object holding the data to update with
	*
	* @return {Boolean} true if copy was successful, else error or false
	*
	* @throws {IllegalArgumentError} If object provided is not an instance of Organization
	*
	* @throws {IllegalArgumentError} If id provided does not match that of the object being updated
	*
	* @throws {IllegalArgumentError} If any of the data provided by the source does not fit the validation criteria of the target, as managed by accessors.
	*/

	module.Organization.prototype.update = function(Organization_o, int_objId) {

		if (this.ssuper().prototype.update.call(this, arguments)) { // check whether to respond to this notification

			// Update using accessors (for validation)

			this.name(Organization_o.name());
		
			
			// Do some housekeeping (calls method in parent class, i.e. Model)

			this.ssuper().prototype.onUpdate.call(this, Organization_o);

			
			return true;
		}

		return false; // this should never happen, keeping just in case
	}
	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/

	/** Provides non-mutable, unique organization IDs (must be available before mixin in interfaces) */

	module.Organization.registry = new module.ObjectRegistry(module.Organization, 'Organization');


	/*----------------------------------------------------------------------------------------
	Mix in default methods from implemented interfaces, unless overridden by class or ancestor
	*---------------------------------------------------------------------------------------*/

	void module.IInterfaceable.mixInto(module.IHost, module.Organization);

	module.Organization.registry.clear(); // remove objects created by mixInto()

})(app);