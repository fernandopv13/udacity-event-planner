'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewDeleteHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'delete' action from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, May 2016
	*/

	module.ViewDeleteHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.DELETE;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewDeleteHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewDeleteHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewDeleteHandler.prototype.constructor = module.ViewDeleteHandler; //Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'delete' user action in View on behalf of Controller. Asks user for confirmation
	*
	* before going ahead with deletion.
	* 
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m The Model bound to the view spawning the notification
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*
	* @todo Increase coverage to account deletion
	*/

	module.ViewDeleteHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var self = this, ctrl = this.controller(), name, modal = ctrl.views().confirmDeletionView;

		function deleteModel (Model_m) { // helper function doing work common to deleting most model types

			void ctrl.removeObserver(Model_m); // unregister observer relationships

			Model_m.observers().forEach(function(observer) {

				void Model_m.removeObserver(observer);

			}, Model_m);

			void ctrl.newModel(null); // remove reference to model if it was just created

			Model_m.delete(); // call Model's delete() method
		}

		function doDelete() { // main function executed if user confirms deletion (in popup)
	
			switch (Model_m.constructor) { // do type specfic cleanup and notification

				case module.Account:

					void ctrl.selectedAccount(null);

					void ctrl.selectedEvent(null);

					void ctrl.selectedGuest(null);

					deleteModel(Model_m);

					self.notifyObservers(null, ctrl.views().frontPageView); // render/refresh FrontPageView in the background

					ctrl.currentView(ctrl.views().frontPageView, null) // show FrontPageView

					Materialize.toast('Account was deleted. Sorry to see you go.', module.prefs.defaultToastDelay());

					break;

				case module.Event:

					ctrl.selectedAccount().removeEvent(Model_m); // remove from account

					if (ctrl.selectedEvent() && ctrl.selectedEvent().id() === Model_m.id()) {void ctrl.selectedEvent(null);} // reset selected guest in controller

					deleteModel(Model_m); // unregister and delete

					self.notifyObservers(ctrl.selectedAccount(), ctrl.views().eventListView); // render/refresh EventListView in the background

					ctrl.currentView(ctrl.views().eventListView, ctrl.selectedAccount()); // show the view

					Materialize.toast('Event was deleted', module.prefs.defaultToastDelay());

					break;

				case module.Person: // remove from event but don't delete

					void ctrl.selectedEvent().removeGuest(Model_m); // remove from event (but keep in account)

					if (ctrl.selectedGuest() && ctrl.selectedGuest().id() === Model_m.id()) {void ctrl.selectedGuest(null);} // reset selected guest in controller

					void ctrl.newModel(null); // remove reference to model if it was just created

					self.notifyObservers(ctrl.selectedEvent(), ctrl.views().guestListView); // render/refresh guestListView in the background

					ctrl.recentDeleted = true;

					window.history.go(module.device().isiOS() && module.device().isSafari() ? -2 : -1); // navigate back to guest list (working around strange iOS Safari bug)

					Materialize.toast('Guest was removed from event', module.prefs.defaultToastDelay());

					break;
			}
		}

		void modal.model(Model_m);

		modal.render();

		modal.show( // request confirmation before deletion
		{
			dismissible: true, // allow user to dismiss popup by tap/clicking outside it

			complete: function(nEvent) {

				if (nEvent && nEvent.currentTarget.id === 'modal-ok') { // user selected 'OK' button in modal

					doDelete.call(self); // go ahead with deletion
				}

				// else: do nothing if user cancelled popup

			}.bind(self)
		});

		return;
	};

})(app);