'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

/**
  Provides methods for formatting create/read/update/delete requests to
  json-api compliance. This is mostly concerned about status codes, it
  passes all the formatting work to a provided formatter.
*/

var ResponseFormatter = (function () {

  /**
    The constructor.
     @constructs ResponseFormatter
    @param {Function} formatter
  */

  function ResponseFormatter(formatter) {
    _classCallCheck(this, ResponseFormatter);

    if (!formatter) {
      throw new Error('No formatter specified.');
    }
    this.formatter = formatter;
  }

  /**
    Partially applies this.formatter to each method.
     @param {Function} fn - The method to which the formatter should be applied.
  */
  // partially apply this.formatter to each method
  // this is pretty stupid.

  ResponseFormatter.method = function method(fn) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this.formatter);
      return fn.apply(null, args);
    };
  };

  return ResponseFormatter;
})();

ResponseFormatter.prototype.error = require('./lib/error');

/**
  Convenience method for creating a new element

  @todo: missing params listing
*/
ResponseFormatter.prototype.create = ResponseFormatter.method(require('./lib/create'));

/**
  Convenience method for retrieving an element or a collection using
  the underlying adapter.

  @todo: missing params listing
*/
ResponseFormatter.prototype.read = ResponseFormatter.method(require('./lib/read'));

/**
  Convenience method for updating one or more attributes on an element
  using the underlying adapter..

  @todo: missing params listing
 */
ResponseFormatter.prototype.update = ResponseFormatter.method(require('./lib/update'));

/**
  Convenience method for deleting an element using the underlying adapter.

  @todo: missing params listing
 */
ResponseFormatter.prototype.destroy = ResponseFormatter.method(require('./lib/destroy'));

module.exports = ResponseFormatter;