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

						//console.log('setting currentView to ' + View_v.className()); // debug

						this.update(Model_m, View_v); // first notify observers: forms won't update if they are the current view
						
						for (var view in _views) {

							_views[view].hide('fast');  // hide all views

							_views[view].onUnLoad(); // have hidden views clean up after themselves						

						}

						_currentView = View_v; // set current view

						_currentView.show('slow'); // show current view

						//_currentView.onLoad(); // have current view init itself

						
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
					
						throw new IllegalArgumentError('Expected instance of Account')
					}
				}
				
				return _selectedAccount;
			};


			/** Gets or sets the currently selected Event
			*
			* @param {Event} selectedEvent The selected event, or null
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
					
						throw new IllegalArgumentError('Expected instance of Event')
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
					
						throw new IllegalArgumentError('Expected instance of Person')
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

			this.onAccountSelected = function(Account_a) { // temporary adapter while transitioning to the Strategy pattern

				this.selectedEvent(null);

				this.selectedGuest(null);

				this.selectedAccount(Account_a);

				this.currentView(_views.eventListView, this.selectedAccount());
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

			this.onEventSelected = function(Event_e) { // temporary adapter while transitioning to the Strategy pattern

				this.selectedGuest(null);

				this.currentView(_views.eventView, this.selectedEvent(Event_e));
			};

			
			this.onGuestSelected = function(Person_g) { // temporary adapter while transitioning to the Strategy pattern

				this.currentView(_views.guestView, this.selectedGuest(Person_g));
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

				
				// Register (concrete) ViewUpdateHandlers and controller as mutual observers

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

						handler.registerObserver(this);

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


			
			/** Handles click events in navbar/dropdown */

			this.onNavSelection = function(nEvent) {

				switch (event.target.href.split('!')[1]) { // parse the URL partial after #!

					case 'Search':

						break;

					case 'Settings':

						this.currentView(_views.accountSettingsView, this.selectedAccount());

						break;

					case 'Profile':

						this.currentView(

							_views.accountProfileView,

							this.selectedAccount().accountHolder() || this.selectedAccount().accountHolder(new module.Person())
						);
						
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
			* @param {Model} m The Model that has changed state and therefore invoked the update.
			*
			* @return {Boolean} true if the update was carried out, otherwise false
			*/

			function _update(Model_m) {

				if (arguments.length === 1) { // call has expected number of params

					//console.log('call has expected number of params'); // debug

					if (typeof Model_m !== 'undefined' && Model_m !== null && Model_m.isInstanceOf && Model_m.isInstanceOf(module.Model)) { // param is instance of Model

						var View_v;

						for(var prop in _views) { // get the View that is bound to the Model

							if (_views[prop].modelClass() === Model_m.constructor) {

								View_v = _views[prop];

								break;
							}
						}

						if (View_v) { // if there is a match, dispatch update to Views

							//console.log('Notifying Views of update from Model: Model, View'); //debug

							//console.log([Model_m, View_v]);

							this.notifyObservers(Model_m, View_v);	
						}

						//else: fail silently (not all models are bound to a view, and that's OK)

						return true;
					}
				}

				return false; // default to false
			}


			/** Handles Model-directed responses to user action from ViewUpdateHandler
			*
			* Called by public update() method, which also does error handling.
			*
			* @param {Model} m The Model the targeted View is bound to, or null.
			*
			* @param {int} id The id of the Model targeted by the update.
			*
			* @return {Boolean} true if the update was carried out, otherwise false
			*/

			function __update(Model_m, int_id) {

				if (arguments.length === 2) { // call has expected number of params

					//console.log('call has expected number of params'); // debug

					if (typeof int_id === 'number') { // second param is a number (integer)

						if (typeof Model_m !== 'undefined' && Model_m.isInstanceOf && Model_m.isInstanceOf(module.Model)) { // first param is instance of Model

							//console.log('Notifying Models of update from View(UpdateHandler): Model, int');

							this.notifyObservers(Model_m, int_id);

							return true;
						}
					}
				}

				return false; // default to false
			}


			/** Handles View-directed responses to user action from ViewUpdateHandler
			*
			* Called by public update() method, which also does error handling.
			*
			* @param {Model} m The Model the targeted View is bound to, or null.
			*
			* @param {View} v The View targeted by the update.
			*
			* @return {Boolean} true if the update was carried out, otherwise false
			*/

			function ___update(Model_m, View_v) {

				if (arguments.length === 2) { // call has expected number of params

					//console.log('call has expected number of params'); // debug

					if (typeof View_v !== 'undefined' && View_v.isInstanceOf && View_v.isInstanceOf(module.View)) { // second param is instance of View

						if (Model_m === null || (typeof Model_m !== 'undefined' && Model_m.isInstanceOf && Model_m.isInstanceOf(module.Model))) { // first param is instance of Model, or null

							//console.log('Notifying Views of update from ViewUpdateHandler: Model, View');

							//console.log(arguments);

							this.notifyObservers(Model_m, View_v);

							return true;
						}
					}
				}

				return false; // default to false
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
			* @return {Boolean} true if the update was carried out, otherwise false
			*/

			function ____update(View_v, Model_m, int_uiAction) {

				if (arguments.length === 3) { // call has expected number of params

					if (typeof View_v === 'object' && View_v !== null && View_v.isInstanceOf && View_v.isInstanceOf(module.View)) { //console.log('first param is instance of View');

						if (typeof Model_m === 'object' && (Model_m === null || (Model_m.isInstanceOf && Model_m.isInstanceOf(module.Model)))) { //console.log('second param is instance of Model, or null');

							if (typeof int_uiAction === 'number') { //console.log('third param is number (integer)');

								//console.log('Notifying ViewUpdateHandlers of user action notification in View'); // debug

								this.notifyObservers(int_uiAction, Model_m, View_v);

								return true;
							}
						}
					}
				}

				return false; // default to false
			}
			

			/** Handles update notifications from either of the Controllers collaborators
			*
			* Uses JS style 'polymorphism' (i.e. parameter parsing) to decide what to do when invoked.
			*
			* Delegates response to private '_update(...)' functions. See these for supported method signatures.
			*
			* @param {Arguments} args An array like object containing whatever params the caller has passed on. This approach keeps the signature generic while providing the necessary flexibility.
			*
			* @return {void}
			*
			* @throws {IllegalArgumentError} If supplied parameters do not comply with a supported method signature
			*/

			this.update = function() {

				// Using 'internal strategy pattern' to avoid unwieldy branching statement that doesn't scale,
				// i.e. call every private _update() subfunction, passing in arguments received, until a match is found (or not),
				// letting subfunctions decide whether to respond (in this case, subfunction signatures must be mutually exclusive).

				var args = arguments, ret = false, strategies = [_update, __update, ___update, ____update];

				//console.log(args); // debug

				for (var i = 0, len = strategies.length; i < len; i++) { // using 'for' b/c forEach does not support break

					switch (args.length) { // 'strategies' evaluate param count, so branch call

						case 3:

							ret = strategies[i].call(this, args[0], args[1], args[2]);

							break;

						case 2:

							ret = strategies[i].call(this, args[0], args[1]);

							break;

						case 1:

							ret = strategies[i].call(this, args[0]);

							break;
					}

					if (ret) {break;} // we only need a single match, so break when found
				}

				if (!ret) { // no 'strategy' matches provided params

					console.log(args);

					throw new IllegalArgumentError('Unexpected method signature. See docs/source for supported signatures.');
				}
			}
	};

	/*----------------------------------------------------------------------------------------
	Mix in default methods from implemented interfaces, unless overridden by class or ancestor
	*---------------------------------------------------------------------------------------*/

	void module.IInterfaceable.mixInto(module.IInterfaceable, module.Controller);

	void module.IInterfaceable.mixInto(module.IObservable, module.Controller);

	void module.IInterfaceable.mixInto(module.IObserver, module.Controller);

})(app);