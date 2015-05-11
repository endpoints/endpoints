'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

var EXPECTED_ACCEPT = 'application/vnd.api+json';

exports['default'] = function (request) {
  var err;

  var headers = request.headers;
  var accept = headers.accept;
  var isBrowser = accept && accept.indexOf('text/html') !== -1;

  var isValidAccept = accept && accept.toLowerCase().indexOf(EXPECTED_ACCEPT) === 0;

  if (!isValidAccept && !isBrowser) {
    err = _kapow2['default'](406, '"Accept" header must include "' + EXPECTED_ACCEPT + '"');
  }

  return err;
};

module.exports = exports['default'];