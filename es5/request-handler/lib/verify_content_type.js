'use strict';

var Kapow = require('kapow');
var EXPECTED_TYPE = 'application/vnd.api+json';

module.exports = function (request) {
  var err;

  var contentType = request.headers['content-type'];

  var isValidContentType = contentType && contentType.toLowerCase().indexOf(EXPECTED_TYPE) === 0;

  if (!isValidContentType) {
    err = Kapow(415, 'Content-Type must be "' + EXPECTED_TYPE + '"');
  }

  return err;
};