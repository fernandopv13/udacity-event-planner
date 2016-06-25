'use strict';

/* Jasmine.js unit test suite for ButtonWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class ButtonWidget', function(){
	
	it('inherits from UIWidget', function() {

		expect((new app.ButtonWidget()) instanceof app.UIWidget).toBe(true);
	});


	it('can create a new instance', function() {
			
			expect((new app.ButtonWidget()).constructor).toBe(app.ButtonWidget);
	});
		
		
	//describe('instance', function() {});
});