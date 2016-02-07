'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class Controller Implements IObserver IObservable
******************************************************************************/

var app = app || {};

/** @classdesc The 'octopus' connecting the datamodel and the UI of the app
*
* @constructor
*
* @author Ulrik H. Gade, January 2016
*/

app.Controller = function() {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _implements = [app.IObservable, app.IObserver], // list of interfaces implemented by this class (by function reference)


	 _currentView, // viewmodel currently presented in the UI

	
	_eventView, // viewmodel handling the event form

	_eventListView, // viewmodel handling the event list

	_guestView, // viewmodel handling the guest form

	_guestListView, // viewmodel handling the guest list


	_selectedAccount = null, // the currently selected account, or null if none selected

	_selectedEvent = null, // the currently selected event, or null if none selected

	_selectedGuest = null; // the currently selected guest, or null if none selected


	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

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
	
	// none so far
	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
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


	this.onAccountSelected = function(int_accountId) {

		this.selectedAccount(app.Account.registry.getObjectById(int_accountId));

		this.selectedEvent(null);

		this.selectedGuest(null);

		this.notifyObservers();
	};


	this.onEventSelected = function(int_eventId) {

		this.selectedEvent(app.Event.registry.getObjectById(int_eventId));

		this.selectedGuest(null);

		this.notifyObservers();
	};


	this.onGuestListSelected = function() {

		//app.personView.render(_selectedEvent.guests());

		// bind guest form to event, display form
	};


	this.onGuestSelected = function(int_guestId) {

		this.selectedGuest(app.Person.registry.getObjectById(int_guestId));

		this.notifyObservers();
	};

	
	this.notifyObservers = function() {

		this.observers.forEach(function(observer) {

			switch (observer.constructor) {

				case app.EventListView:

					observer.update(_selectedAccount);

					break;

				case app.EventView:

					observer.update(_selectedEvent);

					break;

				case app.PersonListView:

					observer.update(_selectedEvent);

					break;

				case app.PersonView:

					observer.update(_selectedGuest);

					break;

			}
		});
	}


	app.Controller.prototype.init = function() {

		// Create views and set up observers

		_eventListView = new app.EventListView();

		this.registerObserver(_eventListView);

		_eventListView.registerObserver(this);


		_eventView = new app.EventView();

		this.registerObserver(_eventView);

		_eventView.registerObserver(this);

		
		_guestListView = new app.PersonListView();

		this.registerObserver(_guestListView);

		_guestListView.registerObserver(this);

		
		_guestView = new app.PersonView();

		this.registerObserver(_guestView);

		_guestView.registerObserver(this);

		
		// Set some defaults until account creation/selection is ready

		this.onAccountSelected(0); //debug

		this.selectedAccount().defaultLocation('Copenhagen'); // debug

		this.selectedAccount().geolocationAllowed(true); //debug

		this.selectedAccount().localStorageAllowed(true); //debug
	};

	this.update = function(Object_obj, int_objId) {

		// All callers pass in the id of the data object concerned.
		// Forms also pass in an object holding the data to be used for updating.
		// The data object is of the same class as the model object it updates.

		if (Object_obj.constructor) {

			switch (Object_obj.constructor)	{

				case app.EventListView: // item click in event list

					this.onEventSelected(int_objId);

					break;

				case app.Event: // submission from the event form

					// Update event in datamodel

					var event = app.Event.registry.getObjectById(int_objId);

					event.update(Object_obj, int_objId);

					// Refresh all views

					this.notifyObservers();

					break;

				case app.PersonListView: // item click in guest list

					this.onGuestSelected(int_objId);

					break;

				case app.Person: // submission from the guest form

					// Update person in datamodel

					var person = app.Person.registry.getObjectById(int_objId);

					person.update(Object_obj, int_objId);

					// Refresh all views

					this.notifyObservers();

					break;

				
			}
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
		

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObservable, app.Controller);

void app.InterfaceHelper.mixInto(app.IObserver, app.Controller);