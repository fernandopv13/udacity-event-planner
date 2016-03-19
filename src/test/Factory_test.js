'use strict';

/* Jasmine.js unit test suite for Factory class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class Factory', function(){
	
	it('can create a new instance', function() {
			
			expect((new app.Factory()).constructor).toBe(app.Factory);
	});
		
		
	// Set up some mocks

	var Product = app.Product || function() { // abstract base class

		this.type = function() {return 'Product';};
	};

	
	var ConcreteProductOne = function() { // extends Product

		Product.call(this);

		this.type = function() {return 'ConcreteProductOne';};
	}

	ConcreteProductOne.prototype = Object.create(Product.prototype); // Set up inheritance

	ConcreteProductOne.prototype.constructor = ConcreteProductOne; // Reset constructor property

	ConcreteProductOne.prototype.type = function() {return 'ConcreteProductOne';};

	
	var ConcreteFactory = function() { //extends Factory

		this.productName = 'ConcreteProductOne';

		this.productType = ConcreteProductOne;

		app.Factory.call(this);
	};

	ConcreteFactory.prototype = Object.create(app.Factory.prototype); // Set up inheritance

	ConcreteFactory.prototype.constructor = ConcreteFactory; // Reset constructor property

	
	describe('instance', function() {
		
		var abstractFactory, concreteFactory, concreteProductOne;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			abstractFactory = new app.Factory(); // implicit constructor test

			concreteFactory = new ConcreteFactory();

			concreteProductOne = new ConcreteProductOne();
		});
		
		
		/*
		it('can get a singleton instance of the class itself', function() {
			
			expect(abstractFactory.instance().constructor).toBe(app.Factory);

			expect(abstractFactory.instance()).toBe(abstractFactory.instance());
		});


		it('rejects attempt to set instance property (i.e. read-only)', function() {

			try {

				abstractFactory.instance('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError')
			}

			expect(true).toBe(true);
		});


		it('exposes an inheritable instance property to concrete factories (i.e. derived classes)', function() {
			
			expect(typeof concreteFactory.instance).toBe('function');
		});


		it('gets a singleton of the concrete factory when invoking instance() on a derived class', function() {
			
			expect(concreteFactory.instance().constructor).toBe(ConcreteFactory);

			expect(concreteFactory.instance()).toBe(concreteFactory.instance());
		});
		*/

		
		it('can get the name of the type of Product required by the factory', function() {
			
			expect(abstractFactory.productName()).toBe('Product');
		});


		it('rejects attempt to set type name property (i.e. read-only)', function() {

			try {

				abstractFactory.productName('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError')
			}

			expect(true).toBe(true);
		});


		it('exposes an inheritable product type name property to concrete factories (i.e. derived classes)', function() {
			
			expect(typeof concreteFactory.productName).toBe('function');

			expect(concreteFactory.productName()).toBe('ConcreteProductOne');
		});		


		it('can get the type of Product required by the factory (by function reference)', function() {
			
			expect(abstractFactory.productType()).toBe(app.Product);
		});


		it('rejects attempt to set product type property (i.e. read-only)', function() {

			try {

				abstractFactory.productName('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError')
			}

			expect(true).toBe(true);
		});

		
		it('exposes an inheritable product type property to concrete factories (i.e. derived classes)', function() {
			
			expect(typeof concreteFactory.productType).toBe('function');

			expect(concreteFactory.productType()).toBe(ConcreteProductOne);
		});		


		it('can get a list of Products registred with the factory', function() {
			
			expect(abstractFactory.products()).toEqual({});
		});


		it('rejects attempt to set product list property (i.e. read-only)', function() {

			try {

				abstractFactory.products('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError')
			}

			expect(true).toBe(true);
		});

		
		it('exposes an inheritable product list property to concrete factories (i.e. derived classes)', function() {
			
			expect(typeof concreteFactory.products).toBe('function');

			expect(concreteFactory.products()).toEqual({});

			expect(abstractFactory.products()).not.toBe(concreteFactory.products());
		});		


		it('can register a product with the factory', function() {
			
			expect(abstractFactory.products()['Product']).not.toBeDefined();

			abstractFactory.registerProduct(Product);

			expect(abstractFactory.products()['Product']).toBe(Product);
		});


		it('rejects attempt to register a product of the wrong type', function() {
			
			try {

				abstractFactory.registerProduct(ConcreteFactory);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true);
		});

		it('rejects attempt to register a product more than once', function() {
			
			expect(abstractFactory.products()['Product']).not.toBeDefined();

			abstractFactory.registerProduct(Product);

			expect(abstractFactory.products()['Product']).toBe(Product);

			try {

				abstractFactory.registerProduct(Product);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true);
		});

		
		it('exposes an inheritable registerProduct() method to concrete factories (i.e. derived classes)', function() {
			
			expect(concreteFactory.products()['ConcreteProductOne']).not.toBeDefined();

			concreteFactory.registerProduct(ConcreteProductOne);

			expect(concreteFactory.products()['ConcreteProductOne']).toBe(ConcreteProductOne);
		});


		it('its derived classes reject attempt to register a product of the wrong type', function() {
			
			try {

				concreteFactory.registerProduct(ConcreteFactory);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true);
		});

		
		it('its derived classes reject attempt to register a product more than once', function() {
			
			expect(concreteFactory.products()['ConcreteProductOne']).not.toBeDefined();

			concreteFactory.registerProduct(ConcreteProductOne);

			expect(concreteFactory.products()['ConcreteProductOne']).toBe(ConcreteProductOne);

			try {

				concreteFactory.registerProduct(ConcreteProductOne);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true);
		});


		it('can unregister a product from the factory', function() { // depends on app.Product, activate when ready
			
			expect(abstractFactory.products()['Product']).not.toBeDefined();

			expect(abstractFactory.removeProduct(Product)).toBe(null);

			abstractFactory.registerProduct(Product);

			expect(abstractFactory.products()['Product']).toBe(Product);

			expect(abstractFactory.removeProduct(Product)).toBe(Product);

			expect(abstractFactory.products()['Product']).not.toBeDefined();
		});


		it('rejects attempt to unregister a product of the wrong type', function() { // depends on app.Product, activate when ready
			
			try {

				abstractFactory.removeProduct(ConcreteFactory);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true);
		});
		

		it('exposes an inheritable removeProduct() method to concrete factories (i.e. derived classes)', function() {
			
			expect(concreteFactory.products()['ConcreteProductOne']).not.toBeDefined();

			expect(concreteFactory.removeProduct(ConcreteProductOne)).toBe(null);

			concreteFactory.registerProduct(ConcreteProductOne);

			expect(concreteFactory.products()['ConcreteProductOne']).toBe(ConcreteProductOne);

			expect(concreteFactory.removeProduct(ConcreteProductOne)).toBe(ConcreteProductOne);

			expect(concreteFactory.products()['ConcreteProductOne']).not.toBeDefined();
		});


		it('its derived classes reject attempt to unregister a product of the wrong type', function() { // depends on app.Product, activate when ready
			
			try {

				concreteFactory.removeProduct(ConcreteFactory);
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true);
		});

		it('defines an abstract createProduct method', function() {
			
			expect(typeof app.Factory.prototype.createProduct).toBe('function');
		});


		it('rejects attempt to invoke createProduct()', function() {
			
			try {

				abstractFactory.createProduct('ConcreteProductOne');
			}

			catch(e) {

				expect(e.name).toBe('AbstractMethodError');
			}

			expect(true).toBe(true);
		});
	});
});