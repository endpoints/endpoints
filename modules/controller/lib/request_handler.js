const verifyAccept = require('./verify_accept');
const verifyContentType = require('./verify_content_type');
const verifyDataObject = require('./verify_data_object');

module.exports = function (opts) {
  var controller = opts.controller;
  var payload = opts.payload;
  var responder = opts.responder;
  var method = opts.method;
  var endpointType = opts.type;
  var validators = [];

  validators.push(verifyAccept);

  if (method === 'update' || method === 'create') {
    validators.push(verifyContentType);
    validators.push(verifyDataObject);
  }

  return function (request, response, next) {
    var err;

    for (var validate in validators) {
      err = validators[validate](request, endpointType);
      if (err) {
        break;
      }
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
