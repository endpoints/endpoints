'use strict';

var _ = require('lodash');

var idFilter = function idFilter(qb, value) {
  return qb.whereIn('id', value);
};

module.exports = function (model, query, filterBy) {
  var filters = model.filters;
  return _.transform(filterBy, function (result, value, key) {
    var filter = filters[key];
    if (key === 'id' && !filter) {
      filter = idFilter;
    }
    return filter ? filter.call(filters, result, value) : result;
  }, query);
};