const _ = require('lodash');

function Source (opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.model) {
    throw new Error('No bookshelf model specified.');
  }
  this.model = opts.model;
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


// The following two methods are absolutely atrocious.
// They format Bookshelf queries to be json-api compliant.
// Something absolutely must be upstreamed into bookshelf to
// support this, or an entirely different approach must be taken.
// I miss ruby.
function unnest (node) {
  var output = [];
  var resourceName;
  // if the node has attributes, we've hit a single model
  if (node.attributes) {
    // add it to the output
    output.push({
      resource: node.constructor.resourceName,
      data: node.attributes
    });
    // then, unnest all of it's relations
    var relations = node.relations;
    Object.keys(relations).forEach(function (relationName) {
      output.push(unnest(relations[relationName]));
    });
  } else {
    // otherwise, we have a collection of models.
    // unnest those, too.
    output.push(node.map(function (model) {
      return unnest(model);
    }));
  }
  return output;
};

Source.prototype.format = function (data) {
  // unnest all relations into a flat array of objects
  var expandFlat = _.flatten(unnest(data));
  // produce a json-api compatible response, removing
  // vast swaths of duplicate data in the process.
  return _.flatten(unnest(data)).reduce(function (result, entry) {
    var resource = result[entry.resource];
    if (!resource) {
      result[entry.resource] = resource = [];
    }
    if (!_.find(resource, {id:entry.data.id})) {
      resource.push(entry.data);
    }
    return result;
  }, {});
};

module.exports = Source;
