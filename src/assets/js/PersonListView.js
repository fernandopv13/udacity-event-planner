'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PersonListView Implements IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for person list(s). Renders list in UI, and captures UI events in list.
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

app.PersonListView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _implements = [app.IObservable, app.IObserver, app.IViewable], // list of interfaces implemented by this class (by function reference);

	$_renderContext = $('#' + str_elementId),

	_heading = str_heading;

	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	
		
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets HTML element this view will render to */

	app.PersonListView.prototype.renderContext = function() {

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
	
	app.PersonListView.prototype.isInstanceOf = function (func_interface) {
		
		return _implements.indexOf(func_interface) > -1;
	};
	

	/** Renders guest list for an event in the UI
	*
	* @param {Event} The event whose guest list we want to render
	 */

	app.PersonListView.prototype.render = function(Event_event) {
		
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
	};


	/** Update event presentation when model has changed */
	
	app.PersonListView.prototype.update = function(Imodelable_Event) {
		
		if (Imodelable_Event === null || Imodelable_Event.constructor === app.Event) {

			this.render(Imodelable_Event);
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

void app.IInterfaceable.mixInto(app.IObservable, app.PersonListView);

void app.IInterfaceable.mixInto(app.IObserver, app.PersonListView);

void app.IInterfaceable.mixInto(app.IViewable, app.PersonListView);