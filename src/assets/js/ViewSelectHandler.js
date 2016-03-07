'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewSelectHandler extends ViewUpdateHandler
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

app.ViewSelectHandler = function(Controller_c) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.ssuper = app.ViewUpdateHandler;

	this.uiAction = app.View.UIAction.SELECT;

	
	// Initialize instance members inherited from parent class
	
	app.ViewUpdateHandler.call(this, Controller_c);
	
	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.ViewSelectHandler);
};

/*----------------------------------------------------------------------------------------
* Inherit from ViewUpdateHandler
*---------------------------------------------------------------------------------------*/	

app.ViewSelectHandler.prototype = Object.create(app.ViewUpdateHandler.prototype); // Set up inheritance

app.ViewSelectHandler.prototype.constructor = app.ViewSelectHandler; //Reset constructor property



/*----------------------------------------------------------------------------------------
* Public instance methods (beyond accessors)
*---------------------------------------------------------------------------------------*/

/** Handles 'navigate' user action in a View on behalf of a Controller.
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

app.ViewSelectHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

	var ctrl = this.controller();

	switch (View_v.constructor) {

		case app.EventListView: // selection made in event list

			ctrl.onEventSelected.call(ctrl, Model_m);

			break;

		case app.GuestListView: // selection made in guest list

			ctrl.onGuestSelected.call(ctrl, Model_m);

			break;
	}
};
