'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventListView Implements IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for event list(s). Renders list in UI, and captures UI events in list.
*
* @implements IViewable
*
* @param (String) elementId Id of the HTML DOM element the view is bound to
*
* @param (String) heading Content for the list heading
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*
* @todo Add unit testing (of rendering in browser)
*/

app.EventListView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _implements = [app.IObservable, app.IObserver, app.IViewable], // list of interfaces implemented by this class (by function reference);

	$_renderContext = $('#' + str_elementId),

	_heading = str_heading, // content of the view heading

	_modelId; // id of the model object currently presented in the view

	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	

	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Get ID of model object currently being presented by the view
	*
	* @return {int}
	*/

	this.modelId = function() {

		return _modelId;
	}


	/** Gets HTML element this view will render to */

	this.renderContext = function() {

		if (arguments.length > 0) {

			throw new IllegalArgumentError('Render context is readonly');
		}

		return $_renderContext;
	}


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
	

	/** Renders collection of events in an account to list in the UI
	*
	* @param {Account} Account The currently selected Account
	*/

	this.render = function(Account_account) {
		
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

			innerHTML: _heading
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
		
		// Update DOM

		$_renderContext.empty();

		$_renderContext.append(UlElement);
		
		$_renderContext.append(this.createFloatingActionButton('event-list-add', 'add', 'red', 'Add event'));


		// Attach event handlers (other than for list item click)

		$('#event-list-add').click(function(event) {

			app.controller.onAddEvent(event);
		});
	};

	
	/** Updates event list presentation when notified by controller of change */
	
	this.update = function(IModelable_account) {
		
		if (IModelable_account === null || IModelable_account.constructor === app.Account) {

			this.render(IModelable_account);

			_modelId = IModelable_account.id();
		}

		// else do nothing
	};


	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/
		
	$_renderContext.addClass('iviewable'); // set shared view class on main HTML element
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