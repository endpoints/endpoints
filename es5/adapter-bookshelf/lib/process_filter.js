'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var idFilter = function idFilter(qb, value) {
  return qb.whereIn('id', value);
};

exports['default'] = function (model, query, filterBy) {
  var filters = model.filters;
  return _import2['default'].transform(filterBy, function (result, value, key) {
    var filter = filters[key];
    if (key === 'id' && !filter) {
      filter = idFilter;
    }
    return filter ? filter.call(filters, result, value) : result;
  }, query);
};

module.exports = exports['default'];