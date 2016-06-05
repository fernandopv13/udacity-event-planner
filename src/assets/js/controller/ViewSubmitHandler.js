'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewSubmitHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'submit' notification from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, May 2016
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

	module.ViewUpdateHandler.children.push(module.ViewSubmitHandler); // Add to list of derived classes


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

		var ctrl = this.controller(), clone = ctrl.cloneModel(), source = ctrl.sourceModel(), id = View_v.model().id();

		if (clone !== null && source !== null) { // console.log('transaction in progress');

			if (Model_m !== null && Model_m.constructor === clone.constructor && clone.constructor === source.constructor) { //console.log('Model, source and clone are of the same type');

				// this submission is the conclusion of the transaction, so save changes to source

				id = source.id();

				// reset transaction

				void ctrl.selectedEvent(source);

				void ctrl.sourceModel(null);

				void ctrl.cloneModel(null);

				void clone.delete(); 
			}
		}

		this.notifyObservers(Model_m, id); // update model

		void ctrl.newModel(null); // reset newModel, if not null (i.e. when saving freshly created model)

		window.history.back(); // go one step back in browser history
	};

})(app);