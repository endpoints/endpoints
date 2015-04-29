'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _requireSearch = require('./require_search');

var _requireSearch2 = _interopRequireDefault(_requireSearch);

var _requireSilent = require('./require_silent');

var _requireSilent2 = _interopRequireDefault(_requireSilent);

exports['default'] = function (name, searchPaths) {
  var routeModulePath, moduleBasePath;
  if (typeof name === 'string') {
    routeModulePath = _requireSearch2['default'](_path2['default'].join(name, 'routes'), searchPaths);
    moduleBasePath = _path2['default'].dirname(routeModulePath);
    return {
      name: name,
      routes: require(routeModulePath),
      controller: _requireSilent2['default'](_path2['default'].join(moduleBasePath, 'controller'))
    };
  }
  if (!name) {
    name = {};
  }
  if (!name.name) {
    throw new Error('Unable to parse a module without a name.');
  }
  if (!name.routes) {
    throw new Error('Unable to parse a module without a routes object.');
  }
  return name;
};

module.exports = exports['default'];