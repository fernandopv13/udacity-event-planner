'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class Product
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
	* @return {Product} Not supposed to be instantiated, except when setting up inheritance in subclasses (concrete products)
	*/

	module.Product = function() {

		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/
		
			var _type = this.type || 'Product'; // the type of this product (a unique, case-insensitive identifier)


		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields (dependency injection enables access for subclasses)
		*---------------------------------------------------------------------------------------*/

			/** Gets the type name of the product (case-insensitive)
			*
			* @return {String} type The type (class) name of the Product
			*
			* @throws {IllegalArgumentError} If trying to set the type
			*/

			this.type = new app.Accessor(_type, true);
	};


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Creates a new product of the requested type
	*
	* @abstract
	*
	* @param {String} type Type of the new Product to be created (case-insensitive)
	*
	* @return {Product} An instance of the relevant Product subclass
	*
	* @throws {AbstractMethodError} If invoked directly on the abstract base class (subclasses must provide their own implementation)
	*/

	module.Product.prototype.createProduct = function() {
		
		throw new AbstractMethodError('createProduct() must be realized in subclasses');
	};

})(app);