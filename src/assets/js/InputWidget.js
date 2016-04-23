'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class InputWidget extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Abstract base class for the abstract factory method pattern used to create and manage UIwidgets.
	*
	* Represents widgets in a form that take data input from users.
	*
	* @abstract
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {InputWidget} Not supposed to be instantiated, except when setting up inheritance in subclasses (concrete products)
	*/

	module.InputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor (unless already defined in calling class)

			this.type = this.type || 'InputWidget';

			this.ssuper = module.InputWidget; // All derived classes has InputWidget as super, so set here

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
	module.InputWidget.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

	module.InputWidget.prototype.constructor = module.InputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Adds autocomplete to input widget.
	*
	* Uses HTML5 datalist when available, custom list design when not.
	*
	* Custom list gneration inspired by example at https://jsfiddle.net/ypcrumble/ht379nq5/.
	*
	* @param {HTMLInputELement} element The input element to be augmented with an autocomplete feature.
	*
	* @param {Array} options A flat array of strings to be used as autocomplete list options
	*
	* @return {void}
	*
	* @todo Invert logic to show all suggestions by default, then narrow down in response to user entries (tried blur on input, but prematurely closes list when making selection)
	*/

	module.InputWidget.prototype.addAutocomplete = function(HTMLInputElement, arr_options) {

		var $input = $(HTMLInputElement),

		id = $input.attr('id') + '-suggest',

		listElement, option, spanElement;


		if (Modernizr.input.list && !module.device().isiOS()) { // datalist available, so use it

			void $input.parent().find('datalist').remove(); // remove existing lists, if any

			listElement = document.createElement('datalist');

			listElement.id = id

			arr_options.forEach(function(value) {

				option = document.createElement('option');

				option.value = value;

				option.innerHTML = value;

				listElement.appendChild(option);
			});

			$input.attr('list', id);
		}

		else { // create custom list

			void $input.parent().find('ul').remove(); // remove existing lists, if any

			listElement = document.createElement('ul');

			listElement.id = id;

			listElement.classList.add('autocomplete-content');

			arr_options.forEach(function(value) {

				option = document.createElement('li');

				option.classList.add('autocomplete-option');

				option.classList.add('hide');

				spanElement = document.createElement('span');

				spanElement.innerHTML = value;

				option.appendChild(spanElement);

				listElement.appendChild(option);

				$(option).click(function() {

					$input.val($(this).text().trim());
				
					$('.autocomplete-option').addClass('hide');
				});
			});

			$input.on('keyup', function() { // show suggestions

				var $val = $input.val().trim();
				
				if ($val !== '') {
					
					$(listElement).children('li').addClass('hide');
					
					$(listElement).children('li').filter(function() { // match options to user's entry
						
						//$(listElement).removeClass('hide');

						return $(this).text().toLowerCase().indexOf($val.toLowerCase()) === 0;

					}).removeClass('hide');

				} else {

					$(listElement).children('li').addClass('hide');
				}
			});
		}

		$input.parent().append(listElement);
	};


	/** Initializes InputWidget upon rendering it into the HTML DOM.
	*
	* Currently does nothing but pass call up the inheritance chain to UIWidget.
	*
	* (ssuper only works on level up from the 'lowest' derived class, so must pass manually.)
	*
	*/

	module.InputWidget.prototype.init = function(View_v, str_id, obj_options) {
		
		var element = $('#' + str_id);

		//console.log('entering InputWidget init(), passing call to UIWidget'); // debug

		module.UIWidget.prototype.init(View_v, str_id, obj_options);

		//console.log('back fro UIWidget, exiting InputWidget init()');
	};
	

	/** Performs custom validation of input field beyond what can be acheived using the
	*
	* HTML5 constraint validation API. Validation is specific to the type of input, so each
	*
	* subclass of InputWidget must have its own implementation.
	*
	* @abstract
	*
	* @param {HTMLInputELement} The input to be validated.
	*
	* @return {Boolean} true if validation is succesful, otherwise false.
	*/

	module.InputWidget.prototype.validate = function(HTMLInputElement) {

		throw new AbstractMethodError('validate() must be realized by subclasses');
	};

})(app);