"use strict";

exports.__esModule = true;
function send(context, payload) {
  var code = payload.code;
  var data = payload.data;
  var headers = payload.headers;

  if (headers) {
    context.set(headers);
  }
  context.status = parseInt(code);
  context.body = data;
}

exports["default"] = function (buildPayload) {
  return function* () {
    var request = {
      body: this.request.body,
      method: this.method,
      query: this.query,
      params: this.params,
      headers: this.headers
    };

    var respond = send.bind(null, this);
    yield buildPayload(request).then(respond);
  };
};

module.exports = exports["default"];