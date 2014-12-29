function Source (opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.model) {
    throw new Error('No bookshelf model specified.');
  }
  this.model = opts.model;
};

Source.prototype.name = function () {
  return this.model.prototype.tableName;
};

Source.prototype.filters = function () {
  return this.model.filters;
};

Source.prototype.relations = function () {
  return this.model.relations;
};

Source.prototype.filter = function (params) {
  if (!params) {
    params = {};
  }
  // cache model for iteration
  var model = this.model;
  var filters = this.filters();
  // open query builder for this model
  return this.model.collection().query(function (qb) {
    // iterate over all params we explicitly support in the request
    // filtering the query
    qb = Object.keys(params).reduce(function (result, key) {
      var value = params[key];
      // see if there is a finder on the model for this param
      var filter = filters[key];
      // process the query with the filter, or, if none is found, pass it along
      return filter ? filter.call(filters, qb, value, params) : qb;
    }, qb);
  });
};

Source.prototype.fetch = function (query, relations, cb) {
  query.fetch({
    withRelated: relations||[]
  }).exec(cb);
};

module.exports = Source;
