'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventListView Implements IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for event list(s). Renders list in UI, and captures UI events in list.
*
* @implements IViewable
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
	

	/** Renders collection of events in an account to list in the UI
	*
	* @param {Account} Account The currently selected Account
	 */

	app.EventListView.prototype.render = function(Account_account) {
		
		function renderListItem(Event_event, self) {

			var listElmnt = self.createElement({ // li

				element: 'li',

				attributes: {id: 'event-list-id-' + Event_event.id()},

				classList: ['collection-item']
			});


			var divElmnt = self.createElement({ // div

				element: 'div',

				innerHTML: (Event_event.name() ? Event_event.name() : 'Unnamed event') + ' (' + Event_event.guests().length + ')',

				listeners:
				{
					//click: function(e) {self.notifyObservers(Event_event.id());}

					click: function(e) {self.notifyObservers(self, Event_event.id());}
				}
			});

						
			var anchorElmnt = self.createElement({ // anchor

				element: 'a',

				attributes: {href: '#!'},

				classList: ['secondary-content']

			});

			
			anchorElmnt.appendChild(self.createElement({ // icon

				element: 'i',

				classList: ['material-icons'],

				innerHTML: 'chevron_right'
			}));
			
						
			listElmnt.appendChild(divElmnt);
			
			divElmnt.appendChild(anchorElmnt);
			
			
			return listElmnt;
		}

		var UlElement = this.createElement({

			element: 'ul',

			classList: ['collection', 'with-header']
		});


		UlElement.appendChild(this.createElement({

			element: 'h4',

			classList: ['collection-header'],

			innerHTML: 'My Events'
		}));

				
		if (Account_account !== null) { // we have an account

			var events = Account_account.events() // generate list items
			
			for (var prop in events) {

				UlElement.appendChild(renderListItem(events[prop], this));
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

void app.IInterfaceable.mixInto(app.IObservable, app.EventListView);

void app.IInterfaceable.mixInto(app.IObserver, app.EventListView);

void app.IInterfaceable.mixInto(app.IViewable, app.EventListView);