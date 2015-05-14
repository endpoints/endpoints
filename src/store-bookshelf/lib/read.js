import _ from 'lodash';

import allRelations from './all_relations';
import type from './type';
import columns from './columns';

/**
 * Retrieves a collection of models from the database.
 *
 * @param {Bookshelf.Model} model - a bookshelf model class
 * @param {Object} query - the output of Request#query
 * @param {Object} mode - the mode of the request (single/related/relation)
 * @return {Promise.Bookshelf.Collection} Models that match the request.
*/
export default function read (model, query={}, mode='read') {
  return columns(model).then(function (modelColumns) {
    var fields = query.fields && query.fields[type(model)];
    var relations = _.intersection(allRelations(model), query.include || []);
    if (fields) {
      fields = _.intersection(modelColumns, fields);
      // ensure we always select id as the spec requires this to be present
      if (!_.contains(fields, 'id')) {
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

function idFilter (qb, value) {
  return qb.whereIn('id', value);
}

function isAscending (key) {
  return key[0] === '+' || key[0] === ' ';
}

function processFilter (model, query, filterBy) {
  var filters = model.filters;
  return _.transform(filterBy, function (result, value, key) {
    var filter = filters[key];
    if (key === 'id' && !filter) {
      filter = idFilter;
    }
    return filter ? filter.call(filters, result, value) : result;
  }, query);
}

function processSort (validFields, query, sortBy) {
  return _.chain(sortBy).filter(function (key) {
    var hasSortDir = key[0] === ' ' || key[0] === '+' || key[0] === '-';
    var isValidField = _.contains(validFields, key.substring(1));
    return hasSortDir && isValidField;
  }).reduce(function (result, key) {
    var column = key.substring(1);
    var dir =  isAscending(key) ? 'ASC' : 'DESC';
    return column ? result.orderBy(column, dir) : result;
  }, query).value();
}
