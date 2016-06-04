'use strict';

/* Jasmine.js unit test suite for FourSquareSearch class in neigbourhood map application
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class FourSquareSearch', function(){
	
		beforeEach(function() {
		
		// Initialize FourSquare.Search, if it hasn't already been done
		
		if (!app.FourSquareSearch.prototype.execute) {app.FourSquareSearch.init()}
	});
	
	
	it('can initialize', function() {
			
		// Verify that custom method has been added by initialization
		
		expect (app.FourSquareSearch.prototype.execute).toBeDefined();
	});
	
	
	it('can create a new instance', function() {
			
			expect((new app.FourSquareSearch()).constructor).toBe(app.FourSquareSearch);
	});
	
		
	describe('FourSquareSearch instance', function() {
		
		var testSearch, testResults, location, detailedVenue;
		
		beforeEach(function(done) {
			
			/* Set up some mocks, if necessary
			*  We want the unit test to run as independently of other 
			*  functionality as possible, but also to not overwrite actual
			*  app functionality with our mocks, if already defined.
			*/
			
			location =
			{
				coords:
				{

					latitude: 55.668228,

					longitude: 12.5525604
				}
			};
		
			//app.GoogleMapMarker = app.GoogleMapMarker || function() {return {};};
			
			//app.GoogleMapMarker.createMarker = app.GoogleMapMarker.createMarker || function() {return {};};
			
			
			// Create a fresh instance to work with
			
			testSearch = new app.FourSquareSearch();
			
			
			/* Execute Ajax calls (unless already completed succesfully)
			*  Not clear from Jasmine.js documentation how to deal with multiple,
			*  async calls in the same spec file. So using simple conditionals.
			*/
			
			if (!testResults) {
					
				testSearch.execute(function(results) {
					
					testResults = results;
					
					done();

				}, location);
			}
			
			else if (!detailedVenue) {
				
				testSearch.getPlaceDetails(testResults[0], function(result) {
					
					detailedVenue = result;
					
					done();
				});
			}
			
			else {
				
				done(); //Re-use data to save on API calls
			}
		});
		
		
		it('can retrieve a list of (compact) venues', function(done){
			
			expect(testResults.length).toBeGreaterThan(0);
			
			//expect(testResults[0].constructor).toBe(app.FourSquareVenue);
			
			done();
			
		});
		
		it('can retrieve complete details for a compact venue', function(done) {
			
			// Only detailed/complete venues have the canonicalUrl property
			
			expect(detailedVenue.canonicalUrl).toBeDefined();
			
			done();
		});
	});
});