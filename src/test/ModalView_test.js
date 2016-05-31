'use strict';

/* Jasmine.js unit test suite for abstract ModalView.js class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Abstract class ModalView', function(){
	
	
	var testModalView, testView;

	beforeEach(function() {

		testView = new app.View();

		testModalView = new app.ModalView();
	});

	it('inherits from FormView', function() {
			
		expect(testModalView instanceof app.FormView).toBe(true); // verify both direct inheritance and parent constructor reference

		expect(testModalView.ssuper()).toBe(app.FormView);

		expect(typeof testModalView.delete).toBe('function') // verify inheritance of parent methods via prototype

		// this should be enough to prove that basics of inheritance are in place, no need to test for every inherited member
	});


	describe('instance', function() {

		describe('using public instance methods', function() {

			it('overrides its parent\'s render() method', function() {

				expect(typeof app.ModalView.prototype.render).toBe('function');

				expect(testModalView.render).not.toEqual(testView.render);
			});


			it('overrides its parent\'s show() method', function() {

				expect(typeof testModalView.show).toBe('function');

				expect(testModalView.show).not.toEqual(testView.show);
			});
		});

		
		afterEach(function() {

			testModalView = null;
		});
		
	});
});
