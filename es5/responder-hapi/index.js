"use strict";

exports.__esModule = true;
function applyHeaders(response, headers) {
  Object.keys(headers).forEach(function (header) {
    response.set(header, headers[header]);
  });
}

function send(response, payload) {
  var code = payload.code;
  var data = payload.data;
  var headers = payload.headers;

  if (headers) {
    applyHeaders(response, headers);
  }
  return response(data).code(code);
}

exports["default"] = function (buildPayload) {
  return function (request, response) {
    var respond = send.bind(null, response);
    buildPayload(request).then(respond);
  };
};

module.exports = exports["default"];