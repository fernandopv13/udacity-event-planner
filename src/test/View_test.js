'use strict';

/* Jasmine.js unit test suite for abstract View.js class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Class View', function(){
	
	
	it('implements the IInterfaceable interface', function() {

		expect(app.IInterfaceable.isImplementationOf(app.View, app.IInterfaceable)).toBe(true);
	});


	it('implements the IObservable interface', function() {

		expect(app.IInterfaceable.isImplementationOf(app.View, app.IObservable)).toBe(true);
	});


	it('implements the IObserver interface', function() {

		expect(app.IInterfaceable.isImplementationOf(app.View, app.IObserver)).toBe(true);
	});


	describe('instance', function() {

		var testView;

		beforeEach(function() {

			testView = new app.View(app.Model, 'event-view', 'Test Heading');
		});


		describe('accessing private instance attributes', function() {

			it('can get its class name', function() {

				expect(testView.className()).toBe('View');
			});
			
			
			it('rejects attempt to set its class name', function() {

				try {

					testView.className('read-only');
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}

				expect(true).toBe(true);
			});


			it('can get and set its heading', function() {

				expect(testView.heading('My heading')).toBe('My heading');
			});


			it('can get and set the data model it is currently presenting', function() {

				expect(testView.model(new app.Model()).constructor).toBe(app.Model);
			});


			it('rejects attempt to set a model that is not an instance of Model', function() {

				try {

					testView.model({});
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}

				expect(true).toBe(true);
			});


			it('can get the data model class it requires', function() {

				expect(typeof testView.modelClass).toBe('function');

				expect(testView.modelClass()).toBe(app.Model);
			});


			it('rejects attempt to set its model class', function() {

				try {

					testView.modelClass(Object);
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}

				expect(true).toBe(true);
			});


			it('can get a collection of its observers', function() {

				expect(typeof testView.observers).toBe('function');

				expect(testView.observers().constructor).toBe(Array);
			});


			it('rejects attempt to set its observers', function() {

				try {

					testView.observers(['read', 'only']);
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}

				expect(true).toBe(true);
			});


			it('can get a collection of its parent classes and interfaces', function() {

				expect(typeof testView.parentList).toBe('function');

				expect(testView.parentList().constructor).toBe(Array);
			});

			
			it('rejects attempt to set parent classes and interfaces', function() {

				try {

					testView.parentList(['read', 'only']);
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}

				expect(true).toBe(true);
			});
			
			
			it('can get and set a temporary container element used for rendering', function() {

				expect(testView.containerElement(document.createElement('div')).constructor).toBe(HTMLDivElement);
			});


			it('rejects attempt to set a container element that is not an instance of HTMLElement', function() {

				try {

					testView.containerElement({});
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}

				expect(true).toBe(true);
			});


			it('can get its $renderContext', function() {

				expect(typeof testView.$renderContext).toBe('function');

				expect(testView.$renderContext()).toBeDefined();
			});
			
			
			it('can get a reference to its parent class, if inheriting', function() {

				expect(testView.ssuper()).toBe(Object);
			});
			
			
			it('rejects attempt to set its parent class', function() {

				try {

					testView.ssuper(Object);
				}

				catch(e) {

					expect(e.name).toBe('IllegalArgumentError');
				}

				expect(true).toBe(true);
			});
		});

		
		describe('using public instance methods', function() {

			it('can create a new UIWidget', function(){

				// Just testing that method shorthand works, test details individually for each widget

				var el = testView.createWidget(

					'HTMLElement', // div

					{
						element: 'div',			
						
						classList: ['row']
					}
				);

				expect(el.constructor).toBe(HTMLDivElement); // outer div

				expect(el.classList[0]).toBe('row');
			});
			

			
			xit('can hide itself', function() {

			});


			it('can tell if it is an instance of a given class or interface (by function reference)', function() {

				expect(testView.isInstanceOf(app.View)).toBe(true);

				expect(testView.isInstanceOf(Array)).toBe(false);
			});


			xit('can initialize itself', function() {

			});


			xit('can clean up after itself when it unloads (i.e. hides)', function() {

			});


			xit('can show (i.e. unhide) itself', function() {

			});
			

			xit('can render itself', function() {

			});
			

			xit('can render itself in response to an update from a Controller', function() {

			});
			
		});

		describe('using static members', function() {

			it('defines a collection of UI action constants ', function() {

				expect(typeof app.View.UIAction).toBe('object');

				expect(Object.keys(app.View.UIAction).length).toBeGreaterThan(0);
			});
		});
		

		afterEach(function() {

			testView = null;
		});
		
	});
});
