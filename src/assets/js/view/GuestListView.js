'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class GuestListView extends ListView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for event guest list. Renders list in UI, and captures UI events in list.
	*
	* @extends ListView
	*
	* @param {String} elementId Id of the HTML DOM element the view is bound to
	*
	* @param {String} heading Content for the list heading
	*
	* @constructor
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.GuestListView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'GuestListView';

		this.ssuper = module.ListView;

		
		/** Initialize instance members inherited from parent class*/
		
		module.ListView.call(this, module.Event, str_elementId, str_heading);

		
		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/
			
		this.parentList().push(module.GuestListView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ListView
	*---------------------------------------------------------------------------------------*/	

	module.GuestListView.prototype = Object.create(module.ListView.prototype); // Set up inheritance

	module.GuestListView.prototype.constructor = module.GuestListView; //Reset constructor property

	module.View.children.push(module.GuestListView); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Publicinstance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Renders guest list for an event in the UI
	*
	* @param {Event} e The event whose guest list we want to render
	 */

	module.GuestListView.prototype.render = function(Event_e) {
		
		var container; // shorthand reference to inherited temporary container element

		this.elementOptions = {}; // temporary object holding JSON data used for initializing elements post-render


		// Setup container div

			container = this.containerElement(this.createWidget(

					'HTMLElement', // div

					{
						element: 'div',			
						
						classList: ['row']
					}
			));

		
		// Add secondary nav ('back' arrow above list)

			var navElement =  this.createWidget( // div

				'HTMLElement', 

				{
					element: 'div',

					attributes: {id: 'secondary-nav', role: 'navigation'},
					
					classList: ['secondary-nav']
				}
			);

			this.elementOptions['secondary-nav'] =
			{
				listeners: 
				{
					mousedown:

						function(nEvent) {
							
							 // Hack: work around iOS history weirdness causing back() to reload app
							 // Spent ages trying to analyze the cause, to no avail, so settling for what works.
							 // Too late to capture problem in Router.onPopState, so doing it here.
							
							if (module.device().isiOS() && module.controller.recentDeleted) {

								history.pushState( // pushing a redundant state object seems to do the trick
								{
									className: 'EventView',

									id: Event_e.id()
								},

									'', // title

									'#!' // URL

									+ 'Event'

									+ '?id=' + Event_e.id()
								);

								module.controller.recentDeleted = false;

								window.history.go(module.device().isChrome() ? -4: -2); // skip back to EventView (Chroms and Safari have different behaviours)
							}

							else { // normal operation in compliant browsers

								window.history.back();

								//$('#secondary-nav').off();
							}

						}.bind(this)
				}
			};

			container.appendChild(navElement);


			navElement.appendChild(this.createWidget( // icon

				'HTMLElement',

				{
					element: 'i',

					classList: ['material-icons', 'left'],

					innerHTML: 'arrow_back'
				}
			));


			navElement.appendChild(this.createWidget( // label

				'HTMLElement',

				{
					element: 'span',

					innerHTML: this.model() ? this.model().name() : ''
				}
			));
		
		
		// Add list element		

			var UlElement = this.createWidget(

				'HTMLElement',

				{
					element: 'ul',

					attributes: {role: 'list'},

					classList: ['collection', 'with-header']
				}
			);

			container.appendChild(UlElement);
		
		
		// Add heading

			UlElement.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'h4',

					attributes: {role: 'heading'},

					classList: ['collection-header'],

					innerHTML: this.heading()
				}
			));


		// List item builder

			function renderListItem(Person_g, self) { // list item generator
			
			var listElmnt = self.createWidget(

				'HTMLElement',

				{
					element: 'li',

					attributes: {id: 'guest-list-id-' + Person_g.id(), role: 'listitem'},

					classList: ['collection-item', 'avatar'],

					listeners:
					{
						click: function(e) {self.onSelect(e, Person_g);} // jQuery.trigger() doesn't work with mousedown, so using click for purposes of testing
					}
				}
			);

						
			if (Person_g.imgUrl()) { // use existing image

				listElmnt.appendChild(self.createWidget(

					'HTMLElement',

					{

						element: 'img',

						attributes:
						{
							src: Person_g.imgUrl(),

							alt: Person_g.name()
						},

						classList: ['circle']
					}
				));
			}

			else { // use generic avatar

				listElmnt.appendChild(self.createWidget(

					'HTMLElement',

					{

						element: 'i',

						classList: ['circle', 'material-icons'],

						innerHTML: 'account_circle'
					}
				));
			}


			listElmnt.appendChild(self.createWidget(

				'HTMLElement',

				{
					element: 'span',

					innerHTML: Person_g.name() ? Person_g.name() : ''
				}
			));

						
			listElmnt.appendChild(self.createWidget(

				'HTMLElement',

				{
					element: 'p',

					innerHTML: Person_g.email() && Person_g.email().address() ? Person_g.email().address() : ''
				}
			));

			
			var anchorElmnt = self.createWidget(

				'HTMLElement',

				{
					element: 'a',

					attributes: {href: '#!'},

					classList: ['secondary-content']
				}
			);


			anchorElmnt.appendChild(self.createWidget(

				'HTMLElement',

				{
					element: 'i',

					classList: ['material-icons'],

					innerHTML: 'chevron_right'
				}
			));

			listElmnt.appendChild(anchorElmnt);
			
			
			return listElmnt;
		}


		if (Event_e !== null && Event_e.guests().length > 0) { // build list

			Event_e.guests().forEach(function(guest) { // generate list items

				UlElement.appendChild(renderListItem(guest, this));

			}, this);
		}

		else { // default: display 'no items' message and provide button to add item

			UlElement.appendChild(this.ssuper().prototype.createEmptyListMessage.call(

				this,

				'This event has no guests',

				'Add guest',

				function(nEvent) {

					this.notifyObservers(this, new module.Person('Add Guest'), module.View.UIAction.CREATE);

				}.bind(this)
			));
		}
		
		
		// Do common ListView rendering tasks and render to DOM

			this.ssuper().prototype.render.call(this, Event_e);
			

		// Do post-render initialization

			this.init();
	};
	
})(app);