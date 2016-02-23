'use strict';

var app = app || {}; // create a simple namespace for the app


/**********************************************************************************************
* public class IHost implements IHost, extends Model
**********************************************************************************************/

/** @classdesc Describes an organization that may host an event.
*
* @constructor
*
* @implements IHost
*
* @extends Model
*
* @param {String} name The organization's name
*
* @return {Organization} An organization
*
* @author Ulrik H. Gade, January 2016
*/

app.Organization = function(str_name) {
	
	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals to be used as defaults by, and replaced with, accessors by parent class constructor.

	this.className = 'Organization';

	this.id = (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) ? arguments[0] : this.constructor.registry.getNextId();
		
	this.ssuper = app.Model;

	
	/** Initialize instance members inherited from parent class*/
	
	app.Model.call(this);
	

	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.Organization);

	this.parentList().push(app.IHost);
	

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// Any strong typing is enforced by the setter methods.
		
	//var	_className = 'Organization', // (String) Name of this class
	
	//_id, // (int) Unique organization ID obtaining from Organization object registry
	
	var _name;

	//_implements = [app.IHost, app.IInterfaceable, app.Model, app.IObservable, app.IObserver, app.ISerializable];  // list of interfaces implemented by this class (by function reference)
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	//this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation any way in order to expose list to default IObservable methods
	
	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

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
	
	
	/** Gets unique organization ID. ID can only be set from within the object itself.
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
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	// None so far
	
	
	
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
	

	/** Returns true if class implements the interface passed in (by function reference)
	*
	* (Method realization required by IInterfaceable.)
	*
	* @param {Function} interface The interface we wish to determine if this class implements
	*
	* @return {Boolean} instanceof True if class implements interface, otherwise false
	*	
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
		
		// required by ISerializable interface, but nothing to do here for now
		
		return true;
	}
	

	/** Updates Organization when notified of change by observable (controller). Autosaves to local storage if available.
	*
	* (See IObserver for further documentation.)
	*
	* @param {Organization} organization Object holding the data to update this event with
	*
	* @return {Boolean} true if copy was successful, else error or false
	*
	* @todo Not implemented
	*/

	//app.Organization.prototype.update = function(Account_account, int_objId) {}

		
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
		
		//_id = this.constructor.registry.getNextId();  // Set unique ID
		
		
		// Call accessors for any supplied params (accessors provide simple validation and error handling)
		
		if (str_name) {this.name(str_name)}
	}
	
	this.constructor.registry.add(this); // Will only happend if param passing passes w/o error
};


/*----------------------------------------------------------------------------------------
* Inherit from Model
*---------------------------------------------------------------------------------------*/	

app.Organization.prototype = Object.create(app.Model.prototype); // Set up inheritance

app.Organization.prototype.constructor = app.Organization; // Reset constructor property


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Provides non-mutable, unique organization IDs (must be available before mixin in interfaces) */

app.Organization.registry = new app.ObjectRegistry(app.Organization, 'Organization');


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IHost, app.Organization);

app.Organization.registry.clear(); // remove objects created by mixInto()


