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
	

	/** Respond to tap/click on event in events list */
	
	app.PersonListView.prototype.onclick = function(int_personId) {
		
		app.controller.onGuestSelected(int_personId);
	};
	

	/** Renders guest list for an event in the UI
	*
	* @param {Event} The event whose guest list we want to render
	 */

	app.PersonListView.prototype.render = function(Event_event) {
		
		function renderListItem(Person_guest) {
			
			var listElmnt = document.createElement('li');
			
			listElmnt.classList.add('collection-item');

			listElmnt.classList.add('avatar');
			
			listElmnt.id = 'guest-list-id-' + Person_guest.id();

			listElmnt.onclick = function(e) {app.controller.onGuestSelected(Person_guest.id());};
			
			
			var avatarElmnt;

			if (Person_guest.imgUrl()) { // use existing image

				avatarElmnt = document.createElement('img');

				avatarElmnt.classList.add('circle');

				avatarElmnt.src = Person_guest.imgUrl();

				avatarElmnt.alt = Person_guest.name();
			}

			else { // use generic avatar

				avatarElmnt = document.createElement('i');

				avatarElmnt.classList.add('material-icons');

				avatarElmnt.classList.add('circle');

				avatarElmnt.innerHTML = 'account_circle'
			}


			var spanElmnt = document.createElement('span');
			
			spanElmnt.innerHTML = Person_guest.name() ? Person_guest.name() : '';
			
			
			var pElmnt = document.createElement('p');

			pElmnt.innerHTML = Person_guest.email() && Person_guest.email().address() ? Person_guest.email().address() : '';


			var anchorElmnt = document.createElement('a');
			
			anchorElmnt.classList.add('secondary-content');

			anchorElmnt.href = '#!';
			
			
			var iconElmnt = document.createElement('i');
			
			iconElmnt.classList.add('material-icons');
			
			iconElmnt.innerHTML = 'chevron_right';

			
			listElmnt.appendChild(avatarElmnt);

			listElmnt.appendChild(spanElmnt);

			listElmnt.appendChild(pElmnt);

			listElmnt.appendChild(anchorElmnt);
			
			anchorElmnt.appendChild(iconElmnt);


			return listElmnt;
		}

		
		var UlElement = document.createElement('ul'); // generate list

		UlElement.classList.add('collection');

		UlElement.classList.add('with-header');


		var headerElmnt = document.createElement('h4'); // generate header

		headerElmnt.classList.add('collection-header');

		headerElmnt.innerHTML = 'Guest List';

		UlElement.appendChild(headerElmnt);

		
		if (Event_event !== null) {

			var guests = Event_event.guests()

			for (var prop in guests) { // generate list items

				UlElement.appendChild(renderListItem(guests[prop]));
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