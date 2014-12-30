const _ = require('lodash');

function Source (opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.model) {
    throw new Error('No bookshelf model specified.');
  }
  this.model = opts.model;
}

Source.prototype.filters = function () {
  return this.model.filters||{};
};

Source.prototype.relations = function () {
  return this.model.relations||{};
};

Source.prototype.filter = function (params) {
  if (!params) {
    params = {};
  }
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
  }).then(function (result) {
    cb(null, this.format(result));
  }.bind(this)).catch(function (err) {
    cb(err);
  });
};

Source.prototype.format = function (data) {
  // unnest all relations into a flat array of objects
  // then produce a json-api compatible response, removing
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

Source.prototype.create = function (method, params, cb) {
  if (!method) {
    method = 'create';
  }
  if (!this.model[method]) {
    cb(new Error('No method "'+method+'" found on model.'));
  } else {
    this.model[method](params).then(function (result) {
      console.log(result);
      cb(null, result);
    }).catch(function (err) {
      cb(err);
    });
  }
};

Source.prototype.read = function (filters, relations, cb) {
  var relationMap = this.relations();
  // map with_related items in the url to the actual relation names
  // on the underlying model
  relations = relations.map(function (relation) {
    return relationMap[relation];
  });
  this.fetch(this.filter(filters), relations, cb);
};

// The following two methods are absolutely atrocious.
// They format Bookshelf queries to be json-api compliant.
// Something absolutely must be upstreamed into bookshelf to
// support this, or an entirely different approach must be taken.
// I miss ruby.
function unnest (node) {
  var output = [];
  var resource = node.attributes;
  // if the node has attributes, we've hit a single model
  if (resource) {
    // unnest all of its relations
    var relations = node.relations;
    var links = {};
    if (!_.isEmpty(relations)) {
      resource.links = links;
    }
    Object.keys(relations).forEach(function (relationName) {
      // link the relation ids to the base model
      var relation = relations[relationName];
      // if the relation has attributes, it's a hasOne
      if (relation.attributes) {
        links[relationName] = relation.get('id');
      } else {
        // otherwise it is hasMany
        links[relationName] = relation.map(function (relatedModel) {
          return relatedModel.get('id');
        });
      }
      output.push(unnest(relations[relationName]));
    });
    output.push({
      resource: node.constructor.resourceName,
      data: resource
    });
  } else {
    // otherwise, we have a collection of models.
    // unnest those, too.
    output.push(node.map(function (model) {
      return unnest(model);
    }));
  }
  return output;
}



module.exports = Source;
