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

		//FrontPageView

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

	module.View.children.push(module.FrontPageView); // Add to list of derived classes



	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Renders front page.
	*
	* Front page is pure navigation. It is not bound to any model.
	*
	* @param {Model} m Accepts and ignores any object passed in. Signature retained for compliance with View base class.
	*
	* @return void
	*/

	module.FrontPageView.prototype.render = function(Model_m) {

		var container; // shorthand reference to inherited temporary container element

		this.elementOptions = {}; // temporary object holding JSON data used for initializing elements post-render
		
		
		// Set up container and add heading
			
			container = this.containerElement(this.createWidget(

				'HTMLElement',
				
				{
					element: 'div',			
					
					classList: ['row', 'center-align']
				}
			));

			
			container.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'h4',

					innerHTML: this.heading()
				}
			));

		
		// Add logo and teaser

			var innerDiv = this.createWidget(

				'HTMLElement', // div
				
				{
					element: 'div',			
					
					classList: ['row', 'center-align']
				}
			);

			container.appendChild(innerDiv);

			
			innerDiv.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'img',

					attributes: {src: 'assets/img/logo.png', alt: 'Logo'}
				}
			));

			innerDiv.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'p',

					innerHTML: 'The awesomest place for all your event planning'
				}
			));

		
		// Add sign-up button

			innerDiv = this.createWidget(

				'HTMLElement', // div

				{
					element: 'div',			
					
					classList: ['row', 'center-align']
				}
			);

			container.appendChild(innerDiv);

			
			innerDiv.appendChild(this.createWidget(

				'HTMLElement', // button

				{
					element: 'a',
					
					attributes: {id: 'front-page-sign-up', role: 'button'},
					
					classList: ['waves-effect', 'waves-light', 'btn', 'right-align'],

					innerHTML: 'Sign Up'
				}
			));

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

			innerDiv = this.createWidget(

				'HTMLElement', // div

				{
					element: 'div',			
					
					classList: ['row', 'center-align']
				}
			);

			container.appendChild(innerDiv);


			innerDiv.appendChild(this.createWidget(

				'HTMLElement',

				{
					element: 'p',

					innerHTML: 'or'
					
				}
			));

			
			innerDiv.appendChild(this.createWidget(

				'HTMLElement', // link

				{
					element: 'a',
					
					attributes: {id: 'front-page-sign-in', role: 'button'},
					
					innerHTML: 'Sign In'
				}
			));

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

		
		// Render to DOM

			this.ssuper().prototype.render.call(this);

		// Do post-render initialization

			this.init(); // call init up parent class chain
	};

})(app);