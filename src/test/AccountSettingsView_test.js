'use strict';

/* Jasmine.js test suite for AccountSettingsView class in Meetup Event Planner app.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/

describe('Class AccountSettingsView', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testAccount, testApp, testDoc, testElement, testView, testWindow;
	
	beforeAll(function(done){
		
		//testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../build/index.html'); // test on production version of app

		testWindow = window.open(app.testutil.testTarget);
		
		setTimeout(function() {

			testWindow.app.controller.views().frontPageView.hide(5);

			testDoc = testWindow.document;
			
			testApp = testWindow.app;

			app.testutil.resetTestData(testApp);

			testView = testApp.controller.views().accountSettingsView;

			testElement = testView.$renderContext();

			testAccount = testApp.Account.registry.getObjectById(0);

			void testApp.controller.registerObserver(testAccount);

			void testApp.controller.selectedAccount(testAccount);

			void testView.model(testAccount);

			done();

		}, 2000); // wait for page to load
		
	});
	
	
	// Test generic class features

		it('inherits from FormView', function() {

			expect((new app.AccountSettingsView()) instanceof app.FormView).toBe(true);
		});

		
		it('implements the IObservable interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.AccountSettingsView, app.IObservable)).toBe(true);
		});


		it('implements the IObserver interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.AccountSettingsView, app.IObserver)).toBe(true);
		});


		it('can be instantiated', function() {

			expect((new app.AccountSettingsView()).constructor).toBe(app.AccountSettingsView);
		});

	
	// Test generic View features

		it('inherits from View', function() {

			expect((new app.AccountSettingsView()) instanceof app.FormView).toBe(true);
		});


		it('can render itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.render(testAccount);

			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});
		

		it('responds to an update() call by rendering itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.update(testAccount, new testApp.AccountSettingsView());
			
			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});


		it('is hidden by default after rendering', function() {
			
			testView.render(testAccount);

			expect(testElement.hasClass('hidden')).toBe(true);
		});


		it('can show and hide itself', function(done) {
			
			testView.show(5);

			expect(testElement.hasClass('hidden')).toBe(false);

			expect(testElement.css('display')).toBe('block');

			testView.hide(5);

			setTimeout(function() {
				
				expect(testElement.hasClass('hidden')).toBe(true);

				expect(testElement.css('display')).toBe('none');

				testView.show(5);

				done();

			}, 1000); // Safari win needs longish delay here, others are OK with 25ms
		});

	
	// Test presence of UI widgets

		it('displays the main navigation', function() {
			
			expect(testWindow.$('#nav-main').length).toBe(1);
		});


		it('displays a main heading', function() {
			
			expect(testElement.children().find('h4').length).toBe(1);
		});


		it('displays a required email input field', function() {
			
			var el = testWindow.$('input[type=email]');

			expect(el.length).toBe(1);

			expect(el.attr('required')).toBe('required');

			expect(el.data('customValidator')).toBe('EmailInputWidget.prototype.validate');
		});


		it('displays a required password field', function() {
			
			var el = $(testElement).find('#account-settings-password');

			expect(el.length).toBe(1);

			expect(el.attr('required')).toBe('required');

			expect(el.data('customValidator')).toBe('PasswordInputWidget.prototype.validate');
		});


		it('displays an optional default event capacity field', function() {
			
			var el = $(testElement).find('#account-settings-capacity');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('number');

			expect(el.attr('required')).not.toBeDefined();

		});


		it('displays a local storage checkbox (switch)', function() {
			
			var el = $(testElement).find('#account-settings-localstorage');

			expect(el.attr('type')).toBe('checkbox');

			expect(el.is('input')).toBe(true);

		});


		it('displays a geolocation checkbox (switch)', function() {
			
			var el = $(testElement).find('#account-settings-geolocation');

			expect(el.attr('type')).toBe('checkbox');

			expect(el.is('input')).toBe(true);

		});


		it('displays a "Cancel" link', function() {
			
			var el = testElement.children().find('#account-settings-cancel');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(false);
		});


		it('displays a "Done" button', function() {
			
			var el = $(testElement).find('#account-settings-submit');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(true);
		});


	// Test UI behaviours

		it('will not submit the form if there are validation errors in any fields', function() {
			
			testWindow.$('#account-settings-email').val('');

			testWindow.$('#account-settings-password').val('');

			expect(app.FormWidget.instance().validate(testWindow.$('#account-settings-form'))).toBe(false);

			testWindow.$('#account-settings-submit').trigger('mousedown');

			expect(testApp.controller.currentView()).not.toBeDefined();
		});


		xit('submits form when the "Done" button is activated if all fields valididate', function() {
			
			void testView.model().email().address('');

			void testView.model().password().password(null);

			void testView.model().defaultCapacity(0);

			void testView.model().defaultLocation('');

			void testView.model().geoLocationAllowed(false);

			void testView.model().localStorageAllowed(false);
			

			testWindow.$('#account-settings-email').val('fas@fqw.wqqw');

			testWindow.$('#account-settings-password').val('fasASAS1231!');

			testWindow.$('#account-settings-password-confirmation').val('fasASAS1231!');

			testWindow.$('#account-settings-capacity').val(50);

			testWindow.$('#account-settings-location').val('Milky Way');

			testWindow.$('#account-settings-geolocation').val(true);

			testWindow.$('#account-settings-localstorage').val(true);

			
			expect(app.FormWidget.instance().validate(testWindow.$('#account-settings-form'))).toBe(true);
			
			testWindow.$('#account-settings-submit').trigger('mousedown');

			
			expect(testView.model().email().address()).toBe('fas@fqw.wqqw');

			expect(testView.model().password().password()).toBe('fasASAS1231!');

			expect(testView.model().defaultCapacity()).toBe(50);

			expect(testView.model().defaultLocation()).toBe('Milky Way');

			expect(testView.model().geoLocationAllowed()).toBe(true);

			expect(testView.model().localStorageAllowed()).toBe(true);
		});


		xit('discards entries and navigates out of form if "Cancel" button is activated', function() {


		});

	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});