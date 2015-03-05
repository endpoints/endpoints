const _ = require('lodash');

const baseMethods = require('./lib/base_methods');
const processFilter = require('./lib/process_filter');
const processSort = require('./lib/process_sort');
const destructureRequest = require('./lib/destructure_request_data');

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

Source.prototype.fields = function() {
  return this.model.fields || [];
};

Source.prototype.relations = function () {
  return this.model.relations || [];
};

Source.prototype.typeName = function () {
  return this.model.typeName;
};

// not in love with this new method signature, it differs from the rest a lot.
Source.prototype.byId = function (id, relations) {
  relations = relations || [];
  return this.model.collection().query(function (qb) {
    return qb.where({id:id});
  }).fetchOne({
    withRelated: relations
  });
};

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

Source.prototype.read = function (opts) {
  if (!opts) {
    opts = {};
  }
  var self = this;
  var model = self.model;
  return model.collection().query(function (qb) {
    qb = processFilter(model, qb, opts.filter);
    qb = processSort(self, qb, opts.sort);
  }).fetch({

    // adding this in the queryBuilder changes the qb, but fetch still
    // returns all columns
    columns: opts.fields ? opts.fields[self.typeName()] : undefined,
    withRelated: _.intersection(this.relations(), opts.include || [])
  }).then(function (result) {
    result.sourceOpts = opts;
    return result;
  });
};

Source.prototype.update =
Source.prototype.destroy = function (model, method, params) {
  if (!method) {
    throw new Error('No method provided to update or delete with.');
  }
  return destructureRequest(model, params).then(function(destructured) {
    return model[method](destructured.data, destructured.toManyRels, model.toJSON({shallow: true}));
  });
};

module.exports = Source;
