const _ = require('lodash');

const baseMethods = require('./lib/base_methods');
const processFilter = require('./lib/process_filter');
const processSort = require('./lib/process_sort');
const destructureRequest = require('./lib/destructure_request_data');

// FIXME: decide if this responsibility lives in the source or
// in the formatter. i think source? this would mean a wholesale
// refactoring of the jsonapi formatter to work with sources
// rather than bookshelf models. that might make a lot of sense.
const relate = require('../formatter-jsonapi/lib/relate');

/**
 * Creates a Source object; a wrapper that allows endpoints to interact
 * with a Bookshelf model, which is taken as a single
 * parameter.
 *
 * @constructor
 * @param {Object} opts - opts.model: The Bookshelf model.
 */
function Source (opts) {
  if (!opts) {
    opts = {};
  }
  var model = opts.model;
  if (!model) {
    throw new Error('No bookshelf model specified.');
  }
  this.model = model;

  // add missing methods on the model if needed. eventually something
  // like this should exist in bookshelf or another higher order library
  // natively.
  if (!model.create) {
    baseMethods.addCreate(this);
  }
  if (!model.prototype.update) {
    baseMethods.addUpdate(this);
  }
}

/**
 * A function that returns an array of object ids resultant
 * from the application of a filter(s).
 *
 * @returns {Array} An array of object ids.
 */

Source.prototype.filters = function () {
  var filters = Object.keys(this.model.filters || {});
  // TODO: remove this and have the id filter be present by
  // default on all bookshelf models. the alternative to this
  // is putting the id filter in every model as boilerplate
  // or waiting until the next version of bookshelf, where
  // something like this can be added by default.
  if (filters.indexOf('id') === -1) {
    filters.push('id');
  }
  return filters;
};

/**
 * A function that returns the fields on the model.
 *
 * @returns {Array} An array of strings of fields on the model.
 */
Source.prototype.fields = function() {
  return this.model.fields || [];
};

/**
 * A function that returns the relations on the model.
 *
 * @returns {Object} An object containing the model's relations.
 */
Source.prototype.relations = function () {
  return this.model.relations || [];
};

/**
 * A function that returns the typeName of the model.
 *
 * @returns {String}
 */
Source.prototype.typeName = function () {
  return this.model.typeName;
};

// this method should return the models related to a given model.
// this is to allow requests like /authors/1/books?filter[thing]=x
// due to deficiencies in bookshelf, we basically wind up querying
// for this same data twice because we can't build the correct
// query up front.
// this will be resolved in a future version of bookshelf

/**
 * A function that returns the models related to a given model.
 * This allows requests such as /authors/1/books?filter[thing]=x.
 * Currently this functions queries for the same data twice, due
 * to deficiences in bookshelf, which don't allow the correct
 * query to be built up front.
 *
 * This should be resolved in new version of bookshelf.
 *
 * @example
 * If one requests all the books related to an author,
 * but only the ones with ids 2 and 4, one cannot immediately
 * construct that query with bookshelf. In order to accomplish this,
 * one must first request _all_ related books, and then request
 * the books with the ids 2 and 4. This results in 2 full queries of
 * all related books.
 *
 * @param {Object} opts - opts.filter: Assigned to relevant id(s) as filters are applied.
 * @param {String} relation - The dot notated set of requests.
 * @param {Bookshelf.Model} model - The related model.
 *
 * @returns {Array} An array of related object(s).
 */
Source.prototype.related = function (opts, relation, model) {
  var related = relate(model, relation);
  var relatedModel, relatedIds;
  if (related.length) {
    relatedModel = related.model;
    relatedIds = related.map(function (m) { return m.id; });
  } else {
    relatedModel = related.constructor;
    relatedIds = related.id;
  }
  opts.filter.id = opts.filter.id ? opts.filter.id : relatedIds;
  // this is some terrible bullshit right here
  var relatedSource = new this.constructor({
    model: relatedModel
  });
  return relatedSource.read(opts);
};

/**
 * A convenience method to find a single object by id.
 *
 * @param {int} id - Id by which
 * @param {Array} relations - Holds ids of all related objects.
 *
 * @returns {Promise.Object} A single object with the requested id.
 */
// not in love with this new method signature, it differs from the rest a lot.
Source.prototype.byId = function (id, relations) {
  relations = relations || [];
  return this.model.collection().query(function (qb) {
    return qb.where({id:id});
  }).fetchOne({
    withRelated: relations
  });
};

/**
 * Creates an object in the database. Returns an instance of the new object.
 *
 * @param {Function} method - If not present, throws an error.
 * @param {Object} params - If not present, defaults to an empty object.
 *
 * @returns {Bookshelf.Model} An instance of the new object.
 */
Source.prototype.create = function (method, params) {
  if (!method) {
    throw new Error('No method provided to create with.');
  }
  if (!params) {
    params = {};
  }
  var self = this;
  return destructureRequest(this.model.forge(), params).then(function(destructured) {
    return self.model[method](destructured.data, destructured.toManyRels);
  });
};

/**
 * Retrieves an object or collection of objects from the database. Returns
 * retrieved data.
 *
 * @param {Object} opts - Contains information from the request object
 *
 * @returns {Promise.Bookshelf.Collection} The requested object(s).
 */
Source.prototype.read = function (opts) {
  if (!opts) {
    opts = {};
  }
  var self = this;
  var model = this.model;

  return model.collection().query(function (qb) {
    qb = processFilter(model, qb, opts.filter);
    qb = processSort(self, qb, opts.sort);
  }).fetch({
    // adding this in the queryBuilder changes the qb, but fetch still
    // returns all columns
    columns: opts.fields ? opts.fields[this.typeName()] : undefined,
    withRelated: _.intersection(this.relations(), opts.include || [])
  }).then(function (result) {
    result.relations = opts.include;
    result.singleResult = opts.filter && opts.filter.id && !Array.isArray(opts.filter.id);
    return result;
  });
};

/**
 * Updates the attributes of an element.
 *
 * @param {Bookshelf.Model} model - The Bookshelf Model
 * @param {String} method - The name of the method.
 * @param {Object} params - An object containing the params from the request.
 *
 * @returns {Promise.Bookshelf.Model} The updated object.
 */
Source.prototype.update = function (model, method, params) {
  if (!method) {
    throw new Error('No method provided to update or delete with.');
  }
  return destructureRequest(model, params).then(function(destructured) {
    return model[method](destructured.data, destructured.toManyRels, model.toJSON({shallow: true}));
  });
};

/**
 * Deletes an element. Same implementation as update.
 *
 * @param {Bookshelf.Model} model - The Bookshelf Model
 * @param {String} method - The name of the method.
 * @param {Object} params - An object containing the params from the request.
 *
 * @returns {Promise.Bookshelf.Model} The deleted object.
 */
Source.prototype.destroy = Source.prototype.update;

module.exports = Source;
