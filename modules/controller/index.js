const _ = require('lodash');

const parseOptions = require('./lib/parse_options');
const extract = require('./lib/extract');

const payloads = {
  create: require('./lib/responders/create'),
  read: require('./lib/responders/read'),
  readRelation: require('./lib/responders/read'),
  update: require('./lib/responders/update'),
  destroy: require('./lib/responders/destroy'),
  lookupFailed: require('./lib/responders/lookup_failed')
};
const sourceHas = require('./lib/source_has');
const contentType = require('./lib/content_type');

function Controller(opts) {
  _.extend(this, parseOptions(opts));
}

Controller.prototype._configureMethod = function (method, opts) {
  var source = this.source;
  var requestHandler = this._buildRequestHandler.bind(this);
  var optsOrDefault = this._optsOrDefault.bind(this);

  opts = optsOrDefault(opts, method);

  var validate = _.compose(_.flatten, _.compact)([
    sourceHas(source.relations(), opts.include, 'relations'),
    sourceHas(source.filters(), Object.keys(opts.filters), 'filters'),
    sourceHas(
      method === 'create' ? source.model : source.model.prototype,
      opts.method,
      'method'
    )
  ]);

  if (validate.length) {
    throw new Error(validate.join('\n'));
  }

  return requestHandler(opts);
};

Controller.prototype._optsOrDefault = function(opts, method) {
  var source = this.source;
  return _.defaults({}, opts, {
    include: [],
    filters: {},
    type: source.typeName(),
    modelMethod: opts && opts.method ? opts.method : method,
    controllerMethod: method
  });
};

Controller.prototype._buildRequestHandler = function(opts) {
  var responder = opts.responder || this.responder;
  var method = opts.controllerMethod;

  var payload = payloads[method];
  var handle = this['_' + method + 'Handler'].bind(this);

  return function(request, response, next) {
    var err = contentType(request, response);

    if (err) {
      return responder(payload(err), request, response);
    }

    handle(opts, request, response, next);
  };
};

Controller.prototype._createHandler = function(opts, request, response, next) {
  var dataFromSource = this._dataFromSource.bind(this);
  dataFromSource(request.body.data, opts, payloads.create, request, response, next);
};

Controller.prototype._readHandler = function(opts, request, response, next) {
  var dataFromSource = this._dataFromSource.bind(this);
  var allowedFilters = this._filters.bind(this);
  var allowedRelations = this._relations.bind(this);
  var qsIncludes = allowedRelations(request);
  // Assign valid relations and filters
  opts.relations = qsIncludes.length ? qsIncludes : opts.include;
  opts.filters = _.extend({}, opts.filters, allowedFilters(request));
  dataFromSource(null, opts, payloads.read, request, response, next);
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
  return _.intersection(this.source.relations(), _.uniq(result));
};

Controller.prototype._readRelationHandler =
  function(opts, request, response, next) {
    var source = this.source;
    var relation = request.params ? request.params.relation : null;
    var responder = opts.responder || this.responder;
    var payload = payloads.read;

    source.byId(request.params.id, relation).then(function (model) {
      var related = model && model.related(relation);
      var isSingle = related && related.relatedData.type === 'belongsTo';

      if (isSingle) {
        related = [related];
      }

      opts.one = isSingle;
      opts.type = related.relatedData.target.typeName;

      responder(payload(null, related, opts), request, response, next);
    }).catch(function(err) {
      responder(payload(err, null, opts), request, response, next);
    }
  );
};

Controller.prototype._destroyHandler =
Controller.prototype._updateHandler = function(opts, request, response, next) {
  var source = this.source;
  var dataFromSource = this._dataFromSource.bind(this);
  var relation = request.params ? request.params.relation : null;
  var responder = opts.responder || this.responder;
  var payload = payloads[opts.controllerMethod];

  source.byId(request.params.id, relation).then(function (model) {
    if (!model) {
      return responder(payloads.lookupFailed, request, response, next);
    }
    opts = _.extend({model:model}, opts);
    return dataFromSource(request.body.data, opts, payload, request, response, next);
  }).catch(function(err) {
    return responder(payloads.lookupFailed, request, response, next);
  });
};

Controller.prototype._dataFromSource =
  function(params, opts, polyResponse, request, response, next) {
    var source = this.source;
    var responder = opts.responder || this.responder;
    var payload;

    source[opts.controllerMethod](params, opts).then(function(data) {
      payload = polyResponse(null, data, opts);
    }).catch(function(err) {
      payload = polyResponse(err, null, opts);
    }).finally(function() {
      responder(payload, request, response, next);
    }
  );
};

Controller.prototype.responder = require('./lib/responder');

Controller.prototype.create = function (opts) {
  return this._configureMethod('create', opts);
};

Controller.prototype.read = function (opts) {
  return this._configureMethod('read', opts);
};

Controller.prototype.readRelation = function (opts) {
  return this._configureMethod('readRelation', opts);
};

Controller.prototype.update = function (opts) {
  return this._configureMethod('update', opts);
};

Controller.prototype.destroy = function (opts) {
  return this._configureMethod('destroy', opts);
};

module.exports = Controller;
