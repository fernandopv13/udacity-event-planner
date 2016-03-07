'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewNavigateHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

/** @classdesc Handles delete action from View on behalf of Controller.
*
* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
*
* @constructor
*
* @extends ViewUpdateHandler
*
* @author Ulrik H. Gade, March 2016
*/

app.ViewNavigateHandler = function(Controller_c) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.ssuper = app.ViewUpdateHandler;

	this.uiAction = app.View.UIAction.NAVIGATE;

	
	// Initialize instance members inherited from parent class
	
	app.ViewUpdateHandler.call(this, Controller_c);
	
	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/

	this.parentList().push(app.ViewNavigateHandler);
};

/*----------------------------------------------------------------------------------------
* Inherit from ViewUpdateHandler
*---------------------------------------------------------------------------------------*/	

app.ViewNavigateHandler.prototype = Object.create(app.ViewUpdateHandler.prototype); // Set up inheritance

app.ViewNavigateHandler.prototype.constructor = app.ViewNavigateHandler; //Reset constructor property



/*----------------------------------------------------------------------------------------
* Public instance methods (beyond accessors)
*---------------------------------------------------------------------------------------*/

/** Handles 'navigate' user action in a View on behalf of a Controller.
*
* 
*
* @param {int} UIAction An integer representing the user action to respond to
*
* @param {Model} m The Model bound to the view spawning the notification
*
* @param {View} v The View spawning the notification
*
* @return {void}
*/

app.ViewNavigateHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

	var ctrl = this.controller(), view, views = ctrl.views();

	for (var prop in views) { // search for (existing) view matching the request

		if (views[prop].constructor === View_v.constructor) {

			view = views[prop];
		}
	}

	if (view) {

		ctrl.currentView(view, Model_m);
	}

	View_v = undefined; // try to speed up garbage collection of temporary helper object
};
