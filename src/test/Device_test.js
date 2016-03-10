'use strict';

/* Jasmine.js unit test suite for Device class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class Device', function(){
	
	it('can create a new instance', function() {
			
			expect((new app.Device()).constructor).toBe(app.Device);
	});
		
		
	describe('instance', function() {
		
		var testDevice;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testDevice = new app.Device(); //implicit constructor test
			
			// We can't be absolutely sure about the initial
			// orientation, so set to known value first
			
			testDevice.orientation('landscape');
			
			testDevice.orientation('portrait');		
		});
		
		
		it('can get device orientation', function() {
			
			expect(testDevice.orientation()).toBe('portrait');
		});
		
		
		it('can set device orientation', function() {
			
			expect(testDevice.orientation()).toBe('portrait');
		});
		
		
		it('throws error if trying to set illegal device orientation', function() {
			
			var error_test = function() {
				
				testDevice.orientation('inclined');
			}
			
			expect(error_test).toThrow();
		});
		
		
		it('can tell if device orientation is landscape', function() {
			
			testDevice.orientation('landscape');
			
			expect(testDevice.isLandscape()).toBe(true);
			
			testDevice.orientation('portrait');
			
			expect(testDevice.isLandscape()).toBe(false);
		});
		
		
		it('can tell if device orientation is portrait', function() {
			
			testDevice.orientation('portrait');
			
			expect(testDevice.isPortrait()).toBe(true);
			
			testDevice.orientation('landscape');
			
			expect(testDevice.isPortrait()).toBe(false);
		});
		
		it('can tell if device is mobile (i.e. phone or tablet)', function() {
			
			// very crude, but no time to write test that doesn't just repeat the algorithm of the method itself
			// so simply verifying that we get a reply of the right type

			expect(typeof testDevice.isMobile()).toBe('boolean');
		});
		
		
		xit('can tell if device is a phone', function() {
			
			
		});
	});
});