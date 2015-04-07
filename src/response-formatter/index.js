/**
  Provides methods for formatting create/read/update/delete requests to
  json-api compliance. This is mostly concerned about status codes, it
  passes all the formatting work to a provided formatter.
*/
class ResponseFormatter {

  /**
    The constructor.

    @constructs ResponseFormatter
    @param {Function} formatter
  */
  constructor (formatter) {
    if (!formatter) {
      throw new Error('No formatter specified.');
    }
    this.formatter = formatter;
  }

  /**
    Partially applies this.formatter to each method.

    @param {Function} fn - The method to which the formatter should be applied.
    @returns {Function} - The originally passed function, with the formatter as an argument.
  */
  // partially apply this.formatter to each method
  // this is pretty stupid.
  static method (fn) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this.formatter);
      return fn.apply(null, args);
    };
  }

}

ResponseFormatter.prototype.error = require('./lib/error');

/**
  Convenience method for creating a new element

  @param {Function} formatter - a module for converting data to comply with a specific standard.
  @param {Bookshelf.Model|Bookshelf.Collection} data
  @param {Object} config - options to pass to the formatter
  @returns {Object} - http status code and appropriately formatted data.
*/
ResponseFormatter.prototype.create = ResponseFormatter.method(require('./lib/create'));

/**
  Convenience method for retrieving an element or a collection using
  the underlying adapter.

  @param {Function} formatter - a module for converting data to comply with a specific standard.
  @param {Bookshelf.Model|Bookshelf.Collection} data
  @param {Object} config - options to pass to the formatter
  @returns {Object} - http status code and appropriately formatted data.
*/
ResponseFormatter.prototype.read = ResponseFormatter.method(require('./lib/read'));

/**
  Convenience method for updating one or more attributes on an element
  using the underlying adapter.

  @param {Function} formatter - a module for converting data to comply with a specific standard.
  @param {Bookshelf.Model} data
  @param {Object} config - options to pass to the formatter
  @returns {Object} - http status code and appropriately formatted data.
 */
ResponseFormatter.prototype.update = ResponseFormatter.method(require('./lib/update'));

/**
  Convenience method for deleting an element using the underlying adapter.

  @param {Function} formatter - a module for converting data to comply with a specific standard.
  @param {Bookshelf.Model|Bookshelf.Collection} data
  @param {Object} config - options to pass to the formatter
  @returns {Object} - http status code and appropriately formatted data.
 */
ResponseFormatter.prototype.destroy = ResponseFormatter.method(require('./lib/destroy'));

module.exports = ResponseFormatter;
