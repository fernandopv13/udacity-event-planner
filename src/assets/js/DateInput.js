'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class DateInput extends InputWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Abstract base class for the abstract factory method pattern used to create and manage UIwidgets.
	*
	* Represents widgets in a form that take data input from users.
	*
	* @constructor
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {DateInput} Not supposed to be instantiated, except when creating singleton
	*/

	module.DateInput = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'DateInput';

			
			// Initialize instance members inherited from parent class
			
			module.InputWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
	module.DateInput.prototype = Object.create(module.InputWidget.prototype); // Set up inheritance

	module.DateInput.prototype.constructor = module.DateInput // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.InputWidgetFactory.instance().registerProduct(module.DateInput);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		module.DateInput.prototype.createProduct = function(obj_options) {

			var options = obj_options;

			var createElement = module.View.prototype.createElement;

			if (options.datasource !== null && options.datasource.constructor !== Date) {

				throw new IllegalArgumentError('Data source must be instance of Date, or null');
			}

			var outerDiv = createElement( // outer div
			{
				element: 'div',
				
				classList: ['row']
			});


			var innerDiv = createElement( // inner div
			{
				element: 'div',			
				
				classList: ['input-field', 'col', options.width]
			});
			
			outerDiv.appendChild(innerDiv);


			var attributes = 
			{
				type: 'datetime-local',
				
				id: options.id,
				
				value: options.datasource ? options.datasource.toISOString().replace('Z', '') : '',

				//readonly: true,

				'aria-labelledby': options.id + '-label',

				role: 'textbox'
			}

			if (options.required) {attributes.required = true; attributes['aria-required'] = true;}

			
			var classList = ['datetimepicker-input'];

			if(options.required) {classList.push('validate');}

			var dataset = {value: options.datasource ? options.datasource.toISOString().replace('Z', '') : ''};

			dataset.customValidator = 'DateInput.prototype.validate';

			innerDiv.appendChild(createElement( // input
			{
				element: 'input',			
				
				attributes: attributes,
				
				classList: classList, //['datetimepicker-input'],//, 'validate'], //, 'datepicker', 'picker__input'] // the 'validate' class seems to cause strange behaviour, so dropping it

				dataset: dataset
			}));


			var labelElement = createElement( // label
			{	
				element: 'label',			
				
				attributes: {for: options.id, id: options.id + '-label'},
				
				classList: options.datasource ? ['form-label', 'active'] : ['form-label'],
				
				dataset: {error: options.errormessage ? options.errormessage : 'Please use format mm/dd/yyyy hh:mm'},
				
				innerHTML: options.label
			});

			
			if (options.required) {

				labelElement.appendChild(createElement( // required field indicator
				{
					element: 'span',

					classList: ['required-indicator'],

					innerHTML: '*'
				}));
			}

			innerDiv.appendChild(labelElement);

			
			/*
			innerDiv.appendChild(this.createElement( // custom error div
			{	
				element: 'div',			
				
				attributes: {id: str_dateId + '-error'},
				
				classList: ['custom-validate']
			}));
			*/
			
			
			return outerDiv;
		};

		
		/** Gets (parses) value of datetime picker using datetime-local input field
		*
		* @param {String} id Id of the input field
		*
		* @return {Date} date A valid Date object, or a moment if supported by the browser, or null
		*/

		module.DateInput.prototype.value = function(HTMLInputElement) {

			var data = $(HTMLInputElement).data(), date = null;

			if (typeof data !== 'undefined' && typeof data.DateTimePicker !== 'undefined') { // we can access the DateTimePicker js object

				if (typeof moment !== 'undefined') { // moment is available

					if (data.DateTimePicker.date() && data.DateTimePicker.date().isValid()) { // we have a valid moment instance

						date = data.DateTimePicker.date() // get that moment
					}
				}
			}

			else { // parse the input's value manually

				date = $(HTMLInputElement).val();

				if (typeof moment !== 'undefined') { // use moment if available (probably won't work on mobile)

					date = moment(

						date,

						[ // try a number of expected formats, in order of likelyhood for en-us locale

							'YYYY-MM-DDTHH:mm', // ISO 8601

							'MM/DD/YYYY HH:mm A', // 12h, numbers only, US/North American date/month order

							'DD. MMM YYYY hh:mm A', // 12h/24h, month name, date/month order as used natively by iOS and x-OS Chrome

							'ddd MMM DD YYYY HH:mm:ss Z' // UTC format (e.g. 'Fri Mar 11 2016 00:45:50 GMT+0100 (Romance Standard Time)')
						],

						true
					);

					date = date.isValid() ? date: null;
				}
			}

			if (date === null) { // try to brute force parsing if moment - and all else - fails

				date = Date.parse($(Element_e).val());

				date = !isNaN(date) ? new Date(date): null;
			}

			return date;
		}

		/** Initializes any and all datetime pickers on the pages using datetime-local inputs */

		module.DateInput.prototype.init = function() {

			if (app.device().isMobile() && !Modernizr.inputtypes['datetime-local'] && typeof moment !== 'undefined' // prefer native datetime picker on mobile, if available

				|| !app.device().isMobile()) { // use custom widget (always prefer on lap/desktop)

				
				// Set bootstrap-datetimepicker widget options

				$('input[type="datetime-local"]').datetimepicker({

					//debug: true,

					focusOnShow: true, // give textbox focus when showing picker

					ignoreReadonly: true,

					locale: moment.locale('en'),

					showClear: true
				});


				// Do some basic cleanup of the timepicker's styling

				$('input[type="datetime-local"]').focus(function(nEvent) {

					$('td').children('.btn').removeClass('btn'); // a bit crude, but should be OK for now
				});

				
				// Enable direct (keyboard) editing in input box

				$('input[type="datetime-local"]').each(function(ix, item) { // not sure if all of these need to be set on every instance

					if ($(item).data().DateTimePicker) { // DateTimePicker is defined, so we can ...

						$(item).data().DateTimePicker.enable();  // enable editing in input field

						$(item).data().DateTimePicker.options({keyBinds: null});  // remove all keyboard event handlers from picker

						// later, maybe revisit if it would be useful to retain a subset of key events on the picker itself
					}
				});

				
				// Suppress native datetimepicker (by changing input type to 'text')

				$('input[type="datetime-local"]').attr('type','text');


				// Make sure any existing value(s) is/are presented, and nicely formatted
			
				var val;

				$('.datetimepicker-input').each(function(ix, item) { // iterate through any and all datetime-pickers

					val = $(item).val() || $(item).data().value;

					if (val !== null) { // there is a date entry

						if (typeof moment !== 'undefined') { // moment is available

							if (moment(val).isValid()) { // entry is a valid date/moment

								val = moment(val);

								val.add(-val.toDate().getTimezoneOffset(), 'minutes'); // compensate for UTC and DST offset

								$(item).val(val.format('MM/DD/YYYY h:mm A')); // insert reformatted date into UI
							}
						}

						else { // no moment, so cobble 12h string together from individual date components

							val = new Date(val);

							val.setMinutes(val.getTimezoneOffset()) // compensate for UTC and DST offset

							$(item).val(

								val.getMonth()
								
								+ '/' + val.getDate()

								+ '/' + val.getFullYear()

								+ ' ' + (val.getHours() < 12 ? val.getHours() : val.getHours() - 12)

								+ ':' + val.getMinutes()

								+ ' ' + (val.getHours() < 13 ? 'AM': 'PM')
							);
						}
					}
				}.bind(this));


				// attach event handler(s)

				$('.datetimepicker-input').on('dp.change', function(nEvent) {

					Materialize.updateTextFields(nEvent.currentTarget);
				});
			}

			else { // Use native widget

				// Make sure any existing value(s) is/are presented, and nicely formatted

				// This ought to be redundant since we already set the value at creation,
				// but mobiles are very finicky about this, so keeping what works for now.

				$('.datetimepicker-input').each(function(ix, item) { // iterate through any and all datetime-pickers

					val = $(item).val() || $(item).data().value;

					if (val !== '') { // there is a date entry

						// native datetime-locals require an ISO 8601 string with no trailing 'Z'
						// we also want to trim the seconds, or else some browsers will display them, some not

						val = new Date(val);

						$(item).val(val.toISOString().split('T')[0] + 'T' + val.getHours() + ':' + val.getMinutes());

						// This currently fails in Firefox on Android: it formats the date using a comma separator, indicates
						// that as a validation error and then blocks clearing this with setCustomValidity().
						// Modernizr' formvalidation test aren't a reliable predicter of what works (produces both false
						// positives and negatives), so can't use that. Oh well,...
					}
				});
			}
			
		};

		
		/** Event handler for interactive validation of date field
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.DateInput.prototype.validate = function(HTMLInputElement) {

			var self = module.DateInput.prototype;

			if (HTMLInputElement.validity && HTMLInputElement.validity.valueMissing

			|| $(HTMLInputElement).val().length === 0) { //console.log('// required but empty')

				return typeof $(HTMLInputElement).attr('required') === 'undefined';

				//this.displayValidation(event, str_dateId, 'Please enter date', false);
			}

			else if (self.getDateTimePickerValue(HTMLInputElement) === null) { //console.log('// invalid entry');

				return false;
			}

			else { //console.log('// valid entry');

				return true;
			}

			return false;
		};


	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.DateInput._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.DateInput.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.DateInput._instance === 'undefined'

				|| module.DateInput._instance === null

				|| module.DateInput._instance.constructor !== module.DateInput) {

					module.DateInput._instance = new module.DateInput();
				}

				return module.DateInput._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);