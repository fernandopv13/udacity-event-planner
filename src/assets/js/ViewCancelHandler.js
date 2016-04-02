'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewCancelHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

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

	module.ViewCancelHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.CANCEL;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewCancelHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewCancelHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewCancelHandler.prototype.constructor = module.ViewCancelHandler; //Reset constructor property



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
	*
	* @todo This has hte making of a generic delete handler, look into it
	*/

	module.ViewCancelHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var ctrl = this.controller(), newModel = ctrl.newModel();

		/*if (newModel !== null) { // creation of new model cancelled

			newModel.constructor.registry.removeObject(newModel); // remove from registry

			ctrl.newModel(null); // reset newModel reference

			ctrl.removeObserver(newModel); // remove from observer list

			switch (newModel.constructor) { // remove from data model

				case module.Account:

					// remove from app?

					break;

				case module.Event:

					///void ctrl.selectedAccount().removeEvent(newModel);

					break;

				case module.Person:

					//void ctrl.selectedEvent().removeGuest(newModel);

					break;
			}

			newModel = undefined; // free up for garbage collection
		}
		*/

		window.history.back(); // return to previous view
	};

})(app);