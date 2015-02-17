const _ = require('lodash');
const parseOptions = require('./lib/parse_options');
const extract = require('./lib/extract');
const verifyContentType = require('./lib/verify_content_type');
const createResponse = require('./lib/responders/create');
const readResponse = require('./lib/responders/read');
const updateResponse = require('./lib/responders/update');
const destroyResponse = require('./lib/responders/destroy');
const lookupFailed = require('./lib/responders/lookup_failed');

function Controller(opts) {
  _.extend(this, parseOptions(opts));
}

Controller.errors = {
  '415': Object.create(Error.prototype, {
    message: {value: 'Content-Type must be "application/vnd.api+json"'},
    httpStatus: {value: 415},
    title: {value: 'Unsupported Media Type'}
  })
};

Controller.prototype._filters = function (request) {
  var allowedFilters = this.source.filters();
  var result = extract({
    context: request,
    contextKeysToSearch: this.requestKeysToSearch,
    // TODO: revisit this perhaps?
    // named params in the route are automatically included with the
    // user-supplied list of valid params. given a route /resource/:id
    // the param 'id' will be considered valid even if it isn't listed
    // on the underlying source.
    find: allowedFilters.concat(Object.keys(request.params)),
    normalizer: this.paramNormalizer
  });
  return result;
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
  return _.intersection(this.source.filters(), filters);
};

Controller.prototype.validRelations = function(relations) {
  return _.intersection(this.source.relations(), relations);
};

Controller.prototype.responder = require('./lib/responder');

Controller.prototype.create = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var method = opts.method;
  var respond = opts.responder || this.responder;
  if (!method) {
    method = opts.method = 'create';
  }

  if (typeof source.model[method] !== 'function') {
    throw new Error('Create method "' + method + '" is not present.');
  }

  return function (request, response) {
    if (!verifyContentType(request)) {
      respond(createResponse(Controller.errors['415']), request, response);
      return;
    }

    source.create(request.body.data, opts, function (err, data) {
      var payload = createResponse(err, data, _.extend({}, opts, {
        type: type
      }));
      respond(payload, request, response);
    });
  };
};

Controller.prototype.read = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var allowedFilters = this._filters.bind(this);
  var allowedRelations = this._relations.bind(this);

  var includes = opts.include || [];
  var filters = opts.filters || {};
  var respond = opts.responder || this.responder;

  var invalidRelations = _.difference(includes, source.relations());
  var invalidFilters = _.difference(Object.keys(filters), source.filters());

  if (invalidRelations.length > 0) {
    throw new Error(
      'Model does not have relation(s): ' + invalidRelations.join(', ')
    );
  }

  if (invalidFilters.length > 0) {
    throw new Error(
      'Model does not have filter(s): ' + invalidFilters.join(', ')
    );
  }

  return function (request, response, next) {
    var qsIncludes = allowedRelations(request);
    var validRels = qsIncludes.length ? qsIncludes : includes;
    var validFilters = _.extend({}, filters, allowedFilters(request));
    source.read({
      relations: validRels,
      filters: validFilters,
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

Controller.prototype.readRelation = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var relations = source.relations();
  var respond = opts.responder || this.responder;

  return function (request, response) {
    // this is a hot mess, but it works as a proof of concept
    var id = request.params.id;
    var relation = request.params.relation;
    if (relations.indexOf(relation) === -1) {
      return respond({
        code: '???',
        body: '???'
      }, request, response);
    }
    source.byId(id, relation, function (err, model) {
      var related = model && model.related(relation);
      var isSingle = related && related.relatedData.type === 'belongsTo';
      var type = related && related.relatedData.target.typeName;
      if (isSingle) {
        related = [related];
      }
      var payload = readResponse(err, related, _.extend({}, opts, {
        type: type,
        one: isSingle
      }));
      respond(payload, request, response);
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
    if (!verifyContentType(request)) {
      respond(createResponse(Controller.errors['415']), request, response);
      return;
    }

    source.byId(request.params.id, function (err, model) {
      if (!model) {
        return respond(lookupFailed, request, response);
      }
      return source.update(
        request.body.data,
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
