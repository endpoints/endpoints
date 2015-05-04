'use strict';

exports.__esModule = true;

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _parseOptions = require('./lib/parse_options');

var _parseOptions2 = _interopRequireDefault(_parseOptions);

var _parseResource = require('./lib/parse_resource');

var _parseResource2 = _interopRequireDefault(_parseResource);

var Application = (function () {
  function Application(opts) {
    _classCallCheck(this, Application);

    this._resources = {};
    this._endpoints = [];
    _import2['default'].extend(this, _parseOptions2['default'](opts));
  }

  Application.prototype.resource = function resource(name) {
    var resource = this._resources[name];
    if (!resource) {
      throw new Error('Resource "' + name + '" has not been registered.');
    }
    return resource;
  };

  Application.prototype.register = function register(input) {
    if (Array.isArray(input)) {
      input.forEach(this.register.bind(this));
      return this;
    }
    var resource = _parseResource2['default'](input, this.searchPaths);
    var resourceName = resource.name;
    if (this._resources[resourceName]) {
      throw new Error('Resource "' + resourceName + '" registered twice');
    }
    this._resources[resourceName] = resource;
    return this;
  };

  Application.prototype.endpoint = function endpoint(resourceName) {
    var resource = this.resource(resourceName);
    var routes = resource.routes.map;
    var url = resource.controller.url;
    var output = this.routeBuilder(routes, url);
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
      result.push(_import2['default'].extend({
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
        definition += 'filter[{' + filters.join(',') + '}]';
      }
      result[resource.name] = definition;
      return result;
    }, {});
  };

  return Application;
})();

exports['default'] = Application;
module.exports = exports['default'];