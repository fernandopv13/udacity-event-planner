'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewCancelHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

/** @classdesc Handles 'cancel' action from View on behalf of Controller.
*
* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
*
* @constructor
*
* @extends ViewUpdateHandler
*
* @author Ulrik H. Gade, March 2016
*/

app.ViewCancelHandler = function(Controller_c) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.ssuper = app.ViewUpdateHandler;

	this.uiAction = app.View.UIAction.CANCEL;

	
	// Initialize instance members inherited from parent class
	
	app.ViewUpdateHandler.call(this, Controller_c);
	
	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.ViewCancelHandler);
};

/*----------------------------------------------------------------------------------------
* Inherit from ViewUpdateHandler
*---------------------------------------------------------------------------------------*/	

app.ViewCancelHandler.prototype = Object.create(app.ViewUpdateHandler.prototype); // Set up inheritance

app.ViewCancelHandler.prototype.constructor = app.ViewCancelHandler; //Reset constructor property



/*----------------------------------------------------------------------------------------
* Public instance methods (beyond accessors)
*---------------------------------------------------------------------------------------*/

/** Handles 'cancel' user action in a View on behalf of a Controller
*
* @param {int} UIAction An integer representing the user action to respond to
*
* @param {Model} m The Model bound to the view spawning the notification
*
* @param {View} v The View spawning the notification
*
* @return {void}
*/

app.ViewCancelHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

	var n = this.controller().newModel();

	if (n) { // creation of new model cancelled

		n.constructor.registry.removeObject(n); // remove from registry

		this.controller().newModel(null); // reset reference
	}
};
