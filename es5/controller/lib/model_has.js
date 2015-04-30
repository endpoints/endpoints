'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

function error(type, key) {
  return 'Model does not have ' + type + ': ' + key + '.';
}

module.exports = function (available, requested, type) {
  var message = error.bind(null, type);
  if (!requested) {
    return;
  }
  if (_import2['default'].isArray(requested) && _import2['default'].isArray(available)) {
    return _import2['default'].difference(requested, available).map(message);
  }
  return available[requested] ? null : message(requested);
};