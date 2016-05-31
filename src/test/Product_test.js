'use strict';

/* Jasmine.js unit test suite for Product class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Abstract class Product', function(){
	
	// Set up some mocks

	var ConcreteProductOne = function() { // extends Product

		this.type = 'ConcreteProductOne';

		app.Product.call(this);
	}

	ConcreteProductOne.prototype = Object.create(app.Product.prototype); // Set up inheritance

	ConcreteProductOne.prototype.constructor = ConcreteProductOne; // Reset constructor property

	
	describe('instance', function() {
		
		var product, concreteProductOne;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			product = new app.Product();

			concreteProductOne = new ConcreteProductOne();
		});
		
		
		it('can get the name of the type (class) of the Product', function() {
			
			expect(product.type()).toBe('Product');
		});


		it('rejects attempt to set type property (i.e. read-only)', function() {

			try {

				product.type('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError')
			}

			expect(true).toBe(true);
		});


		it('exposes an inheritable product type property to concrete products (i.e. derived classes)', function() {
			
			expect(typeof concreteProductOne.type).toBe('function');

			expect(concreteProductOne.type()).toBe('ConcreteProductOne');
		});

		
		it('defines an abstract createProduct method', function() {
			
			expect(typeof app.Product.prototype.createProduct).toBe('function');
		});


		it('rejects attempt to invoke createProduct()', function() {
			
			try {

				product.createProduct('ConcreteProductOne');
			}

			catch(e) {

				expect(e.name).toBe('AbstractMethodError');
			}

			expect(true).toBe(true);
		});
	});
});