'use strict';

var app = app || {}; // create a simple namespace for the module


/*********************************************************************************************
* public abstract class Model implements IInterfaceable, IObserable, IObserver, ISerializable
*********************************************************************************************/

/** @classdesc Abstract base class for the 'M' part of our MVC framework. Holds information about data in the app.
*
* Enables loosely coupled messaging among main MVC collaborators.
*
* Interfaces implemented as mixins, using static method in IInterface:
*
* Please see individual interfaces for documentation of methods that have a default implementation.
*
* @implements IInterfaceable
*
* @implements IObservable
*
* @implements IObserver
*
* @implements ISerializable
*
* @constructor
*
* @return {Model} Not supposed to be instantiated, except when extended by subclasses.
*
* @author Ulrik H. Gade, February 2016
*
* @todo: Try to pull some of the boilerplate initialization (e.g. retrieval from storage) from subclasses up into this (the parent)
*/

app.Model = function() {
	
	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/

	var _className = (this.className ? this.className : 'Model'), // name of this view class (override if provided by subclass constructor)

	_id = (this.id >= 0 ? this.id: undefined), // (int) Unique object ID obtained from object class' registry

	_observers = [], // Array of IObservers receiving updates from this view, required in order to implement IObservable

	_parentList = [app.IInterfaceable, app.IObservable, app.IObserver, app.ISerializable, app.Model, this.constructor], // list of interfaces implemented by this class (by function reference)
	
	// try adding this.constructor to parentList to relieve subclasses from this task

	_super = (this.ssuper ? this.ssuper : Object); // reference to immediate parent class (by function) if provided by subclass, otherwise Object 

	
	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields (dependency injection enables access for subclasses)
	*---------------------------------------------------------------------------------------*/

	this.className = new app.Accessor(_className, true); // replace temporary literal with read-only accessor

	this.id = new app.Accessor(_id, true);

	this.observers = new app.Accessor(_observers, true);

	this.parentList = new app.Accessor(_parentList, true);
	
	this.ssuper = new app.Accessor(_super, true); // 'super' may be a reserved word, so slight name change
	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	// none so far
}


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IInterfaceable, app.Model);

void app.IInterfaceable.mixInto(app.IObservable, app.Model);

void app.IInterfaceable.mixInto(app.IObserver, app.Model);

void app.IInterfaceable.mixInto(app.ISerializable, app.Model);


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/


/** Returns true if class is or extends the class, or implements the interface, passed in (by function reference)
*
* (See IInterfaceable for further documentation.)
*/

app.Model.prototype.isInstanceOf = function (func_interface) {
	
	return this.parentList().indexOf(func_interface) > -1;
};


/** Does housekeeping common to all Models after they have updated themselves.
*
* Override in subclsees to do the actual updating, then call this.
*
* @param {Model} obj Temporary object holding the updated information. Is of same class as Modelable itself.
*
* @param {int} id ID of the object to be updated
*
* @return {void}
*/

app.Model.prototype.update = function(Model_obj) {

	// Remove references to tmp object (to mark for garbage collection, preventing memory leak)

	this.constructor.registry.remove(Model_obj);

	Model_obj = undefined;
	

	// Write new state to local storage, if available

	var account = app.controller.selectedAccount();

	if (account.localStorageAllowed() && window.localStorage) {

		this.writeObject();

		//console.log(JSON.parse(localStorage.getItem(app.prefs.localStoragePrefix() + this.className() + '.' + this.id())));
	}


	// Register controller as observer of object (auto-skips if already registered)

	this.registerObserver(app.controller);


	// Notify observers (i.e. controller)

	this.notifyObservers(this);
}