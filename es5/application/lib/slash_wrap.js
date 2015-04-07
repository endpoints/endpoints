'use strict';

module.exports = function (input) {
  return ('/' + (input || '') + '/').replace(/\/\/+/g, '/');
};