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
	
	var _event = Event_evt; // (Event) The event in the data model this view is observing
	

	
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
		
		var divElmnt = document.createElement('div');
		divElmnt.innerHTML = _event.name();
		
		var linkElmnt = document.createElement('a');
		linkElmnt.classList.add('secondary-content');
		linkElmnt.onclick = (function(e) {this.onclick(_event.id());}).bind(this);
		
		var iconElmnt = document.createElement('i');
		iconElmnt.classList.add('material-icons');
		iconElmnt.innerHTML = 'send';

		listElmnt.appendChild(divElmnt);
		divElmnt.appendChild(linkElmnt);
		linkElmnt.appendChild(iconElmnt);
		
		return listElmnt;
		//return '<li class="collection-item"><div>' + _event.name() + '<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>'
	};
		
	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// none so far
	
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	// (Prefer prototypical inheritance whenever method does not require direct access to private member)
		

	/** Respond to click on event in events list */
	
	this.constructor.prototype.onclick = function() {
		
		console.log(this);
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