'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class GuestListView extends ListView
******************************************************************************/

var app = app || {};

/** @classdesc View class for event guest list. Renders list in UI, and captures UI events in list.
*
* @extends ListView
*
* @param {String} elementId Id of the HTML DOM element the view is bound to
*
* @param {String} heading Content for the list heading
*
* @constructor
*
* @author Ulrik H. Gade, March 2016
*/

app.GuestListView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor

	this.className = 'GuestListView';

	this.ssuper = app.ListView;

	
	/** Initialize instance members inherited from parent class*/
	
	app.ListView.call(this, app.Event, str_elementId, str_heading);

	
	/*----------------------------------------------------------------------------------------
	* Other initialization
	*---------------------------------------------------------------------------------------*/
		
	this.parentList().push(app.GuestListView);
};

/*----------------------------------------------------------------------------------------
* Inherit from ListView
*---------------------------------------------------------------------------------------*/	

app.GuestListView.prototype = Object.create(app.ListView.prototype); // Set up inheritance

app.GuestListView.prototype.constructor = app.GuestListView; //Reset constructor property


/*----------------------------------------------------------------------------------------
* Publicinstance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** Renders guest list for an event in the UI
*
* @param {Event} The event whose guest list we want to render
 */

app.GuestListView.prototype.render = function(Event_e) {
	
	function renderListItem(Person_g, self) {
		
		var listElmnt = self.createElement({

			element: 'li',

			attributes: {id: 'guest-list-id-' + Person_g.id()},

			classList: ['collection-item', 'avatar'],

			listeners:
			{
				click: function(e) {self.onClick(e, Person_g);}

				//click: function(e) {self.notifyObservers(self, Person_g.id());}
			}
		});

					
		if (Person_g.imgUrl()) { // use existing image

			listElmnt.appendChild(self.createElement({

				element: 'img',

				attributes:
				{
					src: Person_g.imgUrl(),

					alt: Person_g.name()
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

			innerHTML: Person_g.name() ? Person_g.name() : ''
		}));

					
		listElmnt.appendChild(self.createElement({

			element: 'p',

			innerHTML: Person_g.email() && Person_g.email().address() ? Person_g.email().address() : ''
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

		innerHTML: this.heading()
	}));

			
	if (Event_e !== null && Event_e.guests().length > 0) {

		Event_e.guests().forEach(function(guest) { // generate list items

			UlElement.appendChild(renderListItem(guest, this));

		}, this);
	}

	else {

		var outerDiv =  this.createElement( // outer div
		{
			element: 'div',

			classList: ['collection-item', 'row']
		});
		
		UlElement.appendChild(outerDiv);

		
		var innerDiv =  this.createElement( // inner div
		{
			element: 'div',			
			
			classList: ['col', 's12'],

			innerHTML: 'No guests have been added to this event yet.'
		});

		outerDiv.appendChild(innerDiv);

		
		/*
		innerDiv =  this.createElement( // inner div
		{
			element: 'div',			
			
			classList: ['col', 's4']
		});

		outerDiv.appendChild(innerDiv);

		innerDiv.appendChild(this.createElement({ // add guest button
			
			element: 'a',
			
			attributes: {id: 'guest-list-add-guest'},
			
			classList: ['waves-effect', 'waves-light', 'btn', 'right'],

			innerHTML: 'Add guest'
		}));
		*/
	}


	var navElement =  this.createElement( // 'back' arrow above list
	{
		element: 'div',

		attributes: {id: 'secondary-nav'},
		
		classList: ['secondary-nav']
	});

	navElement.appendChild(this.createElement(
	{
		element: 'i',

		classList: ['material-icons', 'left'],

		innerHTML: 'arrow_back'

	}));


	navElement.appendChild(this.createElement(
	{
		element: 'span',

		innerHTML: this.model().name()

	}));

	
	// Update DOM
	
	this.$renderContext().empty();

	this.$renderContext().append(navElement);

	this.$renderContext().append(UlElement);

	this.$renderContext().append(this.createFloatingActionButton('guest-list-add', 'add', 'red', 'Add guest'));


	// Attach event handlers (other than for list item click)

	$('#secondary-nav').click(function(event) {

		window.history.back();

		$('#secondary-nav').off();

	}.bind(this));


	$('#guest-list-add, #guest-list-add-guest').click(function(event) {

		this.notifyObservers(this, new app.Person('New Guest'), app.View.UIAction.CREATE);

	}.bind(this));
};