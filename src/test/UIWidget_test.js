'use strict';

/* Jasmine.js unit test suite for UIWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('Class UIWidget', function(){
	
	it('inherits from Product', function() {

		expect((new app.UIWidget()) instanceof app.Product).toBe(true);
	});


	it('can create a new instance', function() {
			
			expect((new app.UIWidget()).constructor).toBe(app.UIWidget);
	});
		
		
	// Set up some mocks

	var ConcreteProduct = function() { // extends UIWidget

		this.type = 'concreteProduct';

		app.UIWidget.call(this);
	}

	ConcreteProduct.prototype = Object.create(app.UIWidget.prototype); // Set up inheritance

	ConcreteProduct.prototype.constructor = ConcreteProduct; // Reset constructor property

	
	describe('instance', function() {
		
		var testWidget, concreteProduct;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testWidget = new app.UIWidget();

			concreteProduct = new ConcreteProduct();
		});
		
		
		/*
		it('can get a singleton instance of the class itself', function() {
			
			expect(testWidget.instance().constructor).toBe(app.UIWidget);

			expect(testWidget.instance()).toBe(testWidget.instance());
		});


		it('rejects attempt to set instance property (i.e. read-only)', function() {

			try {

				testWidget.instance('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError')
			}

			expect(true).toBe(true);
		});


		it('exposes an inheritable instance property to concrete factories (i.e. derived classes)', function() {
			
			expect(typeof concreteProduct.instance).toBe('function');
		});


		it('gets a singleton of the concrete factory when invoking instance() on a derived class', function() {
			
			expect(concreteProduct.instance().constructor).toBe(ConcreteProduct);

			expect(concreteProduct.instance()).toBe(concreteProduct.instance());
		});
		*/


		it('defines an init() method', function() {
			
			expect(typeof app.UIWidget.prototype.init).toBe('function');
		});


		/*
		it('rejects attempt to invoke init()', function() {
			
			try {

				testWidget.init();
			}

			catch(e) {

				expect(e.name).toBe('AbstractMethodError');
			}

			expect(true).toBe(true);
		});
		*/
	});
});