import path from 'path';

import requireSearch from './require_search';
import requireSilent from './require_silent';

export default function (name, searchPaths) {
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
}
