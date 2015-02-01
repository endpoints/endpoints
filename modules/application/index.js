const path = require('path');
const silentRequire = require('./lib/silent_require');

function Application (opts) {
  this.resources = {};
  if (!opts.routeBuilder) {
    throw new Error('No route builder specified.');
  }
  this.routeBuilder = opts.routeBuilder;
  this._mountedResources = [];
}

Application.prototype._parseResource = function (input) {
  var resource;
  if (typeof input === 'string') {
    input = path.dirname(input);
    resource = {
      name: path.resolve(input).split('/').pop(),
      routes: require(path.resolve(input, 'routes')),
      controller: silentRequire(path.resolve(input, 'controller'))
    };
  } else {
    resource = input;
  }
  if (!resource.routes) {
    throw new Error('Unable to find routes for resource '+input);
  }
  return resource;
};

Application.prototype.resource = function (name) {
  var resource = this.resources[name];
  if (!resource) {
    throw new Error('Resource '+name+' has not been registered.');
  }
  return resource;
};

Application.prototype.register = function (input) {
  if (Array.isArray(input)) {
    input.forEach(this.register.bind(this));
  } else {
    var resource = this._parseResource(input);
    this.resources[resource.name] = resource;
  }
  return this;
};

Application.prototype.endpoint = function (resourceName, prefix) {
  var resource = this.resource(resourceName);
  prefix = (prefix ? prefix : '')+'/'+resourceName;
  if (!resource) {
    throw new Error('Unable to build endpoint for '+resourceName);
  }
  this._mountedResources.push({
    name: resourceName,
    url: prefix||'',
    resource: resource
  });
  return this.routeBuilder(resource.routes, prefix);
};

Application.prototype.manifest = function () {
  return this._mountedResources.reduce(function (result, endpoint) {
    var resource = endpoint.resource;
    var controller = resource.controller;
    var source = controller.source;
    result.push({
      name: resource.name,
      filters: (source && Object.keys(source.filters()))||[],
      includes: (source && source.relations())||[],
      url: endpoint.url
    });
    return result;
  }, []);
};

Application.prototype.index = function () {
  return this.manifest().reduce(function (result, resource) {
    var definition = resource.url;
    var includes = resource.includes;
    var filters = resource.filters;
    if (includes.length) {
      definition += '?include={'+includes.join(',')+'}';
    }
    if (filters.length) {
      definition += definition === resource.url ? '?' : '&';
      definition += '{'+filters.join(',')+'}';
    }
    result[resource.name] = definition;
    return result;
  }, {});
};

module.exports = Application;
