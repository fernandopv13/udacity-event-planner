'use strict'; // Not in functions to make it easier to remove by build process

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/******************************************************************************
	* public class Controller Implements IInterfaceable, IObservable, IObserver
	******************************************************************************/

	/** @classdesc The 'C' part of our MVC framework.
	*
	* The 'octopus' controlling the workflow, and mediating messages between data and UI, in the app.
	*
	* @implements IInterfaceable
	*
	* @implements IObservable
	*
	* @implements IObserver
	*
	* @constructor
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @todo flesh out views() getter
	*/

	module.Controller = function() {

		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
			var _implements = [module.IObservable, module.IObserver], // list of interfaces implemented by this class (by function reference)

			_currentView, // the view currently being displayed in the UI

			_newModel = null, // a newly created model object, held in edit mode for the first time

			_selectedAccount = null, // the currently selected account, or null if none selected

			_selectedEvent = null, // the currently selected event, or null if none selected

			_selectedGuest = null, // the currently selected guest, or null if none selected

			_views, // collection of views we need to keep track of

			_router, // router managing browser history

			_observers = []; // Array of IObservers. Expected by IObservable.

		
		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields
		*---------------------------------------------------------------------------------------*/

			/** Gets or sets the view currently being displayed in the UI.
			*
			* When setting, hides the currently presented view and shows the new one.
			*
			* @param {View} v currentView The current view, or null
			*
			* @param {Model} m the Model we want displayed in the new current view, or null
			*
			* @return {View} The current view, or null
			*
			* @throws {IllegalArgumentError} If attempting to set a view that is not a View, or null
			*/
			
			this.currentView = function (View_v, Model_m) {
			
				if (arguments.length > 0) { // setting

					if (View_v === null || View_v.isInstanceOf(module.View)) {

						this.notifyObservers(Model_m); // first notify observers: forms won't update if they are the current view
						
						for (var view in _views) {

							_views[view].hide('fast');  // hide all views

							_views[view].onUnLoad(); // have hidden views clean up after themselves						

						}

						_currentView = View_v; // set current view

						_currentView.show('slow'); // show current view

						_currentView.onLoad(); // have current view init itself

						
						_router.onViewChange(View_v); // update browser history
					}

					else {
					
						throw new IllegalArgumentError('View must be instance of View')
					}
				}
				
				return _currentView; // always return the current reference
			};


			/** Gets or sets reference to newly created Model that has not yet been submitted to the 'backend'.
			*
			* Helps keep track of what to do when users hits cancel or delete in a form after creating a new item.
			*
			* @return {Model} The newly created model, or null
			*
			* @throws {IllegalArgumentError} If trying to set a model that is neither an instance of module.Model, nor null
			*/

			this.newModel = function(Model_m) {

				if (arguments.length > 0) {

					if (Model_m === null || (Model_m.isInstanceOf && Model_m.isInstanceOf(module.Model))) {

						_newModel = Model_m;
					}

					else {

						throw new IllegalArgumentError('Expected instance of Model, or null');
					}
				}

				return _newModel;
			};


			/** Gets the collection of IObservers of the controller
			*
			* @return {Array} An array of IObservers
			*
			* @throws {IllegalArgumentError} If passing in any parameters: property is read-only
			*/

			this.observers = function() {

				if (arguments.length > 0) {

					throw new IllegalArgumentError('Property is read-only');
				}

				return _observers;
			}


			/** Gets or sets the currently selected (active) account
			*
			* @param {Account} selectedAccount The selected account, or null
			*
			* @return {Account} The selected account, or null
			*
			* @throws {IllegalArgumentError} If attempting to set account that is not an Account, or null
			*/
			
			this.selectedAccount = function (Account_a) {
			
				if (arguments.length > 0) {

					if (Account_a === null || Account_a.constructor === module.Account) {
					
						_selectedAccount = Account_a;
					}

					else {
					
						throw new IllegalArgumentError('Account must be instance of Account')
					}
				}
				
				return _selectedAccount;
			};


			/** Gets or sets the currently selected Event
			*
			* @param {Event} selectedAccount The selected event, or null
			*
			* @return {Event} The selected event, or null
			*
			* @throws {IllegalArgumentError} If attempting to set event that is not an Event, or null
			*/
			
			this.selectedEvent = function (Event_e) {
			
				if (arguments.length > 0) {

					if (Event_e === null || Event_e.constructor === module.Event) {
					
						_selectedEvent = Event_e;
					}

					else {
					
						throw new IllegalArgumentError('Event must be instance of Event')
					}
				}
				
				return _selectedEvent;
			};


			/** Gets or sets the currently selected guest
			*
			* @param {Person} selectedGuest The selected guest, or null
			*
			* @return {Person} The selected guest, or null
			*
			* @throws {IllegalArgumentError} If attempting to set guest that is not a Person, or null
			*/
			
			this.selectedGuest = function (Person_g) {
			
				if (arguments.length > 0) {

					if (Person_g === null || Person_g.constructor === module.Person) {
					
						_selectedGuest = Person_g;
					}

					else {
					
						throw new IllegalArgumentError('Guest must be instance of Person')
					}
				}
				
				return _selectedGuest;
			};


			this.views = function() { // getter for _views, to flesh out

				return _views;
			}

		/*----------------------------------------------------------------------------------------
		* Private instance methods (beyond accessors)
		*---------------------------------------------------------------------------------------*/
		
			/** Does the work required when an account has been selected,
			*
			* including storing a reference to it as the selected account,
			*
			* and displaying the Account to the user.
			*
			* @param {Account} a The selected Account
			*/

			function _onAccountSelected(Account_a) {

				this.selectedEvent(null);

				this.selectedGuest(null);

				this.selectedAccount(Account_a);

				this.currentView(_views.eventListView, this.selectedAccount());
			}

			this.onAccountSelected = function(Account_a) { // temporary adapter while transitioning to the Strategy pattern

				return _onAccountSelected.call(this, Account_a);
			};


			/** Handles click on floating 'plus' action button in list views
			*
			* Takes a new Model of the requested type and opens it in its detail (form) view for editing.
			*
			* If submitted succesfully, it will be added in its place in the account's object model.
			*
			* If cancelled, the Model is removed and all references to it deleted or reset.
			*
			* @param {Model} tmp The new Model object being created
			*
			* @return {void}
			*/

			/*function _onCreateModel(Model_m) {

				switch(Model_m.constructor) {

					case module.Event:

						_newModel = Model_m; // store new model for future reference

						_onEventSelected.call(this, _newModel); // open it in its FormView

						break;

					case module.Person:

						var evt = this.selectedEvent();

						if (evt.guests().length < evt.capacity()) { // check if there is capacity before trying to add a new guest

							_newModel = Model_m; // store new model for future reference

							_onGuestSelected.call(this, _newModel); // open it in its FormView
						}
						
						else { // inform user of capacity constraint

							 Materialize.toast('The event is full to capacity. Increase capacity or remove guests before adding more.', 4000)
						}

						break;

					default:

						//console.log('not supported')
				}

				this.registerObserver(Model_m);

				Model_m.registerObserver(this);
			}
			*/



			/** Does the work required when an event has been selected,
			*
			* including storing a reference to it as the selected event,
			*
			* and displaying the event to the user.
			*
			* @param {Event} a The selected Event
			*/

			function _onEventSelected(Event_e) {

				this.selectedGuest(null);

				this.currentView(_views.eventView, this.selectedEvent(Event_e));
			}

			this.onEventSelected = function(Event_e) { // temporary adapter while transitioning to the Strategy pattern

				return _onEventSelected.call(this, Event_e);
			};

			
			/** Does the work required when a guest has been selected,
			*
			* including storing a reference to it as the selected guest,
			*
			* and displaying the Guest to the user.
			*
			* @param {Person} a The selected guest
			*/

			function _onGuestSelected(Person_g) {

				this.selectedGuest(Person_g);

				this.currentView(_views.guestView, this.selectedGuest());
			}

			this.onGuestSelected = function(Person_g) { // temporary adapter while transitioning to the Strategy pattern

				return _onGuestSelected.call(this, Person_g);
			};


		/*----------------------------------------------------------------------------------------
		* Public instance methods (beyond accessors)
		*---------------------------------------------------------------------------------------*/
		
			/** Sets up the MVC collaborators to observe/be observed by each other as required.
			*
			* Creates the views required by the app, and presents the initial view.
			*
			* @return {void}
			*/

			this.init = function() {

				// Create views

					_views =
					{
						accountSettingsView: new module.AccountSettingsView('account-settings-view', 'Account Settings'), // account settings form (email, password and prefs)

						accountProfileView: new module.AccountProfileView('account-profile-view', 'Account Profile'), // account holder profile

						eventListView: new module.EventListView('event-list-view', 'My Events'), // event list

						eventView: new module.EventView('event-view', 'Edit Event'), // event form

						frontPageView: new module.FrontPageView('front-page-view', 'Welcome to Meetup Planner'), // front page view

						guestListView: new module.GuestListView('guest-list-view', 'Guest List'), // guest list

						guestView: new module.PersonView('guest-view', 'Edit Guest'), // guest form

						signInView: new module.SignInView('sign-in-view', 'Sign In'), // sign in view

						signUpView: new module.SignUpView('sign-up-view', 'Sign Up') // sign in view
					}

					
				// Register views and controller as mutual observers

					for (var prop in _views) {

						this.registerObserver(_views[prop]);

						_views[prop].registerObserver(module.controller);
					}
					

				// Register models and controller as mutual observers

					[module.Account, module.Event, module.Organization, module.Person].forEach(function(klass){

						var objList = klass.registry.getObjectList();

						for (var prop in objList) {

							this.registerObserver(objList[prop]);

							objList[prop].registerObserver(this);
						}

					}.bind(this)); // make sure 'this' references controller correctly within loop


				// Set up a router to manage the browser's history

					_router = new module.Router();

					window.onpopstate = function(event) {this.onPopState(event);}.bind(this);

				
				// Create ViewUpdateHandlers and register as observers of controller

					[
						new module.ViewCancelHandler(this),

						new module.ViewCreateHandler(this),

						new module.ViewDeleteHandler(this),

						new module.ViewNavigateHandler(this),

						new module.ViewSelectHandler(this),

						new module.ViewSignInHandler(this),

						new module.ViewSubmitHandler(this)
					
					].forEach(function(handler) {

						this.registerObserver(handler);

					}, this);


				// Bootstrap UI by loading the front page

					//void (new module.View()).renderNavigation('Meetup Planner');

					_views.frontPageView.render();

					_views.frontPageView.show();

				};

			
			/** Returns true if class implements the interface passed in (by function reference).
			*
			* Method realization required by IInterfaceable.
			*
			* @param {Function} interface The interface we wish to determine if this class implements
			*
			* @return {Boolean} instanceof True if class implements interface, otherwise false
			*
			* @todo This seems redundant try to find a way to delegate to default method in IInterfaceable
			*/
			
			this.isInstanceOf = function (func_interface) {
				
				return _implements.indexOf(func_interface) > -1;
			};


			/** Notifies observes of change to the data model.
			*
			* Method realization required by IInterfaceable.
			*
			* @param {Model} n Reference to the Model object that caused the update
			*
			* @param {int} id Id of the Model object the update is intended for. Optional: only needed when passing on update from Model.
			*
			* @todo Clean up signatures to make more sense from calling functions
			*/

			this.notifyObservers = function(Model_m, int_id, View_v) {
				
				if (View_v !== undefined) {

					_observers.forEach(function(observer) {

						observer.update(int_id, Model_m, View_v); // expected by ViewUpdateHandler
					});
				}

				else if (int_id !== undefined) {

					_observers.forEach(function(observer) { // expected by Model

						observer.update(Model_m, int_id);
					});
				}

				else {

					_observers.forEach(function(observer) { // expected by View

						observer.update(Model_m);
					});
				}
			}

			
			/** Handles click events in navbar/dropdown */

			this.onNavSelection = function(nEvent) {

				switch (event.target.href.split('!')[1]) { // parse the URL partial after #!

					case 'Search':

						break;

					case 'Settings':

						this.currentView(_views.accountSettingsView, this.selectedAccount());

						break;

					case 'Profile':

						this.currentView(_views.accountProfileView, this.selectedAccount().accountHolder());
						
						break;

					case 'About':

						break;

					case 'Sign Out':

						break;

					default:

						console.log('Navigation selection not supported');
				}
			}


			/** Passes history onpopstate events on to router */

			this.onPopState = function(nEvent) {

				_router.onPopState(nEvent);
			};
			
			
			// 'Polymorphic' helpers for main update() method. Place here to make jsDoc see them.


			/** Handles update notifications from the data model.
			*
			* Called by public update() method, which also does error handling.
			*
			* @param {Model} model The Model that has changed state and therefore invoked the update.
			*
			* @return {void}
			*/

			function _update(Model_m) {

				this.notifyObservers(Model_m);
			}


			/** Handles user action in a View.
			*
			* Called by public update() method, which also does error handling.
			*
			* @param {View} v Reference to the calling View, or to the type of View we wish to navigate to
			*
			* @param {Model} m Reference to the Model related to the user action (e.g. the Model presented by a form, the selected item in a list, or the source of data for the next view), or null
			*
			* @param {int} UIAction The type of action invoked by the user in the UI. Supported action types are defined in module.View.UIAction.
			*
			* @return {void}
			*
			* @todo Get sign in to work using Strategy pattern, then clean out entire Switch statement with the old code
			*/

			function __update(View_v, Model_m, int_uiaction) {

				switch (int_uiaction) {

					/*
					case module.View.UIAction.CANCEL:

						this.notifyObservers(Model_m, int_uiaction, View_v);

						break;

					case module.View.UIAction.CREATE:

						this.notifyObservers(Model_m, int_uiaction, View_v);

						break;

					case module.View.UIAction.DELETE:

						this.notifyObservers(Model_m, int_uiaction, View_v);

						break;

					case module.View.UIAction.NAVIGATE: // navigation to (sub)view requested

						this.notifyObservers(Model_m, int_uiaction, View_v);

						break;
					
					case module.View.UIAction.SELECT:

						this.notifyObservers(Model_m, int_uiaction, View_v);

						break;

					case module.View.UIAction.SUBMIT: // update to Model submitted by form

						this.notifyObservers(Model_m, int_uiaction, View_v);

						break;

					*/
					
					case module.View.UIAction.SIGNIN: // submission from sign in form

						// Requires debugging before the code can switch over to the notification model (Strategy pattern):
						// not sure, but I think the problem could have something to do with what gets passed in the call to onAccountSelected()

						//this.notifyObservers(Model_m, int_uiaction, View_v);

						var accounts = module.Account.registry.getObjectList(), ret = false;

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

							_onAccountSelected.call(this, accounts[ix]);

							void (new module.View()).renderNavigation('Meetup Planner'); // show navigation

							Materialize.toast('Login successfull. Welcome back!', 4000);
						}

						else { // sign in failed

							View_v.clear();

							this.currentView(View_v, null);

							Materialize.toast('No account matches this email and password. Please try again.', 5000);
						}

						break;
					
					default:

						this.notifyObservers(Model_m, int_uiaction, View_v);

						//console.log('UI action ' + int_uiaction + ' not supported');
				}

				// remove temporary Model passed in from View (to prepare for garbage collection)

				if (Model_m && Model_m.constructor && Model_m.constructor.registry) {

					Model_m.constructor.registry.remove(Model_m);
				}

				Model_m = undefined;
			}
			

			/** Receives and processes update notifications from either view (UI) or data model.
			*
			* Uses JS style 'polymorphism' (i.e. parameter parsing) to decide what to do when invoked.
			*
			* Delegates response to private '_update(...)' functions. See these for supported method signatures.
			*
			* @param {Arguments} args An array like object containing whatever params the caller has passed on
			*
			* @return {void}
			*
			* @throws {IllegalArgumentError} If first parameter provided is neither an Model nor a View.
			*
			* @throws {IllegalArgumentError} If second parameter provided (when present) is neither an integer nor a native browser event.
			*/

			this.update = function() {

				// Parse parameters to invoke appropriate 'polymorphic' response

				var args = arguments[0];

				switch (args.length) {

					case 1: // state change notification from Model

						if (args[0].isInstanceOf(module.Model)) { // first param is instance of Model

								_update.call(this, args[0]);
						}

						else {

							throw new IllegalArgumentError('Expected instance of Model');
						}

						break;

					case 3: // user action notification from View

						if (args[0].isInstanceOf(module.View)) { // first param is instance of View

							if (args[1] === null || args[1].isInstanceOf(module.Model)) { // second param is instance of Model, or null

								if (args[2] === parseInt(args[2])) { // third param is integer

									__update.call(this, args[0], args[1], args[2]);
								}

								else {

									throw new IllegalArgumentError('Expected integer');
								}
							}

							else {

								throw new IllegalArgumentError('Expected instance of Model');
							}
						}

						else {

							throw new IllegalArgumentError('Expected instance of View');
						}

						break;

					default:

						//throw new IllegalArgumentError('Method signature not supported');
				}
			}
		
		/*----------------------------------------------------------------------------------------
		* Other initialization (parameter parsing/constructor 'polymorphism')
		*---------------------------------------------------------------------------------------*/
			
		// none so far
		
	};


	/*----------------------------------------------------------------------------------------
	Mix in default methods from implemented interfaces, unless overridden by class or ancestor
	*---------------------------------------------------------------------------------------*/

	void module.IInterfaceable.mixInto(module.IInterfaceable, module.Controller);

	void module.IInterfaceable.mixInto(module.IObservable, module.Controller);

	void module.IInterfaceable.mixInto(module.IObserver, module.Controller);

})(app);