'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class ListView extends View
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Abstract base class for list views. Provides default method implementations specific
	*
	* to list views, as well as an easy way to identify list views as such at runtime.
	*
	* @abstract
	*
	* @extends View
	*
	* @constructor
	*
	* @return {ListView} Not supposed to be instantiated, except when extended by subclasses.
	*
	* @author Ulrik H. Gade, March 2016
	*
	*/

	app.ListView = function(Function_modelClass, str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literal for use by parent class constructor (unless already defined in calling class)

		if (!this.className) {this.className = 'ListView';}

		
		// Initializes instance members inherited from parent class
		
		app.View.call(this, Function_modelClass, str_elementId, str_heading);

			
		/*----------------------------------------------------------------------------------------
		* Other object initialization (using parameter parsing/constructor 'polymorphism')
		*---------------------------------------------------------------------------------------*/
		
		this.parentList().push(app.ListView);
			
	};

		
	/*----------------------------------------------------------------------------------------
	* Inherit from View
	*---------------------------------------------------------------------------------------*/	

	app.ListView.prototype = Object.create(app.View.prototype); // Set up inheritance

	app.ListView.prototype.constructor = app.ListView; // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** For now, simply passes the call up the inheritance chain.
	*/

	app.ListView.prototype.init = function() {

		// Call parent to perform common post-render task(s)

			app.View.prototype.init.call(this); // ssuper() refers to ListView, so call parent manually or enter infinite loop
	}
	

	/** Captures tap/click in list and notifies observers (i.e. Controller) */

	app.ListView.prototype.onSelect = function(nEvent, Model_m) {

		//console.log(nEvent); //debug

		this.notifyObservers(this, Model_m, app.View.UIAction.SELECT);
	};


	/** Does rendering tasks that are common to all ListViews (e.g. adding a "create" item action button)
	*/

	app.ListView.prototype.render = function(Model_m) {

		// Add floating 'Add' button to container

			var ItemType, itemName; // 'Sentence caps' to please jsHint when using as constructor

			switch (this.constructor) { // parse item type to create based on list type

				case module.EventListView:

					itemName = 'Event'

					ItemType = module.Event;

					break;

				case module.GuestListView:

					itemName = 'Guest'

					ItemType = module.Person;

					break;

				default:

					console.log(this.className() + ' not supported');
			}

			this.containerElement().appendChild(this.createWidget(

				'FloatingActionButtonWidget',

				{
					id: itemName.toLowerCase() + '-list-add',

					icon: 'add',

					color: 'red',

					label: 'Add ' + itemName.toLowerCase()
				}
			));

			this.elementOptions[itemName.toLowerCase() + '-list-add'] = 
			{
				listeners:
				{
					click: // jQuery.trigger() doesn't work with mousedown, so using click for purposes of testing
					
						function(nEvent) {

							this.notifyObservers(this, new ItemType('Create ' + itemName), module.View.UIAction.CREATE);

						}.bind(this)
				}
			}

		// Call parent to render to DOM

			app.View.prototype.render.call(this, Model_m); // ssuper() refers to ListView, so call parent manually or enter infinite loop
	}
	

})(app);