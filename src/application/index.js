const _ = require('lodash');

const parseOptions = require('./lib/parse_options');
const parseResource = require('./lib/parse_resource');
const slashWrap = require('./lib/slash_wrap');

class Application {

  constructor (opts) {
    this._resources = {};
    this._endpoints = [];
    _.extend(this, parseOptions(opts));
  }

  resource (name) {
    var resource = this._resources[name];
    if (!resource) {
      throw new Error(`Resource "${name}" has not been registered.`);
    }
    return resource;
  }

  register (input) {
    if (Array.isArray(input)) {
      input.forEach(this.register.bind(this));
      return this;
    }

    var resource = parseResource(input, this.searchPaths);
    var resourceName = resource.name;
    if (this._resources[resourceName]) {
      throw new Error(`Resource "${resourceName}" registered twice`);
    }
    this._resources[resourceName] = resource;
    return this;
  }

  endpoint (resourceName, prefix) {
    var resource = this.resource(resourceName);
    var url = slashWrap(prefix) + resourceName;
    var output = this.routeBuilder(resource.routes, url);
    this._endpoints.push({
      name: resourceName,
      url: url,
      router: output,
      resource: resource
    });
    return output;
  }

  manifest () {
    return this._endpoints.reduce(function (result, endpoint) {
      var resource = endpoint.resource;
      var capabilities = resource.controller.capabilities;
      result.push(_.extend({
        name: resource.name,
        url: endpoint.url
      }, capabilities));
      return result;
    }, []);
  }

  index () {
    return this.manifest().reduce(function (result, resource) {
      var definition = resource.url;
      var includes = resource.includes || [];
      var filters = resource.filters || {};
      if (includes.length) {
        definition += `?include={${includes.join(',')}}`;
      }
      if (filters.length) {
        definition += definition === resource.url ? '?' : '&';
        definition += `{${filters.join(',')}}`;
      }
      result[resource.name] = definition;
      return result;
    }, {});
  }

}

module.exports = Application;
