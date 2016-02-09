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

	/*
	_currentView, // viewmodel currently presented in the UI
	
	_accountView, // viewmodel handling the account form

	_eventView, // viewmodel handling the event form

	_eventListView, // viewmodel handling the event list

	_guestView, // viewmodel handling the guest form

	_guestListView, // viewmodel handling the guest list

	*/
	_selectedAccount = null, // the currently selected account, or null if none selected

	_selectedEvent = null, // the currently selected event, or null if none selected

	_selectedGuest = null, // the currently selected guest, or null if none selected

	_views // collection of views we need to keep track of

		
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

		this.notifyObservers(_selectedAccount);
	};


	this.onEventSelected = function(int_eventId) {

		this.selectedEvent(app.Event.registry.getObjectById(int_eventId));

		this.selectedGuest(null);

		this.notifyObservers(_selectedEvent);
	};


	this.onGuestListSelected = function() {

		//app.personView.render(_selectedEvent.guests());

		// bind guest form to event, display form
	};


	this.onGuestSelected = function(int_guestId) {

		this.selectedGuest(app.Person.registry.getObjectById(int_guestId));

		this.notifyObservers(_selectedGuest);
	};


	/** Notifies observes (views) of change to the data model
	*
	* @param {IModelable} Reference to the data model object that caused the update
	*/

	this.notifyObservers = function(IModelable) {

		this.observers.forEach(function(observer) {

			switch (observer.constructor) {

				//case app.AccountListView // account list

					//

					//break;

				case app.AccountView: // account form

					observer.update(_selectedAccount);

					break;

				case app.EventListView: // event list

					observer.update(_selectedAccount);

					break;

				case app.EventView: // event form

					observer.update(_selectedEvent);

					break;

				case app.PersonListView: // guest list

					observer.update(_selectedEvent);

					break;

				case app.PersonView: // guest form

					observer.update(_selectedGuest);

					break;
			}
		});
	}


	/** Initializes the controller
	*
	*/

	app.Controller.prototype.init = function() {

		// Create views and apply bindings

			_views =
			{
				accountView: new app.AccountView(), // account form

				eventListView: new app.EventListView(), // event list

				eventView: new app.EventView(), // event form

				guestListView: new app.PersonListView(), // guest list

				guestView: new app.PersonView() // guest form
			}

			for (var prop in _views) {

				this.registerObserver(_views[prop]);

				_views[prop].registerObserver(this);
			}


		// Register controller as observer of every object in the data model

			app.registry.getObjectList().forEach(function(registry){

				var objList = registry.getObjectList();

				for (var prop in objList) {

					objList[prop].registerObserver(app.controller);
				}
			});


		// Set some defaults to use until account creation/selection is ready

			this.onAccountSelected(0); //debug

			this.selectedAccount().defaultLocation('Copenhagen'); // debug

			this.selectedAccount().geolocationAllowed(true); //debug

			this.selectedAccount().localStorageAllowed(true); //debug
	};

	
	/** Update in response to notifications from either UI or data model
	*
	* Uses JS style 'polymorphism' to decide what to do when invoked.
	*
	* @param {Object} obj Reference to an IModelable or an IViewable.
	*
	* @param {int} id Object id (optional). If following an IViewable, handled as a click in a list of same IViewables. If following an IModelable, handled as submission of update to IModelable with same id.
	*
	* @return {void}
	*
	* @throws {IllegalMethodError} If obj is neither an IModelable nor an IViewable
	*/

	this.update = function(Object_obj, int_objId) {

		/*
		Update implements JS version of method polymorphism, i.e. parsing function parameters.
		
		Supported method 'signatures' are as follows:

		- update(IViewable, int): Click received in list of objects of same class as IViewable

		- update(IModelable, int): Submission received from form representing IModelable of same class and id

		- update(IModelable): Update received from data model. Object represents itself.
		*/

		if (arguments.length > 1 && typeof arguments[1] !== 'undefined') { // id provided

			if (Object_obj.isInstanceOf(app.IModelable)) { // form submitted

				var sourceObj = Object_obj.constructor.registry.getObjectById(int_objId);

				sourceObj.update(Object_obj, parseInt(int_objId));
			}

			else if (Object_obj.isInstanceOf(app.IViewable)) { // list item clicked

				switch (Object_obj.constructor)	{

					case app.EventListView: // event list

						this.onEventSelected(int_objId);

						break;
					
					case app.PersonListView: // guest list

						this.onGuestSelected(int_objId);

						break;
					}
			}

			else { // wrong type

				throw new IllegalArgumentError('Expected IModelable or IViewable');
			}
		
		}

		else if (Object_obj.isInstanceOf(app.IModelable)) { // data model updated

			this.notifyObservers();
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
		

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObservable, app.Controller);

void app.InterfaceHelper.mixInto(app.IObserver, app.Controller);