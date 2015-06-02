'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

var EXPECTED_TYPE = 'application/vnd.api+json';

exports['default'] = function (request) {
  var err;

  var contentType = request.headers['content-type'];

  var isValidContentType = contentType && contentType.toLowerCase().indexOf(EXPECTED_TYPE) === 0;

  if (!isValidContentType) {
    err = (0, _kapow2['default'])(415, 'Content-Type must be "' + EXPECTED_TYPE + '"');
  }

  return err;
};

module.exports = exports['default'];