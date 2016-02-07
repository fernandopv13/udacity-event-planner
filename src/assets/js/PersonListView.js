'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PersonListView Implements IViewable IObserver
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for person list(s). Renders list in UI, and captures UI events in list.
*
* @implements IObservable IObserver IViewable
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*/

app.PersonListView = function() {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
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
	

	/** Notifies observers that item in list has been activated (i.e. tapped/clicked).
	*
	* Overrides default method in IObservable.
	*
	* @param {int} Id The Id of the object that was activated
	*
	* @return void
	 */

	app.PersonListView.prototype.notifyObservers = function(int_objId) {

		this.observers.forEach(function(observer) {

			observer.update(this, int_objId);

		}.bind(this));
	};


	/** Respond to tap/click on event in events list */
	
	app.PersonListView.prototype.onclick = function(int_personId) {
		
		app.controller.onGuestSelected(int_personId);
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
					click: function(e) {self.notifyObservers(Person_guest.id());}

					//click: function(e) {app.controller.onGuestSelected(Person_guest.id());}
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

			innerHTML: 'Guest List'
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

		
		var $list = $('#guest-list');  // update DOM

		$list.empty();

		$list.append(UlElement);
	};


	/** Update event presentation when model has changed */
	
	app.PersonListView.prototype.update = function(Imodelable_Event) {
		
		this.render(Imodelable_Event);
	};
	
	/*----------------------------------------------------------------------------------------
	* Parameter parsing (constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// If neeeded, we can simulate polymorphism here by testing named parameters in the
	// constructor's signature and/or by analysing the 'arguments' array-like collection of
	// parameters, and branching all or parts of the constructor logic accordingly.
	//
	//Probably most useful if kept relatively simple. Else maybe better to create new class.
	
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/



/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObservable, app.PersonListView);

void app.InterfaceHelper.mixInto(app.IObserver, app.PersonListView);

void app.InterfaceHelper.mixInto(app.IViewable, app.PersonListView);