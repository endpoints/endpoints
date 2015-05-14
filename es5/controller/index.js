'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _libValidate = require('./lib/validate');

var _libValidate2 = _interopRequireDefault(_libValidate);

var _libHandle = require('./lib/handle');

var _libHandle2 = _interopRequireDefault(_libHandle);

var _libSingle_slash_join = require('./lib/single_slash_join');

var _libSingle_slash_join2 = _interopRequireDefault(_libSingle_slash_join);

/**
  Provides methods for generating request handling functions that can
  be used by any node http server.
*/

var Controller = (function () {

  /**
    The constructor.
     @constructs Controller
    @param {Object} config - config.format: An endpoints format adapter.
    @param {Object} config - config.store: An endpoints store adapter.
    @param {Object} config - config.baseUrl: A base url for link generation.
    @param {Object} config - config.basePath: A base path for link generation.
    @param {Object} config - config.model: A model compatible with the store adapter.
    @param {Object} config - config.validators: An array of validating methods.
    @param {Object} config - opts.allowClientGeneratedIds: boolean indicating this
  */

  function Controller() {
    var config = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Controller);

    if (!config.format) {
      throw new Error('No format specified.');
    }
    if (!config.store) {
      throw new Error('No store specified.');
    }
    if (!config.model) {
      throw new Error('No model specified.');
    }
    if (!config.baseUrl) {
      throw new Error('No baseUrl specified for URL generation.');
    }
    if (!config.basePath) {
      throw new Error('No basePath specified for URL generation.');
    }
    this.config = _lodash2['default'].extend({
      validators: [],
      allowClientGeneratedIds: false,
      allowToManyFullReplacement: true }, config);
  }

  Controller.extend = function extend() {
    var props = arguments[0] === undefined ? {} : arguments[0];

    return (function (_ref) {
      function Controller() {
        var opts = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Controller);

        _ref.call(this, _lodash2['default'].extend({}, props, opts));
      }

      _inherits(Controller, _ref);

      return Controller;
    })(this);
  };

  /**
    Used for generating CRUD methods.
     @param {String} method - The name of the function to be created.
    @param {String} opts - The name of the function to be created.
    @returns {Function} - function (req, res) { } (node http compatible request handler)
  */

  Controller.prototype.method = function method(method, opts) {
    var config = _lodash2['default'].extend({
      method: method,
      include: [],
      filter: {},
      fields: {},
      sort: [],
      schema: {} }, this.config, opts);
    var validationFailures = _libValidate2['default'](method, config);
    if (validationFailures.length) {
      throw new Error(validationFailures.join('\n'));
    }
    // TODO: fix this gross passing of the url
    return _libHandle2['default'](config, this.url);
  };

  Controller.prototype.create = function create(opts) {
    return this.method('create', opts);
  };

  Controller.prototype.createRelation = function createRelation(opts) {
    return this.method('createRelation', opts);
  };

  Controller.prototype.read = function read(opts) {
    return this.method('read', opts);
  };

  Controller.prototype.readRelated = function readRelated(opts) {
    return this.method('readRelated', opts);
  };

  Controller.prototype.readRelation = function readRelation(opts) {
    return this.method('readRelation', opts);
  };

  Controller.prototype.update = function update(opts) {
    return this.method('update', opts);
  };

  Controller.prototype.updateRelation = function updateRelation(opts) {
    return this.method('updateRelation', opts);
  };

  Controller.prototype.destroy = function destroy(opts) {
    return this.method('destroy', opts);
  };

  Controller.prototype.destroyRelation = function destroyRelation(opts) {
    return this.method('destroyRelation', opts);
  };

  _createClass(Controller, [{
    key: 'capabilities',
    get: function () {
      var _config = this.config;
      var store = _config.store;
      var model = _config.model;

      // TODO: include this.config?
      return {
        filters: Object.keys(store.filters(model)),
        includes: store.allRelations(model) };
    }
  }, {
    key: 'baseUrl',
    get: function () {
      return this.config.baseUrl;
    }
  }, {
    key: 'basePath',
    get: function () {
      return this.config.basePath;
    }
  }, {
    key: 'url',
    get: function () {
      return _libSingle_slash_join2['default']([this.baseUrl, this.basePath]);
    }
  }]);

  return Controller;
})();

exports['default'] = Controller;
module.exports = exports['default'];