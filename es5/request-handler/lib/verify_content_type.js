'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireWildcard(_Kapow);

var EXPECTED_TYPE = 'application/vnd.api+json';

exports['default'] = function (request) {
  var err;

  var contentType = request.headers['content-type'];

  var isValidContentType = contentType && contentType.toLowerCase().indexOf(EXPECTED_TYPE) === 0;

  if (!isValidContentType) {
    err = _Kapow2['default'](415, 'Content-Type must be "' + EXPECTED_TYPE + '"');
  }

  return err;
};

module.exports = exports['default'];