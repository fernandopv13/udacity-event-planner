'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class FrontPageView extends View
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for displaying app's front page.
	*
	* @constructor
	*
	* @extends View
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.FrontPageView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'FrontPageView';

		this.ssuper = module.View;

		
		// Initialize instance members inherited from parent class
		
		module.View.call(this, null, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.FrontPageView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from View
	*---------------------------------------------------------------------------------------*/	

	module.FrontPageView.prototype = Object.create(module.View.prototype); // Set up inheritance

	module.FrontPageView.prototype.constructor = module.FrontPageView; //Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Renders front page.
	*
	* Front page is pure navigation. It is not bound to any model, nor to the controller.
	*
	* @return void
	*/

	module.FrontPageView.prototype.render = function() {

		var widgetFactory = app.UIWidgetFactory.instance(), // shortcut reference to widgetFactory

		container; // shorthand reference to inherited temporary container element

		this.elementOptions = {}; // temporary object holding JSON data used for initializing elements post-render
		
		
		// Set up container and add heading
			
			container = this.containerElement(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			}));

			
			container.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'h4',

				innerHTML: this.heading()
			}));

		
		// Add logo and teaser

			var innerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			container.appendChild(innerDiv);

			
			innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'img',

				attributes: {src: 'assets/img/logo.png', alt: 'Logo'}
			}));

			innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'p',

				innerHTML: 'The awesomest place for all your event planning'
			}));

		
		// Add sign-up button

			innerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			container.appendChild(innerDiv);

			
			innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // button
			{
				element: 'a',
				
				attributes: {id: 'front-page-sign-up', role: 'button'},
				
				classList: ['waves-effect', 'waves-light', 'btn', 'right-align'],

				innerHTML: 'Sign Up'
			}));

			this.elementOptions['front-page-sign-up'] =
			{
				listeners:
				{
					mousedown:

						function(nEvent) { // go to sign-up view
							
							this.notifyObservers(new module.SignUpView(), null, module.View.UIAction.NAVIGATE);
						
						}.bind(this)
				}
			};


		// Add sign-in link

			innerDiv = widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			container.appendChild(innerDiv);


			innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement',
			{
				element: 'p',

				innerHTML: 'or'
				
			}));

			
			innerDiv.appendChild(widgetFactory.createProduct.call(widgetFactory, 'HTMLElement', // link
			{
				element: 'a',
				
				attributes: {id: 'front-page-sign-in', role: 'button'},
				
				innerHTML: 'Sign In'
			}));

			this.elementOptions['front-page-sign-in'] =
			{
				listeners:
				{
					mousedown:

						function(nEvent) { // go to sign-in view
							
							this.notifyObservers(new module.SignInView(), null, module.View.UIAction.NAVIGATE);
						
						}.bind(this)
				}
			};

		
		// Render to DOM and initialize

			this.ssuper().prototype.render.call(this);

			//this.$renderContext().empty();

			//this.$renderContext().append(container);
		
		
		// Do post-render initialization

			//this.init(); // generic

			/*
			$('#front-page-sign-up').click(function(event) { // go to sign-up view

				this.notifyObservers(new module.SignUpView(), null, module.View.UIAction.NAVIGATE);

				//Materialize.toast('Sign up is not implemented in this demo. Sorry.', 4000)

			}.bind(this));


			$('#front-page-sign-in').click(function(event) { // go to sign-up view

				this.notifyObservers(new module.SignInView(), null, module.View.UIAction.NAVIGATE);

			}.bind(this));
			*/
	};

	module.FrontPageView.prototype.update = function() {

		this.render();
	}

})(app);