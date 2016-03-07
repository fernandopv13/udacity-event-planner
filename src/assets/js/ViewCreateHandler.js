'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewCreateHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

/** @classdesc Handles create action from View on behalf of Controller.
*
* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
*
* @constructor
*
* @extends ViewUpdateHandler
*
* @author Ulrik H. Gade, March 2016
*/

app.ViewCreateHandler = function(Controller_c) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.ssuper = app.ViewUpdateHandler;

	this.uiAction = app.View.UIAction.CREATE;

	
	// Initialize instance members inherited from parent class
	
	app.ViewUpdateHandler.call(this, Controller_c);
	
	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.ViewCreateHandler);
};

/*----------------------------------------------------------------------------------------
* Inherit from ViewUpdateHandler
*---------------------------------------------------------------------------------------*/	

app.ViewCreateHandler.prototype = Object.create(app.ViewUpdateHandler.prototype); // Set up inheritance

app.ViewCreateHandler.prototype.constructor = app.ViewCreateHandler; //Reset constructor property



/*----------------------------------------------------------------------------------------
* Public instance methods (beyond accessors)
*---------------------------------------------------------------------------------------*/

/** Handles 'create' user action in a View on behalf of a Controller.
*
* Takes a new Model of the requested type and opens it in its detail (form) view for editing.
*
* @param {int} UIAction An integer representing the user action to respond to
*
* @param {Model} m The Model bound to the view spawning the notification
*
* @param {View} v The View spawning the notification
*
* @return {void}
*/

app.ViewCreateHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

	var ctrl = this.controller();

	switch (Model_m.constructor) {

		case app.Event:

			ctrl.newModel(Model_m); // store new model for future reference

			ctrl.onEventSelected.call(ctrl, ctrl.newModel()); // open it in its FormView

			break;

		case app.Person:

			var evt = ctrl.selectedEvent();

			if (evt.guests().length < evt.capacity()) { // check if there is capacity before trying to add a new guest

				ctrl.newModel(Model_m); // store new model for future reference

				ctrl.onGuestSelected.call(ctrl, ctrl.newModel()); // open it in its FormView
			}
			
			else { // inform user of capacity constraint

				 Materialize.toast('The event is full to capacity. Increase capacity or remove guests before adding more.', 4000)
			}

			break;

		default:

			//console.log('not supported')
	}

	ctrl.registerObserver(Model_m);

	Model_m.registerObserver(ctrl);
};
