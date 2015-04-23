'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _RequestHandler = require('../../request-handler');

var _RequestHandler2 = _interopRequireWildcard(_RequestHandler);

var _ResponseFormatter = require('../../response-formatter');

var _ResponseFormatter2 = _interopRequireWildcard(_ResponseFormatter);

var _jsonApi = require('../../formatter-jsonapi');

var _jsonApi2 = _interopRequireWildcard(_jsonApi);

var _import = require('./send');

var send = _interopRequireWildcard(_import);

exports['default'] = function (config, adapter) {
  var method = config.method;
  var responder = config.responder;
  var handler = new _RequestHandler2['default'](adapter, config);
  var formatter = new _ResponseFormatter2['default'](_jsonApi2['default']);

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

module.exports = exports['default'];