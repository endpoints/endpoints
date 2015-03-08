const verifyAccept = require('./verify_accept');
const verifyContentType = require('./verify_content_type');
const verifyDataObject = require('./verify_data_object');

const payloads = {
  create: require('./payloads/create'),
  read: require('./payloads/read'),
  update: require('./payloads/update'),
  destroy: require('./payloads/destroy')
};

const sourceInterfaces = {
  create: require('./source/create'),
  read: require('./source/read'),
  update: require('./source/update'),
  destroy: require('./source/destroy')
};

module.exports = function (opts) {
  var sourceInterface = sourceInterfaces[opts.method];
  var payload = payloads[opts.method];
  var responder = opts.responder;
  var source = opts.source;

  return function (request, response, next) {
    var err;
    var requestData;
    var validators = [verifyAccept];
    var hasBody = request.body && Object.keys(request.body).length > 0;

    if (opts.method === 'update' && request.params.relation) {
      requestData = {
        type: opts.typeName,
        links: {}
      };
      requestData.links[request.params.relation] = request.body.data;
      request.body.data = requestData;
      opts.relationOnly = true;
    }

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
