const extend = require('extend');

const parseOptions = require('./lib/parse_options');
const extract = require('./lib/extract');

function Request(opts) {
  extend(this, parseOptions(opts));
}

Request.prototype.filters = function (request) {
  return extract({
    context: request,
    contextKeysToSearch: this.requestKeysToSearch,
    // named params in the route are automatically included with the
    // user-supplied list of valid params. given a route /resource/:id
    // the param 'id' will be considered valid even if it isn't listed
    // in the paramsForfilters property.
    find: this.allowedFilters.concat(Object.keys(request.params)),
    normalizer: this.paramNormalizer
  });
};

Request.prototype.relations = function (request) {
  var result = [];
  var requestedRelations = extract({
    context: request,
    contextKeysToSearch: this.requestKeysToSearch,
    find: this.relationKey,
    normalizer: this.paramNormalizer
  });
  var allowedRelations = this.allowedRelations;
  if (requestedRelations) {
    if (!Array.isArray(requestedRelations)) {
      requestedRelations = [requestedRelations];
    }
    result = requestedRelations.filter(function (relation) {
      return allowedRelations.indexOf(relation) !== -1;
    });
  }
  return result;
};


Request.prototype.responder = function (response, code, data) {
  // cheap heuristics to detect the server type
  var isExpress = !!response.send;
  var isHapi = !!response.request;
  if (!isExpress && !isHapi) {
    throw new Error('Unsupported server type!');
  }

  var prettyPrint = JSON.stringify(data, null, 2);
  var contentType = 'application/json';

  // both of these should never happen, right?
  if (isExpress) {
    response.set('content-type', contentType).status(code).send(prettyPrint);
  }
  if (isHapi) {
    response(prettyPrint).type(contentType).code(code);
  }
};

Request.prototype.create = function (opts) {
  if (!opts) {
    opts = {};
  }
  var method = opts.method || 'create';
  var responder = this.responder;
  var source = this.source;

  return function (request, response) {
    source.create(method, request.body, function (err, data) {
      var code = 201;
      if (err) {
        code = 422;
        data = {
          errors: {
            title: 'Unprocessable Entity',
            detail: err.message
          }
        };
      }
      responder(response, code, data);
    });
  };
};

Request.prototype.read = function (opts) {
  if (!opts) {
    opts = {};
  }
  var format = this.format.bind(this);
  var responder = this.responder;
  var getFilters = this.filters.bind(this);
  var getRelations = this.relations.bind(this);
  var source = this.source;
  var include = opts.include||[];
  return function (request, response) {
    var filters = getFilters(request);
    var relations = getRelations(request).concat(include);
    source.read(filters, relations, opts, function (err, data) {
      var code = 200;
      if (err) {
        code = 400;
        data = {
          errors: {
            title: 'Bad Request',
            detail: err.message
          }
        };
      }
      responder(response, code, format(data));
    });
  };
};


Request.prototype.update = function (opts) {
  if (!opts) {
    opts = {};
  }
  var responder = this.responder;
  var source = this.source;

  return function (request, response) {
    source.byId(request.param('id'), function (err, model) {
      if (!model) {
        responder(response, 500, {
          title: 'Internal Server Error',
          detail: 'No resource by that id found.'
        });
      } else {
        source.update(model, request.body, function (err, data) {
          var code = 200;
          if (err) {
            code = 422;
            data = {
              title: 'Unprocessable Entity',
              detail: err.message
            };
          }
          responder(response, code, data);
        });
      }
    });
  };
};

Request.prototype.destroy = function (opts) {
  if (!opts) {
    opts = {};
  }
  var responder = this.responder;
  var source = this.source;

  return function (request, response) {
    source.byId(request.param('id'), function (err, model) {
      if (!model) {
        responder(response, 500, {
          title: 'Internal Server Error',
          detail: 'No resource by that id found.'
        });
      } else {
        source.destroy(model, function (err, data) {
          var code = 200;
          if (err) {
            code = 422;
            data = {
              title: 'Unprocessable Entity',
              detail: err.message
            };
          }
          responder(response, code, data);
        });
      }
    });
  };
};

Request.prototype.format = function (data) {
  var primaryResourceName = this.source.resourceName();
  var primaryResource = data[primaryResourceName];
  var output = {
    linked: data
  };
  output[primaryResourceName] = primaryResource;
  delete data[primaryResourceName];
  return output;
};


module.exports = Request;
