const CONTEXT_KEY = '__endpoints__';
const parseOptions = require('./lib/parse_options');

function Controller(opts) {
  opts = parseOptions(opts);
  this.model = opts.model;
  this.params = opts.params;
};

Controller.prototype.find = function (opts) {
  var params = opts.params;
  var model = this.model;
  return function (request, response, next) {
    var lookup = request.param.bind(request);
    var context = request[CONTEXT_KEY];
    if (!context) {
      context = request[CONTEXT_KEY] = {};
    }
    model.filter(params, lookup, function (err, query) {
      if (err) {
        throw err;
      } else {
        context.query = query;
        next();
      }
    });
  }.bind(this);
};

Controller.prototype.fetch = function (opts) {
  return function (request, response, next) {
    var context = request[CONTEXT_KEY];
    var query = context.query;
    query.fetch(opts).then(function (results) {
      context.data = results;
      next();
    }).catch(next)
  }.bind(this);
};

Controller.prototype.fetchOne = function (opts) {
  return function (request, response, next) {
    var context = request[CONTEXT_KEY];
    var query = context.query;
    query.fetchOne(opts).then(function (results) {
      context.data = results;
      next();
    }).catch(next)
  }.bind(this);
};

Controller.prototype.serialize = function (opts) {
  return function (request, response) {
    var context = request[CONTEXT_KEY];
    response.send(context.data);
  };
}

module.exports = Controller;
