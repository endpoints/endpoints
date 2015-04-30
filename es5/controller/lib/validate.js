'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _modelHas = require('./model_has');

var _modelHas2 = _interopRequireWildcard(_modelHas);

module.exports = function (method, config) {
  var model = config.model;
  var store = config.store;

  return _import2['default'].compose(_import2['default'].flatten, _import2['default'].compact)([_modelHas2['default'](store.allRelations(model), config.include, 'relations'), _modelHas2['default'](Object.keys(store.filters(model)), Object.keys(config.filter), 'filters')
  /*
      // this is crap
      (method === 'read') ? null :
        modelHas(
          method === 'create' ? model : model.prototype,
          config.method,
          'method'
        )
  */
  ]);
};