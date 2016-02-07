'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class Controller Implements IObserver IObservable IViewable
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
	
	var _eventView, // viewmodel handling the event form

	_eventListView, // viewmodel handling the event list

	_selectedAccount = null, // the currently selected account, or null if none selected

	_selectedEvent = null, // the currently selected event, or null if none selected

	_selectedGuest = null; // the currently selected guest, or null if none selected


	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets or sets the currently selected (active) account
	*
	* @param {Account} selectedAccount The selected account
	*
	* @return {Account} The selected account
	*
	* @throws {IllegalArgumentError} If attempting to set account that is not an Account
	*/
	
	this.selectedAccount = function (Account_account) {
	
		if (arguments.length > 0) {

			if (Account_account.constructor === app.Account) {
			
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
	* @param {Event} selectedAccount The selected event
	*
	* @return {Event} The selected event
	*
	* @throws {IllegalArgumentError} If attempting to set event that is not an Event
	*/
	
	this.selectedEvent = function (Event_event) {
	
		if (arguments.length > 0) {

			if (Event_event.constructor === app.Event) {
			
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
	* @param {Person} selectedGuest The selected guest
	*
	* @return {Person} The selected guest
	*
	* @throws {IllegalArgumentError} If attempting to set guest that is not a Person
	*/
	
	this.selectedGuest = function (Person_guest) {
	
		if (arguments.length > 0) {

			if (Person_guest.constructor === app.Person) {
			
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
	
	/** Render guest list to the UI */
	
	this.renderGuestList = function() {

		var $list = $('#guest-list');

		$list.empty();

		$list.append(_eventViews[0].render('guest-list')); //debug
	}

	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	this.onAccountSelected = function(int_accountId) {

		this.selectedAccount(app.Account.registry.getObjectById(int_accountId));

		app.EventView.renderList(_selectedAccount);
	};


	this.onEventSelected = function(int_eventId) {

		this.selectedEvent(app.Event.registry.getObjectById(int_eventId));

		app.PersonView.renderList(_selectedEvent);

		// bind event form to event, display form
	};


	this.onGuestListSelected = function() {

		app.personView.render(_selectedEvent.guests());

		// bind guest form to event, display form
	};


	this.onGuestSelected = function(int_guestId) {

		this.selectedGuest(app.Person.registry.getObjectById(int_guestId));

		console.log(int_guestId);

		// bind guest form to event, display form
	};

	
	app.Controller.prototype.init = function() {

		_eventView = new app.EventView();

		this.onAccountSelected(0); //debug

		this.onEventSelected(0); // debug

		this.selectedAccount().defaultLocation('Copenhagen'); // debug

		this.selectedAccount().geolocationAllowed(true); //debug
	};

	
	
	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// None so far
	
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/
		

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObservable, app.Controller);

void app.InterfaceHelper.mixInto(app.IObserver, app.Controller);

void app.InterfaceHelper.mixInto(app.IViewable, app.Controller);