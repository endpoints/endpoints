const _ = require('lodash');

// TODO: investigate how to deal with express's query parser
// converting + into a space.
function isAscending (key) {
  return key[0] === '+' || key[0] === ' ';
}

module.exports = function (model, query, sortBy) {
  var validFields = model.fields;
  return _.chain(sortBy).filter(function (key) {
    return _.contains(validFields, key.substring(1));
  }).reduce(function (result, key) {
    var column = key.substring(1);
    var dir =  isAscending(key) ? 'ASC' : 'DESC';
    return column ? result.orderBy(column, dir) : result;
  }, query).value();
};
