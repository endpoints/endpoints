const _ = require('lodash');

const sourceHas = require('./lib/source_has');
const parseOptions = require('./lib/parse_options');

const payloads = {
  create: require('./lib/payloads/create'),
  read: require('./lib/payloads/read'),
  readRelation: require('./lib/payloads/read'),
  update: require('./lib/payloads/update'),
  destroy: require('./lib/payloads/destroy')
};

function Controller(opts) {
  _.extend(this, parseOptions(opts));
}

Controller.prototype._extract = require('./lib/extract');
Controller.prototype._requestHandler = require('./lib/request_handler');
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

Controller.prototype._throwIfModel = function(model) {
  if (model) {
    var err = new Error('Model with this ID already exists');
    err.httpStatus = 409;
    err.title = 'Conflict';
    throw err;
  }
};

Controller.prototype._throwIfNoModel = function(model) {
  if (!model) {
    var err = new Error('Unable to locate model.');
    err.httpStatus = 404;
    err.title = 'Not found';
    throw err;
  }

  // Bookshelf throws an error for any number of unrelated reasons.
  // json-api requires we throw specific errors for certain situations.
  if (model instanceof Error) {
    if (
      /No rows were affected/.test(model.message) ||
      /Unable to locate model/.test(model.message)
    ) {
      model.httpStatus = 404;
      model.title = 'Not found';
    } else {
      model.httpStatus = 500;
      model.title = 'Server Error';
    }
    throw model;
  }
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
    type: this.source.typeName()
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
  return this._requestHandler(config);
};

Controller.prototype.read = function (opts) {
  var config = this._configureController('read', opts);
  return this._requestHandler(config);
};

Controller.prototype.readRelation = function (opts) {
  var config = this._configureController('readRelation', opts);
  return this._requestHandler(config);
};

Controller.prototype.update = function (opts) {
  var config = this._configureController('update', opts);
  return this._requestHandler(config);
};

Controller.prototype.destroy = function (opts) {
  var config = this._configureController('destroy', opts);
  return this._requestHandler(config);
};

Controller.prototype._create = function(opts, request) {
  var source = this.source;
  var data = request.body.data;
  var throwIfModel = this._throwIfModel;
  if (data && data.id) {
    return source.byId(data.id)
      .then(throwIfModel)
      .then(function() {
        return source.create(opts.method, request.body.data);
      }
    );
  } else {
    return source.create(opts.method, request.body.data);
  }
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
  var relation = request.params.relation || null;
  var throwIfNoModel = this._throwIfNoModel;
  return source.byId(request.params.id, relation).then(function (model) {
    throwIfNoModel(model);
    return model.related(relation);
  });
};

Controller.prototype._update =
Controller.prototype._destroy = function(opts, request) {
  var source = this.source;
  var method = opts.method;
  var sourceMethod = opts.sourceMethod;
  var throwIfNoModel = this._throwIfNoModel;
  return source.byId(request.params.id).then(function (model) {
    throwIfNoModel(model);
    return source[sourceMethod](model, method, request.body.data);
  }).catch(throwIfNoModel);
};

// these will be removed or simplified greatly when i add
// support for sparse fieldsets, sorting, etc

Controller.prototype._filters = function (request) {
  var allowedFilters = this.source.filters();
  var result = this._extract({
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
  var result = this._extract({
    context: request,
    contextKeysToSearch: this.requestKeysToSearch,
    find: this.relationKey,
    normalizer: this.paramNormalizer
  }) || [];
  if (!Array.isArray(result)) {
    result = [result];
  }
  return _.intersection(this.source.relations(), _.uniq(result));
};

module.exports = Controller;
