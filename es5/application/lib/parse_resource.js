'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _require_search = require('./require_search');

var _require_search2 = _interopRequireDefault(_require_search);

var _require_silent = require('./require_silent');

var _require_silent2 = _interopRequireDefault(_require_silent);

exports['default'] = function (name, searchPaths) {
  var routeModulePath, moduleBasePath;
  if (typeof name === 'string') {
    routeModulePath = (0, _require_search2['default'])(_path2['default'].join(name, 'routes'), searchPaths);
    moduleBasePath = _path2['default'].dirname(routeModulePath);
    return {
      name: name,
      routes: require(routeModulePath),
      controller: (0, _require_silent2['default'])(_path2['default'].join(moduleBasePath, 'controller'))
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