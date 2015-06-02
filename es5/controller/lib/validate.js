'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _model_has = require('./model_has');

var _model_has2 = _interopRequireDefault(_model_has);

module.exports = function (method, config) {
  var model = config.model;
  var store = config.store;

  return _lodash2['default'].compose(_lodash2['default'].flatten, _lodash2['default'].compact)([(0, _model_has2['default'])(store.allRelations(model), config.include, 'relations'), (0, _model_has2['default'])(Object.keys(store.filters(model)), Object.keys(config.filter), 'filters')]);
};