const store = require('./lib/store');
const parseOptions = require('./lib/parse_options');

function Controller(opts) {
  opts = parseOptions(opts);
  this.source = opts.source;
  this.params = opts.params;
};

Controller.prototype.parseParam = function (value) {
  if (value === 'true') {
    value = true;
  } else if (value === 'false') {
    value = false;
  } else if (value.indexOf(',') !== -1) {
    value = value.split(',');
  }
  return value;
};

Controller.prototype.find = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var parseParam = this.parseParam;
  var allowedParams = opts.params || this.params;
  
  return function (request, response, next) {
    var set = store.setter.bind(request);
    var checkParams = Object.keys(request.params).concat(allowedParams);
    var params = checkParams.reduce(function (result, key) {
      var param = request.param(key);
      if (param) {
        result[key] = parseParam(param);
      }
      return result;
    }, {});
    source.filter(params, function (err, query) {
      if (err) {
        throw err;
      } else {
        set('query', query);
        next();
      }
    });
  }.bind(this)
};

Controller.prototype.fetch = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = this.source;
  var method = !opts.collection ? 'fetch' : 'fetchOne';

  return function (request, response, next) {
    var get = store.getter.bind(request);
    var set = store.setter.bind(request);
    source[method](get('query'), opts, function (err, result) {
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
