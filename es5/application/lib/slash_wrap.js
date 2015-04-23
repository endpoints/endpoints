'use strict';

exports.__esModule = true;

exports['default'] = function (input) {
  return ('/' + (input || '') + '/').replace(/\/\/+/g, '/');
};

module.exports = exports['default'];