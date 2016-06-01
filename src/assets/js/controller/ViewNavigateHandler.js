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
	* @author Ulrik H. Gade, May 2016
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

	module.ViewUpdateHandler.children.push(module.ViewNavigateHandler); // Add to list of derived classes


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

		//console.log('Navigating to ' + View_v.className()); //debug

		var ctrl = this.controller(), clone = ctrl.cloneModel(), source = ctrl.sourceModel(), view, views = ctrl.views();

		for (var prop in views) { // find view matching the request

			if (views[prop].constructor === View_v.constructor) {

				view = views[prop];

				break;
			}
		}

		if (view) {

			if (clone !== null && source !== null) { // a transaction is in progress

				if (Model_m !== null && Model_m.constructor === clone.constructor

					&& clone.constructor === source.constructor) { // Model, source and clone are of the same type

					// i.e. we are navigating to the view initiating the transaction, so update using clone, rather than source

					Model_m = clone;
				}

				else { // assume we are cancelling the transaction, so clean up

					//console.log('cancelling transaction'); // debug

					void ctrl.selectedEvent(source);

					void ctrl.sourceModel(null);

					void ctrl.cloneModel(null);

					void clone.delete(); 
				}

				this.notifyObservers(Model_m, View_v); // render/refresh the view in the background

				ctrl.currentView(view, Model_m); // show the view
			}

			else { // navigate to view
			
				if (Model_m === null) { // try to match view with model, if missing (e.g. when called from navbar item)

					Model_m = (
					{
						AccountProfileView: ctrl.selectedAccount() ? ctrl.selectedAccount().accountHolder() : null,

						AccountSettingsView: ctrl.selectedAccount() ? ctrl.selectedAccount() : null
					
					})[view.className()] || null;
				}

				if ([module.AboutView, module.SignOutView].indexOf(View_v.constructor) > -1) { // open modals called from navbar

					this.notifyObservers(Model_m, View_v); // render/refresh the view in the background

					setTimeout( // wait for the drawer close animation to complete, or it will also hide the popup

						function() {ctrl.currentView(view, Model_m)}, 300  // show the view
					);
				}

				else { // open any other view

					this.notifyObservers(Model_m, View_v); // render/refresh the view in the background

					ctrl.currentView(view, Model_m); // show the view
				}
			}
		}

		else {

			throw new ReferenceError('Unexpected view: ' + View_v.className());
		}

		View_v = undefined; // try to speed up garbage collection of temporary helper object
	};

})(app);