const _ = require('lodash');

const extract = require('./lib/extract');
const sourceHas = require('./lib/source_has');
const parseOptions = require('./lib/parse_options');
const requestHandler = require('./lib/request_handler');

const payloads = {
  create: require('./lib/payloads/create'),
  read: require('./lib/payloads/read'),
  readRelation: require('./lib/payloads/read'),
  update: require('./lib/payloads/update'),
  destroy: require('./lib/payloads/destroy'),
  lookupFailed: require('./lib/payloads/lookup_failed')
};

function Controller(opts) {
  _.extend(this, parseOptions(opts));
}
Controller.prototype.responder = require('./lib/responder');

Controller.prototype._validateController = function (config) {
  var source = this.source;
  var method = config.sourceMethod;
  return _.compose(_.flatten, _.compact)([
    sourceHas(source.relations(), config.include, 'relations'),
    sourceHas(source.filters(), Object.keys(config.filters), 'filters'),
    // this is crap
    (method === 'read' || method === 'readRelation') ? null :
      sourceHas(
        method === 'create' ? source.model : source.model.prototype,
        config.method,
        'method'
      )
  ]);
};

Controller.prototype._configureController = function (method, opts) {
  var defaults = {
    sourceMethod: method,
    method: opts && opts.method ? opts.method : method,
    payload: payloads[method],
    responder: this.responder,
    controller: this['_' + method].bind(this),
    include: [],
    filters: {},
    type: this.source.typeName(),
  };
  var config = _.defaults({}, opts, defaults);
  var validationFailures = this._validateController(config);
  if (validationFailures.length) {
    throw new Error(validationFailures.join('\n'));
  }
  return config;
};

Controller.prototype.create = function (opts) {
  var config = this._configureController('create', opts);
  return requestHandler(config);
};

Controller.prototype.read = function (opts) {
  var config = this._configureController('read', opts);
  return requestHandler(config);
};

Controller.prototype.readRelation = function (opts) {
  var config = this._configureController('readRelation', opts);
  return requestHandler(config);
};

Controller.prototype.update = function (opts) {
  var config = this._configureController('update', opts);
  return requestHandler(config);
};

Controller.prototype.destroy = function (opts) {
  var config = this._configureController('destroy', opts);
  return requestHandler(config);
};

Controller.prototype._create = function(opts, request) {
  return this.source.create(opts.method, request.body.data);
};

Controller.prototype._read = function(opts, request) {
  var includes = this._includes(request);
  var filters = this._filters(request);
  return this.source.read({
    relations: includes.length ? includes : opts.include,
    filters: Object.keys(filters).length ? filters : opts.filters
  });
};

Controller.prototype._readRelation = function(opts, request) {
  var source = this.source;
  var relation = request.params ? request.params.relation : null;
  return source.byId(request.params.id, relation).then(function (model) {
    if (!model) {
      // this isn't going to cause a 404 correctly
      throw new Error('Unable to locate model.');
    }
    return model.related(relation);
  });
};

Controller.prototype._update =
Controller.prototype._destroy = function(opts, request) {
  var source = this.source;
  var method = opts.method;
  var sourceMethod = opts.sourceMethod;
  return source.byId(request.params.id).then(function (model) {
    if (!model) {
      // this isn't going to cause a 404 correctly
      throw new Error('Unable to locate model.');
    }
    return source[sourceMethod](model, method, request.body.data);
  });
};

// these will be removed or simplified greatly when i add
// support for sparse fieldsets, sorting, etc

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

Controller.prototype._includes = function (request) {
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

module.exports = Controller;
