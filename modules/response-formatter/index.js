/**
  Creates a new instance of ResponseFormatter.

  @constructor
  @param {Function} formatter
*/
function ResponseFormatter (formatter) {
  if (!formatter) {
    throw new Error('No formatter specified.');
  }
  this.formatter = formatter;
}

ResponseFormatter.prototype.error = require('./lib/error');

/**
  Partially applies this.formatter to each method.

  @param {Function} fn - The method to which the formatter should be applied.
*/
// partially apply this.formatter to each method
// this is pretty stupid.
ResponseFormatter.method = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.formatter);
    return fn.apply(null, args);
  };
};

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
