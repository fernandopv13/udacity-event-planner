'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class Controller Implements IObserver IObservable
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
	
	var _eventViews = [];

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	// none so far

	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	/** Render event list to the UI */
	
	this.updateEventList = function() {

		var $list = $('#event-list');

		var ULElmnt = document.createElement('ul');
		
		ULElmnt.classList.add('collection');

		ULElmnt.classList.add('with-header');


		var headerElmnt = document.createElement('h4');

		headerElmnt.classList.add('collection-header');

		headerElmnt.innerHTML = 'My Events';

		ULElmnt.appendChild(headerElmnt);

		

		_eventViews.forEach(function(evt) {

			ULElmnt.appendChild(evt.render());
		});

		$list.empty();

		$list.append(ULElmnt);
	};


	/** Render guest list to the UI */
	
	this.updateGuestList = function() {

		var $list = $('#guest-list');

		$list.empty();

		$list.append(_eventViews[0].renderGuests());
	}

	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation any way in order to expose list to default IObservable methods
	
	this.currentEvent;
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	
	app.Controller.prototype.init = function() {

		// Bind EventView to every Event in data model
		
		var ev, objList = app.Event.registry.getObjectList();

		for (var prop in objList) {

			ev = new app.EventView(objList[prop]); // create eventview
			
			objList[prop].registerObserver(ev); // bind to event
			
			_eventViews.push(ev); // add to list of eventviews
		};
	
		this.updateEventList(); // refresh display of event list


		this.updateGuestList();
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