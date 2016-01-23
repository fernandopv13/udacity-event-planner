'use strict';

/* Jasmine.js unit test suite for FourSquareVenue class in neigbourhood map application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class FourSquareVenue', function(){
	
	beforeEach(function() {
		
		// Initialize FourSquareVenue, if it hasn't already been done
		
		if (!app.FourSquareVenue.prototype.render) {app.FourSquareVenue.init()}
	});
	
	
	it('can initialize', function() {
			
		// Verify that custom method has been added by initialization
		
		expect (app.FourSquareVenue.prototype.render).toBeDefined();
	});
	
	
	it('can create a new instance', function() {
			
			expect((new app.FourSquareVenue()).constructor).toBe(app.FourSquareVenue);
	});
	
	
	it('can initialize an object with custom Venue members', function() {
			
		var testVenue = {};
		
		app.FourSquareVenue.initPlace(testVenue);
		
		for (var prop in app.FourSquareVenue.prototype) {
	
			if (app.FourSquareVenue.prototype.hasOwnProperty(prop) && typeof app.FourSquareVenue.prototype[prop] === 'function') {
			
				expect(testVenue[prop]).toBe(app.FourSquareVenue.prototype[prop]);
			}
		}
		
		expect(testVenue.constructor).toBe(app.FourSquareVenue);
	});
	
	
		
	describe('FourSquareVenue instance', function() {
		
		var testVenue;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testVenue = new app.FourSquareVenue();
			
			
			// Add dummy data needed for these tests
			
			testVenue.name = 'Test venue name';
			
			testVenue.likes = {summary: '38 Likes', like1: 'Test Like'};
			
			testVenue.bestPhoto = {prefix: '../assets/img/test_image', suffix: '.jpg'
			};
			
			testVenue.canonicalUrl = 'canonicalUrl';
			
			testVenue.formatted_address = 'street number zip city';
			
			testVenue.contact = {formattedPhone: '+45 xx xx xx xx', facebook: 'facebook'};
			
			testVenue.url = 'https://www.someurl.somedomain';
		});
		
		
		it('can render to DIV', function(){
			
			expect(testVenue.render().constructor).toBe(HTMLDivElement);
		});
		
		
		it('can render to DIV even if random expected attribute is missing', function(){
			
			// Delete random property from testVenue
			// (snippet courtesy of stack exchange)
			
			var keys = Object.keys(testVenue)
			
			delete testVenue[keys[ keys.length * Math.random() << 0]];
			
			
			// Run the test
			
			expect(testVenue.render().constructor).toBe(HTMLDivElement);
		});
	});
});