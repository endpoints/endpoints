'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _requestHandler = require('../../request-handler');

var _requestHandler2 = _interopRequireDefault(_requestHandler);

var _payloadHandler = require('../../payload-handler');

var _payloadHandler2 = _interopRequireDefault(_payloadHandler);

var _send = require('./send');

var send = _interopRequireWildcard(_send);

module.exports = function (config, baseUrl) {
  var method = config.method;
  var responder = config.responder;
  var format = config.format;
  var store = config.store;

  var requestHandler = new _requestHandler2['default'](config);
  var payloadHandler = new _payloadHandler2['default'](new format({
    store: store,
    baseUrl: baseUrl
  }));

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
        //throw err;
        return respond(payloadHandler.error(err));
      });
    }
  };
};