const _ = require('lodash');

module.exports = function (model, query, filterBy) {
  var filters = model.filters;
  return _.transform(filterBy, function (result, value, key) {
    var filter = filters[key];
    if (key === 'id' && !filter) {
      filter = function (qb, value) {
        return qb.whereIn('id', value);
      };
    }
    return filter ? filter(result, value) : result;
  }, query);
};
