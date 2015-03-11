const _ = require('lodash');
const configure = require('./lib/configure');
const validate = require('./lib/validate');
const process = require('./lib/process');

/**
 * Constructor for the Endpoints Controller; Provides methods for generating
 * request handling functions to connect HTTP requests to data sources. Takes
 * a single parameter, `opts.source`, contained an endpoints-wrapper around a
 * given data source.
 *
 * @constructor
 * @param {Object} opts - opts.source: A wrapper object for a data source.
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

/**
 * A function for generating CRUD(create, read, update, destroy) methods.
 *
 * @param {string} method - The name of the function to be created.
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

/**
 * A function that creates an object
 */
Controller.prototype.create = Controller.method('create');

/**
 * A function that retrieves a given object(s).
 */
Controller.prototype.read = Controller.method('read');

/**
 * A function that edits any number of existing fields on an object.
 */
Controller.prototype.update = Controller.method('update');

/**
 * A function that deletes a single object.
 */
Controller.prototype.destroy = Controller.method('destroy');

module.exports = Controller;
