'use strict';

/* Jasmine.js test suite for PersoNview class in Meetup Event Planner app.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/
describe('Class AccountProfileView', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testAccount, testApp, testDoc, testElement, testPerson, testView, testWindow;
	
	beforeAll(function(done){
		
		testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../dist/index.html'); // test on production version of app

		setTimeout(function() {

			testWindow.app.controller.views()['frontPageView'].hide(5);

			testDoc = testWindow.document;
		
			testApp = testWindow.app;

			testAccount = testApp.data.accounts[0];

			void testApp.controller.selectedAccount(testAccount);

			testView = testApp.controller.views()['accountProfileView'];

			testElement = testView.$renderContext();

			testPerson = testAccount.accountHolder() || testAccount.accountHolder(new testApp.Person());

			void testView.model(testPerson);

			done();

		}, 500); // wait for page to load
	});
	
	
	// Test generic class features

		it('inherits from FormView', function() {

			expect((new app.AccountProfileView()) instanceof app.FormView).toBe(true);
		});

		
		it('implements the IObservable interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.AccountProfileView, app.IObservable)).toBe(true);
		});


		it('implements the IObserver interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.AccountProfileView, app.IObserver)).toBe(true);
		});


		it('can be instantiated', function() {

			expect((new app.AccountProfileView()).constructor).toBe(app.AccountProfileView);
		});

	
	// Test generic View features

		it('inherits from FormView', function() {

			expect((new app.AccountProfileView()) instanceof app.FormView).toBe(true);
		});


		it('can render itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.render(testPerson);

			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});
		

		xit('responds to an update() call by rendering itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.update(new app.Event(), new app.AccountProfileView());
			
			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});


		it('is hidden by default after rendering', function() {
			
			testView.render(testPerson);

			expect(testElement.hasClass('hidden')).toBe(true);
		});


		it('can show and hide itself', function(done) {
			
			testView.render(testPerson);

			testView.show(5);

			expect(testElement.hasClass('hidden')).toBe(false);

			expect(testElement.css('display')).toBe('block');

			testView.hide(5);

			expect(testElement.hasClass('hidden')).toBe(true);

			expect(testElement.css('display')).toBe('none');

			testView.show(5);

			setTimeout(function() {
				
				done();

			}, 25);
		});
		

	// Test presence of UI widgets

		xit('displays the main navigation', function() {
			
			expect(testWindow.$('.navbar-fixed').length).toBe(1);
		});


		it('displays a main heading', function() {
			
			expect($(testElement).find('h4').length).toBe(1);
		});


		it('displays a required name field', function() {
			
			var el = testWindow.$('#account-profile-name');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).toBe('required');
		});


		it('displays a required email input field', function() {
			
			var el = testWindow.$('input[type=email]');

			expect(el.length).toBe(1);

			expect(el.attr('required')).not.toBeDefined();

			expect(el.data('customValidator')).toBe('EmailInputWidget.prototype.validate');
		});


		it('displays an optional job title field', function() {
			
			var el = testWindow.$('#account-profile-jobtitle');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional employer field', function() {
			
			var el = testWindow.$('#account-profile-employer');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional birthday field', function() {
			
			var el = testWindow.$('#account-profile-birthday');

			expect(el.length).toBe(1);

			//expect(el.attr('type')).toBe('text');

			expect(el.data('customValidator')).toBe('DateInputWidget.prototype.validate');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays a "Cancel" link', function() {
			
			var el = testWindow.$('#account-profile-cancel');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(false);
		});


		it('displays a "Done" button', function() {
			
			var el = testWindow.$('#account-profile-submit');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(true);
		});


	// Test UI behaviours

		it('will not submit the form if there are validation errors in any fields', function() {
			
			testWindow.$('#account-profile-name').val('');

			expect(app.FormWidget.instance().validate(testWindow.$('#account-profile-form'))).toBe(false);

			testWindow.$('#account-profile-form-submit').trigger('mousedown');

			expect(testApp.controller.currentView()).not.toBeDefined();
		});


		it('submits form when the "Done" button is activated if all fields valididate', function() {
			
			void testView.model().name('');

			void testView.model().email(null);

			void testView.model().jobTitle('');

			void testView.model().employer(null);

			void testView.model().birthday(null);

		
			testWindow.$('#account-profile-name').val('Luke');

			testWindow.$('#account-profile-email').val('fa@wqrq.qwwq');

			testWindow.$('#account-profile-jobtitle').val('Jedi Master');

			testWindow.$('#account-profile-employer').val('Galaxy Inc.');

			testWindow.$('#account-profile-birthday').val('05/22/2263');

			
			expect(app.FormWidget.instance().validate(testWindow.$('#account-profile-form'))).toBe(true);
			
			testWindow.$('#account-profile-submit').trigger('mousedown');

			
			expect(testView.model().name()).toBe('Luke');

			expect(testView.model().email().address()).toBe('fa@wqrq.qwwq');

			expect(testView.model().jobTitle()).toBe('Jedi Master');

			expect(testView.model().employer().name()).toBe('Galaxy Inc.');

			expect(testView.model().birthday().valueOf()).toBe(9258357600000);
		});


		xit('discards entries and navigates out of form if "Cancel" button is activated', function() {


		});

	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});