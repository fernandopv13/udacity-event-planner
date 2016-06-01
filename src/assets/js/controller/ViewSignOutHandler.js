'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewSignOutHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'sign in' action from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, May 2016
	*/

	module.ViewSignOutHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.SIGNOUT;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewSignOutHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewSignOutHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewSignOutHandler.prototype.constructor = module.ViewSignOutHandler; //Reset constructor property

	module.ViewUpdateHandler.children.push(module.ViewSignOutHandler); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'sign out' user action in a View on behalf of a Controller.
	*
	* Saves data to local storage (if available), signs out and re-loads the front page.
	*
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m The Model bound to the view spawning the notification
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*/

	module.ViewSignOutHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var ctrl = this.controller(), account = ctrl.selectedAccount();

		if (account.localStorageAllowed()) { // save state

			void module.registry.writeObject();
		}

		void ctrl.selectedAccount(null); // log out

		this.notifyObservers(new module.FrontPageView(), null, module.View.UIAction.NAVIGATE); // load front page

		Materialize.toast( // display sign out confirmation message

			'Sign out complete. Thanks for visiting Meetup Planner.',

			app.prefs.defaultToastDelay()
		);
	};

})(app);