'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class ViewCreateHandler extends ViewUpdateHandler
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Handles 'create' action from View on behalf of Controller.
	*
	* Plays the role of a concrete strategy in our Strategy pattern for the Controller's response to UIActions.
	*
	* @constructor
	*
	* @extends ViewUpdateHandler
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.ViewCreateHandler = function(Controller_c) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.ssuper = module.ViewUpdateHandler;

		this.uiAction = module.View.UIAction.CREATE;

		
		// Initialize instance members inherited from parent class
		
		module.ViewUpdateHandler.call(this, Controller_c);
		
		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ViewCreateHandler);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ViewUpdateHandler
	*---------------------------------------------------------------------------------------*/	

	module.ViewCreateHandler.prototype = Object.create(module.ViewUpdateHandler.prototype); // Set up inheritance

	module.ViewCreateHandler.prototype.constructor = module.ViewCreateHandler; //Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Handles 'create' user action in a View on behalf of a Controller.
	*
	* Creates a new Model of the requested type and opens it in its detail (form) view for editing.
	*
	* Fully registers object in app up-front; relies on generic delete for reversal.
	*
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m The Model bound to the view spawning the notification
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*
	* @todo Consolidate bolerplate actions in a single location
	*
	* @todo Increase coverage to account creation
	*/

	module.ViewCreateHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		//console.log('Creating new ' + Model_m.className()); // debug

		var ctrl = this.controller();

		switch (Model_m.constructor) {

			case module.Account:

				/*
				void ctrl.selectedAccount(Model_m); // set new model as selected

				ctrl.registerObserver(Model_m); // register model and controller as mutual observers

				Model_m.registerObserver(ctrl);

				this.notifyObservers(Model_m, new module.EventListView()); // render/refresh the view in the background

				ctrl.onAccountSelected.call(ctrl, Model_m); //show the view

				Materialize.toast('Success, your account is ready for you to enjoy.', module.prefs.defaultToastDelay());

				break;
				*/

			case module.Event: // these steps seem mostly ripe for generalization

				Model_m.constructor.registry.remove(Model_m); // clear tmp object for garbage collection

				Model_m = ctrl.newModel(new module.Event()); // replace with new Event and store for future reference

				void ctrl.selectedAccount().addEvent(Model_m) // add new event to account

				void ctrl.selectedEvent(Model_m); // set new event as selected

				ctrl.registerObserver(Model_m); // register new event and controller as mutual observers

				Model_m.registerObserver(ctrl);

				this.notifyObservers(Model_m, new module.EventView()); // render/refresh the view in the background

				ctrl.onEventSelected.call(ctrl, Model_m); // show the view

				break;

			case module.Person:

				var evt = ctrl.selectedEvent();

				if (evt.guests().length < evt.capacity()) { // check if there is capacity before trying to add a new guest

					Model_m.constructor.registry.remove(Model_m); // clear tmp object for garbage collection

					Model_m = ctrl.newModel(new module.Person()); // replace with new Person and store for future reference

					void ctrl.selectedEvent().addGuest(Model_m) // add new person (guest) to event

					void ctrl.selectedGuest(Model_m); // set new person as selected

					ctrl.registerObserver(Model_m); // register person and controller as mutual observers

					Model_m.registerObserver(ctrl);

					this.notifyObservers(Model_m, new module.PersonView()); // render/refresh the view in the background

					ctrl.onGuestSelected.call(ctrl, Model_m); // show the view
				}
				
				else { // inform user of capacity constraint

					 Materialize.toast(

					 	'The event is full. Please increase capacity or remove guests before adding more.',

					 	app.prefs.defaultToastDelay()
					)
				}

				break;

			default:

				console.log(Model_m.className() + ' not supported');
		}
	};

})(app);