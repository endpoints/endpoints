const _ = require('lodash');

const idFilter = function (qb, value) {
  return qb.whereIn('id', value);
};

module.exports = function (model, query, filterBy) {
  var filters = model.filters;
  return _.transform(filterBy, function (result, value, key) {
    var filter = filters[key];
    value = String(value).split(',');
    if (key === 'id' && !filter) {
      filter = idFilter;
    }
    return filter ? filter.call(filters, result, value) : result;
  }, query);
};
