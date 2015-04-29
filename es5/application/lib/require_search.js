'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _requireSilent = require('./require_silent');

var _requireSilent2 = _interopRequireDefault(_requireSilent);

exports['default'] = function (file, searchPaths) {
  if (!searchPaths) {
    throw new Error('No searchPaths specified.');
  }
  var result = null;
  var len = searchPaths.length;
  for (var i = 0; i < len; i++) {
    var currentPath = _path2['default'].join(searchPaths[i], file);
    var notFoundInFoundFile = false;
    result = _requireSilent2['default'](currentPath);
    if (result instanceof Error) {
      // handle situations where a file is found, but requiring it
      // still throws a MODULE_NOT_FOUND error because that file
      // depends on something else which can't be found. boy this
      // is ugly.
      notFoundInFoundFile = result.message.indexOf(currentPath) === -1;
      if (result.code !== 'MODULE_NOT_FOUND' || notFoundInFoundFile) {
        throw result;
      } else {
        result = null;
      }
    } else {
      result = currentPath;
      break;
    }
  }
  if (!result) {
    throw new Error('Unable to locate "' + file + '" in search paths: ' + searchPaths.join(', '));
  }
  return result;
};

module.exports = exports['default'];