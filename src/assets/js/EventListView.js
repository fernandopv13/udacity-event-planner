'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventListView Implements IObservable IObserver IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for event list(s). Renders list in UI, and captures UI events in list.
*
* @implements IObservable IObserver IViewable
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*
* @todo Add unit testing (of rendering in browser)
*/

app.EventListView = function(Event_event) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	//var _event, // (Event) The event in the data model this EventView is observing
	
	var _implements = [app.IObservable, app.IObserver, app.IViewable]; // list of interfaces implemented by this class (by function reference);

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	// none so far

	
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
	

	/** Respond to tap/click on event in events list */
	
	app.EventView.prototype.onclick = function(int_eventId) {
		
		app.controller.onEventSelected(int_eventId);
	};
	

	/** Renders collection of events in an account to list in the UI
	*
	* @param {Account} Account The currently selected Account
	 */

	app.EventListView.prototype.render = function(Account_account) {
		
		function renderListItem(Event_event) {

			var listElmnt = document.createElement('li');
			
			listElmnt.classList.add('collection-item');
			
			listElmnt.id = 'event-list-id-' + Event_event.id();
			
			
			var divElmnt = document.createElement('div');
			
			divElmnt.innerHTML = (Event_event.name() ? Event_event.name() : 'Unnamed event') + ' (' + Event_event.guests().length + ')';
			
			divElmnt.onclick = function(e) {app.controller.onEventSelected(Event_event.id());};
			
			
			var anchorElmnt = document.createElement('a');
			
			anchorElmnt.classList.add('secondary-content');

			anchorElmnt.href = '#!';
			
			
			var iconElement = document.createElement('i');
			
			iconElement.classList.add('material-icons');
			
			iconElement.innerHTML = 'chevron_right';

			
			listElmnt.appendChild(divElmnt);
			
			divElmnt.appendChild(anchorElmnt);
			
			anchorElmnt.appendChild(iconElement);
			
			
			return listElmnt;
		}

		
		var UlElement = document.createElement('ul'); // generate list
		
		UlElement.classList.add('collection');

		UlElement.classList.add('with-header');


		var headerElmnt = document.createElement('h4'); // generate header

		headerElmnt.classList.add('collection-header');

		headerElmnt.innerHTML = 'My Events';

		UlElement.appendChild(headerElmnt);

		
		if (Account_account !== null) { // we have an account

			var events = Account_account.events() // generate list items
			
			for (var prop in events) {

				UlElement.appendChild(renderListItem(events[prop]));
			}
		}

		else {

			UlElement.appendChild(this.createElement({

				element: 'p',

				innerHTML: 'No account selected. Please select or create an account in order to see events.'
			}));
		}
		
		var $list = $('#event-list'); // update DOM

		$list.empty();

		$list.append(UlElement);
	};

	
	/** Updates event list presentation when notified by controller of change */
	
	app.EventListView.prototype.update = function(IModelable_Account) {
		
		this.render(IModelable_Account);
	};


	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// none so far
	
};


/*----------------------------------------------------------------------------------------
* Public static members
*---------------------------------------------------------------------------------------*/

// none so far


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObservable, app.EventListView);

void app.InterfaceHelper.mixInto(app.IObserver, app.EventListView);

void app.InterfaceHelper.mixInto(app.IViewable, app.EventListView);