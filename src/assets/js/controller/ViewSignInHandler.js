'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewSignInHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'sign in' notification from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, May 2016
	*/

	module.ViewSignInHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.SIGNIN;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewSignInHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewSignInHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewSignInHandler.prototype.constructor = module.ViewSignInHandler; //Reset constructor property

	module.ViewUpdateHandler.children.push(module.ViewSignInHandler); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'sign in' user action in a View on behalf of a Controller.
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

	module.ViewSignInHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var ctrl = this.controller(), accounts = module.Account.registry.getObjectList(), account = null;

		for (var ix in accounts) { // try to find a matching account

			if (accounts[ix].id() !== Model_m.id()) { // skip the temporary account passed from the sign in view

				if (accounts[ix].email() && accounts[ix].email().address() === Model_m.email().address()) { // emails match

					if (accounts[ix].password() && accounts[ix].password().password() === Model_m.password().password()) { // pw match

						account = accounts[ix];

						break; // .. match found, so exit loop
					}
				}
			}
		}

		if (account !== null) { // provided email and password match an account

			this.notifyObservers(account, new module.EventListView()); // render/refresh the default view in the background

			
			// read in account data from localStorage (if available)


			ctrl.onAccountSelected.call(ctrl, account); // set account and show view

			Materialize.toast(

				'Login successfull. Welcome back!',

				app.prefs.defaultToastDelay()
			);
		}

		else { // sign in failed

			View_v.clear();

			ctrl.currentView(View_v, null);

			Materialize.toast(

				'No account matches this email and password. Please try again.',

				app.prefs.defaultToastDelay()
			);
		}
	};

})(app);