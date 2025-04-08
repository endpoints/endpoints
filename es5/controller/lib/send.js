'use strict';

exports.__esModule = true;
exports.express = express;
exports.hapi = hapi;
var TYPE = 'application/vnd.api+json';

function applyHeaders(response, headers) {
  Object.keys(headers).forEach(function (header) {
    response.set(header, headers[header]);
  });
}

function express(response, payload) {
  var code = payload.code;
  var data = payload.data;
  var headers = payload.headers;
  if (headers) {
    applyHeaders(response, payload.headers);
  }
  return response.set('content-type', TYPE).status(parseInt(code)).send(data);
}

function hapi(response, payload) {
  var code = payload.code;
  var data = payload.data;
  var headers = payload.headers;
  if (headers) {
    applyHeaders(response, payload.headers);
  }
  return response(data).type(TYPE).code(code);
}