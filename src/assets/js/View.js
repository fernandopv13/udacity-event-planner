'use strict';

var app = app || {}; // create a simple namespace for the module

(function (module) { // wrap initialization in anonymous function taking module.module context as parameter

	/*********************************************************************************************
	* public abstract class View implements IInterfaceable IObservable IObserver
	*********************************************************************************************/

	/** @classdesc Abstract base class for the 'V' part of our MVC framework.
	*
	* Presents information from the data model in the UI. Handles all work directly related to the UI.
	*
	* Provides a number of default HTML (form) element factory, and validation, methods.
	*
	* NOTE: Views must only notify observers as a direct result of user actions in the UI.
	*
	* Otherwise the MVC objects will likely enter an infinite update loop.
	*
	* (Interfaces are implemented as mixins, using static method in IInterface.)
	*
	* @abstract
	*
	* @implements IInterface
	*
	* @implements IObservable
	*
	* @implements IObserver
	*
	* @constructor
	*
	* @param {Function} modelClass The class (by function refeence) of the type of Model the View is designed to work with, or null
	*
	* @param {String} elementId Id of the HTML element this View will render itself into.
	*
	* @param {String} heading The content (text) of the View's heading
	*
	* @return {View} Not supposed to be instantiated, except when extended by subclasses. But subclasses need to be able to call constructor when setting up inheritance.
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @todo Break up into many more smaller chunks. Find a nice design pattern that supports this.
	*/


	module.View = function(Function_modelClass, str_elementId, str_heading) {
		
		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/

			var _className = (this.className ? this.className : 'View'), // name of this view class (override if provided by subclass constructor)

			_heading = str_heading, // content of the view's main heading

			_model = null, // the model currently displayed by the view, or null

			_modelClass = Function_modelClass, // the class of data model supported by this view (by function reference)
			
			_observers = [], // Array of IObservers receiving updates from this view, required in order to implement IObservable

			_parentList = [module.IInterfaceable, module.IObservable, module.IObserver, module.View], // list of interfaces implemented by this class (by function reference)

			_$renderContext = $('#' + str_elementId), // the HTML element the view will render itself into when updated (set in realizing classes)
			
			_super = (this.ssuper ? this.ssuper : Object); // reference to immediate parent class (by function) if provided by subclass, otherwise Object
			
			
		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields (dependency injection enables access for subclasses)
		*---------------------------------------------------------------------------------------*/

			/** Gets name of the View's class (read-only).
			*
			* @return {String} className The name of the View's class
			*
			* @throws {IllegalArgumentError} If trying to set the className.
			*/

			this.className = new module.Accessor(_className, true); // replace temporary literal with read-only accessor

			
			/** Gets or sets the View's heading
			*
			* @param {String} heading The content (text) of the heading
			*
			* @return {String} heading The content (text) of the heading
			*
			* @throws {IllegalArgumentError} If trying to set a heading that is not a string
			*/
			
			this.heading = new module.Accessor(_heading, false, 'string');

			
			/** Gets or sets the Model currently associated with (being displayed in) the View
			*
			* @param {Model} model The Model
			*
			* @return {Model} model The Model
			*
			* @throws {IllegalArgumentError} If trying to set a model that is not an instance of Model
			*/

			this.model = new module.Accessor(_model, false, module.Model, 'Model');

			
			/** Gets the class (by function reference) of the type of Model the View is designed to work with, or null
			*
			* @return {String} modelClass The type (class) of Model required
			*
			* @throws {IllegalArgumentError} If trying to set the modelClass
			*/

			this.modelClass = new module.Accessor(_modelClass, true);

			
			/** Gets the collection of IObservers currently registered with the View
			*
			* @return {Array} observers An array of IObservers
			*
			* @throws {IllegalArgumentError} If trying to set the observers array
			*/

			this.observers = new module.Accessor(_observers, true);

			
			/** Gets a collection of classes or 'interfaces' (by function reference) the object extends or implements. Includes the class of the object itself.
			*
			* @return {Array} parentList An array of functions
			*
			* @throws {IllegalArgumentError} If trying to set the parentList array
			*/

			this.parentList = new module.Accessor(_parentList, true);

			
			/** Gets or sets the render context (i.e. the HTML element the View will render itself into)
			*
			* @param {String} elementId Id of the HTML element this View will render itself into.
			*
			* @return {String} elementId The id of the render context
			*
			* @throws {IllegalArgumentError} If trying to set a render context that is not a string
			*/
			
			this.$renderContext = new module.Accessor(_$renderContext, false);
			
			
			/** Gets a reference to the object's parent (by function reference) in the class inheritance hierarchy (the topmost class is Object)
			*
			* @return {Function} ssuper The parent class
			*
			* @throws {IllegalArgumentError} If trying to set the ssuper attribute
			*
			* @todo Not fully functional; only works one level up from the lowest level in the tree
			*/

			this.ssuper = new module.Accessor(_super, true); // 'super' may be a reserved word, so slight name change

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/
		
			_$renderContext.addClass('view'); // set shared view class on main HTML element
	}


	/*----------------------------------------------------------------------------------------
	Mix in default methods from implemented interfaces, unless overridden by class or ancestor
	*---------------------------------------------------------------------------------------*/

		void module.IInterfaceable.mixInto(module.IInterfaceable, module.View);

		void module.IInterfaceable.mixInto(module.IObservable, module.View);

		void module.IInterfaceable.mixInto(module.IObserver, module.View);


	/*----------------------------------------------------------------------------------------
	* Public class (static) fields
	*---------------------------------------------------------------------------------------*/

		module.View.UIAction = {

			SIGNIN: 0,

			CANCEL: 1,

			CREATE: 2,

			DELETE: 3,

			NAVIGATE: 4,

			SELECT: 5,

			SUBMIT: 6
		}


	/*----------------------------------------------------------------------------------------
	* Public instance methods (implemented, on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Handles cancellation by user of navigation to current view  */

		module.View.prototype.cancel = function() {

			window.history.back(); // return to previous view

			this.notifyObservers(this, this.model(), module.View.UIAction.CANCEL);

			// for now, simply discard any entries made by user to an existing view
		}

		
		/** Factory method for creating HTML element based on specs provided in JSON object.
		*
		* Relied on by other factory methods for consistent, basic element creation.
		*
		* (So, if some aspect of element creation fails, only this method will need to change.)
		*
		* @param {Object} JSON object literal containing specs of element to be created. Se comments in code for an example.
		*
		* @return {HTMLElement} HTML element
		*/

		module.View.prototype.createElement = function(obj_specs) {

			// Sample JSON specification object using all currently supported features:
			//
			//{
			//	element: 'input', // the type of element required

			//	attributes: // an arbitrary collection of name-value pairs
			//	{
			//		type: 'text',
			//
			//		id: 'demo-element',
			//
			//		required: true
			//	},
			//
			//	classList: // an arbitrary list of strings
			//	[
			//		'row',
			//
			//		'col',
			//
			//		's12'
			//	],
			//
			//	dataset: // an arbitrary collection of name-value pairs
			//	{
			//		success: 'You made it!',
			//
			//		error: 'Please try again'
			//	},
			//	
			//	innerHTML: 'Hello world',
			//
			//	listeners:
			//	{
			//		click: function() {},
			//
			//		blur: function() {}
			//	}


			var element = document.createElement(obj_specs.element), prop;
						
			if (obj_specs.attributes) {
			
				for (prop in obj_specs.attributes) {
					
					element.setAttribute(prop, obj_specs.attributes[prop]);
				}
			}
			
			if (obj_specs.classList) {
				
				obj_specs.classList.forEach(function(str_class) {
					
					element.classList.add(str_class);
				});
			}
			
			if (obj_specs.dataset) {
			
				for (prop in obj_specs.dataset) {
					
					element.dataset[prop] = obj_specs.dataset[prop];
				}
			}
			
			if (obj_specs.innerHTML) {
				
				element.innerHTML = obj_specs.innerHTML;
			}

			if (obj_specs.listeners) {
			
				for (prop in obj_specs.listeners) {
					
					element.addEventListener(prop, obj_specs.listeners[prop]);
				}
			}

			return element;
		};
		

		/** Factory method for creating the main heading in forms
		*
		* @return {HTMLDivElement} DIV element
		*/

		module.View.prototype.createHeading = function (str_width, str_heading) {

			var outerDiv =  this.createElement( // outer div
			{
				element: 'div',			
				
				classList: ['row']
			});

			var innerDiv =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['col', str_width]
			});

			innerDiv.appendChild(this.createElement({

				element: 'h4',

				attributes: {role: 'heading'},

				innerHTML: str_heading

			}));

			outerDiv.appendChild(innerDiv);
			
			return outerDiv;
		}


		/** Factory method for creating required field explanations for forms
		*
		* @return {HTMLDivElement} DIV element
		*/

		module.View.prototype.createRequiredFieldExplanation = function () {

			var outerDiv =  this.createElement( // outer div
			{
				element: 'div',			
				
				classList: ['row']
			});
			
			outerDiv.appendChild(this.createElement({
			
				element: 'p',
				
				classList: ['required-indicator'],
					
				innerHTML: '* indicates a required field'
			}));
						
			
			return outerDiv;
		}


		/** Utility for hiding view in the UI on demand.
		*
		* Uses jQuery.hide().
		*
		* @param Same as jQuery.hide()
		*
		* @return {void}
		*
		* @todo Find a way of re-styling the timepicker using CSS rather than JS, make am/pm button prettier
		*/

		module.View.prototype.hide = function(obj_options) {

			this.$renderContext().hide(obj_options ? obj_options : 'fast');

			this.$renderContext().addClass('hidden');

			this.$renderContext().attr('aria-hidden', true);
		}


		
		/** Returns true if class is or extends the class, or implements the interface, passed in (by function reference)
		*
		* (See IInterfaceable for further documentation.)
		*/

		module.View.prototype.isInstanceOf = function (func_interface) {
			
			return this.parentList().indexOf(func_interface) > -1;
		};


		module.View.prototype.onLoad = function(nEvent) {

			return; // dummy method to make sure it's always available
		};
		
		
		/** Abstract method. Executes default shared behaviour for when a View has rendered itself.
		*
		* @return {void}
		*
		* @throws {AbstractMethodError} If trying to invoke (abstract method)
		*/

		module.View.prototype.onRender = function() {

			throw new AbstractMethodError('onRender() must be implemented by subclasses');
		}
		

		module.View.prototype.onUnLoad = function(nEvent) {

			return; // dummy method to make sure it's always available
		};


		/** Utility for dynamically rendering main navigation directly to the DOM
		*
		* (so we can hide it until we need it).
		*
		* @return {HTMLDivElement} DIV element
		*
		* @todo Make navigation (more) accessible e.g. to screen readers
		*/

		module.View.prototype.renderNavigation = function(str_logotype) {

			var menuItems = 
			[
				{
					text: 'Account Settings',

					href: '#!Settings',

					icon: 'settings'
				},

				{
					text: 'Account Profile',

					href: '#!Profile',

					icon: 'account_circle'
				},

				{
					text: 'About',

					href: '#!About',

					icon: 'info'
				},

				{
					text: 'Sign Out',

					href: '#!Sign Out',

					icon: 'power_settings_new'
				}
			]

			// Main container

				// Using 

				var containerDiv = this.createElement(
				{
					element: 'div',

					classList: ['navbar-fixed']
				});

			
			// 'More' dropdown

				// Trying to follow the example here for acccesibility of the dropdown:
				// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/How_to_build_custom_form_widgets#The_role_attribute

				var ULElement = this.createElement(
				{
					element: 'ul',

					attributes: {id: 'nav-dropdown', role: 'menu'},

					classList: ['dropdown-content']
				});

				containerDiv.appendChild(ULElement);

				var listElement, anchorElement;

				menuItems.forEach(function(item) { //dropdown menu items

					anchorElement = this.createElement(
					{
						element: 'a',

						attributes: {href: item.href, title: item.text},

						innerHTML: item.text
					});

					listElement = this.createElement({element: 'li', attributes: {role: 'menuitem'}});

					listElement.appendChild(anchorElement);

					ULElement.appendChild(listElement);

				}, this);


			// Main nav

				var navContainer =  this.createElement(
				{
					element: 'nav',

					attributes: {role:'navigation'}
				}); 

				containerDiv.appendChild(navContainer);

				var divElement = this.createElement( // top nav
				{
					element: 'div',

					classList: ['nav-wrapper']
				});

				navContainer.appendChild(divElement);

				divElement.appendChild(this.createElement(
				{
					element: 'a',

					attributes: {href: '#!'},

					classList: ['brand-logo'],

					innerHTML: str_logotype
				}));

				var iconElement = this.createElement( // 'hamburger' menu (icon)
				{
					element: 'i',

					classList: ['material-icons'],

					innerHTML: 'menu'
				});

				anchorElement = this.createElement(
				{
					element: 'a',

					attributes: {href: '#'},

					classList: ['button-collapse'],

					dataset: {activates: 'nav-side'}
				});

				anchorElement.appendChild(iconElement);

				divElement.appendChild(anchorElement);


				ULElement = this.createElement( // 'more' menu (desktop)
				{
					element: 'ul',

					classList: ['right', 'hide-on-med-and-down']
				});

				listElement = this.createElement({element: 'li'});

				iconElement = this.createElement(
				{
					element: 'i',

					classList: ['material-icons', 'left'],

					innerHTML: 'more_vert'
				});

				anchorElement = this.createElement(
				{
					element: 'a',

					attributes: {href: '#!', id: 'nav-dropdown-button'},

					classList: ['dropdown-button'],

					dataset: {activates: 'nav-dropdown'}
				});

				anchorElement.appendChild(iconElement);

				listElement.appendChild(anchorElement);

				ULElement.appendChild(listElement);

				divElement.appendChild(ULElement);


				ULElement = this.createElement( // delete icon
				{
					element: 'ul',

					classList: ['right', 'hidden']
				});

				iconElement = this.createElement(
				{
					element: 'i',

					classList: ['material-icons', 'left', 'modal-trigger'],

					innerHTML: 'delete'
				});

				listElement = this.createElement(
				{
					element: 'li',

					attributes: {id: 'nav-delete-icon'}
				});

				listElement.appendChild(iconElement);

				ULElement.appendChild(listElement);

				divElement.appendChild(ULElement);

	 		
	 		// Side nav ('drawer')
				
				ULElement = this.createElement(
				{
					element: 'ul',

					attributes: {id: 'nav-side', role: 'menu'},

					classList: ['side-nav']
				});

				menuItems.forEach(function(item) {

					listElement = this.createElement({element: 'li'});

					anchorElement = this.createElement(
					{
						element: 'a',

						attributes: {href: item.href, role:'menuitem'},

						innerHTML: item.text
					});

					if (item.icon) {

						anchorElement.appendChild(this.createElement(
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


			// Render to DOM

				$('body').prepend(containerDiv);

			
			// Initialize

				/* UNCOMMENT AFTER DEBUGGING
				$('.dropdown-button').dropdown( // Materialize dropdown needs this call when created dynamically
				{
					inDuration: 300,
					
					outDuration: 225,
					
					constrain_width: false, // Does not change width of dropdown to that of the activator
					
					hover: true, // Activate on hover
					
					gutter: 0, // Spacing from edge
					
					belowOrigin: false, // Displays dropdown below the button
					
					alignment: 'left' // Displays dropdown with edge aligned to the left of button
				});

				*/


				$('#nav-delete-icon').hide();

			
			// Add event handlers

				$('.button-collapse').sideNav(); // 'hamburger' menu

				
				$('#nav-dropdown, #nav-side').click(function(event) { // navigation selection

					$('.button-collapse').sideNav('hide');

					module.controller.onNavSelection(event);					
				});

			
			return containerDiv;
		}



		/** Utility for showing view in the UI on demand.
		*
		* Uses jQuery.show().
		*
		* @param Same as jQuery.show()
		*
		* @return {void}
		*
		* @todo investigate if changing 'aria-hidden' could do more of the work of showing. (Checked jQuery source: show() does not seem to change aria-hidden attribute.)
		*/

		module.View.prototype.show = function(obj_options) {

			this.$renderContext().show(obj_options ? obj_options : 'slow');

			this.$renderContext().removeClass('hidden');

			this.$renderContext().attr('aria-hidden', false); // later, investigate if this could do more of the work of showing
		}


		/** Updates views when notified of changes to the data model.
		*
		* Views accept update notifications providing a single Model parameter.
		*
		* Required by IObservable. Default implementation to be used and/or overridden as needed by subclasses.
		*
		* @param {Model} m Model holding the information to be presented. Model class must match View's modelClass property. Otherwise View will ignore notification.
		*
		* @throws {AbstractMethodError} If attempting to invoke directly on abstract class
		*/

		module.View.prototype.update = function(Model_m, View_v) {
			
			if (arguments.length === 2) { //console.log('notification signature has expected no. of parameters');

				if (View_v && View_v.constructor && View_v.constructor === this.constructor) { //console.log('notification is directed at correct type of View');

					if (Model_m === null || Model_m && Model_m.isInstanceOf && Model_m.isInstanceOf(module.Model) && Model_m.constructor === this.modelClass()) {console.log('model is expected type, or null');

						//console.log('received valid update notification'); // debug

						this.model(Model_m);

						this.render(Model_m);
					}
				}
			}
		};
		
})(app);