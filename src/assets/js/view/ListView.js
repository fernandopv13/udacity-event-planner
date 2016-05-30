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
	* @author Ulrik H. Gade, May 2016
	*
	*/

	module.ListView = function(Function_modelClass, str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literal for use by parent class constructor (unless already defined in calling class)

		//if (!this.className) {this.className = 'ListView';}

		this.className =  this.className ? this.className : 'ListView';

		this.ssuper = this.ssuper ? this.ssuper : module.View;

		
		// Initializes instance members inherited from parent class
		
		module.View.call(this, Function_modelClass, str_elementId, str_heading);

			
		/*----------------------------------------------------------------------------------------
		* Other object initialization (using parameter parsing/constructor 'polymorphism')
		*---------------------------------------------------------------------------------------*/
		
		this.parentList().push(module.ListView);
			
	};

		
	/*----------------------------------------------------------------------------------------
	* Inherit from View
	*---------------------------------------------------------------------------------------*/	

	module.ListView.prototype = Object.create(module.View.prototype); // Set up inheritance

	module.ListView.prototype.constructor = module.ListView; // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Creates boilerplate code for message and 'add item' button for empty list.
	*
	* @param {String} message The message to be displayed to explain that the list is empty
	*
	* @param {String} label The label to be displayed on the 'add item' button
	*
	* @param {Function} action The action to be performed when the button is clicked
	*/

	module.ListView.prototype.createEmptyListMessage = function(str_message, str_label, fn_action) {

		var listItem = this.createWidget(

			'HTMLElement',
			{
				element: 'li',			
				
				classList: ['collection-item']
			}
		);

		var wrapperDiv = this.createWidget(

			'HTMLElement',
			{
				element: 'div',
				
				classList: ['valign-wrapper']
			}
		);

		listItem.appendChild(wrapperDiv);

		wrapperDiv.appendChild(this.createWidget(

			'HTMLElement',
			{
				element: 'div',

				classList: ['col', 's6', 'valign'],

				innerHTML: str_message
			}
		));

		var spanElmt = this.createWidget(

			'HTMLElement',
			{
				element: 'div',

				classList: ['col', 's6', 'valign', 'right']
			}
		);

		wrapperDiv.appendChild(spanElmt);

		spanElmt.appendChild(this.createWidget(

			'NormalButtonWidget',
			{
				id: 'create-guest-button',

				label: str_label,

				classList: ['valign', 'right'],

				action: fn_action
			}
		));

		return listItem;
	}


	/** For now, simply passes the call up the inheritance chain.
	*/

	module.ListView.prototype.init = function() {

		// Call parent to perform common post-render task(s)

			module.View.prototype.init.call(this); // ssuper() refers to ListView, so call parent manually or enter infinite loop
	}
	

	/** Captures tap/click in list and notifies observers (i.e. Controller) */

	module.ListView.prototype.onSelect = function(nEvent, Model_m) {

		//console.log(arguments); //debug

		//console.log('ListView onSelect() notifying controller');

		this.notifyObservers(this, Model_m, module.View.UIAction.SELECT);

		//console.log('back in ListView onSelect()');
	};


	/** Does rendering tasks that are common to all ListViews (e.g. adding a "create" item action button)
	*/

	module.ListView.prototype.render = function(Model_m) {

		// Add floating 'Add' button to container

			var ItemType, itemName; // 'Sentence caps' to please jsHint when using as constructor

			switch (this.constructor) { // parse item type to create button based on list type

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

		module.View.prototype.render.call(this, Model_m); // ssuper() refers to ListView, so call parent manually or enter infinite loop
	}
	

})(app);