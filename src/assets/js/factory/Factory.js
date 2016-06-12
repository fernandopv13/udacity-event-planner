'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class Factory
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Abstract base class for the abstract factory method pattern used to create and manage UIwidgets.
	*
	* @constructor
	*
	* @abstract
	*
	* @author Ulrik H. Gade, March 2016
	*
	* @return {Factory} Not supposed to be instantiated, except when setting up inheritance in subclasses (concrete factories)
	*
	* @todo Modify to support JS singleton pattern, e.g. by accepting instance rather than class as product
	*/

	module.Factory = function() {

		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
			//var _instance = null, // reference to the instance used when using class as singleton

			var _products = {}, // list of the product types registered with this factory

			_productName = this.productName || 'Product', // the name of the Product base class required by this factory (as a String)

			_productType = this.productType || module.Product; // the type of product base class required by this factory (by function reference)


		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields (accessible to subclasses)
		*---------------------------------------------------------------------------------------*/

			/** Gets the collection of Products registered with this Factory (the property is read-only, but the collection is mutable)
			*
			* @return {Object} products Collection of registered products (by id)
			*
			* @throws {IllegalArgumentError} If trying to set the collection.
			*/

			this.products = new app.Accessor(_products, true); // replace temporary literal with read-only accessor


			/** Gets the name of the type of Product the factory is designed to work with (read-only)
			*
			* @return {String} name The name of the type (class) of Product required
			*
			* @throws {IllegalArgumentError} If trying to set the productType
			*/

			this.productName = new app.Accessor(_productName, true);


			/** Gets the type of Product (by function reference) the factory is designed to work with (read-only)
			*
			* @return {Function} type The type (class) of Product required
			*
			* @throws {IllegalArgumentError} If trying to set the productType
			*/

			this.productType = new app.Accessor(_productType, true);
	};


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Registers a Product type so that the Factory can create it later.
	*
	* Products are registered by their type string (case-sensitive).
	*
	* @param {Product} product The Product (class) that wishes to register with the Factory (by function reference)
	*
	* @return {void}
	*
	* @throws {IllegalArgumentError} If Product is derived from the wrong subtype for this factory
	*
	* @throws {IllegalArgumentError} If Product type is already registered with this factory
	*/
		
	module.Factory.prototype.registerProduct = function(Fnc_Product) {
		
		var obj = new Fnc_Product();

		if (obj instanceof this.productType()) { // Product type is derived from the right subclass of Product

			var type = obj.type(); // get type name (case-insensitive)

			if (typeof this.products()[type] === 'undefined') { // type (name) not already registered

					this.products()[type] = Fnc_Product // register new Product
			}

			else {

				throw new IllegalArgumentError('Product already registered with factory. (Note: Type name is case-sensitive.)');
			}
		}

		else {

			throw new IllegalArgumentError('Expected: ' + this.productName());
		}
	};


	/** Unregisters a Product type so that the Factory can no longer create it.
	*
	* Products are unregistered by their type string (not case-sensitive to prevent redundant registrations).
	*
	* @param {Product} product The Product (class) that wishes to unregister from the Factory (by function reference)
	*
	* @return {Function} product The Product that has been unregistered (by function reference), or null if not found
	*
	* @throws {IllegalArgumentError} If Product is derived from the wrong subtype for this factory
	*
	* @throws {IllegalArgumentError} If Product type is already registered with this factory
	*/
		
	module.Factory.prototype.removeProduct = function(Fnc_Product) {
		
		var obj = new Fnc_Product();

		if (obj instanceof this.productType()) { // Product type is derived from the right subclass of Product

			var type = obj.type(), ret = null; // get type name (case-insensitive)

			if (typeof this.products()[type] !== 'undefined') { // type exist in list

					ret = this.products()[type]; // get return value

					delete this.products()[type] // remove Product
			}

			return ret;
		}

		else {

			throw new IllegalArgumentError('Expected: ' + this.productName());
		}
	};


	/** Creates a new product of the requested type
	*
	* @param {String} type Type of the new Product to be created (case-insensitive)
	*
	* @abstract
	*
	* @return {Product} An instance of the relevant Product subclass
	*
	* @throws {AbstractMethodError} If invoked directly on the abstract base class (subclasses must provide their own implementation)
	*/

	module.Factory.prototype.createProduct = function(str_type) {
		
		throw new AbstractMethodError('createProduct() must be realized in subclasses');
	};

})(app);