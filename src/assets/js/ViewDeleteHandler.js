'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewDeleteHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'delete' action from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.ViewDeleteHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.DELETE;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewDeleteHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewDeleteHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewDeleteHandler.prototype.constructor = module.ViewDeleteHandler; //Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'delete' user action in View on behalf of Controller.
	* 
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m The Model bound to the view spawning the notification
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*
	* @todo Increase coverage to account deletion
	*/

	module.ViewDeleteHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var ctrl = this.controller();

		void Model_m.constructor.registry.removeObject(Model_m); // remove from registry

		void ctrl.removeObserver(Model_m); // remove from observers

		switch (Model_m.constructor) { // do type specfic cleanup and notification

			case module.Account:

				// do something

				break;

			case module.Event:

				ctrl.selectedAccount().removeEvent(Model_m); // remove from account

				Materialize.toast(Model_m.name() + ' was deleted', module.prefs.defaultToastDelay());

				break;

			case module.Person:

				ctrl.selectedEvent().removeGuest(Model_m); 

				Materialize.toast(Model_m.name() + ' was taken off the guest list', module.prefs.defaultToastDelay());

				break;
		}

		void ctrl.newModel(null); // remove reference to model if it was just created (this may be redundant)

		window.history.back();
	};

})(app);