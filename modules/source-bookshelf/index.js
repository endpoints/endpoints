const _ = require('lodash');
const baseMethods = require('./lib/base_methods');

const processFilter = require('./lib/process_filter');
//const processFields = require('./lib/process_fields');
const processSort = require('./lib/process_sort');

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
  if (!model.filter) {
    baseMethods.addFilter(this);
  }
  if (!model.prototype.update) {
    baseMethods.addUpdate(this);
  }
}

Source.prototype._sanitizeData = function(data) {
  delete data.type;
  return data;
};

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

Source.prototype.relations = function () {
  return this.model.relations || [];
};

Source.prototype.fields = function () {
  return this.model.fields || [];
};

Source.prototype.typeName = function () {
  return this.model.typeName;
};

// not in love with this new method signature, it differs from the rest a lot.
Source.prototype.byId = function (id, relations) {
  relations = relations || [];
  return this.model.filter({id:id}).fetchOne({
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
  this._sanitizeData(params);
  return this.model[method](params);
};

Source.prototype.read = function (opts) {
  if (!opts) {
    opts = {};
  }
  var model = this.model;
  //var type = this.typeName();
  return this.model.collection().query(function (qb) {
    qb = processFilter(model, qb, opts.filter);
    // TODO: support filtering/sparse-fielding non-primary resources?
    // qb = processFields(model, qb, opts.fields);
    qb = processSort(model, qb, opts.sort);
  }).fetch({
    withRelated: _.intersection(this.relations(), opts.include)
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
  if (params) {
    this._sanitizeData(params);
  }
  return model[method](params);
};

module.exports = Source;
