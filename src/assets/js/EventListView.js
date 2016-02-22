'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventListView extends ListView
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for event list(s). Renders list in UI, and captures UI events in list.
*
* @extends ListView
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
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literal for use by parent class constructor

	this.className = 'EventListView';

	
	/** Initialize instance members inherited from parent class*/
	
	app.ListView.call(this, app.Account, str_elementId, str_heading);


	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/
		
	this.parentList().push(app.EventListView);
};

/*----------------------------------------------------------------------------------------
* Inherit from ListView
*---------------------------------------------------------------------------------------*/	

app.EventListView.prototype = Object.create(app.ListView.prototype); // Set up inheritance

app.EventListView.prototype.constructor = app.EventListView; //Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

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

		innerHTML: this.heading()
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

	this.$renderContext().empty();

	this.$renderContext().append(UlElement);
	
	this.$renderContext().append(this.createFloatingActionButton('event-list-add', 'add', 'red', 'Add event'));


	// Attach event handlers (other than for list item click)

	$('#event-list-add').click(function(event) {

		app.controller.onAddEvent(event);
	});
};


/** Updates event list presentation when notified by controller of change */

app.EventListView.prototype.update = function(IModelable) {
	
	if (this.doUpdate(IModelable)) {

		this.model(IModelable);

		this.render(IModelable);
	}

	// else do nothing
};