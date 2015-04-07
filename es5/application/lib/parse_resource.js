'use strict';

var path = require('path');

var requireSearch = require('./require_search');
var requireSilent = require('./require_silent');

module.exports = function (name, searchPaths) {
  var routeModulePath, moduleBasePath;
  if (typeof name === 'string') {
    routeModulePath = requireSearch(path.join(name, 'routes'), searchPaths);
    moduleBasePath = path.dirname(routeModulePath);
    return {
      name: name,
      routes: require(routeModulePath),
      controller: requireSilent(path.join(moduleBasePath, 'controller'))
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