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
	* Provides a default UI widget factory method draaing on the UIWidgetFactory object ecology.
	*
	* NOTE: Views must only notify observers as a direct result of user actions in the UI.
	*
	* Otherwise the MVC objects will likely enter an infinite update loop.
	*
	* (Interfaces are implemented as mixins, using static method in IInterface.)
	*
	* @public
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
	* @author Ulrik H. Gade, May 2016
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

			_containerElement, // temporary container holding elements while generating View, gets rendered to $renderContext

			_$renderContext = $('#' + str_elementId), // the HTML element the view will render itself into when updated (set in realizing classes)

			_ready, // flag indicating whether view show() animation has completed
			
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

			this.parentList = new module.Accessor(_parentList, false);

			
			/** Gets or sets temporary container used while generating the view
			*
			* @return {HTMLElement} container The container (e.g. a DIV or UL)
			*
			* @throws {IllegalArgumentError} If trying to set container that is not a instance of HTMLElement
			*/
			
			this.containerElement = new module.Accessor(

				_containerElement,

				false,

				typeof HTMLElement === 'function' ? HTMLElement : Object, // IE11 workaround: typeof HTMLElement is 'object', not type in IE11

				 'HTMLElement'
			);


			/** Gets or sets the render context (i.e. the HTML element the View will render itself into)
			*
			* @param {String} elementId Id of the HTML element this View will render itself into.
			*
			* @return {String} elementId The id of the render context
			*
			* @throws {IllegalArgumentError} If trying to set a render context that is not a string
			*/
			
			this.$renderContext = new module.Accessor(_$renderContext, false);
			
			
			/** Gets or sets the View's ready flag (indicating whether show() animation has completed)
			*
			* @param {Boolean} ready The status of the flag
			*
			* @return {Boolean} ready The status of the flag
			*
			* @throws {IllegalArgumentError} If trying to set a ready flag that is not a Boolean
			*/
			
			this.ready = new module.Accessor(_ready, false, 'boolean');
			

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

			CANCEL: 0,

			CREATE: 1,

			DELETE: 2,

			NAVIGATE: 3,

			SELECT: 4,

			SAVE: 5,

			SIGNIN: 6,

			SIGNOUT: 7,

			SUBMIT: 8,

			SUBVIEW: 9,

			TEST: 10,

			UNSAVE: 10
		}


	/*----------------------------------------------------------------------------------------
	* Public instance methods (implemented, on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Passes cancellation by user of navigation to current view on to ViewUpdateHandler  */

		module.View.prototype.cancel = function() {

			this.notifyObservers(this, this.model(), module.View.UIAction.CANCEL);

			// for now, simply discard any entries made by user to an existing view
		}

		
		/** Generic UIWidget factory method.
		*
		* Provides shorthand notation for creation of UIWidgets.
		*
		* Also makes sure UIWidgets are registered for initialization after rendering the View.
		*
		* @param {String} type Type of UIWidget to create (by class name)
		*
		* @param {Object} options JSON object specifying the details of the widget to create. See concrete UIWidget classes for details.
		*
		* @return {UIWidget}
		*/

		module.View.prototype.createWidget = function(str_type, obj_options) {

			this.elementOptions = this.elementOptions || {}; // temporary object holding JSON data used for initializing elements post-render

			if (obj_options && typeof obj_options.id !== 'undefined') { // skip if we're creating a basic HTMLElement that has no (need for an) id

				this.elementOptions[obj_options.id] = {}; // make sure identifiable widgets always get initialized
			}

			return module.UIWidgetFactory.instance().createProduct.call(

				module.UIWidgetFactory.instance(),

				str_type,

				obj_options
			)
		};


		/** Utility for hiding view in the UI on demand. Uses jQuery.hide().
		*
		* @param Same as jQuery.hide()
		*
		* @return {void}
		*
		* @todo Find a way of re-styling the timepicker using CSS rather than JS, make am/pm button prettier
		*/

		module.View.prototype.hide = function(obj_options) {

			void this.ready(false);

			this.$renderContext().hide(obj_options ? obj_options : 'fast');

			this.$renderContext().addClass('hidden');

			this.$renderContext().attr('aria-hidden', true);
		}


		/** Initializes UIWidgets, optionally renders navigation, and does various other generic housekeeping after a View has rendered to the DOM.
		*
		* UI elements must have an entry in the temporary, private elementOptions object built during rendering in order to be initialized.
		*
		* Initialization of UIWidgets relies on an element data attribute, so only works in browsers that support that feature.
		*
		* @todo Pull navbar options out into JSON data file so they can be changed without touching the View
		*/

		module.View.prototype.init = function() {

			//console.log('Initializing ' + this.className()); // debug

			this.hide(); // when rendering in the background, prevent first render from resulting in showing the view

			
			// Generate nav bar (in most cases)

				//console.log('Generating navbar'); // debug

				var excluded = false;

				[module.FrontPageView, module.SignInView, module.SignUpView, module.ModalView].forEach(function(klass) {

					if (this.isInstanceOf(klass)) {

						excluded = true;
					}

				}.bind(this));

				if (!excluded) { // view not excluded from having nav bar

				//if (exclusions.indexOf(this.constructor) < 0) { // view not excluded from having nav bar

					if ($('#nav-main').length === 0) { // nav bar not already in DOM

						$('body').prepend(this.createWidget( // build nav bar
						
							'NavigationWidget',

							{
								id: 'nav-main',

								logotype: 'Meetup Planner',

								menuItems: // list of menu items, in order of presentation
								[
									{
										text: 'Account Settings', // link text

										href: '#!Settings', // link URL

										icon: 'settings', // Google Material Design icon name (optional)

										view: 'AccountSettingsView' // class name of view link refers to
									},

									{
										text: 'Account Profile',

										href: '#!Profile',

										icon: 'account_circle',

										view: 'AccountProfileView'
									},

									{
										text: 'About',

										href: '#!About',

										icon: 'info',

										view: 'AboutView'
									},

									{
										text: 'Sign Out',

										href: '#!Sign Out',

										icon: 'power_settings_new',

										view: 'SignOutView'
									}
								]
							}
						));

						this.elementOptions['nav-main'] = 
						{
							init: module.NavigationWidget.prototype.init
						}

						//module.NavigationWidget.instance().init(this, 'nav-main', {}); // initialize in DOM
					}

					else if ($('#nav-main').hasClass('hidden')) { // nav bar in DOM, but hidden, so show

						$('#nav-main').removeClass('hidden');

						$('#nav-main').show();

						// later, also remove aria-hidden attribute, if present
					}
				}

				else { // hide nav bar, in case its is already rendered and visible

					$('#nav-main').hide('fast');
				}
				
				$('#nav-delete-icon').hide(1); // make sure delete icon is hidden by default; re-show in views that need it
			

			// Initialize UIWidgets (including nav bar)

				//console.log('parsing elementOptions');

				if (this.elementOptions) { // do post-processing that requires elements to be rendered to the DOM first

					//console.log(this.elementOptions); // debug

					for (var id in this.elementOptions) { // run through elements (by id): UIWidgets are registered automatically by createWidget

						var widgetClass = $('#' + id).data('widgetclass');

						if (widgetClass !== undefined) { // UIWidget, so call initializer in concrete class

							if (module[widgetClass]) {

								//console.log(widgetClass); //debug

								module[widgetClass].instance().init(this, id, this.elementOptions[id]);
							}

							else {

								throw new ReferenceError(widgetClass + ' not defined in app');
							}
						}

						else {

							module.UIWidget.prototype.init(this, id, this.elementOptions[id]); // do generic init of other elements
						}
					}

					this.elementOptions = null; // free up temporary object for garbage collection after initializing
				}
			
			//console.log('exiting View init()');
		};


		/** Returns true if class is or extends the class, or implements the interface, passed in (by function reference)
		*
		* (See IInterfaceable for further documentation.)
		*/

		module.View.prototype.isInstanceOf = function (func_interface) {
			
			return this.parentList().indexOf(func_interface) > -1;
		};


		/** Renders View to the DOM and then initializes it.
		*
		* Call from individual Views after building containerElement.
		*
		* @return {void}
		*
		* @throws {ReferenceError} If containerElement is empty
		*/

		module.View.prototype.render = function(Model_m) {

			// Render to DOM

				this.$renderContext().empty();

				this.$renderContext().append(this.containerElement());

			//  Free up containerElement for garbage collection

				this.containerElement(null);

			//console.log('Rendered ' + this.className() + ' to DOM'); // debug
		}
		
		
		/** Utility for showing view in the UI on demand.
		*
		* Uses jQuery.show().
		*
		* @param Same as jQuery.show(), including optional done() Callback to run when view change has completed
		*
		* @return {void}
		*
		* @todo investigate if changing 'aria-hidden' could do more of the work of showing. (Checked jQuery source: show() does not seem to change aria-hidden attribute.)
		*/

		module.View.prototype.show = function(obj_options) {

			void this.ready(false);

			this.$renderContext().show(
			{
				duration: obj_options && obj_options.duration ? obj_options.duration : 'slow',

				done: function() {

					void this.ready(true);

					if (obj_options && obj_options.done) {obj_options.done();}
				
				}.bind(this)
			});

			this.$renderContext().removeClass('hidden');

			this.$renderContext().attr('aria-hidden', false); // later, investigate if this could do more of the work of showing

			if (!this.isInstanceOf(module.ModalView) && this.isInstanceOf(module.FormView)) { // show delete icon on forms

				$('#nav-delete-icon').parent().removeClass('hidden');

				$('#nav-delete-icon').show('slow');
			}
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

					if (Model_m === null || Model_m && Model_m.isInstanceOf && Model_m.isInstanceOf(module.Model) && Model_m.constructor === this.modelClass()) {

						//console.log('Received update to ' + View_v.className()); // debug

						this.model(Model_m);

						this.render(Model_m);
					}
				}
			}
		};
		
})(app);