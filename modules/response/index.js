const jsonApi = require('../formatter-jsonapi');

const TYPE = 'application/vnd.api+json';


/**
 * Creates a new instance of Response.
 *
 * @constructor
 * @param {Object} response - the response object from Express or Hapi
 * @param {Object} formatter - JSON-api or a custom formatter
 */
function Response (response, formatter) {
  this.response = response;
  this.formatter = formatter || jsonApi;
}

Response.error = require('./lib/error');

/**
 * Partially applies this.formatter to each method.
 *
 * @param {Function} fn - The method to which the formatter should be applied.
 */
// partially apply this.formatter to each method
// this is pretty stupid.
Response.method = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.formatter);
    return fn.apply(null, args);
  };
};

/**
 * Convenience method for creating a new element.
 */
Response.prototype.create = Response.method(require('./lib/create'));

/**
 * Convenience method for retrieving an element or a collection.
 */
Response.prototype.read = Response.method(require('./lib/read'));

/**
 * Convenience method for updating one or more attributes on an element.
 */
Response.prototype.update = Response.method(require('./lib/update'));

/**
 * Convenience method for deleting an element.
 */
Response.prototype.destroy = Response.method(require('./lib/destroy'));

/**
 * Formats response for Express framework http response.
 *
 * @param {} payload - Code and data to be returned to the client.
 *
 * @returns {Object} Express response.
 */
// TODO: rework duplication below
Response.prototype.express = function (payload) {
  var code = payload.code;
  var data = payload.data;
  var headers = payload.headers;
  if (headers) {
    Object.keys(headers).forEach(function(header) {
      this.response.set(header, headers[header]);
    }, this);
  }
  return this.response.set('content-type', TYPE).status(code).send(data);
};

/**
 * Formats response for hapi framework http response.
 *
 * @param {Object} payload - Code and data to be returned to client.
 *
 * @returns {Object} Hapi response.
 */
Response.prototype.hapi = function (payload) {
  var code = payload.code;
  var data = payload.data;
  var headers = payload.headers;
  if (headers) {
    Object.keys(headers).forEach(function(header) {
      this.response.set(header, headers[header]);
    }, this);
  }
  return this.response(data).type(TYPE).code(code);
};

module.exports = Response;
