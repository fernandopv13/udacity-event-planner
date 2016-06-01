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
	* @author Ulrik H. Gade, May 2016
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
	* Creates a new Model of the requested type and (mostly) opens it in its detail (form) view for editing.
	*
	* Fully registers object in app up-front; relies on generic delete for reversal.
	*
	* @param {int} UIAction An integer representing the user action to respond to
	*
	* @param {Model} m A Model of the type to create
	*
	* @param {View} v The View spawning the notification
	*
	* @return {void}
	*/

	module.ViewCreateHandler.prototype.execute = function(int_UIAction, Model_m, View_v) {

		//console.log('Creating new ' + Model_m.className()); // debug

		var ctrl = this.controller(), Model_n, self = this;

		
		function initModel(Model_m, Model_new, View_new) { // do work common to all Model creations

			Model_m.delete(); Model_m = null; // clear tmp object for garbage collection

			ctrl.newModel(Model_new); // replace with new Model and store for future reference

			//ctrl.registerObserver(Model_new); // register new Model and controller as mutual observers

			//Model_new.registerObserver(ctrl);

			ctrl.registerMutualObserver(Model_new); // register new Model and controller as mutual observers

			self.notifyObservers(Model_new, View_new); // render/refresh the view in the background
		}

		
		switch (Model_m.constructor) {

			case module.Account:

				// check if account already exists

				var accounts = module.Account.registry.getObjectList(), account = null;

				for (var ix in accounts) { // try to find a matching account

					if (accounts[ix].id() !== Model_m.id()) { // skip the temporary account passed from the sign in view

						if (accounts[ix].email() && accounts[ix].email().address() === Model_m.email().address()) { // emails match

							account = accounts[ix];

							break; // .. match found, so exit loop
						}
					}
				}

				if (account !== null) { // account exists, sign in or reject account creation
					
					if (Model_m.password().password() === account.password().password()) { // passwords match

						View_v.ssuper().prototype.submit.call(View_v, Model_m, module.View.UIAction.SIGNIN);// pass request on to ViewSignInHandler
					}

					else { // wrong password

						Materialize.toast('An account using this email already exists. Please enter another email and try again.', module.prefs.defaultToastDelay());
					}

					Model_m.delete(); // destroy temporary Model holding form data

					Model_m = null; // try to accelerate garbage collection

					break;
				}

				else { // create new account

					Model_n = new module.Account(); // create new Account

					void Model_n.accountHolder(ctrl.registerMutualObserver(new module.Person())); // add account holder and set up as mutual observer

					void ctrl.selectedAccount(Model_n); // set new Account as selected

					Model_n.update(Model_m, Model_n.id()); // save info entered when creating account

					void module.Email.registry.add(Model_n.email()); // update() wipes email and pw from registries...

					void module.Password.registry.add(Model_n.password()); // ... so add them back in

					initModel(Model_m, Model_n, ctrl.views().eventListView); // do boilerplate initialization

					void ctrl.newModel(null) // clear newModel (account creation can't be rolled back)

					var modal = module.controller.views().firstTimeSetupView; // get reference to generic, multi-purpose popup (modal)

					ctrl.onAccountSelected.call(ctrl, Model_n, // set account and show default View

						function(){ // show first time setup modal when default View has rendered
					
							void modal.model(ctrl.selectedAccount());

							modal.render();
							
							modal.show();
						}
					)
				}

				break;

			case module.Event:

				var acc = ctrl.selectedAccount();

				Model_n = new module.Event(); // create new Event

				void Model_n.capacity(acc.defaultCapacity()); // set app/account specific defaults

				if (acc.defaultLocation()) {void Model_n.location(acc.defaultLocation())}

				void ctrl.selectedAccount().addEvent(Model_n) // add new Event to account

				void ctrl.selectedEvent(Model_n); // set new Event as selected

				initModel(Model_m, Model_n, ctrl.views().eventView); // do boilerplate initialization

				ctrl.onEventSelected.call(ctrl, Model_n); // show the View

				break;

			case module.Person:

				var evt = ctrl.selectedEvent();

				if (evt.capacity() && evt.guests().length < evt.capacity()) { // check if there is capacity before trying to add a new guest

					Model_n = new module.Person(); // do boilerplate initialization

					void ctrl.selectedEvent().addGuest(Model_n) // add new person (guest) to event

					void ctrl.selectedGuest(Model_n); // set new person as selected

					initModel(Model_m, Model_n, ctrl.views().guestView); // do boilerplate initialization

					ctrl.onGuestSelected.call(ctrl, Model_n); // show the view
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