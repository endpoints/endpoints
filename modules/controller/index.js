const extend = require('extend');
const uniq = require('./lib/uniq');
const parseOptions = require('./lib/parse_options');
const extract = require('./lib/extract');
const createResponse = require('./lib/responders/create');
const readResponse = require('./lib/responders/read');
const updateResponse = require('./lib/responders/update');
const destroyResponse = require('./lib/responders/destroy');

function Controller(opts) {
  extend(this, parseOptions(opts));
}

Controller.prototype.responder = require('./lib/responder');

Controller.prototype.filters = function (request) {
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

Controller.prototype.relations = function (request) {
  var result = extract({
    context: request,
    contextKeysToSearch: this.requestKeysToSearch,
    find: this.relationKey,
    normalizer: this.paramNormalizer
  }) || [];
  if (result && !Array.isArray(result)) {
    result = [result];
  }
  return uniq(result);
};

Controller.prototype.create = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var responder = this.responder;

  var method = opts.method || 'create';
  if (!source.model[method]) {
    throw new Error(
      'Create method "' + method + '" is not present on source\'s model.'
    );
  }

  return function (request, response) {
    var body = request.body[type];
    source.create(method, body, function (err, data) {
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
  var responder = this.responder;

  var mode = opts.raw ? 'raw' : 'jsonApi';
  var isSingle = !!opts.one;
  var filters = this.filters.bind(this);
  var relations = this.relations.bind(this);

  return function (request, response, next) {
    source.read({
      filters: filters(request),
      relations: relations(request).concat(opts.include || []),
      one: isSingle,
      mode: mode
    }, function (err, data) {
      var payload = readResponse(err, data, type);
      responder(payload, request, response, next);
    });
  };
};

Controller.prototype.update = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var responder = this.responder;

  return function (request, response) {
    source.byId(request.params.id, function (err, model) {
      if (!model) {
        responder({
          code: 500,
          data: {
            errors: {
              title: 'Internal Server Error',
              detail: 'No resource by that id found.'
            }
          }
        }, request, response);
      } else {
        var body = request.body[type];
        source.update(model, body, function (err, data) {
          var payload = updateResponse(err, data, type);
          responder(payload, request, response);
        });
      }
    });
  };
};

Controller.prototype.destroy = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var type = source.typeName();
  var responder = this.responder;

  return function (request, response) {
    source.byId(request.params.id, function (err, model) {
      if (!model) {
        responder({
          code: 500,
          data: {
            errors: {
              title: 'Internal Server Error',
              detail: 'No resource by that id found.'
            }
          }
        }, request, response);
      } else {
        source.destroy(model, function (err, data) {
          var payload = destroyResponse(err, data, type);
          responder(payload, request, response);
        });
      }
    });
  };
};

module.exports = Controller;
