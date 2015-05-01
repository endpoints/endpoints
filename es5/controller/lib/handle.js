'use strict';

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _RequestHandler = require('../../request-handler');

var _RequestHandler2 = _interopRequireDefault(_RequestHandler);

var _PayloadHandler = require('../../payload-handler');

var _PayloadHandler2 = _interopRequireDefault(_PayloadHandler);

var _import = require('./send');

var send = _interopRequireWildcard(_import);

module.exports = function (config) {
  var method = config.method;
  var responder = config.responder;
  var format = config.format;
  var store = config.store;

  var requestHandler = new _RequestHandler2['default'](config);
  var payloadHandler = new _PayloadHandler2['default'](new format({ store: store }));

  return function (request, response) {
    var server = 'express'; // detect if hapi or express here
    var process = requestHandler[method].bind(requestHandler);
    var format = payloadHandler[method].bind(payloadHandler, config);
    var respond = (responder ? responder : send[server]).bind(null, response);
    var errors = requestHandler.validate(request);

    if (errors) {
      respond(payloadHandler.error(errors));
    } else {
      process(request).then(format).then(respond)['catch'](function (err) {
        return respond(payloadHandler.error(err));
      });
    }
  };
};