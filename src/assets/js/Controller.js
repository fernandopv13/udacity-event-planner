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
	* @param {View} currentView The current view, or null
	*
	* @return {View} The current view, or null
	*
	* @throws {IllegalArgumentError} If attempting to set a view that is not a View, or null
	*/
	
	this.currentView = function (View, Model) {
	
		if (arguments.length > 0) { // setting

			if (View === null || View.isInstanceOf(app.View)) {
			
				
				this.notifyObservers(Model); // first notify observers: forms won't update if they are the current view


				for (var view in _views) {_views[view].hide('fast');} // hide all views

				_currentView = View; // set current view

				_currentView.show('slow'); // show current view

				
				if (View.isInstanceOf(app.FormView)) { // if form, show form specific nav/icons

					app.FormView.prototype.onLoad.call(View);
				}

				else { // else, hide form specific nav/icons

					app.FormView.prototype.onUnLoad.call(View);
				}

				
				_router.onViewChange(View); // update browser history
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
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	/** Handles click events in list views.
	*
	* Called by public update() method, which also does error handling.
	*
	* @param {View} view Reference to a View (assumed to be a list view).
	*
	* @param {int} id Id of Model tapped/clicked on. Model type is inferred from type of View.
	*
	* @return {void}
	*/

	function _update(View, int_id) { // Click received in list of Model s displayed by View

			/* Using the more generic update(View, Event) form might void the need for this.
			* But that would make retrieving the id of the clicked object more tightly coupled
			* to the implementation of the view. So keeping this for now.
			*/

			switch (View.constructor)	{

				case app.EventListView: // Event list

					this.onEventSelected(int_id);

					break;
				
				case app.GuestListView: // Guest list

					this.onGuestSelected(int_id);

					break;
			}
	}


	/** Handles native browser events in UI that require more elaborate Controller involvement than simple clicks, submits or cancels.
	*
	* Called by public update() method, which also does error handling.
	*
	* @param {View} view Reference to the View generating the event.
	*
	* @param {nEvent} event Native browser event.
	*
	* @return {void}
	*/

	function __update(View, nEvent) { // Native UI event in View requires Controller supervision

		switch (View.constructor)	{ // Branch on View implementer type

			case app.EventView: // Event form

				// Not crazy about the controller knowing the id of the div, but will do for now

				if (nEvent.target.id === 'event-edit-guests-button') { // click on 'edit guests' button

					this.onGuestListSelected(); // show guest list
				}

				break;
		}
	}


	/** Handles form submit events.
	*
	* Called by public update() method, which also does error handling.
	*
	* @param {Model} model Reference to a temporary Model holding the data to be used for the update. Is of the same class as the Model to be updated.
	*
	* @param {int} id Id of the Model to be updated. Disregarded when creating a new object.
	*
	* @return {void}
	*/
	
	function ___update(Model, int_id) { // Submission received from form representing Model of same class and id as parameters

		var sourceObj = Model.constructor.registry.getObjectById(int_id); // update data model

		sourceObj.update(Model, int_id);
	}


	/** Handles update notifications from the data model.
	*
	* Called by public update() method, which also does error handling.
	*
	* @param {Model} model The Model that has changed state and therefore invoked the update.
	*
	* @return {void}
	*/

	function ____update(Model) { // Update received from data model. Object represents itself.

		// If a new event or guest was added, first register it with its account or event...

		switch (Model.constructor) {

			case app.Event: // event

				if (!this.selectedAccount().isInAccount(Model)) { // account does not know event

					this.selectedAccount().addEvent(Model); // so add it
				}

				break;
			
			case app.Person: // guest

				//Bit of a hack to exclude account holder from guest list, but acceptable for now

				if (Model.id() !== this.selectedAccount().accountHolder().id()) { // account holder cannot be guest

					if (this.selectedEvent()) { // an event has been selected

						if (!this.selectedEvent().isGuest(Model)) { // event doesn't know person

							this.selectedEvent().addGuest(Model); // so add as guest
						}
					}
				}

				break;
		}


		// ...then notify observers (i.e. views)

		this.notifyObservers(Model);
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


		// Register controller as observer of every Model in the data model

			[app.Account, app.Event, app.Organization, app.Person].forEach(function(klass){

				var objList = klass.registry.getObjectList();

				for (var prop in objList) {

					objList[prop].registerObserver(this);
				}

			}.bind(this)); // make sure 'this' references controller correctly within loop


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

			this.onAccountSelected(0); // debug
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

	this.notifyObservers = function(Model) {

		_observers.forEach(function(observer) {

			observer.update(Model);
		});
	}


	/** Handles click on "Add" button in event list */

	this.onAddEvent = function(event) {

		this.onEventSelected(new app.Event().id());
	};

	
	/** Handles click on "Add" button in guest list */

	this.onAddGuest = function(event) {

		// Check if there is capacity before trying to add a new guest

		var evt = this.selectedEvent();

		if (evt.guests().length < evt.capacity()) {

			// add guest immediately; remember to back out if users cancels creation

			this.onGuestSelected(new app.Person().id());
		}
		
		else {

			 Materialize.toast('The event is full to capacity. Increase capacity or remove guests to make room.', 4000)
		}
	};


	this.onAccountSelected = function(int_accountId) {

		this.selectedAccount(app.Account.registry.getObjectById(int_accountId));

		this.selectedEvent(null);

		this.selectedGuest(null);

		this.currentView(_views.eventListView, this.selectedAccount());

		//this.notifyObservers(this.selectedAccount()); // notify observers

		//this.currentView(_views.eventListView); // set view so observers can know which is current

		//_router.onViewChange(_views.eventListView); // update browser history
	};


	this.onDeleteSelected = function(Model) {

		switch(Model.constructor) {

			case app.Event: // remove event completely from app

				app.Account.registry.removeObject(Model);

				this.selectedAccount().removeEvent(Model);

				this.currentView().model = undefined;

				Model = undefined;

				Materialize.toast('Event was deleted', 4000);

				break;

			case app.Person: // remove person (guest) from this event

				this.selectedEvent().removeGuest(Model);

				Materialize.toast(Model.name() + ' was taken off the guest list', 4000);

				break;
		}

		Materialize.toast('Item was deleted', 4000);
	}

	this.onEventSelected = function(int_eventId) {

		this.selectedEvent(app.Event.registry.getObjectById(int_eventId));

		this.selectedGuest(null);

		this.currentView(_views.eventView, this.selectedEvent());

		//this.notifyObservers(this.selectedEvent()); // notify observers

		//this.currentView(_views.eventView); // set view so observers can know which is current

		//_router.onViewChange(_views.eventView); // update browser history
	};


	this.onGuestListSelected = function(int_eventId) {

		this.selectedGuest(null);
		
		this.currentView(_views.guestListView, this.selectedEvent());

		//this.notifyObservers(this.selectedEvent()); // notify observers

		//this.currentView(_views.guestListView); // set view so observers can know which is current

		//_router.onViewChange(_views.guestListView); // update browser history
	};


	this.onGuestSelected = function(int_guestId) {

		this.selectedGuest(app.Person.registry.getObjectById(int_guestId));

		this.currentView(_views.guestView, this.selectedGuest());

		//this.notifyObservers(this.selectedGuest()); // notify observers

		//this.currentView(_views.guestView); // set view so observers can know which is current

		//_router.onViewChange(_views.guestView); // update browser history
	};


	/** Handles click events in navbar/dropdown */

	this.onNavSelection = function(event) {

		switch (event.target.href.split('!')[1]) { // parse the URL partial after #!

			case 'Search':

				break;

			case 'Settings':

				this.currentView(_views.accountSettingsView, this.selectedAccount());

				break;

			case 'Profile':

				this.currentView(_views.accountProfileView, this.selectedAccount());
				
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
	* @return {void}
	*
	* @throws {IllegalArgumentError} If first parameter provided is neither an Model nor a View.
	*
	* @throws {IllegalArgumentError} If second parameter provided (when present) is neither an integer nor a native browser event.
	*
	* @todo Maybe delegate error handling to individual private functions
	*/

	this.update = function(Object_obj, intOrEvent) {

		// Parse parameters to invoke appropriate polymorphic response

		if (arguments.length > 1 && typeof arguments[1] !== 'undefined') { // second param provided

			if (intOrEvent === parseInt(intOrEvent)) { // second param is an integer

				var int_id = parseInt(intOrEvent);

				if (Object_obj.isInstanceOf(app.Model)) { // form submitted

					___update.call(this, Object_obj, int_id);
				}

				else if (Object_obj.isInstanceOf(app.View)) { // list item clicked

					_update.call(this, Object_obj, int_id);
				}

				else { // Wrong type

					throw new IllegalArgumentError('Expected Model or View');
				}
			}

			else if (intOrEvent.originalEvent && Object_obj.isInstanceOf(app.View)) { // second param is a native event from a View

				__update.call(this, Object_obj, intOrEvent);
			}

			else { // id neither an integer nor a native browser Event

				throw new IllegalArgumentError('Param must be an integer or a native browser Event');
			}
		}

		else if (Object_obj.isInstanceOf(app.Model)) { // Model and no second param => data model updated

			____update.call(this, Object_obj); // Model
		}

		else { // wrong type

			throw new IllegalArgumentError('Expected Model');
		}
	}
	
	/*----------------------------------------------------------------------------------------
	* Other initialization (parameter parsing/constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// none so far
	
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/

// none so far


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

//void app.IInterfaceable.mixInto(app.IInterfaceable, app.Controller);

void app.IInterfaceable.mixInto(app.IObservable, app.Controller);

void app.IInterfaceable.mixInto(app.IObserver, app.Controller);