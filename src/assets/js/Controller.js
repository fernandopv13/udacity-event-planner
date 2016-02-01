'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class Controller Implements IObserver IObservable IViewable
******************************************************************************/

var app = app || {};

/** @classdesc The 'octopus' connecting the datamodel and the UI of the app
*
* @constructor
*
* @author Ulrik H. Gade, January 2016
*/

app.Controller = function() {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _eventViews = [],

	_account,

	_event; // the currently selected event


	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	// none so far

	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	/** Render event list to the UI */
	
	/*
	this.renderEventList = function() {

		var $list = $('#event-list');


		var ULElmnt = document.createElement('ul'); // generate list
		
		ULElmnt.classList.add('collection');

		ULElmnt.classList.add('with-header');


		var headerElmnt = document.createElement('h4');

		headerElmnt.classList.add('collection-header');

		headerElmnt.innerHTML = 'My Events';

		ULElmnt.appendChild(headerElmnt);

		

		_eventViews.forEach(function(evt) { // generate list items

			ULElmnt.appendChild(evt.render());
		});

		
		$list.empty(); // update to DOM

		$list.append(ULElmnt);
	};
	*/

	/** Render guest list to the UI */
	
	this.renderGuestList = function() {

		var $list = $('#guest-list');

		$list.empty();

		$list.append(_eventViews[0].render('guest-list')); //debug
	}

	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	
	app.Controller.prototype.init = function() {

		_account = app.data.accounts[0];

		// Create and bind an EventView to every Event in the account
		
		var view, events = _account.events();

		for (var prop in events) {

			view = new app.EventView(events[prop]); // create EventView
			
			events[prop].registerObserver(view); // bind to Event
			
			_eventViews.push(view); // add to list of EventViews

			// later, register controller as observer of EventView
		}
	
		app.EventView.renderList(_eventViews); // refresh display of Event list


		//this.renderGuestList();
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

void app.InterfaceHelper.mixInto(app.IObservable, app.Controller);

void app.InterfaceHelper.mixInto(app.IObserver, app.Controller);

void app.InterfaceHelper.mixInto(app.IViewable, app.Controller);