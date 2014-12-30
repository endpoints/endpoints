const extend = require('extend');

const parseOptions = require('./lib/parse_options');

function Express(opts) {
  extend(this, parseOptions(opts));
}

Express.prototype.request = function (type, method) {
  var source = this.source;
  
  return function (request, response) {
    source[type](method, request.body, function (err, result) {
      var code = 201;
      if (err) {
        code = 422;
        result = {
          errors: {
            title: 'Unprocessable Entity',
            detail: err.message
          }
        };
      }
      response.set('content-type','application/json');
      response.status(code).send(result);
    });
  };
};

Express.prototype.create = function (usingMethod) {
  return this.request('create', usingMethod);
};

Express.prototype.read = function () {
  var responder = this.responder;
  var receiver = this.receiver;
  var source = this.source;
  return function (request, response) {
    var filters = receiver.filters(request);
    var relations = receiver.relations(request);
    source.read(filters, relations, function (err, result) {
      var code = 200;
      if (err) {
        code = 400;
        result = {
          errors: {
            detail: err.message,
            title: 'Bad Request'
          }
        };
      }
      responder(response, code, result);
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
module.exports = Express;
