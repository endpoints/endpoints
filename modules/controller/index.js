const _ = require('lodash');
const parseOptions = require('./lib/parse_options');
const extract = require('./lib/extract');
const createResponse = require('./lib/responders/create');
const readResponse = require('./lib/responders/read');
const updateResponse = require('./lib/responders/update');
const destroyResponse = require('./lib/responders/destroy');
const lookupFailed = require('./lib/responders/lookup_failed');

function Controller(opts) {
  _.extend(this, parseOptions(opts));
}

Controller.prototype._isValidRelation = function(relation) {
  var allowedRelations = this.source.relations();
  return allowedRelations.indexOf(relation) !== -1;
};

Controller.prototype._filters = function (request) {
  var allowedFilters = Object.keys(this.source.filters());
  return this.validFilters(extract({
    context: request,
    contextKeysToSearch: this.requestKeysToSearch,
    // TODO: revisit this perhaps?
    // named params in the route are automatically included with the
    // user-supplied list of valid params. given a route /resource/:id
    // the param 'id' will be considered valid even if it isn't listed
    // on the underlying source.
    find: allowedFilters.concat(Object.keys(request.params)),
    normalizer: this.paramNormalizer
  }));
};

Controller.prototype._relations = function (request) {
  var result = extract({
    context: request,
    contextKeysToSearch: this.requestKeysToSearch,
    find: this.relationKey,
    normalizer: this.paramNormalizer
  }) || [];
  if (result && !Array.isArray(result)) {
    result = [result];
  }
  return this.validRelations(_.uniq(result));
};

Controller.prototype.validFilters = function (filters) {
  var allowedFilters = Object.keys(this.source.filters());
  return Object.keys(filters).reduce(function (result, filter) {
    if (allowedFilters.indexOf(filter) !== -1) {
      result[filter] = filters[filter];
    }
    return result;
  }, {});
};

Controller.prototype.validRelations = function(relations) {
  var isValidRelation = this._isValidRelation.bind(this);
  return relations.filter(isValidRelation);
};

Controller.prototype.responder = require('./lib/responder');

Controller.prototype.create = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var method = opts.method;
  var responder = opts.responder || this.responder;
  if (!method) {
    method = opts.method = 'create';
  }

  if (typeof source.model[method] !== 'function') {
    throw new Error('Create method "' + method + '" is not present.');
  }

  return function (request, response) {
    source.create(request.body[type], opts, function (err, data) {
      var payload = createResponse(err, data, _.extend({}, opts, {
        type: type
      }));
      responder(payload, request, response);
    });
  };
};

Controller.prototype.read = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var filters = this._filters.bind(this);
  var relations = this._relations.bind(this);
  var isValidRelation = this._isValidRelation.bind(this);
  var includes = opts.include || [];
  var respond = opts.responder || this.responder;

  // forEach instead of use validRelation() so that we get the exact bad actor
  includes.forEach(function(relation) {
    if (!isValidRelation(relation)) {
      throw new Error('Model does not have relation "' + relation + '."');
    }
  });

  return function (request, response, next) {
    var validRels = relations(request).concat(includes);
    source.read({
      filters: filters(request),
      relations: validRels
    }, function (err, data) {
      var payload = readResponse(err, data, _.extend({}, opts, {
        // FIXME: type is not used in readResponse
        type: type,
        relations: validRels
      }));
      respond(payload, request, response, next);
    });
  };
};

Controller.prototype.update = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var method = opts.method;
  var respond = opts.responder || this.responder;
  if (!method) {
    method = opts.method = 'update';
  }

  if (typeof source.model.prototype[method] !== 'function') {
    throw new Error('Update method "' + method + '" is not present.');
  }

  return function (request, response) {
    source.byId(request.params.id, function (err, model) {
      if (!model) {
        return respond(lookupFailed, request, response);
      }
      return source.update(
        request.body[type],
        _.extend({model:model}, opts),
        function (err, data) {
          var payload = updateResponse(err, data, _.extend({}, opts, {
            type: type
          }));
          respond(payload, request, response);
        }
      );
    });
  };
};

Controller.prototype.destroy = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var method = opts.method;
  var respond = opts.responder || this.responder;
  if (!method) {
    method = opts.method = 'destroy';
  }

  if (typeof source.model.prototype[method] !== 'function') {
    throw new Error('Destroy method "' + method + '" is not present.');
  }

  return function (request, response) {
    source.byId(request.params.id, function (err, model) {
      if (!model) {
        return respond(lookupFailed, request, response);
      }
      return source.destroy(
        request.body[type],
        _.extend({model:model}, opts),
        function (err, data) {
          var payload = destroyResponse(err, data, _.extend({}, opts, {
            type: type
          }));
          respond(payload, request, response);
        }
      );
    });
  };
};

module.exports = Controller;
