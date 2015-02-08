const _ = require('lodash');
const parseOptions = require('./lib/parse_options');
const extract = require('./lib/extract');
const createResponse = require('./lib/responders/create');
const readResponse = require('./lib/responders/read');
const updateResponse = require('./lib/responders/update');
const destroyResponse = require('./lib/responders/destroy');
const lookupFailed = require('./lib/responders/lookup_failed');
const responder = require('./lib/responder');

function Controller(opts) {
  _.extend(this, parseOptions(opts));
}

Controller.prototype._filters = function (request) {
  var allowedFilters = Object.keys(this.source.filters());
  return extract({
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
  return _.uniq(result);
};

Controller.prototype.create = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var method = opts.method;
  if (!method) {
    method = opts.method = 'create';
  }

  if (typeof source.model[method] !== 'function') {
    throw new Error('Create method "' + method + '" is not present.');
  }

  return function (request, response) {
    source.create(request.body[type], opts, function (err, data) {
      var payload = createResponse(err, data, type);
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
  // allow a custom responder to receive the payload
  var respond = opts.responder || responder;
  return function (request, response, next) {
    var validRelations = relations(request).concat(opts.include || []);
    source.read({
      filters: filters(request),
      relations: validRelations
    }, function (err, data) {
      var payload = readResponse(err, data, _.extend({}, opts, {
        type: type,
        relations: validRelations
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
  if (!method) {
    method = opts.method = 'update';
  }

  if (typeof source.model.prototype[method] !== 'function') {
    throw new Error('Update method "' + method + '" is not present.');
  }

  return function (request, response) {
    source.byId(request.params.id, function (err, model) {
      if (!model) {
        return responder(lookupFailed, request, response);
      }
      return source.update(request.body[type], opts, function (err, data) {
        var payload = updateResponse(err, data, type);
        responder(payload, request, response);
      });
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
  if (!method) {
    method = opts.method = 'destroy';
  }

  if (typeof source.model.prototype[method] !== 'function') {
    throw new Error('Destroy method "' + method + '" is not present.');
  }

  return function (request, response) {
    source.byId(request.params.id, function (err, model) {
      if (!model) {
        return responder(lookupFailed, request, response);
      }
      return source.destroy(
        request.body[type],
        _.extend({model:model}, opts),
        function (err, data) {
          var payload = destroyResponse(err, data, type);
          responder(payload, request, response);
        }
      );
    });
  };
};

module.exports = Controller;
