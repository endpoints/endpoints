const extend = require('extend');

const parseOptions = require('./lib/parse_options');

function Request(opts) {
  extend(this, parseOptions(opts));
}

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
  var responder = this.responder;
  var receiver = this.receiver;
  var source = this.source;
  return function (request, response) {
    var filters = receiver.filters(request);
    var relations = receiver.relations(request);
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
      responder(response, code, data);
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


module.exports = Request;
