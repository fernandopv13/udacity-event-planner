'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewNavigateHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'navigate' action from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.ViewNavigateHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.NAVIGATE;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewNavigateHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewNavigateHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewNavigateHandler.prototype.constructor = module.ViewNavigateHandler; //Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'navigate' user action in a View on behalf of a Controller.
	*
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m The Model bound to the view spawning the notification
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*
	* @throws {ReferenceError} If provided view is unknown by controller
	*/

	module.ViewNavigateHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		console.log('Navigating to ' + View_v.className()); //debug

		var ctrl = this.controller(), view, views = ctrl.views();

		for (var prop in views) { // search for (existing) view matching the request

			if (views[prop].constructor === View_v.constructor) {

				view = views[prop];

				break;
			}
		}

		if (view) {

			if (Model_m === null) { // parse Model matching navbar menuitems

				switch (View_v.constructor) {

					case module.AccountSettingsView:

						Model_m = ctrl.selectedAccount();

						break;

					case module.AccountProfileView:

						Model_m = ctrl.selectedAccount().accountHolder()

							|| ctrl.selectedAccount().accountHolder(new module.Person())

						break;

					//case module.SignOutView

					//case module.AboutView

					default:

						console.log('Navigation selection not supported');
				}
			}


			this.notifyObservers(Model_m, View_v); // render/refresh the view in the background

			ctrl.currentView(view, Model_m); // show the view
		}

		else {

			throw new ReferenceError('Unexpected view: ' + View_v.className());
		}

		View_v = undefined; // try to speed up garbage collection of temporary helper object
	};

})(app);