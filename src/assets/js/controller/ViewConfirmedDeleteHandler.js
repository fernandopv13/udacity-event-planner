'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewConfirmedDeleteHandler extends ViewUpdateHandler
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

	module.ViewConfirmedDeleteHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.CONFIRMEDDELETE;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewConfirmedDeleteHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewConfirmedDeleteHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewConfirmedDeleteHandler.prototype.constructor = module.ViewConfirmedDeleteHandler; //Reset constructor property

	module.ViewUpdateHandler.children.push(module.ViewConfirmedDeleteHandler); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'delete' user action in View on behalf of Controller when user confirmation
	*
	* is required before going ahead with deletion.
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

	module.ViewConfirmedDeleteHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		var self = this, ctrl = this.controller(), modal = ctrl.views().confirmDeletionView;

		if (Model_m instanceof module.Person && View_v instanceof module.AccountProfileView) {

			// called from AccountProfileView:
			// skip directly to deleting account, so as to not show two successive popups

			this.notifyObservers(View_v, ctrl.selectedAccount(), module.View.UIAction.DELETE);
		}

		else { // proceed normally

			void modal.model(Model_m);

			modal.render();

			modal.show( // request confirmation before deletion
			{
				dismissible: true, // allow user to dismiss popup by tap/clicking outside it

				complete: function(nEvent) {

					if (nEvent && nEvent.currentTarget.id === 'modal-ok') { // user selected 'OK' button in modal

						this.notifyObservers(View_v, Model_m, module.View.UIAction.DELETE); // go ahead with deletion
					}

					// else: do nothing if user cancelled popup

				}.bind(self)
			});
		}
	};

})(app);