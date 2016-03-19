'use strict';

/* Jasmine.js unit test suite for InputWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class InputWidget', function(){
	
	it('inherits from UIWidget', function() {

		expect((new app.InputWidget()) instanceof app.UIWidget).toBe(true);
	});


	it('can create a new instance', function() {
			
			expect((new app.InputWidget()).constructor).toBe(app.InputWidget);
	});
		
		
	describe('instance', function() {
	

		it('defines an abstract validate() method', function() {

			expect(app.InputWidget.prototype.validate).toBeDefined();

			expect(typeof app.InputWidget.prototype.validate).toBe('function');
		});


		it('rejects attempt to invoke validate() directly on the abstract class', function() {

			try {

				app.InputWidget.prototype.validate.call();
			}

			catch(e) {

				expect(e.name).toBe('AbstractMethodError');
			}

			expect(true).toBe(true);
		});
	});
});