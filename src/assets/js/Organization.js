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
	
	this.parentList().push(app.Organization);

	this.parentList().push(app.IHost);
	

	// Single param that is integer => deserialize from local storage

	if (arguments.length === 1 && parseInt(arguments[0]) === arguments[0]) {
		
		// Read in JSON from local storage
		
		void this.readObject();
	}
	
	
	// Normal instantiation

	else {
		
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


