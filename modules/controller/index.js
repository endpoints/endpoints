const extend = require('extend');
const uniq = require('./lib/uniq');
const parseOptions = require('./lib/parse_options');
const extract = require('./lib/extract');
const responder = require('./lib/responder');

function Controller(opts) {
  extend(this, parseOptions(opts));
}

Controller.prototype.filters = function (request) {
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
  var method = opts.method || 'create';
  var source = this.source;
  var typeName = source.typeName();

  return function (request, response) {
    var result = {};
    source.create(
      method,
      request.body[typeName],
      function (err, data) {
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
        result[typeName] = data;
        responder(response, code, result);
      }
    );
  };
};

Controller.prototype.read = function (opts) {
  if (!opts) {
    opts = {};
  }
  var getFilters = this.filters.bind(this);
  var getRelations = this.relations.bind(this);
  var source = this.source;
  return function (request, response, next) {
    var prettyPrint = request.accepts('html');
    var settings = {
      filters: getFilters(request),
      relations: getRelations(request).concat(opts.include || []),
      one: opts.one,
      mode: opts.raw ? 'raw' : 'jsonApi'
    };
    source.read(settings, function (err, data) {
      var code = 200;
      if (err) {
        code = 400;
        data = {
          errors: {
            title: 'Bad Controller',
            detail: err.message
          }
        };
      }

      if (!err && !data) {
        code = 404;
        data = {
          errors: {
            title: 'Not Found',
            detail: 'Resource not found.'
          }
        };
      }

      if (!!opts.pass) {
        response.data = data;
        response.code = code;
        next();
      } else {
        responder(response, code, data, prettyPrint);
      }
    });
  };
};

Controller.prototype.update = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var typeName = source.typeName();

  return function (request, response) {
    var result = {};
    source.byId(request.param('id'), function (err, model) {
      if (!model) {
        responder(response, 500, {
          title: 'Internal Server Error',
          detail: 'No resource by that id found.'
        });
      } else {
        source.update(
          model,
          request.body[typeName],
          function (err, data) {
            var code = 200;
            if (err) {
              code = 422;
              data = {
                title: 'Unprocessable Entity',
                detail: err.message
              };
            }
            result[typeName] = data;
            responder(response, code, result);
          }
        );
      }
    });
  };
};

Controller.prototype.destroy = function (opts) {
  if (!opts) {
    opts = {};
  }
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
          var code = 204;
          if (err) {
            code = 422;
            data = {
              title: 'Unprocessable Entity',
              detail: err.message
            };
          }
          responder(response, code, null);
        });
      }
    });
  };
};

module.exports = Controller;
