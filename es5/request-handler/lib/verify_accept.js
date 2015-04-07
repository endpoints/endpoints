'use strict';

var Kapow = require('kapow');
var EXPECTED_ACCEPT = 'application/vnd.api+json';

module.exports = function (request) {
  var err;

  var headers = request.headers;
  var accept = headers.accept;
  var isBrowser = accept && accept.indexOf('text/html') !== -1;

  var isValidAccept = accept && accept.toLowerCase().indexOf(EXPECTED_ACCEPT) === 0;

  if (!isValidAccept && !isBrowser) {
    err = Kapow(406, 'Content-Type must be "' + EXPECTED_ACCEPT + '"');
  }

  return err;
};