const _ = require('lodash');

function Source (opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.model) {
    throw new Error('No bookshelf model specified.');
  }
  this.model = opts.model;
  this.idField = opts.idField || 'id';
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
  query.fetch({withRelated: relations||[]}).exec(cb);
};

Source.prototype.byId = function(id, cb) {
  var query = {};
  query[this.idField] = id;
  return this.model.forge(query).fetch().exec(cb);
};

Source.prototype.format = function (data, opts) {
  if (!opts) {
    opts = {};
  }
  var primaryResource;

  // check to see if we are getting a single result.
  var singleResult = (data.length === 1 && opts.one);

  // if we are requesting a single item, we only need the first model
  if (singleResult) {
    data = data.first();
    primaryResource = data.constructor.resourceName;
  }

  // unnest all relations into a flat array of objects
  // then produce a json-api compatible response, removing
  // vast swaths of duplicate data in the process.
  var unnestedData = _.flatten(unnest(data)).reduce(function (result, entry) {
    var resource = result[entry.resource];
    if (!resource) {
      result[entry.resource] = resource = [];
    }
    if (!_.find(resource, {id:entry.data.id})) {
      resource.push(entry.data);
    }
    return result;
  }, {});

  // if we are requesting a single item, ensure the primary resource
  // we selected is in singular form.
  if (singleResult) {
    unnestedData[primaryResource] = unnestedData[primaryResource][0];
  }
  return unnestedData;
};

Source.prototype.create = function (method, params, cb) {
  if (!method) {
    method = 'create';
  }
  if (!this.model[method]) {
    cb(new Error('No method "'+method+'" found on model.'));
  } else {
    this.model[method](params).then(function (result) {
      cb(null, result);
    }).catch(function (err) {
      cb(err);
    });
  }
};

Source.prototype.read = function (filters, relations, opts, cb) {
  var relationMap = this.relations();
  // map with_related items in the url to the actual relation names
  // on the underlying model
  relations = relations.map(function (relation) {
    return relationMap[relation];
  });
  this.fetch(this.filter(filters), relations, function (err, data) {
    if (err) {
      cb(err);
    } else {
      cb(null, this.format(data, opts));
    }
  }.bind(this));
};

Source.prototype.update = function (model, params, cb) {
  return model.save(params, {patch:true}).exec(cb);
};

Source.prototype.destroy = function (model, cb) {
  return model.destroy().exec(cb);
};

// The following method is absolutely atrocious.
// This formats Bookshelf queries to be json-api compliant.
// Something absolutely must be upstreamed to support this,
// or an entirely different approach must be taken.
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
