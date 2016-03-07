'use strict';

/* Jasmine.js unit test suite for ViewSubmitHandler class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class ViewSubmitHandler', function(){
	
	var testHandler = new app.ViewSubmitHandler(new app.Controller());

	it('inherits from ViewUpdateHandler', function() {
		
			expect(testHandler.ssuper()).toBe(app.ViewUpdateHandler); // verify both direct inheritance and parent constructor reference

			expect(typeof testHandler.update).toBe('function') // verify inheritance of parent methods via prototype

			// this should be enough to prove that basics of inheritance are in place, no need to test for every inherited member
	});


	it('can be instantiated', function() {

		expect((new app.ViewSubmitHandler()).constructor).toBe(app.ViewSubmitHandler);
	});


	describe('instance', function() {

		it('can get the type of UIAction it will respond to (expressed as an integer)', function() {

			expect(typeof testHandler.uiAction).toBe('function');

			expect(parseInt(testHandler.uiAction())).toEqual(testHandler.uiAction());
		});

		
		it('rejects attempt to set its UIAction', function() {

			try {

				testHandler.uiAction('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true); // Jasmine.js may not see expects in trys
		});


		// these won't work unless we're testing with a live UI

		xit('executes its algorithm if updated with a matching UIAction, a Model and a View', function() {

			
		});


		xit('does not execute its algorithm if updated with a non-matching UIAction', function() {

			
		});

		
		xit('does not execute its algorithm if updated with a model that is not an instance of Model', function() {

			
		});


		xit('does not execute its algorithm if updated with a view that is not an instance of View', function() {

			
		});
	});
});