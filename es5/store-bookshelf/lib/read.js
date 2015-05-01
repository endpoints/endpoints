'use strict';

exports.__esModule = true;

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

/**
 * Retrieves a collection of models from the database.
 *
 * @param {Bookshelf.Model} model - a bookshelf model class
 * @param {Object} query - the output of Request#query
 * @param {Object} mode - the mode of the request (single/related/relation)
 * @return {Promise.Bookshelf.Collection} Models that match the request.
*/
exports['default'] = read;

var _bPromise = require('bluebird');

var _bPromise2 = _interopRequireDefault(_bPromise);

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _allRelations = require('./all_relations');

var _allRelations2 = _interopRequireDefault(_allRelations);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

function read(model) {
  var query = arguments[1] === undefined ? {} : arguments[1];
  var mode = arguments[2] === undefined ? 'read' : arguments[2];

  var ready = _bPromise2['default'].resolve();

  // populate the field listing for a table so we know which columns
  // we can use for sparse fieldsets.
  if (!model.columns) {
    ready = model.query().columnInfo().then(function (info) {
      model.columns = Object.keys(info);
    });
  }

  return ready.then(function () {
    var fields = query.fields && query.fields[_type2['default'](model)];
    var relations = _import2['default'].intersection(_allRelations2['default'](model), query.include || []);
    // this has to be done here because we can't statically analyze
    // the columns on a table yet.
    if (fields) {
      fields = _import2['default'].intersection(model.columns, fields);
      // ensure we always select id as the spec requires this to be present
      if (!_import2['default'].contains(fields, 'id')) {
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
  return _import2['default'].transform(filterBy, function (result, value, key) {
    var filter = filters[key];
    if (key === 'id' && !filter) {
      filter = idFilter;
    }
    return filter ? filter.call(filters, result, value) : result;
  }, query);
}

function processSort(validFields, query, sortBy) {
  return _import2['default'].chain(sortBy).filter(function (key) {
    var hasSortDir = key[0] === ' ' || key[0] === '+' || key[0] === '-';
    var isValidField = _import2['default'].contains(validFields, key.substring(1));
    return hasSortDir && isValidField;
  }).reduce(function (result, key) {
    var column = key.substring(1);
    var dir = isAscending(key) ? 'ASC' : 'DESC';
    return column ? result.orderBy(column, dir) : result;
  }, query).value();
}
module.exports = exports['default'];