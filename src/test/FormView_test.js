'use strict';

/* Jasmine.js unit test suite for abstract FormView.js class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Abstract class FormView', function(){
	
	
	var testFormView, testView;

	beforeEach(function() {

		testView = new app.View();

		testFormView = new app.FormView(app.Model, 'form-view', 'Test Heading');
	});

	it('inherits from View', function() {
			
		expect(testFormView instanceof app.View).toBe(true); // verify both direct inheritance and parent constructor reference

		expect(testFormView.ssuper()).toBe(app.View);

		expect(typeof testFormView.className).toBe('function') // verify inheritance of parent methods via prototype

		// this should be enough to prove that basics of inheritance are in place, no need to test for every inherited member
	});


	describe('instance', function() {

		describe('using public instance methods', function() {

			it('defines a delete() method', function() {

				expect(typeof testFormView.delete).toBe('function');
			});

			
			xit('presents the ConfirmDeletionView popup when user calls the delete() method', function() {

				// to do
			});


			xit('makes no changes to its model if user cancels deletion', function() {

				// to do
			});


			xit('causes its model to be deleted if user confirms deletion', function() {

				// to do
			});


			it('overrides its parent\'s hide() method', function() {

				expect(typeof app.FormView.prototype.hide).toBe('function');

				expect(testFormView.hide).not.toEqual(testView.hide);
			});


			it('overrides its parent\'s init() method', function() {

				expect(typeof testFormView.init).toBe('function');

				expect(testFormView.init).not.toEqual(testView.init);
			});


			it('overrides its parent\'s update() method', function() {

				expect(typeof testFormView.init).toBe('function');

				expect(testFormView.init).not.toEqual(testView.init);
			});


			it('defines a submit() method', function() {

				expect(typeof testFormView.submit).toBe('function');
			});


			xit('causes its model to be updated with form data if user confirms submission', function() {

				// to do
			});
			

			xit('makes no changes to its model if user cancels submission', function() {

				// to do
			});
		});

		
		afterEach(function() {

			testFormView = null;
		});
		
	});
});
