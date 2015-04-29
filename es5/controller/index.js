'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _validate = require('./lib/validate');

var _validate2 = _interopRequireDefault(_validate);

var _handle = require('./lib/handle');

var _handle2 = _interopRequireDefault(_handle);

/**
  Provides methods for generating request handling functions that can
  be used by any node http server.
*/

var Controller = (function () {

  /**
    The constructor.
     @constructs Controller
    @param {Object} opts - opts.adapter: An endpoints adapter
    @param {Object} opts - opts.model: A model compatible with the adapter.
    @param {Object} opts - opts.validators: An array of validating methods.
    @param {Object} opts - opts.allowClientGeneratedIds: boolean indicating this
  */

  function Controller() {
    var opts = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Controller);

    if (!opts.adapter) {
      throw new Error('No adapter specified.');
    }
    if (!opts.model) {
      throw new Error('No model specified.');
    }
    var config = this.config = _import2['default'].extend({
      validators: [],
      allowClientGeneratedIds: false,
      allowToManyFullReplacement: true
    }, opts);

    this._adapter = new config.adapter({
      model: config.model
    });
  }

  /**
    Used for generating CRUD (create, read, update, destroy) methods.
     @param {String} method - The name of the function to be created.
    @returns {Function} - function (req, res) { } (node http compatible request handler)
  */

  Controller.method = (function (_method) {
    function method(_x) {
      return _method.apply(this, arguments);
    }

    method.toString = function () {
      return _method.toString();
    };

    return method;
  })(function (method) {
    return function (opts) {
      var config = _import2['default'].extend({
        method: method,
        include: [],
        filter: {},
        fields: {},
        sort: [],
        schema: {} }, this.config, opts);
      var validationFailures = _validate2['default'](method, config, this._adapter);
      if (validationFailures.length) {
        throw new Error(validationFailures.join('\n'));
      }
      return _handle2['default'](config, this._adapter);
    };
  });

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

  _createClass(Controller, [{
    key: 'capabilities',
    get: function () {
      // TODO: include this.config?
      return {
        filters: this._adapter.filters(),
        includes: this._adapter.relations()
      };
    }
  }]);

  return Controller;
})();

/**
  Returns a request handling function customized to handle create requests.
*/
Controller.prototype.create = Controller.method('create');

/**
  Returns a request handling function customized to handle read requests.
*/
Controller.prototype.read = Controller.method('read');

/**
  Returns a request handling function customized to handle update requests.
*/
Controller.prototype.update = Controller.method('update');

/**
  Returns a request handling function customized to handle destroy requests.
*/
Controller.prototype.destroy = Controller.method('destroy');

exports['default'] = Controller;
module.exports = exports['default'];