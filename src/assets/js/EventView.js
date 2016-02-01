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
	
	var _event = Event_evt, // (Event) The event in the data model this EventView is observing
	
	_implements = [app.IViewable, app.IObserver]; // list of interfaces implemented by this class (by function reference);

	

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	/** Gets Event associated with this EventView. Event is read-only.
	*
	* This approach allows _event to be private, but methods using it to be defined on EventView.prototype
	*
	* @return {Event} Event The Event associated with this EventView
	*	
	* @throws {IllegalArgumentError} If called with one or more parameters (so mistake is easily detectable)
	*/
	
	this.event = function () {
		
		if(arguments.length === 0) { return _event;}
		
		else {
			
			throw new IllegalArgumentError('Event is read-only');
		}
	};

	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	/** Render guests to list items
	*
	* Treat as if private to reduce complexity of public interface. Defined on EventView.prototype
	* for memory efficiency.
	*/

	app.EventView.prototype._renderGuestList = function() {
		
		var self = this;

		var ULElmnt = document.createElement('ul');

		ULElmnt.classList.add('collection');

		ULElmnt.classList.add('with-header');


		var headerElmnt = document.createElement('h4');

		headerElmnt.classList.add('collection-header');

		headerElmnt.innerHTML = 'Guest List';

		ULElmnt.appendChild(headerElmnt);

		
		var listElmnt, avatarElmnt, spanElmnt, pElmnt, anchorElmnt, iconElmnt;

		this.event().guests().forEach(function(guest) {

			listElmnt = document.createElement('li');
			
			listElmnt.classList.add('collection-item');

			listElmnt.classList.add('avatar');
			
			listElmnt.id = 'guest-list-id-' + guest.id();

			listElmnt.onclick = (function(e) {self.onguestclick('guest ' + guest.id());});
			
			
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
	

	/** Respond to tap/click on event in events list */
	
	app.EventView.prototype.onclick = function(evt_id) {
		
		console.log(evt_id);
	};
	

	/** Respond to tap/click on event in guest list */
	
	app.EventView.prototype.onguestclick = function(guest_id) {
		
		console.log(guest_id);
	};

	
	/** Render event */
	
	app.EventView.prototype.render = function(str_type) {
		
		switch (str_type) {

			case 'event-list':

				break;

			case 'event-form':

				break;

			case 'guest-list':

				return this._renderGuestList()

				break;

			default:

				//throw new IllegalArgumentError('Cannot render "' + str_type + '"');

				break;
		}


		var event = this.event();


		var listElmnt = document.createElement('li');
		
		listElmnt.classList.add('collection-item');
		
		listElmnt.id = 'event-list-id-' + this.event().id();
		
		
		var divElmnt = document.createElement('div');
		
		divElmnt.innerHTML = (event.name() ? event.name() : 'Unnamed event') + ' (' + event.guests().length + ')';
		
		divElmnt.onclick = (function(e) {this.onclick('event ' + event.id());}).bind(this);
		
		
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


	/** Update event presentation when model has changed */
	
	app.EventView.prototype.update = function() {
		
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

// none so far


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObserver, app.EventView);

void app.InterfaceHelper.mixInto(app.IViewable, app.EventView);