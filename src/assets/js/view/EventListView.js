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
	* @param {String} elementId Id of the HTML DOM element the view is bound to
	*
	* @param {String} heading Content for the list heading
	*
	* @constructor
	*
	* @author Ulrik H. Gade, May 2016
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

	module.View.children.push(module.EventListView); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Renders collection of events in an account to list in the UI
	*
	* @param {Account} Account The currently selected Account
	*/

	module.EventListView.prototype.render = function(Account_a) {
		
		var container; // shorthand reference to inherited temporary container element

		
 		// Add list element

			container = this.containerElement(this.createWidget(

				'HTMLElement', // div
				
				{
					element: 'ul',

					attributes: {role: 'list'},

					classList: ['collection', 'with-header']
				}
			));


		// Add heading

			container.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'h4',

					classList: ['collection-header'],

					attributes: {role: 'heading'},

					innerHTML: this.heading()
				}
			));
			
		
		// List item builder
			
			function renderListItem(Event_e, self) {

				var listElmnt = self.createWidget( // li

					'HTMLElement',

					{
						element: 'li',

						attributes: {id: 'event-list-id-' + Event_e.id(), role: 'listitem'},

						classList: ['collection-item']
					}
				);

				var divElmnt = self.createWidget(

					'HTMLElement', // div

					{
						element: 'div',

						innerHTML: (Event_e.name() ? Event_e.name() : 'Unnamed event') + ' (' + Event_e.guests().length + ')',

						listeners:
						{
							click: function(e) {self.onSelect(e, Event_e);} // jQuery.trigger() doesn't work with mousedown, so using click for purposes of testing
						}
				});

							
				var anchorElmnt = self.createWidget( // anchor

					'HTMLElement',

					{
						element: 'a',

						attributes: {href: '#!'},

						classList: ['secondary-content']
					}
				);

				
				anchorElmnt.appendChild(self.createWidget( // icon

					'HTMLElement',

					{
						element: 'i',

						classList: ['material-icons'],

						innerHTML: 'chevron_right'
					}
				));
				
							
				listElmnt.appendChild(divElmnt);
				
				divElmnt.appendChild(anchorElmnt);
				
				
				return listElmnt;
			}

		
 		if (Account_a !== null && Object.keys(Account_a.events()).length > 0) { // we have a non-empty account, so build event list

			var events = Account_a.events()
				
			for (var prop in events) {

				container.appendChild(renderListItem(events[prop], this));
			}
		}

		else { // default: display 'no items' message and provide button to add item

			container.appendChild(this.ssuper().prototype.createEmptyListMessage.call(

				this,

				'This account has no events yet',

				'Add event',

				function(nEvent) {

					this.notifyObservers(this, new module.Event('Add Event'), module.View.UIAction.CREATE);

				}.bind(this)
			));
		}

			
		// Render to DOM

			this.ssuper().prototype.render.call(this, Account_a);

			
		// Do post-render initialization

			this.init();
	};

})(app);