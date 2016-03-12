// Object.is() polyfill

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is

if (!Object.is) {
  Object.is = function(x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}



// Object.keys() polyfill (slightly reformatted to please jshint)

// Source: http://tokenposts.blogspot.com.au/2012/04/javascript-objectkeys-browser.html

if (!Object.keys) {
	Object.keys = function(o) {
		if (o !== Object(o)) {
			throw new TypeError('Object.keys called on a non-object');
			
		}
		else {
			var k=[],p;
			for (p in o) {
				if (Object.prototype.hasOwnProperty.call(o,p)) {
					k.push(p);
				}
			}
			return k;
		}
	}
}