'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class NavigationWidget extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates and initializes and validates HTML email input fields. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {NavigationWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.NavigationWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'NavigationWidget';

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.NavigationWidget.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

		module.NavigationWidget.prototype.constructor = module.NavigationWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.NavigationWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating main navigation bar in views that require it
		
		* @param {Object} JSON object literal containing specs of date input to be created. Se comments in code for an example.
		*
		* @return {HTMLDivElement} The requested nav bar
		*
		* @throws {ReferenceError} If no options are specified
		*/

		module.NavigationWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				id: 'nav-main',

				logotype: 'Meetup Planner',

				menuItems: // list of menu items, in order of presentation
				[ // menuitems point to a view; Router takes care of URL generation
					{
						text: 'Account Settings', // link text

						icon: 'settings', // Google Material Design icon name (optional)

						view: AccountSettingsView
					},

					{
						text: 'Account Profile',

						icon: 'account_circle',

						view: AccountProfileView
					},

					{
						text: 'About',

						icon: 'info',

						view: AboutView
					},

					{
						text: 'Sign Out',

						icon: 'power_settings_new',,

						view: SignOutView
					}
				]
			}
			*/

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			var options = obj_options, createElement = module.HTMLElement.instance().createProduct;

			// Main container

				var containerDiv = createElement(
				{
					element: 'div',

					attributes: {id: options.id || ''},

					classList: ['navbar-fixed']
				});

			
			// 'More' dropdown

				// Trying to follow the example here for acccesibility of the dropdown:
				// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/How_to_build_custom_form_widgets#The_role_attribute

				
				var ULElement = createElement(
				{
					element: 'ul',

					attributes: {id: 'nav-dropdown', role: 'menu'},

					classList: ['dropdown-content']
				});

				containerDiv.appendChild(ULElement);

				
				var listElement, anchorElement;

				
				options.menuItems.forEach(function(item) { //dropdown menu items

					anchorElement = createElement(
					{
						element: 'a',

						attributes: {title: item.text},// href: item.href},

						classList: ['nav-menu-item'],

						dataset: {view: item.view},

						innerHTML: item.text
					});

					listElement = createElement(
					{
						element: 'li',

						attributes: {role: 'menuitem'}
					});

					listElement.appendChild(anchorElement);

					ULElement.appendChild(listElement);

				}, this);


			// Main nav

				var navContainer = createElement(
				{
					element: 'nav',

					attributes: {role:'navigation'}
				}); 

				containerDiv.appendChild(navContainer);

				
				var divElement = createElement( // top nav
				{
					element: 'div',

					classList: ['nav-wrapper']
				});

				navContainer.appendChild(divElement);

				
				divElement.appendChild(createElement(
				{
					element: 'a',

					//attributes: {href: '#!'},

					classList: ['brand-logo'],

					innerHTML: options.logotype || ''
				}));


				var iconElement = createElement( // 'hamburger' menu (icon)
				{
					element: 'i',

					classList: ['material-icons'],

					innerHTML: 'menu'
				});

				
				anchorElement = createElement(
				{
					element: 'a',

					//attributes: {href: '#'},

					classList: ['button-collapse'],

					dataset: {activates: 'nav-side'}
				});

				
				anchorElement.appendChild(iconElement);

				divElement.appendChild(anchorElement);


				ULElement = createElement( // 'more' menu (desktop)
				{
					element: 'ul',

					classList: ['right', 'hide-on-med-and-down']
				});

				
				listElement = createElement({element: 'li'});

				
				iconElement = createElement(
				{
					element: 'i',

					classList: ['material-icons', 'left'],

					innerHTML: 'more_vert'
				});

				
				anchorElement = createElement(
				{
					element: 'a',

					attributes: {id: 'nav-dropdown-button'}, //href: '#!'},

					classList: ['dropdown-button'],

					dataset: {activates: 'nav-dropdown'}
				});

				
				anchorElement.appendChild(iconElement);

				listElement.appendChild(anchorElement);

				ULElement.appendChild(listElement);

				divElement.appendChild(ULElement);


				ULElement = createElement( // delete icon
				{
					element: 'ul',

					classList: ['right', 'hidden']
				});

				
				iconElement = createElement(
				{
					element: 'i',

					classList: ['material-icons', 'left', 'modal-trigger'],

					innerHTML: 'delete'
				});

				
				listElement = createElement(
				{
					element: 'li',

					attributes: {id: 'nav-delete-icon'}
				});

				
				listElement.appendChild(iconElement);

				ULElement.appendChild(listElement);

				divElement.appendChild(ULElement);

	 		
	 		// Side nav ('drawer')
				
				ULElement = createElement(
				{
					element: 'ul',

					attributes: {id: 'nav-side', role: 'menu'},

					classList: ['side-nav']
				});


				options.menuItems.forEach(function(item) {

					listElement = createElement({element: 'li'});

					anchorElement = createElement(
					{
						element: 'a',

						attributes: {role:'menuitem'}, //href: item.href},

						classList: ['nav-menu-item'],

						dataset: {view: item.view},

						innerHTML: item.text
					});

					if (item.icon) {

						anchorElement.appendChild(createElement(
						{
							element: 'i',

							classList: ['material-icons', 'left'],

							innerHTML: item.icon
						}));
					}

					listElement.appendChild(anchorElement);

					ULElement.appendChild(listElement);

				}, this);

				divElement.appendChild(ULElement);


			return containerDiv;
		};

		
		/** Initializes nav bar (required by UIWidget) */

		module.NavigationWidget.prototype.init = function(View_v, str_id, obj_options) {

			var element = $('#' + str_id);

			
			// Initialize Materialize dropdown menu

				$(element).find('.dropdown-button').dropdown( // Materialize dropdown needs this call when created dynamically
				{
					inDuration: 300,
					
					outDuration: 225,
					
					constrain_width: false, // Does not change width of dropdown to that of the activator
					
					hover: false, // Activate on hover
					
					gutter: 0, // Spacing from edge
					
					belowOrigin: false, // Displays dropdown below the button
					
					alignment: 'left' // Displays dropdown with edge aligned to the left of button
				});

			
			// Attach other event handlers

				$(element).find('#nav-delete-icon').hide(); // delete icon: only needed on FormViews, let them show it
				
				$(element).find('.button-collapse').sideNav(); // initialize Materialize 'hamburger' menu

				$(element).find('.nav-menu-item').on('mousedown', function(nEvent) { // side nav and dropdown menu items

					$(element).find('.button-collapse').sideNav('hide');

					try { // fail silently if menu item doesn't work

						View_v.notifyObservers(new module[$(nEvent.target).data('view')], null, module.View.UIAction.NAVIGATE);//.target.href.split('!')[1]); // parse the URL partial after #!
					}

					catch(e) {

						console.log(e);
					}

					//module.controller.onNavSelection(nEvent);

				});//.bind(View_v));
		};

		
	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.NavigationWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.NavigationWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.NavigationWidget._instance === 'undefined'

				|| module.NavigationWidget._instance === null

				|| module.NavigationWidget._instance.constructor !== module.NavigationWidget) {

					module.NavigationWidget._instance = new module.NavigationWidget();
				}

				return module.NavigationWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);