'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _validate = require('./lib/validate');

var _validate2 = _interopRequireWildcard(_validate);

var _handle = require('./lib/handle');

var _handle2 = _interopRequireWildcard(_handle);

/**
  Provides methods for generating request handling functions that can
  be used by any node http server.
*/

var Controller = (function () {

  /**
    The constructor.
     @constructs Controller
    @param {Object} opts - opts.format: An endpoints format adapter.
    @param {Object} opts - opts.store: An endpoints store adapter.
    @param {Object} opts - opts.model: A model compatible with the store adapter.
    @param {Object} opts - opts.validators: An array of validating methods.
    @param {Object} opts - opts.allowClientGeneratedIds: boolean indicating this
  */

  function Controller() {
    var opts = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Controller);

    if (!opts.format) {
      throw new Error('No format specified.');
    }
    if (!opts.store) {
      throw new Error('No store specified.');
    }
    if (!opts.model) {
      throw new Error('No model specified.');
    }
    this.config = _import2['default'].extend({
      validators: [],
      allowClientGeneratedIds: false,
      allowToManyFullReplacement: true
    }, opts);
  }

  Controller.extend = function extend() {
    var props = arguments[0] === undefined ? {} : arguments[0];

    return (function (_ref) {
      function Controller() {
        var opts = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Controller);

        _ref.call(this, _import2['default'].extend({}, props, opts));
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

  Controller.prototype.method = (function (_method) {
    function method(_x, _x2) {
      return _method.apply(this, arguments);
    }

    method.toString = function () {
      return _method.toString();
    };

    return method;
  })(function (method, opts) {
    var config = _import2['default'].extend({
      method: method,
      include: [],
      filter: {},
      fields: {},
      sort: [],
      schema: {} }, this.config, opts);
    var validationFailures = _validate2['default'](method, config);
    if (validationFailures.length) {
      throw new Error(validationFailures.join('\n'));
    }
    return _handle2['default'](config);
  });

  Controller.prototype.create = function create(opts) {
    return this.method('create', opts);
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

  Controller.prototype.destroy = function destroy(opts) {
    return this.method('destroy', opts);
  };

  _createClass(Controller, [{
    key: 'capabilities',
    get: function () {
      // TODO: include this.config?
      return {
        filters: this.store.filters(this.model),
        includes: this.store.allRelations(this.model) };
    }
  }]);

  return Controller;
})();

exports['default'] = Controller;
module.exports = exports['default'];