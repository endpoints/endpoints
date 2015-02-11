const baseMethods = require('./lib/base_methods');

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

Source.prototype._find = function (params, opts, cb) {
  return this.model.filter(params).fetch(opts).exec(cb);
};

Source.prototype.filters = function () {
  return this.model.filters || {};
};

Source.prototype.relations = function () {
  return this.model.relations || [];
};

Source.prototype.typeName = function () {
  return this.model.typeName;
};

Source.prototype.byId = function (id, cb) {
  return this.model.filter({id:id}).fetchOne().exec(cb);
};

Source.prototype.create = function (params, opts, cb) {
  if (!params) {
    params = {};
  }
  if (!opts) {
    opts = {};
  }
  var method = opts.method;
  if (!method) {
    throw new Error('No method specified.');
  }
  return this.model[method](params).exec(cb);
};

Source.prototype.read = function (opts, cb) {
  if (!opts) {
    opts = {};
  }
  var filters = opts.filters || {};
  var relations = opts.relations || [];
  return this._find(filters, { withRelated: relations }, cb);
};

Source.prototype.update =
Source.prototype.destroy = function (params, opts, cb) {
  if (!params) {
    params = {};
  }
  if (!opts) {
    opts = {};
  }
  var model = opts.model;
  var method = opts.method;
  if (!method) {
    throw new Error('No method specified.');
  }
  return model[method](params).exec(cb);
};

module.exports = Source;
