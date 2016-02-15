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
*/

app.Controller = function() {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _implements = [app.IObservable, app.IObserver], // list of interfaces implemented by this class (by function reference)

	_selectedAccount = null, // the currently selected account, or null if none selected

	_selectedEvent = null, // the currently selected event, or null if none selected

	_selectedGuest = null, // the currently selected guest, or null if none selected

	_views // collection of views we need to keep track of

	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	
		
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

				case app.AccountSettingsView: // account settings form

					observer.update(_selectedAccount);

					break;

				case app.AccountProfileView: // account profile form

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


	/** Sets up the MVC collaborators to observe/be observed by each other as required.
	*
	*/

	app.Controller.prototype.init = function() {

		// Create views and apply bindings

			_views =
			{
				accountSettingsView: new app.AccountSettingsView('account-settings-view', 'Account Settings'), // account settings form (email, password and prefs)

				accountProfileView: new app.AccountProfileView('account-profile-view', 'Account Profile'), // account holder profile

				eventListView: new app.EventListView('event-list-view', 'My Events'), // event list

				eventView: new app.EventView('event-view', 'Edit Event'), // event form

				guestListView: new app.PersonListView('guest-list-view', 'Guest List'), // guest list

				guestView: new app.PersonView('guest-view', 'Edit Guest') // guest form
			}

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


		// Set some defaults to use until account creation/selection is developed

			
			this.selectedAccount(new app.Account());//(app.Account.registry.getObjectById(0)); //debug
			
			this.selectedAccount().defaultLocation('Copenhagen'); // debug

			this.selectedAccount().geoLocationAllowed(true); // debug

			this.selectedAccount().localStorageAllowed(true); // debug

			this.selectedAccount().accountHolder(new app.Person('Superuser')); // debug

			this.selectedAccount().accountHolder().email(new app.Email('superuser@acme.corp')); // debug

			this.selectedAccount().accountHolder().jobTitle('Master Octopus'); // debug

			this.onAccountSelected(0); // debug
	};

	
	/** Update in response to notifications from either UI or data model.
	*
	* Uses JS style 'polymorphism' (i.e. parameter parsing) to decide what to do when invoked
	*
	* (see comments in code for supported method signatures).
	*
	* @param {IModelable} model Reference to an IModelable (data model object). If not accompanied by an id, call is handled as a notification of a change to the data model requiring a view update.
	*
	* @param {IViewable} view Reference to an IViewable. Expected to be accompanied by an id-
	*
	* @param {int} id Object id. If following an IViewable, call is handled as a tap/click in a list of the type the IViewables is presenting. If following an IModelable, handled as submission of an update to the IModelable with same class and id.
	*
	* @return {void}
	*
	* @throws {IllegalArgumentError} If first parameter provided is neither an IModelable nor an IViewable
	*/

	this.update = function(Object_obj, int_objId) {

		/*
		Update implements JS version of method polymorphism, i.e. by parsing function parameters.
		
		Supported method 'signatures' are as follows:

		- update(IViewable, int): Click received in list of objects of same class as IViewable

		- update(IModelable, int): Submission received from form representing IModelable of same class and id

		- update(IModelable): Update received from data model. Object represents itself.
		*/

		if (arguments.length > 1 && typeof arguments[1] !== 'undefined') { // id provided

			if (int_objId === parseInt(int_objId)) { // id is an integer

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

			else { // id not an integer

				throw new IllegalArgumentError('ID must be an integer');
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

// none so far


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IObservable, app.Controller);

void app.IInterfaceable.mixInto(app.IObserver, app.Controller);