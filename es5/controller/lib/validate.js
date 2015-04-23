'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _adapterHas = require('./adapter_has');

var _adapterHas2 = _interopRequireWildcard(_adapterHas);

exports['default'] = function (method, config, adapter) {
  return _import2['default'].compose(_import2['default'].flatten, _import2['default'].compact)([_adapterHas2['default'](adapter.relations(), config.include, 'relations'), _adapterHas2['default'](adapter.filters(), Object.keys(config.filter), 'filters'),
  // this is crap
  method === 'read' ? null : _adapterHas2['default'](method === 'create' ? adapter.model : adapter.model.prototype, config.method, 'method')]);
};

module.exports = exports['default'];