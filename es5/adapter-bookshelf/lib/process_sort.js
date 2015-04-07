'use strict';

var _ = require('lodash');

// TODO: investigate how to deal with express's query parser
// converting + into a space.
function isAscending(key) {
  return key[0] === '+' || key[0] === ' ';
}

module.exports = function (validFields, query, sortBy) {
  return _.chain(sortBy).filter(function (key) {
    var hasSortDir = key[0] === ' ' || key[0] === '+' || key[0] === '-';
    var isValidField = _.contains(validFields, key.substring(1));
    return hasSortDir && isValidField;
  }).reduce(function (result, key) {
    var column = key.substring(1);
    var dir = isAscending(key) ? 'ASC' : 'DESC';
    return column ? result.orderBy(column, dir) : result;
  }, query).value();
};