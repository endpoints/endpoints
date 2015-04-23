'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

exports['default'] = function (obj) {
  return _import2['default'].transform(obj, function (result, n, key) {
    var val = String(n);
    result[key] = val.indexOf(',') === -1 ? val : val.split(',');
  });
};

module.exports = exports['default'];