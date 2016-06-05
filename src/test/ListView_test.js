'use strict';

/* Jasmine.js unit test suite for abstract ListView.js class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Abstract class ListView', function(){
	
	var testListView, testView;

	beforeEach(function() {

		testView = new app.View();

		testListView = new app.ListView(app.Model, 'list-view', 'Test Heading');
	});


	it('inherits from View', function() {
			
		expect(testListView instanceof app.View).toBe(true); // verify both direct inheritance and parent constructor reference

		expect(testListView.ssuper()).toBe(app.View);

		expect(typeof testListView.className).toBe('function') // verify inheritance of parent methods via prototype

		// this should be enough to prove that basics of inheritance are in place, no need to test for every inherited member
	});


	describe('instance', function() {

		describe('using public instance methods', function() {

			it('overrides its parent\'s init() method', function() {

				expect(typeof testListView.init).toBe('function');

				expect(testListView.init).not.toEqual(testView.init);
			});


			it('defines an onSelect() method', function() {

				expect(typeof testListView.onSelect).toBe('function');
			});


			xit('causes the item to be displayed when user selects an item in the list', function() {

				// to do
			});

			
			it('overrides its parent\'s render() method', function() {

				expect(typeof testListView.render).toBe('function');

				expect(testListView.render).not.toEqual(testView.render);
			});
		});

		
		afterEach(function() {

			testListView = null;
		});
		
	});
});
