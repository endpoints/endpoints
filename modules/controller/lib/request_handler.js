const verifyContentType = require('./verify_content_type');

module.exports = function (opts) {
  var controller = opts.controller;
  var payload = opts.payload;
  var responder = opts.responder;
  var method = opts.method;

  return function (request, response, next) {
    var err;
    var headers = request.headers;
    if (method === 'update') {
      err = verifyContentType(headers['content-type']);
    }

    if (err) {
      return responder(payload(err), request, response);
    }

    controller(opts, request).then(function(data) {
      responder(payload(null, data, opts), request, response, next);
    }).catch(function(err) {
      responder(payload(err), request, response, next);
    });
  };
};
