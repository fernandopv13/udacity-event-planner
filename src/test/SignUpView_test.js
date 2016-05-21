'use strict';

/* Jasmine.js test suite for SignUpView class in Meetup Event Planner app.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/

describe('Class SignUpView', function(){
	
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

			testView = testApp.controller.views().signUpView;

			testElement = testView.$renderContext();

			done();

		}, 2000); // wait for page to load//500
		
	});
	
	
	// Test generic class features

		it('inherits from FormView', function() {

			expect((new app.SignUpView()) instanceof app.FormView).toBe(true);
		});

		
		it('implements the IObservable interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.SignUpView, app.IObservable)).toBe(true);
		});


		it('implements the IObserver interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.SignUpView, app.IObserver)).toBe(true);
		});


		it('can be instantiated', function() {

			expect((new app.SignUpView()).constructor).toBe(app.SignUpView);
		});

	
	// Test generic View features

		it('can render itself to the DOM', function() {
			
			// just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.render();

			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});
		

		it('responds to an update() call by rendering itself to the DOM', function() {
			
			// just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.update(null, new testApp.SignUpView());
			
			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});


		it('is hidden by default after rendering', function() {
			
			testView.render();

			expect(testElement.hasClass('hidden')).toBe(true);
		});


		it('can show and hide itself', function(done) {
			
			testView.show(5);

			expect(testElement.hasClass('hidden')).toBe(false);

			expect(testElement.css('display')).toBe('block');

			testView.hide(5);

			expect(testElement.hasClass('hidden')).toBe(true);

			expect(testElement.css('display')).toBe('none');

			testView.show(5);

			setTimeout(function() {
				
				done();

			}, 1000);//25
		});

	
	// Test presence of UI widgets

		it('does not display the main navigation', function() {
			
			expect(testWindow.$('#nav-main').length).toBe(0);
		});


		it('displays a logo', function() {
			
			var ret = false;

			testElement.children().find('img').each(function(ix, el){

				if ($(el).attr('src').indexOf('logo.png') > -1) {

					ret = true;
				}
			});

			expect(ret).toBe(true);
		});
		

		it('displays a main heading', function() {
			
			expect(testElement.children().find('h4').length).toBe(1);
		});


		it('displays an instruction message after the main heading', function() {
			
			expect(testElement.children().find('h4').next().is('p')).toBe(true);
		});


		it('displays a required email input field', function() {
			
			var el = testWindow.$('input[type=email]');

			expect(el.length).toBe(1);

			expect(el.attr('required')).toBe('required');

			expect(el.data('customValidator')).toBe('EmailInputWidget.prototype.validate');
		});


		it('displays a required password field', function() {
			
			var el = $(testElement).find('#sign-up-password');

			expect(el.length).toBe(1);

			expect(el.attr('required')).toBe('required');

			expect(el.data('customValidator')).toBe('PasswordInputWidget.prototype.validate');
		});


		it('displays an optional name field', function() {
			
			var el = $(testElement).find('#sign-up-name');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();

		});


		it('displays an optional birthday field', function() {
			
			var el = $(testElement).find('#sign-up-birthday');

			expect(el.length).toBe(1);

			//expect(el.attr('type')).toBe('text');

			expect(el.data('customValidator')).toBe('DateInputWidget.prototype.validate');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional job title field', function() {
			
			var el = $(testElement).find('#sign-up-jobtitle');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();

		});


		it('displays a "Sign Up" button', function() {
			
			var el = $(testElement).find('#sign-up-submit');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(true);
		});

	// Test UI behaviours

		it('will not sign in if there are validation errors in any form fields', function() {
			
			testWindow.$('#sign-up-email').val('');

			expect(app.FormWidget.instance().validate(testWindow.$('#sign-up-form'))).toBe(false);

			testWindow.$('#sign-up-submit').trigger('mousedown');

			expect(testApp.controller.currentView()).not.toBeDefined();
		});



		it('signs in when the "Sign In" button is activated if all form fields valididate', function() {
			
			
			testWindow.$('#sign-up-email').val('fas@fqw.wqqw');

			testWindow.$('#sign-up-password').val('fasASAS1231!');

			testWindow.$('#sign-up-password-confirmation').val('fasASAS1231!');

			testWindow.$('#sign-up-name').val('Nosuko-san');

			testWindow.$('#sign-up-birthday').val('05/22/1970');

			testWindow.$('#sign-up-jobtitle').val('Samurai');


			
			expect(app.FormWidget.instance().validate(testWindow.$('#sign-up-form'))).toBe(true);
			
			testWindow.$('#sign-up-submit').trigger('mousedown');

			
			expect(testApp.controller.currentView().constructor).toBe(testApp.EventListView);
			
			
			testAccount = testApp.controller.selectedAccount();

			expect(testAccount).toBeDefined();

			expect(testAccount.constructor).toBe(testApp.Account);

			expect(testAccount.email().address()).toBe('fas@fqw.wqqw');

			expect(testAccount.password().password()).toBe('fasASAS1231!');

			expect(testAccount.accountHolder().name()).toBe('Nosuko-san');

			expect(testAccount.accountHolder().jobTitle()).toBe('Samurai');

			expect(testAccount.accountHolder().birthday().valueOf()).toBe(12175200000);
		});


	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});