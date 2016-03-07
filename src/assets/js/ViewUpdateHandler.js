'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class ViewUpdateHandler implements Iobserver
******************************************************************************/

var app = app || {};

/** @classdesc Abstract base class for handlers of updates from Views to a Controller, in the mold of the Strategy pattern.
*
* Relies on the Observer pattern for handling inter-object messaging among the collaborators.
*
* @constructor
*
* @implements IInterfaceable
*
* @implements IObserver
*
* @param {Controller} Reference to the Controller this ViewUpdateHandler will be collaborating with
*
* @return {ViewUpdateHandler} Not supposed to be instantiated, except when extended by subclasses.
*
* @author Ulrik H. Gade, March 2016
*
* @todo Add error handling if called with param that is not a Controller
*/

app.ViewUpdateHandler = function(Controller_c) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _controller = Controller_c, // the Controller this handler is bound to

	_parentList = [app.IInterfaceable, app.IObserver, app.ViewUpdateHandler], // list of interfaces implemented by this class (by function reference)

	_super = (this.ssuper ? this.ssuper : Object), // reference to immediate parent class (by function) if provided by subclass, otherwise Object

	_uiAction = this.uiAction; // the app.View.UIAction that this handler will respond to if provided by subclass, otherwise undefined
	

	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	

	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets the controller this object is bound to
	*
	* @return {Controller} c A Controller
	*
	* @throws {IllegalArgumentError} If trying to set the controller
	*/

	this.controller = new app.Accessor(_controller, true);
	


	/** Gets a collection of classes or 'interfaces' (by function reference) the object extends or implements. Includes the class of the object itself.
	*
	* @return {Array} parentList An array of functions
	*
	* @throws {IllegalArgumentError} If trying to set the parentList array
	*/

	this.parentList = new app.Accessor(_parentList, true);


	/** Gets a reference to the object's parent (by function reference) in the class inheritance hierarchy (the topmost class is Object)
	*
	* @return {Function} ssuper The parent class
	*
	* @throws {IllegalArgumentError} If trying to set the ssuper attribute
	*
	* @todo Not fully functional; only works one level up from the lowest level in the tree
	*/

	this.ssuper = new app.Accessor(_super, true); // 'super' may be a reserved word, so slight name change

	
	/** Gets the type of UIAction this object will respond to
	*
	* @return {int} UIAction A number compatible with the list defined in app.View.UIAction, or undefined
	*
	* @throws {IllegalArgumentError} If trying to set the UIAction
	*/

	this.uiAction = new app.Accessor(_uiAction, true);
	
	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/


	/*----------------------------------------------------------------------------------------
	* Other object initialization (using parameter parsing/constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
	
};


/*----------------------------------------------------------------------------------------
* Public instance fields (non-encapsulated data members)
*---------------------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** Does the detailed work required for the type of UIAction this handler responds to.
*
* Key to the Stategy pattern, though we are calling indirectly in this app.
*
* @param {int} UIAction An integer representing the type of user action requiring a response
*
* @param {Model} m The Model bound to the view spawning the notification
*
* @param {View} v The View spawning the notification
*
* @return {void}
*
* @throws {AbstractMethodError} If trying to invoke directly on ViewUpdateHandler (abstract methods must be implemented in subclasses)
*/

app.ViewUpdateHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

	throw new AbstractMethodError('Method signature "execute()" must be implemented in derived classes');
}


/** Returns true if class is or extends the class, or implements the interface, passed in (by function reference).
*
* See IInterfaceable for further documentation.
*
* @todo Now that the parent list is publicly available, this should be able to rely on the/a default method in IInterfaceable
*/

app.ViewUpdateHandler.prototype.isInstanceOf = function (func_interface) {
	
	return this.parentList().indexOf(func_interface) > -1;
};


/** Calls the method doing the detailed work required when a Controller receives an update notification from a View.
*
* See execute() method in subclasses for further details.
*
* @param {int} UIAction An integer representing the type of user action requiring a response
*
* @param {Model} m The Model bound to the view spawning the notification
*
* @param {View} v The View spawning the notification
*
* @return {void}
*/


app.ViewUpdateHandler.prototype.update = function(int_UIAction, Model_m, View_v) {
	
	if (arguments.length === 3) { // the number of args is right

		if (parseInt(int_UIAction) === int_UIAction && int_UIAction === this.uiAction()) { // UIAction is a matching integer

			if (Model_m === null || (Model_m.isInstanceOf && Model_m.isInstanceOf(app.Model))) { // second param is instance of Model

				if (View_v.isInstanceOf && View_v.isInstanceOf(app.View)) { // third param is instance of View

					console.log('responding to matching notification');

					this.execute(int_UIAction, Model_m, View_v); // UIAction and call signature are a match, so respond
				}
			}
		}
	}
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/
		
	

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IInterfaceable, app.ViewUpdateHandler); // custom 'interface' framework

void app.IInterfaceable.mixInto(app.IObserver, app.ViewUpdateHandler); // the actual interface to implement