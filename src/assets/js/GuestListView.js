'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class GuestListView Implements IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for event guest list. Renders list in UI, and captures UI events in list.
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
*/

app.GuestListView = function(str_elementId, str_heading) {

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
	

	/** Renders guest list for an event in the UI
	*
	* @param {Event} The event whose guest list we want to render
	 */

	this.render = function(Event_event) {
		
		function renderListItem(Person_guest, self) {
			
			var listElmnt = self.createElement({

				element: 'li',

				attributes: {id: 'guest-list-id-' + Person_guest.id()},

				classList: ['collection-item', 'avatar'],

				listeners:
				{
					click: function(e) {self.notifyObservers(self, Person_guest.id());}
				}
			});

						
			if (Person_guest.imgUrl()) { // use existing image

				listElmnt.appendChild(self.createElement({

					element: 'img',

					attributes:
					{
						src: Person_guest.imgUrl(),

						alt: Person_guest.name()
					},

					classList: ['circle']
				}));
			}

			else { // use generic avatar

				listElmnt.appendChild(self.createElement({

					element: 'i',

					classList: ['circle', 'material-icons'],

					innerHTML: 'account_circle'
				}));
			}


			listElmnt.appendChild(self.createElement({

				element: 'span',

				innerHTML: Person_guest.name() ? Person_guest.name() : ''
			}));

						
			listElmnt.appendChild(self.createElement({

				element: 'p',

				innerHTML: Person_guest.email() && Person_guest.email().address() ? Person_guest.email().address() : ''
			}));

			
			var anchorElmnt = self.createElement({

				element: 'a',

				attributes: {href: '#!'},

				classList: ['secondary-content']
			});


			anchorElmnt.appendChild(self.createElement({

				element: 'i',

				classList: ['material-icons'],

				innerHTML: 'chevron_right'
			}));

			listElmnt.appendChild(anchorElmnt);
			
			
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

				
		if (Event_event !== null) {

			var guests = Event_event.guests()

			for (var prop in guests) { // generate list items

				UlElement.appendChild(renderListItem(guests[prop], this));
			}
		}

		else {

			UlElement.appendChild(this.createElement({

				element: 'p',

				innerHTML: 'No event selected. Please select or create an event in order to see guests.'
			}));
		}

		
		// Update DOM
		
		$_renderContext.empty();

		$_renderContext.append(UlElement);

		$_renderContext.append(this.createFloatingActionButton('guest-list-add', 'add', 'red', 'Add guest'));


		// Attach event handlers (other than for list item click)

		$('#guest-list-add').click(function(event) {

			app.controller.onAddGuest(event);
		});
	};


	/** Update event presentation when model has changed */
	
	this.update = function(Imodelable_obj) {
		
		if (Imodelable_obj === null) { // reset to view to default presentation

			this.render(null);

			_modelId = undefined;
		}

		else if (Imodelable_obj.constructor === app.Event) { // present guest list for event

			this.render(Imodelable_obj);

			_modelId = Imodelable_obj.id();
		}

		else if (Imodelable_obj.constructor === app.Person) { // possible change to guest, so update list

			this.render(app.controller.selectedEvent());

			_modelId = app.controller.selectedEvent() ? app.controller.selectedEvent().id() : null;
		}

		// else do nothing
	};
	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/
		
	$_renderContext.addClass('iviewable'); // set shared view class on main HTML element
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/



/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IObservable, app.GuestListView);

void app.IInterfaceable.mixInto(app.IObserver, app.GuestListView);

void app.IInterfaceable.mixInto(app.IViewable, app.GuestListView);