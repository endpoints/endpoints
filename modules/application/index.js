const _ = require('lodash');

const parseOptions = require('./lib/parse_options');
const parseResource = require('./lib/parse_resource');
const slashWrap = require('./lib/slash_wrap');

function Application (opts) {
  this._resources = {};
  this._endpoints = [];
  _.extend(this, parseOptions(opts));
}

Application.prototype.resource = function (name) {
  var resource = this._resources[name];
  if (!resource) {
    throw new Error('Resource ' + name + ' has not been registered.');
  }
  return resource;
};

Application.prototype.register = function (input) {
  if (Array.isArray(input)) {
    input.forEach(this.register.bind(this));
    return this;
  }

  var resource = parseResource(input, this.searchPaths);
  var resourceName = resource.name;
  if (this._resources[resourceName]) {
    throw new Error(
      'Resource "' + resourceName + '" has already been registered.'
    );
  }
  this._resources[resourceName] = resource;
  return this;
};

Application.prototype.endpoint = function (resourceName, prefix) {
  var resource = this.resource(resourceName);
  if (!resource) {
    throw new Error('Unable to build endpoint for ' + resourceName);
  }
  var url = slashWrap(prefix) + resourceName;
  var output = this.routeBuilder(resource.routes, url);
  this._endpoints.push({
    name: resourceName,
    url: url,
    router: output,
    resource: resource
  });
  return output;
};

Application.prototype.manifest = function () {
  return this._endpoints.reduce(function (result, endpoint) {
    var resource = endpoint.resource;
    var controller = resource.controller;
    var source = controller.source;
    var filters = [];
    var includes = [];
    if (source) {
      filters = source.filters();
      includes = source.relations();
    }
    result.push({
      name: resource.name,
      filters: filters,
      includes: includes,
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
      definition += '?include={' + includes.join(',') + '}';
    }
    if (filters.length) {
      definition += definition === resource.url ? '?' : '&';
      definition += '{' + filters.join(',') + '}';
    }
    result[resource.name] = definition;
    return result;
  }, {});
};

module.exports = Application;
