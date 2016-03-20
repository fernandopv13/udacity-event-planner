'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventListView extends ListView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for event list(s). Renders list in UI, and captures UI events in list.
	*
	* @extends ListView
	*
	* @param (String) elementId Id of the HTML DOM element the view is bound to
	*
	* @param (String) heading Content for the list heading
	*
	* @constructor
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @todo Add unit testing (of rendering in browser)
	*/

	module.EventListView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'EventListView';

		this.ssuper = module.ListView;

		
		// Initialize instance members inherited from parent class
		
		module.ListView.call(this, module.Account, str_elementId, str_heading);


		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/
			
		this.parentList().push(module.EventListView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ListView
	*---------------------------------------------------------------------------------------*/	

	module.EventListView.prototype = Object.create(module.ListView.prototype); // Set up inheritance

	module.EventListView.prototype.constructor = module.EventListView; //Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Renders collection of events in an account to list in the UI
	*
	* @param {Account} Account The currently selected Account
	*/

	module.EventListView.prototype.render = function(Account_a) {
		
		function renderListItem(Event_e, self) { // list item generator

			var listElmnt = self.createElement({ // li

				element: 'li',

				attributes: {id: 'event-list-id-' + Event_e.id(), role: 'listitem'},

				classList: ['collection-item']
			});


			var divElmnt = self.createElement({ // div

				element: 'div',

				innerHTML: (Event_e.name() ? Event_e.name() : 'Unnamed event') + ' (' + Event_e.guests().length + ')',

				listeners:
				{
					click: function(e) {self.onClick(e, Event_e);}
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

			attributes: {role: 'list'},

			classList: ['collection', 'with-header']
		});


		UlElement.appendChild(this.createElement({

			element: 'h4',

			classList: ['collection-header'],

			attributes: {role: 'heading'},

			innerHTML: this.heading()
		}));

				
		if (Account_a !== null) { // we have an account

			var events = Account_a.events() // generate list items
			
			for (var prop in events) {

				UlElement.appendChild(renderListItem(events[prop], this));
			}
		}

		else {

			var outerDiv =  this.createElement( // outer div
			{
				element: 'div',

				classList: ['collection-item', 'row']
			});
			
			UlElement.appendChild(outerDiv);

			
			var innerDiv =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['col', 's12'],

				innerHTML: 'No events have been added to this account yet.'
			});

			outerDiv.appendChild(innerDiv);
		}
		
		// Update DOM

		this.$renderContext().empty();

		this.$renderContext().append(UlElement);
		
		this.$renderContext().append(app.UIWidgetFactory.instance().createProduct('FloatingActionButtonWidget',
		{
			id: 'event-list-add',

			icon: 'add',

			color: 'red',

			label: 'Add event'
		}));
		

		// Attach event handlers (other than for list item click)

		$('#event-list-add, #event-list-add-event').click(function(event) {

			this.notifyObservers(this, new module.Event('New Event'), module.View.UIAction.CREATE);

		}.bind(this));
	};

})(app);