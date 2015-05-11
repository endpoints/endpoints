'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports['default'] = function (obj) {
  return _lodash2['default'].transform(obj, function (result, n, key) {
    var val = String(n);
    result[key] = val.indexOf(',') === -1 ? val : val.split(',');
  });
};

module.exports = exports['default'];