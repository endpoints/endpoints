import _ from 'lodash';

import parseOptions from './lib/parse_options';
import parseResource from './lib/parse_resource';

class Application {

  constructor (opts) {
    this._resources = {};
    this._endpoints = [];
    _.extend(this, parseOptions(opts));
  }

  resource (name) {
    const resource = this._resources[name];
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
    const resource = parseResource(input, this.searchPaths);
    const resourceName = resource.name;
    if (this._resources[resourceName]) {
      throw new Error(`Resource "${resourceName}" registered twice`);
    }
    this._resources[resourceName] = resource;
    return this;
  }

  endpoint (resourceName) {
    const resource = this.resource(resourceName);
    const routes = resource.routes.map;
    const url = resource.controller.url;
    const output = this.routeBuilder(routes, url);
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
      const resource = endpoint.resource;
      const capabilities = resource.controller.capabilities;
      result.push(_.extend({
        name: resource.name,
        url: endpoint.url
      }, capabilities));
      return result;
    }, []);
  }

  index () {
    return this.manifest().reduce(function (result, resource) {
      let definition = resource.url;
      const includes = resource.includes || [];
      const filters = resource.filters || {};
      if (includes.length) {
        definition += `?include={${includes.join(',')}}`;
      }
      if (filters.length) {
        definition += definition === resource.url ? '?' : '&';
        definition += `filter[{${filters.join(',')}}]`;
      }
      result[resource.name] = definition;
      return result;
    }, {});
  }

}

export default Application;
