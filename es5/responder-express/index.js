"use strict";

exports.__esModule = true;
function send(response, payload) {
  var code = payload.code;
  var data = payload.data;
  var headers = payload.headers;

  if (headers) {
    response.set(headers);
  }
  return response.status(code).send(data);
}

exports["default"] = function (buildPayload) {
  return function (request, response) {
    var respond = send.bind(null, response);
    buildPayload(request).then(respond);
  };
};

module.exports = exports["default"];