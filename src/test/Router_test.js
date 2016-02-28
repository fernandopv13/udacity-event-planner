'use strict';

/* Jasmine.js unit test suite for Email class in meetup even planner application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class Router', function(){
	
	var testRouter;
		
		beforeEach(function() {
			
			testRouter = new app.Router();
		});
	
	
	it('can be instantiated', function() {
		
		expect((testRouter).constructor).toBe(app.Router);
	});
	
	
	describe('instance', function() {
		
		beforeEach(function() {
			
			testRouter = new app.Router();
		
		});

		it('has an onPopState() method', function(){

			expect(testRouter.onPopState).toBeDefined();

			expect(typeof testRouter.onPopState).toBe('function');
		});

		xit('can respond to an onpopstate event by navigate to the relevant view', function() {


		});


		it('has an onViewChange() method', function(){

			expect(testRouter.onViewChange).toBeDefined();

			expect(typeof testRouter.onViewChange).toBe('function');
		});


		xit('can push a new state to the browser history matching the user\'s navigation' , function() {


		});

	});
});