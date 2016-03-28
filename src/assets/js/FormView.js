'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class FormView extends View
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter
	
	/** @classdesc Abstract base class for form views. Provides default method implementations specific
	*
	* to form views, as well as an easy way to identify form views as such at runtime.
	*
	* @abstract
	*
	* @extends View
	*
	* @constructor
	*
	* @return {FormView} Not supposed to be instantiated, except when extended by subclasses.
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.FormView = function(Function_modelClass, str_elementId, str_heading) {

		//FormView

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor (unless already defined in calling class)

		this.className =  this.className ? this.className : 'FormView';

		this.ssuper = this.ssuper ? this.ssuper : module.View;


		// Initializes instance members inherited from parent class
		
		module.View.call(this, Function_modelClass, str_elementId, str_heading);
		
			
		/*----------------------------------------------------------------------------------------
		* Other object initialization
		*---------------------------------------------------------------------------------------*/
			
		this.parentList().push(module.FormView);
	};

		
	/*----------------------------------------------------------------------------------------
	* Inherit from View
	*---------------------------------------------------------------------------------------*/	

	module.FormView.prototype = Object.create(module.View.prototype); // Set up inheritance

	module.FormView.prototype.constructor = module.FormView; // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Handles delete event in UI */

	module.FormView.prototype.delete = function(nEvent) {

		this.notifyObservers(this, this.model(), module.View.UIAction.DELETE);
	};


	/** Cleans up shared UI when hiding FormView (e.g. hides delete icon in nav bar) */

	module.FormView.prototype.hide = function(obj_speed) {

		// Call parent to perform common hide task(s)

			module.View.prototype.hide.call(this, obj_speed); // ssuper() refers to FormView, so call parent manually or enter infinite loop

		$('#nav-delete-icon').hide(1); // make sure delete icon is hidden by default; re-show in views that need it
	}



	/** Initializes event handlers and other functionality after the View has been unhidden */

	module.FormView.prototype.init = function() {

		// Call parent to perform common post-render task(s)

			module.View.prototype.init.call(this); // ssuper() refers to FormView, so call parent manually or enter infinite loop


		// Make sure Materialize fields and labels are formatted correctly

			//Materialize.updateTextFields();

		
		// Setup delete button and modal
			
			$('#nav-delete-icon, #confirm-delete-modal-cancel, #confirm-delete-modal-ok').off(); // reset event handlers

			$('#nav-delete-icon').mousedown(function(nEvent) { // set up delete icon to open modal

				$('#confirm-delete-modal').openModal();
			});

			$('#confirm-delete-modal-cancel').mousedown(function(nEvent) { // model cancel behaviour

				$('#confirm-delete-modal').closeModal();

			}.bind(this));


			$('#confirm-delete-modal-ok').mousedown(function(nEvent) { // model OK behaviour

				$('#confirm-delete-modal').closeModal();

				this.delete();

			}.bind(this));

			$('#nav-delete-icon').parent().removeClass('hidden'); // show delete icon

			$('#nav-delete-icon').show('slow');
	};


	/** Submits entries made by the user into the form to the controller, with the purpose of updating of the Model */

	module.FormView.prototype.submit = function(Model_m, int_UIaction) {

		this.notifyObservers(this, Model_m, typeof int_UIaction === 'number' ? int_UIaction : module.View.UIAction.SUBMIT);

		return true;
	}


	/** Updates form when notified by controller of change to model.
	*
	* FormViews ignore and override changes to their underlying model while they are in focus.
	*
	* Realization required by abstract View class. See this for further documentation.
	*
	* @return {void}
	*/

	module.FormView.prototype.update = function(Model_m, View_v) {

		//console.log([this.className(), arguments]);

		if (!module.controller.currentView() || this.constructor !== module.controller.currentView().constructor) { // view is not in focus

			module.View.prototype.update.call(this, Model_m, View_v); // ssuper() does not work recursively, so call directly
		}
	}

})(app);