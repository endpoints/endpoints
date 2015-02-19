const _ = require('lodash');

const sourceHas = require('./lib/source_has');
const parseOptions = require('./lib/parse_options');
const requestHandler = require('./lib/request_handler');

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
Controller.prototype.responder = require('./lib/responder');

Controller.prototype.getParams = function (request, opts) {
  var query = request.query;
  var include = query[this.includeKey];
  var filter = query[this.filterKey];
  var fields = query[this.fieldsKey];
  var sort = query[this.sortKey];
  return {
    include: include ? include.split(',') : opts.include,
    filter: _.extend((filter ? filter : opts.filter), request.params),
    fields: fields ? fields : opts.fields,
    sort: sort ? sort.split(',') : opts.sort
  };
};

Controller.prototype._validateController = function (config) {
  var source = this.source;
  var method = config.sourceMethod;

  var validFields = source.fields();

  var validations = [
    sourceHas(source.relations(), config.include, 'relations'),
    sourceHas(source.filters(), Object.keys(config.filter), 'filters'),
    sourceHas(validFields, config.fields[config.type], 'fields'),
    sourceHas(validFields, config.sort.map(function (key) {
      return key.substring(1);
    }), 'fields for sorting'),
    // this is crap
    (method === 'read' || method === 'readRelation') ? null :
      sourceHas(
        method === 'create' ? source.model : source.model.prototype,
        config.method,
        'method'
      )
  ];
  return _.compose(_.flatten, _.compact)(validations);
};

Controller.prototype._configureController = function (method, opts) {
  var defaults = {
    sourceMethod: method,
    method: opts && opts.method ? opts.method : method,
    payload: payloads[method],
    responder: this.responder,
    controller: this['_' + method].bind(this),
    type: this.source.typeName(),
    include: [],
    filter: {},
    fields: {},
    sort: []
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
  var source = this.source;
  var data = request.body.data;
  if (data && data.id) {
    return source.byId(data.id).then(function (model) {
      if (model) {
        var err = new Error('Model with this ID already exists');
        err.httpStatus = 409;
        err.title = 'Conflict';
        throw err;
      }
    }).then(function() {
      return source.create(opts.method, request.body.data);
    });
  } else {
    return source.create(opts.method, request.body.data);
  }
};

Controller.prototype._read = function(opts, request) {
  return this.source.read(this.getParams(request, opts));
};

// this will need to get smarter--it should chain up to just use read.
Controller.prototype._readRelation = function(opts, request) {
  var source = this.source;
  var relation = request.params ? request.params.relation : null;
  return source.byId(request.params.id, relation).then(function (model) {
    return model.related(relation);
  }).catch(function() {
    var err = new Error('Unable to locate model.');
    err.httpStatus = 404;
    err.title = 'Not found';
    throw err;
  });
};

Controller.prototype._update =
Controller.prototype._destroy = function(opts, request) {
  var source = this.source;
  var method = opts.method;
  var sourceMethod = opts.sourceMethod;
  return source.byId(request.params.id).then(function (model) {
    return source[sourceMethod](model, method, request.body.data);
  }).catch(function() {
    var err = new Error('Unable to locate model.');
    err.httpStatus = 404;
    err.title = 'Not found';
    throw err;
  });
};

module.exports = Controller;
