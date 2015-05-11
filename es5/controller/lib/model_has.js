'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function error(type, key) {
  return 'Model does not have ' + type + ': ' + key + '.';
}

module.exports = function (available, requested, type) {
  var message = error.bind(null, type);
  if (!requested) {
    return;
  }
  if (_lodash2['default'].isArray(requested) && _lodash2['default'].isArray(available)) {
    return _lodash2['default'].difference(requested, available).map(message);
  }
  return available[requested] ? null : message(requested);
};