'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class PersonView Implements IViewable IObserver
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual persons. Renders person in UI, and captures UI events on person.
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*/

app.PersonView = function(Person_p) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _person = Person_p, // (Person) The person in the data model this PersonView is observing
	
	_implements = [app.IViewable, app.IObserver]; // list of interfaces implemented by this class (by function reference);

	
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
	

	/** Respond to tap/click on event in events list */
	
	this.onclick = function(int_personId) {
		
		app.controller.onGuestSelected(int_personId);
	};
	

	/** Render person */
	
	this.render = function() {
		
		// this is where we build the form
	};


	/** Update event presentation when model has changed */
	
	app.PersonView.prototype.update = function() {
		
		this.render();
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

/** Renders collection of PersonViews to guest list in UI
*
* Static method because no single instance has knowledge of the full collection.
*
* @param {Object} PersonViews Collection of personviews to be rendered
 */

app.PersonView.renderList = function(Event_event) {
	
	function renderListItem(Person_guest) {
		
		var listElmnt = document.createElement('li');
		
		listElmnt.classList.add('collection-item');

		listElmnt.classList.add('avatar');
		
		listElmnt.id = 'guest-list-id-' + Person_guest.id();

		listElmnt.onclick = (function(e) {app.controller.onGuestSelected(Person_guest.id());});
		
		
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
	};

	
	var ULElmnt = document.createElement('ul'); // generate list

	ULElmnt.classList.add('collection');

	ULElmnt.classList.add('with-header');


	var headerElmnt = document.createElement('h4'); // generate header

	headerElmnt.classList.add('collection-header');

	headerElmnt.innerHTML = 'Guest List';

	ULElmnt.appendChild(headerElmnt);

	
	var guests = Event_event.guests()

	for (var prop in guests) { // generate list items

		ULElmnt.appendChild(renderListItem(guests[prop]));
	}

	
	var $list = $('#guest-list');  // update DOM

	$list.empty();

	$list.append(ULElmnt);
};


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObserver, app.PersonView);

void app.InterfaceHelper.mixInto(app.IViewable, app.PersonView);