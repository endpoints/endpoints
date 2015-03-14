const TYPE = 'application/vnd.api+json';

function applyHeaders (response, headers) {
  Object.keys(headers).forEach(function(header) {
    response.set(header, headers[header]);
  });
}

exports.express = function (response, payload) {
  var code = payload.code;
  var data = payload.data;
  var headers = payload.headers;
  if (headers) {
    applyHeaders(response, payload.headers);
  }
  return response.set('content-type', TYPE).status(code).send(data);
};

exports.hapi = function (response, payload) {
  var code = payload.code;
  var data = payload.data;
  var headers = payload.headers;
  if (headers) {
    applyHeaders(response, payload.headers);
  }
  return response(data).type(TYPE).code(code);
};
