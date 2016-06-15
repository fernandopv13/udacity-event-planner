'use strict';

/* Jasmine.js test suite for PersoNview class in Meetup Event Planner app.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/

describe('Class PersonView', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testApp, testDoc, testElement, testPerson, testView, testWindow;
	
	beforeAll(function(done){
		
		//testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../build/index.html'); // test on production version of app

		testWindow = window.open(app.testutil.testTarget);

		setTimeout(function() {

			testWindow.app.controller.views().frontPageView.hide(5);

			testDoc = testWindow.document;
		
			testApp = testWindow.app;

			app.testutil.resetTestData(testApp);

			void testApp.controller.selectedAccount(testApp.Account.registry.getObjectById(0));

			testView = testApp.controller.views().personView;

			testElement = testView.$renderContext();

			void testApp.controller.selectedEvent(testApp.Event.registry.getObjectById(0));

			testPerson = testApp.Person.registry.getObjectById(0);

			void testApp.controller.registerObserver(testPerson);

			void testApp.controller.selectedGuest(testPerson);

			void testView.model(testPerson);

			done();

		}, app.testutil.pageLoadDelay); // wait for page to load
	});
	
	
	// Test generic class features

		it('inherits from FormView', function() {

			expect((new app.PersonView()) instanceof app.FormView).toBe(true);
		});

		
		it('implements the IObservable interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.PersonView, app.IObservable)).toBe(true);
		});


		it('implements the IObserver interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.PersonView, app.IObserver)).toBe(true);
		});


		it('can be instantiated', function() {

			expect((new app.PersonView()).constructor).toBe(app.PersonView);
		});

	
	// Test generic View features

		it('can render itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.render(testPerson);

			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});
		

		it('responds to an update() call by rendering itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.update(testPerson, new testApp.PersonView());
			
			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});


		it('is hidden by default after rendering', function() {
			
			testView.render(testPerson);

			expect(testElement.hasClass('hidden')).toBe(true);
		});


		/*DEPRECATED
		it('can show and hide itself', function(done) {
			
			testView.render(testPerson);

			testView.show(5);

			expect(testElement.hasClass('hidden')).toBe(false);

			expect(testElement.css('display')).toBe('block');

			testView.hide(5);

			setTimeout(function() {
				
				expect(testElement.hasClass('hidden')).toBe(true);

				expect(testElement.css('display')).toBe('none');

				testView.show(5);

				done();

			}, 1000); // Safari Win needs a longish delay, others are OK with 25ms
		});
		*/

		it('can hide itself', function(done) {
				
			testView.render(testPerson);

			testElement.removeClass('hidden');

			testElement.css('display', 'block');

			expect(testElement.hasClass('hidden')).toBe(false);

			expect(testElement.css('display')).toBe('block');

			testView.hide(
			{
				complete: function() {

					//console.log('complete');

					expect(this.hasClass('hidden')).toBe(true);

					expect(this.css('display')).toBe('none');

					done();
				
				}.bind(testElement),

				duration: 5
			});

			expect(true).toBe(true); // Jasmine may not see expect in block
		});

		
		it('can show itself', function(done) {
				
			testView.render(testPerson);

			expect(testElement.hasClass('hidden')).toBe(true);

			expect(testElement.css('display')).toBe('none');

			testView.show(
			{
				done: function() {

					//console.log('done');

					expect(this.hasClass('hidden')).toBe(false);

					expect(this.css('display')).toBe('block');

					done();
				
				}.bind(testElement),

				duration: 5
			});

			expect(true).toBe(true); // Jasmine may not see expect in block
		});
		

	// Test presence of UI widgets

		it('displays the main navigation', function() {
			
			expect(testWindow.$('#nav-main').length).toBe(1);
		});


		it('displays a main heading', function() {
			
			expect($(testElement).find('h4').length).toBe(1);
		});


		it('displays a required name field', function() {
			
			var el = testWindow.$('#guest-name');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).toBe('required');
		});


		it('displays a required email input field', function() {
			
			var el = testWindow.$('input[type=email]');

			expect(el.length).toBe(1);

			expect(el.attr('required')).toBe('required');

			expect(el.data('customValidator')).toBe('EmailInputWidget.prototype.validate');
		});


		it('displays an optional job title field', function() {
			
			var el = testWindow.$('#guest-jobtitle');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional employer field', function() {
			
			var el = testWindow.$('#guest-employer');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional birthday field', function() {
			
			var el = testWindow.$('#guest-birthday');

			expect(el.length).toBe(1);

			//expect(el.attr('type')).toBe('text');

			expect(el.data('customValidator')).toBe('DateInputWidget.prototype.validate');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays a "Cancel" link', function() {
			
			var el = testWindow.$('#guest-form-cancel');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(false);
		});


		it('displays a "Done" button', function() {
			
			var el = testWindow.$('#guest-form-submit');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(true);
		});


	// Test UI behaviours

		it('autofocuses on the name field', function(done) {
			
			testView.show( // make sure view is fully initialized
			{
				done: function(){ // wait for animation to complete

					var el = testWindow.$('#guest-name');

					expect(el.attr('autofocus')).toBe('autofocus');

					expect(testWindow.document.activeElement.id).toBe('guest-name');

					done();
				},

				duration: 5
			});

			/*DEPRECATED
			setTimeout(function() {

				var el = testWindow.$('#guest-name');

				expect(el.attr('autofocus')).toBe('autofocus');

				expect(testWindow.document.activeElement.id).toBe('guest-name');

				done();

			}, app.testutil.animationDelay); // wait for testWindow show() animation to complete
			*/
		});
		

		it('will not submit the form if there are validation errors in any fields', function() {
			
			void testApp.controller.currentView(testApp.controller.views().personView);

			testWindow.$('#guest-name').val('');

			expect(testApp.FormWidget.instance().validate(testWindow.$('#guest-form'))).toBe(false);

			testWindow.$('#guest-form-submit').trigger('mousedown');

			expect(testApp.controller.currentView()).toBe(testApp.controller.views().personView);

			//expect(testApp.controller.currentView()).not.toBeDefined();
		});


		it('submits form when the "Done" button is activated if all fields valididate', function() {
			
			void testView.model().name('');

			void testView.model().email(null);

			void testView.model().jobTitle('');

			void testView.model().employer(null);

			void testView.model().birthday(null);


			testWindow.$('#guest-name').val('Luke');

			testWindow.$('#guest-email').val('fa@wqrq.qwwq');

			testWindow.$('#guest-jobtitle').val('Jedi Master');

			testWindow.$('#guest-employer').val('Galaxy Inc.');

			if (testWindow.$('#guest-birthday').attr('type') === 'datetime-local') { // datetime-local requires ISO string 

				testWindow.$('#guest-birthday').attr('value', '2263-05-21T20:00:00.000'); // using $.val() alone does not set attribute, causing stepMismatch validity error

				testWindow.$('#guest-birthday').val('2263-05-21T20:00:00.000'); // must also set val() or change won't submit
			}

			else { // text input requires formatted date string

				testWindow.$('#guest-birthday').val('05/22/2263');
			}

			expect(testApp.FormWidget.instance().validate(testWindow.$('#guest-form'))).toBe(true);
			
			testWindow.$('#guest-form-submit').trigger('mousedown');
			

			expect(testView.model().name()).toBe('Luke');

			expect(testView.model().email().address()).toBe('fa@wqrq.qwwq');

			expect(testView.model().jobTitle()).toBe('Jedi Master');

			expect(testView.model().employer().name()).toBe('Galaxy Inc.');

			//expect(testView.model().birthday().getFullYear()).toBe(2263); // browsers diverge on valueOf() conversion, so just check year
		});


		xit('discards entries and navigates out of form if "Cancel" button is activated', function() {


		});


	afterAll(function() {

		testWindow.close();

		testApp = testDoc = testElement = testPerson = testView = testWindow = null;
	});
});