'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class EventView Implements IViewable IObserver
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for individual events. Renders event in UI, and captures UI events on event.
*
* @constructor
*
* @author Ulrik H. Gade, January 2016
*/

app.EventView = function(Event_evt) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _event = Event_evt,
	
	_implements = [app.IViewable, app.IObserver]; // list of interfaces implemented by this class (by function reference); // (Event) The event in the data model this view is observing
	

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	// none so far

	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	/** Render event to list item */
	
	this.render = function() {
		
		var listElmnt = document.createElement('li');
		
		listElmnt.classList.add('collection-item');
		
		listElmnt.id = 'event-list-id-' + _event.id();
		
		
		var divElmnt = document.createElement('div');
		
		divElmnt.innerHTML = (_event.name() ? _event.name() : 'Unnamed event') + ' (' + _event.guests().length + ')';
		
		divElmnt.onclick = (function(e) {this.onclick(_event.id());}).bind(this);
		
		
		var anchorElmnt = document.createElement('a');
		
		anchorElmnt.classList.add('secondary-content');

		anchorElmnt.href = '#!';
		
		
		var iconElmnt = document.createElement('i');
		
		iconElmnt.classList.add('material-icons');
		
		iconElmnt.innerHTML = 'chevron_right';

		
		listElmnt.appendChild(divElmnt);
		
		//divElmnt.appendChild(spanElmnt);
		
		divElmnt.appendChild(anchorElmnt);
		
		anchorElmnt.appendChild(iconElmnt);
		
		
		return listElmnt;
		
		//return '<li class="collection-item"><div>' + _event.name() + '<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>'
	};
		
	
	/** Render guests to list items */
	
	this.renderGuests = function() {
		
		var ULElmnt = document.createElement('ul');

		ULElmnt.classList.add('collection');

		ULElmnt.classList.add('with-header');


		var headerElmnt = document.createElement('h4');

		headerElmnt.classList.add('collection-header');

		headerElmnt.innerHTML = 'Guest List';

		ULElmnt.appendChild(headerElmnt);

		
		var listElmnt, avatarElmnt, spanElmnt, pElmnt, anchorElmnt, iconElmnt;

		_event.guests().forEach(function(guest) {

			listElmnt = document.createElement('li');
			
			listElmnt.classList.add('collection-item');

			listElmnt.classList.add('avatar');
			
			listElmnt.id = 'guest-list-id-' + guest.id();
			
			
			if (guest.imgUrl()) { // use existing image

				avatarElmnt = document.createElement('img');

				avatarElmnt.classList.add('circle');

				avatarElmnt.src = guest.imgUrl();

				avatarElmnt.alt = guest.name();
			}

			else { // use generic avatar

				avatarElmnt = document.createElement('i');

				avatarElmnt.classList.add('material-icons');

				avatarElmnt.classList.add('circle');

				avatarElmnt.innerHTML = 'account_circle'
			}



			spanElmnt = document.createElement('span');
			
			spanElmnt.innerHTML = guest.name() ? guest.name() : '';
			
			
			pElmnt = document.createElement('p');

			pElmnt.innerHTML = guest.email().address() ? guest.email().address() : '';


			anchorElmnt = document.createElement('a');
			
			anchorElmnt.classList.add('secondary-content');

			anchorElmnt.href = '#!';
			
			
			iconElmnt = document.createElement('i');
			
			iconElmnt.classList.add('material-icons');
			
			iconElmnt.innerHTML = 'chevron_right';

			
			listElmnt.appendChild(avatarElmnt);

			listElmnt.appendChild(spanElmnt);

			listElmnt.appendChild(pElmnt);

			listElmnt.appendChild(anchorElmnt);
			
			anchorElmnt.appendChild(iconElmnt);

			ULElmnt.appendChild(listElmnt);
		});

		return ULElmnt;
	};


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
	

	/** Respond to click on event in events list */
	
	this.constructor.prototype.onclick = function(evt_id) {
		
		console.log(evt_id);
	};
	
	
	/** Update event presentation when model has changed */
	
	this.constructor.prototype.update = function() {
		
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
		

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObserver, app.EventView);

void app.InterfaceHelper.mixInto(app.IViewable, app.EventView);