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
	
	this.updateEventList = function() {

		var $list = $('#event-list');

		var ULElmnt = document.createElement('ul');
		ULElmnt.classList.add('collection');

		_eventViews.forEach(function(evt) {

			ULElmnt.appendChild(evt.render());
		});

		$list.empty();

		$list.append(ULElmnt);
	}

	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation any way in order to expose list to default IObservable methods
	
	
	
	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	// (Prefer prototypical inheritance whenever method does not require direct access to private member)
		

	app.Controller.prototype.init = function() {

		var objList = app.Event.registry.getObjectList();

		for (var prop in objList) {

			_eventViews.push(new app.EventView(objList[prop]));
		};
	
		this.updateEventList();
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