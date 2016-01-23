/* A subset of Java inspired extentions to the native JS Error class */

/** Java-like error for when trying to invoke an abstract method (including interface methos signatures) */

function AbstractMethodError(message) {
	
	this.name = 'AbstractMethodError';
	
	this.message = message || 'Abstract method cannot be invoked';
	
	this.stack = (new Error()).stack;
}

AbstractMethodError.prototype = Object.create(Error.prototype);

AbstractMethodError.prototype.constructor = AbstractMethodError;


/** Java-like error for when trying to use an undefined class */

function ClassNotFoundError(message) {
	
	this.name = 'ClassNotFoundError';
	
	this.message = message || 'Class not found';
	
	this.stack = (new Error()).stack;
}

ClassNotFoundError.prototype = Object.create(Error.prototype);

ClassNotFoundError.prototype.constructor = ClassNotFoundError;


/** Java-like error for when trying to access an attribute or a method without permission */

function IllegalAccessError(message) {
	
	this.name = 'IllegalAccessError';
	
	this.message = message || 'Illegal access';
	
	this.stack = (new Error()).stack;
}

IllegalAccessError.prototype = Object.create(Error.prototype);

IllegalAccessError.prototype.constructor = IllegalAccessError;



/** Java-like error for when trying to invoke a method with an illegal parameter (including trying to set a read-only attribute) */

function IllegalArgumentError(message) {
	
	this.name = 'IllegalArgumentError';
	
	this.message = message || 'Illegal argument';
	
	this.stack = (new Error()).stack;
}


IllegalArgumentError.prototype = Object.create(Error.prototype);

IllegalArgumentError.prototype.constructor = IllegalArgumentError;


/** Java-like error for when trying to instantiate an abstract class or interface (including interface methos signatures) */

function InstantiationError(message) {
	
	this.name = 'InstantiationError';
	
	this.message = message || 'Instantiation not permitted';
	
	this.stack = (new Error()).stack;
}

InstantiationError.prototype = Object.create(Error.prototype);

InstantiationError.prototype.constructor = InstantiationError;


/* Custom error template */
/*
function MyError(message) {
	
	this.name = 'MyError';
	
	this.message = message || 'Default message';
	
	this.stack = (new Error()).stack;
}

MyError.prototype = Object.create(Error.prototype);

MyError.prototype.constructor = MyError;
*/