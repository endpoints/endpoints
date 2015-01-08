const extend = require('extend');
const mode = require('./lib/mode');
const uniq = require('./lib/uniq');
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

Request.prototype.responder = function (response, code, data, prettyPrint) {
  // cheap heuristics to detect the server type
  var isExpress = !!response.send;
  var isHapi = !!response.request;
  if (!isExpress && !isHapi) {
    throw new Error('Unsupported server type!');
  }
  var contentType = 'application/json';
  if (prettyPrint) {
    data = JSON.stringify(data, null, 2);
  }
  // both of these should never happen, right?
  if (isExpress) {
    response.set('content-type', contentType).status(code).send(data);
  }
  if (isHapi) {
    response(data).type(contentType).code(code);
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
  var responder = this.responder;
  var getFilters = this.filters.bind(this);
  var getRelations = this.relations.bind(this);
  var source = this.source;
  var include = opts.include||[];
  var passMode = !!opts.pass;
  var rawMode = opts.raw ? 'raw' : null;
  return function (request, response, next) {
    var prettyPrint = request.accepts('html');
    source.read(
      getFilters(request),
      getRelations(request).concat(include),
      rawMode||mode(request.headers.accept.split(',')),
      opts,
      function (err, data) {
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
        if (passMode) {
          response.data = data;
          response.code = code;
          next();
        } else {
          responder(response, code, data, prettyPrint);
        }
      }
    );
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

module.exports = Request;
