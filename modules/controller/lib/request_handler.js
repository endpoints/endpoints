const verifyAccept = require('./verify_accept');
const verifyContentType = require('./verify_content_type');
const verifyDataObject = require('./verify_data_object');

module.exports = function (opts) {
  var sourceInterface = opts.sourceInterface;
  var payload = opts.payload;
  var responder = opts.responder;
  var source = opts.source;

  return function (request, response, next) {
    var err;
    var validators = [verifyAccept];
    var hasBody = request.body && Object.keys(request.body).length > 0;

    if (hasBody) {
      validators = validators.concat([verifyContentType, verifyDataObject]);
    }

    var endpoint = {
      typeName: opts.typeName,
      id: request.params ? request.params.id : null
    };

    for (var validate in validators) {
      err = validators[validate](request, endpoint);
      if (err) {
        break;
      }
    }

    if (err) {
      return responder(payload(err), request, response);
    }

    sourceInterface(source, opts, request).then(function(data) {
      responder(payload(null, data, opts), request, response, next);
    }).catch(function(err) {
      // uncomment this to debug stuff
      //throw err;
      responder(payload(err), request, response, next);
    });
  };
};
