'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

// TODO: investigate how to deal with express's query parser
// converting + into a space.
function isAscending(key) {
  return key[0] === '+' || key[0] === ' ';
}

exports['default'] = function (validFields, query, sortBy) {
  return _import2['default'].chain(sortBy).filter(function (key) {
    var hasSortDir = key[0] === ' ' || key[0] === '+' || key[0] === '-';
    var isValidField = _import2['default'].contains(validFields, key.substring(1));
    return hasSortDir && isValidField;
  }).reduce(function (result, key) {
    var column = key.substring(1);
    var dir = isAscending(key) ? 'ASC' : 'DESC';
    return column ? result.orderBy(column, dir) : result;
  }, query).value();
};

module.exports = exports['default'];