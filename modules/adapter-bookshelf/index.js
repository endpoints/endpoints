const _ = require('lodash');

const baseMethods = require('./lib/base_methods');
const processFilter = require('./lib/process_filter');
const processSort = require('./lib/process_sort');
const destructureRequest = require('./lib/destructure_request_data');

// FIXME: decide if this responsibility lives in the adapter or
// in the formatter. i think adapter? this would mean a wholesale
// refactoring of the jsonapi formatter to work with adapters
// rather than bookshelf models. that might make a lot of sense.
const relate = require('../formatter-jsonapi/lib/relate');

/*
  Creates an adapter that allows endpoints to interact with a Bookshelf model.

  @constructor
  @param {Object} opts - opts.model: a bookshelf model.
*/
function Adapter (opts) {
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

/*
  An array of filters available on the underlying model. This controls
  which filters will be recognized by a request.

  For example, `GET /authors?filter[name]=John` would only filter by name
  if 'name' was included in the array returned by this function.

  @returns {Array} An array of object ids.
*/
Adapter.prototype.filters = function () {
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

/*
  Provides an array of valid fields on the underlying model.

  @todo Remove this?

  @returns {Array} An array of strings representing valid fields on the model.
 */
Adapter.prototype.fields = function() {
  return this.model.fields || [];
};

/*
  Provides an array of valid relations on the underlying model. This controls
  which relations can be included in a request.

  For example, `GET /authors/1?include=books` would only include related
  books if `books` was included in the array returned by this function.

  @returns {Array} An array containing relations on the model.
 */
Adapter.prototype.relations = function () {
  return this.model.relations || [];
};

/*
  Provides the type name of the underlying model. This controls the
  value of the `type` property in responses.

  @returns {String}
*/
Adapter.prototype.typeName = function () {
  return this.model.typeName;
};


/*
  Returns the models related to a given model. This allows requests
  such as `GET /authors/1/books?filter[published_after]=2015-01-01`.

  This is currently extremely inefficient.  Here's why:

  If making a request for all books related to a given author, it is difficult
  to add additional constraints (such as limiting those to books published after
  a given date). In order to make this work, the current approach is to get all
  valid book IDs related to the author, and then query books directly, adding
  any additional filters. This is incredibly inefficient and will be resolved
  in a future version of Bookshelf.

  @param {Object}
    opts - opts.filter: Assigned to relevant id(s) as filters are applied.
  @param {String}
    relation - A dot notated relation to look up for the provided model.
  @param {Bookshelf.Model} model

  @returns {Promise(Bookshelf.Model|Bookshelf.Collection)} related models.
*/
Adapter.prototype.related = function (opts, relation, model) {
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
  var relatedAdapter = new this.constructor({
    model: relatedModel
  });
  return relatedAdapter.read(opts);
};

/*
  A convenience method to find a single model by id.

  @param {int} id - the id of the model
  @param {Array} relations - the relations to fetch with the model

  @returns {Promise(Bookshelf.Model)} A model and its related models.
*/
Adapter.prototype.byId = function (id, relations) {
  relations = relations || [];
  return this.model.collection().query(function (qb) {
    return qb.where({id:id});
  }).fetchOne({
    withRelated: relations
  });
};

/*
  Creates an object in the database. Returns an instance of the new object.

  @param {String} method - The name of the method on the model constructor to use for creation.
  @param {Object} params - The attributes to use for the new model.

  @returns {Promise(Bookshelf.Model)} A new model.
*/
Adapter.prototype.create = function (method, params) {
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

/*
  Retrieves a collection of models from the database.

  @param {Object} opts - the output of Request#query

  @returns {Promise(Bookshelf.Collection)} Models that match the provided opts.
*/
Adapter.prototype.read = function (opts) {
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

/*
  Updates a provided model using the provided method.

  @param {Bookshelf.Model} model
  @param {String} method - The method on the model instance to use when updating.
  @param {Object} params - An object containing the params from the request.

  @returns {Promise(Bookshelf.Model)} The updated model.
*/
Adapter.prototype.update = function (model, method, params) {
  if (!method) {
    throw new Error('No method provided to update or delete with.');
  }
  return destructureRequest(model, params).then(function(destructured) {
    return model[method](destructured.data, destructured.toManyRels, model.toJSON({shallow: true}));
  });
};

/*
  Deletes a model. Same implementation as update.

  @param {Bookshelf.Model} model
  @param {String} method - The method on the model instance to use when updating.
  @param {Object} params - An object containing the params from the request.

  @returns {Promise.Bookshelf.Model} The deleted model.
*/
Adapter.prototype.destroy = Adapter.prototype.update;

module.exports = Adapter;
