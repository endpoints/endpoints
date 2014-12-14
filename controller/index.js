const store = require('./lib/store');
const parseOptions = require('./lib/parse_options');

function Controller(opts) {
  opts = parseOptions(opts);
  this.model = opts.model;
  this.params = opts.params;
};

Controller.prototype.find = function (opts) {
  if (!opts) {
    opts = {};
  }
  var params = opts.params;
  var model = this.model;

  return function (request, response, next) {
    var set = store.setter.bind(request);
    model.filter(params, request.param.bind(request), function (err, query) {
      if (err) {
        throw err;
      } else {
        set('query', query);
        next();
      }
    });
  }
};

Controller.prototype.fetch = function (opts) {
  if (!opts) {
    opts = {};
  }
  var model = this.model;
  var method = !opts.collection ? 'fetch' : 'fetchOne';

  return function (request, response, next) {
    var get = store.getter.bind(request);
    var set = store.setter.bind(request);
    model[method](get('query'), opts, function (err, result) {
      if (err) {
        throw err;
      } else {
        if (method === 'fetchOne') {
          set('model', result);
        }
        set('data', result);
        next();
      }
    });
  };
};

Controller.prototype.fetchOne = function (opts) {
  if (!opts) {
    opts = {};
  }
  opts.collection = false;
  return this.fetch(opts);
};

Controller.prototype.serialize = function (opts) {
  if (!opts) {
    opts = {};
  }
  var process = opts.process;
  
  return function (request, response) {
    var get = store.getter.bind(request);
    var data = get('data');
    if (!process) {
      response.send(data);
    } else {
      process(data, function (err, result) {
        if (!err) {
          response.send(result);
        } else {
          throw err;
        }
      });
    }
  };
};

module.exports = Controller;
