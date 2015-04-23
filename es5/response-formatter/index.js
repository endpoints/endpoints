'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _error = require('./lib/error');

var _error2 = _interopRequireWildcard(_error);

var _create = require('./lib/create');

var _create2 = _interopRequireWildcard(_create);

var _read = require('./lib/read');

var _read2 = _interopRequireWildcard(_read);

var _update = require('./lib/update');

var _update2 = _interopRequireWildcard(_update);

var _destroy = require('./lib/destroy');

var _destroy2 = _interopRequireWildcard(_destroy);

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

ResponseFormatter.prototype.error = _error2['default'];

/**
  Convenience method for creating a new element

  @todo: missing params listing
*/
ResponseFormatter.prototype.create = ResponseFormatter.method(_create2['default']);

/**
  Convenience method for retrieving an element or a collection using
  the underlying adapter.

  @todo: missing params listing
*/
ResponseFormatter.prototype.read = ResponseFormatter.method(_read2['default']);

/**
  Convenience method for updating one or more attributes on an element
  using the underlying adapter..

  @todo: missing params listing
 */
ResponseFormatter.prototype.update = ResponseFormatter.method(_update2['default']);

/**
  Convenience method for deleting an element using the underlying adapter.

  @todo: missing params listing
 */
ResponseFormatter.prototype.destroy = ResponseFormatter.method(_destroy2['default']);

exports['default'] = ResponseFormatter;
module.exports = exports['default'];