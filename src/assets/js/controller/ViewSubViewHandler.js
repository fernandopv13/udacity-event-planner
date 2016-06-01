'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewSubViewHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles initiation of multi-(sub)view transaction on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, April 2016
	*/

	module.ViewSubViewHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.SUBVIEW;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewSubViewHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewSubViewHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewSubViewHandler.prototype.constructor = module.ViewSubViewHandler; //Reset constructor property

	module.ViewUpdateHandler.children.push(module.ViewSubViewHandler); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles initiation of multi-(sub)view transaction on behalf of controller
	*
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m The Model bound to the view spawning the notification
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*/

	module.ViewSubViewHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var ctrl = this.controller();

		void ctrl.sourceModel(ctrl.currentView().model());  // set source to the original Model of the calling View

		void ctrl.cloneModel(ctrl.currentView().val()); // set clone to value Model of the calling View

		void ctrl.selectedEvent(ctrl.cloneModel()); // set selected event to clone

		if (ctrl.cloneModel() !== null) { 

			this.notifyObservers(View_v, ctrl.cloneModel(), module.View.UIAction.NAVIGATE); // navigate to requested subview, using clone
		}

		else { // val() returns null if a valid Model cannot be created, e.g. if a FormView doesn't validate

			throw new IllegalArgumentError('Expected Model');
		}
	};

})(app);