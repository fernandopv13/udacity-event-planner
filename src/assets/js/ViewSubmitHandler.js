'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewSubmitHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'submit' action from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.ViewSubmitHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.SUBMIT;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewSubmitHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewSubmitHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewSubmitHandler.prototype.constructor = module.ViewSubmitHandler; //Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'submit' user action in a View on behalf of a Controller.
	*
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m The Model bound to the view spawning the notification
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*/

	module.ViewSubmitHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var ctrl = this.controller();

		/*if (ctrl.newModel()) { // new Model succesfully added to the account, insert into ecosystem

			switch (Model_m.constructor) {

				case module.Event:

					//ctrl.selectedAccount().addEvent(ctrl.newModel()); // add to event list

					break;

				case module.Person:

					//ctrl.selectedEvent().addGuest(ctrl.newModel()); // add to guest list

					break;
			}

			ctrl.newModel(null); // reset and dereference temporary model
		}
		*/

		console.log('notifying observers'); // debug
		
		ctrl.notifyObservers(Model_m, View_v.model().id()); // update new model with any user edits (later, uncouple from controller using Observer pattern (i.e. implement IObservable))

		window.history.back(); // go one step back in browser history
	};

})(app);