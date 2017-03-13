'use strict';

exports.__esModule = true;

exports['default'] = function () {
  var input = arguments[0] === undefined ? [] : arguments[0];

  if (!Array.isArray(input)) {
    throw new Error('Input must be an array.');
  }
  return '/' + input.join('/').replace(/^\/+|\/+$|(\/)+/g, '$1');
};

module.exports = exports['default'];