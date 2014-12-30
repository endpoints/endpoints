const extend = require('extend');

const parseOptions = require('./lib/parse_options');

function ExpressRequest(opts) {
  extend(this, parseOptions(opts));
}

ExpressRequest.prototype.responder = function (response, code, data) {
  response.set('content-type','application/json');
  response.status(code).send(JSON.stringify(data, null, 2));
};

ExpressRequest.prototype.request = function (type, method) {
  var responder = this.responder;
  var source = this.source;

  return function (request, response) {
    source[type](method, request.body, function (err, data) {
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

ExpressRequest.prototype.create = function (usingMethod) {
  return this.request('create', usingMethod);
};

ExpressRequest.prototype.read = function (opts) {
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
            detail: err.message,
            title: 'Bad Request'
          }
        };
      }
      responder(response, code, data);
    });
  };
};
/*
Express.prototype.update = function (method, model) {
  return function (request, response) {
    update(this.source, method, request.body, function (err, result) {
      var code = 200;
      if (err) {
        code = 422;
        result = {
          errors: {
            detail: err.message,
            title: 'Unprocessable Entity'
          }
        };
      }
      res.status(code).send(result);
    });
  };
};

Express.prototype.delete = function (method, model) {
  if (!method) {
    method = 'delete';
  }
  function (request, response) {
    update(this.source, method, request.body, function (err, result) {
      var code = 200;
      if (err) {
        code = 422;
        result = {
          errors: {
            detail: err.message,
            title: 'Unprocessable Entity'
          }
        };
      }
      res.status(code).send(result);
    });
  };
};
*/
module.exports = ExpressRequest;
