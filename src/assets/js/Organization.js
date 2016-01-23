'use strict';

var app = app || {}; // create a simple namespace for the app


/***********************************************************
* public class Organization
***********************************************************/

/** @classdesc Describes an organization that may host an event.
*
* @constructor
*
* @implements IHost, ISerializable
*
* @param {String} name The organization's name
*
* @return {Organization} An organization
*
* @author Ulrik H. Gade, January 2016
*/

app.Organization = function(str_name) {
	
	
	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// Any strong typing is enforced by the setter methods.
		
	var	_className = 'Organization', // (String) Name of this class
	
	_id, // (int) Unique organization ID obtaining from Organization object registry
	
	_name;
	
	
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
	
	this.className = function () {
		
		if(arguments.length === 0) { return _className;}
		
		else {
			
			throw new Error('Illegal parameter: className is read-only');
		}
	};
	
	
	/** Gets unique organization ID. ID can only be set from within the object itself.
	*
	* (Method realization required by ISerializable.)
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
			
			_className: _className,
			
			_id: _id,
			
			_name: _name
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
		
		_id = this.constructor.registry.getNextId();  // Set unique ID
		
		
		// Call accessors for any supplied params (accessors provide simple validation and error handling)
		
		if (str_name) {this.name(str_name)}
	}
	
	this.constructor.registry.add(this); // Will only happend if param passing passes w/o error
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

/** Provides non-mutable, unique organization IDs */

app.Organization.registry = new app.ObjectRegistry(app.Organization, 'Organization');


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IHost, app.Organization);

void app.InterfaceHelper.mixInto(app.ISerializable, app.Organization);