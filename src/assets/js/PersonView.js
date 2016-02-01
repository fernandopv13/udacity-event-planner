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
	
	/** Render guests to list items */
	
	_renderListItem = function(self) {
		
		var listElmnt = document.createElement('li');
		
		listElmnt.classList.add('collection-item');

		listElmnt.classList.add('avatar');
		
		listElmnt.id = 'guest-list-id-' + _person.id();

		listElmnt.onclick = (function(e) {self.onclick('guest ' + _person.id());}.bind(self));
		
		
		var avatarElmnt;

		if (_person.imgUrl()) { // use existing image

			avatarElmnt = document.createElement('img');

			avatarElmnt.classList.add('circle');

			avatarElmnt.src = _person.imgUrl();

			avatarElmnt.alt = _person.name();
		}

		else { // use generic avatar

			avatarElmnt = document.createElement('i');

			avatarElmnt.classList.add('material-icons');

			avatarElmnt.classList.add('circle');

			avatarElmnt.innerHTML = 'account_circle'
		}


		var spanElmnt = document.createElement('span');
		
		spanElmnt.innerHTML = _person.name() ? _person.name() : '';
		
		
		var pElmnt = document.createElement('p');

		pElmnt.innerHTML = _person.email().address() ? _person.email().address() : '';


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
	
	app.PersonView.prototype.onclick = function(person_id) {
		
		console.log(person_id);
	};
	

	/** Render person */
	
	this.render = function(str_type) {
		
		switch (str_type) {

			case 'list-item':

				return _renderListItem(this);

				break;

			case 'form':

				break;

			default:

				//throw new IllegalArgumentError('Cannot render "' + str_type + '"');

				break;
		}
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

app.PersonView.render = function(Object_personviews) {
	
	var $list = $('#guest-list');


	var ULElmnt = document.createElement('ul'); // generate list

	ULElmnt.classList.add('collection');

	ULElmnt.classList.add('with-header');


	var headerElmnt = document.createElement('h4'); // generate header

	headerElmnt.classList.add('collection-header');

	headerElmnt.innerHTML = 'Guest List';

	ULElmnt.appendChild(headerElmnt);

	
	for (var prop in Object_personviews) { // generate list items

		ULElmnt.appendChild(Object_personviews[prop].render('list-item'));
	}

	
	$list.empty(); // update DOM

	$list.append(ULElmnt);
};


/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.InterfaceHelper.mixInto(app.IObserver, app.EventView);

void app.InterfaceHelper.mixInto(app.IViewable, app.EventView);