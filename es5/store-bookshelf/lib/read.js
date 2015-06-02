'use strict';

exports.__esModule = true;
exports['default'] = read;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _all_relations = require('./all_relations');

var _all_relations2 = _interopRequireDefault(_all_relations);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _columns = require('./columns');

var _columns2 = _interopRequireDefault(_columns);

/**
 * Retrieves a collection of models from the database.
 *
 * @param {Bookshelf.Model} model - a bookshelf model class
 * @param {Object} query - the output of Request#query
 * @param {Object} mode - the mode of the request (single/related/relation)
 * @return {Promise.Bookshelf.Collection} Models that match the request.
*/

function read(model) {
  var query = arguments[1] === undefined ? {} : arguments[1];
  var mode = arguments[2] === undefined ? 'read' : arguments[2];

  return (0, _columns2['default'])(model).then(function (modelColumns) {
    var fields = query.fields && query.fields[(0, _type2['default'])(model)];
    var relations = _lodash2['default'].intersection((0, _all_relations2['default'])(model), query.include || []);
    if (fields) {
      fields = _lodash2['default'].intersection(modelColumns, fields);
      // ensure we always select id as the spec requires this to be present
      if (!_lodash2['default'].contains(fields, 'id')) {
        fields.push('id');
      }
    }
    return model.collection().query(function (qb) {
      qb = processFilter(model, qb, query.filter);
      qb = processSort(model.columns, qb, query.sort);
    }).fetch({
      // adding this in the queryBuilder changes the qb, but fetch still
      // returns all columns
      columns: fields,
      withRelated: relations
    }).then(function (result) {
      // This is a lot of gross in order to pass this data into the
      // formatter later. Need to formalize this in some other way.
      result.mode = mode;
      result.relations = relations;
      result.singleResult = query.singleResult;
      result.baseType = query.baseType;
      result.baseId = query.baseId;
      result.baseRelation = query.baseRelation;
      return result;
    });
  });
}

function idFilter(qb, value) {
  return qb.whereIn('id', value);
}

function isAscending(key) {
  return key[0] === '+' || key[0] === ' ';
}

function processFilter(model, query, filterBy) {
  var filters = model.filters;
  return _lodash2['default'].transform(filterBy, function (result, value, key) {
    var filter = filters[key];
    if (key === 'id' && !filter) {
      filter = idFilter;
    }
    return filter ? filter.call(filters, result, value) : result;
  }, query);
}

function processSort(validFields, query, sortBy) {
  return _lodash2['default'].chain(sortBy).filter(function (key) {
    var hasSortDir = key[0] === ' ' || key[0] === '+' || key[0] === '-';
    var isValidField = _lodash2['default'].contains(validFields, key.substring(1));
    return hasSortDir && isValidField;
  }).reduce(function (result, key) {
    var column = key.substring(1);
    var dir = isAscending(key) ? 'ASC' : 'DESC';
    return column ? result.orderBy(column, dir) : result;
  }, query).value();
}
module.exports = exports['default'];