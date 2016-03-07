'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewSignInHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

/** @classdesc Handles 'sign in' action from View on behalf of Controller.
*
* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
*
* @constructor
*
* @extends ViewUpdateHandler
*
* @author Ulrik H. Gade, March 2016
*/

app.ViewSignInHandler = function(Controller_c) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.ssuper = app.ViewUpdateHandler;

	this.uiAction = app.View.UIAction.SIGNIN;

	
	// Initialize instance members inherited from parent class
	
	app.ViewUpdateHandler.call(this, Controller_c);
	
	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.ViewSignInHandler);
};

/*----------------------------------------------------------------------------------------
* Inherit from ViewUpdateHandler
*---------------------------------------------------------------------------------------*/	

app.ViewSignInHandler.prototype = Object.create(app.ViewUpdateHandler.prototype); // Set up inheritance

app.ViewSignInHandler.prototype.constructor = app.ViewSignInHandler; //Reset constructor property



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

app.ViewSignInHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

	var ctrl = this.controller(), accounts = app.Account.registry.getObjectList(), ret = false;

	for (var ix in accounts) { // try to find a matching account

		if (accounts[ix].id() !== Model_m.id()) { // skip the temporary account passed from the sign in view

			if (accounts[ix].email() && accounts[ix].email().address() === Model_m.email().address()) { // emails match

				if (accounts[ix].password() && accounts[ix].password().password() === Model_m.password().password()) { // pw match

					ret = true;

					break; // .. match found, so exit for loop
				}
			}
		}
	}

	if (ret) { // provided email and password match an account

		ctrl.onAccountSelected.call(ctrl, accounts[ix]);

		void (new app.View()).renderNavigation('Meetup Planner'); // show navigation

		Materialize.toast('Login successfull. Welcome back!', 4000);
	}

	else { // sign in failed

		View_v.clear();

		ctrl.currentView(View_v, null);

		Materialize.toast('No account matches this email and password. Please try again.', 5000);
	}
};
