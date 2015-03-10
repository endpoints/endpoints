const jsonApi = require('../formatter-jsonapi');

const TYPE = 'application/vnd.api+json';

function Response (response, formatter) {
  this.response = response;
  this.formatter = formatter || jsonApi;
}

Response.error = require('./lib/error');

// partially apply this.formatter to each method
// this is pretty stupid.
Response.method = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.formatter);
    return fn.apply(null, args);
  };
};

Response.prototype.create = Response.method(require('./lib/create'));
Response.prototype.read = Response.method(require('./lib/read'));
Response.prototype.update = Response.method(require('./lib/update'));
Response.prototype.destroy = Response.method(require('./lib/destroy'));


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
