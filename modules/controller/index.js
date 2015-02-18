const _ = require('lodash');

const parseOptions = require('./lib/parse_options');
const extract = require('./lib/extract');

const createResponse = require('./lib/responders/create');
const readResponse = require('./lib/responders/read');
const updateResponse = require('./lib/responders/update');
const destroyResponse = require('./lib/responders/destroy');
const lookupFailedResponse = require('./lib/responders/lookup_failed');

const filterInitValidator = require('./lib/validators/init/filters');
const relationsInitValidator = require('./lib/validators/init/relations');
const modelMethodInitValidator = require('./lib/validators/init/model_method');
const relationExistsReqValidator = require('./lib/validators/request/relation_exists');
const contentTypeReqValidator = require('./lib/validators/request/content_type');

function Controller(opts) {
  _.extend(this, parseOptions(opts));
}

Controller.prototype._configureMethod = function (method, opts) {
  var requestHandler = this._buildRequestHandler.bind(this);
  var validateInit = this._validateInit.bind(this);
  var optsOrDefault = this._optsOrDefault.bind(this);

  opts = optsOrDefault(opts, method);

  validateInit(opts);

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

Controller.prototype._validateInit = function(opts) {
  var source = this.source;

  filterInitValidator(opts, source);
  relationsInitValidator(opts, source);
  modelMethodInitValidator(opts, source);
};

Controller.prototype._buildRequestHandler = function(opts) {
  var source = this.source;
  var responder = opts.responder || this.responder;
  var method = opts.controllerMethod;

  var validateRequest = this._lookupValidateRequest(method);
  var polyResponse = this._lookupPolyResponse(method);
  var handle = this._lookupHandler(method).bind(this);

  return function(request, response, next) {
    var err = validateRequest(request, response, source);

    if (err) {
      return responder(polyResponse(err), request, response);
    }

    handle(opts, request, response, next);
  };
};

Controller.prototype._lookupValidateRequest = function(method) {
  switch (method) {
    case 'readRelation':
      return relationExistsReqValidator;
    case 'create':
    case 'update':
      return contentTypeReqValidator;
    default:
      return function() {};
  }
};

Controller.prototype._lookupPolyResponse = function(method) {
  switch (method) {
    case 'read':
    case 'readRelation':
      return readResponse;
    case 'create':
      return createResponse;
    case 'update':
      return updateResponse;
    case 'destroy':
      return destroyResponse;
    case 'lookupFailed':
      return lookupFailedResponse;
    default:
      return readResponse;
  }
};

Controller.prototype._lookupHandler = function(method) {
  switch (method) {
    case 'create':
      return this._createHandler;
    case 'read':
      return this._readHandler;
    case 'readRelation':
      return this._readRelatedHandler;
    case 'update':
      return this._updateHandler;
    case 'destroy':
      return this._destroyHandler;
    default:
      return this._readHandler;
  }
};

Controller.prototype._createHandler = function(opts, request, response, next) {
  var dataFromSource = this._dataFromSource.bind(this);
  dataFromSource(request.body.data, opts, createResponse, request, response, next);
};

Controller.prototype._readHandler = function(opts, request, response, next) {
  var dataFromSource = this._dataFromSource.bind(this);
  var allowedFilters = this._filters.bind(this);
  var allowedRelations = this._relations.bind(this);
  var qsIncludes = allowedRelations(request);
  // Assign valid relations and filters
  opts.relations = qsIncludes.length ? qsIncludes : opts.include;
  opts.filters = _.extend({}, opts.filters, allowedFilters(request));
  dataFromSource(null, opts, readResponse, request, response, next);
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

Controller.prototype._readRelatedHandler =
  function(opts, request, response, next) {
    var source = this.source;
    var relation = request.params ? request.params.relation : null;
    var responder = opts.responder || this.responder;


    source.byId(request.params.id, relation).then(function (model) {
      var related = model && model.related(relation);
      var isSingle = related && related.relatedData.type === 'belongsTo';

      if (isSingle) {
        related = [related];
      }

      opts.one = isSingle;
      opts.type = related.relatedData.target.typeName;

      var payload = readResponse(null, related, opts);
      responder(payload, request, response, next);
    }).catch(function(err) {
      var payload = readResponse(err, null, opts);
      responder(payload, request, response, next);
    }
  );
};

Controller.prototype._destroyHandler =
Controller.prototype._updateHandler = function(opts, request, response, next) {
  var source = this.source;
  var dataFromSource = this._dataFromSource.bind(this);
  var relation = request.params ? request.params.relation : null;
  var responder = opts.responder || this.responder;
  var polyResponse = opts.controllerMethod === 'update' ? updateResponse : destroyResponse;

  source.byId(request.params.id, relation).then(function (model) {
    if (!model) {
      return responder(lookupFailedResponse, request, response, next);
    }
    opts = _.extend({model:model}, opts);
    return dataFromSource(request.body.data, opts, polyResponse, request, response, next);
  }).catch(function(err) {
    return responder(lookupFailedResponse, request, response, next);
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
