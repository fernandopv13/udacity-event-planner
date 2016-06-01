'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewSaveHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'save' (to local storage) action from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, May 2016
	*/

	module.ViewSaveHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.SAVE;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewSaveHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewSaveHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewSaveHandler.prototype.constructor = module.ViewSaveHandler; //Reset constructor property

	module.ViewUpdateHandler.children.push(module.ViewSaveHandler); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'Save' user action in a View on behalf of a Controller
	*
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m The Model bound to the view spawning the notification
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*/

	module.ViewSaveHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var ctrl = this.controller();

		if (window.localStorage) {

			if (ctrl.selectedAccount().localStorageAllowed()) {

				module.registry.writeObject();

				Materialize.toast('From now on, your data is saved on this device', module.prefs.defaultToastDelay());
			}

			else {

				throw new IllegalAccessError('Use of local storage not allowed by user');
			}
		}

		else {

			throw new ReferenceError('localStorage not available');
		}
	};

})(app);