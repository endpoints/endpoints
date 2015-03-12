const _ = require('lodash');
const configure = require('./lib/configure');
const validate = require('./lib/validate');
const process = require('./lib/process');

/*
  Constructor for the Endpoints Controller; Provides methods for generating
  request handling functions that can be used by any node http server.

  @constructor
  @param {Object} opts - opts.source: An endpoints source adapter
*/
function Controller(opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.source) {
    throw new Error('No source specified.');
  }
  _.extend(this, opts);
}

/*
  Used for generating CRUD (create, read, update, destroy) methods.

  @param {String} method - The name of the function to be created.
  @returns {Function} - function (req, res) { } (node http compatible request handler)
*/
Controller.method = function (method) {
  return function (opts) {
    var source = this.source;
    var config = configure(method, opts);
    var validationFailures = validate(method, source, config);
    if (validationFailures.length) {
      throw new Error(validationFailures.join('\n'));
    }
    return process(config, source);
  };
};

/*
  Returns a request handling function customized to handle create requests.
*/
Controller.prototype.create = Controller.method('create');

/*
  Returns a request handling function customized to handle read requests.
*/
Controller.prototype.read = Controller.method('read');

/*
  Returns a request handling function customized to handle update requests.
*/
Controller.prototype.update = Controller.method('update');

/*
  Returns a request handling function customized to handle destroy requests.
*/
Controller.prototype.destroy = Controller.method('destroy');

module.exports = Controller;
