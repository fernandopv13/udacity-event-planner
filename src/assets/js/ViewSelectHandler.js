'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewSelectHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'select' action from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.ViewSelectHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.SELECT;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewSelectHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewSelectHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewSelectHandler.prototype.constructor = module.ViewSelectHandler; //Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'select' user action in a View on behalf of a Controller.
	*
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m The Model bound to the view spawning the notification
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*/

	module.ViewSelectHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var ctrl = this.controller(), view;

		switch (View_v.constructor) {

			case module.EventListView: // selection made in event list

				this.notifyObservers(Model_m, new module.EventView()); // render/refresh the view in the background

				ctrl.onEventSelected.call(ctrl, Model_m); // show the view

				break;

			case module.GuestListView: // selection made in guest list

				this.notifyObservers(Model_m, new module.PersonView()); // render/refresh the view in the background
				
				ctrl.onGuestSelected.call(ctrl, Model_m); // show the view

				break;
		}
	};

})(app);