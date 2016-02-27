'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class Controller Implements IObserver IObservable
******************************************************************************/

var app = app || {};

/** @classdesc The 'C' part of our MVC framework.
*
* The 'octopus' controlling the workflow, and mediating messages between data and UI, in the app.
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*
* @todo Refactor as many accessors and event handlers as possible from public to private members
*/

app.Controller = function() {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
		var _implements = [app.IObservable, app.IObserver], // list of interfaces implemented by this class (by function reference)

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
		* When setting, hides the existing view and shows the new one.
		*
		* @param {View} v currentView The current view, or null
		*
		* @return {View} The current view, or null
		*
		* @throws {IllegalArgumentError} If attempting to set a view that is not a View, or null
		*/
		
		this.currentView = function (View_v, Model_m) {
		
			if (arguments.length > 0) { // setting

				if (View_v === null || View_v.isInstanceOf(app.View)) {
				
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
			
			return _currentView;
		};


		/** Gets the collection of IObservers of the controller */

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
		
		this.selectedAccount = function (Account_account) {
		
			if (arguments.length > 0) {

				if (Account_account === null || Account_account.constructor === app.Account) {
				
					_selectedAccount = Account_account;
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
		
		this.selectedEvent = function (Event_event) {
		
			if (arguments.length > 0) {

				if (Event_event === null || Event_event.constructor === app.Event) {
				
					_selectedEvent = Event_event;
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
		
		this.selectedGuest = function (Person_guest) {
		
			if (arguments.length > 0) {

				if (Person_guest === null || Person_guest.constructor === app.Person) {
				
					_selectedGuest = Person_guest;
				}

				else {
				
					throw new IllegalArgumentError('Guest must be instance of Person')
				}
			}
			
			return _selectedGuest;
		};


	/*----------------------------------------------------------------------------------------
	* Private instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
		function _onAccountSelected(Account_a) {

			this.selectedEvent(null);

			this.selectedGuest(null);

			this.selectedAccount(Account_a); //app.Account.registry.getObjectById(int_accountId));

			this.currentView(_views.eventListView, this.selectedAccount());

			//this.notifyObservers(this.selectedAccount()); // notify observers

			//this.currentView(_views.eventListView); // set view so observers can know which is current

			//_router.onViewChange(_views.eventListView); // update browser history
		}


		/** Handles click on floating 'plus' action button in list views
		*
		* Creates a new object of the requested type and opens it in its detail (form) view for editing.
		*
		* If submitted succesfully, it will be added in its place in the account's object model.
		*
		* If cancelled, the object is removed and all references to it deleted or reset.
		*
		* @param {Model} tmp Temporary Model instance indicating the type of new Model object to be created
		*
		* @return {void}
		*/

		function _onCreateModel(Model_m) {

			switch(Model_m.constructor) {

				case app.Event:

					_newModel = Model_m; // store new model for future reference

					_onEventSelected.call(this, _newModel); // open it in its FormView

					break;

				case app.Person:

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


		function _onEventSelected(Event_e) {

			this.selectedGuest(null);

			this.selectedEvent(Event_e);

			this.currentView(_views.eventView, this.selectedEvent());
		}

		
		function _onGuestSelected(Person_g) {

			this.selectedGuest(Person_g);

			this.currentView(_views.guestView, this.selectedGuest());
		}


	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
		/** Sets up the MVC collaborators to observe/be observed by each other as required.
		*
		*/

		this.init = function() {

			// Create views

				_views =
				{
					accountSettingsView: new app.AccountSettingsView('account-settings-view', 'Account Settings'), // account settings form (email, password and prefs)

					accountProfileView: new app.AccountProfileView('account-profile-view', 'Account Profile'), // account holder profile

					eventListView: new app.EventListView('event-list-view', 'My Events'), // event list

					eventView: new app.EventView('event-view', 'Edit Event'), // event form

					guestListView: new app.GuestListView('guest-list-view', 'Guest List'), // guest list

					guestView: new app.PersonView('guest-view', 'Edit Guest') // guest form
				}

				
				// Register views and controller as mutual observers

				for (var prop in _views) {

					this.registerObserver(_views[prop]);

					_views[prop].registerObserver(app.controller);
				}


			// Set up a router to manage the browser's history

				_router = new app.Router();

				window.onpopstate = function(event) {this.onPopState(event);}.bind(this);

			
			// Set some defaults to use until account creation/selection is developed

				
				this.selectedAccount(app.Account.registry.getObjectById(0)); //debug
				
				this.selectedAccount().defaultLocation('Copenhagen'); // debug

				this.selectedAccount().geoLocationAllowed(true); // debug

				this.selectedAccount().localStorageAllowed(true); // debug

				this.selectedAccount().accountHolder(new app.Person('Superuser')); // debug

				this.selectedAccount().accountHolder().email(new app.Email('superuser@acme.corp')); // debug

				this.selectedAccount().accountHolder().jobTitle('Master Octopus'); // debug
				
				_onAccountSelected.call(this, this.selectedAccount()); // debug


			// Register models and controller as mutual observers

				[app.Account, app.Event, app.Organization, app.Person].forEach(function(klass){

					var objList = klass.registry.getObjectList();

					for (var prop in objList) {

						this.registerObserver(objList[prop]);

						objList[prop].registerObserver(this);
					}

				}.bind(this)); // make sure 'this' references controller correctly within loop
		};

		
		/** Returns true if class implements the interface passed in (by function reference)
		*
		* (Method realization required by ISerializable.)
		*
		* @param {Function} interface The interface we wish to determine if this class implements
		*
		* @return {Boolean} instanceof True if class implements interface, otherwise false
		*	
		*/
		
		this.isInstanceOf = function (func_interface) {
			
			return _implements.indexOf(func_interface) > -1;
		};


		/** Notifies observes (views) of change to the data model
		*
		* @param {Model} Reference to the data model object that caused the update
		*/

		this.notifyObservers = function(Model_m, int_id) {
			
			if (int_id !== undefined) {

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

		
		/*
		this.onDeleteSelected = function(Model_m) {

			switch(Model_m.constructor) {

				case app.Event: // remove event completely from app

					app.Account.registry.removeObject(Model_m);

					this.selectedAccount().removeEvent(Model_m);

					this.currentView().model = undefined;

					Model_m = undefined;

					Materialize.toast('Event was deleted', 4000);

					break;

				case app.Person: // remove person (guest) from this event

					this.selectedEvent().removeGuest(Model_m);

					Materialize.toast(Model_m.name() + ' was taken off the guest list', 4000);

					break;
			}

			Materialize.toast('Item was deleted', 4000);
		}
		*/

		
		/** Handles click events in navbar/dropdown */

		this.onNavSelection = function(event) {

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
			}
		}


		/** Passes history onpopstate events on to router */

		this.onPopState = function(event) {

			_router.onPopState(event);
		};
		
		
		/** Receives and processes update notifications from either view (UI) or data model.
		*
		* Uses JS style 'polymorphism' (i.e. parameter parsing) to decide what to do when invoked.
		*
		* Delegates response to private '_update(...)' functions. See these for supported method signatures.
		*
		* @param {Arguments} An array like object containing whatever params the caller has passed on
		*
		* @return {void}
		*
		* @throws {IllegalArgumentError} If first parameter provided is neither an Model nor a View.
		*
		* @throws {IllegalArgumentError} If second parameter provided (when present) is neither an integer nor a native browser event.
		*
		* @todo Maybe delegate error handling to individual private functions
		*/

		this.update = function() {

			// 'Polymorphic' helper functions handling the different supported method signatures


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


			/** Handles user action in a View
			*
			* Called by public update() method, which also does error handling.
			*
			* @param {View} v Reference to the calling View, or to the type of View we wish to navigate to
			*
			* @param {Model} m Reference to the Model related to the user action (e.g. the Model presented by the form, the selected list item, or the source of data for the next view)
			*
			* @param {int} UIAction The type of action invoked by the user in the UI. Supported action types are defined in app.View.UIAction.
			*
			* @return {void}
			*/

			function __update(View_v, Model_m, int_uiaction) {

				switch (int_uiaction) {

					case app.View.UIAction.CANCEL:

						if (_newModel) { // creating of new model cancelled

							_newModel.constructor.registry.removeObject(_newModel); // remove from registry

							_newModel = null; // reset reference
						}

						break;

					case app.View.UIAction.CREATE:

						_onCreateModel.call(this, Model_m);

						break;

					case app.View.UIAction.DELETE:

						this.removeObserver(Model_m);

						switch(Model_m.constructor) {

							case app.Event: // remove event completely from app

								var evtName = Model_m.name();

								app.Account.registry.removeObject(Model_m);

								this.selectedAccount().removeEvent(Model_m);

								this.currentView().model(undefined);

								Model_m = undefined;

								Materialize.toast(evtName + ' was deleted', 4000);

								break;

							case app.Person: // remove person (guest) from this event, but keep in account

								this.selectedEvent().removeGuest(Model_m);

								Materialize.toast(Model_m.name() + ' was taken off the guest list', 4000);

								break;
						}

						window.history.back();

						break;

					case app.View.UIAction.NAVIGATE: // navigation to (sub)view requested

						var view;

						for (var prop in _views) { // get (existing) view matching the request

							if (_views[prop].constructor === View_v.constructor) {

								view = _views[prop];
							}
						}

						if (view) {

							this.currentView(view, Model_m);
						}

						View_v = undefined; // try to speed up garbage collection of temporary helper object

						break;
					
					case app.View.UIAction.SELECT:

						switch (View_v.constructor) {

								case app.EventListView: // selection made in event list

									_onEventSelected.call(this, Model_m);

									break;

								case app.GuestListView: // selection made in guest list

									_onGuestSelected.call(this, Model_m);

									break;
							}

						break;

					case app.View.UIAction.SUBMIT: // update to Model submitted by form

						if (_newModel) { // new Model succesfully added to the account, insert into ecosystem

							switch(Model_m.constructor) {

								case app.Event:

									this.selectedAccount().addEvent(_newModel); // add to event list

									break;

								case app.Person:

									this.selectedEvent().addGuest(_newModel); // add to guest list

									break;
							}

							_newModel = null; // reset and dereference temporary model
						}

						this.notifyObservers(Model_m, View_v.model().id()); // update new model with any user edits

						window.history.back(); // go one step back in browser history

						break;

					default:

						console.log('UI action ' + int_uiaction + ' not supported');
				}
			}
			
			
			// Parse parameters to invoke appropriate 'polymorphic' response

			var args = arguments[0];

			switch (args.length) {

				case 1: // state change notification from Model

					if (args[0].isInstanceOf(app.Model)) { // first param is instance of Model

							_update.call(this, args[0]);
					}

					else {

						throw new IllegalArgumentError('Expected instance of Model');
					}

					break;

				case 3: // user action notification from View

					if (args[0].isInstanceOf(app.View)) { // first param is instance of View

						if (args[1].isInstanceOf(app.Model)) { // second param is instance of Model

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

//void app.IInterfaceable.mixInto(app.IInterfaceable, app.Controller);

void app.IInterfaceable.mixInto(app.IObservable, app.Controller);

void app.IInterfaceable.mixInto(app.IObserver, app.Controller);