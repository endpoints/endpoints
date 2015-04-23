import _ from 'lodash';

const idFilter = function (qb, value) {
  return qb.whereIn('id', value);
};

export default function (model, query, filterBy) {
  var filters = model.filters;
  return _.transform(filterBy, function (result, value, key) {
    var filter = filters[key];
    if (key === 'id' && !filter) {
      filter = idFilter;
    }
    return filter ? filter.call(filters, result, value) : result;
  }, query);
}
