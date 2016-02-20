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

	_router; // router managing browser history

	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	
		
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets or sets the view currently being displayed in the UI.
	*
	* When setting, hides the existing view and shows the new one.
	*
	* @param {IViewable} currentView The current view, or null
	*
	* @return {IViewable} The current view, or null
	*
	* @throws {IllegalArgumentError} If attempting to set a view that is not an IViewable, or null
	*/
	
	this.currentView = function (IViewable_view) {
	
		if (arguments.length > 0) {

			if (IViewable_view === null || IViewable_view.isInstanceOf(app.IViewable)) {
			
				if (_currentView) {_currentView.hide()}

				_currentView = IViewable_view;

				_currentView.show();

				_router.onViewChange(IViewable_view);
			}

			else {
			
				throw new IllegalArgumentError('View must be instance of IViewable')
			}
		}
		
		return _currentView;
	};


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


		// Register controller as observer of every IModelable in the data model

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
	* @param {IModelable} Reference to the data model object that caused the update
	*/

	this.notifyObservers = function(IModelable) {

		this.observers.forEach(function(observer) {

			observer.update(IModelable);
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

		this.notifyObservers(_selectedAccount);

		this.currentView(_views.eventListView);
	};


	this.onEventSelected = function(int_eventId) {

		this.selectedEvent(app.Event.registry.getObjectById(int_eventId));

		this.selectedGuest(null);

		this.notifyObservers(_selectedEvent);

		this.currentView(_views.eventView);
	};

	this.onGuestListSelected = function(int_eventId) {

		//this.selectedEvent(app.Event.registry.getObjectById(int_eventId));

		this.selectedGuest(null);
		
		this.currentView(_views.guestListView);
	};


	this.onGuestSelected = function(int_guestId) {

		this.selectedGuest(app.Person.registry.getObjectById(int_guestId));

		this.notifyObservers(_selectedGuest);

		this.currentView(_views.guestView);
	};


	/** Handles click events in navbar/dropdown */

	this.onNavSelection = function(event) {

		switch (event.target.href.split('!')[1]) { // parse the URL partial after #!

			case 'Search':

				break;

			case 'Settings':

				this.currentView(_views.accountSettingsView);

				break;

			case 'Profile':

				this.currentView(_views.accountProfileView);
				
				break;

			case 'About':

				break;

			case 'Sign Out':

				break;
		}
	}


	this.onPopState = function(event) {

		_router.onPopState(event);
	};
	
	
	/** Update in response to notifications from either UI or data model.
	*
	* Uses JS style 'polymorphism' (i.e. parameter parsing) to decide what to do when invoked
	*
	* (see comments in code for supported method signatures).
	*
	* @param {IModelable} model Reference to an IModelable (data model object). If not accompanied by an id, call is handled as a notification of a change to the data model requiring a view update.
	*
	* @param {IViewable} view Reference to an IViewable. Expected to be accompanied by an id or a native Event.
	*
	* @param {int} id Object id. If following an IViewable, call is handled as a tap/click in a list of the type the IViewables is presenting. If following an IModelable, handled as submission of an update to the IModelable with same class and id.
	*
	* @param {nEvent} event Native browser event. Expected to follow IViewable. If present, handled as user interaction that requires Controller involvement, and is not just a main click in a list
	*
	* @return {void}
	*
	* @throws {IllegalArgumentError} If first parameter provided is neither an IModelable nor an IViewable
	*/

	this.update = function(Object_obj, intOrEvent) {

		/*
		Update implements JS version of method polymorphism, i.e. by parsing function parameters.
		
		Supported method 'signatures' are as follows:

		- update(IViewable, int): Click received in list of objects of IModelable class matching IViewable

		- update(IViewable, Event): Native UI event in IViewable requires Controller supervision

		- update(IModelable, int): Submission received from form representing IModelable of same class and id

		- update(IModelable): Update received from data model. Object represents itself.
		*/

		// Some inner utility functions to help keep the main algorithm clean

		function onFormSubmitted(self, Object_obj, int_id) {

			var sourceObj = Object_obj.constructor.registry.getObjectById(int_id); // update data model

			sourceObj.update(Object_obj, int_id);
		}

		function onListItemClicked(self, Object_obj, int_id) {

			/* Using the more generic update(IViewable, Event) form might void the need for this.
			* But that would make retrieving the id of the clicked object more tightly coupled
			* to the implementation of the view. So keeping this for now.
			*/

			switch (Object_obj.constructor)	{

				case app.EventListView: // Event list

					self.onEventSelected(int_id);

					break;
				
				case app.GuestListView: // Guest list

					self.onGuestSelected(int_id);

					break;
			}
		}

		function onNativeEventReceived(self, Object_obj, event) {

			var id;

			switch (Object_obj.constructor)	{ // Branch on IViewable implementer type

				case app.EventView: // Event form

					// Not crazy about the controller knowing the id of the div, but will do for now

					if (event.target.id === 'event-edit-guests-button') { // click on 'edit guests' button

						self.onGuestListSelected(); // show guest list
					}

					break;
			}
		}

		function onDataModelUpdated(self, Object_obj) {

			// If a new event or guest was added, first register it with its account or event

			switch (Object_obj.constructor) {

				case app.Event: // event

					if (!self.selectedAccount().isInAccount(Object_obj)) { // account does not know event

						self.selectedAccount().addEvent(Object_obj); // so add it
					}

					break;
				
				case app.Person: // guest

					//Bit of a hack to exclude account holder from guest list, but acceptable for now

					if (Object_obj.id() !== self.selectedAccount().accountHolder().id()) { // account holder cannot be guest

						if (self.selectedEvent()) { // an event has been selected

							if (!self.selectedEvent().isGuest(Object_obj)) { // event doesn't know person

								self.selectedEvent().addGuest(Object_obj); // so add as guest
							}
						}
					}

					break;
			}


			// then notify observers (i.e. views)

			self.notifyObservers(Object_obj);
		}


		// Main algorithm

		if (arguments.length > 1 && typeof arguments[1] !== 'undefined') { // second param provided

			if (intOrEvent === parseInt(intOrEvent)) { // id exists and is an integer

				var int_id = parseInt(intOrEvent);

				if (Object_obj.isInstanceOf(app.IModelable)) { // form submitted

					onFormSubmitted(this, Object_obj, int_id);
				}

				else if (Object_obj.isInstanceOf(app.IViewable)) { // list item clicked

					onListItemClicked(this, Object_obj, int_id);
				}

				else { // Wrong type

					throw new IllegalArgumentError('Expected IModelable or IViewable');
				}
			}

			else if (intOrEvent.originalEvent && Object_obj.isInstanceOf(app.IViewable)) { // Native event from IViewable

				onNativeEventReceived(this, Object_obj, intOrEvent);
			}

			else { // id neither an integer nor a native browser Event

				throw new IllegalArgumentError('Param must be an integer or a native browser Event');
			}
		}

		else if (Object_obj.isInstanceOf(app.IModelable)) { // data model updated

			onDataModelUpdated(this, Object_obj);
		}

		else { // wrong type

			throw new IllegalArgumentError('Expected IModelable');
		}
	}
	
	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
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

void app.IInterfaceable.mixInto(app.IObservable, app.Controller);

void app.IInterfaceable.mixInto(app.IObserver, app.Controller);