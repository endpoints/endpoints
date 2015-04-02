const _ = require('lodash');
const configure = require('./lib/configure');
const validate = require('./lib/validate');
const process = require('./lib/process');

/**
  Provides methods for generating request handling functions that can
  be used by any node http server.
*/
class Controller {

  /**
    The constructor.

    @constructs Controller
    @param {Object} opts - opts.adapter: An endpoints source adapter
  */
  constructor (opts={}) {
    if (!this.adapter && !opts.adapter) {
      throw new Error('No adapter specified.');
    }
    if (!this.model && !opts.model) {
      throw new Error('No model specified.');
    }
    _.extend(this, opts);
    this._adapter = new this.adapter({
      model: this.model
    });
  }

  get capabilities() {
    // TODO: include information about client-generated ids and other stuff?
    return {
      filters: this._adapter.filters(),
      includes: this._adapter.relations()
    };
  }

  /**
    Used for generating CRUD (create, read, update, destroy) methods.

    @param {String} method - The name of the function to be created.
    @returns {Function} - function (req, res) { } (node http compatible request handler)
  */
  static method (method) {
    return function (opts) {
      var config = configure(method, opts);
      var validationFailures = validate(method, this._adapter, config);
      if (validationFailures.length) {
        throw new Error(validationFailures.join('\n'));
      }
      return process(config, this._adapter);
    };
  }

  static extend (props={}) {
    class Controller extends this {}
    for (var prop in props) {
      Controller.prototype[prop] = props[prop];
    }
    return Controller;
  }

}

/**
  Returns a request handling function customized to handle create requests.
*/
Controller.prototype.create = Controller.method('create');

/**
  Returns a request handling function customized to handle read requests.
*/
Controller.prototype.read = Controller.method('read');

/**
  Returns a request handling function customized to handle update requests.
*/
Controller.prototype.update = Controller.method('update');

/**
  Returns a request handling function customized to handle destroy requests.
*/
Controller.prototype.destroy = Controller.method('destroy');

module.exports = Controller;
