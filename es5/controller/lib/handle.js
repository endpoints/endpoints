'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _requestHandler = require('../../request-handler');

var _requestHandler2 = _interopRequireDefault(_requestHandler);

var _payloadHandler = require('../../payload-handler');

var _payloadHandler2 = _interopRequireDefault(_payloadHandler);

var _build_payload = require('./build_payload');

var _build_payload2 = _interopRequireDefault(_build_payload);

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

  var validate = requestHandler.validate.bind(requestHandler);
  var process = requestHandler[method].bind(requestHandler);
  var formatPayload = payloadHandler[method].bind(payloadHandler, config);
  var error = payloadHandler.error.bind(payloadHandler);

  var buildPayloadCurried = _build_payload2['default'].bind(null, validate, process, formatPayload, error);

  return responder(buildPayloadCurried);
};