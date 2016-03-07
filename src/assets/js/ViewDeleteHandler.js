'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewDeleteHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

/** @classdesc Handles delete action from View on behalf of Controller.
*
* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
*
* @constructor
*
* @extends ViewUpdateHandler
*
* @author Ulrik H. Gade, March 2016
*/

app.ViewDeleteHandler = function(Controller_c) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.ssuper = app.ViewUpdateHandler;

	this.uiAction = app.View.UIAction.DELETE;

	
	// Initialize instance members inherited from parent class
	
	app.ViewUpdateHandler.call(this, Controller_c);
	
	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.ViewDeleteHandler);
};

/*----------------------------------------------------------------------------------------
* Inherit from ViewUpdateHandler
*---------------------------------------------------------------------------------------*/	

app.ViewDeleteHandler.prototype = Object.create(app.ViewUpdateHandler.prototype); // Set up inheritance

app.ViewDeleteHandler.prototype.constructor = app.ViewDeleteHandler; //Reset constructor property



/*----------------------------------------------------------------------------------------
* Public instance methods (beyond accessors)
*---------------------------------------------------------------------------------------*/

/** Handles 'delete' user action in a View on behalf of a Controller.
*
* 
*
* @param {int} UIAction An integer representing the user action to respond to
*
* @param {Model} m The Model bound to the view spawning the notification
*
* @param {View} v The View spawning the notification
*
* @return {void}
*/

app.ViewDeleteHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

	var ctrl = this.controller();

	ctrl.removeObserver(Model_m);

	switch (Model_m.constructor) {

		case app.Event: // remove event completely from app

			var evtName = Model_m.name();

			app.Account.registry.removeObject(Model_m);

			ctrl.selectedAccount().removeEvent(Model_m);

			ctrl.currentView().model(undefined);

			Model_m = undefined;

			Materialize.toast(evtName + ' was deleted', 4000);

			break;

		case app.Person: // remove person (guest) from this event, but keep in account

			ctrl.selectedEvent().removeGuest(Model_m);

			Materialize.toast(Model_m.name() + ' was taken off the guest list', 4000);

			break;
	}

	window.history.back();
};
