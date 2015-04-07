'use strict';

var RequestHandler = require('../../request-handler');
var ResponseFormatter = require('../../response-formatter');
var jsonApi = require('../../formatter-jsonapi');
var send = require('./send');

module.exports = function (config, adapter) {
  var method = config.method;
  var responder = config.responder;
  var handler = new RequestHandler(adapter, config);
  var formatter = new ResponseFormatter(jsonApi);

  return function (request, response) {
    var server = 'express'; // detect if hapi or express here
    var handle = handler[method].bind(handler);
    var format = formatter[method].bind(formatter, config);
    var sender = responder ? responder : send[server];
    var respond = sender.bind(null, response);
    var errors = handler.validate(request);

    if (errors) {
      respond(formatter.error(errors));
    } else {
      handle(request).then(format).then(respond)['catch'](function (err) {
        //throw err;
        return respond(formatter.error(err));
      });
    }
  };
};