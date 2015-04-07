'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _ = require('lodash');

var parseOptions = require('./lib/parse_options');
var parseResource = require('./lib/parse_resource');
var slashWrap = require('./lib/slash_wrap');

var Application = (function () {
  function Application(opts) {
    _classCallCheck(this, Application);

    this._resources = {};
    this._endpoints = [];
    _.extend(this, parseOptions(opts));
  }

  Application.prototype.resource = (function (_resource) {
    function resource(_x) {
      return _resource.apply(this, arguments);
    }

    resource.toString = function () {
      return resource.toString();
    };

    return resource;
  })(function (name) {
    var resource = this._resources[name];
    if (!resource) {
      throw new Error('Resource "' + name + '" has not been registered.');
    }
    return resource;
  });

  Application.prototype.register = function register(input) {
    if (Array.isArray(input)) {
      input.forEach(this.register.bind(this));
      return this;
    }

    var resource = parseResource(input, this.searchPaths);
    var resourceName = resource.name;
    if (this._resources[resourceName]) {
      throw new Error('Resource "' + resourceName + '" registered twice');
    }
    this._resources[resourceName] = resource;
    return this;
  };

  Application.prototype.endpoint = function endpoint(resourceName, prefix) {
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
  };

  Application.prototype.manifest = function manifest() {
    return this._endpoints.reduce(function (result, endpoint) {
      var resource = endpoint.resource;
      var capabilities = resource.controller.capabilities;
      result.push(_.extend({
        name: resource.name,
        url: endpoint.url
      }, capabilities));
      return result;
    }, []);
  };

  Application.prototype.index = function index() {
    return this.manifest().reduce(function (result, resource) {
      var definition = resource.url;
      var includes = resource.includes || [];
      var filters = resource.filters || {};
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

  return Application;
})();

module.exports = Application;