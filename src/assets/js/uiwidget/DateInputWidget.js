'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class DateInputWidget extends InputWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Creates, initializes and validates HTML date input fields. Use as singleton to conserve memory resources.
	*
	* @constructor
	*
	* @extends InputWidget
	*
	* @author Ulrik H. Gade, June 2016
	*
	* @return {DateInputWidget} Not supposed to be instantiated, except when creating singleton
	*/

	module.DateInputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor

			this.type = this.type || 'DateInputWidget';

			
			// Initialize instance members inherited from parent class
			
			module.InputWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
		module.DateInputWidget.prototype = Object.create(module.InputWidget.prototype); // Set up inheritance

		module.DateInputWidget.prototype.constructor = module.DateInputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Other class initialization
	*---------------------------------------------------------------------------------------*/

		// Register with factory

		module.UIWidgetFactory.instance().registerProduct(module.DateInputWidget);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Factory method for creating date picker fields for forms.
		*
		* See comments in source for detailed design considerations and attributions.
		*/
		
		/* Uses a slightly customized version of Eonasdan's bootstrap-datetimepicker:
		* https://github.com/Eonasdan/bootstrap-datetimepicker
		* http://eonasdan.github.io/bootstrap-datetimepicker/
		*
		* Design goals:
		* 1. Present a pleasant, coherent visual experience to sighted users using modern technology
		* 2. Provide rich interaction for those who are physically and technically able, and want, to use it
		* 3. On lap/desktops, allow people to type in using the keyboard if they prefer that efficiency
		* 4. Support users relying on assistive technologies (e.g. screen readers)
		* 5. Provide a graceful, functional fallback for all other cases
		*
		* Assumptions (after investigation):
		* 1. The native datetime picker widgets on mobile (tested on Android and iOS), have excellent visual/interaction design, and acceptable accessibility; so only use custom widget when native support is unavailable
		* 2. Even when supported, the datetime-local widgets on (Windows) lap/desktops are a bad design fit for the module.s reliance on Materialize.css and/or have unsatisfying visual/interaction design; so always override with custom widget
		* 3. Keyboard entry is a primary input method on lap/desktops, on mobile (touch) alternatives are preferable
		* 4. It is acceptable to not provide a fully accessible version of the custom date picker widget, as long as people using assistive tech can enter directly into the input field unhindered and undisturbed by the widget
		*
		* @param {Object} JSON object literal containing specs of date input to be created. See comments in code for an example.
		*
		* @return {HTMLDivElement} The requested element
		*
		* @throws {ReferenceError} If no options are specified
		
		* @throws {IllegalArgumentError} If datasource is not an instance of Date
		*/

		module.DateInputWidget.prototype.createProduct = function(obj_options) {

			/* Sample JSON specification object using all default features:

			{
				width: 's12',

				id: 'test',

				label: 'Test date',

				required: true,

				datasource: new Date(),

				errormessage: 'Please enter date'

				validator: 'Class.prototype.validationMethod', // method used for custom validation (optional, defaults to DateInputWidget.prototype.validate)

				dateonly: true // flag indicating preference for straight date picker w/o the time component (optional, used when selecting e.g. birthdays with native iOS widgets)
			}
			*/

			var options = obj_options;

			var createElement = module.HTMLElement.instance().createProduct;

			if (typeof obj_options === 'undefined' || obj_options === {}) {

				throw new ReferenceError('Options not specified');
			}

			if (typeof obj_options.datasource !== 'undefined' && options.datasource !== null && options.datasource.constructor !== Date) {

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


			var value = options.datasource ?
			(
				options.dateonly ? 

				options.datasource.toISOString().split('T')[0] : // plain date doesn't like seconds (iOS)

				options.datasource.toISOString().replace('Z', '') // datetime-local doesn't like trailing Z

			) : '';

			
			var attributes = 
			{
				type: app.device().isiOS() && options.dateonly ? 'date' : 'datetime-local', // using native widgets on iOS, the base date picker is more usable for e.g. birthdays
				
				id: options.id,
				
				value: value, //options.datasource ? options.datasource.toISOString().replace('Z', '') : '',

				//readonly: true,

				'aria-labelledby': options.id + '-label',

				role: 'textbox'
			}
			
			if (options.required) {attributes.required = true; attributes['aria-required'] = true;}

			if (options.autofocus) {attributes.autofocus = true;}

			
			var classList = ['datetimepicker-input'];

			if(options.required) {classList.push('validate');}

			var dataset = {value: value};

			dataset.customValidator = options.validator ? options.validator : 'DateInputWidget.prototype.validate';

			dataset.widgetclass = 'DateInputWidget';

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
				
				dataset: {error: options.errormessage ? options.errormessage : 'Please enter date (mm/dd/yyyy hh:mm)'},
				
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
			
			return outerDiv;
		};

		
		/** Initializes datetime picker
		*
		* @param {View} v The View the picker belongs to
		*
		* @param {String} id Id of the date picker to initialize
		*
		* @param {Object} options JSON object with the options to use for initialization (see HTMLElement init() source for supported format)
		*
		* @return {void}
		*/

		module.DateInputWidget.prototype.init = function(View_v, str_id, obj_options) {

			//console.log('DateInputWidget initializing ' + str_id);

			var element = $('#' + str_id), val;

			if (app.device().isMobile() && !Modernizr.inputtypes['datetime-local'] && typeof moment !== 'undefined' // prefer native datetime picker on mobile, but go custom if native picker and/or moment is unavailable

				|| !app.device().isMobile()) { // always prefer custom widget on lap/desktop

				
				// Set bootstrap-datetimepicker widget options

				$(element).datetimepicker({ // not sure if these are global, or specific to individual widgets

					//debug: true,

					focusOnShow: true, // give textbox focus when showing picker

					ignoreReadonly: true,

					locale: moment.locale('en'),

					showClear: true
				});


				// Do some basic cleanup of the timepicker's styling

				$(element).focus(function(nEvent) {

					$('td').children('.btn').removeClass('btn'); // a bit crude, but should be OK for now
				});

				
				// Enable direct (keyboard) editing in input box

				if ($(element).data().DateTimePicker) { // DateTimePicker is defined, so we can ...

					$(element).data().DateTimePicker.enable();  // enable editing in input field

					$(element).data().DateTimePicker.options({keyBinds: null});  // remove all keyboard event handlers from picker

					// later, maybe revisit if it would be useful to retain a subset of key events on the picker itself
				}

				
				// Suppress native datetimepicker (by changing input type to 'text')

				$(element).attr('type','text');


				// Make sure any existing value(s) is/are presented, and nicely formatted
			
				val = $(element).val() || $(element).data().value;

				if (val !== null) { // there is a date entry

					if (typeof moment !== 'undefined') { // moment is available

						if (moment(val).isValid()) { // entry is a valid date/moment

							val = moment(val);

							val.add(-val.toDate().getTimezoneOffset(), 'minutes'); // compensate for UTC and DST offset

							$(element).val(val.format('MM/DD/YYYY h:mm A')); // insert reformatted date into UI
						}
					}

					else { // no moment, so cobble 12h string together from individual date components

						val = new Date(val);

						val.setMinutes(val.getTimezoneOffset()) // compensate for UTC and DST offset

						$(element).val(

							val.getMonth()
							
							+ '/' + val.getDate()

							+ '/' + val.getFullYear()

							+ ' ' + (val.getHours() < 12 ? val.getHours() : val.getHours() - 12)

							+ ':' + val.getMinutes()

							+ ' ' + (val.getHours() < 13 ? 'AM': 'PM')
						);
					}
				}


				// Attach generic event handler(s)

				$(element).on('dp.change', function(nEvent) {

					Materialize.updateTextFields(nEvent.currentTarget);
				});
			}

			else { // use native widget

				//console.log('going native');

				if (app.device().isAndroid() || app.device().isiOS()) { // Some Android and iOS browsers will create a stepMismatch validation API error unless step is set to milliseconds

					//console.log('resetting step atribute');

					$(element).attr('step', '0.001'); // only set to ms here, or lap/desktops will add sec and ms fields (hidden by iOS picker; causes Android to display seconds)
				}

				// Make sure any existing value(s) is/are presented, and nicely formatted

				// This ought to be redundant since we already set the value at creation,
				// but mobiles are very finicky about this, so keeping what works for now.

				//console.log('reacquiring value');

				val = $(element).val() || $(element).data().value;

				if (val !== '') { // there is a date entry

					// Native datetime-locals require an ISO 8601 string with no trailing 'Z'.
					// We also want to trim the seconds, or else some browsers will display them, some not.
					//
					// This formatting sometimes fails on Android, with the browser e.g. insisting on displaying seconds
					// despite jQuery val() returning a string without seconds. This will have to suffice as long as checkValidity
					// returns false unless the picker's step attribute is set to milliseconds.

					val = new Date(val);

					//console.log('reformatting value');

					$(element).val(val.toISOString().split('T')[0] + 'T' + val.getHours() + ':' + val.getMinutes());
				}
			}

			// Call generic initializer in parent class

			module.InputWidget.prototype.init(View_v, str_id, obj_options);
		};

	
		/** Event handler for interactive validation of date field
		*
		* @return {Boolean} true if validation is succesful, otherwise false
		*/

		module.DateInputWidget.prototype.validate = function(HTMLInputElement_e) {

			//console.log('validating date');

			if (HTMLInputElement_e.validity && HTMLInputElement_e.validity.valueMissing

			|| $(HTMLInputElement_e).val().length === 0) { //console.log('// required but empty')

				return typeof $(HTMLInputElement_e).attr('required') === 'undefined';
			}

			else if (module.DateInputWidget.instance().value(HTMLInputElement_e) === null) { //console.log('// invalid entry');

				return false;
			}

			else { //console.log('// valid entry');

				return true;
			}

			return false;
		};

		
		/** Gets (parses) value of datetime picker using datetime-local input field
		*
		* @param {String} id Id of the input field
		*
		* @return {Date} date A valid Date object, or a moment if supported by the browser, or null
		*/

		module.DateInputWidget.prototype.value = function(HTMLInputElement_e) {

			var data = $(HTMLInputElement_e).data(), date = null;

			if (typeof data !== 'undefined' && typeof data.DateTimePicker !== 'undefined') { // we can access the DateTimePicker js object

				if (typeof moment !== 'undefined') { // moment is available

					if (data.DateTimePicker.date() && data.DateTimePicker.date().isValid()) { // we have a valid moment instance

						date = data.DateTimePicker.date() // get that moment
					}
				}
			}

			else { // parse the input's value manually

				date = $(HTMLInputElement_e).val();

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

				date = Date.parse($(HTMLInputElement_e).val());

				date = !isNaN(date) ? new Date(date): null;
			}
			
			return date;
		}

	/*----------------------------------------------------------------------------------------
	* Public class (static) members
	*---------------------------------------------------------------------------------------*/
			
		/* Reference to instance of class when used as singleton.
		* 
		* Treat as if private, though not possible to enforce in JS. Use static instance() method instead.
		*/

		module.DateInputWidget._instance = null;


		/** Gets an instance of the class for use as singleton (read-only) */

		module.DateInputWidget.instance = function() {
			
			if (arguments.length === 0) {

				if (typeof module.DateInputWidget._instance === 'undefined'

				|| module.DateInputWidget._instance === null

				|| module.DateInputWidget._instance.constructor !== module.DateInputWidget) {

					module.DateInputWidget._instance = new module.DateInputWidget();
				}

				return module.DateInputWidget._instance;
			}

			else {

				throw new IllegalArgumentError('property is read-only');
			}
		};

})(app);